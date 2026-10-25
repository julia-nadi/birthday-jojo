import { forwardRef } from 'react';
import { FINAL_LETTER } from '../config.js';

const FinalLetter = forwardRef(function FinalLetter({ unlocked }, ref) {
  return (
    <section className="final" ref={ref}>
      <h2>وهديتي ليك… مني أنا</h2>
      {unlocked ? (
        <div className="final-card">
          <p>{FINAL_LETTER.greeting}</p>
          {FINAL_LETTER.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="sign">{FINAL_LETTER.sign}</p>
        </div>
      ) : (
        <p className="lock">🔒 افتح الهدية اللي فوق، ورسالتي هتفتح لوحدها</p>
      )}
    </section>
  );
});

export default FinalLetter;
