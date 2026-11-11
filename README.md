# 🃏 Word Cards (การ์ดคำศัพท์ภาษาอังกฤษ)

เกมการ์ดคำศัพท์ภาษาอังกฤษสำหรับเด็กอนุบาล 2-3 ขวบ เล่นบนเว็บ (เปิดเล่นบนเบราว์เซอร์ได้เลย ไม่ต้องติดตั้งแอป)

## วิธีเล่น
0. ครั้งแรกจะถามชื่อเด็ก (อย่างน้อย 2 ตัวอักษร) จำไว้ใน `localStorage` เปลี่ยนได้ด้วยปุ่ม ✏️ ที่หน้าแรก
1. หน้าแรกเลือก **ชุดคำศัพท์** (6 ชุด ชุดละ 5 คำ แต่ละชุดมีธีมสีและหลังการ์ดของตัวเอง)
2. การ์ดคว่ำ 5 ใบจะถูกสับ จิ้มเลือก 1 ใบ แล้วเกมจะสุ่มว่าได้คำไหน (หรือกด 🎲 **สุ่มให้**)
3. การ์ดพลิก → **สะกด** ทีละตัว → **อ่านคำอังกฤษ** → **เฉลยคำไทย** → 🎤 พูดตามนะ
4. ปุ่มในหน้าการ์ด
   - 🔤 **สะกด**: สะกด → อ่านอังกฤษ → ไทย
   - 🔊 **ฟัง**: อ่านอังกฤษ → ไทย
   - 🇹🇭 **แปล**: อ่านอังกฤษ → ไทย
   - แตะตัวอักษร: ฟังทีละตัว
   - แตะการ์ดที่เปิดแล้วอีกครั้ง: อ่านอังกฤษอย่างเดียว ยังไม่เฉลยไทย จนกว่าจะกด 🇹🇭 / 🔊 หรือแตะแถบชมพู
5. ตอบครบ 5 ใบ ได้ 🎉 **3 ดาว** เสมอ การ์ดทั้ง 5 ใบยังค้างอยู่บนหน้าจอ มีปุ่ม 🔁 เล่นอีกครั้ง / 🏠 เลือกชุดอื่น
   แตะการ์ดเพื่อดูซ้ำได้ทีละใบ (คำไทยเฉลยทิ้งไว้ให้เลย ไม่ต้องกดเฉลย) ดาวเก็บไว้ที่หน้าแรก

**ชุดที่เปิดให้เล่น:** ตอนนี้เล่นได้ 2 ชุดแรก ชุดอื่นแสดงไว้แต่กดไม่ได้ (กดแล้วขึ้น “ยังไม่เปิดใช้งาน”)
เปิดทั้งหมดได้ด้วย query param `?allow=all` เช่น `https://<โดเมน>/?allow=all` (ตั้งจำนวนชุดที่เปิดที่ `FREE_SETS` ใน `src/sets/index.js`)

| # | ชุด | คำศัพท์ |
|---|---|---|
| 1 | Weather สภาพอากาศ | sunny, cloudy, windy, rainy, snowy |
| 2 | Days วันในสัปดาห์ | Monday, Tuesday, Thursday, Friday, Sunday (สีการ์ดตามสีประจำวัน) |
| 3 | My Things ของใช้รอบตัว | fan, pan, ball, book, bag |
| 4 | In the House ของในบ้าน | door, jar, cup, pot, box |
| 5 | Animals สัตว์น่ารัก | fish, lion, tiger, snake, bird |
| 6 | Farm Animals สัตว์ในฟาร์ม | pig, cow, horse, duck, goat |

## Tech stack
| ส่วน | ใช้อะไร |
|---|---|
| UI | **React 19** (function components + hooks), JavaScript (JSX) |
| Build / dev server | **Vite 8** + `@vitejs/plugin-react` |
| Routing | hash router เขียนเอง (`#/` หน้าแรก, `#/<ชุด>`) ไม่ใช้ไลบรารี |
| สไตล์ | CSS ธรรมดา + CSS variables สำหรับธีมของแต่ละชุด (ไม่ใช้ UI framework) |
| ฟอนต์ | Fredoka + Mitr (SIL OFL) โฮสต์เอง |
| เสียงอังกฤษ | Web Speech API (`speechSynthesis`, en‑US) ของเครื่อง |
| เสียงเฉลยไทย | ไฟล์ MP3 ที่อัดไว้ผ่าน `<audio>` → ถ้าไม่มีใช้เสียงไทยของเครื่อง (th‑TH) |
| เอฟเฟกต์เสียง | Web Audio API (สังเคราะห์เสียงด้วยโค้ด ไม่มีไฟล์) |
| เอฟเฟกต์ภาพ | CSS 3D transform + FLIP animation (สับ/พลิกการ์ด), Canvas 2D (confetti) |
| เก็บข้อมูล | `localStorage` (ดาวสะสม) ไม่มี backend และไม่เก็บข้อมูลเด็ก |
| ภาพการ์ด | วาดเป็น **SVG ด้วยโค้ด** (`design/`) แล้วเรนเดอร์เป็น **WebP** 1200×1680 ด้วย Playwright + Pillow |
| ทดสอบ | **Playwright** (Chromium) end-to-end กับ build จริง (`tests/smoke.mjs`) |
| CI/CD | **GitHub Actions** (รันเทสต์ทุก PR, build แล้ว deploy ขึ้น **GitHub Pages**) |
| Runtime ที่ต้องมี | Node.js 22+, Python 3 + Pillow (เฉพาะตอนวาดภาพการ์ดใหม่) |

