
import React, { useState } from 'react';
import { ALLOWED_DOMAIN } from '../constants';

interface AuthProps {
  onLogin: (user: { name: string; email: string }) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [error, setError] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.toLowerCase().endsWith(ALLOWED_DOMAIN)) {
      setError(`Access restricted to ${ALLOWED_DOMAIN} emails only.`);
      return;
    }
    
    // Simulate sending OTP
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setError('');
    setStep('otp');
    console.log(`[DEMO ONLY] OTP Sent to ${email}: ${mockOtp}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      onLogin({
        name: email.split('@')[0],
        email: email
      });
    } else {
      setError('Invalid verification code. Please check your "email" (Console logs).');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
            <i className="fa-solid fa-robot text-3xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Fedshi Moderator AI</h1>
          <p className="text-gray-500 mt-2">Secure access for the Fedshi operations team.</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Corporate Email</label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                  placeholder="yourname@fedshi.com"
                />
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
            >
              Continue to OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Verification code sent to:</p>
              <p className="font-bold text-indigo-600">{email}</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Enter 6-digit Code</label>
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-center text-2xl tracking-[1em] font-bold"
                placeholder="000000"
              />
              {error && <p className="text-red-500 text-xs mt-2 text-center font-medium">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition"
            >
              Verify & Login
            </button>
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-sm text-gray-400 font-medium hover:text-gray-600"
            >
              Change email address
            </button>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-[10px] text-amber-700 leading-tight">
                <strong>Demo Notice:</strong> Since this is a client-side prototype, please check the browser console (F12) for your OTP code!
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
