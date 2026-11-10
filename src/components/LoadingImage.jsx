import React, { forwardRef, useState } from 'react';

export default forwardRef(function LoadingImage({ src, className = '', loading = 'lazy', fetchPriority, ...props }, ref) {
  const [settledSrc, setSettledSrc] = useState(null);
  const settle = () => setSettledSrc(src);

  return (
    <img {...props} ref={ref} src={src} loading={loading} decoding="async"
      fetchpriority={fetchPriority ?? (loading === 'lazy' ? 'low' : undefined)}
      className={settledSrc === src ? className : className + ' bg-(--line) motion-safe:animate-skeleton'}
      onLoad={settle} onError={settle} />
  );
});
