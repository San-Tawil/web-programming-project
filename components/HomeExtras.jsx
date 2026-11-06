import LoadingImage from './LoadingImage.jsx';
import React, { lazy, Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from './Container.jsx';
import PhotoCredit from './PhotoCredit.jsx';
import LogoLoop from '../src/components/fx/LogoLoop/LogoLoop.jsx';
import useReducedMotion from '../src/hooks/useReducedMotion.js';
import useMediaQuery from '../src/hooks/useMediaQuery.js';
import useCssVar from '../src/hooks/useCssVar.js';
const PixelTrail = lazy(() => import('../src/components/fx/PixelTrail/PixelTrail.jsx'));
import ScrollExpand from '../src/components/fx/ScrollExpand/ScrollExpand.jsx';

const platforms = [
  { slug: 'nahno', title: 'Nahno Volunteers', region: 'Lebanon', href: 'https://www.nahno-volunteers.com/' },
  { slug: 'volunteer-circle', title: 'The Volunteer Circle', region: 'Lebanon', href: 'https://www.thevolunteercircle.com/' },
  { slug: 'offre-joie', title: 'Offre Joie', region: 'Lebanon', href: 'https://offrejoie.org/volunteers/' },
  { slug: 'lebanese-food-bank', title: 'Lebanese Food Bank', region: 'Lebanon', href: 'https://lebanesefoodbank.org/take-action/volunteer/' },
  { slug: 'arcenciel', title: 'arcenciel', region: 'Lebanon', href: 'https://www.arcenciel.org/faq' },
  { slug: 'animals-lebanon', title: 'Animals Lebanon', region: 'Lebanon', href: 'https://www.animalslebanon.org/get-involved/volunteer' },
  { slug: 'injaz-lebanon', title: 'INJAZ Lebanon', region: 'Lebanon', href: 'https://www.injaz-lebanon.org/' },
  { slug: 'embrace', title: 'Embrace', region: 'Lebanon', href: 'https://embracelebanon.org/' },
  { slug: 'ahla-fawda', title: 'Ahla Fawda', region: 'Lebanon', href: 'https://ahlafawda.org/' },
  { slug: 'abaad', title: 'ABAAD', region: 'Lebanon', href: 'https://www.abaadmena.org/' },
  { slug: 'ajialouna', title: 'Ajialouna', region: 'Lebanon', href: 'https://ajialouna.org/' },
  { slug: 'mmkn', title: 'MMKN', region: 'Lebanon', href: 'https://www.mmkn.org/' },
  { slug: 'anera', title: 'Anera', region: 'Lebanon · MENA', href: 'https://www.anera.org/' },
  { slug: 'volunteers-ae', title: 'Volunteers.ae', region: 'UAE', href: 'https://volunteers.ae/' },
  { slug: 'takatof', title: 'Takatof', region: 'UAE', href: 'https://secure.takatof.ae/en/programsandinitiatives/takatof' },
];

// Optional approved marks belong in src/assets/logos. Text labels work without those files.
const logos = import.meta.glob('../src/assets/logos/*.{svg,png}', { eager: true, query: '?url', import: 'default' });

const logoFor = (platform) => logos['../src/assets/logos/' + platform.slug + '.svg'] ?? logos['../src/assets/logos/' + platform.slug + '.png'];

export function RegionalPlatforms() {
  const reducedMotion = useReducedMotion();
  const [playback, setPlayback] = useState(null);
  const playing = playback ?? !reducedMotion;
  return (
    <section aria-labelledby="region-title" className="aid-surface">
      <Container className="py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="region-title">Volunteering across Lebanon and the region</h2>
          <button type="button" className="aid-carousel-control"
            aria-controls="regional-logo-carousel" aria-label={playing ? 'Pause organization carousel' : 'Play organization carousel'}
            onClick={() => setPlayback(!playing)}>
            <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
          </button>
        </div>
        <div id="regional-logo-carousel">
          <LogoLoop logos={platforms.map(platform => {
            const src = logoFor(platform);
            return src ? { src, alt: platform.title, href: platform.href }
              : { node: <span className="font-display font-extrabold text-ink">{platform.title}</span>, title: platform.title, href: platform.href };
          })} ariaLabel="Volunteering platforms across Lebanon and the region"
            speed={playing ? 50 : 0} direction="left" logoHeight={32} gap={56} pauseOnHover={false}
            respectReducedMotion={false}
            intro={false} fadeOut scaleOnHover={false} draggable labels="none" className="aid-platform-loop" />
        </div>
      </Container>
    </section>
  );
}

export function VolunteerPhotoBand({ src }) {
  const reduced = useReducedMotion();
  return (
    <section aria-labelledby="volunteer-photo-title">
      <figure className="m-0">
      <ScrollExpand src={src} alt="Volunteers carrying boxes of food for distribution" title="Show up."
        useWindowScroll startWidth={46} startHeight={60} startRadius={24} mediaZoom={1.2}
        scrollDistance={reduced ? 0 : 0.8} holdDistance={reduced ? 0 : 0.15}
        enabled={!reduced} overlayScrim={0.6}>
        <div className="aid-photo-message">
          <h2 id="volunteer-photo-title">Two hours. One shift. Real people.</h2>
          <p>Find a local shift that fits the time you have.</p>
          <Link to="/opportunities" className="aid-accent-button">Browse opportunities</Link>
        </div>
      </ScrollExpand>
        <PhotoCredit photographer="Lagos Food Bank Initiative" source="https://www.pexels.com/photo/happy-volunteers-carrying-boxes-8061641/" />
      </figure>
    </section>
  );
}

export function OrganizationTrail({ photo }) {
  const reduced = useReducedMotion();
  const fine = useMediaQuery('(min-width: 768px) and (pointer: fine)');
  const color = useCssVar('--fx-on-accent');
  const trailColor = useCssVar('--primary');

  return (
    <figure className="m-0 aid-organization-photo">
    <div className="aid-trail-panel">
      <LoadingImage src={photo} alt="Volunteers sorting clothes and food at a donation center" loading="lazy" className="aid-trail-photo" />
      {!reduced && fine && color && trailColor && (
        <Suspense fallback={null}>
          <div aria-hidden="true" className="absolute inset-0">
          <PixelTrail gridSize={44} trailSize={0.08} maxAge={450} interpolate={5}
            gooeyFilter={{ strength: 2 }} gap={0.1} shine={0.3} glow={0.2}
            color={color} trailColor={trailColor} />
          </div>
        </Suspense>
      )}
    </div>
      <PhotoCredit photographer="Julia M Cameron" source="https://www.pexels.com/photo/people-sorting-donations-6994963/" />
    </figure>
  );
}
