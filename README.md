# Financial Highlights Updater

เว็บสำหรับอัปเดตโค้ด Financial Highlights จาก workbook โดยรับโค้ด HTML/Vue และ JavaScript เดิมแยกช่อง พร้อมไฟล์ต้นทาง `.xlsx`, `.xls`, `.csv` หรือ `.tsv` แล้วส่งคืนโค้ดที่อัปเดตแล้วแยกช่อง

## ข้อมูลที่ต้องใส่

- เลือกภาษาเว็บ: ไทย, อังกฤษ หรือทั้งสองภาษา
- วาง HTML/Vue และ/หรือ JavaScript ที่ต้องการอัปเดต หรือระบุ path ของไฟล์โค้ด
- แนบ workbook/CSV ที่มีข้อมูล Financial Highlights ระบบอ่านงวดจากไฟล์ ไม่ต้องกรอกงวดเอง

ระบบใช้เฉพาะชีตที่ชื่อ Financial Highlights และอัปเดตเนื้อหาสำหรับ Financial Highlights เท่านั้น โดยใช้แถวสรุปสำหรับ chart/card และแถวรายละเอียดสำหรับตารางตามโครงสร้างใน workbook

## Deploy ด้วย GitHub และ Vercel

GitHub ใช้เก็บ source code ส่วน API ทำงานบน Vercel

1. Push โฟลเดอร์โปรเจกต์นี้ขึ้น GitHub
2. Import repository เข้า Vercel
3. เพิ่ม Environment Variables ใน Vercel:
   - `OPENAI_API_KEY` — API key สำหรับ backend เท่านั้น
   - `OPENAI_MODEL` — ไม่บังคับ; ค่าเริ่มต้น `gpt-6-astra`
4. Deploy แล้วเปิด URL ของ Vercel

อย่าใส่ API key ใน `dist/index.html`, JavaScript ฝั่ง browser หรือ GitHub repository

## ข้อจำกัด

- ไฟล์ต้นทางรวมไม่เกิน 2.4 MB ต่อคำขอ, snippet รวมไม่เกิน 300,000 ตัวอักษร และข้อมูลที่สกัดได้ไม่เกิน 500,000 ตัวอักษร
- ถ้า workbook ไม่มีชีตชื่อ Financial Highlights ระบบจะแจ้งชื่อชีตที่พบ และไม่ใช้ข้อมูลจากชีตอื่น
- ไฟล์และโค้ดจะถูกส่งจาก backend ไปยัง OpenAI Responses API เพื่อประมวลผล โดย backend ไม่บันทึกไฟล์ลงโปรเจกต์
- `OPENAI_API_KEY` ต้องตั้งใน environment ของ Vercel ก่อนเรียก API ได้
