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
    <section className="section page-section">
      <div className="container narrow">
        <div className="section-heading align-left">
          <p className="eyebrow">About us</p>
          <h2>We design simple experiences with real purpose.</h2>
        </div>

        <div className="story-block">
          <p>
            This starter website template is built to help you structure a small product,
            portfolio, or business landing page quickly without starting from a blank canvas.
          </p>
          <p>
            The layout is intentionally clean and modular, so you can add content, pages,
            images, or sections as your project grows.
          </p>
        </div>

        <div className="feature-grid alt-grid">
          {values.map((value) => (
            <article className="feature-card" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
