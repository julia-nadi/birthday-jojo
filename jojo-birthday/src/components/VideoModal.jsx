import { useEffect, useRef } from 'react';

export default function VideoModal({ src, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="modal"
      role="dialog"
      aria-modal="true"
      aria-label="الهدية"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="m-box">
        <div className="m-head">
          <button type="button" className="x" ref={closeRef} onClick={onClose} aria-label="اقفل">
            ×
          </button>
        </div>
        <video src={src} controls playsInline autoPlay onEnded={onClose} />
      </div>
    </div>
  );
}
