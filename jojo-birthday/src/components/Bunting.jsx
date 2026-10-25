import { useEffect, useState } from 'react';

export default function Bunting() {
  const [count, setCount] = useState(() => Math.ceil(window.innerWidth / 42) + 2);

  useEffect(() => {
    const onResize = () => setCount(Math.ceil(window.innerWidth / 42) + 2);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="bunting" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="flag" />
      ))}
    </div>
  );
}
