import LoadingImage from './LoadingImage.jsx';
import React, { lazy, useState } from 'react';
import { Link } from 'react-router-dom';
import Container from './Container.jsx';
import DeferredContent from './DeferredContent.jsx';
import PhotoCredit from './PhotoCredit.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
import useMediaQuery from '../hooks/useMediaQuery.js';
const LogoLoop = lazy(() => import('./fx/LogoLoop/LogoLoop.jsx'));
const ScrollExpand = lazy(() => import('./fx/ScrollExpand/ScrollExpand.jsx'));

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
const logos = import.meta.glob('../assets/logos/*.{svg,png}', { eager: true, query: '?url', import: 'default' });

const platformLogos = platforms.map(({ slug, title, href }) => {
  const path = '../assets/logos/' + slug;
  const src = logos[path + '.svg'] ?? logos[path + '.png'];
  return src
    ? { src, alt: title, href }
    : { node: <span className="font-display font-extrabold text-ink">{title}</span>, title, href };
});

export function RegionalPlatforms() {
  const reducedMotion = useReducedMotion();
  const [playback, setPlayback] = useState(null);
  const playing = playback ?? !reducedMotion;
  return (
    <section aria-labelledby="region-title" className="border-t border-(--aid-rule)">
      <Container className="py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="region-title">Volunteering across Lebanon and the region</h2>
          <button type="button" className="inline-grid min-h-11 min-w-11 cursor-pointer place-items-center rounded-full border border-current"
            aria-controls="regional-logo-carousel" aria-label={playing ? 'Pause organization carousel' : 'Play organization carousel'}
            onClick={() => setPlayback(!playing)}>
            <span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span>
          </button>
        </div>
        <div id="regional-logo-carousel" className="min-w-0">
          <DeferredContent fallback={
            <div className="flex min-h-[3.25rem] items-center justify-around gap-4 [&>span]:h-8 [&>span]:w-[min(25%,8rem)] [&>span]:rounded-lg" aria-hidden="true">
              <span className="bg-(--line) motion-safe:animate-skeleton" />
              <span className="bg-(--line) motion-safe:animate-skeleton" />
              <span className="bg-(--line) motion-safe:animate-skeleton" />
            </div>
          }>
            <LogoLoop logos={platformLogos} ariaLabel="Volunteering platforms across Lebanon and the region"
              speed={playing ? 50 : 0} direction="left" logoHeight={32} gap={40} pauseOnHover={false}
              respectReducedMotion={false}
              intro={false} fadeOut scaleOnHover={false} draggable labels="none" className="pt-2 pb-3 [&_.logoloop__node]:block [&_img]:[filter:brightness(0)_saturate(100%)_invert(30%)_sepia(31%)_saturate(1165%)_hue-rotate(103deg)_brightness(92%)] dark:[&_img]:[filter:brightness(0)_invert(1)]" />
          </DeferredContent>
        </div>
      </Container>
    </section>
  );
}

export function VolunteerPhotoBand({ src }) {
  const desktop = useMediaQuery('(min-width: 768px)');
  const reduced = useReducedMotion();
  const scrollDistance = desktop ? 0.8 : 0.55;
  const holdDistance = 0.15;
  const message = (
    <div className="m-auto max-w-xl rounded-xl bg-(--panel) p-6 text-(--text)">
      <h2 id="volunteer-photo-title">Two hours. One shift. Real people.</h2>
      <p>Find a local shift that fits the time you have.</p>
      <Link to="/opportunities" className="inline-flex rounded-lg bg-(--primary) px-4 py-3 font-bold text-(--bg)">Browse opportunities</Link>
    </div>
  );
  if (reduced) {
    return (
      <section aria-labelledby="volunteer-photo-title" className="bg-(--panel)">
        <figure className="group/photo relative m-0">
          <LoadingImage src={src} alt="Volunteers carrying boxes of food for distribution" loading="lazy" className="aspect-video max-h-72 w-full object-cover" />
          <PhotoCredit photographer="Lagos Food Bank Initiative" source="https://www.pexels.com/photo/happy-volunteers-carrying-boxes-8061641/" />
        </figure>
        {message}
      </section>
    );
  }
  return (
    <section aria-labelledby="volunteer-photo-title">
      <DeferredContent rootMargin="1200px 0px" fallback={
        <div style={{ minHeight: `${100 * (1 + scrollDistance + holdDistance)}svh` }}>
          <div className="sticky bg-(--line) motion-safe:animate-skeleton top-0 grid min-h-svh place-items-center p-4 text-center">{message}</div>
        </div>
      }>
        <figure className="group/photo relative m-0">
          <ScrollExpand src={src} alt="Volunteers carrying boxes of food for distribution" title="Show up."
            useWindowScroll startWidth={desktop ? 46 : 82} startHeight={desktop ? 60 : 54} startRadius={24} mediaZoom={1.2}
            scrollDistance={scrollDistance} holdDistance={holdDistance} startOffset={0.35} smoothing={0.04}
            overlayScrim={0.6}>
            {message}
          </ScrollExpand>
          <PhotoCredit photographer="Lagos Food Bank Initiative" source="https://www.pexels.com/photo/happy-volunteers-carrying-boxes-8061641/" />
        </figure>
      </DeferredContent>
    </section>
  );
}

export function OrganizationTrail({ photo }) {
  return (
    <figure className="group/photo relative m-0">
      <div className="relative block h-52 overflow-hidden rounded-xl md:bg-(--primary)">
        <LoadingImage src={photo} alt="Volunteers sorting clothes and food at a donation center" className="absolute inset-0 size-full object-cover" />
      </div>
      <PhotoCredit photographer="Julia M Cameron" source="https://www.pexels.com/photo/people-sorting-donations-6994963/" />
    </figure>
  );
}
