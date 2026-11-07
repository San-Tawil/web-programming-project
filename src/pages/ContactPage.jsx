const ContactPage = () => {
  return (
    <section className="section page-section">
      <div className="container contact-layout">
        <div>
          <p className="eyebrow">Contact us</p>
          <h1 id="contact-title">Let’s build something great together.</h1>
          <p className="lead compact">
            Use this page as a starting point for your contact form, project inquiry, or business request.
          </p>
        </div>

        <form className="contact-form" aria-labelledby="contact-title">
          <label>
            Name
            <input type="text" autoComplete="name" placeholder="Your name" />
          </label>

          <label>
            Email
            <input type="email" autoComplete="email" placeholder="you@example.com" />
          </label>

          <label>
            Message
            <textarea rows="5" placeholder="Write your message here..." />
          </label>

          <button type="submit" className="button primary">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;
