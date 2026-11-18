# รายงานผลการทำงาน P3 (AI Engineer) — Pull Request และส่งมอบงานต่อ

**ผู้รับผิดชอบ:** กฤษขจร จิรวงศ์รุ่งเรือง (P3, `6752300216`, @Kitkhachon-xx)
**Branch:** `feat/6752300216-finetune-wcb` → **Base:** `main` · **วันที่:** 18 พ.ย. 2026
**Issue:** #4 (F1), #9 (F2), #12 (F3) · PR ก่อนหน้า #18 (สคริปต์ตั้งต้น) merge เข้า main แล้ว PR นี้คือส่วนที่เพิ่มหลังจากนั้น

> **ชื่อ PR:** `feat(finetune): fine-tuned WangchanBERTa served on Modal, sliding-window inference, eval/compare scripts (F1-F3)`
> เนื้อหาตั้งแต่หัวข้อ "1. สรุป" คัดลอกไปวางเป็น description ของ PR ได้

---

## 1. สรุป
ส่งมอบโมเดล WangchanBERTa ที่ fine-tune บนชุด LimeSoda ตั้งแต่ขั้นเตรียมสคริปต์จนถึง **API ที่ deploy แล้วบน Modal** รองรับข้อความยาวเกิน 416 token ด้วย sliding window ประเมินบน `test.csv` และเทียบกับ Baseline ของ P2

