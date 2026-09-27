import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, User, PlusSquare, Info } from 'lucide-react';
import { CURRENT_DOCTOR, DEMO_PATIENTS } from '../../data/patientsData';

interface Props {
  onLoginSuccess: (role: 'patient' | 'doctor') => void;
  initialRole?: 'patient' | 'doctor';
}

export const LoginScreen = ({ onLoginSuccess, initialRole = 'patient' }: Props) => {
  const [role, setRole] = useState<'patient' | 'doctor'>(initialRole);
  const [emailOrPhone, setEmailOrPhone] = useState(
    initialRole === 'patient' ? 'aarav.sharma@astraayu.health' : CURRENT_DOCTOR.email
  );
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const demoPatient = DEMO_PATIENTS[0];

  const handleRoleSelect = (newRole: 'patient' | 'doctor') => {
    setRole(newRole);
    setErrorMessage('');
    if (newRole === 'patient') {
      setEmailOrPhone('aarav.sharma@astraayu.health');
    } else {
      setEmailOrPhone(CURRENT_DOCTOR.email);
    }
  };

  const handleAutoFill = () => {
    if (role === 'patient') {
      setEmailOrPhone('aarav.sharma@astraayu.health');
      setPassword('patient123');
    } else {
      setEmailOrPhone(CURRENT_DOCTOR.email);
      setPassword('doctor123');
    }
    setErrorMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(role);
    }, 350);
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F8FA] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#119C91]/20 selection:text-[#119C91]">
      {/* Centered Mobile-First Login Card matching screenshot */}
      <div className="w-full max-w-[420px] bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/90 transition-all">
        {/* TOP BRAND AREA */}
        <div className="flex flex-col items-center text-center">
          {/* Astra Ayu Medical Logo with ECG Pulse and Decorative Dots */}
          <div className="w-16 h-16 rounded-[22px] bg-[#E8FBF8] border border-[#C6F5EE] flex items-center justify-center relative shadow-xs mb-3.5">
            {/* Decorative Teal Dots */}
            <span
              className="absolute top-2.5 left-3 w-1.5 h-1.5 rounded-full bg-[#119C91]"
              aria-hidden="true"
            />
            <span
              className="absolute top-2.5 right-3 w-1.5 h-1.5 rounded-full bg-[#119C91]"
              aria-hidden="true"
            />
            <span
              className="absolute bottom-2.5 right-3.5 w-1.5 h-1.5 rounded-full bg-[#119C91]"
              aria-hidden="true"
            />

            {/* ECG Heartbeat Symbol */}
            <svg
              viewBox="0 0 32 32"
              className="w-8 h-8 text-[#119C91]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 16h6l2.5-7 5 14 3-9 2.5 3h5" />
            </svg>
          </div>

          {/* Brand Name */}
          <h1 className="text-2xl sm:text-[27px] font-black tracking-tight leading-none">
            <span className="text-[#111827]">ASTRA </span>
            <span className="text-[#119C91]">AYU</span>
          </h1>

          {/* Tagline */}
          <p className="text-[13px] sm:text-sm font-semibold text-slate-700 mt-1.5">
            Your Health. Organized. Connected.
          </p>

          {/* Pill Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8FBF8] border border-[#B1F1E6] text-[11px] sm:text-xs font-semibold text-[#119C91]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#119C91]" aria-hidden="true" />
            <span>Personal Health Intelligence Platform</span>
          </div>
        </div>

        {/* WELCOME SECTION */}
        <div className="mt-7 text-left">
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-[13px] text-slate-500 mt-1 leading-relaxed">
            Sign in to securely access your health information.
          </p>
        </div>

        {/* ROLE SELECTOR */}
        <div className="mt-5 text-left">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
            CONTINUE AS
          </label>

          {/* Segmented Control */}
          <div className="bg-[#F1F5F9]/80 border border-slate-200/90 rounded-2xl p-1.5 flex items-center gap-1.5 h-[56px]">
            {/* Patient Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('patient')}
              className={`flex-1 h-full rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'patient'
                  ? 'bg-[#119C91] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Patient</span>
            </button>

            {/* Doctor Option */}
            <button
              type="button"
              onClick={() => handleRoleSelect('doctor')}
              className={`flex-1 h-full rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                role === 'doctor'
                  ? 'bg-[#119C91] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 font-semibold'
              }`}
            >
              <PlusSquare className="w-4 h-4" />
              <span>Doctor</span>
            </button>
          </div>

          {/* Dynamic Helper Text */}
          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              {role === 'patient'
                ? 'Access your personal health timeline & AI search'
                : 'Access clinical emergency history, voice search & EHR records'}
            </span>
          </p>
        </div>

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="mt-4 text-left">
          {errorMessage && (
            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Email or Mobile Number */}
          <div>
            <label
              htmlFor="emailOrPhone"
              className="text-xs font-bold text-slate-900 block mb-1.5"
            >
              Email or Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="emailOrPhone"
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                placeholder="Enter your email or mobile number"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#119C91] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-3.5">
            <label
              htmlFor="password"
              className="text-xs font-bold text-slate-900 block mb-1.5"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200/90 bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#119C91] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Password Actions Row */}
          <div className="flex items-center justify-between mt-3 text-xs">
            {/* Auto-fill Demo Button */}
            <button
              type="button"
              onClick={handleAutoFill}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium rounded-md border border-slate-200/80 transition-colors cursor-pointer"
            >
              Auto-fill Demo
            </button>

            {/* Forgot Password Link */}
            <button
              type="button"
              onClick={() => alert('Password reset link sent to registered email / mobile.')}
              className="text-[#119C91] hover:text-[#0D857B] font-semibold transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 w-full py-3.5 sm:py-4 bg-[#119C91] hover:bg-[#0E8A80] active:scale-[0.99] text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-75"
          >
            <LogIn className="w-4 h-4" />
            <span>{isLoading ? 'Signing in...' : 'Login'}</span>
          </button>
        </form>

        {/* BOTTOM SIGN UP LINK */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <span>New to Astra Ayu? </span>
          <button
            type="button"
            onClick={() => alert('Account registration open for Patient & Healthcare Providers.')}
            className="text-[#119C91] font-bold hover:underline cursor-pointer"
          >
            Create an account
          </button>
        </div>

        {/* Quick Helper Badge */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            {role === 'patient'
              ? `Patient: Aarav Sharma (AST-10021 · B+)`
              : `Demo Doctor: ${CURRENT_DOCTOR.name} (${CURRENT_DOCTOR.medicalId})`}
          </p>
        </div>
      </div>
    </div>
  );
};
