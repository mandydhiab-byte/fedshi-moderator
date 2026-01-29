import React, { useState } from 'react';
import { ALLOWED_DOMAIN } from '../constants.ts';

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
    
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setError('');
    setStep('otp');
    console.log(`[DEMO ONLY] OTP: ${mockOtp}`);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      onLogin({
        name: email.split('@')[0],
        email: email
      });
    } else {
      setError('Invalid verification code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-6">
      <div className="max-w-md w-full bg-white rounded-[2rem] p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg shadow-purple-200">
            <i className="fa-solid fa-robot text-3xl"></i>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Fedshi Moderator AI</h1>
          <p className="text-slate-500 mt-3 font-medium">Operations Login</p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-purple-100 transition-all font-medium"
              placeholder="name@fedshi.com"
            />
            {error && <p className="text-rose-500 text-sm font-semibold">{error}</p>}
            <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-100">Send Code</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input
              type="text"
              maxLength={6}
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-purple-100 text-center text-3xl font-black text-purple-700"
              placeholder="000000"
            />
            {error && <p className="text-rose-500 text-sm text-center font-semibold">{error}</p>}
            <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold">Verify & Login</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;