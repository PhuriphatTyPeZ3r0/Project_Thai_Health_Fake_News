# 🇹🇭 Thai Health Fake-News Detector

> **1323404 การประมวลผลภาษาธรรมชาติ (Natural Language Processing)**  
> **สาขาวิศวกรรมคอมพิวเตอร์และปัญญาประดิษฐ์ (CAI) — สถาบันการจัดการปัญญาภิวัฒน์ (PIM)**  
> ภาคการศึกษาที่ 1 ปีการศึกษา 2569 (2026)

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/PhuriphatTyPeZ3r0/Project_Thai_Health_Fake_News)
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
1. **`Web/` (Next.js 14 MVC/OOP WebApp):** ส่วนติดต่อผู้ใช้ พัฒนาด้วยกระบวนทัศน์ OOP (Model-View-Controller) Deploy บน **Vercel**
2. **`Services/Inference/` (Python FastAPI on Modal):** เซิร์ฟเวอร์ประมวลผลโมเดล Transformer บน GPU Serverless

### 💻 วิธีการรันในเครื่อง (Local Development)

#### 1. ติดตั้ง Python NLP Dependencies & รัน Inference Engine
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

#### 2. ติดตั้งและรัน Next.js WebApp
```bash
cd Web
npm install
npm run dev
```
เปิดบราวเซอร์ไปที่ `http://localhost:3000`

#### 3. การ Deploy ขึ้น Cloud
- **FastAPI Inference บน Modal:**
  ```bash
  modal deploy Services/Inference/Modal_App.py
  ```
- **Next.js บน Vercel:**
  Push โค้ดขึ้น GitHub แล้ว Import โครงการไปยัง Vercel โดยตั้ง Root Directory เป็น `Web/`

---

## 📊 3. ชุดข้อมูลและการทดลอง (Data & Results)

### ข้อมูลและการแบ่งชุดข้อมูล (Stratified 80/10/10)
- **Train Set (80%):** ใช้สำหรับการฝึกสอนโมเดลทั้ง Baseline และ WangchanBERTa
- **Validation Set (10%):** ใช้สำหรับคัดเลือก Best Model Checkpoint ระหว่าง Fine-tuning
- **Test Set (10%):** ใช้สำหรับประเมินผลตัวชี้วัดที่เป็นกลางและวิเคราะห์ข้อผิดพลาด

### ตารางเปรียบเทียบผลลัพธ์ (Performance Comparison)

| เมตริก (Metrics) | Baseline (TF-IDF + LogReg) | WangchanBERTa (Fine-tuned) | ผลต่าง (Delta) | สรุปผลการประเมิน |
| :--- | :---: | :---: | :---: | :---: |
| **Accuracy (ความถูกต้องรวม)** | 0.7726 (77.26%) | **0.8941 (89.41%)** | **+12.15%** | 🏆 WangchanBERTa ชนะ |
| **F1-Macro (ค่าเฉลี่ยทั้งสองคลาส)** | 0.7726 (77.26%) | **0.8872 (88.72%)** | **+11.46%** | 🏆 WangchanBERTa ชนะ |
| **F1-Fake (คลาสข่าวปลอม)** | 0.7740 (77.40%) | **0.8846 (88.46%)** | **+11.06%** | 🏆 WangchanBERTa ชนะ |
| **Precision (ความแม่นตรง Fake)** | 0.8278 (82.78%) | **0.8897 (88.97%)** | **+6.19%** | 🏆 WangchanBERTa ชนะ |
| **Recall (ความครอบคลุม Fake)** | 0.7267 (72.67%) | **0.8796 (87.96%)** | **+15.29%** | 🏆 WangchanBERTa ชนะ |

> รายละเอียดการวิเคราะห์ข้อผิดพลาด (Error Analysis ≥ 20 กรณี) สามารถดูได้ที่ [Results/Compare.md](Results/Compare.md) และ [Results/Errors.csv](Results/Errors.csv)

---

## 👥 4. สมาชิกในทีมและบทบาทหน้าที่ (Team & Roles)

กลุ่มโครงงาน Mini-Project (6 คน):

