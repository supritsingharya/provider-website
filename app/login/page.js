"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, ArrowRight, Lock, Loader2, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
            </div>
        }>
            <LoginForm />
        </React.Suspense>
    );
}

function LoginForm() {
    const [step, setStep] = useState('PHONE'); // PHONE | OTP
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(30);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithPhone, verifyOtpAndLogin, loading, error, user } = useAuth();

    const from = searchParams.get('from') || '/';

    useEffect(() => {
        if (user) {
            router.replace(from);
        }
    }, [user, router, from]);

    useEffect(() => {
        let interval;
        if (step === 'OTP' && timer > 0) {
            interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (phoneNumber.length < 10) return;
        try {
            await loginWithPhone(phoneNumber);
            setStep('OTP');
            setTimer(30);
        } catch (err) {
            // Error handled by context/hook state, shown in UI
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length < 6) return;
        try {
            const result = await verifyOtpAndLogin(phoneNumber, otp);
            // Determine flow based on result. Usually backend returns user if exists.
            // If result.msg === 'USER_NOT_FOUND' (seen in userSlice logic), redirect to register
            if (result.msg === 'USER_NOT_FOUND') {
                router.push(`/register?phone=${encodeURIComponent(phoneNumber)}`);
            } else {
                router.push(from);
            }
        } catch (err) {
            // Error handled
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        try {
            await loginWithPhone(phoneNumber);
            setTimer(30);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative overflow-hidden">
            {/* Background blobs for premium feel */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden z-10"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                        <p className="text-gray-500">
                            {step === 'PHONE'
                                ? 'Enter your mobile number to get started'
                                : `We sent an OTP to +91 ${phoneNumber}`}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 'PHONE' ? (
                            <motion.form
                                key="phone-form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                onSubmit={handleSendOtp}
                                className="space-y-6"
                            >
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mobile Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 font-medium">+91</span>
                                        </div>
                                        <input
                                            id="phone"
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 10) setPhoneNumber(val);
                                            }}
                                            className="block w-full pl-12 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none"
                                            placeholder="98765 43210"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                            <Smartphone size={20} />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || phoneNumber.length < 10}
                                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-semibold shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        <>
                                            Get OTP <ArrowRight className="ml-2 h-5 w-5" />
                                        </>
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="otp-form"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onSubmit={handleVerifyOtp}
                                className="space-y-6"
                            >
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                                        Verification Code
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="otp"
                                            type="number"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none"
                                            placeholder="• • • • • •"
                                            maxLength={6}
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                            <Lock size={20} />
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep('PHONE')}
                                            className="text-sm text-gray-500 hover:text-gray-700"
                                        >
                                            Change Number
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleResendOtp}
                                            disabled={timer > 0}
                                            className={`text-sm font-medium ${timer > 0 ? 'text-gray-400' : 'text-purple-600 hover:text-purple-700'}`}
                                        >
                                            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || otp.length < 4}
                                    className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-semibold shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-5 w-5" />
                                    ) : (
                                        'Verify & Login'
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600 text-sm">
                            Don't have an account?{' '}
                            <Link href="/register" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
