# Financial Highlights Updater

เว็บสำหรับอัปเดตโค้ด Financial Highlights จาก workbook โดยรับโค้ด HTML/Vue และ JavaScript เดิมแยกช่อง พร้อมไฟล์ต้นทาง `.xlsx`, `.xls`, `.csv` หรือ `.tsv` แล้วส่งคืนโค้ดที่อัปเดตแล้วแยกช่อง

## ข้อมูลที่ต้องใส่

- เลือกภาษาเว็บ: ไทย, อังกฤษ หรือทั้งสองภาษา
- วาง HTML/Vue และ/หรือ JavaScript ที่ต้องการอัปเดต หรือระบุ path ของไฟล์โค้ด
- แนบ workbook/CSV ที่มีข้อมูล Financial Highlights ระบบอ่านงวดจากไฟล์ ไม่ต้องกรอกงวดเอง

ระบบใช้เฉพาะชีตที่ชื่อ Financial Highlights และอัปเดตเนื้อหาสำหรับ Financial Highlights เท่านั้น โดยใช้แถวสรุปสำหรับ chart/card และแถวรายละเอียดสำหรับตารางตามโครงสร้างใน workbook

## Deploy สำหรับ GitHub Pages

GitHub Pages เสิร์ฟหน้าเว็บแบบ static ส่วน API ต้อง deploy แยกบน Vercel

1. Push โฟลเดอร์โปรเจกต์นี้ขึ้น GitHub
2. Import repository เข้า Vercel และ deploy API พร้อมหน้าเว็บ
3. หลัง Vercel deploy เสร็จ ให้นำ origin ของ Vercel เช่น `https://your-project.vercel.app` ไปใส่ใน `api-config.js` และ `dist/api-config.js`:
   - `window.IR_UPDATE_API_BASE_URL = 'https://your-project.vercel.app';`
   - ถ้า frontend และ API ใช้ Vercel origin เดียวกัน ให้ปล่อยค่าว่างไว้
4. ตั้ง Environment Variables ใน Vercel:
   - `OPENAI_API_KEY` — API key สำหรับ backend เท่านั้น
   - `OPENAI_MODEL` — ไม่บังคับ; ค่าเริ่มต้น `gpt-6-astra`
   - `ALLOWED_ORIGINS` — `https://thanakon-kn.github.io` เพื่ออนุญาตให้หน้า GitHub Pages เรียก API
5. Commit การเปลี่ยนแปลง แล้วเปิด GitHub Pages URL อีกครั้ง

อย่าใส่ API key ใน `api-config.js`, `dist/api-config.js`, HTML/JavaScript ฝั่ง browser หรือ GitHub repository

## ข้อจำกัด

- ไฟล์ต้นทางรวมไม่เกิน 2.4 MB ต่อคำขอ, snippet รวมไม่เกิน 300,000 ตัวอักษร และข้อมูลที่สกัดได้ไม่เกิน 500,000 ตัวอักษร
- ถ้า workbook ไม่มีชีตชื่อ Financial Highlights ระบบจะแจ้งชื่อชีตที่พบ และไม่ใช้ข้อมูลจากชีตอื่น
- ไฟล์และโค้ดจะถูกส่งจาก backend ไปยัง OpenAI Responses API เพื่อประมวลผล โดย backend ไม่บันทึกไฟล์ลงโปรเจกต์
- `OPENAI_API_KEY` ต้องตั้งใน environment ของ Vercel ก่อนเรียก API ได้
- API รองรับ CORS จาก GitHub Pages origin `https://thanakon-kn.github.io` และ origins ที่ระบุใน `ALLOWED_ORIGINS`
