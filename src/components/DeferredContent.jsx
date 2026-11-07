import React, { Suspense, useEffect, useRef, useState } from 'react';

export default function DeferredContent({ children, fallback = null, className, rootMargin = '200px 0px' }) {
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
    }, { rootMargin });
    observer.observe(region.current);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={region} className={className}>
      {nearViewport ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
}
