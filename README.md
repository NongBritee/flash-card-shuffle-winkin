# 🃏 Word Cards (การ์ดคำศัพท์ภาษาอังกฤษ)

เกมการ์ดคำศัพท์ภาษาอังกฤษสำหรับเด็กอนุบาล 2-3 ขวบ เล่นบนเว็บ ไม่ต้องติดตั้งหรือ build

## วิธีเล่น
1. หน้าแรกเลือก **ชุดคำศัพท์** (6 ชุด ชุดละ 5 คำ แต่ละชุดมีธีมสีและหลังการ์ดของตัวเอง)
2. การ์ดคว่ำ 5 ใบจะถูกสับ จิ้มเลือก 1 ใบ แล้วเกมจะสุ่มว่าได้คำไหน (หรือกด 🎲 **สุ่มให้**)
3. การ์ดพลิก → **สะกด** ทีละตัว → **อ่านคำอังกฤษ** → **เฉลยคำไทย** → 🎤 พูดตามนะ
4. ปุ่มในหน้าการ์ด
   - 🔤 **สะกด**: สะกด → อ่านอังกฤษ → ไทย
   - 🔊 **ฟัง**: อ่านอังกฤษ → ไทย
   - 🇹🇭 **แปล**: อ่านอังกฤษ → ไทย
   - แตะตัวอักษร: ฟังทีละตัว
   - แตะการ์ดที่เปิดแล้วอีกครั้ง: อ่านอังกฤษ → ไทย
5. เปิดครบ 5 ใบได้ 🎉 ⭐ เก็บดาวไว้ที่หน้าแรก

| # | ชุด | คำศัพท์ |
|---|---|---|
| 1 | Weather สภาพอากาศ | sunny, cloudy, windy, rainy, snowy |
| 2 | Days วันในสัปดาห์ | Monday, Tuesday, Thursday, Friday, Sunday (สีการ์ดตามสีประจำวัน) |
| 3 | My Things ของใช้รอบตัว | fan, pan, ball, book, bag |
| 4 | In the House ของในบ้าน | door, jar, cup, pot, box |
| 5 | Animals สัตว์น่ารัก | fish, lion, tiger, snake, bird |
| 6 | Farm Animals สัตว์ในฟาร์ม | pig, cow, horse, duck, goat |

## เปิดเล่น
`python3 -m http.server` แล้วเข้า http://localhost:8000 หรือใช้ GitHub Pages (`.github/workflows/pages.yml`)

เสียงอังกฤษใช้ Web Speech API ของเครื่อง (en‑US) ส่วนเฉลยไทยเล่นจากไฟล์เสียงอัดของชุดนั้น (`sets/<ชุด>/audio/<คำ>.mp3`)
ถ้ายังไม่มีไฟล์ จะใช้เสียงไทยของเครื่อง ถ้าเครื่องไม่มีเสียงไทย (เช่น Chrome บน Windows) จะขึ้นคำแนะนำ

## โครงสร้างโปรเจกต์
```
index.html              หน้าเว็บ (หน้าแรก + หน้าเกม)
js/app.js               router: #/ = หน้าแรก, #/<ชุด> = เกม
js/core/                ส่วนกลาง (ใช้ร่วมทุกชุด)
  sets.js               ทะเบียนชุดคำศัพท์ + path รูป/เสียง + ASSET_V (cache-busting)
  speech.js             เสียงอ่าน (TTS), เล่นไฟล์เสียง, เอฟเฟกต์
  game.js               เกมการ์ด (สับ, พลิก, สะกด, เฉลย, ฉลอง)
  menu.js               หน้าเลือกชุด + ดาวสะสม
css/base.css            สไตล์กลาง + ธีมสี (CSS variables)
css/menu.css, game.css  สไตล์หน้าแรก / หน้าเกม
sets/<ชุด>/             แยกเป็นชุด ๆ
  set.js                คำศัพท์ คำไทย สีการ์ด ธีมพื้นหลัง หลังการ์ด
  cards/<คำ>.webp       ภาพการ์ด (1200×1680) + back.webp
  audio/<คำ>.mp3        เสียงเฉลยไทย (ไม่บังคับ ดู audio/README.md)
design/                 ต้นฉบับภาพการ์ด (SVG)
  common.js             ส่วนกลาง: กรอบการ์ด, หลังการ์ด, หน้ายิ้ม ฯลฯ
  sets/<ชุด>.js         ฉากของแต่ละคำ
  cards.html?set=<ชุด>  หน้าพรีวิว
  render.js             node design/render.js [ชุด…] → sets/<ชุด>/cards/*.webp
tests/smoke.js          ทดสอบอัตโนมัติด้วย Playwright: node tests/smoke.js
fonts/                  Fredoka + Mitr (SIL OFL)
assets/silence.mp3      ไฟล์เงียบสำหรับปลดล็อกเสียงบน iPhone
```

### เพิ่มชุดคำศัพท์ใหม่
1. สร้าง `sets/<ชุด>/set.js` (คัดลอกจากชุดอื่น แก้ `id`, `no`, คำศัพท์, สี)
2. สร้าง `design/sets/<ชุด>.js` วาดฉากของแต่ละคำ แล้วเพิ่ม id ใน `design/cards.html` และ `design/render.js`
3. `node design/render.js <ชุด>` สร้างภาพการ์ด
4. เพิ่ม `<script src="sets/<ชุด>/set.js">` ใน `index.html`
5. `node tests/smoke.js` ตรวจว่าทุกอย่างทำงาน