| รูปประจำตัว | รหัสบทบาท | รหัสนักศึกษา | ชื่อ-นามสกุล | บัญชี GitHub | กิ่งพัฒนางาน (Git Branch) | รายละเอียดงานและผลงานจริงที่ส่งมอบ (Actual Deliverables) |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- |
| <img src="https://github.com/chonlatorn230.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P1** | `6752300135` | ชลธร หรั่งศิริ | [@chonlatorn230](https://github.com/chonlatorn230) | `feat/6752300135-data-pipeline` | **Data Engineer:** พัฒนา `Src/Data_Pipeline.py` โหลดชุดข้อมูล LimeSoda (3,205 ตัวอย่าง), ทำความสะอาด Deduplication, ทำ Stratified Split 80/10/10 ลง `Data/Processed/{train, val, test}.csv` และสรุป `Data_Report.md` |
| <img src="https://github.com/MittrapakXXV.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P2** | `6752300488` | มิตรภักดิ์ กล่อมใจ | [@MittrapakXXV](https://github.com/MittrapakXXV) | `feat/6752300488-baseline-metrics` | **Baseline & Metrics:** พัฒนาโมดูลคำนวณตัวชี้วัด `Src/Metrics.py` (Accuracy, Precision, Recall, F1, Confusion Matrix), พัฒนาโมเดล TF-IDF + Logistic Regression ใน `Src/Baseline.py`, เซฟโมเดล `Models/Baseline_Model.joblib` และประเมินผลลง `Results/Metrics_Baseline.json` |
| <img src="https://github.com/Kitkhachon-xx.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P3** | `6752300216` | กฤษขจร จิรวงศ์รุ่งเรือง | [@Kitkhachon-xx](https://github.com/Kitkhachon-xx) | `feat/6752300216-finetune-wcb` | **AI Engineer:** พัฒนา `Src/Fine_Tune.py` Fine-tuning WangchanBERTa บน Colab GPU, ระบบ Sliding Window (`Src/Windowing.py`), Push โมเดลขึ้น Hugging Face Hub (`Kitkhachon/wcb-limesoda-fakenews`), และพัฒนา `Services/Inference/Modal_App.py` บน Modal Serverless GPU |
| <img src="https://github.com/first025.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P4** | `6752300607` | ปรัชญา ชอบมะรัง | [@first025](https://github.com/first025) | `feat/6752300607-compare-testing` | **QA & Error Analyst:** จัดทำรายงานเปรียบเทียบโมเดลใน `Results/Compare.md`, วิเคราะห์เคสทำนายผิดพลาด 20 เคสจริงลง `Results/Errors.csv`, และพัฒนาชุดทดสอบระบบแบบ End-to-End ครอบคลุม 20 Test Cases ใน `Web/Scripts/Verify_System_Cases.ts` |
| <img src="https://github.com/PhuriphatTyPeZ3r0.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P5** | `6752300313` | ภูริพัฒน์ เหมกุล | [@PhuriphatTyPeZ3r0](https://github.com/PhuriphatTyPeZ3r0) | `feat/6752300313-nextjs-mvc-webapp` | **Full Stack Engineer:** พัฒนา Next.js 14 App Router ด้วยสถาปัตยกรรม OOP + MVC (`Web/src`), ออกแบบ UI แบบ Apple/Taste Skill (Landing Page & Studio), เชื่อมต่อ Modal GPU API แบบเรียลไทม์ และ Deploy เว็บขึ้น Vercel Production ([thai-health-fake-news-web.vercel.app](https://thai-health-fake-news-web.vercel.app)) |
| <img src="https://github.com/maeteerapoopakdee-spec.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P6** | `6752300968` | เมธีรา ภูภักดี | [@maeteerapoopakdee-spec](https://github.com/maeteerapoopakdee-spec) | `feat/6752300968-docs-slides-integration` | **Project Lead & Doc:** บริหารจัดการ Git Monorepo, สรุปเอกสาร `README.md` ครบ 4 หัวข้อตามเกณฑ์กำหนด, บริหารบอร์ด `KANBAN.md` และ GitHub Projects, จัดทำสไลด์นำเสนอตามเกณฑ์ TOR และเตรียมบทซ้อม Live Demo พร้อมชุดคำถาม Q&A |
