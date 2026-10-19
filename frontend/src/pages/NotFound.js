import React from 'react';
import { Link } from 'react-router-dom';
import { RevealHeading, FadeIn } from '../components/motion';

const NotFound = () => (
  <div className="flex min-h-screen items-center bg-[#020617] px-4 pb-24 pt-32 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-3xl">
      <p className="tv-num font-display text-lg font-medium text-[#94A3B8]">404</p>
      <RevealHeading
        as="h1"
        lines={['Off the trail.']}
        className="mt-2 font-display text-5xl font-medium leading-[1] tracking-tight text-white sm:text-7xl"
      />
      <FadeIn delay={0.2}>
        <p className="mt-6 max-w-md text-lg text-[#94A3B8]">
          We couldn’t find the page you were looking for. It may have moved, or the link may be out of date.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/treks" className="tv-btn-primary h-12 px-7 text-sm">
            Browse treks
          </Link>
          <Link to="/" className="tv-btn-ghost h-12 px-7 text-sm">
            Back to home
          </Link>
        </div>
      </FadeIn>
    </div>
  </div>
);

export default NotFound;
