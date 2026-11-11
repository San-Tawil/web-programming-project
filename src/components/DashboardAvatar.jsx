import React, { useEffect, useState } from 'react';

export default function DashboardAvatar({ profile, className = '' }) {
  const { name, photo } = profile;
  const [url, setUrl] = useState('');
  useEffect(() => {
    const nextUrl = photo ? URL.createObjectURL(photo) : '';
    setUrl(nextUrl);
    return () => { if (nextUrl) URL.revokeObjectURL(nextUrl); };
  }, [photo]);
  const initials = name.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('').toUpperCase();

  return (
    <span aria-hidden="true" className={`grid shrink-0 place-items-center overflow-hidden rounded-full bg-(--nav-panel) font-bold text-(--primary-strong) ${className}`}>
      {url ? <img src={url} alt="" className="size-full object-cover" /> : initials}
    </span>
  );
}
