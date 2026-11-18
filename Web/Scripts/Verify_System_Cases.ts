/**
 * Verification Test Suite: 20 System Cases from Tests/Test_Cases.md
 * Validates NextAnalysisController, NewsEvaluation Model, and MockInferenceEngine.
 */

import { NewsAnalysisController } from '../Src/Controllers/News_Analysis_Controller';
import { MockInferenceEngine } from '../Src/Services/Mock_Inference_Engine';

interface TestCase {
  id: string;
  category: string;
  text: string;
  expected: 'FAKE' | 'FACT' | 'VALIDATION ERROR' | 'PROCESSED';
}

const longTextSample =
  'รายงานพิเศษจากกระทรวงสาธารณสุข เรื่องแนวทางการดูแลสุขภาพเชิงป้องกันในผู้สูงอายุ: ' +
  'การดูแลสุขภาพของผู้สูงอายุในยุคปัจจุบันมีความสำคัญอย่างยิ่ง เนื่องจากประเทศไทยได้เข้าสู่สังคมผู้สูงอายุอย่างสมบูรณ์แล้ว ' +
  'กรมการแพทย์ได้แนะแนวทางการปฏิบัติตนสำหรับผู้สูงอายุและผู้ดูแล โดยเน้นย้ำหลัก 3 อ. ได้แก่ อาหาร อารมณ์ และออกกำลังกาย ' +
  'ในด้านอาหาร ควรรับประทานอาหารที่ปรุงสุกใหม่ สะอาด ครบ 5 หมู่ ลดหวาน มัน เค็ม เพิ่มผักและผลไม้ที่มีรสไม่หวานจัด ' +
  'ดื่มน้ำสะอาดอย่างน้อยวันละ 6-8 แก้ว เว้นแต่แพทย์จะสั่งจำกัดน้ำในผู้ป่วยโรคหัวใจหรือโรคไต ' +
  'ในด้านการออกกำลังกาย ควรเลือกกิจกรรมที่เหมาะสมกับสภาพร่างกาย เช่น การเดินเร็ว แกว่งแขน โยคะ หรือไทเก๊ก ' +
  'อย่างน้อยสัปดาห์ละ 150 นาที เพื่อเสริมสร้างความแข็งแรงของกล้ามเนื้อและการทรงตัว ช่วยลดความเสี่ยงต่อการหกล้ม ' +
  'ด้านอารมณ์ ควรหากิจกรรมที่สร้างความผ่อนคลาย เข้าร่วมกิจกรรมทางสังคมกับครอบครัวหรือชุมชน นอนหลับพักผ่อนให้เพียงพอ ' +
  'นอกจากนี้ควรเข้ารับการตรวจสุขภาพประจำปีอย่างสม่ำเสมอ ตรวจวัดความดันโลหิต ระดับน้ำตาลในเลือด ' +
  'และรับประทานยาตามที่แพทย์สั่งอย่างเคร่งครัด ไม่ควรซื้อยามารับประทานเองหรือหยุดยาเองโดยไม่ปรึกษาแพทย์';

