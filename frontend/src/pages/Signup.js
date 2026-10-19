import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { safeRedirectPath } from '../lib/authRedirect';
import GoogleSignInButton from '../components/GoogleSignInButton';
import AuthLayout, { AuthAlert, AuthField } from '../components/AuthLayout';
import { Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react';

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

  const redirectPath = safeRedirectPath(location.state?.from);

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

      const signupData = await signup(email, password, {
        fullName,
        phone: `+91${phone}`,
        city: city || 'Not specified',
        age: age ? parseInt(age, 10) : null,
        travelStyle: travelStyle || null,
      });

      // With email confirmation on, Supabase returns the same response for new and
      // existing emails (no session). Show one generic message so the form can't be
      // used to check which emails have accounts.
      if (signupData?.session) {
        navigate(redirectPath, { replace: true });
      } else {
        setSignupSuccess(true);
      }
    } catch (err) {
      const errMsg = err.message || 'Failed to sign up.';
      if (errMsg.includes('already registered') || errMsg.includes('already exists')) {
        navigate('/login', {
          state: { email, message: 'Account already exists. Please log in.' },
        });
      } else {
        setError(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordToggle = (shown, setShown) => (
    <button
      type="button"
      onClick={() => setShown(!shown)}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[#94A3B8] hover:bg-white/5 hover:text-white"
      aria-label={shown ? 'Hide password' : 'Show password'}
    >
      {shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );

  if (signupSuccess) {
    return (
      <AuthLayout
        title="Check your inbox"
        subtitle="If this email isn’t registered yet, we’ve sent a link to verify it. Already have an account? Sign in instead."
      >
        <Link to="/login" className="tv-btn-primary h-12 w-full text-sm">
          Go to sign in
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Book departures, track payments and keep your trek details in one place."
      footer={
        <p>
          Already have an account?{' '}
          <Link
            to="/login"
            state={{ from: redirectPath }}
            className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-[#38BDF8]"
          >
            Sign in
          </Link>
        </p>
      }
    >
      <AuthAlert>{error}</AuthAlert>

      <GoogleSignInButton redirectPath={redirectPath} label="Sign up with Google" onError={setError} />

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <AuthField
          id="signup-name"
          label="Full name"
          type="text"
          autoComplete="name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={loading}
          placeholder="As on your ID"
          data-testid="signup-name-input"
        />
        <AuthField
          id="signup-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="you@example.com"
          data-testid="signup-email-input"
        />
        <AuthField
          id="signup-phone"
          label="Phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={phone}
          onChange={handlePhoneChange}
          required
          disabled={loading}
          placeholder="10-digit mobile number"
          leading="+91"
          hint="Your trek leader uses this to reach you before departure."
          data-testid="signup-phone-input"
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <AuthField
            id="signup-city"
            label="City (optional)"
            type="text"
            autoComplete="address-level2"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
            placeholder="Where you’re travelling from"
            data-testid="signup-city-input"
          />
          <AuthField
            id="signup-age"
            label="Age (optional)"
            type="number"
            min="1"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            disabled={loading}
            placeholder="Years"
            data-testid="signup-age-input"
          />
        </div>

        <div>
          <label htmlFor="signup-style" className="mb-2 block text-sm font-medium text-white">
            How do you like to travel? (optional)
          </label>
          <div className="relative">
            <select
              id="signup-style"
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              disabled={loading}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-[#071827] pl-4 pr-10 text-[15px] text-white hover:border-white/20 disabled:opacity-50"
              data-testid="signup-travelstyle-select"
            >
              <option value="">Choose one</option>
              <option value="Beginner">First Himalayan trek</option>
              <option value="Adventure">Adventure</option>
              <option value="Family">With family</option>
              <option value="Solo">Solo</option>
              <option value="Premium">Premium comfort</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
          </div>
        </div>

        <AuthField
          id="signup-password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          placeholder="Create a password"
          hint="8+ characters with upper and lower case, a number and a symbol."
          trailing={passwordToggle(showPassword, setShowPassword)}
          data-testid="signup-password-input"
        />
        <AuthField
          id="signup-confirm"
          label="Confirm password"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={loading}
          placeholder="Type it again"
          trailing={passwordToggle(showConfirmPassword, setShowConfirmPassword)}
          data-testid="signup-confirmpassword-input"
        />

        <button
          type="submit"
          disabled={loading}
          className="tv-btn-primary !mt-8 h-12 w-full text-sm"
          data-testid="signup-submit-button"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default Signup;
