# 📋 Kanban Board: Thai Health Fake-News Detector (6 Persons / 1 Day Timeline)

> **รูปแบบบอร์ด:** เข้ากันได้กับ Obsidian Kanban Plugin และใช้แมปเข้าสู่ GitHub Projects / Issues

---

## 📌 สมาชิกและบทบาทหน้าที่ (Team Roster & Assignments)

| รหัสบทบาท | รหัสนักศึกษา | ชื่อ-นามสกุล | บัญชี GitHub | บทบาทหลัก | งานที่รับผิดชอบ |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **P1** | `6752300135` | ชลธร หรั่งศิริ | [@chonlatorn230](https://github.com/chonlatorn230) | Data Engineer | D1, D2, D3 (Stage 1-2: โหลดข้อมูล, คลีน, Stratified Split 80/10/10) |
| **P2** | `6752300488` | มิตรภักดิ์ กล่อมใจ | [@MittrapakXXV](https://github.com/MittrapakXXV) | Baseline + Metrics | B1, B2, B3 (Stage 3: metrics.py, TF-IDF + LogReg Baseline) |
| **P3** | `6752300216` | กฤษขจร จิรวงศ์รุ่งเรือง | [@Kitkhachon-xx](https://github.com/Kitkhachon-xx) | AI Engineer | F1, F2, F3 (Stage 4-5: Fine-tune WangchanBERTa บน Colab GPU, Push Hub) |
| **P4** | `6752300607` | ปรัชญา ชอบมะรัง | [@first025](https://github.com/first025) | QA & Error Analyst | C1, T1, T2 (Stage 6, 9: เปรียบเทียบโมเดล, วิเคราะห์ Error ≥20 ตัว, System Test) |
| **P5** | `6752300313` | ภูริพัฒน์ เหมกุล | [@PhuriphatTyPeZ3r0](https://github.com/PhuriphatTyPeZ3r0) | Full Stack Engineer | S1, S2, S3 (Stage 7-8: Next.js MVC/OOP WebApp, FastAPI บน Modal, Deploy Vercel) |
| **P6** | `6752300968` | เมธีรา ภูภักดี | [@maeteerapoopakdee-spec](https://github.com/maeteerapoopakdee-spec) | Project Lead & Doc | R1, R2, R3 (Stage 0, 10: Setup Repo, README 4 หัวข้อ, สไลด์นำเสนอ, Integration) |

---

## 🚀 เฟสการทำงานตามไทม์ไลน์ (Timeline Milestones)

### 🟢 Milestone 1: H0–H3 (Foundation, Contracts & Data Pipeline)
- [x] **#R1 [P6] Setup Repo & Baseline Document:** สร้าง Repository บน GitHub, ตั้งโครงสร้างโฟลเดอร์, เชิญสมาชิกทั้ง 6 คนเป็น Collaborator, และร่าง README หัวข้อ Idea @maeteerapoopakdee-spec
- [ ] **#D1 [P1] Validate & Load LimeSoda Dataset:** ดาวน์โหลดและตรวจสอบสกีมาชุดข้อมูล LimeSoda (SEACrowd/limesoda) ตรวจสอบความถูกต้องของคอลัมน์และ label (fallback: Zenodo) @chonlatorn230
- [ ] **#B1 [P2] Develop Evaluation Metrics Module:** พัฒนาฟังก์ชัน `compute(y_true, y_pred)` ใน `src/metrics.py` คืนค่า accuracy, precision, recall, f1_macro, f1_fake บันทึกเป็น JSON @MittrapakXXV
- [ ] **#F1 [P3] Setup Colab GPU Environment & Fine-tune Script:** เตรียมสภาพแวดล้อมบน Google Colab (GPU T4/V100) ทดสอบโหลด WangchanBERTa และเขียน `src/finetune.py` รอรับ CSV @Kitkhachon-xx
- [ ] **#S1 [P5] Next.js MVC WebApp Scaffold & Stub Engine:** พัฒนาโครงสร้างเว็บแอป Next.js 14 MVC/OOP ในโฟลเดอร์ `web/` พร้อมระบบ Mock Engine ตอบผล Fake/Fact และ UI skeleton @PhuriphatTyPeZ3r0
- [ ] **#C1-prep [P4] Prepare 20 System Test Cases:** จัดทำชุดทดสอบ 20 เคสใน `tests/test_cases.md` ครอบคลุมข้อความสั้น, ข้อความยาว, ว่างเปล่า, และภาษาอังกฤษ @first025

---

### 🟡 Milestone 2: H3–H7 (Data Delivery, Model Training & WebApp Prototype)
- [ ] **#D2 [P1] Data Cleaning & Stratified Split:** ทำความสะอาดข้อมูล คัดกรองข้อความซ้ำ (Deduplicate) และทำ Stratified Split 80/10/10 บันทึกลง `data/processed/{train,val,test}.csv` ส่งมอบให้ P2, P3 @chonlatorn230
- [ ] **#B2 [P2] Train & Evaluate TF-IDF Baseline Model:** นำ `train.csv` มาเทรนโมเดล TF-IDF + Logistic Regression ประเมินผลบน `test.csv` บันทึกค่าลง `results/metrics_baseline.json` @MittrapakXXV
- [ ] **#F2 [P3] Fine-tune WangchanBERTa on GPU:** รันการ Fine-tune โมเดล WangchanBERTa บน Colab ด้วย `train.csv` และ `val.csv` ปรับ Hyperparameters (LR=3e-5, Batch=16, 3 Epochs) @Kitkhachon-xx
- [ ] **#S2 [P5] Build Dual-Model Comparison UI & Controllers:** พัฒนา Component หน้าเว็บแสดงผลการเปรียบเทียบโมเดลคู่ (Side-by-side Comparison), ตัวนับตัวอักษร, แถบความเชื่อมั่น (Confidence Gauge), และ Medical Disclaimer @PhuriphatTyPeZ3r0
- [ ] **#R2 [P6] Draft Presentation Slides & References:** ร่างสไลด์นำเสนอตามเกณฑ์ TOR (Pain point, Why NLP, Methodology, Limitations, References) @maeteerapoopakdee-spec

---

### 🔴 Milestone 3: H7–H12 (Evaluation, Error Analysis, Deploy & Pitching)
- [ ] **#F3 [P3] Evaluate Main Model & Push HF Hub:** ประเมินโมเดล WangchanBERTa บน `test.csv` บันทึกลง `results/metrics_wcb.json` และ Push โมเดลขึ้น Hugging Face Hub @Kitkhachon-xx
- [ ] **#C1 [P4] Model Comparison & Error Analysis:** รัน `src/compare.py` สร้างตารางเปรียบเทียบ Baseline vs WangchanBERTa ลง `results/compare.md` และวิเคราะห์เคสที่โมเดลทายผิด ≥20 ตัวลง `results/errors.csv` @first025
- [ ] **#S3 [P5] Deploy FastAPI on Modal & Next.js on Vercel:** ติดตั้ง FastAPI Inference Service ขึ้น **Modal Serverless GPU** และ Deploy Next.js WebApp ขึ้น **Vercel** ตรวจสอบ End-to-end integration @PhuriphatTyPeZ3r0
- [ ] **#T1 [P4] System Integration Testing:** ทดสอบระบบบนลิงก์ Production จริงตาม Test cases 20 ข้อ บันทึกและแจ้ง Bug @first025
- [ ] **#R3 [P6] Final README Integration & Live Demo Rehearsal:** เติมเต็ม README 4 หัวข้อหลัก (Idea, How to run, Data+Results, Team+role) และซ้อม Live Demo พร้อมเตรียมตอบคำถาม Q&A @maeteerapoopakdee-spec
