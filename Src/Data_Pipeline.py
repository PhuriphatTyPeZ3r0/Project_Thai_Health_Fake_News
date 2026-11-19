"""Data Pipeline Module (P1: ชลธร หรั่งศิริ @chonlatorn230)

D1: โหลดและตรวจสอบชุดข้อมูล LimeSoda (Fact/Fake/Undefined)
D2: ทำความสะอาดข้อความ, ลบข้อความซ้ำ (ตรงตัว + เกือบซ้ำ), Stratified Split 80/10/10 (seed=42)

Output: Data/Processed/{train,val,test}.csv  คอลัมน์ text, label (0 = fact, 1 = fake)
        Data/Processed/Data_Report.md + data_report.json  สรุปจำนวนแต่ละขั้น

รัน:  python -m Src.Data_Pipeline                 (ดาวน์โหลดจาก GitHub ของ LimeSoda)
      python -m Src.Data_Pipeline --raw <ไฟล์>    (ใช้ไฟล์ .jsonl/.csv ในเครื่อง)
"""

import argparse
import html
import json
import re
import unicodedata
import urllib.request
import zlib
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split

# ---------------------------------------------------------------- ค่าคงที่
DATA_RAW_DIR = Path("Data/Raw")
DATA_PROCESSED_DIR = Path("Data/Processed")

# SEACrowd/limesoda บน Hugging Face เป็น loading script ซึ่ง datasets >= 4 เลิกรองรับแล้ว
# จึงดึงไฟล์ต้นฉบับเดียวกับที่ script ของ SEACrowd ใช้ (repo ของผู้สร้าง dataset) โดยตรง
LIMESODA_URL = "https://raw.githubusercontent.com/byinth/LimeSoda/main/LimeSoda/Limesoda.jsonl"
RAW_FILE = DATA_RAW_DIR / "Limesoda.jsonl"

LABEL_MAP = {"Fact News": 0, "Fake News": 1}   # "Undefined" ถูกตัดทิ้ง
SEED = 42
RATIOS = (0.8, 0.1, 0.1)
MIN_CHARS = 20               # ข้อความสั้นกว่านี้หลังคลีนถือว่าไม่มีเนื้อหา
NEAR_DUP_JACCARD = 0.8       # ความคล้าย (char 5-gram) ที่ถือว่าเป็นข่าวเดียวกัน
MINHASH_PERM, MINHASH_BANDS = 64, 16

# C1 control ที่จริงๆ คือเครื่องหมายคำพูดของ cp1252 ที่ถูก decode ผิด
CP1252_FIX = {"\x91": "'", "\x92": "'", "\x93": '"', "\x94": '"', "\x95": "•", "\x96": "-", "\x97": "-"}
_SPACE_RE = re.compile(r"[ \t\r\f\v 　]+")
_NEWLINES_RE = re.compile(r"\s*\n\s*")
_KEY_RE = re.compile(r"[\W_]+")


# ---------------------------------------------------------------- D1: โหลดข้อมูล
def _needs_space(left: str, right: str) -> bool:
    """ไทยต่อไทย/เครื่องหมาย = ติดกัน, มีอังกฤษหรือตัวเลขอยู่ข้างใดข้างหนึ่ง = เว้นวรรค (Ground Coffee, วันที่ 17)"""
    a, b = left[-1], right[0]
    # สระบน/ล่าง + วรรณยุกต์ไทย (หมวด M) นับเป็นตัวอักษร เช่น "วันที่" ลงท้ายด้วย ่
    word = lambda ch: ch.isalnum() or unicodedata.category(ch).startswith("M")
    return (a.isascii() and a.isalnum() and word(b)) or (b.isascii() and b.isalnum() and word(a))


def _join_tokens(tokens: Optional[List[str]]) -> str:
    """LimeSoda เก็บข้อความเป็น list ของ token โดย token ว่าง '' แทนช่องว่างเดิม
    แต่ ~83% ของเอกสารไม่มี '' เลย (ช่องว่างเดิมหายไปตั้งแต่ต้นทาง) จึงเติมช่องว่างระหว่างภาษาให้"""
    if not tokens:
        return ""
    out = ""
    for t in tokens:
        if not t:
            out += " "
        elif out and not out[-1].isspace() and _needs_space(out, t):
            out += " " + t
        else:
            out += t
    return out


def download_limesoda(dest: Path = RAW_FILE) -> Path:
    if not dest.exists():
        dest.parent.mkdir(parents=True, exist_ok=True)
        print(f"[Data Pipeline] Downloading LimeSoda -> {dest}")
        urllib.request.urlretrieve(LIMESODA_URL, dest)
    return dest


