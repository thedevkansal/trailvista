import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

const linkClass = 'text-sm text-[#94A3B8] transition-colors hover:text-white';

const SOCIAL = [
  { href: 'https://facebook.com', icon: Facebook, label: 'Facebook', testid: 'footer-facebook-link' },
  { href: 'https://instagram.com', icon: Instagram, label: 'Instagram', testid: 'footer-instagram-link' },
  { href: 'https://twitter.com', icon: Twitter, label: 'Twitter', testid: 'footer-twitter-link' },
  { href: 'https://youtube.com', icon: Youtube, label: 'YouTube', testid: 'footer-youtube-link' },
];

const Footer = () => {
  return (
    <footer className="tv-footer bg-[#071827] border-t border-white/10 tv-divider pt-16 pb-8 md:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-5">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="TrailVista Expeditions" className="h-10 w-auto object-contain" />
              <span className="text-xl font-bold hero-text tv-text-primary text-white">TRAILVI<span className="text-[#38BDF8]">STA</span></span>
            </div>
            <p className="mt-6 max-w-sm font-display text-2xl font-medium leading-[1.2] tracking-tight text-white sm:text-3xl">
              Small groups, certified leaders, Himalayan trails since 2015.
            </p>

            <form className="mt-8 max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="footer-newsletter" className="text-sm font-medium text-white">
                New departures and trail notes, once a month
              </label>
              <div className="relative mt-3">
                <input
                  id="footer-newsletter"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-full border border-white/10 bg-[#020617] pl-5 pr-14 text-sm text-white placeholder:text-[#94A3B8]/60 hover:border-white/20 focus:border-[#38BDF8] focus:outline-none"
                  data-testid="footer-newsletter-input"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="tv-btn-primary absolute right-1.5 top-1/2 h-9 w-9 -translate-y-1/2"
                  data-testid="footer-newsletter-button"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Explore */}
          <nav aria-label="Explore" className="lg:col-span-2 lg:col-start-7">
            <h3 className="text-sm font-semibold text-white">Explore</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/treks" className={linkClass} data-testid="footer-all-treks-link">All treks</Link></li>
              <li><Link to="/expeditions" className={linkClass} data-testid="footer-expeditions-link">Expeditions</Link></li>
              <li><Link to="/gallery" className={linkClass} data-testid="footer-gallery-link">Gallery</Link></li>
              <li><Link to="/reviews" className={linkClass} data-testid="footer-reviews-link">Reviews</Link></li>
              <li><Link to="/blog" className={linkClass} data-testid="footer-blog-link">Trek guides</Link></li>
              <li><Link to="/faq" className={linkClass} data-testid="footer-faq-link">FAQ</Link></li>
            </ul>
          </nav>

          {/* Trek categories */}
          <nav aria-label="Trek categories" className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Trek by type</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/categories/beginner" className={linkClass}>Beginner treks</Link></li>
              <li><Link to="/categories/winter" className={linkClass}>Winter treks</Link></li>
              <li><Link to="/categories/summer" className={linkClass}>Summer treks</Link></li>
              <li><Link to="/categories/weekend" className={linkClass}>Weekend treks</Link></li>
              <li><Link to="/categories/high-altitude" className={linkClass}>High-altitude treks</Link></li>
            </ul>
          </nav>

          {/* Contact */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-[#94A3B8]">
              <li><a href="tel:+919876543210" className={`${linkClass} tv-num`}>+91 98765 43210</a></li>
              <li><a href="mailto:hello@trailvista.com" className={linkClass}>hello@trailvista.com</a></li>
              <li>123 Mountain Road, Dehradun, Uttarakhand 248001</li>
            </ul>
            <div className="mt-6 flex gap-2">
              {SOCIAL.map(({ href, icon: Icon, label, testid }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-[#94A3B8] transition-colors hover:border-white/30 hover:text-white"
                  data-testid={testid}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#94A3B8]">© 2026 TrailVista Expeditions</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/safety" className={linkClass} data-testid="footer-safety-link">Safety</Link>
            <Link to="/privacy-policy" className={linkClass} data-testid="footer-privacy-policy-link">Privacy policy</Link>
            <Link to="/terms-and-conditions" className={linkClass} data-testid="footer-terms-link">Terms and conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
