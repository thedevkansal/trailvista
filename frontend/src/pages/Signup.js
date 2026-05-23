import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { UserPlus, ShieldAlert, Eye, EyeOff, CheckCircle2, User, Mail, Phone, MapPin, Calendar, ChevronDown, Lock, Loader2 } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [travelStyle, setTravelStyle] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const redirectPath = location.state?.from || '/';

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 10) {
      setPhone(val);
    }
  };

  const validatePassword = (pass) => {
    if (pass.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter.';
    }
    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least one lowercase letter.';
    }
    if (!/[0-9]/.test(pass)) {
      return 'Password must contain at least one number.';
    }
    if (!/[^A-Za-z0-9]/.test(pass)) {
      return 'Password must contain at least one special character (e.g. !@#$%^&*).';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (phone.length !== 10) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }

    const passError = validatePassword(password);
    if (passError) {
      setError(passError);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (age && (isNaN(age) || parseInt(age, 10) <= 0)) {
      setError('Please enter a valid age.');
      return;
    }

    try {
      setError(null);
      setLoading(true);

      // Pre-flight check: Try logging in first to see if user already exists with this password
      let preFlightExists = false;
      try {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (!signInError && signInData?.user) {
          preFlightExists = true;
        }
      } catch (signInErr) {
        // Ignore and proceed to signUp if login fails
      }

      if (preFlightExists) {
        setError('Account already exists. Please log in.');
        setTimeout(() => {
          navigate('/login', {
            state: {
              email,
              message: 'Account already exists. Please log in.'
            }
          });
        }, 3000);
        return;
      }

      const signupData = await signup(email, password, {
        fullName,
        phone: `+91${phone}`,
        city: city || 'Not specified',
        age: age ? parseInt(age, 10) : null,
        travelStyle: travelStyle || null,
      });

      // If identities is empty, it means the user already exists in the database.
      const isExistingUser = signupData?.user && (!signupData.user.identities || signupData.user.identities.length === 0);

      if (isExistingUser) {
        setError('Account already exists. Please log in.');
        setTimeout(() => {
          navigate('/login', {
            state: {
              email,
              message: 'Account already exists. Please log in.'
            }
          });
        }, 3000);
      } else {
        // If email confirmation is enabled, session will be null on signup
        if (!signupData?.session) {
          setSignupSuccess(true);
        } else {
          navigate(redirectPath, { replace: true });
        }
      }
    } catch (err) {
      const errMsg = err.message || 'Failed to sign up.';
      if (errMsg.includes('already registered') || errMsg.includes('already exists')) {
        setError('Account already exists. Please log in.');
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              email, 
              message: 'Account already exists. Please log in.' 
            } 
          });
        }, 3000);
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-[#020617] px-4 relative overflow-hidden">
      {/* Background soft glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none z-0" />
      
      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#071827]/70 border border-white/5 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md relative overflow-hidden"
        >
          {signupSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 space-y-4"
            >
              <div className="mx-auto w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Account Created</h2>
              <p className="text-[#94A3B8] text-sm leading-relaxed font-light">
                Your account has been created. Please check your email to verify your account before logging in.
              </p>
              <Link
                to="/login"
                className="mt-6 w-full bg-[#38BDF8] hover:bg-[#0ea5e9] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center cursor-pointer shadow-lg shadow-[#38BDF8]/10"
              >
                Go to Login
              </Link>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white hero-text uppercase mb-2 tracking-wide">
                  TRAIL<span className="text-[#38BDF8]">VISTA</span>
                </h1>
                <p className="text-[#94A3B8] text-sm font-light leading-relaxed">
                  Create an account to start booking your expeditions.
                </p>
              </div>

              {/* Error Banner */}
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-start space-x-2 shadow-lg"
                  >
                    <ShieldAlert className="h-5 w-5 flex-shrink-0 mt-0.5 animate-pulse" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 scrollbar-thin">
                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
                      placeholder="John Doe"
                      data-testid="signup-name-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#94A3B8]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
                      placeholder="john@example.com"
                      data-testid="signup-email-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">Phone Number *</label>
                  <div className={`flex rounded-xl overflow-hidden border border-white/10 focus-within:border-[#38BDF8] focus-within:ring-1 focus-within:ring-[#38BDF8]/50 bg-[#020617] transition-all duration-300 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <span className="bg-white/5 px-3.5 py-3 text-[#94A3B8] text-sm flex items-center border-r border-white/10 select-none font-semibold">
                      +91
                    </span>
                    <div className="relative flex-grow">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#94A3B8] opacity-50" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={handlePhoneChange}
                        required
                        disabled={loading}
                        className="w-full bg-transparent pl-11 pr-4 py-3 text-white text-sm focus:outline-none disabled:opacity-50"
                        placeholder="XXXXXXXXXX"
                        data-testid="signup-phone-input"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">City / Location (Optional)</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#94A3B8]" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      disabled={loading}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
                      placeholder="Dehradun"
                      data-testid="signup-city-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">Age (Optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#94A3B8]" />
                      <input
                        type="number"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        disabled={loading}
                        className="w-full bg-[#020617] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
                        placeholder="28"
                        data-testid="signup-age-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">Travel Style</label>
                    <div className="relative">
                      <select
                        value={travelStyle}
                        onChange={(e) => setTravelStyle(e.target.value)}
                        disabled={loading}
                        className="w-full bg-[#020617] border border-white/10 hover:border-white/20 focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 text-white rounded-xl pl-4 pr-10 py-3 text-sm transition-all duration-300 appearance-none cursor-pointer disabled:opacity-50"
                        data-testid="signup-travelstyle-select"
                      >
                        <option value="">Select style</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Adventure">Adventure</option>
                        <option value="Family">Family</option>
                        <option value="Solo">Solo</option>
                        <option value="Premium">Premium</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8] pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#94A3B8]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl pl-11 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
                      placeholder="Min 8 chars, mixed cases, symbol"
                      data-testid="signup-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[#94A3B8] text-xs mb-2 block font-semibold uppercase tracking-wider">Confirm Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-[#94A3B8]" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full bg-[#020617] border border-white/10 rounded-xl pl-11 pr-10 py-3 text-white text-sm focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8]/50 hover:border-white/20 transition-all duration-300 disabled:opacity-50"
                      placeholder="Confirm password"
                      data-testid="signup-confirmpassword-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:active:scale-100 mt-6 shadow-lg shadow-[#F97316]/10 hover:shadow-[#F97316]/20 cursor-pointer"
                  data-testid="signup-submit-button"
                >
                  {loading ? (
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <UserPlus className="h-4.5 w-4.5" />
                  )}
                  <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                </button>

                <div className="text-center mt-6">
                  <p className="text-[#94A3B8] text-sm">
                    Already have an account?{' '}
                    <Link
                      to="/login"
                      state={{ from: redirectPath }}
                      className="text-[#F97316] hover:underline font-semibold focus:outline-none cursor-pointer"
                    >
                      Log in
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
