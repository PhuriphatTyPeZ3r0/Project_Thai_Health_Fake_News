"""Data Pipeline Module (P1: Chonlathorn)
Task D1-D3:
- Load LimeSoda dataset (or fallback to Zenodo Thai deceptive messages)
- Clean, deduplicate, validate Thai text
- Stratified 80/10/10 split (seed=42)
- Output: data/processed/{train,val,test}.csv with columns 'text', 'label' (0=fact, 1=fake)
"""

import os
from pathlib import Path
from typing import Tuple
import pandas as pd
from sklearn.model_selection import train_test_split


DATA_RAW_DIR = Path("data/raw")
DATA_PROCESSED_DIR = Path("data/processed")


def load_raw_dataset() -> pd.DataFrame:
    """Load LimeSoda dataset from Hugging Face or fallback source."""
    try:
        from datasets import load_dataset
        print("[Data Pipeline] Attempting to load 'SEACrowd/limesoda' from Hugging Face...")
        ds = load_dataset("SEACrowd/limesoda", "limesoda_seacrowd_text", trust_remote_code=True)
        # Process and combine splits if available
        dfs = []
        for split in ds.keys():
            dfs.append(ds[split].to_pandas())
        df = pd.concat(dfs, ignore_index=True)
        # Map columns to text and label
        # LimeSoda text column is typically 'text' and label is DocumentFactuality or similar
        print(f"[Data Pipeline] Loaded {len(df)} samples from Hugging Face LimeSoda.")
        return df
    except Exception as e:
        print(f"[Data Pipeline] Warning: Could not load via datasets: {e}")
        print("[Data Pipeline] Looking for local fallback in data/raw/ ...")

    fallback_file = DATA_RAW_DIR / "limesoda_raw.csv"
    if fallback_file.exists():
        df = pd.read_csv(fallback_file)
        print(f"[Data Pipeline] Loaded {len(df)} samples from local raw CSV.")
        return df

    # Generate synthetic starter samples for development when offline
    print("[Data Pipeline] Creating starter bootstrap samples for development...")
    starter_data = {
        "text": [
            "กระทรวงสาธารณสุขเตือน ดื่มน้ำมะนาวผสมโซดาไม่สามารถรักษามะเร็งได้ตามที่มีการแชร์",
            "กรมควบคุมโรคยืนยันพบผู้ติดเชื้อไข้หวัดใหญ่สายพันธุ์ใหม่ในพื้นที่ภาคเหนือ",
            "แชร์สนั่น! กินกระเทียมสดวันละ 5 หัวช่วยกำจัดเชื้อไวรัสโควิด-19 ได้หมดจดใน 3 วัน",
            "อย. แจงข้อเท็จจริง ยาฟ้าทะลายโจรมีฤทธิ์บรรเทาอาการหวัด แต่ไม่สามารถป้องกันการติดเชื้อได้",
            "สูตรเด็ดสมุนไพรรักษาโรคเบาหวานให้หายขาดใน 7 วัน ไม่ต้องพึ่งอินซูลินอีกต่อไป",
            "สถาบันโรคผิวหนังระบุ การใช้น้ำแข็งประคบหน้าเป็นเวลานานอาจทำให้เส้นเลือดฝอยแตกได้",
            "กินใบกะเพราต้มน้ำอุ่นทุกเช้าช่วยสลายไขมันอุดตันในเส้นเลือดหัวใจได้จริง 100%",
            "คณะแพทยศาสตร์ศิริราชพยาบาลเปิดเผยผลวิจัยการออกกำลังกายช่วยลดความดันโลหิต",
            "ระวัง! การกินทุเรียนพร้อมกาแฟมีสารพิษร้ายแรงทำให้หัวใจวายเฉียบพลัน",
            "สปสช. เพิ่มสิทธิประโยชน์บัตรทอง ตรวจคัดกรองมะเร็งปากมดลูกฟรีสำหรับสตรีไทย",
        ],
        "label": [0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    }
    return pd.DataFrame(starter_data)


def clean_text(df: pd.DataFrame, text_col: str = "text", label_col: str = "label") -> pd.DataFrame:
    """Clean and preprocess dataset text."""
    clean_df = df.copy()
    clean_df = clean_df.dropna(subset=[text_col, label_col])
    clean_df[text_col] = clean_df[text_col].astype(str).str.strip()
    # Deduplicate
    clean_df = clean_df.drop_duplicates(subset=[text_col])
    # Normalize labels to int 0 or 1
    clean_df[label_col] = clean_df[label_col].astype(int)
    clean_df = clean_df[clean_df[label_col].isin([0, 1])]
    return clean_df[[text_col, label_col]]


def split_and_save(
    df: pd.DataFrame,
    seed: int = 42,
    train_ratio: float = 0.8,
    val_ratio: float = 0.1,
    test_ratio: float = 0.1,
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Perform stratified split 80/10/10 and write to data/processed/."""
    DATA_PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    # First split: train vs (val + test)
    val_test_ratio = val_ratio + test_ratio
    train_df, val_test_df = train_test_split(
        df,
        test_size=val_test_ratio,
        random_state=seed,
        stratify=df["label"],
    )

    # Second split: val vs test (50/50 of the remaining 20%)
    relative_test_ratio = test_ratio / val_test_ratio
    val_df, test_df = train_test_split(
        val_test_df,
        test_size=relative_test_ratio,
        random_state=seed,
        stratify=val_test_df["label"],
    )

    train_path = DATA_PROCESSED_DIR / "train.csv"
    val_path = DATA_PROCESSED_DIR / "val.csv"
    test_path = DATA_PROCESSED_DIR / "test.csv"

    train_df.to_csv(train_path, index=False, encoding="utf-8")
    val_df.to_csv(val_path, index=False, encoding="utf-8")
    test_df.to_csv(test_path, index=False, encoding="utf-8")

    print(f"[Data Pipeline] Saved datasets to {DATA_PROCESSED_DIR}")
    print(f"  Train: {len(train_df)} ({train_df['label'].value_counts().to_dict()})")
    print(f"  Val:   {len(val_df)} ({val_df['label'].value_counts().to_dict()})")
    print(f"  Test:  {len(test_df)} ({test_df['label'].value_counts().to_dict()})")

    return train_df, val_df, test_df


def run_pipeline():
    raw_df = load_raw_dataset()
    cleaned_df = clean_text(raw_df)
    train_df, val_df, test_df = split_and_save(cleaned_df)
    return train_df, val_df, test_df


if __name__ == "__main__":
    run_pipeline()
