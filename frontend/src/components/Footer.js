import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="tv-footer bg-[#071827] border-t border-white/10 tv-divider pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="https://static.prod-images.emergentagent.com/jobs/221755c1-0324-4690-aa42-bfdb3646c22b/images/07979eb0085519e24d5c27211b05e6a615ac4003d035ff3cc438e9f0a527dce3.png" 
                alt="TrailVista Expeditions" 
                className="h-10 w-10"
              />
              <span className="text-xl font-bold hero-text tv-text-primary text-white">TRAILVI<span className="text-[#38BDF8]">STA</span></span>
            </div>
            <p className="text-[#94A3B8] text-sm leading-relaxed mb-5">
              India's most trusted Himalayan expedition platform. We design transformative trekking and high-altitude experiences with a relentless focus on safety, transparency, and authentic mountain culture.
            </p>
            <div className="flex space-x-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8] flex items-center justify-center text-[#94A3B8] hover:text-[#38BDF8] transition-all" data-testid="footer-facebook-link">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8] flex items-center justify-center text-[#94A3B8] hover:text-[#38BDF8] transition-all" data-testid="footer-instagram-link">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8] flex items-center justify-center text-[#94A3B8] hover:text-[#38BDF8] transition-all" data-testid="footer-twitter-link">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[#38BDF8]/10 hover:border-[#38BDF8] flex items-center justify-center text-[#94A3B8] hover:text-[#38BDF8] transition-all" data-testid="footer-youtube-link">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/treks" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm" data-testid="footer-all-treks-link">All Treks</Link></li>
              <li><Link to="/expeditions" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm" data-testid="footer-expeditions-link">Expeditions</Link></li>
              <li><Link to="/departures" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm" data-testid="footer-departures-link">Upcoming Departures</Link></li>
              <li><Link to="/gallery" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm" data-testid="footer-gallery-link">Gallery</Link></li>
              <li><Link to="/reviews" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm" data-testid="footer-reviews-link">Reviews</Link></li>
              <li><Link to="/blog" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm" data-testid="footer-blog-link">Blog</Link></li>
              <li><Link to="/faq" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm" data-testid="footer-faq-link">FAQ</Link></li>
            </ul>
          </div>

          {/* Trek Categories */}
          <div>
            <h3 className="text-white font-bold mb-4">Trek Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/categories/beginner" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm">Beginner Treks</Link></li>
              <li><Link to="/categories/winter" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm">Winter Treks</Link></li>
              <li><Link to="/categories/summer" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm">Summer Treks</Link></li>
              <li><Link to="/categories/weekend" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm">Weekend Treks</Link></li>
              <li><Link to="/categories/high-altitude" className="text-[#94A3B8] hover:text-[#38BDF8] transition-colors text-sm">High Altitude Treks</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-[#94A3B8] text-sm">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span>123 Mountain Road, Dehradun, Uttarakhand 248001</span>
              </li>
              <li className="flex items-center space-x-2 text-[#94A3B8] text-sm">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center space-x-2 text-[#94A3B8] text-sm">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>hello@trailvista.com</span>
              </li>
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold text-sm mb-2">Newsletter</h4>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-[#020617] border border-white/10 rounded-l-lg text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                  data-testid="footer-newsletter-input"
                />
                <button className="bg-[#38BDF8] hover:bg-[#0ea5e9] px-4 py-2 rounded-r-lg transition-colors" data-testid="footer-newsletter-button">
                  <Mail className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[#94A3B8] text-sm">
              © 2026 TrailVista Expeditions. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/safety" className="text-[#94A3B8] hover:text-[#38BDF8] text-sm transition-colors" data-testid="footer-safety-link">Safety</Link>
              <a href="#" className="text-[#94A3B8] hover:text-[#38BDF8] text-sm transition-colors">Privacy Policy</a>
              <a href="#" className="text-[#94A3B8] hover:text-[#38BDF8] text-sm transition-colors">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;