import { useLayoutEffect, useState } from 'react';

export default function useCssVar(name) {
  const read = () => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const [value, setValue] = useState(read);
  useLayoutEffect(() => {
    const root = document.documentElement;
    const update = () => setValue(getComputedStyle(root).getPropertyValue(name).trim());
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    update();
    return () => observer.disconnect();
  }, [name]);
  return value;
}
