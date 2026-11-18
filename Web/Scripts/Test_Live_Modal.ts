import { NewsAnalysisController } from '../src/Controllers/News_Analysis_Controller';

async function main() {
  console.log('Testing live Modal engine with NewsAnalysisController...');
  const controller = new NewsAnalysisController();
  const res = await controller.handleCompare('ดื่มน้ำมะนาวผสมโซดาเป็นประจำทุกเช้า ช่วยฆ่าเซลล์มะเร็งได้ดีกว่าเคโมบำบัด 10,000 เท่า');
  console.log('HTTP Status:', res.status);
  console.log('Response Body:', JSON.stringify(res.body, null, 2));
  if (res.status === 200 && res.body.success) {
    console.log('✅ End-to-End Live Modal Verification SUCCESS!');
    process.exit(0);
  } else {
    console.error('❌ Live Modal Verification FAILED!');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
