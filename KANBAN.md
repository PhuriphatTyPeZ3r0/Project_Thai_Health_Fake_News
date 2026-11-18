# 📋 Kanban Board: Thai Health Fake-News Detector (6 Persons / 1 Day Timeline)

> **รูปแบบบอร์ด:** เข้ากันได้กับ Obsidian Kanban Plugin และใช้แมปเข้าสู่ GitHub Projects / Issues

---

## 📌 สมาชิกและบทบาทหน้าที่ (Team Roster & Assignments)

| รูปประจำตัว | รหัสบทบาท | รหัสนักศึกษา | ชื่อ-นามสกุล | บัญชี GitHub | กิ่งพัฒนางาน (Git Branch) | บทบาทหลัก | งานที่รับผิดชอบ |
| :---: | :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| <img src="https://github.com/chonlatorn230.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P1** | `6752300135` | ชลธร หรั่งศิริ | [@chonlatorn230](https://github.com/chonlatorn230) | `feat/6752300135-data-pipeline` | Data Engineer | D1, D2, D3 (Stage 1-2: โหลดข้อมูล, คลีน, Stratified Split 80/10/10) |
| <img src="https://github.com/MittrapakXXV.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P2** | `6752300488` | มิตรภักดิ์ กล่อมใจ | [@MittrapakXXV](https://github.com/MittrapakXXV) | `feat/6752300488-baseline-metrics` | Baseline + Metrics | B1, B2, B3 (Stage 3: Metrics.py, TF-IDF + LogReg Baseline) |
| <img src="https://github.com/Kitkhachon-xx.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P3** | `6752300216` | กฤษขจร จิรวงศ์รุ่งเรือง | [@Kitkhachon-xx](https://github.com/Kitkhachon-xx) | `feat/6752300216-finetune-wcb` | AI Engineer | F1, F2, F3 (Stage 4-5: Fine-tune WangchanBERTa บน Colab GPU, Push Hub) |
| <img src="https://github.com/first025.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P4** | `6752300607` | ปรัชญา ชอบมะรัง | [@first025](https://github.com/first025) | `feat/6752300607-compare-testing` | QA & Error Analyst | C1, T1, T2 (Stage 6, 9: เปรียบเทียบโมเดล, วิเคราะห์ Error ≥20 ตัว, System Test) |
| <img src="https://github.com/PhuriphatTyPeZ3r0.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P5** | `6752300313` | ภูริพัฒน์ เหมกุล | [@PhuriphatTyPeZ3r0](https://github.com/PhuriphatTyPeZ3r0) | `feat/6752300313-nextjs-mvc-webapp` | Full Stack Engineer | S1, S2, S3 (Stage 7-8: Next.js MVC/OOP WebApp, FastAPI บน Modal, Deploy Vercel) |
| <img src="https://github.com/maeteerapoopakdee-spec.png?size=60" width="28" height="28" style="border-radius:50%; vertical-align:middle;" /> | **P6** | `6752300968` | เมธีรา ภูภักดี | [@maeteerapoopakdee-spec](https://github.com/maeteerapoopakdee-spec) | `feat/6752300968-docs-slides-integration` | Project Lead & Doc | R1, R2, R3 (Stage 0, 10: Setup Repo, README 4 หัวข้อ, สไลด์นำเสนอ, Integration) |

---

## 🚀 เฟสการทำงานตามไทม์ไลน์ (Timeline Milestones)

### 🟢 Milestone 1: H0–H3 (Foundation, Contracts & Data Pipeline)
- [x] <img src="https://github.com/maeteerapoopakdee-spec.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#R1 [P6] Setup Repo & Baseline Document:** สร้าง Repository บน GitHub, ตั้งโครงสร้างโฟลเดอร์, เชิญสมาชิกทั้ง 6 คนเป็น Collaborator, และร่าง README หัวข้อ Idea @maeteerapoopakdee-spec
- [ ] <img src="https://github.com/chonlatorn230.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#D1 [P1] Validate & Load LimeSoda Dataset:** ดาวน์โหลดและตรวจสอบสกีมาชุดข้อมูล LimeSoda (SEACrowd/limesoda) ตรวจสอบความถูกต้องของคอลัมน์และ label (fallback: Zenodo) @chonlatorn230
- [x] <img src="https://github.com/MittrapakXXV.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#B1 [P2] Develop Evaluation Metrics Module:** พัฒนาฟังก์ชัน `compute(y_true, y_pred)` ใน `Src/Metrics.py` คืนค่า accuracy, precision, recall, f1_macro, f1_fake บันทึกเป็น JSON @MittrapakXXV
- [ ] <img src="https://github.com/Kitkhachon-xx.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#F1 [P3] Setup Colab GPU Environment & Fine-tune Script:** เตรียมสภาพแวดล้อมบน Google Colab (GPU T4/V100) ทดสอบโหลด WangchanBERTa และเขียน `Src/Fine_Tune.py` รอรับ CSV @Kitkhachon-xx
- [ ] <img src="https://github.com/PhuriphatTyPeZ3r0.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#S1 [P5] Next.js MVC WebApp Scaffold & Stub Engine:** พัฒนาโครงสร้างเว็บแอป Next.js 14 MVC/OOP ในโฟลเดอร์ `Web/` พร้อมระบบ Mock Engine ตอบผล Fake/Fact และ UI skeleton @PhuriphatTyPeZ3r0
- [ ] <img src="https://github.com/first025.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#C1-prep [P4] Prepare 20 System Test Cases:** จัดทำชุดทดสอบ 20 เคสใน `Tests/Test_Cases.md` ครอบคลุมข้อความสั้น, ข้อความยาว, ว่างเปล่า, และภาษาอังกฤษ @first025

---

### 🟡 Milestone 2: H3–H7 (Data Delivery, Model Training & WebApp Prototype)
- [ ] <img src="https://github.com/chonlatorn230.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#D2 [P1] Data Cleaning & Stratified Split:** ทำความสะอาดข้อมูล คัดกรองข้อความซ้ำ (Deduplicate) และทำ Stratified Split 80/10/10 บันทึกลง `Data/Processed/{Train,Val,Test}.csv` ส่งมอบให้ P2, P3 @chonlatorn230
- [x] <img src="https://github.com/MittrapakXXV.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#B2 [P2] Train & Evaluate TF-IDF Baseline Model:** นำ `Train.csv` มาเทรนโมเดล TF-IDF + Logistic Regression ประเมินผลบน `Test.csv` บันทึกค่าลง `Results/Metrics_Baseline.json` @MittrapakXXV
- [ ] <img src="https://github.com/Kitkhachon-xx.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#F2 [P3] Fine-tune WangchanBERTa on GPU:** รันการ Fine-tune โมเดล WangchanBERTa บน Colab ด้วย `Train.csv` และ `Val.csv` ปรับ Hyperparameters (LR=3e-5, Batch=16, 3 Epochs) @Kitkhachon-xx
- [ ] <img src="https://github.com/PhuriphatTyPeZ3r0.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#S2 [P5] Build Dual-Model Comparison UI & Controllers:** พัฒนา Component หน้าเว็บแสดงผลการเปรียบเทียบโมเดลคู่ (Side-by-side Comparison), ตัวนับตัวอักษร, แถบความเชื่อมั่น (Confidence Gauge), และ Medical Disclaimer @PhuriphatTyPeZ3r0
- [ ] <img src="https://github.com/maeteerapoopakdee-spec.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#R2 [P6] Draft Presentation Slides & References:** ร่างสไลด์นำเสนอตามเกณฑ์ TOR (Pain point, Why NLP, Methodology, Limitations, References) @maeteerapoopakdee-spec

---

### 🔴 Milestone 3: H7–H12 (Evaluation, Error Analysis, Deploy & Pitching)
- [ ] <img src="https://github.com/Kitkhachon-xx.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#F3 [P3] Evaluate Main Model & Push HF Hub:** ประเมินโมเดล WangchanBERTa บน `Test.csv` บันทึกลง `Results/Metrics_Wcb.json` และ Push โมเดลขึ้น Hugging Face Hub @Kitkhachon-xx
- [ ] <img src="https://github.com/first025.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#C1 [P4] Model Comparison & Error Analysis:** รัน `Src/Compare.py` สร้างตารางเปรียบเทียบ Baseline vs WangchanBERTa ลง `Results/Compare.md` และวิเคราะห์เคสที่โมเดลทายผิด ≥20 ตัวลง `Results/Errors.csv` @first025
- [ ] <img src="https://github.com/PhuriphatTyPeZ3r0.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#S3 [P5] Deploy FastAPI on Modal & Next.js on Vercel:** ติดตั้ง FastAPI Inference Service ขึ้น **Modal Serverless GPU** และ Deploy Next.js WebApp ขึ้น **Vercel** ตรวจสอบ End-to-end integration @PhuriphatTyPeZ3r0
- [ ] <img src="https://github.com/first025.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#T1 [P4] System Integration Testing:** ทดสอบระบบบนลิงก์ Production จริงตาม Test cases 20 ข้อ บันทึกและแจ้ง Bug @first025
- [ ] <img src="https://github.com/maeteerapoopakdee-spec.png?size=40" width="20" height="20" style="border-radius:50%; vertical-align:middle; display:inline-block;" /> **#R3 [P6] Final README Integration & Live Demo Rehearsal:** เติมเต็ม README 4 หัวข้อหลัก (Idea, How to run, Data+Results, Team+role) และซ้อม Live Demo พร้อมเตรียมตอบคำถาม Q&A @maeteerapoopakdee-spec
