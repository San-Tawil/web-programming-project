import React from 'react';
import { Link } from 'react-router-dom';
import volunteerPhoto from '../assets/volunteers-packing-donations.jpg';
import Container from '../components/Container.jsx';
import OpportunityGrid from '../components/OpportunityGrid.jsx';
import './home.css';

export default function HomePage() {
  return (
    <div className="aid-home">
      <section aria-labelledby="home-title" className="aid-hero">
        <div className="aid-hero-media">
          <img src={volunteerPhoto} alt="Three volunteers sorting donations into cardboard boxes" title="Volunteers sorting donations, by Gustavo Fring on Pexels" width="1440" height="960" fetchPriority="high" className="aid-photo w-full object-cover object-right" />
        </div>
        <Container className="aid-hero-content flex items-center pb-16 text-white md:pb-24">
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
              <Link to="/register" className="rounded-md border border-white px-5 py-3 font-semibold text-white hover:bg-white hover:text-aid-primary">
                Post an opportunity
              </Link>
            </div>
          </div>
        </Container>
      </section>
      <section aria-label="Ways to volunteer" className="bg-aid-footer text-white">
        <Container className="grid gap-4 py-6 sm:grid-cols-3">
          <p className="m-0"><strong>3 causes</strong> to explore in the demo</p>
          <p className="m-0"><strong>1–3 hours</strong> per sample shift</p>
          <p className="m-0"><strong>Local roles</strong> across Beirut</p>
        </Container>
      </section>

      <section aria-labelledby="featured-title">
        <Container className="py-12 md:py-16">
          <h2 id="featured-title">Featured opportunities</h2>
          <p className="aid-muted">Sample listings for the course demo</p>
          <OpportunityGrid />
          <Link to="/opportunities" className="mt-4 inline-block font-semibold underline">See all opportunities</Link>
        </Container>
      </section>

      <section aria-labelledby="how-title" className="aid-surface">
        <Container className="py-12">
          <h2 id="how-title">How it works</h2>
          <ol className="grid gap-6 pl-5 sm:grid-cols-3">
            <li><strong>Find a role.</strong> Browse by cause, location, or time commitment.</li>
            <li><strong>Get in touch.</strong> Check what the organization needs and how to apply.</li>
            <li><strong>Show up.</strong> Give your time and help with the work on the day.</li>
          </ol>
        </Container>
      </section>

      <section aria-labelledby="causes-title">
        <Container className="py-12">
          <h2 id="causes-title">Explore the causes</h2>
          <ul className="grid list-none gap-4 p-0 sm:grid-cols-3">
            <li><strong>Environment</strong><p className="aid-muted">Care for coastlines and shared spaces.</p></li>
            <li><strong>Food support</strong><p className="aid-muted">Help sort, pack, and distribute donations.</p></li>
            <li><strong>Education</strong><p className="aid-muted">Give students time to read and learn.</p></li>
          </ul>
        </Container>
      </section>

      <section aria-labelledby="organization-title" className="bg-aid-footer text-white">
        <Container className="py-12">
          <h2 id="organization-title">Need volunteers for your next project?</h2>
          <p>Tell local volunteers what you need, where to show up, and how much time to set aside.</p>
          <Link to="/register" className="inline-flex rounded-md bg-white px-5 py-3 font-semibold text-aid-primary hover:underline">Post an opportunity</Link>
        </Container>
      </section>
    </div>
  );
}
