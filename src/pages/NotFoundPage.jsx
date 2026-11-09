import React from 'react';

const NotFoundPage = () => {
  return (
    <section className="pt-[4.5rem] pb-16 text-center">
      <div className="mx-auto w-[calc(100%-2rem)] max-w-[880px]">
        <p className="mt-0 mb-3 text-[0.72rem] font-bold tracking-[0.12em] text-(--primary) uppercase">404</p>
        <h1>Page not found</h1>
        <p>The page you’re looking for does not exist.</p>
      </div>
    </section>
  );
};

export default NotFoundPage;
