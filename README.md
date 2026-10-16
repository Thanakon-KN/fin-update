# IR Update Studio

เว็บรับ HTML/Vue, JavaScript และไฟล์ต้นทาง แล้วส่งไปประมวลผลตามกติกาของ `skill-update-fs` ผลลัพธ์ HTML/Vue และ JavaScript แสดงแยกช่อง พร้อมช่องหมายเหตุหรือรายงานตรวจสอบ

## วิธีติดตั้งจาก GitHub

GitHub ใช้เก็บ source code ส่วน API ต้องรันบน serverless host เช่น Vercel; GitHub Pages ใช้เสิร์ฟหน้า static ได้ แต่ไม่รัน API route นี้

1. Push โฟลเดอร์โปรเจกต์นี้ขึ้น GitHub
2. Import repository เข้า Vercel โดยตั้ง Root Directory เป็นโฟลเดอร์โปรเจกต์
3. เพิ่ม Environment Variables ใน Vercel:
   - `OPENAI_API_KEY` — API key สำหรับ backend เท่านั้น
   - `OPENAI_MODEL` — ไม่บังคับ; ค่าเริ่มต้น `gpt-6-astra`
4. Deploy แล้วเปิด URL ของ Vercel

อย่าใส่ API key ใน `dist/index.html`, JavaScript ฝั่ง browser หรือ GitHub repository ใช้ deployment protection หรือการยืนยันตัวตนก่อนเปิดให้ผู้ใช้ทั่วไป เพราะ API นี้มีค่าใช้จ่ายตามการเรียกโมเดล

## ประเภทแหล่งข้อมูล

- Financial highlights, homepage KPI/chart, quarterly, shareholder และ audit: `.xlsx`, `.xls`, `.csv`, `.tsv`
- Press release และ director profile: `.docx`
- Audit ต้องระบุ UAT/Live URL
- ไม่ต้องกรอกงวดเอง; ให้อ่านงวดจาก source file

ไฟล์ต้นทางและโค้ดที่กรอกจะถูกส่งจาก backend ไปยัง OpenAI Responses API เพื่อประมวลผล โดย backend ไม่บันทึกไฟล์ลงโปรเจกต์

## ข้อจำกัด

- ไฟล์ต้นทางรวมไม่เกิน 2.4 MB ต่อคำขอ, snippet รวมไม่เกิน 300,000 ตัวอักษร และข้อมูลที่สกัดได้ไม่เกิน 500,000 ตัวอักษร
- งาน Word แปลง DOCX เป็น HTML ระหว่างประมวลผลเพื่อคง run-level bold
- UAT/Live audit ใช้ web search tool ผ่าน Responses API; ตรวจสอบให้ URL สามารถเข้าถึงได้จากอินเทอร์เน็ต
- `OPENAI_API_KEY` ต้องตั้งใน environment ของ Vercel ก่อนเรียก API ได้
