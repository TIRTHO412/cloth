'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { X, User, Mail, ArrowRight, CheckCircle2, AlertCircle, Check, KeyRound, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const { isAuthOpen, closeAuth, loginCustomerOtp, showToast } = useShop();

  const [authMethod, setAuthMethod] = useState<'email' | 'mobile'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  // Field-level errors
  const [contactError, setContactError] = useState('');
  const [nameError, setNameError] = useState('');

  // OTP Verification State
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  // OTP Timer Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  if (!isAuthOpen) return null;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MOBILE_REGEX = /^[0-9]{10,12}$/;

  const handleSendOtp = () => {
    setContactError('');
    setOtpError('');

    if (authMethod === 'email') {
      if (!email.trim()) {
        setContactError('Please enter your email address.');
        return;
      }
      if (!EMAIL_REGEX.test(email.trim())) {
        setContactError('Please enter a valid email address (e.g. client@domain.com).');
        return;
      }
    } else {
      if (!mobile.trim()) {
        setContactError('Please enter your 10-digit mobile number.');
        return;
      }
      if (!MOBILE_REGEX.test(mobile.trim().replace(/[^0-9]/g, ''))) {
        setContactError('Please enter a valid mobile number.');
        return;
      }
    }

    // Generate random 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setOtpTimer(60);
    setInputOtp('');

    const target = authMethod === 'email' ? email : mobile;
    showToast(`Verification Code Sent to ${target}! Demo OTP: ${code}`, 'info');
  };

  const handleVerifyOtp = () => {
    setOtpError('');
    if (!inputOtp.trim()) {
      setOtpError('Please enter the 6-digit OTP code.');
      return;
    }

    if (inputOtp.trim() === generatedOtp) {
      setIsOtpVerified(true);
      setOtpError('');
      showToast('Contact Verified Successfully ✓', 'info');
    } else {
      setOtpError('Invalid 6-digit OTP code. Please check and try again.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOtpVerified) {
      setOtpError('Please send and verify the 6-digit OTP code before proceeding.');
      return;
    }

    const contactVal = authMethod === 'email' ? email : `${mobile}@mobile.client`;
    loginCustomerOtp(contactVal, name || undefined);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md bg-white text-luxury-black overflow-hidden shadow-2xl border border-neutral-200"
        >
          {/* CLOSE BUTTON */}
          <button
            onClick={closeAuth}
            className="absolute top-5 right-5 z-20 p-2 text-luxury-black hover:opacity-60 transition-opacity bg-neutral-100 rounded-full"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8 md:p-10 space-y-7 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="text-center space-y-2">
              <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-luxury-gray block">
                CUSTOMER PORTAL
              </span>
              <h3 className="text-3xl font-editorial font-light uppercase tracking-wider text-luxury-black">
                Client Sign In
              </h3>
              <p className="text-xs font-sans text-luxury-gray font-light">
                Instant OTP-based access to your saved wishlist, orders & personal atelier bag.
              </p>
            </div>

            {/* AUTH METHOD TOGGLE (EMAIL / MOBILE) */}
            <div className="flex border border-neutral-200 p-1 bg-neutral-50 text-xs font-sans">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('email');
                  setContactError('');
                  setIsOtpSent(false);
                  setIsOtpVerified(false);
                }}
                className={`flex-1 py-2 font-medium tracking-wider uppercase transition-all ${
                  authMethod === 'email' ? 'bg-white text-luxury-black shadow-sm' : 'text-neutral-500 hover:text-luxury-black'
                }`}
              >
                Email OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('mobile');
                  setContactError('');
                  setIsOtpSent(false);
                  setIsOtpVerified(false);
                }}
                className={`flex-1 py-2 font-medium tracking-wider uppercase transition-all ${
                  authMethod === 'mobile' ? 'bg-white text-luxury-black shadow-sm' : 'text-neutral-500 hover:text-luxury-black'
                }`}
              >
                Mobile OTP
              </button>
            </div>

            {/* AUTH FORM */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* FULL NAME (OPTIONAL) */}
              <div className="space-y-1">
                <label className="text-[10px] tracking-widest font-sans uppercase text-luxury-gray font-medium block">
                  Full Name (Optional)
                </label>
                <div className="relative flex items-center border border-neutral-300 focus-within:border-luxury-black transition-all">
                  <User className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="JULIAN STERLING"
                    className="w-full bg-transparent p-3 text-xs tracking-wider uppercase font-sans text-luxury-black placeholder:text-neutral-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* CONTACT INPUT (EMAIL OR MOBILE) + SEND OTP */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] tracking-widest font-sans uppercase text-luxury-gray">
                  <span className="font-medium">{authMethod === 'email' ? 'Email Address' : 'Mobile Number'}</span>
                  {isOtpVerified && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Verified ✓
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className={`relative flex-1 flex items-center border transition-all ${
                    isOtpVerified
                      ? 'bg-emerald-50/40 border-emerald-500'
                      : contactError
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-neutral-300 focus-within:border-luxury-black'
                  }`}>
                    {authMethod === 'email' ? (
                      <Mail className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
                    ) : (
                      <Smartphone className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
                    )}
                    <input
                      type={authMethod === 'email' ? 'email' : 'tel'}
                      disabled={isOtpVerified}
                      value={authMethod === 'email' ? email : mobile}
                      onChange={(e) => {
                        if (authMethod === 'email') setEmail(e.target.value);
                        else setMobile(e.target.value);
                        if (contactError) setContactError('');
                      }}
                      placeholder={authMethod === 'email' ? 'CLIENT@DOMAIN.COM' : '+1 (555) 019-2834'}
                      className={`w-full bg-transparent p-3 text-xs tracking-wider font-sans text-luxury-black placeholder:text-neutral-300 focus:outline-none ${
                        isOtpVerified ? 'cursor-not-allowed opacity-75' : ''
                      }`}
                    />
                  </div>

                  {!isOtpVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0}
                      className="px-3.5 py-3 bg-luxury-black text-white text-[10px] uppercase tracking-widest font-sans font-medium whitespace-nowrap hover:bg-neutral-800 transition-all disabled:opacity-50"
                    >
                      {otpTimer > 0 ? `Resend (${otpTimer}s)` : isOtpSent ? 'Resend Code' : 'Send OTP'}
                    </button>
                  )}
                </div>

                {contactError && (
                  <p className="text-[10px] text-rose-500 font-sans tracking-wide flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{contactError}</span>
                  </p>
                )}
              </div>

              {/* 6-DIGIT OTP INPUT FIELD */}
              {isOtpSent && !isOtpVerified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3.5 bg-neutral-50 border border-neutral-200 space-y-3"
                >
                  <div className="flex items-center justify-between text-[10px] font-sans tracking-widest uppercase">
                    <span className="font-semibold text-luxury-black flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-luxury-black" />
                      Enter 6-Digit OTP Code
                    </span>
                    {generatedOtp && (
                      <span className="text-neutral-400 font-mono text-[9px]">
                        Demo OTP: <strong className="text-luxury-black">{generatedOtp}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={inputOtp}
                      onChange={(e) => {
                        setInputOtp(e.target.value);
                        if (otpError) setOtpError('');
                      }}
                      placeholder="849201"
                      className="flex-1 bg-white border border-neutral-300 p-2.5 text-center text-sm font-mono tracking-[0.3em] uppercase text-luxury-black focus:outline-none focus:border-luxury-black"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-4 py-2 bg-emerald-600 text-white text-[10px] uppercase tracking-widest font-sans font-semibold hover:bg-emerald-700 transition-all flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify Code</span>
                    </button>
                  </div>

                  {otpError && (
                    <p className="text-[10px] text-rose-500 font-sans tracking-wide flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{otpError}</span>
                    </p>
                  )}
                </motion.div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={!isOtpVerified}
                className="w-full py-4 bg-luxury-black text-white text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 mt-6 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>Complete Customer Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center text-[10px] font-sans uppercase tracking-widest text-neutral-400">
              Customer Privileges Only • Standard Shopping & Cart Access
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
