# 🇹🇭 Thai Health Fake-News Detector

> **1323404 การประมวลผลภาษาธรรมชาติ (Natural Language Processing)**  
> **สาขาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ (CAI) — สถาบันการจัดการปัญญาภิวัฒน์ (PIM)**  
> ภาคการศึกษาที่ 1 ปีการศึกษา 2569 (2026)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/PhuriphatTyPeZ3r0/thai-health-fakenews)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20(MVC%2FOOP)-black?logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20on%20Modal-009688?logo=fastapi)](https://modal.com/)
[![Model: WangchanBERTa](https://img.shields.io/badge/NLP%20Model-WangchanBERTa-orange)](https://huggingface.co/airesearch/wangchanberta-base-att-spm-uncased)

---

## 💡 1. ที่มา แนวคิด และปัญหา (Idea & Pain Point)

### 📌 Pain Point
ปัจจุบันข้อมูลข่าวสารและคำแนะนำด้านสุขภาพบนสื่อสังคมออนไลน์ในประเทศไทยมีการเผยแพร่ข้อมูลเท็จ (Fake News) อย่างแพร่หลาย เช่น สูตรสมุนไพรรักษามะเร็งหายขาด, คำเตือนอาหารจับคู่มรณะ, หรือทฤษฎีสมคบคิดเกี่ยวกับวัคซีน ส่งผลให้ประชาชนโดยเฉพาะกลุ่มผู้สูงอายุหลงเชื่อ ละเลยการรักษาทางการแพทย์แผนปัจจุบัน จนเกิดอันตรายถึงแก่ชีวิต

### 🎯 Objective & Solution
พัฒนาระบบเว็บแอปพลิเคชันคัดกรองและตรวจจับข่าวปลอมด้านสุขภาพภาษาไทย โดยนำเทคนิค **Natural Language Processing (NLP)** และโมเดล Transformer ภาษาไทย **WangchanBERTa (Fine-tuned)** เข้ามาทำ Contextual Text Classification เพื่อจำแนกข้อความว่าเป็น **"ข่าวจริง (Fact)"** หรือ **"ข่าวปลอม (Fake)"** พร้อมระดับความเชื่อมั่น (Confidence Score) และนำเสนอเปรียบเทียบกับโมเดลพื้นฐาน **TF-IDF + Logistic Regression (Baseline)** แบบเรียลไทม์

### 📚 References & Dataset
1. **Dataset:** ชุดข้อมูล LimeSoda (`SEACrowd/limesoda`) สำหรับการจำแนก Fake News ภาษาไทย
2. **Pre-trained Language Model:** `airesearch/wangchanberta-base-att-spm-uncased` (VISTEC-depa Thailand AI Consortium)
3. **Libraries:** PyThaiNLP, Hugging Face Transformers, PyTorch, Scikit-learn, FastAPI, Next.js

---

## 🛠️ 2. สถาปัตยกรรมและวิธีการติดตั้งใช้งาน (How to Run & Customize)

ระบบถูกออกแบบในรูปแบบ **Monorepo** แบ่งออกเป็น **2 Services**:
1. **`web/` (Next.js 14 MVC/OOP WebApp):** ส่วนติดต่อผู้ใช้ พัฒนาด้วยกระบวนทัศน์ OOP (Model-View-Controller) Deploy บน **Vercel**
2. **`services/inference/` (Python FastAPI on Modal):** เซิร์ฟเวอร์ประมวลผลโมเดล Transformer บน GPU Serverless

### 💻 วิธีการรันในเครื่อง (Local Development)

#### 1. ติดตั้ง Python NLP Dependencies & รัน Inference Engine
```bash
# ติดตั้ง dependencies
pip install -r requirements.txt

# เตรียมชุดข้อมูล LimeSoda และรัน Data Pipeline
python -m src.data_pipeline

# เทรน Baseline Model
python -m src.baseline

# รัน FastAPI Inference Service (Localhost:8000)
python -m services.inference.app
```

#### 2. ติดตั้งและรัน Next.js WebApp
```bash
cd web
npm install
npm run dev
```
เปิดบราวเซอร์ไปที่ `http://localhost:3000`

#### 3. การ Deploy ขึ้น Cloud
- **FastAPI Inference บน Modal:**
  ```bash
  modal deploy services/inference/modal_app.py
  ```
- **Next.js บน Vercel:**
  Push โค้ดขึ้น GitHub แล้ว Import โครงการไปยัง Vercel โดยตั้ง Root Directory เป็น `web/`

---

## 📊 3. ชุดข้อมูลและการทดลอง (Data & Results)

### ข้อมูลและการแบ่งชุดข้อมูล (Stratified 80/10/10)
- **Train Set (80%):** ใช้สำหรับการฝึกสอนโมเดลทั้ง Baseline และ WangchanBERTa
- **Validation Set (10%):** ใช้สำหรับคัดเลือก Best Model Checkpoint ระหว่าง Fine-tuning
- **Test Set (10%):** ใช้สำหรับประเมินผลตัวชี้วัดที่เป็นกลางและวิเคราะห์ข้อผิดพลาด

### ตารางเปรียบเทียบผลลัพธ์ (Performance Comparison)

| เมตริก (Metrics) | Baseline (TF-IDF + LogReg) | WangchanBERTa (Fine-tuned) | ผลต่าง (Delta) |
| :--- | :---: | :---: | :---: |
| **Accuracy** | 0.7240 | **0.8950** | **+17.1%** |
| **F1-Macro** | 0.7085 | **0.8872** | **+17.8%** |
| **F1-Fake (Class 1)** | 0.6950 | **0.8790** | **+18.4%** |
| **Precision (Fake)** | 0.7120 | **0.8840** | **+17.2%** |
| **Recall (Fake)** | 0.6800 | **0.8740** | **+19.4%** |

> รายละเอียดการวิเคราะห์ข้อผิดพลาด (Error Analysis ≥ 20 กรณี) สามารถดูได้ที่ [results/compare.md](results/compare.md) และ [results/errors.csv](results/errors.csv)

---

## 👥 4. สมาชิกในทีมและบทบาทหน้าที่ (Team & Roles)

กลุ่มโครงงาน Mini-Project (6 คน):

| รหัสบทบาท | รหัสนักศึกษา | ชื่อ-นามสกุล | บัญชี GitHub | กิ่งพัฒนางาน (Git Branch) | บทบาทหลักในโครงงาน |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **P1** | `6752300135` | ชลธร หรั่งศิริ | [@chonlatorn230](https://github.com/chonlatorn230) | `feat/6752300135-data-pipeline` | **Data Engineer:** โหลด LimeSoda, Data Cleaning, Stratified Split 80/10/10 |
| **P2** | `6752300488` | มิตรภักดิ์ กล่อมใจ | [@MittrapakXXV](https://github.com/MittrapakXXV) | `feat/6752300488-baseline-metrics` | **Baseline & Metrics:** พัฒนา `metrics.py`, สร้างโมเดล TF-IDF + Logistic Regression |
| **P3** | `6752300216` | กฤษขจร จิรวงศ์รุ่งเรือง | [@Kitkhachon-xx](https://github.com/Kitkhachon-xx) | `feat/6752300216-finetune-wcb` | **AI Engineer:** Fine-tuning WangchanBERTa บน Colab GPU, Push Hugging Face Hub |
| **P4** | `6752300607` | ปรัชญา ชอบมะรัง | [@first025](https://github.com/first025) | `feat/6752300607-compare-testing` | **QA & Error Analyst:** พัฒนาชุดทดสอบ 20 เคส, วิเคราะห์ข้อผิดพลาด, Compare Models |
| **P5** | `6752300313` | ภูริพัฒน์ เหมกุล | [@PhuriphatTyPeZ3r0](https://github.com/PhuriphatTyPeZ3r0) | `feat/6752300313-nextjs-mvc-webapp` | **Full Stack Engineer:** พัฒนา Next.js MVC/OOP WebApp, FastAPI บน Modal, Deploy Vercel |
| **P6** | `6752300968` | เมธีรา ภูภักดี | [@maeteerapoopakdee-spec](https://github.com/maeteerapoopakdee-spec) | `feat/6752300968-docs-slides-integration` | **Project Lead & Doc:** บริหารจัดการ Git Repo, เอกสาร README, สไลด์นำเสนอ, Live Demo |
