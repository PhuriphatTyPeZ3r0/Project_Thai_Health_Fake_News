'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900 shadow-sm">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm leading-relaxed">
          <p className="font-semibold text-amber-900">
            ข้อจำกัดความรับผิดชอบและการใช้งาน (Medical Disclaimer)
          </p>
          <p className="text-amber-800 mt-0.5">
            ระบบนี้เป็นโครงงานศึกษาทางวิชาการและเครื่องมือประมวลผลภาษาธรรมชาติ (NLP) เพื่อช่วยคัดกรองเบื้องต้นเท่านั้น
            ผลการจำแนกมิใช่ข้อวินิจฉัยทางการแพทย์อย่างเป็นทางการ โปรดตรวจสอบกับแหล่งข้อมูลของกระทรวงสาธารณสุขหรือปรึกษาแพทย์ผู้เชี่ยวชาญก่อนตัดสินใจใด ๆ
          </p>
        </div>
      </div>
    </div>
  );
};
