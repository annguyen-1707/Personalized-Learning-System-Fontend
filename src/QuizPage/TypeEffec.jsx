import { useEffect, useState } from 'react';

function TypingEffect({ text = '', speed = 50 }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text[index]);
      index++;
      if (index >= text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <p className="text-gray-600 text-base font-mono whitespace-pre-wrap">{displayed}</p>
  );
}

export default TypingEffect;
