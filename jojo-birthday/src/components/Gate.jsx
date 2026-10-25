import { useRef, useState } from 'react';
import { NAME, PASSWORD } from '../config.js';

const normalize = (s) =>
  s
    .trim()
    .toLowerCase()
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d))
    .replace(/\s*[\\/\-._|\s]+\s*/g, '/')
    .replace(/\b0(\d)/g, '$1')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');

export default function Gate({ onUnlock }) {
  const [open, setOpen] = useState(false);
  const [askPassword, setAskPassword] = useState(false);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const needsPassword = PASSWORD.answer.trim() !== '';

  function finish() {
    setOpen(true);
    setTimeout(onUnlock, 750);
  }

  function handleEnvelope() {
    if (needsPassword) {
      setOpen(true);
      setAskPassword(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      finish();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (normalize(value) === normalize(PASSWORD.answer)) {
      setError('');
      finish();
    } else {
      setError(PASSWORD.wrong);
      inputRef.current?.animate?.(
        [
          { transform: 'translateX(0)' },
          { transform: 'translateX(-8px)' },
          { transform: 'translateX(8px)' },
          { transform: 'translateX(0)' },
        ],
        { duration: 300 }
      );
    }
  }

  return (
    <div className="gate">
      <div className="gate-inner">
        <p className="gate-hint">في حاجة مستنياك… افتحها لما تكون لوحدك</p>
        <button
          type="button"
          className={`envelope ${open ? 'open' : ''}`}
          onClick={handleEnvelope}
          aria-label="افتح الظرف"
        >
          <span className="flap" />
          <span className="seal">🎁</span>
          <span className="to">لـ {NAME}</span>
        </button>

        {askPassword && (
          <form className="q" onSubmit={handleSubmit}>
            <label htmlFor="answer">{PASSWORD.text}</label>
            <div className="q-row">
              <input
                id="answer"
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                autoComplete="off"
                placeholder="يوم / شهر"
                dir="ltr"
              />
              <button className="btn" type="submit">افتح</button>
            </div>
            <div className="q-msg" aria-live="polite">{error}</div>
          </form>
        )}
      </div>
    </div>
  );
}