def load_raw_dataset(raw_path: Optional[Path] = None) -> pd.DataFrame:
    """คืน DataFrame คอลัมน์ text, tag (Fact News / Fake News / Undefined)

    .jsonl = รูปแบบต้นฉบับ LimeSoda (Title/Detail/Document Tag)
    .csv   = fallback ที่มีคอลัมน์ text + label หรือ tag อยู่แล้ว (เช่น Zenodo ที่แปลงมาแล้ว)
    """
    path = Path(raw_path) if raw_path else download_limesoda()
    if path.suffix == ".csv":
        df = pd.read_csv(path)
        if "tag" not in df.columns:
            df["tag"] = df["label"].map({0: "Fact News", 1: "Fake News"})
        return df[["text", "tag"]]

    rows = []
    with open(path, encoding="utf-8") as f:
        for line in f:
            r = json.loads(line)
            # ข่าวส่วนใหญ่มีหัวข้อ (Title) แยกจากเนื้อหา (Detail) -> รวมเป็นข้อความเดียว
            text = f"{_join_tokens(r.get('Title'))}\n{_join_tokens(r.get('Detail'))}"
            rows.append({"text": text, "tag": r["Document Tag"]})
    df = pd.DataFrame(rows)
    print(f"[Data Pipeline] Loaded {len(df)} docs from {path}: {df['tag'].value_counts().to_dict()}")
    return df


def validate_raw(df: pd.DataFrame) -> None:
    """ตรวจ schema ก่อนประมวลผล ถ้าผิดให้หยุดเลย ดีกว่าได้ไฟล์เพี้ยนส่งต่อให้ P2/P3"""
    missing = {"text", "tag"} - set(df.columns)
    if missing:
        raise ValueError(f"raw data missing columns: {missing}")
    unknown = set(df["tag"].dropna()) - set(LABEL_MAP) - {"Undefined"}
    if unknown:
        raise ValueError(f"unknown Document Tag values: {unknown}")
    if not (df["tag"].isin(list(LABEL_MAP))).any():
        raise ValueError("no Fact/Fake documents found")


# ---------------------------------------------------------------- D2: คลีนข้อความ
def normalize_text(text: str) -> str:
    """ตัดช่องว่างเกิน + อักขระแปลกปลอม (zero-width, soft hyphen, control, private-use, �)"""
    from pythainlp.util import normalize as thai_normalize

    text = html.unescape(str(text))
    text = "".join(CP1252_FIX.get(ch, ch) for ch in text)
    text = unicodedata.normalize("NFC", text)
    out = []
    for ch in text:
        cat = unicodedata.category(ch)
        if ch in "\n\t":
            out.append(ch)
        elif cat in ("Cf", "Co", "Cn") or ch == "�":
            continue                      # มองไม่เห็น / ไม่มีความหมาย -> ทิ้ง
        elif cat == "Cc":
            out.append(" ")
        else:
            out.append(ch)
    text = thai_normalize("".join(out))   # สระ/วรรณยุกต์ซ้อน เช่น "ก่่" -> "ก่"
    text = _SPACE_RE.sub(" ", text)
    text = _NEWLINES_RE.sub("\n", text)
    return text.strip()


def dedup_key(text: str) -> str:
    """key สำหรับหาซ้ำ: ตัวเล็ก + ตัดเว้นวรรค/เครื่องหมายทั้งหมด"""
    return _KEY_RE.sub("", text.lower())


def _shingles(key: str, k: int = 5) -> set:
    return {key[i:i + k] for i in range(max(1, len(key) - k + 1))}