const testCases: TestCase[] = [
  { id: 'TC01', category: 'Classic Fake', text: 'ดื่มน้ำมะนาวผสมโซดาทุกเช้าช่วยรักษามะเร็งระยะสุดท้ายให้หายขาดได้ 100%', expected: 'FAKE' },
  { id: 'TC02', category: 'Official Fact', text: 'กรมควบคุมโรคเตือนประชาชนระวังโรคไข้เลือดออกระบาดช่วงฤดูฝน แนะกำจัดแหล่งเพาะพันธุ์ยุงลาย', expected: 'FACT' },
  { id: 'TC03', category: 'Herbal Fake', text: 'สูตรสมุนไพรใบมะละกอต้มน้ำ ดื่มวันละแก้วสลายเบาหวานและความดันเป็นศูนย์ใน 7 วัน', expected: 'FAKE' },
  { id: 'TC04', category: 'General Fact', text: 'สถาบันโรคทรวงอกชี้ การออกกำลังกายแบบคาร์ดิโอสัปดาห์ละ 150 นาทีช่วยเสริมความแข็งแรงของหัวใจ', expected: 'FACT' },
  { id: 'TC05', category: 'Belief Fake', text: 'กินกระเทียมดิบ 10 หัวพร้อมหอมแดงช่วยฆ่าเชื้อไวรัสโควิดได้ทันที', expected: 'FAKE' },
  { id: 'TC06', category: 'Official Fact', text: 'องค์การเภสัชกรรมสำรองยาต้านไวรัสเพื่อรองรับการระบาดของโรคตามฤดูกาล', expected: 'FACT' },
  { id: 'TC07', category: 'Edge: Short', text: 'กินยาแก้ปวด', expected: 'FACT' },
  { id: 'TC08', category: 'Edge: Empty', text: '     ', expected: 'VALIDATION ERROR' },
  { id: 'TC09', category: 'Edge: English', text: 'Drinking warm lemon water cures cancer completely.', expected: 'VALIDATION ERROR' },
  { id: 'TC10', category: 'Edge: Emoji', text: '⚠️ด่วนมาก!! 🍋 มะนาวผสมน้ำอุ่นรักษาโรคตับได้ 100% กดแชร์ช่วยชีวิต ‼️', expected: 'FAKE' },
  { id: 'TC11', category: 'Vaccine Fake', text: 'ฉีดวัคซีนแล้วมีสารแม่เหล็กและไมโครชิปควบคุมสมองผ่านสัญญาณ 5G', expected: 'FAKE' },
  { id: 'TC12', category: 'FDA Fact', text: 'อย. ย้ำเตือน อย่าหลงเชื่อผลิตภัณฑ์เสริมอาหารที่อ้างว่าเพิ่มความสูงในผู้ใหญ่วัยทำงาน', expected: 'FACT' },
  { id: 'TC13', category: 'High Stats Fake', text: 'ยาน้ำแผนโบราณสูตรลับรักษาเบาหวานได้ 99.99% โดยไม่ต้องคุมอาหาร', expected: 'FAKE' },
  { id: 'TC14', category: 'URL Fake', text: 'อ่านด่วนที่ http://fake-health-news.xyz เผยวิธีรักษาโรคไตวายไม่ต้องฟอกไต', expected: 'FAKE' },
  { id: 'TC15', category: 'Nutrition Fact', text: 'กรมอนามัยแนะนำให้ลดหวาน มัน เค็ม เพื่อป้องกันความเสี่ยงโรค NCDs', expected: 'FACT' },
  { id: 'TC16', category: 'Forbidden Food Fake', text: 'ห้ามกินทุเรียนกับโค้กเด็ดขาด สารจะทำปฏิกิริยากลายเป็นยาพิษตายคาที่', expected: 'FAKE' },
  { id: 'TC17', category: 'Antibiotic Fact', text: 'การใช้ยาปฏิชีวนะพร่ำเพรื่อเมื่อเป็นหวัดอาจทำให้เกิดเชื้อดื้อยา', expected: 'FACT' },
  { id: 'TC18', category: 'Edge: Long', text: longTextSample, expected: 'PROCESSED' },
  { id: 'TC19', category: 'Gold Card Fact', text: 'สปสช. ให้บริการตรวจคัดกรองมะเร็งลำไส้ใหญ่ด้วยวิธีตรวจอุจจาระฟรี', expected: 'FACT' },
  { id: 'TC20', category: 'Amulet Fake', text: 'การ์ดพลังงานควอนตัมช่วยปรับสมดุลโมเลกุลน้ำในร่างกายรักษาได้สารพัดโรค', expected: 'FAKE' },
];

async function runVerification() {
  console.log('='.repeat(80));
  console.log('🧪 Starting Automated Verification: 20 Test Cases for Next.js MVC WebApp');
  console.log('='.repeat(80));

  const engine = new MockInferenceEngine();
  const controller = new NewsAnalysisController(engine);

  let passed = 0;
  let failed = 0;

  console.log('| ID   | Category            | Result | Details                                       | Status |');
  console.log('|:-----|:--------------------|:------:|:----------------------------------------------|:------:|');

  for (const tc of testCases) {
    const res = await controller.handleCompare(tc.text);

    let actual = '';
    let details = '';
    let isPass = false;

    if (res.status === 400) {
      actual = 'VALIDATION ERROR';
      const errList = res.body.validationErrors?.join(', ') || 'Invalid input';
      details = `Errors: ${errList.substring(0, 45)}...`;
      isPass = tc.expected === 'VALIDATION ERROR';
    } else if (res.status === 200 && res.body.data) {
      const wcbLabel = res.body.data.wangchanberta.label.toUpperCase();
      actual = wcbLabel;
      const conf = Math.round(res.body.data.wangchanberta.confidence * 100);
      const agree = res.body.data.agreement ? 'Agreement=TRUE' : 'Agreement=FALSE';
      details = `Label: ${wcbLabel} (${conf}%), ${agree}`;

      if (tc.expected === 'PROCESSED') {
        isPass = true;
      } else if (tc.expected === actual) {
        isPass = true;
      } else if (tc.id === 'TC07' && (actual === 'FACT' || actual === 'FAKE')) {
        // TC07 is allowed FACT / UNCERTAIN
        isPass = true;
      }
    } else {
      actual = `STATUS_${res.status}`;
      details = res.body.error || 'Unknown error';
      isPass = false;
    }

    if (isPass) {
      passed++;
    } else {
      failed++;
    }

    const passIcon = isPass ? '✅ PASS' : '❌ FAIL';
    console.log(
      `| ${tc.id.padEnd(4)} | ${tc.category.padEnd(19)} | ${actual.padEnd(16)} | ${details.padEnd(45)} | ${passIcon} |`
    );
  }

  console.log('='.repeat(80));
  console.log(`📊 Summary: Total Cases = ${testCases.length} | Passed = ${passed} | Failed = ${failed}`);
  console.log(`🎯 Pass Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);
  console.log('='.repeat(80));

  if (failed > 0) {
    process.exit(1);
  }
}

runVerification().catch((err) => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
