import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon, Compass, Receipt, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { displayName, initialsOf } from '../lib/user';

const ACCOUNT_LINKS = [
  { tab: 'bookings', label: 'My bookings', icon: Compass },
  { tab: 'payments', label: 'Payments', icon: Receipt },
  { tab: 'profile', label: 'Profile', icon: User },
];

const Avatar = ({ name, size = 'h-9 w-9 text-xs' }) => (
  <span
    className={`${size} inline-flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#F2A65A] to-[#38BDF8] font-display font-semibold text-[#020617]`}
    aria-hidden="true"
  >
    {initialsOf(name) || '?'}
  </span>
);

const ProfileMenu = ({ name, email, onLogout }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-full p-0.5 pr-2 hover:bg-white/5"
        data-testid="nav-profile-button"
      >
        <Avatar name={name} />
        <ChevronDown className={`h-4 w-4 tv-navbar-text transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="tv-surface absolute right-0 top-full mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-white/10 bg-[#071827]/95 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 p-4">
              <Avatar name={name} size="h-10 w-10 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{name}</p>
                <p className="truncate text-xs text-[#94A3B8]">{email}</p>
              </div>
            </div>
            <div className="p-1.5">
              {ACCOUNT_LINKS.map(({ tab, label, icon: Icon }) => (
                <Link
                  key={tab}
                  role="menuitem"
                  to={`/account?tab=${tab}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white hover:bg-white/5"
                >
                  <Icon className="h-4 w-4 text-[#94A3B8]" />
                  {label}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/10 p-1.5">
              <button
                type="button"
                role="menuitem"
                onClick={onLogout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white hover:bg-white/5"
                data-testid="nav-logout-button"
              >
                <LogOut className="h-4 w-4 text-[#94A3B8]" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [destinationDropdown, setDestinationDropdown] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isPasswordRecovery } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isPasswordRecovery) {
      const search = location.search;
      const hash = location.hash;
      const isCurrentlyOnRecoveryCallback = location.pathname === '/auth/callback' && 
        (search.includes('type=recovery') || hash.includes('type=recovery'));
        
      if (!isCurrentlyOnRecoveryCallback) {
        navigate('/auth/callback?type=recovery', { replace: true });
      }
    }
  }, [isPasswordRecovery, location, navigate]);

  const getUserDisplayName = () => displayName(user);

  const isActive = (path) => location.pathname === path;

  const categories = [
    { name: 'Beginner Treks', path: '/categories/beginner' },
    { name: 'Winter Treks', path: '/categories/winter' },
    { name: 'Summer Treks', path: '/categories/summer' },
    { name: 'Weekend Treks', path: '/categories/weekend' },
    { name: 'High Altitude', path: '/categories/high-altitude' },
  ];

  const destinations = [
    { name: 'Uttarakhand', path: '/destinations/uttarakhand' },
    { name: 'Himachal Pradesh', path: '/destinations/himachal' },
    { name: 'Kashmir', path: '/destinations/kashmir' },
    { name: 'Ladakh', path: '/destinations/ladakh' },
  ];

  const linkClass = (path) =>
    `text-sm font-medium transition-colors tv-navbar-text ${
      isActive(path) ? 'text-[#38BDF8]' : 'hover:text-[#38BDF8]'
    }`;

  return (
    <nav className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="tv-navbar backdrop-blur-xl bg-[#020617]/80 border border-white/10 rounded-full px-4 py-2 sm:px-6 sm:py-3 shadow-2xl">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3" data-testid="nav-logo-link">
              <img
                src="/logo.png"
                alt="TrailVista Expeditions"
                className="h-8 w-auto sm:h-10 object-contain"
              />
              <span className="text-lg sm:text-xl font-bold hero-text tv-navbar-text">
                TRAILVI<span className="text-[#38BDF8]">STA</span>
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-5 xl:space-x-7">
              <Link to="/treks" className={linkClass('/treks')} data-testid="nav-all-treks-link">All Treks</Link>
              <Link to="/expeditions" className={linkClass('/expeditions')} data-testid="nav-expeditions-link">Expeditions</Link>

              {/* Destinations Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDestinationDropdown(true)}
                onMouseLeave={() => setDestinationDropdown(false)}
              >
                <button
                  className="text-sm font-medium tv-navbar-text hover:text-[#38BDF8] transition-colors flex items-center"
                  data-testid="nav-destinations-dropdown"
                >
                  Destinations
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <AnimatePresence>
                  {destinationDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="tv-surface absolute top-full mt-2 w-56 backdrop-blur-xl bg-[#071827]/95 border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                    >
                      {destinations.map((dest) => (
                        <Link
                          key={dest.path}
                          to={dest.path}
                          className="block px-4 py-3 text-sm tv-navbar-text hover:bg-[#38BDF8]/10 hover:text-[#38BDF8] transition-colors"
                          data-testid={`nav-destination-${dest.name.toLowerCase().replace(' ', '-')}`}
                        >
                          {dest.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Categories Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCategoryDropdown(true)}
                onMouseLeave={() => setCategoryDropdown(false)}
              >
                <button
                  className="text-sm font-medium tv-navbar-text hover:text-[#38BDF8] transition-colors flex items-center"
                  data-testid="nav-categories-dropdown"
                >
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <AnimatePresence>
                  {categoryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="tv-surface absolute top-full mt-2 w-56 backdrop-blur-xl bg-[#071827]/95 border border-white/10 rounded-2xl shadow-xl overflow-hidden"
                    >
                      {categories.map((cat) => (
                        <Link
                          key={cat.path}
                          to={cat.path}
                          className="block px-4 py-3 text-sm tv-navbar-text hover:bg-[#38BDF8]/10 hover:text-[#38BDF8] transition-colors"
                          data-testid={`nav-category-${cat.name.toLowerCase().replace(' ', '-')}`}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/about" className={linkClass('/about')} data-testid="nav-about-link">About</Link>
              <Link to="/faq" className={linkClass('/faq')} data-testid="nav-faq-link">FAQ</Link>
              <Link to="/contact" className={linkClass('/contact')} data-testid="nav-contact-link">Contact</Link>
            </div>

            {/* Right side: Theme toggle + Login/Logout + CTA */}
            <div className="hidden lg:flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-white/10 hover:border-[#38BDF8] tv-navbar-text transition-all active:scale-95"
                aria-label="Toggle theme"
                data-testid="theme-toggle-button"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              {user ? (
                <>
                  <Link
                    to="/treks"
                    className="tv-btn-primary h-10 px-5 text-sm whitespace-nowrap"
                    data-testid="nav-book-trek-button"
                  >
                    Book a trek
                  </Link>
                  <ProfileMenu
                    name={getUserDisplayName()}
                    email={user.email}
                    onLogout={async () => {
                      await logout();
                      navigate('/');
                    }}
                  />
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="h-10 inline-flex items-center px-4 rounded-full text-sm font-semibold tv-navbar-text hover:text-[#38BDF8]"
                    data-testid="nav-login-button"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    state={{ from: '/treks' }}
                    className="tv-btn-primary h-10 px-5 text-sm whitespace-nowrap"
                    data-testid="nav-book-trek-button"
                  >
                    Book a trek
                  </Link>
                </>
              )}
            </div>

            {/* Mobile: Theme toggle + Menu */}
            <div className="lg:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full border border-white/10 tv-navbar-text"
                aria-label="Toggle theme"
                data-testid="mobile-theme-toggle-button"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="tv-navbar-text"
                data-testid="nav-mobile-menu-button"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden mt-3 pt-3 border-t border-white/10 tv-divider overflow-hidden"
              >
                <div className="flex flex-col space-y-3 pb-3 max-h-[60vh] overflow-y-auto">
                  <Link to="/treks" className="tv-navbar-text hover:text-[#38BDF8] transition-colors" data-testid="mobile-all-treks-link" onClick={() => setIsOpen(false)}>All Treks</Link>
                  <Link to="/expeditions" className="tv-navbar-text hover:text-[#38BDF8] transition-colors" data-testid="mobile-expeditions-link" onClick={() => setIsOpen(false)}>Expeditions</Link>
                  <Link to="/destinations" className="tv-navbar-text hover:text-[#38BDF8] transition-colors" data-testid="mobile-destinations-link" onClick={() => setIsOpen(false)}>Destinations</Link>
                  <Link to="/categories" className="tv-navbar-text hover:text-[#38BDF8] transition-colors" data-testid="mobile-categories-link" onClick={() => setIsOpen(false)}>Categories</Link>
                  <Link to="/about" className="tv-navbar-text hover:text-[#38BDF8] transition-colors" data-testid="mobile-about-link" onClick={() => setIsOpen(false)}>About</Link>
                  <Link to="/faq" className="tv-navbar-text hover:text-[#38BDF8] transition-colors" data-testid="mobile-faq-link" onClick={() => setIsOpen(false)}>FAQ</Link>
                  <Link to="/contact" className="tv-navbar-text hover:text-[#38BDF8] transition-colors" data-testid="mobile-contact-link" onClick={() => setIsOpen(false)}>Contact</Link>
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                        <Avatar name={getUserDisplayName()} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold tv-navbar-text">{getUserDisplayName()}</p>
                          <p className="truncate text-xs text-[#94A3B8]">{user.email}</p>
                        </div>
                      </div>
                      {ACCOUNT_LINKS.map(({ tab, label, icon: Icon }) => (
                        <Link
                          key={tab}
                          to={`/account?tab=${tab}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 tv-navbar-text hover:text-[#38BDF8]"
                        >
                          <Icon className="h-4 w-4 text-[#94A3B8]" />
                          {label}
                        </Link>
                      ))}
                      <Link
                        to="/treks"
                        onClick={() => setIsOpen(false)}
                        className="tv-btn-primary h-11 w-full text-sm"
                        data-testid="mobile-book-trek-button"
                      >
                        Book a trek
                      </Link>
                      <button
                        onClick={async () => {
                          setIsOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="tv-btn-ghost h-11 w-full text-sm"
                        data-testid="mobile-logout-button"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/signup"
                        state={{ from: '/treks' }}
                        onClick={() => setIsOpen(false)}
                        className="tv-btn-primary h-11 w-full text-sm"
                        data-testid="mobile-book-trek-button"
                      >
                        Book a trek
                      </Link>
                      <Link
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="tv-btn-ghost h-11 w-full text-sm"
                        data-testid="mobile-login-button"
                      >
                        Sign in
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