def _near_dup_groups(keys: List[str], threshold: float, seed: int) -> List[int]:
    """MinHash LSH หาคู่ที่คล้ายกัน แล้วยืนยันด้วย Jaccard จริง -> คืน group id ของแต่ละแถว (union-find)"""
    rng = np.random.default_rng(seed)
    prime = (1 << 61) - 1
    a = rng.integers(1, prime, MINHASH_PERM, dtype=np.uint64)
    b = rng.integers(0, prime, MINHASH_PERM, dtype=np.uint64)
    sh = [_shingles(k) for k in keys]
    sigs = np.empty((len(keys), MINHASH_PERM), dtype=np.uint64)
    for i, s in enumerate(sh):
        # crc32 ให้ค่าเดิมทุกครั้ง (hash() ของ Python สุ่มต่อ process ทำให้ผลไม่ reproducible)
        h = np.fromiter((zlib.crc32(x.encode("utf-8")) for x in s), dtype=np.uint64, count=len(s))
        sigs[i] = ((np.outer(h, a) + b) % prime).min(axis=0)

    parent = list(range(len(keys)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    rows = MINHASH_PERM // MINHASH_BANDS
    checked = set()
    for band in range(MINHASH_BANDS):
        buckets: Dict[bytes, List[int]] = {}
        for i in range(len(keys)):
            buckets.setdefault(sigs[i, band * rows:(band + 1) * rows].tobytes(), []).append(i)
        for members in buckets.values():
            for x in range(len(members)):
                for y in range(x + 1, len(members)):
                    p, q = members[x], members[y]
                    if (p, q) in checked:
                        continue
                    checked.add((p, q))
                    if len(sh[p] & sh[q]) / len(sh[p] | sh[q]) >= threshold:
                        parent[find(p)] = find(q)
    return [find(i) for i in range(len(keys))]


def clean_text(df: pd.DataFrame, report: Optional[dict] = None) -> pd.DataFrame:
    """คลีน + ลบซ้ำ คืน DataFrame คอลัมน์ text, label

    ลำดับ: ตัด Undefined -> normalize -> ตัดข้อความสั้น -> ลบซ้ำตรงตัว -> ลบซ้ำเกือบตรงตัว
    ถ้าข้อความเดียวกันมี label ขัดกัน (fact และ fake) จะทิ้งทั้งกลุ่ม เพราะไม่รู้ว่าอันไหนถูก
    """
    report = report if report is not None else {}
    df = df.copy()
    if "tag" in df.columns:
        report["raw_total"] = len(df)
        report["raw_tags"] = df["tag"].value_counts().to_dict()
        df = df[df["tag"].isin(list(LABEL_MAP))]
        df["label"] = df["tag"].map(LABEL_MAP)
    df = df.dropna(subset=["text", "label"])
    df["label"] = df["label"].astype(int)
    df = df[df["label"].isin([0, 1])]
    report["after_drop_undefined"] = len(df)

    df["text"] = df["text"].map(normalize_text)
    df = df[df["text"].str.len() >= MIN_CHARS]
    report["after_drop_short"] = len(df)

    # ลบซ้ำตรงตัว (หลังตัดเว้นวรรค/เครื่องหมาย)
    df["_key"] = df["text"].map(dedup_key)
    n_labels = df.groupby("_key")["label"].transform("nunique")
    report["exact_conflict_docs_dropped"] = int((n_labels > 1).sum())
    df = df[n_labels == 1].drop_duplicates(subset="_key", keep="first")
    report["after_exact_dedup"] = len(df)

    # ลบซ้ำเกือบตรงตัว (ข่าวเดียวกัน ต่างแค่หัวข้อ/ลิงก์/ท้ายข่าว)
    df = df.reset_index(drop=True)
    df["_group"] = _near_dup_groups(df["_key"].tolist(), NEAR_DUP_JACCARD, SEED)
    n_labels = df.groupby("_group")["label"].transform("nunique")
    report["near_conflict_docs_dropped"] = int((n_labels > 1).sum())
    df = df[n_labels == 1].drop_duplicates(subset="_group", keep="first")
    report["after_near_dedup"] = len(df)
    report["final_labels"] = {"fact(0)": int((df["label"] == 0).sum()), "fake(1)": int((df["label"] == 1).sum())}
    return df[["text", "label"]].reset_index(drop=True)


# ---------------------------------------------------------------- D2: แบ่งชุดข้อมูล
def split_and_save(
    df: pd.DataFrame,
    seed: int = SEED,
    train_ratio: float = RATIOS[0],
    val_ratio: float = RATIOS[1],
    test_ratio: float = RATIOS[2],
    out_dir: Path = DATA_PROCESSED_DIR,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Stratified split 80/10/10 ตาม label แล้วบันทึกเป็น CSV (UTF-8)"""
    assert abs(train_ratio + val_ratio + test_ratio - 1) < 1e-9
    out_dir.mkdir(parents=True, exist_ok=True)
    train_df, rest = train_test_split(df, test_size=val_ratio + test_ratio, random_state=seed, stratify=df["label"])
    val_df, test_df = train_test_split(rest, test_size=test_ratio / (val_ratio + test_ratio),
                                       random_state=seed, stratify=rest["label"])
    for name, part in (("train", train_df), ("val", val_df), ("test", test_df)):
        part.to_csv(out_dir / f"{name}.csv", index=False, encoding="utf-8")
        print(f"  {name:5s}: {len(part):5d} {part['label'].value_counts().sort_index().to_dict()}")
    print(f"[Data Pipeline] Saved datasets to {out_dir}")
    return train_df, val_df, test_df


# ---------------------------------------------------------------- รายงาน
def leakage_check(splits: Dict[str, pd.DataFrame]) -> Dict[str, int]:
    """นับข้อความ (key) ที่ซ้ำข้าม split ต้องเป็น 0 ทุกคู่"""
    keys = {n: set(d["text"].map(dedup_key)) for n, d in splits.items()}
    return {f"{x}&{y}": len(keys[x] & keys[y]) for x, y in (("train", "val"), ("train", "test"), ("val", "test"))}


def write_report(report: dict, splits: Dict[str, pd.DataFrame], out_dir: Path = DATA_PROCESSED_DIR) -> None:
    report["splits"] = {}
    for n, d in splits.items():
        lens = d["text"].str.len()
        report["splits"][n] = {"total": len(d), "fact(0)": int((d["label"] == 0).sum()), "fake(1)": int((d["label"] == 1).sum()),
                               "fake_ratio": round(float(d["label"].mean()), 4),
                               "chars_median": int(lens.median()), "chars_p95": int(lens.quantile(0.95)), "chars_max": int(lens.max())}
    report["leakage_exact_overlap"] = leakage_check(splits)
    (out_dir / "data_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    r = report
    md = ["# Data Report — LimeSoda (D1/D2)", "",
          f"แหล่งข้อมูล: `{LIMESODA_URL}` · seed = {SEED} · split = 80/10/10 (stratified ตาม label)", "",
          "## จำนวนเอกสารแต่ละขั้น", "", "| ขั้นตอน | เหลือ | ตัดออก |", "|---|---:|---:|"]
    steps = [("ข้อมูลดิบ (Fact + Fake + Undefined)", r.get("raw_total")),
             ("ตัด Undefined", r["after_drop_undefined"]),
             (f"ตัดข้อความสั้น < {MIN_CHARS} ตัวอักษร", r["after_drop_short"]),
             ("ลบซ้ำตรงตัว (รวมกลุ่มที่ label ขัดกัน)", r["after_exact_dedup"]),
             (f"ลบซ้ำเกือบตรงตัว (Jaccard ≥ {NEAR_DUP_JACCARD})", r["after_near_dedup"])]
    prev = None
    for name, n in steps:
        if n is None:
            continue
        md.append(f"| {name} | {n:,} | {'' if prev is None else f'{prev - n:,}'} |")
        prev = n
    md += ["", f"ป้ายกำกับดิบ: {r.get('raw_tags')}",
           f"ทิ้งเพราะ label ขัดกัน: ซ้ำตรงตัว {r['exact_conflict_docs_dropped']} เอกสาร, เกือบซ้ำ {r['near_conflict_docs_dropped']} เอกสาร", "",
           "## Split", "", "| split | ทั้งหมด | fact (0) | fake (1) | สัดส่วน fake | ความยาวกลาง (ตัวอักษร) | p95 | max |",
           "|---|---:|---:|---:|---:|---:|---:|---:|"]
    for n, s in r["splits"].items():
        md.append(f"| {n} | {s['total']:,} | {s['fact(0)']:,} | {s['fake(1)']:,} | {s['fake_ratio']:.3f} "
                  f"| {s['chars_median']:,} | {s['chars_p95']:,} | {s['chars_max']:,} |")
    md += ["", f"ข้อความซ้ำข้าม split (ต้องเป็น 0): {r['leakage_exact_overlap']}", "",
           "> หมายเหตุสำหรับ P3: ข้อความค่อนข้างยาว แต่ WangchanBERTa รับได้สูงสุด 416 token ข้อความจึงถูกตัดท้าย (หัวข้อข่าวอยู่บรรทัดแรก)"]
    (out_dir / "Data_Report.md").write_text("\n".join(md) + "\n", encoding="utf-8")


def run_pipeline(raw_path: Optional[Path] = None):
    raw_df = load_raw_dataset(raw_path)
    validate_raw(raw_df)
    report: dict = {}
    cleaned_df = clean_text(raw_df, report)
    train_df, val_df, test_df = split_and_save(cleaned_df)
    write_report(report, {"train": train_df, "val": val_df, "test": test_df})
    print(f"[Data Pipeline] Leakage check: {report['leakage_exact_overlap']}")
    return train_df, val_df, test_df


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description="LimeSoda data pipeline (D1/D2)")
    ap.add_argument("--raw", type=Path, default=None, help="ไฟล์ข้อมูลดิบในเครื่อง (.jsonl LimeSoda หรือ .csv text,label)")
    run_pipeline(ap.parse_args().raw)
