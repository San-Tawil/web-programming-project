const values = [
  {
    title: 'Our mission',
    text: 'To create straightforward, polished digital experiences that communicate clearly and convert visitors into users.',
  },
  {
    title: 'Our approach',
    text: 'We focus on clean structure, logical content flow, and a balance between usability and visual personality.',
  },
  {
    title: 'Our focus',
    text: 'Delivering templates that are easy to customize while remaining modern, responsive, and scalable.',
  },
];

const AboutPage = () => {
  return (
    <section className="pt-[4.5rem] pb-16">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[880px]">
        <div className="mb-8 text-left">
          <p className="mt-0 mb-3 text-[0.72rem] font-bold tracking-[0.12em] text-(--primary) uppercase">About us</p>
          <h1>We design simple experiences with real purpose.</h1>
        </div>

        <div className="mt-8 mb-10 grid gap-4 [&>p]:mb-0 [&>p]:text-(--muted)">
          <p>
            This starter website template is built to help you structure a small product,
            portfolio, or business landing page quickly without starting from a blank canvas.
          </p>
          <p>
            The layout is intentionally clean and modular, so you can add content, pages,
            images, or sections as your project grows.
          </p>
        </div>

        <div className="grid gap-[1.3rem] min-[761px]:grid-cols-3">
          {values.map((value) => (
            <article className="rounded-[22px] border border-(--line) bg-(--panel) p-6 shadow-(--card-shadow)" key={value.title}>
              <h2>{value.title}</h2>
              <p className="mb-0 text-(--muted)">{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
