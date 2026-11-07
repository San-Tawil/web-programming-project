import React from 'react';

export default function PhotoCredit({ photographer, source }) {
  return <figcaption className="aid-photo-credit">Photo by <a href={source}>{photographer} on Pexels</a></figcaption>;
}
