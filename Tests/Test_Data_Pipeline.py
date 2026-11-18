"""Unit tests ของ Data Pipeline (P1) — ไม่ต้องดาวน์โหลดข้อมูลจริง"""

import pandas as pd

from Src.Data_Pipeline import _join_tokens, clean_text, leakage_check, normalize_text, split_and_save


def test_join_tokens_restores_spaces():
    assert _join_tokens(["กาก", "กาแฟ", "หรือ", "Ground", "Coffee", "คือ"]) == "กากกาแฟหรือ Ground Coffee คือ"
    assert _join_tokens(["วันที่", "17", "ม.ค."]) == "วันที่ 17 ม.ค."
    assert _join_tokens(["ข่าว", "", "", "ปลอม"]) == "ข่าว  ปลอม"   # '' = ช่องว่างเดิม (ยุบทีหลังใน normalize)
    assert _join_tokens(None) == ""


def test_normalize_removes_invisible_chars():
    dirty = "  ข่าว​ปลอม­  &amp; \x93ด่วน\x94\t\t!! �"
    assert normalize_text(dirty) == 'ข่าวปลอม & "ด่วน" !!'


def test_clean_text_dedup_and_conflicts():
    base = "กินกระเทียมสดวันละห้าหัวช่วยกำจัดเชื้อไวรัสได้หมดภายในสามวัน แชร์ต่อด่วน"
    other = "กระทรวงสาธารณสุขแนะนำให้ล้างมือบ่อยๆ ด้วยสบู่อย่างน้อยยี่สิบวินาทีเพื่อป้องกันโรค"
    conflict = "ข้อความนี้ถูกติดป้ายทั้งข่าวจริงและข่าวปลอมจึงต้องถูกตัดทิ้งทั้งกลุ่ม"
    df = pd.DataFrame({
        "text": [base, base + " ", base.replace(" ", "  "), other, conflict, conflict, "สั้น", "อะไรก็ได้ยาวพอสมควรเลยนะ"],
        "tag": ["Fake News", "Fake News", "Fake News", "Fact News", "Fact News", "Fake News", "Fact News", "Undefined"],
    })
    report = {}
    out = clean_text(df, report)
    assert sorted(out["text"]) == sorted([base, other])
    assert set(out.columns) == {"text", "label"}
    assert dict(zip(out["text"], out["label"])) == {base: 1, other: 0}
    assert report["exact_conflict_docs_dropped"] == 2


def test_split_is_stratified_and_leak_free(tmp_path):
    df = pd.DataFrame({"text": [f"ข่าวตัวอย่างหมายเลข {i} สำหรับทดสอบการแบ่งข้อมูล" for i in range(200)],
                       "label": [i % 2 for i in range(200)]})
    tr, va, te = split_and_save(df, out_dir=tmp_path)
    assert (len(tr), len(va), len(te)) == (160, 20, 20)
    assert tr["label"].mean() == va["label"].mean() == te["label"].mean() == 0.5
    assert all(v == 0 for v in leakage_check({"train": tr, "val": va, "test": te}).values())
    assert (tmp_path / "train.csv").exists()
