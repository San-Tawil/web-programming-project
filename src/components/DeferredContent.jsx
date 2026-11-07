import React, { Suspense, useEffect, useRef, useState } from 'react';

export default function DeferredContent({ children, fallback = null, className }) {
  const region = useRef(null);
  const [nearViewport, setNearViewport] = useState(false);

  useEffect(() => {
    if (!window.IntersectionObserver) {
      setNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true);
        observer.disconnect();
      }
    }, { rootMargin: '200px 0px' });
    observer.observe(region.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={region} className={className}>
      {nearViewport ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
