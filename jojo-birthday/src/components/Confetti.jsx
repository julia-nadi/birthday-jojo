import { forwardRef, useImperativeHandle, useRef } from 'react';
import { COLORS } from '../config.js';

function drawHeart(ctx, x, y, s) {
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
  ctx.fill();
}

const Confetti = forwardRef(function Confetti(_, ref) {
  const canvasRef = useRef(null);
  const parts = useRef([]);
  const running = useRef(false);

  function tick() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of parts.current) {
      p.vy += 0.3;
      p.vx *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.r += p.spin;
      p.life++;
      ctx.fillStyle = p.c;
      if (p.t < 0.3) drawHeart(ctx, p.x, p.y, p.s * 1.7);
      else if (p.t < 0.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s / 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        ctx.restore();
      }
    }

    parts.current = parts.current.filter((p) => p.y < canvas.height + 40 && p.life < 420);
    if (parts.current.length) requestAnimationFrame(tick);
    else {
      running.current = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  useImperativeHandle(ref, () => ({
    burst(n, ox, oy) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      for (let i = 0; i < n; i++) {
        parts.current.push({
          x: canvas.width * ox,
          y: canvas.height * oy,
          vx: (Math.random() - 0.5) * 16,
          vy: -Math.random() * 15 - 5,
          s: Math.random() * 8 + 5,
          c: COLORS[i % COLORS.length],
          t: Math.random(),
          r: Math.random() * 6,
          spin: (Math.random() - 0.5) * 0.3,
          life: 0,
        });
      }
      if (!running.current) {
        running.current = true;
        requestAnimationFrame(tick);
      }
    },
  }));

  return <canvas ref={canvasRef} className="fx" aria-hidden="true" />;
});

export default Confetti;
