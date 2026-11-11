import LoadingImage from '../components/LoadingImage.jsx';
import React, { lazy, useRef } from 'react';
import { Link } from 'react-router-dom';
import volunteerPhoto from '../assets/photos/volunteers-packing-donations.webp';
import volunteerPhotoSmall from '../assets/photos/volunteers-packing-donations-768.webp';
import wordmark from '../assets/brand/aidconnect-wordmark.svg';
import cleanupPhoto from '../assets/photos/coastal-cleanup.webp';
import packingPhoto from '../assets/photos/food-packing.webp';
import distributionPhoto from '../assets/photos/volunteer-food-distribution.webp';
import sortingPhoto from '../assets/photos/community-donation-sorting.webp';
import tutoringPhoto from '../assets/photos/student-tutoring.webp';
import healthPhoto from '../assets/photos/community-health.webp';
import animalPhoto from '../assets/photos/animal-welfare.webp';
import communityPhoto from '../assets/photos/community-gardening.webp';
import seniorPhoto from '../assets/photos/senior-support.webp';
import artsPhoto from '../assets/photos/arts-workshop.webp';
import sportsPhoto from '../assets/photos/youth-sports.webp';
import accessibilityPhoto from '../assets/photos/accessibility-support.webp';
import Container from '../components/Container.jsx';
import DeferredContent from '../components/DeferredContent.jsx';
import PhotoCredit from '../components/PhotoCredit.jsx';
import OpportunityGrid from '../components/OpportunityGrid.jsx';
import { OrganizationTrail, RegionalPlatforms, VolunteerPhotoBand } from '../components/HomeExtras.jsx';


const ScrollReveal = lazy(() => import('../components/fx/ScrollReveal/ScrollReveal.jsx'));
const mission = 'Lebanon runs on people who show up. AidConnect makes it easier to find the shift that fits your week.';

const causes = [
  { name: 'Environment', description: 'Clean up shorelines and care for shared spaces.', image: cleanupPhoto, alt: 'Volunteers cleaning up litter on a beach', credit: { photographer: 'Ron Lach', source: 'https://www.pexels.com/photo/people-on-beach-holding-white-sack-9035238/' } },
  { name: 'Food support', description: 'Sort supplies and pack food for neighbors.', image: packingPhoto, alt: 'Volunteers preparing food rations together', credit: { photographer: 'cottonbro studio', source: 'https://www.pexels.com/photo/people-preparing-food-rations-in-the-box-6590928/' } },
  { name: 'Education', description: 'Help students with reading and schoolwork.', image: tutoringPhoto, alt: 'An educator helping a student read in a library', credit: { photographer: 'Mikhail Nilov', source: 'https://www.pexels.com/photo/teacher-and-student-in-a-library-8342278/' } },
  { name: 'Health', description: 'Help welcome visitors and organize community health events.', image: healthPhoto, alt: 'A healthcare worker checking a patient’s blood pressure', credit: { photographer: 'Sahil Singh', source: 'https://www.pexels.com/photo/healthcare-professional-checking-patient-blood-pressure-35645526/' } },
  { name: 'Animal welfare', description: 'Support shelters with feeding, walks, and adoption events.', image: animalPhoto, alt: 'A volunteer feeding rescued dogs at a shelter', credit: { photographer: 'Mia X', source: 'https://www.pexels.com/photo/volunteer-feeding-rescued-dogs-at-animal-shelter-35231857/' } },
  { name: 'Community support', description: 'Work with neighbors on gardens and shared spaces.', image: communityPhoto, alt: 'Neighbors working together on a community garden', credit: { photographer: 'Zack Gilbert', source: 'https://www.pexels.com/photo/community-gardening-project-in-bloomington-39778110/' } },
  { name: 'Senior support', description: 'Offer companionship and help with social activities.', image: seniorPhoto, alt: 'A caregiver assisting an older adult at home', credit: { photographer: 'Jsme MILA', source: 'https://www.pexels.com/photo/elderly-caregiver-assisting-senior-woman-at-home-29372727/' } },
  { name: 'Arts and culture', description: 'Help run workshops and community events.', image: artsPhoto, alt: 'Participants working on art in a workshop', credit: { photographer: 'Anna Tarazevich', source: 'https://www.pexels.com/photo/people-in-an-art-workshop-6146655/' } },
  { name: 'Youth sports', description: 'Help coaches run practice and welcome young players.', image: sportsPhoto, alt: 'Children playing soccer outdoors', credit: { photographer: 'K', source: 'https://www.pexels.com/photo/children-playing-soccer-2898317/' } },
  { name: 'Accessibility', description: 'Help make local events welcoming and accessible.', image: accessibilityPhoto, alt: 'A woman assisting a man who uses a wheelchair', credit: { photographer: 'SHVETS production', source: 'https://www.pexels.com/photo/a-woman-pushing-a-wheelchair-with-man-8415522/' } },
];

