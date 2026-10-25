import { forwardRef, useImperativeHandle, useState } from 'react';
import { COLORS } from '../config.js';

let nextId = 0;

function makeBalloon(fast) {
  return {
    id: nextId++,
    fast,
    left: Math.random() * 94,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    width: 40 + Math.random() * 30,
    duration: fast ? 6 + Math.random() * 4 : 14 + Math.random() * 10,
    delay: fast ? Math.random() * 1.5 : -Math.random() * 20,
  };
}

const Balloons = forwardRef(function Balloons(_, ref) {
  const [balloons, setBalloons] = useState(() =>
    Array.from({ length: 9 }, () => makeBalloon(false))
  );

  useImperativeHandle(ref, () => ({
    release(n) {
      const fresh = Array.from({ length: n }, () => makeBalloon(true));
      setBalloons((b) => [...b, ...fresh]);
      const ids = new Set(fresh.map((b) => b.id));
      setTimeout(() => setBalloons((b) => b.filter((x) => !ids.has(x.id))), 12000);
    },
  }));

  return (
    <div className="balloons" aria-hidden="true">
      {balloons.map((b) => (
        <span
          key={b.id}
          className="balloon"
          style={{
            left: `${b.left}%`,
            '--c': b.color,
            '--w': `${b.width}px`,
            '--d': `${b.duration}s`,
            '--delay': `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
});

export default Balloons;
