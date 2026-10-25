import { useEffect, useRef, useState } from 'react';
import { WISH, WISH_FIRST } from '../config.js';

const CANDLES = [
  { x: 82, y: 54, h: 36, c: '#3fd6c6' },
  { x: 110, y: 48, h: 42, c: '#ffc94a' },
  { x: 138, y: 48, h: 42, c: '#ff8a5c' },
  { x: 166, y: 54, h: 36, c: '#ff5fa2' },
];

const frosting = (x, width, step, depth) => {
  let d = `M${x} ${0}`;
  for (let i = 0; i < width / step; i++) d += ` q${step / 2} ${depth} ${step} 0`;
  return d;
};

// How loud (0–1) and for how long the mic must hear air before it counts as a blow.
const BLOW_LEVEL = 0.15;
const BLOW_MS = 150;

function useBlowDetector(active, onBlow) {
  const [listening, setListening] = useState(false);
  const callback = useRef(onBlow);
  callback.current = onBlow;

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let stream, ctx, raf;

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { noiseSuppression: false } });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(stream).connect(analyser);
        const buf = new Uint8Array(analyser.fftSize);
        let loudSince = 0;
        setListening(true);

        const tick = (now) => {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (const b of buf) sum += ((b - 128) / 128) ** 2;
          if (Math.sqrt(sum / buf.length) > BLOW_LEVEL) {
            loudSince ||= now;
            if (now - loudSince > BLOW_MS) {
              callback.current();
              return;
            }
          } else {
            loudSince = 0;
          }
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch {
        // No mic or permission refused: tapping the cake still works.
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      stream?.getTracks().forEach((t) => t.stop());
      ctx?.close();
      setListening(false);
    };
  }, [active]);

  return listening;
}

export default function Cake({ blown, onWish, onBlow }) {
  const [wish, setWish] = useState('');
  const [wished, setWished] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const blow = () => onBlow(wish.trim());
  const listening = useBlowDetector(wished && !blown, blow);

  function handleWish(e) {
    e?.preventDefault();
    if (wish.trim() !== '') {
      setError('');
      setWished(true);
      onWish?.();
      return;
    }
    setError(WISH_FIRST);
    inputRef.current?.focus();
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

  function handleCake() {
    if (blown || wished) blow();
    else handleWish();
  }

  return (
    <div className="cake-box">
      <button type="button" className="cake-btn" onClick={handleCake} aria-label="اطفي الشمع">
        <svg viewBox="0 0 260 230" aria-hidden="true">
          <ellipse cx="130" cy="214" rx="120" ry="12" fill="#ffffff30" />

          <rect x="30" y="140" width="200" height="72" rx="14" fill="#ff5fa2" />
          <path transform="translate(0 156)" d={`${frosting(30, 200, 25, 16)} v-14 h-200z`} fill="#fff4e6" />
          <g fill="#ffc94a">
            <circle cx="60" cy="190" r="4" />
            <circle cx="100" cy="182" r="4" />
            <circle cx="140" cy="194" r="4" />
            <circle cx="180" cy="184" r="4" />
            <circle cx="210" cy="196" r="4" />
          </g>

          <rect x="60" y="88" width="140" height="56" rx="12" fill="#b88cff" />
          <path transform="translate(0 102)" d={`${frosting(60, 140, 20, 14)} v-12 h-140z`} fill="#fff4e6" />
          <g fill="#3fd6c6">
            <circle cx="85" cy="126" r="3.5" />
            <circle cx="115" cy="120" r="3.5" />
            <circle cx="145" cy="128" r="3.5" />
            <circle cx="175" cy="121" r="3.5" />
          </g>

          {CANDLES.map((c, i) => (
            <g key={i}>
              <rect x={c.x} y={c.y} width="10" height={c.h} rx="3" fill={c.c} />
              <path
                className="flame"
                style={{ animationDuration: i % 2 ? '.32s' : '.25s' }}
                d={`M${c.x + 5} ${c.y - 2} c-6 -8 -2 -16 0 -22 c2 6 6 14 0 22z`}
                fill="#ffc94a"
              />
              <circle className="smoke" cx={c.x + 5} cy={c.y - 14} r="5" fill="#ffffff80" />
            </g>
          ))}
        </svg>
      </button>
      {blown ? (
        <p className="wish">{WISH}</p>
      ) : wished ? (
        <p className="blow-tip" aria-live="polite">
          {listening
            ? 'يلا… انفخ على الشمع 🌬️ (أو دوس على التورتة)'
            : 'يلا… دوس على التورتة واطفي الشمع 🎂'}
        </p>
      ) : (
        <form className="q" onSubmit={handleWish}>
          <label htmlFor="wish">اتمنى أمنية الأول… وبعدين اطفي الشمع 🎂</label>
          <div className="q-row">
            <input
              id="wish"
              ref={inputRef}
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              autoComplete="off"
              placeholder="اكتب أمنيتك هنا"
            />
            <button className="btn" type="submit">اتمنيت ✨</button>
          </div>
          <p className="cake-tip">أمنيتك سر، محدش هيشوفها 🤫</p>
          <div className="q-msg" aria-live="polite">{error}</div>
        </form>
      )}
    </div>
  );
}
