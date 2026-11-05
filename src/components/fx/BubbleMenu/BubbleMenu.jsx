// Source: React Bits (reactbits.dev)
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import './BubbleMenu.css';

export default function BubbleMenu({
  logo, actions, items, onMenuClick, className, style, menuAriaLabel = 'Toggle menu',
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
      { scale: 0.96, y: 12 }, { scale: 1, y: 0, duration: animationDuration, stagger: staggerDelay, ease: animationEase });
    return () => animation.revert();
  }, [open, animationDuration, staggerDelay, animationEase]);

  return (
    <>
      <div className={['bubble-menu', position, className].filter(Boolean).join(' ')} style={style}>
        <div className="bubble logo-bubble" style={{ background: menuBg }}>
          <span className="logo-content">{typeof logo === 'string' ? <img src={logo} alt="AidConnect" className="bubble-logo" /> : logo}</span>
        </div>
        {/* MODIFIED(7): keep shared controls in the bar. */}
        {actions}
        {/* MODIFIED(3,8): disclosure semantics and a 44px target. */}
        <button ref={toggle} type="button" className={`bubble toggle-bubble menu-btn ${open ? 'open' : ''}`}
          aria-expanded={open} aria-controls={id} aria-label={menuAriaLabel}
          style={{ background: menuBg, minWidth: 44, minHeight: 44 }}
          onClick={() => { if (open) close(true); else { setOpenAt(location.key); onMenuClick?.(true); } }}>
          <span className="menu-line" style={{ background: menuContentColor }} />
          <span className="menu-line short" style={{ background: menuContentColor }} />
        </button>
      </div>
      {/* MODIFIED(2,6): standard site navigation on an opaque canvas. */}
      <nav id={id} ref={overlay} aria-label="Site pages" hidden={!open}
        className={`bubble-menu-items ${position}`}
        style={{ display: open ? 'flex' : 'none', background: 'var(--bg)', overflowY: 'auto' }}>
        {open && <ul className="pill-list">
          {items.map(item => {
            const pillStyle = {
              '--item-rot': `${item.rotation ?? 0}deg`, '--pill-bg': menuBg,
              '--pill-color': menuContentColor, '--hover-bg': item.hoverStyles?.bgColor ?? menuBg,
              '--hover-color': item.hoverStyles?.textColor ?? menuContentColor,
            };
            const label = <span className="pill-label">{item.label}</span>;
            // MODIFIED(1): client-side links, plus a button for the logout action.
            return <li key={item.label} className="pill-col">
              {item.to ? <NavLink to={item.to} className="pill-link" style={pillStyle} onClick={() => close()}>{label}</NavLink>
                : <button type="button" className="pill-link" style={pillStyle} onClick={() => { item.onClick?.(); close(true); }}>{label}</button>}
            </li>;
          })}
        </ul>}
      </nav>
    </>
  );
}
