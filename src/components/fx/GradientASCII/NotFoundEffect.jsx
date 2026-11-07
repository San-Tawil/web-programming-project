import React, { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext.jsx';
import useCssVar from '../../../hooks/useCssVar.js';
import './NotFoundEffect.css';

const GradientASCII = lazy(() => import('./GradientASCII.jsx'));

export default function NotFoundEffect() {
  const { dark } = useTheme();
  const primary = useCssVar('--primary');
  const green = useCssVar('--primary-strong');
  const accent = useCssVar('--fx-accent');
  const ink = useCssVar('--text');
  const mint = useCssVar('--fx-chip-mint');
  const accentInk = useCssVar('--fx-on-accent');
  const light = !dark;
  const colors = light ? [mint, primary, accentInk] : [primary, green, accent, ink];

  return (
    <section aria-labelledby="missing-title" className="aid-missing">
      <div aria-hidden="true" className="aid-missing-effect">
        {colors.every(Boolean) && <Suspense fallback={null}>
          <GradientASCII shape="eclipse" cellSize={16} density={0.7} glow={0.2} grain={0.06}
            mouseInteraction clickEffect="wave" lightMode={light} colors={colors} />
        </Suspense>}
      </div>
      <div className="aid-missing-card">
        <h1 id="missing-title">That page took the day off.</h1>
        <Link className="inline-flex rounded-lg bg-(--primary) px-4 py-3 font-bold text-(--bg)" to="/">Back to Home</Link>
      </div>
    </section>
  );
}
