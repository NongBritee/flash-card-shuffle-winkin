/* Asks for the child's name before starting (min 2 characters). Remembered in localStorage. */
import { useState } from 'react';
import { validName, cleanName, MIN_NAME } from '../lib/progress.js';

export default function NameGate({ initial = '', onSave, onCancel }) {
  const [value, setValue] = useState(initial);
  const [touched, setTouched] = useState(false);
  const ok = validName(value);
  const submit = e => {
    e.preventDefault();
    setTouched(true);
    if (ok) onSave(cleanName(value));
  };
  return (
    <section id="gate" className="screen" aria-label="ใส่ชื่อ">
      <form className="gateBox" onSubmit={submit} noValidate>
        <div className="big">👋</div>
        <h1><span className="en">Hello!</span> <span className="th">หนูชื่ออะไรจ๊ะ</span></h1>
        <label htmlFor="childName" className="sr">ชื่อของเด็ก</label>
        <input id="childName" value={value} onChange={e => setValue(e.target.value)} maxLength={20} autoFocus
          autoComplete="off" autoCapitalize="words" placeholder="พิมพ์ชื่อหนู" aria-invalid={touched && !ok}
          aria-describedby="nameHint" />
        <p id="nameHint" className={'hint' + (touched && !ok ? ' bad' : '')} role="status">
          {touched && !ok ? `ใส่ชื่ออย่างน้อย ${MIN_NAME} ตัวอักษรนะ` : `ชื่ออย่างน้อย ${MIN_NAME} ตัวอักษร`}
        </p>
        <div className="gateBtns">
          <button type="submit" className="act done"><span>▶️</span><b>เริ่มเล่น</b></button>
          {onCancel && <button type="button" className="act home" onClick={onCancel}><b>ยกเลิก</b></button>}
        </div>
      </form>
    </section>
  );
}
