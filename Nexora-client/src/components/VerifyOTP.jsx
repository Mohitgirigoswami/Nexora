import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost:8000/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp_code: otp })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.msg || 'Verification failed');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  const handleResend = async () => {
    setError('');
    setMessage('');
    try {
      const response = await fetch('http://localhost:8000/auth/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('OTP resent successfully!');
      } else {
        setError(data.msg || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">No email provided for verification.</p>
          <button onClick={() => navigate('/signup')} className="text-cyan-400 hover:underline">Go to Signup</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712] p-4">
      <div className="w-full max-w-md bg-[#111827] rounded-2xl shadow-2xl border border-slate-800 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Verify Email
          </h2>
          <p className="text-slate-400 mt-2">Enter the 6-digit code sent to {email}</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-500 p-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="000000"
              maxLength="6"
              required
              className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-4 text-center text-3xl font-mono tracking-[1em] text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all placeholder:text-slate-800"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            Verify OTP
          </button>
        </form>
        
        <div className="text-center mt-6">
          <button 
            onClick={handleResend}
            className="text-slate-500 hover:text-cyan-400 text-sm font-semibold transition-colors"
          >
            Didn't receive code? Resend
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
