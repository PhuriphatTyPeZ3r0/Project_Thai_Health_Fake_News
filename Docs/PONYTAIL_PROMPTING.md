# 🪓 Ponytail Prompting & Code Minimalism Guide

> **Standard:** Lazy Senior Dev Mode (High Signal-to-Noise Ratio)  
> **Target Project:** Thai Health Fake News Detection System (1323404 NLP)  
> **Maintainer:** P5 (Full Stack Engineer - Phuriphat Hemakul, Student ID: `6752300313`)

---

## 🎯 1. Overview & Philosophy

เมื่อส่งคำสั่ง (Prompt) ให้กับ AI หรือเขียนโค้ดในโปรเจกต์นี้ เรายึดหลักการของ **Ponytail**:
1. **ตัด "น้ำ" (Context Fluff) ให้หมด:** ยิ่งบริบทที่ไม่จำเป็นมีมาก AI ยิ่งเสียสมาธิ (Attention Dilution) เปลือง Token และเพิ่มโอกาสเกิด Hallucination
2. **YAGNI & Code Minimalism:** เขียนเฉพาะโค้ดที่ตอบโจทย์งานตรงหน้า ห้ามสร้าง Wrapper ซ้ำซ้อน ห้ามสร้าง Abstraction เผื่ออนาคตที่ยังมาไม่ถึง

---

## ✂️ 2. The 4 Fluff Pruning Rules (กฎตัด 4 ย่อหน้าน้ำ)

| # | ประเภทข้อความที่ไม่จำเป็น | ❌ สิ่งที่ต้องตัดทิ้ง (Fluff) | ✅ สิ่งที่ต้องระบุแทน (Ponytail Spec) |
| :---: | :--- | :--- | :--- |
| **1** | **ที่มาและเรื่องราวธุรกิจ (Story / Background)** | ความเป็นมาของบริษัท, แรงบันดาลใจ, วิสัยทัศน์ผู้บริหาร, ความสำคัญเชิงสังคมยาวเหยียด | **บทบาทและฟังก์ชันหลัก:** ระบุหน้าที่ผู้ใช้ (Actor) และสิ่งที่จะสร้าง 1 บรรทัด (e.g. `สร้างหน้าตรวจจับข่าวปลอมสำหรับประชาชนทั่วไป`) |
| **2** | **หลักการและทฤษฎี (Theory / Concepts)** | อธิบายปรัชญา Clean Code, ทฤษฎีทำไม Responsive ดี, นิยาม F1-Score หรือ Attention Mechanism | **ข้อกำหนดทางเทคนิค (Bullet Points):** ระบุ Tech Stack, Type Contracts, Performance Target สั้นๆ |
| **3** | **ข้อความตัวอย่างยาวๆ (Copy / Dummy Text)** | ตัวอย่างข่าวปลอม 5 ย่อหน้า, คำเตือนทางการแพทย์ 20 บรรทัด, คำบรรยายการตลาด | **สกีมาและขอบเขตความยาว:** ระบุขนาดข้อมูล เช่น `string (min: 10, max: 2000 chars)`, `Mock 2-3 ประโยคสั้นๆ` |
| **4** | **ลำดับการทำงานแบบเล่าเรื่อง (Narrative Flow)** | "เมื่อผู้ใช้เปิดเว็บ จะเห็นหน้าจอสีฟ้า จากนั้นเลื่อนลงมาเจอปุ่ม แล้วพอกดปุ่มจะพาไป..." | **Deterministic State Machine:** Input ➔ State Transition ➔ Output ➔ Error Handling |

---

## 🧩 3. Ready-to-Copy Prompt Scaffolds (เทมเพลตสั่งงาน AI)

