import React from 'react';

export default function PhotoCredit({ photographer, source }) {
  return <figcaption className="relative z-10 px-3 py-[0.4rem] text-xs text-(--muted) hover-capable:pointer-events-none hover-capable:absolute hover-capable:inset-x-0 hover-capable:bottom-0 hover-capable:bg-black/80 hover-capable:text-white hover-capable:opacity-0 group-hover/photo:pointer-events-auto group-hover/photo:opacity-100 group-focus-within/photo:pointer-events-auto group-focus-within/photo:opacity-100 group-hover/cause:pointer-events-auto group-hover/cause:opacity-100">Photo by <a href={source} className="underline underline-offset-[0.15em]">{photographer} on Pexels</a></figcaption>;
}