## เปิดเล่น / พัฒนา (React + Vite)
```bash
npm install
npm run dev        # เปิด http://localhost:5173 (แก้โค้ดแล้วรีโหลดเอง)
npm run build      # สร้างเว็บจริงที่ dist/
npm test           # build แล้วทดสอบอัตโนมัติด้วย Playwright
npm run cards      # วาดภาพการ์ดใหม่ (ทุกชุด) → public/sets/<ชุด>/cards/
```
เว็บจริง deploy ด้วย GitHub Actions (`.github/workflows/pages.yml`) ซึ่งจะ build ก่อนแล้วอัปโหลด `dist/`
**ควรตั้ง Settings → Pages → Source เป็น “GitHub Actions”** (ถ้ายังเป็น “Deploy from a branch” workflow จะรอ 2 นาทีแล้ว deploy ทับให้ เพราะแบบ branch จะ publish ซอร์สที่ยังไม่ build)

เสียงอังกฤษใช้ Web Speech API ของเครื่อง (en‑US) ส่วนเฉลยไทยเล่นจากไฟล์เสียงอัดของชุดนั้น (`public/sets/<ชุด>/audio/<คำ>.mp3`)
ถ้ายังไม่มีไฟล์ จะใช้เสียงไทยของเครื่อง ถ้าเครื่องไม่มีเสียงไทย (เช่น Chrome บน Windows) จะขึ้นคำแนะนำ

## โครงสร้างโปรเจกต์
```
index.html                 จุดเริ่มของ Vite
src/
  main.jsx                 mount React + โหลดฟอนต์/สไตล์
  App.jsx                  router: #/ = หน้าแรก, #/<ชุด> = เกม + ธีมสีของชุด
  components/              React components (ใช้ร่วมทุกชุด)
    Menu.jsx, SetTile.jsx  หน้าเลือกชุด + ดาวสะสม
    Game.jsx               เกมการ์ด: สับ, พลิก, ลำดับเสียง สะกด → อังกฤษ → ไทย
    Card.jsx, DetailView.jsx, WinBox.jsx
  hooks/                   useHashRoute (router), useFitTable (จัดการ์ดให้พอดีจอ)
  lib/                     speech.js (TTS/ไฟล์เสียง/เอฟเฟกต์), assets.js (path + ASSET_V),
                           letters.js (ชื่อตัวอักษร + ความเร็วสะกด), progress.js, confetti.js
  sets/                    ข้อมูลแต่ละชุด: <ชุด>.js (คำ คำไทย สี ธีม) + index.js (ทะเบียน)
  styles/                  base.css (ธีม CSS variables), menu.css, game.css
  assets/fonts/            Fredoka + Mitr (SIL OFL)
public/                    ไฟล์ static (ไม่ผ่าน bundler)
  sets/<ชุด>/cards/        ภาพการ์ด <คำ>.webp + back.webp (1200×1680)
  sets/<ชุด>/audio/        เสียงเฉลยไทย <คำ>.mp3 (ไม่บังคับ ดู README ในโฟลเดอร์)
  silence.mp3              ปลดล็อกเสียงบน iPhone
design/                    ต้นฉบับภาพการ์ด (SVG)
  common.js, sets/<ชุด>.js, cards.html (พรีวิว: npm run dev แล้วเปิด /design/cards.html?set=<ชุด>), render.js
tests/smoke.mjs            ทดสอบอัตโนมัติ (Playwright) กับ dist/
```

### เพิ่มชุดคำศัพท์ใหม่
1. สร้าง `src/sets/<ชุด>.js` (คัดลอกจากชุดอื่น แก้ `id`, `no`, คำศัพท์, สี) แล้ว import ใน `src/sets/index.js`
2. สร้าง `design/sets/<ชุด>.js` วาดฉากของแต่ละคำ และเพิ่ม id ใน `IDS` ของ `design/cards.html`
3. `npm run cards -- <ชุด>` สร้างภาพการ์ดไปที่ `public/sets/<ชุด>/cards/`
4. `npm test` ตรวจว่าทุกอย่างทำงาน
