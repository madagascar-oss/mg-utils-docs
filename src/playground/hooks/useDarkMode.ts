// Follows the docs' theme: Starlight sets data-theme on <html>.
import { useEffect, useState } from 'react';

const read = () => document.documentElement.dataset['theme'] === 'dark';

export function useDarkMode(): boolean {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(read());
    const observer = new MutationObserver(() => {
      setDark(read());
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  return dark;
}
