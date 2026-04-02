import { useEffect, useState } from 'react';

const TYPING_INTERVAL_MS = 12;

const useTypewriter = (text, enabled = true) => {
  const [displayText, setDisplayText] = useState(enabled ? '' : text);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      return undefined;
    }

    let index = 0;
    setDisplayText('');

    const interval = setInterval(() => {
      index += 1;
      setDisplayText(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
      }
    }, TYPING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [text, enabled]);

  return displayText;
};

export default useTypewriter;
