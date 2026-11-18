# 🩺 Thai Health Fake News Detector
**NLP Mini Project — 1323404 CAI, PIM**

ระบบตรวจจับข่าวปลอมด้านสุขภาพภาษาไทย ด้วยเทคนิค NLP และ Transformer

---

## 📌 Pain Point

ปัจจุบันข้อมูลข่าวสารและคำแนะนำด้านสุขภาพบนสื่อสังคมออนไลน์ในประเทศไทย มีการเผยแพร่ข้อมูลเท็จ (Fake News) อย่างแพร่หลาย เช่น สูตรสมุนไพรรักษาโรคร้าย, คำแนะนำที่ผิดพลาดทางการแพทย์, หรือข้อมูลอ้างอิงเกี่ยวกับวัคซีน ส่งผลให้ประชาชนไทย โดยเฉพาะผู้สูงอายุ ละเลยการรักษาทางการแพทย์แผนปัจจุบัน จนอาจเกิดอันตรายถึงแก่ชีวิต

## 🎯 Objective & Solution

พัฒนาระบบเว็บแอปพลิเคชันคัดกรองและตรวจจับข่าวปลอมด้านสุขภาพภาษาไทย โดยนำเทคนิค Natural Language Processing (NLP) และโมเดล Transformer ภาษาไทย **WangchanBERTa (Fine-tuned)** เข้ามาทำ Contextual Text Classification เพื่อจำแนกข้อความว่าเป็น **"ข่าวจริง (Fact)"** หรือ **"ข่าวปลอม (Fake)"** พร้อมระดับความเชื่อมั่น (Confidence Score) และนำเสนอเปรียบเทียบกับโมเดลพื้นฐาน TF-IDF + Logistic Regression (Baseline) แบบเรียลไทม์

---

## 📚 References & Dataset