- โมเดล: [`Kitkhachon/wcb-limesoda-fakenews`](https://huggingface.co/Kitkhachon/wcb-limesoda-fakenews) (deploy pin ที่ revision แรก `84d5db0935db11bf7681b3b9e5c5cbf0f0b9fea7`)
- API: `https://kitkhachon-xx--thai-health-fakenews-inference-fastapi-app.us-east.modal.run` (`/health`, `/predict`, `/compare`) มี **rate limit และตัวกันโหลดเกิน** (ข้อ 4)
- ผลบน test (321 ข่าว): **F1-macro 0.9122** เทียบกับ Baseline 0.8969 — **ต่างกันอย่างไม่มีนัยสำคัญทางสถิติ** (ดูข้อ 3)

Closes #4 · Closes #9 · Closes #12

## 2. ไฟล์ที่เปลี่ยน
| ไฟล์ | รายละเอียด |
|---|---|
| `Src/Windowing.py` (ใหม่) | `make_chunks` / `doc_probs` / `aggregate_by_doc`: แบ่งเอกสารเป็นหน้าต่าง 416 token (stride 64, สูงสุด 8 หน้าต่าง) แล้วเฉลี่ย softmax ต่อเอกสาร ใช้ร่วมกันทั้งตอนเทรน ประเมิน และ API |
| `Src/Fine_Tune.py` | ใช้ sliding window, path `Data/Processed/{train,val,test}.csv`, `eval_strategy` / `processing_class`, เลือก checkpoint ตาม F1-macro (val) ระดับเอกสาร, `--push-to-hub` |
| `Src/Predict.py` | โหลดโมเดลที่เทรนเอง (ค่าเริ่มต้น `Kitkhachon/wcb-limesoda-fakenews`, ตั้งได้ด้วย env), sliding window, **ไม่มี stub ปลอม** (ล้มเหลวแล้ว raise → API ตอบ 503), ดาวน์โหลดไฟล์ก่อน import torch |
| `Services/Inference/App.py` | โหลดโมเดลตอนเริ่ม, `/health` สะท้อนสถานะจริง (503 ถ้าโมเดลไม่พร้อม), จำกัดข้อความ 2,000 ตัวอักษรให้ตรงกับ Web, ต่อ rate-limit middleware |
| `Services/Inference/Rate_Limit.py` (ใหม่) | จำกัด 30 คำขอ/นาที/ผู้เรียก (เกิน → 429 + `Retry-After`) และงานพร้อมกันไม่เกิน 4 ต่อ container (เกิน → 503) ยกเว้น `/health` และหน้า docs ไม่ใช้ไลบรารีเพิ่ม |
| `Services/Inference/Modal_App.py` | image มีโค้ดและข้อมูล, pin โมเดลที่ revision, เทรน baseline ใน image, รันแบบออฟไลน์, pin เวอร์ชันไลบรารี |
| `Src/Evaluate.py` (ใหม่) | ประเมินโมเดลจาก Hub (หรือโฟลเดอร์ในเครื่อง) บน test.csv บันทึก metrics และ prediction |
| `Src/Visualize.py` (ใหม่) | กราฟ metrics รวม / รายคลาส / confusion matrix |
| `Src/Compare_Eval.py` (ใหม่) | เทียบ Baseline กับ WangchanBERTa ด้วย prediction จริง + McNemar + bootstrap CI |
| `Tests/Test_Fine_Tune.py` (ใหม่) | unit test 2 ข้อ (การแบ่งหน้าต่าง/จำกัดจำนวน, การรวมผลรายเอกสาร) |
| `Tests/Test_Rate_Limit.py` (ใหม่) | unit test 4 ข้อ (429 + `Retry-After`, `/health` ไม่ถูกจำกัด, ผู้เรียกแยกกัน/หน้าต่างเวลารีเซ็ต, ปลอม `X-Forwarded-For` เลี่ยงไม่ได้, งานพร้อมกันเกิน → 503) |
| `KANBAN.md` | ติ๊ก #F1–F3 |
| `Results/*` | `Metrics_Wcb.json`, `Metrics_Baseline.json`, `Preds_Wcb.csv`, `Compare_Eval.md`, กราฟ 2 ไฟล์ (ผลของรุ่นแรกที่ deploy) และผลของรุ่นหลังที่ `*_rev9566917.*` |
| `P3_PLAN.md` | ลบออกตามที่ตกลง |

## 3. ผลการประเมิน (test.csv, n = 321, โมเดล revision แรก `84d5db09…`)
| ตัวชี้วัด | Baseline (TF-IDF+LogReg) | WangchanBERTa | ผลต่าง |
|---|---:|---:|---:|
| Accuracy | 0.8972 | 0.9128 | +0.0156 |
| Precision (fake) | 0.9212 | 0.9091 | −0.0121 |
| Recall (fake) | 0.8837 | 0.9302 | +0.0465 |
| **F1-macro** | **0.8969** | **0.9122** | **+0.0153** |
| F1 (fake) | 0.9021 | 0.9195 | +0.0174 |

รายคลาส (precision / recall / F1): fact — Baseline 0.8718 / 0.9128 / 0.8918 · WangchanBERTa 0.9172 / 0.8926 / 0.9048; fake — Baseline 0.9212 / 0.8837 / 0.9021 · WangchanBERTa 0.9091 / 0.9302 / 0.9195
Confusion matrix (fact, fake): Baseline `[[136,13],[20,152]]` · WangchanBERTa `[[133,16],[12,160]]`

**ความต่างไม่มีนัยสำคัญ:** จับคู่บนเอกสารเดียวกัน Baseline ถูกฝ่ายเดียว 9, WangchanBERTa ถูกฝ่ายเดียว 14, ผิดทั้งคู่ 19 → McNemar exact **p = 0.405**; bootstrap 95% CI ของผลต่าง F1-macro = **[−0.015, +0.044]** (คร่อมศูนย์) ควรเขียนว่า "ใกล้เคียงกัน" ไม่ใช่ "ชนะ"

ลักษณะที่ต่างกัน: WangchanBERTa จับข่าวปลอมได้มากกว่า (recall 0.930) แต่ทายข่าวจริงเป็นปลอมมากกว่า (16 เทียบกับ 13)

**หมายเหตุเรื่อง revision:** repo บน Hub มี 2 รุ่นที่ใช้งานได้ รุ่นแรก `84d5db09…` (อัปโหลด 13:25 UTC; **deploy อยู่ตอนนี้**) และรุ่นที่ push ทับภายหลัง `9566917a…` (13:42 UTC) ที่ได้ F1-macro 0.9054 (accuracy 0.9065, recall 0.9477, McNemar เทียบ Baseline p = 0.701) ผลของรุ่นหลังเก็บไว้ที่ `Results/*_rev9566917.*` เลือกรุ่นแรกเพราะผลบน test สูงกว่าเล็กน้อย (ต่างกันไม่มีนัยสำคัญ และเลือกจากชุดทดสอบเดียวกับที่ใช้รายงาน จึงอาจให้ภาพดีเกินจริงเล็กน้อย) ไม่ใช่เพราะทราบการตั้งค่าการเทรนที่ต่างกัน

## 4. การ Deploy
- Deploy บน Modal ด้วย `modal deploy Services/Inference/Modal_App.py` (T4 GPU, scale-to-zero หลังว่าง 5 นาที, **`max_containers=2`** เป็นเพดานจำนวน GPU และค่าใช้จ่าย, container ละไม่เกิน 8 คำขอพร้อมกัน) deploy ล่าสุดรวม rate limit แล้ว
- โมเดลและ baseline ถูกฝังใน image ตอน build (baseline เทรนจาก `Data/Processed/train.csv` ใน image) runtime ใช้แคชอย่างเดียว (`HF_HUB_OFFLINE=1`) cold start ราว 15 วินาที
- ทดสอบผ่าน HTTP จริงแล้ว: `/health` 200 (โมเดลโหลดแล้ว), `/predict` (`both`) 200, `/compare` 200 ตรวจว่าเวอร์ชันที่ให้บริการคือ `84d5db09…` ผ่าน `/health` และทำนาย 60 ข่าวจาก test ผ่าน API จริงได้ตรงกับ prediction ของรุ่นแรก 60/60 (รุ่นหลังตรง 56/60)
- **Rate limit / กัน service ล่ม** (`Rate_Limit.py`): 30 คำขอ/นาที/ผู้เรียก → 429 พร้อม `Retry-After`; งานพร้อมกันเกิน 4 ต่อ container → 503 (ไม่ให้คิวสะสมรอ GPU); `/health` ไม่ถูกจำกัด; ปรับด้วย env `RATE_LIMIT_PER_MIN`, `MAX_CONCURRENT` ใน `Modal_App.py`
  - ตัวนับอยู่ในหน่วยความจำของแต่ละ container จึงเป็นโควตา **ต่อ container** (ผู้เรียกคนเดียวใช้ได้สูงสุดราว 30 × 2 = 60 ครั้ง/นาที) และหายเมื่อ container รีสตาร์ท
  - ระบุผู้เรียกจากที่อยู่สุดท้ายของ `X-Forwarded-For` (ค่าที่ proxy เติมเอง ปลอมไม่ได้) **ยังไม่ได้ทดสอบกับ proxy ของ Modal จริงบนบริการที่ deploy** ถ้า Modal มี proxy หลายชั้น ผู้ใช้ทั้งหมดอาจถูกนับเป็นผู้เรียกเดียวกันและใช้โควตาร่วม
- **ยังไม่มีการยืนยันตัวตน:** ใครมี URL ก็เรียกได้ภายในโควตา และใช้ GPU ของบัญชี หยุดบริการ: `modal app stop thai-health-fakenews-inference`

## 5. การตรวจสอบที่ทำแล้ว / ยังไม่ได้ทำ
**ทำแล้ว**
- `pytest Tests` ผ่าน 28/28 (รวมเทสต์ของ P1/P2 หลัง merge main และเทสต์ rate limit 4 ข้อ)
- Rate limit กับแอปจริงและโมเดลจริงในเครื่อง (ตั้งโควตา 3): คำขอ 1–3 ได้ 200, ที่ 4 เป็นต้นไปได้ 429 + `Retry-After: 60`, `/health` ได้ 200, 429 มี CORS header
- หลัง deploy รอบล่าสุด: `/health` 200 (cold start ~58 วินาที), revision `84d5db09…`, โมเดลโหลดแล้ว
- API ในเครื่อง: ทำนาย 80 ข่าวแรกของ test ผ่านโค้ดของ API ตรงกับ prediction ของ `Evaluate.py` ทั้ง 80 ข่าว (ทดสอบกับรุ่นแรก)
- สถานะล้มเหลว: ตั้งชื่อโมเดลผิด → API ตอบ 503 ไม่ตอบค่าปลอม
- Smoke test บน Modal (build image เดียวกับที่ deploy) และทดสอบ endpoint ผ่าน HTTP หลัง deploy

**ยังไม่ได้ทำ**
- ไม่ได้ตรวจ log การเทรนและไม่ทราบว่า epoch/สคริปต์เวอร์ชันใดสร้างโมเดลบน Hub (ถ้าใช้ `Fine_Tune.py` น่าจะเป็น epoch ที่ val F1-macro สูงสุด แต่ยังไม่ยืนยัน)
- ไม่ได้ทดลองหลาย seed หรือจูน hyperparameter เพิ่ม (ค่าตาม issue #9)
- ไม่ได้ทดสอบการเชื่อมต่อจาก Web (Next.js) ของ P5 กับ API นี้
- **ไม่ได้ทดสอบ rate limit บนบริการที่ deploy จริง** (ไม่ได้ยิงทดสอบถี่ๆ ใส่บริการสาธารณะ) จึงยังไม่ทราบว่า proxy ของ Modal ส่งที่อยู่ผู้เรียกมาแบบไหน
- ไม่ได้ทดสอบภาระหนัก/ผู้ใช้พร้อมกันหลายคน และค่า 30 คำขอ/นาที, 4 งานพร้อมกัน เป็นค่าที่ P3 ตั้งเอง ยังไม่ได้เทียบกับพฤติกรรมการเรียกของ Web

## 6. สิ่งที่ต้องส่งต่อ
| ถึง | สิ่งที่ต้องรู้ / ต้องทำ |
|---|---|
| **P5** | ใส่ URL ของ API ใน env ของ Next.js (ผมไม่ได้ตรวจว่า Web ใช้ชื่อ env อะไร) · `model_type` รับ `wangchanberta` / `baseline` / `both` (ค่าอื่นตกไปใช้ WangchanBERTa เหมือนเดิม) · ข้อความสูงสุด 2,000 ตัวอักษร · response มีฟิลด์ `windows` เพิ่ม · API ตอบ **503** เมื่อโมเดลไม่พร้อม (แต่ก่อนจะตอบค่าปลอม) ควรให้ Web แสดงข้อความ error · ตัดสินใจเรื่อง auth/rate limit · **API มี rate limit:** 30 คำขอ/นาที/ผู้เรียก เกินแล้วได้ **429** (มี header `Retry-After`) และเมื่อเซิร์ฟเวอร์ยุ่งได้ **503** ให้ Web แสดงข้อความให้ลองใหม่และหน่วงการเรียกซ้ำ · หนึ่งการวิเคราะห์แบบ `both` นับเป็น 1 คำขอ |
| **P4** | `Src/Compare.py` มีค่า default ที่แต่งขึ้น (เช่น F1-macro baseline 0.70 / WangchanBERTa 0.88) และ `Errors.csv` เขียนมือ 4 แถว **ต้องลบก่อนส่ง** · ใช้ `Results/Compare_Eval.md` และ `Preds_Wcb.csv` เป็นตัวเลขจริง · ข่าวที่ทั้งสองโมเดลพลาดตรงกันมี 19 ข่าว (เทียบ `Preds_Wcb.csv` กับ `test.csv`) เหมาะทำ error analysis · ตัวอย่างข้อความสั้น "กระทรวงสาธารณสุขแนะนำให้ล้างมือด้วยสบู่…20 วินาที" โมเดลตอบ `fake` (0.854) ส่วน baseline ตอบ `fact` |
| **P2** | `Baseline.py` / `Metrics.py` ที่แก้ใน PR #19 ใช้งานได้ (Modal เทรน baseline ด้วยโค้ดนี้) ชื่อไฟล์ `Models/Baseline_Model.joblib` · ตัวเลข baseline ในรายงานนี้ได้จากการรันโดย P3 ควรตรวจว่าตรงกับของ P2 |
| **P6** | ใช้ตารางข้อ 3 และข้อสรุป "ใกล้เคียงกัน ไม่มีนัยสำคัญ" ห้ามเขียนว่า Transformer ชนะ · ระบุข้อจำกัดข้อ 7 ใน README/สไลด์ · ข้อความยาวใช้ sliding window |

## 7. ความเสี่ยงและข้อจำกัด
1. **ความต่างระหว่างโมเดลไม่มีนัยสำคัญ** ชุดทดสอบมีแค่ 321 ข่าว
2. **ข้อความสั้น/ประโยคเดียวอาจอยู่นอกการกระจายของข้อมูล:** ข้อมูลเทรนเป็นข่าวยาว (ค่ากลาง ~1,640 ตัวอักษร) พบตัวอย่างข่าวจริงที่ถูกทายเป็นปลอมด้วยความมั่นใจสูง (1 ตัวอย่าง ไม่ใช่ค่าสถิติ)
3. **โมเดลบน Hub ถูกเขียนทับได้:** ไม่มี tag/model card (README เป็นแม่แบบว่าง) deploy ปัจจุบัน pin ไว้ที่ `84d5db09…` (รุ่นแรก) ถ้าจะเปลี่ยนต้องแก้ `MODEL_REVISION` ใน `Modal_App.py` ประเมินใหม่ และ deploy ซ้ำ `HUB_MODEL_ID` ใน `Fine_Tune.py` ตั้งเป็น `...-v2` ซึ่ง **ยังไม่มีบน Hub**
4. **tokenizer บน Hub ไม่เข้ากับ transformers 4.57.6** (บันทึกด้วยรุ่นใหม่กว่า) โค้ดจึงใช้ tokenizer ของโมเดลฐานแทน (ไม่ต่างจากหลัง fine-tune)
5. **ข้อความเกิน 8 หน้าต่าง** (~12,000 ตัวอักษร) ถูกตัดส่วนท้าย
6. **ความต่างของผลระหว่างครั้งรัน:** confidence ของข้อความเดียวกันต่างกันเล็กน้อยระหว่างเครื่อง/GPU (เช่น 0.9274 ในเครื่อง, 0.9385 บน Modal (รุ่นหลัง)) label ไม่เปลี่ยนในตัวอย่างที่ทดสอบ
7. **Repo เป็น public** ตรวจก่อนเผยแพร่ว่าไม่มีข้อมูลที่ไม่ควรเปิดเผย

## 8. Checklist ก่อน Merge
- [x] commit `Results/` และไฟล์รายงานนี้ (`Metrics_Wcb.json` เป็นหลักฐานของ issue #12)
- [x] เพิ่ม rate limit และเพดาน container แล้ว · [ ] ตัดสินใจเพิ่ม auth (API key) ให้เรียกได้เฉพาะ Web หรือเปิดสาธารณะต่อ · [ ] ตรวจพฤติกรรม rate limit หลัง proxy ของ Modal (ยิงทดสอบตอนที่เจ้าของบริการพร้อม)
- [ ] แจ้ง P5 (URL) และ P4 (แก้ `Compare.py`)
- [ ] ตัดสินใจเรื่อง revision ของโมเดลและเติม model card บน Hub

## 9. ขั้นตอนถัดไป (ถ้ามีเวลา)
- เติม model card (ข้อมูลเทรน, hyperparameter, ผล test, ข้อจำกัด) และสร้าง tag บน Hub
- ลอง hyperparameter เพิ่ม: warmup, LR {2e-5, 3e-5, 5e-5}, หลาย seed, รวมผลกับ Baseline (ตัดสินจาก val เท่านั้น เก็บรอบตาม spec #9 เป็นผลหลัก)
- เพิ่ม auth (API key) ให้ API และเปลี่ยนตัวนับ rate limit เป็นแบบใช้ร่วมกันข้าม container ถ้าต้องการโควตาที่แน่นอน

## 10. วิธีรัน / ทำซ้ำ
```bash
pip install -r requirements.txt
python -m Src.Fine_Tune --output-dir <โฟลเดอร์> --push-to-hub   # เทรน + ประเมิน + push (Colab GPU)
python -m Src.Evaluate --model-id Kitkhachon/wcb-limesoda-fakenews --output Results/Metrics_Wcb.json
python -m Src.Visualize                      # กราฟ metrics
python -m Src.Compare_Eval                   # เทียบ Baseline + McNemar
python Services/Inference/App.py             # รัน API ในเครื่อง → http://127.0.0.1:8000/docs
python -m pytest Tests -q
modal deploy Services/Inference/Modal_App.py # deploy (ต้อง pip install modal และ modal setup)
```
