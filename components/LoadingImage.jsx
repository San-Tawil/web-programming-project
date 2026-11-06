import React, { forwardRef, useState } from 'react';

export default forwardRef(function LoadingImage({ src, className = '', loading = 'lazy', ...props }, ref) {
  const [settledSrc, setSettledSrc] = useState(null);
  const settle = () => setSettledSrc(src);

  return (
    <img {...props} ref={ref} src={src} loading={loading} decoding="async"
      className={settledSrc === src ? className : className + ' aid-skeleton'}
      onLoad={settle} onError={settle} />
  );
});