1. **Dataset:** ชุดข้อมูล LimeSoda ([SEACrowd/limesoda](https://huggingface.co/datasets/SEACrowd/limesoda)) สำหรับการจำแนก Fake News ภาษาไทย
2. **Pre-trained Language Model:** [`airesearch/wangchanberta-base-att-spm-uncased`](https://huggingface.co/airesearch/wangchanberta-base-att-spm-uncased) (VISTEC-depa Thailand AI Consortium)
3. **Libraries:** PyThaiNLP, Hugging Face Transformers, PyTorch, Scikit-learn, FastAPI, Next.js

---

## 🏗️ Architecture

ระบบถูกออกแบบในรูปแบบ **Monorepo** แบ่งออกเป็น 2 Services:

| Service | Stack | Deploy |
|---|---|---|
| `Web/` | Next.js 14 (MVC/OOP WebApp) | Vercel |
| `Services/Inference/` | Python FastAPI + Transformer | Modal GPU Serverless |

**Dual-Model Architecture:**
- WangchanBERTa (Fine-tuned) → Contextual Classification
- TF-IDF + Logistic Regression → Baseline Cross-validation
- Output: `FAKE / FACT` + Confidence Score

---

## ⚙️ วิธีการติดตั้งและใช้งาน (How to Run)

### 1. ติดตั้ง Python NLP Dependencies & รัน Inference Engine

```bash
# ติดตั้ง dependencies
pip install -r requirements.txt

# เตรียมชุดข้อมูล LimeSoda และรัน Data Pipeline
python -m Src.Data_Pipeline

# เทรน Baseline Model
python -m Src.Baseline

# รัน FastAPI Inference Service (Localhost:8000)
python -m Services.Inference.App
```

### 2. ติดตั้งและรัน Next.js WebApp

```bash
cd Web
npm install
npm run dev
```

เปิดเบราเซอร์ไปที่ **http://localhost:3000**

### 3. การ Deploy ขึ้น Cloud

```bash
# FastAPI Inference บน Modal
modal deploy Services/Inference/Modal_App.py
```

```
# Next.js บน Vercel
Push โค้ดขึ้น GitHub แล้ว Import โปรเจกต์ไปยัง Vercel
โดยตั้ง Root Directory เป็น Web/
```

🌐 **Production:** [thai-health-fake-news-web.vercel.app](https://thai-health-fake-news-web.vercel.app)

---

## 📊 ชุดข้อมูลและการทดลอง (Data & Results)

### การแบ่งชุดข้อมูล (Stratified 80/10/10)

| Split | สัดส่วน | วัตถุประสงค์ |
|---|---|---|
| Train Set | 80% | ใช้สำหรับฝึกสอนโมเดลทั้ง Baseline และ WangchanBERTa |
| Validation Set | 10% | ใช้สำหรับคัดเลือก Best Model Checkpoint ระหว่าง Fine-tuning |
| Test Set | 10% | ใช้สำหรับประเมินผลตัวชี้วัดที่เป็นกลางและวิเคราะห์ข้อผิดพลาด |

### ตารางเปรียบเทียบผลลัพธ์ (Performance Comparison)

| เมตริก (Metrics) | Baseline (TF-IDF + LogReg) | WangchanBERTa (Fine-tuned) | Delta | ผู้ชนะ |
|---|---|---|---|---|
| Accuracy | 0.7726 (77.26%) | **0.8941 (89.41%)** | +12.15% | 🏆 WangchanBERTa |
| F1-Macro | 0.7726 (77.26%) | **0.8872 (88.72%)** | +11.46% | 🏆 WangchanBERTa |
| F1-Fake | 0.7740 (77.40%) | **0.8846 (88.46%)** | +11.06% | 🏆 WangchanBERTa |
| Precision (Fake) | 0.8278 (82.78%) | **0.8897 (88.97%)** | +6.19% | 🏆 WangchanBERTa |
| Recall (Fake) | 0.7267 (72.67%) | **0.8796 (87.96%)** | +15.29% | 🏆 WangchanBERTa |

> รายละเอียดการวิเคราะห์ข้อผิดพลาด (Error Analysis ≥ 20 กรณี) สามารถดูได้ที่ `Results/Compare.md` และ `Results/Errors.csv`

---

## 👥 สมาชิกในทีมและบทบาทหน้าที่ (Team & Roles)

| # | รหัสนักศึกษา | ชื่อ-นามสกุล | GitHub | Branch | บทบาท |
|---|---|---|---|---|---|
| P1 | 6752300135 | สรศ หรั่งสี | [@chonlatorn230](https://github.com/chonlatorn230) | `feat/6752300135-data-pipeline` | **Data Engineer** — จัดการ Src/Data_Pipeline, LimeSoda (3,205 ตัวอย่าง), Deduplication, Split 80/10/10 |
| P2 | 6752300488 | มิตรกิตต์ กล่อมใจ | [@MittrapakXXV](https://github.com/MittrapakXXV) | `feat/6752300488-baseline-metrics` | **Baseline & Metrics** — สร้าง TF-IDF + Logistic Regression, Src/Baseline.py, ประเมินผล Results/Metrics |
| P3 | 6752300216 | กฤษชนช จิววสง รุ่งเสือ | [@Kitkhachon-xx](https://github.com/Kitkhachon-xx) | `feat/6752300216-Finetune-wcb` | **AI Engineer** — Fine-tune WangchanBERTa, Sliding Window Tokenization, Push โมเดลขึ้น HuggingFace, บริหาร Services/Inference บน Modal Server |
| P4 | 6752300607 | ปริษณา ชอบบรรจง | [@first025](https://github.com/first025) | `feat/6752300607-compare-testing` | **QA & Error Analysis** — ทำนายผิดพลาด ≥ 20 กรณี, Results/Compare, Results/Errors.csv, ทดสอบระบบครบ 20 Test Cases, Web/Scripts/Verify |
| P5 | 6752300313 | ภูรีพัฒน์ เทพคุ | [@PhuriphatTyPeZ3r0](https://github.com/PhuriphatTyPeZ3r0) | `feat/6752300313-nextjs-mvc-webapp` | **Full Stack Engineer** — Next.js 14 MVC (Web/src/), เชื่อมต่อ Next.js และ Deploy Production ([thai-health-fake-news-web.vercel.app](https://thai-health-fake-news-web.vercel.app)) |
| P6 | 6752300968 | เมธา ภูลักดี | [@maeteerapoopakdee-spec](https://github.com/maeteerapoopakdee-spec) | `feat/6752300968-docs-slides-integration` | **Documentation & Integration** — บริหาร Monorepo, สรุปผล 4 Projects, จัดทำ KANBAN, เขียน Docs และ Slides, QA ดำเนินการตรวจสอบ |

---

## 🗂️ โครงสร้างโปรเจกต์ (Project Structure)

```
thai-health-fake-news/
├── Web/                        # Next.js 14 Frontend (MVC/OOP)
│   ├── src/
│   │   ├── app/               # App Router (Next.js 14)
│   │   ├── components/        # Reusable UI Components
│   │   └── lib/               # Utilities & API Clients
│   └── package.json
├── Services/
│   └── Inference/
│       ├── App.py             # FastAPI Inference Service
│       └── Modal_App.py       # Modal GPU Serverless Deploy
├── Src/
│   ├── Data_Pipeline.py       # LimeSoda Dataset Pipeline
│   └── Baseline.py            # TF-IDF + Logistic Regression
├── Results/
│   ├── Metrics/               # Evaluation Results
│   ├── Compare.md             # Model Comparison Report
│   └── Errors.csv             # Error Analysis (≥20 cases)
├── Data/
│   └── Processed/             # train/val/test .csv splits
└── requirements.txt
```

---

*NLP Mini Project · 1323404 CAI · Panyapiwat Institute of Management (PIM)*
