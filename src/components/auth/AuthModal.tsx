'use client';

import React, { useState, useEffect } from 'react';
import { useShop } from '@/context/ShopContext';
import { X, User, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Check, KeyRound, Clock, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal() {
  const { isAuthOpen, closeAuth, loginUser, registerUser, showToast } = useShop();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Field-level error messages
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  // OTP Verification State
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [inputOtp, setInputOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpError, setOtpError] = useState('');

  // OTP Timer Countdown Effect (HOOK AT TOP LEVEL)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Early Return AFTER ALL React Hooks
  if (!isAuthOpen) return null;

  // Validation Rules
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const HAS_UPPERCASE = /[A-Z]/;
  const HAS_SPECIAL_CHAR = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

  // Password criteria check for Register mode
  const isMinLength = password.length >= 8;
  const isUppercaseValid = HAS_UPPERCASE.test(password);
  const isSpecialCharValid = HAS_SPECIAL_CHAR.test(password);

  const handleSendOtp = () => {
    setEmailError('');
    setOtpError('');

    if (!email.trim()) {
      setEmailError('Please enter an email address first.');
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    // Generate random 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setIsOtpSent(true);
    setOtpTimer(60);
    setInputOtp('');

    // Simulate sending OTP via email with Toast notification
    showToast(`Verification Code Sent! Demo OTP: ${code}`, 'info');
  };

  const handleVerifyOtp = () => {
    setOtpError('');
    if (!inputOtp.trim()) {
      setOtpError('Please enter the 6-digit code.');
      return;
    }

    if (inputOtp.trim() === generatedOtp) {
      setIsEmailVerified(true);
      setOtpError('');
      showToast('Email Verified Successfully ✓', 'info');
    } else {
      setOtpError('Invalid 6-digit OTP code. Please check and try again.');
    }
  };

  const validateFields = (): boolean => {
    let isValid = true;

    // Reset error states
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');

    // Name Validation (Register Mode)
    if (mode === 'register') {
      if (!name.trim()) {
        setNameError('Full Name is required.');
        isValid = false;
      } else if (name.trim().length < 2) {
        setNameError('Name must be at least 2 characters long.');
        isValid = false;
      }

      // Block registration if email is not verified via OTP
      if (!isEmailVerified) {
        setEmailError('You must verify your email with the 6-digit OTP code before registering.');
        isValid = false;
      }
    }

    // Email Validation
    if (!email.trim()) {
      setEmailError('Email address is required.');
      isValid = false;
    } else if (!EMAIL_REGEX.test(email.trim())) {
      setEmailError('Please enter a valid email address (e.g. client@domain.com).');
      isValid = false;
    }

    // Password Validation
    if (!password) {
      setPasswordError('Password is required.');
      isValid = false;
    } else if (mode === 'register') {
      if (!isMinLength) {
        setPasswordError('Password must be at least 8 characters long.');
        isValid = false;
      } else if (!isUppercaseValid) {
        setPasswordError('Password must contain at least one UPPERCASE letter (A-Z).');
        isValid = false;
      } else if (!isSpecialCharValid) {
        setPasswordError('Password must contain at least one Special Character (e.g. @, $, !, %).');
        isValid = false;
      }
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    if (mode === 'login') {
      const success = loginUser(email, password);
      if (!success) {
        setGeneralError('Invalid email or password combination.');
      }
    } else {
      const success = registerUser(name, email, password);
      if (!success) {
        setGeneralError('Registration failed. Please check your details.');
      }
    }
  };

  const handleModeSwitch = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setGeneralError('');
    setIsOtpSent(false);
    setIsEmailVerified(false);
    setGeneratedOtp(null);
    setInputOtp('');
    setOtpError('');
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
            aria-label="Close authentication modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="p-8 md:p-10 space-y-7 max-h-[90vh] overflow-y-auto">
            {/* HEADER */}
            <div className="text-center space-y-2">
              <span className="text-[10px] tracking-[0.3em] font-sans uppercase text-luxury-gray block">
                CLIENT PORTAL
              </span>
              <h3 className="text-3xl font-editorial font-light uppercase tracking-wider text-luxury-black">
                {mode === 'login' ? 'Client Sign In' : 'Create Account'}
              </h3>
              <p className="text-xs font-sans text-luxury-gray font-light">
                {mode === 'login'
                  ? 'Access your saved wishlist, orders & personal atelier preferences.'
                  : 'Join the ATELIER membership with email OTP verification & early lookbook access.'}
              </p>
            </div>

            {/* GENERAL ERROR ALERT */}
            {generalError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-sans text-center flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{generalError}</span>
              </div>
            )}

            {/* AUTH FORM */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* FULL NAME FIELD (REGISTER MODE ONLY) */}
              {mode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] tracking-widest font-sans uppercase text-luxury-gray font-medium block">
                    Full Name
                  </label>
                  <div className={`relative flex items-center border transition-all ${
                    nameError ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-300 focus-within:border-luxury-black'
                  }`}>
                    <User className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError('');
                      }}
                      placeholder="JULIAN STERLING"
                      className="w-full bg-transparent p-3 text-xs tracking-wider uppercase font-sans text-luxury-black placeholder:text-neutral-300 focus:outline-none"
                    />
                  </div>
                  {nameError && (
                    <p className="text-[10px] text-rose-500 font-sans tracking-wide flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{nameError}</span>
                    </p>
                  )}
                </div>
              )}

              {/* EMAIL FIELD + SEND OTP BUTTON */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] tracking-widest font-sans uppercase text-luxury-gray">
                  <span className="font-medium">Email Address</span>
                  {isEmailVerified && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Email Verified Successfully ✓
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <div className={`relative flex-1 flex items-center border transition-all ${
                    isEmailVerified
                      ? 'bg-emerald-50/40 border-emerald-500'
                      : emailError
                      ? 'border-rose-500 bg-rose-50/20'
                      : 'border-neutral-300 focus-within:border-luxury-black'
                  }`}>
                    <Mail className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
                    <input
                      type="email"
                      disabled={isEmailVerified}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                      }}
                      placeholder="CLIENT@DOMAIN.COM"
                      className={`w-full bg-transparent p-3 text-xs tracking-wider font-sans text-luxury-black placeholder:text-neutral-300 focus:outline-none ${
                        isEmailVerified ? 'cursor-not-allowed opacity-75' : ''
                      }`}
                    />
                  </div>

                  {/* SEND OTP BUTTON (REGISTER MODE ONLY) */}
                  {mode === 'register' && !isEmailVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={otpTimer > 0}
                      className="px-3.5 py-3 bg-luxury-black text-white text-[10px] uppercase tracking-widest font-sans font-medium whitespace-nowrap hover:bg-neutral-800 transition-all disabled:opacity-50"
                    >
                      {otpTimer > 0 ? `Resend (${otpTimer}s)` : isOtpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  )}
                </div>

                {emailError && (
                  <p className="text-[10px] text-rose-500 font-sans tracking-wide flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* 6-DIGIT OTP INPUT FIELD (REGISTER MODE ONLY) */}
              {mode === 'register' && isOtpSent && !isEmailVerified && (
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

              {/* PASSWORD FIELD */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] tracking-widest font-sans uppercase text-luxury-gray">
                  <span className="font-medium">Password</span>
                  {mode === 'login' && (
                    <button type="button" className="hover:text-luxury-black underline underline-offset-2">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className={`relative flex items-center border transition-all ${
                  passwordError ? 'border-rose-500 bg-rose-50/20' : 'border-neutral-300 focus-within:border-luxury-black'
                }`}>
                  <Lock className="w-4 h-4 text-neutral-400 ml-3 shrink-0" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent p-3 text-xs tracking-wider font-sans text-luxury-black placeholder:text-neutral-300 focus:outline-none"
                  />
                </div>
                {passwordError && (
                  <p className="text-[10px] text-rose-500 font-sans tracking-wide flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              {/* SIGNUP PASSWORD VALIDATION CHECKLIST */}
              {mode === 'register' && (
                <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-none space-y-2 text-[10px] font-sans">
                  <span className="text-neutral-500 uppercase tracking-widest font-semibold block mb-1">
                    Password Security Criteria:
                  </span>
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      isMinLength ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400'
                    }`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={isMinLength ? 'text-emerald-700 font-medium' : 'text-neutral-500'}>
                      At least 8 characters long
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      isUppercaseValid ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400'
                    }`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={isUppercaseValid ? 'text-emerald-700 font-medium' : 'text-neutral-500'}>
                      At least 1 UPPERCASE letter (A-Z)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      isSpecialCharValid ? 'bg-emerald-500 text-white' : 'bg-neutral-200 text-neutral-400'
                    }`}>
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span className={isSpecialCharValid ? 'text-emerald-700 font-medium' : 'text-neutral-500'}>
                      At least 1 Special character (@, $, !, %, *, ?)
                    </span>
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full py-4 bg-luxury-black text-white text-xs uppercase tracking-[0.25em] font-sans font-medium hover:bg-neutral-800 transition-all flex items-center justify-center gap-3 mt-6 shadow-md"
              >
                <span>{mode === 'login' ? 'Sign In To Account' : 'Register Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* TOGGLE MODE FOOTER */}
            <div className="pt-4 border-t border-neutral-100 text-center text-xs font-sans text-luxury-gray">
              {mode === 'login' ? (
                <span>
                  Don't have an ATELIER account?{' '}
                  <button
                    onClick={() => handleModeSwitch('register')}
                    className="text-luxury-black font-semibold underline underline-offset-2 hover:opacity-70 ml-1"
                  >
                    Create Account
                  </button>
                </span>
              ) : (
                <span>
                  Already a registered client?{' '}
                  <button
                    onClick={() => handleModeSwitch('login')}
                    className="text-luxury-black font-semibold underline underline-offset-2 hover:opacity-70 ml-1"
                  >
                    Log In
                  </button>
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
