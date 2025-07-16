# Phu Phan Place Hotel Backend

## โครงสร้างโปรเจกต์

```
server/
  controllers/      # จัดการ logic ของแต่ละโดเมน (booking, user, room, ...)
  routes/           # กำหนด API endpoint ของแต่ละโดเมน
  middlewares/      # ฟังก์ชันกลาง เช่น auth, error handler
  services/         # (ใหม่) แยก business logic ออกจาก controller
  utils/            # (ใหม่) ฟังก์ชันช่วยเหลือที่ใช้ซ้ำ
  config/           # การตั้งค่า เช่น prisma.js
  prisma/           # schema และ migration
    migrations/
    schema.prisma
  server.js         # จุดเริ่มต้นแอป
  package.json
  .env              # ตัวแปรลับ/ตั้งค่ารันจริง
  .env.example      # ตัวอย่าง env
  README.md         # คู่มือ backend
```

## วิธีเริ่มต้น

1. ติดตั้ง dependencies
   ```
   npm install
   ```
2. ตั้งค่าไฟล์ `.env` (ดูตัวอย่างใน `.env.example`)
3. (ถ้ามี database) รัน migration
   ```
   npx prisma migrate dev
   ```
4. รันเซิร์ฟเวอร์
   ```
   node server.js
   ```

## Best Practices
- แยก logic ตามโดเมน
- ใช้ middleware สำหรับ auth, error, validation
- ใช้ service สำหรับ business logic
- ใช้ utils สำหรับฟังก์ชันช่วยเหลือ
- ป้องกัน input ด้วย validation
- ใช้ Prisma ORM
- ไม่ hardcode secret/database url
- เพิ่ม security middleware (helmet, rate limit, cors)

## ติดต่อ/ปัญหา
- แจ้ง issue หรือ pull request ได้ที่ repo นี้ 