const causeColors = ['#a9dfb5', '#ffc5a6', '#a8d9f4', '#ffd0da', '#f5dd9f', '#c9df9c', '#dbcbf5', '#efbaf1', '#a2e2dd', '#ffc9e2'];

export default function HomePage() {
  const gallery = useRef(null);

  function scrollCauses(direction) {
    const rail = gallery.current;
    const card = rail.firstElementChild;
    if (card) rail.scrollBy({ left: direction * (card.offsetWidth + parseFloat(getComputedStyle(rail).columnGap)) });
  }
  return (
    <div className="aid-home flex flex-1 flex-col font-body [&_:is(h1,h2,h3)]:font-display [&_:is(h1,h2,h3)]:tracking-[-0.02em] [&_:focus-visible]:outline-2 [&_:focus-visible]:outline-offset-4">
      <section aria-labelledby="home-title" className="relative isolate flex flex-1 flex-col bg-(--bg) text-(--text)">
        <div className="absolute inset-0 after:pointer-events-none after:absolute after:inset-0 after:bg-aid-scrim/65 after:content-['']">
          <LoadingImage src={volunteerPhoto} srcSet={`${volunteerPhotoSmall} 768w, ${volunteerPhoto} 1440w`} sizes="100vw"
            alt="Three volunteers sorting donations into cardboard boxes. Photo by Gustavo Fring on Pexels."
            loading="eager" fetchPriority="high" className="h-full w-full object-cover object-center" />
        </div>
        <Container className="pointer-events-none relative z-10 flex min-h-[70vh] flex-1 items-center pt-8 pb-12 text-white md:pt-28 md:pb-20">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest">Volunteering in Lebanon</p>
            <h1 id="home-title" className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
              <span className="block">A few hours from you.</span>
              <span className="block">A real difference near you.</span>
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Browse food drives, cleanups, and tutoring shifts run by local
              organizations, and sign up in a couple of minutes.
            </p>
            <div className="pointer-events-auto mt-8 flex w-fit flex-wrap gap-3">
              <Link to="/opportunities" className="rounded-md bg-aid-primary px-5 py-3 font-semibold text-white hover:bg-white hover:text-aid-primary">
                Browse opportunities
              </Link>
              <Link to="/organizations/register" className="rounded-md bg-white px-5 py-3 font-semibold text-aid-primary transition-colors hover:bg-aid-primary hover:text-white focus-visible:bg-aid-primary focus-visible:text-white">
                Post an opportunity
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section aria-label="What the demo covers" className="border-y border-(--line) bg-(--panel) text-(--text)">
        <Container className="py-5">
          <dl className="m-0 grid grid-cols-3 text-center [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1 [&>div]:px-2 [&>div+div]:border-s [&>div+div]:border-(--line) [&_dt]:text-sm [&_dt]:text-(--muted) [&_dd]:m-0 [&_dd]:text-[1.75rem] [&_dd]:font-extrabold [&_dd]:text-(--primary)">
            <div><dt>Causes to explore</dt><dd>10</dd></div>
            <div><dt>Sample opportunities</dt><dd>7</dd></div>
            <div><dt>Lebanese cities represented</dt><dd>5</dd></div>
          </dl>
        </Container>
      </section>
      <section aria-label="AidConnect mission">
        <Container className="py-12">
          <DeferredContent fallback={<h2 className="mx-auto my-5 max-w-4xl text-[clamp(1.6rem,4vw,3rem)] leading-[1.5] font-extrabold text-ink">{mission}</h2>}>
            <ScrollReveal mode="enter" splitBy="words" effect="rise" stagger={0.04} duration={0.6}
              baseRotation={0} enableBlur={false} baseOpacity={0.15}
              textClassName="font-display font-extrabold text-ink" containerClassName="mx-auto max-w-4xl">{mission}</ScrollReveal>
          </DeferredContent>
        </Container>
      </section>
      <section aria-labelledby="featured-title">
        <Container className="py-12 md:py-16">
          <h2 id="featured-title">Latest opportunities and shifts</h2>
          <p className="text-(--muted)">Browse recent listings from volunteer organizations.</p>
          <OpportunityGrid featured />
          <Link to="/opportunities" className="mt-4 inline-block font-semibold underline">See all opportunities</Link>
        </Container>
      </section>

      <section aria-labelledby="how-title" className="border-t border-(--aid-rule)">
        <Container className="py-12">
          <h2 id="how-title">How it works</h2>
          <ol className="grid gap-6 pl-5 sm:grid-cols-3">
            <li><strong>Find a shift.</strong> Check the date, meeting location, and signup type.</li>
            <li><strong>Reserve a spot or apply.</strong> Open signup confirms your spot immediately. Approval-required shifts need a decision from the organizer.</li>
            <li><strong>See your status in your dashboard.</strong> Check your reservations and whether your applications are pending, accepted, or declined.</li>
          </ol>
        </Container>
      </section>

      <VolunteerPhotoBand src={distributionPhoto} />

      <Container className="flex justify-center py-10 md:py-16">
        <div className="w-full max-w-[25rem]">
          <LoadingImage src={wordmark} alt="AidConnect cedar wordmark" className="block h-auto w-full dark:brightness-[1.8]" width="1366" height="285" />
        </div>
      </Container>

      <section aria-labelledby="causes-title">
        <Container className="py-12">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="causes-title" className="m-0">Explore the causes</h2>
            <div className="flex gap-2">
              <button type="button" aria-label="Scroll causes left" aria-controls="cause-gallery" onClick={() => scrollCauses(-1)}
                className="min-h-11 min-w-11 cursor-pointer rounded-full border border-current bg-transparent text-inherit">←</button>
              <button type="button" aria-label="Scroll causes right" aria-controls="cause-gallery" onClick={() => scrollCauses(1)}
                className="min-h-11 min-w-11 cursor-pointer rounded-full border border-current bg-transparent text-inherit">→</button>
            </div>
          </div>
          <ul id="cause-gallery" ref={gallery} aria-label="Volunteer causes" tabIndex={0} className="grid list-none auto-cols-[85%] grid-flow-col snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pt-3 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-safe:scroll-smooth sm:auto-cols-[calc((100%-1rem)/2)] md:auto-cols-[calc((100%-2rem)/3)] lg:auto-cols-[calc((100%-4rem)/5)]">
            {causes.map(({ name, description, image, alt, credit }, index) => (
              <li key={name} className="group/cause relative motion-safe:transition-[translate,box-shadow] motion-safe:duration-200 motion-safe:hover:-translate-x-[5px] motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_12px_22px_-12px_var(--aid-pop)] motion-safe:focus-within:-translate-x-[5px] motion-safe:focus-within:-translate-y-1 snap-start overflow-hidden rounded-lg border border-(--aid-rule) border-t-[5px] border-t-(--cause-color) bg-(--aid-surface)" style={{ "--cause-color": causeColors[index] }}>
                <figure className="group/photo relative m-0">
                  <LoadingImage src={image} alt={alt} loading="lazy" width="800" height="533"
                    className="aspect-video h-auto w-full object-cover" />
                  <PhotoCredit {...credit} />
                </figure>
                <div className="p-4">
                  <h3 className="m-0 text-base font-bold">
                    <Link className="after:absolute after:inset-0 after:content-[''] focus-visible:after:outline-2 focus-visible:after:-outline-offset-3" to={'/opportunities?cause=' + encodeURIComponent(name)}>{name}</Link>
                  </h3>
                  <p className="text-(--muted) m-0 mt-2">{description}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <RegionalPlatforms />

      <section aria-labelledby="organization-title" className="border-y border-(--line) bg-(--panel) text-(--text)">
        <Container className="grid items-center gap-8 py-12 md:grid-cols-[1.25fr_1fr]">
          <div className="relative z-10">
          <h2 id="organization-title">Run a drive or a cleanup? Post it here.</h2>
          <p>Try posting shifts and reviewing volunteer applications in the organization demo.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link to="/organizations/dashboard" className="inline-flex rounded-md bg-aid-primary px-5 py-3 font-semibold text-white hover:underline">Try the organization dashboard</Link>
            <Link to="/organizations/register" className="inline-flex min-h-11 items-center font-semibold underline">Post an opportunity</Link>
          </div>
          </div>
          <OrganizationTrail photo={sortingPhoto} />
        </Container>
      </section>
    </div>
  );
}
