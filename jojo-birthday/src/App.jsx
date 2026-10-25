
import { useRef, useState } from 'react';
import { MUSIC, NAME, VIDEO } from './config.js';
import { playTune, primeTune, stopTune } from './tune.js';
import Gate from './components/Gate.jsx';
import Bunting from './components/Bunting.jsx';
import Balloons from './components/Balloons.jsx';
import Confetti from './components/Confetti.jsx';
import Cake from './components/Cake.jsx';
import Gift from './components/Gift.jsx';
import VideoModal from './components/VideoModal.jsx';
import FinalLetter from './components/FinalLetter.jsx';

// No video set → skip the gift and show the letter straight away.
const HAS_VIDEO = Boolean(VIDEO.src);

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [blown, setBlown] = useState(false);
  const [flyingWish, setFlyingWish] = useState('');
  const [giftOpened, setGiftOpened] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(!HAS_VIDEO);

  const confetti = useRef(null);
  const balloons = useRef(null);
  const finalRef = useRef(null);
  const giftRef = useRef(null);

  function handleUnlock() {
    setUnlocked(true);
    confetti.current?.burst(120, 0.5, 0.3);
  }

  function celebrateLetter() {
    finalRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    confetti.current?.burst(200, 0.5, 0.55);
    balloons.current?.release(10);
  }

  function handleBlow(wish) {
    if (blown) {
      confetti.current?.burst(80, 0.5, 0.45);
      return;
    }
    setBlown(true);
    setFlyingWish(wish);
    setTimeout(() => setFlyingWish(''), 4200);
    if (MUSIC) setTimeout(playTune, 500);
    setTimeout(() => {
      confetti.current?.burst(140, 0.2, 0.6);
      confetti.current?.burst(140, 0.8, 0.6);
      balloons.current?.release(14);
    }, 350);
    setTimeout(() => {
      if (HAS_VIDEO) giftRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      else celebrateLetter();
    }, 3200);
  }

  function openGift() {
    stopTune();
    if (!giftOpened) confetti.current?.burst(50, 0.5, 0.5);
    setGiftOpened(true);
    setVideoOpen(true);
  }

  // Ending or closing the video opens the letter the first time.
  function closeVideo() {
    setVideoOpen(false);
    if (letterOpen) return;
    setLetterOpen(true);
    setTimeout(celebrateLetter, 300);
  }

  return (
    <div className={`app ${unlocked ? 'revealed' : ''} ${blown ? 'blown' : ''}`}>
      <Bunting />
      <Balloons ref={balloons} />
      <Confetti ref={confetti} />

      {!unlocked && <Gate onUnlock={handleUnlock} />}

      <main className="wrap">
        <section className="hero">
          <span className="eyebrow">كل سنة وانت طيب يا</span>
          <h1 className="name" aria-label={NAME}>
            {[...NAME].map((ch, i) => (
              <span key={i} style={{ '--i': i }}>{ch}</span>
            ))}
          </h1>
          <Cake blown={blown} onWish={MUSIC ? primeTune : undefined} onBlow={handleBlow} />
        </section>

        {flyingWish && <div className="wish-fly">✨ {flyingWish} ✨</div>}

        {blown && (
          <div className="after-blow">
            {HAS_VIDEO && (
              <div ref={giftRef}>
                <Gift opened={giftOpened} onOpen={openGift} />
              </div>
            )}
            <FinalLetter ref={finalRef} unlocked={letterOpen} />
          </div>
        )}
      </main>

      {videoOpen && <VideoModal src={VIDEO.src} onClose={closeVideo} />}
    </div>
  );
}
