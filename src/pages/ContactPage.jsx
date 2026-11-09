import React from 'react';

const labelClasses = 'grid gap-[0.45rem] font-medium text-(--muted)';
const fieldClasses = 'w-full rounded-xl border border-(--line) bg-white/2 px-[0.9rem] py-[0.8rem] text-(--text) focus:outline-2 focus:outline-offset-2 focus:outline-(--primary)';

const ContactPage = () => {
  return (
    <section className="pt-[4.5rem] pb-16">
      <div className="mx-auto w-[calc(100%-2rem)] grid max-w-[1120px] items-start gap-8 min-[761px]:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="mt-0 mb-3 text-[0.72rem] font-bold tracking-[0.12em] text-(--primary) uppercase">Contact us</p>
          <h1 id="contact-title">Let’s build something great together.</h1>
          <p className="max-w-[520px] text-[1.05rem] text-(--muted)">
            Use this page as a starting point for your contact form, project inquiry, or business request.
          </p>
        </div>

        <form className="grid gap-4 rounded-[22px] border border-(--line) bg-(--panel) p-6" aria-labelledby="contact-title">
          <label className={labelClasses}>
            Name
            <input className={fieldClasses} type="text" autoComplete="name" placeholder="Your name" />
          </label>

          <label className={labelClasses}>
            Email
            <input className={fieldClasses} type="email" autoComplete="email" placeholder="you@example.com" />
          </label>

          <label className={labelClasses}>
            Message
            <textarea className={fieldClasses} rows="5" placeholder="Write your message here..." />
          </label>

          <button type="submit" className="inline-flex items-center justify-center rounded-full border border-transparent bg-[#c6f432] px-[1.3rem] py-[0.8rem] font-semibold text-[#08111f] transition">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
