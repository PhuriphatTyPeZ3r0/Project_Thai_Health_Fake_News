/**
 * OOP Domain Model: NewsEvaluation
 * Encapsulates validation logic, text sanitization, and business integrity rules.
 */

export class NewsEvaluation {
  private readonly rawText: string;
  private readonly sanitizedText: string;
  private readonly validationErrors: string[] = [];

  constructor(text: string) {
    this.rawText = text || '';
    this.sanitizedText = this.sanitize(this.rawText);
    this.validate();
  }

  private sanitize(input: string): string {
    return input
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\t/g, ' ')
      .replace(/ +(?= )/g, ''); // deduplicate spaces
  }

  private validate(): void {
    if (!this.sanitizedText) {
      this.validationErrors.push('กรุณาระบุข้อความข่าวสารสุขภาพที่ต้องการตรวจสอบ');
      return;
    }

    if (this.sanitizedText.length < 5) {
      this.validationErrors.push('ข้อความสั้นเกินไป (ต้องมีอย่างน้อย 5 ตัวอักษร) เพื่อให้โมเดลมีบริบทเพียงพอ');
    }

    if (this.sanitizedText.length > 2000) {
      this.validationErrors.push('ข้อความยาวเกินไป (จำกัดไม่เกิน 2,000 ตัวอักษร)');
    }

    // Check if the text contains Thai characters (\u0E00-\u0E7F)
    const thaiCharRegex = /[\u0E00-\u0E7F]/;
    if (!thaiCharRegex.test(this.sanitizedText)) {
      this.validationErrors.push('ระบบรองรับเฉพาะการวิเคราะห์ข้อความภาษาไทยเป็นหลัก');
    }
  }

  public isValid(): boolean {
    return this.validationErrors.length === 0;
  }

  public getErrors(): string[] {
    return [...this.validationErrors];
  }

  public getText(): string {
    return this.sanitizedText;
  }

  public getRawText(): string {
    return this.rawText;
  }

  public getLength(): number {
    return this.sanitizedText.length;
  }
}
