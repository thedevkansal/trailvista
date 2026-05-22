import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [destinationDropdown, setDestinationDropdown] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.profile?.full_name) {
      return user.profile.full_name;
    }
    if (user.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Explorer';
  };

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
                src="https://static.prod-images.emergentagent.com/jobs/221755c1-0324-4690-aa42-bfdb3646c22b/images/07979eb0085519e24d5c27211b05e6a615ac4003d035ff3cc438e9f0a527dce3.png"
                alt="TrailVista Expeditions"
                className="h-8 w-8 sm:h-10 sm:w-10"
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
                  <span className="text-sm font-medium tv-navbar-text px-2 max-w-[150px] truncate" title={getUserDisplayName()}>
                    Hi, {getUserDisplayName()}
                  </span>
                  <button
                    onClick={async () => {
                      await logout();
                      navigate('/');
                    }}
                    className="px-4 py-2 rounded-full border border-white/20 hover:border-red-500 hover:text-red-500 text-sm font-semibold tv-navbar-text transition-all active:scale-95"
                    data-testid="nav-logout-button"
                  >
                    Logout
                  </button>
                  <Link to="/treks">
                    <button
                      className="bg-[#F97316] hover:bg-[#ea580c] text-white px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
                      data-testid="nav-book-trek-button"
                    >
                      Book a Trek
                    </button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button
                      className="px-4 py-2 rounded-full border border-white/20 hover:border-[#38BDF8] text-sm font-semibold tv-navbar-text transition-all active:scale-95"
                      data-testid="nav-login-button"
                    >
                      Login
                    </button>
                  </Link>
                  <Link to="/signup" state={{ from: '/treks' }}>
                    <button
                      className="bg-[#F97316] hover:bg-[#ea580c] text-white px-5 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 whitespace-nowrap"
                      data-testid="nav-book-trek-button"
                    >
                      Book a Trek
                    </button>
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
                      <div className="tv-navbar-text font-semibold px-2 py-1 border-t border-white/10 text-sm">
                        Hi, {getUserDisplayName()}
                      </div>
                      <button 
                        onClick={async () => {
                          setIsOpen(false);
                          await logout();
                          navigate('/');
                        }}
                        className="w-full border border-white/20 hover:border-red-500 hover:text-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold transition-all"
                        data-testid="mobile-logout-button"
                      >
                        Logout
                      </button>
                      <Link to="/treks" onClick={() => setIsOpen(false)}>
                        <button className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-2 rounded-full text-sm font-semibold transition-all" data-testid="mobile-book-trek-button">
                          Book a Trek
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <button className="w-full border border-white/20 hover:border-[#38BDF8] text-white px-6 py-2 rounded-full text-sm font-semibold transition-all" data-testid="mobile-login-button">
                          Login
                        </button>
                      </Link>
                      <Link to="/signup" state={{ from: '/treks' }} onClick={() => setIsOpen(false)}>
                        <button className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-2 rounded-full text-sm font-semibold transition-all" data-testid="mobile-book-trek-button">
                          Book a Trek
                        </button>
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