### Template A: สร้างฟีเจอร์ใหม่ (Feature Implementation)
```markdown
### Role & Goal
Senior Software Engineer: [ระบุงานที่ต้องทำใน 1 ประโยค]

### Target Files
- Modify: `Web/src/components/MyComponent.tsx`
- Interface: `Web/src/models/IInferenceEngine.ts`

### Specifications & Constraints
- Stack: Next.js 14 (App Router), Tailwind CSS, TypeScript
- State: [ระบุ State ที่ต้องการ เช่น idle | loading | success | error]
- Limits: รองรับข้อความ 10 - 2,000 ตัวอักษร
- Rule: ห้ามเพิ่ม External Library ใหม่, ห้ามเขียน wrapper div ซ้อนเกินจำเป็น

### Verification
- รันคำสั่ง `pnpm test` และ `pnpm run build` ต้องผ่านทั้งหมด
```

---

### Template B: แก้ไขบั๊ก / วิเคราะห์ปัญหา (Bug Fix & Root Cause)
```markdown
### Goal
Debug & Fix: [ระบุอาการที่พบ เช่น Next.js 404 บน Windows / Reparse Point EINVAL]

### Failure Details
- Command: `pnpm dev`
- Log/Error: `[วาง Error stack trace สั้นๆ เฉพาะบรรทัดสำคัญ]`
- Environment: Windows 11, Node v26, OneDrive

### Constraints
- ห้ามแก้กระทบ Core Contract เดิม
- วิเคราะห์ Root cause สั้นๆ 2 บรรทัด แล้วลงมือแก้ทันที

### Verification
- รันคำสั่งเดิมแล้วต้องไม่พบ Error
```

---

### Template C: ตรวจสอบโค้ด (Code Review & Simplification)
```markdown
### Goal
Ponytail Code Review: [ระบุไฟล์หรือ PR เช่น Web/src/services/MockInferenceEngine.ts]

### Criteria
1. ความถูกต้อง (Correctness & Edge Cases)
2. มี Abstraction หรือ Wrapper เกินความจำเป็นหรือไม่ (YAGNI Check)
3. มี Dependency ที่สามารถตัดทิ้งแล้วใช้ Web API แทนได้หรือไม่

### Output Format
- ลิสต์เฉพาะจุดที่มีปัญหาแบบ Actionable Item (ไฟล์ + บรรทัด + โค้ดที่ควรแก้)
- ไม่ต้องเกริ่นนำหรือชมเชย
```

---

## 📋 4. Pre-Prompt Verification Checklist (ตรวจ 4 ข้อก่อนส่ง Prompt)

ก่อนยิง Prompt เข้าสู่ AI ให้เช็กตามรายการนี้:
- [ ] **ตัด Story ทิ้งแล้ว:** ไม่มีประวัติความเป็นมาหรือเรื่องเล่าเกริ่นนำ
- [ ] **ตัด Theory ทิ้งแล้ว:** ไม่มีคำอธิบายทฤษฎีหรือหลักการเขียนโค้ดยาวๆ
- [ ] **ไม่มี Dummy Text ก้อนโต:** ใช้การระบุ Type/Length Constraints แทน
- [ ] **ชัดเจนแบบ State Machine:** มี Input, Expected Output, และเกณฑ์การ Verify ที่ชัดเจน

---

## 💻 5. Ponytail Code Standards for this Repository

1. **Zero-Wrapper Policy:**
   - ❌ เลี่ยง: สร้างฟังก์ชันหรือ Class ส่งต่อค่าตัวเดียว เช่น `function getPrediction(text) { return api.predict(text); }`
   - ✅ ใช้: เรียกตรงหรือใช้ Dependency Injection ผ่าน Interface เท่าที่จำเป็น
2. **Native Platform First:**
   - ใช้ `fetch` แทน `axios`
   - ใช้ `next/font` แทนการโหลด external CSS font link
   - ใช้ `next-themes` และ Tailwind classes แทน CSS-in-JS runtime
3. **Fail Explicitly:**
   - ดักจับ Error และส่งกลับ Typed Result เสมอ ห้าม `catch (e) {}` ปล่อยผ่าน
