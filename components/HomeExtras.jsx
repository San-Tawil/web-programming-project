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
  { slug: 'anera', title: 'Anera', region: 'Lebanon · MENA', href: 'https://www.anera.org/' },
  { slug: 'volunteers-ae', title: 'Volunteers.ae', region: 'UAE', href: 'https://volunteers.ae/' },
  { slug: 'takatof', title: 'Takatof', region: 'UAE', href: 'https://secure.takatof.ae/en/programsandinitiatives/takatof' },
];

// Optional approved marks belong in src/assets/logos. Text labels work without those files.
const logos = import.meta.glob('../src/assets/logos/*.{svg,png}', { eager: true, query: '?url', import: 'default' });

const logoFor = (platform) => logos['../src/assets/logos/' + platform.slug + '.svg'] ?? logos['../src/assets/logos/' + platform.slug + '.png'];

function PlatformMark(platform) {
  const logo = logoFor(platform);
  return (
    <span className="flex min-h-24 min-w-40 flex-col items-center justify-center gap-2 px-2 py-3 text-center">
      {logo ? <img src={logo} alt={platform.title} className="aid-platform-logo h-8 max-w-40 object-contain" /> : <strong>{platform.title}</strong>}
      <span className="aid-muted text-sm">{platform.region}</span>
    </span>
  );
}

function PlatformLink(platform) {
  return <a href={platform.href} className="block h-full hover:underline">{PlatformMark(platform)}</a>;
}

export function RegionalPlatforms() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  return (
    <section aria-labelledby="region-title" className="aid-surface">
      <Container className="py-12 md:py-16">
        <h2 id="region-title">Volunteering across Lebanon and the region</h2>
        <p className="aid-muted max-w-2xl">Platforms and programs worth knowing. AidConnect is a student project and is not affiliated with any of them. Logos belong to their owners.</p>
        {!reducedMotion && (
          <button type="button" onClick={() => setPaused(!paused)} className="mb-4 cursor-pointer rounded-md border border-current bg-transparent px-3 py-2 text-inherit">
            {paused ? 'Resume logo carousel' : 'Pause logo carousel'}
          </button>
        )}
        {reducedMotion || paused ? (
          <ul aria-label="Volunteering platforms across Lebanon and the region" className="grid list-none gap-4 p-0 sm:grid-cols-3 lg:grid-cols-5">
            {platforms.map(platform => <li key={platform.slug}>{PlatformLink(platform)}</li>)}
          </ul>
        ) : (
          <LogoLoop logos={platforms.map(platform => {
            const src = logoFor(platform);
            return src ? { src, alt: platform.title, href: platform.href }
              : { node: <span className="font-display font-extrabold text-ink">{platform.title}</span>, title: platform.title, href: platform.href };
          })} ariaLabel="Volunteering platforms across Lebanon and the region"
            speed={50} direction="left" logoHeight={32} gap={56} hoverSpeed={0}
            intro={false} fadeOut scaleOnHover={false} draggable labels="none" className="aid-platform-loop" />
        )}
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
      <img src={photo} alt="Volunteers sorting clothes and food at a donation center" loading="lazy" className="aid-trail-photo" />
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