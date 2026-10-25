import { useState } from 'react';

export default function Gift({ opened, onOpen }) {
  const [opening, setOpening] = useState(false);

  // Shake the box for a moment before the video opens.
  function handleClick() {
    if (opening) return;
    setOpening(true);
    setTimeout(() => {
      setOpening(false);
      onOpen();
    }, 650);
  }

  return (
    <section className="gift-section">
      <h2>{opened ? 'هديتك 🎁' : 'استنى… فيه هدية ليك 🎁'}</h2>
      <p className="sub">{opened ? 'تقدر تتفرج عليها تاني' : 'افتحها الأول، وبعدها رسالتي هتفتح'}</p>

      <button
        type="button"
        className={`gift-box ${opened ? 'seen' : ''} ${opening ? 'opening' : ''}`}
        onClick={handleClick}
        aria-label="افتح الهدية"
      >
        <span className="gift" />
        <span className="who">{opened ? 'اتفتحت ✓' : 'دوس هنا'}</span>
      </button>
    </section>
  );
}
