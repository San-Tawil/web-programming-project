// Source: React Bits (reactbits.dev)
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './BubbleMenu.css';

export default function BubbleMenu({
  logo, leadingAction, actions, items, onMenuClick, className, style, menuAriaLabel = 'Toggle menu',
  menuBg, menuContentColor, useFixedPosition = false, animationEase = 'back.out(1.5)',
  animationDuration = 0.5, staggerDelay = 0.12,
}) {
  const location = useLocation();
  const [openAt, setOpenAt] = useState(null);
  const open = openAt === location.key;
  const overlay = useRef(null);
  const toggle = useRef(null);
  const id = useId();
  const position = useFixedPosition ? 'fixed' : 'absolute';

  // MODIFIED(4): location changes close the overlay without stealing route focus.
  function close(restoreFocus = false) {
    setOpenAt(null);
    onMenuClick?.(false);
    if (restoreFocus) toggle.current?.focus();
  }

  useEffect(() => {
    if (openAt !== null && openAt !== location.key) setOpenAt(null);
  }, [openAt, location.key]);

  // MODIFIED(5): focus the first link, cycle through links and toggle, and lock scroll.
  useLayoutEffect(() => {
    if (!open) return;
    const links = [...overlay.current.querySelectorAll('a, button')];
    const targets = [...links, toggle.current];
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    links[0]?.focus();

    function handleKey(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        const index = targets.indexOf(document.activeElement);
        const next = index < 0 ? (event.shiftKey ? targets.length - 1 : 0)
          : (index + (event.shiftKey ? -1 : 1) + targets.length) % targets.length;
        targets[next]?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onMenuClick]);

  useEffect(() => {
    if (!open || animationDuration <= 0.01) return;
    const animation = gsap.fromTo(overlay.current.querySelectorAll('.pill-col'),
      { scale: 0.96, x: -16 }, { scale: 1, x: 0, duration: animationDuration, stagger: staggerDelay, ease: animationEase });
    return () => animation.revert();
  }, [open, animationDuration, staggerDelay, animationEase]);

  return (
    <>
      <div className={['bubble-menu top-3 z-[51] grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-1 px-3 [&>*]:pointer-events-auto', position, className].filter(Boolean).join(' ')} style={style}>
        <div className="flex items-center gap-1">
          <button ref={toggle} type="button" className={`bubble toggle-bubble menu-btn min-h-11 min-w-11 bg-transparent shadow-none ${open ? 'open' : ''}`}
            aria-expanded={open} aria-controls={id} aria-label={menuAriaLabel}
            onClick={() => { if (open) close(true); else { setOpenAt(location.key); onMenuClick?.(true); } }}>
            <span className="menu-line" style={{ background: menuContentColor }} />
            <span className="menu-line short" style={{ background: menuContentColor }} />
          </button>
          {leadingAction}
        </div>
        <div className="bubble logo-bubble bg-transparent px-1.5 shadow-none">
          <span className="logo-content w-auto">{typeof logo === 'string' ? <img src={logo} alt="AidConnect" className="bubble-logo" /> : logo}</span>
        </div>
        {actions}
      </div>
      {/* MODIFIED(2,6): standard site navigation on an opaque canvas. */}
      <nav id={id} ref={overlay} aria-label="Site pages" hidden={!open}
        className={`bubble-menu-items pointer-events-auto z-50 overflow-y-auto bg-(--bg) pt-20 ${position} ${open ? 'flex' : 'hidden'}`}>
        {open && <ul className="pill-list gap-y-2 pb-4">
          {items.map(item => {
            const pillStyle = {
              '--item-rot': `${item.rotation ?? 0}deg`, '--pill-bg': menuBg,
              '--pill-color': menuContentColor, '--hover-bg': item.hoverStyles?.bgColor ?? menuBg,
              '--hover-color': item.hoverStyles?.textColor ?? menuContentColor,
            };
            const label = <span className="pill-label">{item.label}</span>;
            // MODIFIED(1): client-side links, plus a button for the logout action.
            return <li key={item.label} className="pill-col">
              {item.to ? <NavLink to={item.to} className="pill-link min-h-12 py-2" style={pillStyle} onClick={() => close()}>{label}</NavLink>
                : <button type="button" className="pill-link min-h-12 py-2" style={pillStyle} onClick={() => { item.onClick?.(); close(true); }}>{label}</button>}
            </li>;
          })}
        </ul>}
      </nav>
    </>
  );
}
