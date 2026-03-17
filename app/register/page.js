"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, ArrowRight, User, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin h-8 w-8 text-purple-600" />
            </div>
        }>
            <RegisterForm />
        </React.Suspense>
    );
}

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialPhone = searchParams.get('phone') || '';

    const [phoneNumber, setPhoneNumber] = useState(initialPhone);
    const [name, setName] = useState('');

    const { registerUser, loading, error, user } = useAuth();

    useEffect(() => {
        if (initialPhone) {
            setPhoneNumber(initialPhone);
        }
    }, [initialPhone]);

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(name, phoneNumber);
            // After registration, user SHOULD be logged in if backend returns JWT.
            // If not, we might need to redirect to login.
            // Assuming registerUser sets state on success.
        } catch (err) {
            // Error handled
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden z-10"
            >
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500">Join our community of students</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-purple-500 focus:border-purple-500 transition-shadow outline-none"
                                    placeholder="John Doe"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <User size={20} />
                                </div>
                            </div>
                        </div>

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
                            disabled={loading || phoneNumber.length < 10 || name.length < 2}
                            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-semibold shadow-lg shadow-purple-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                <>
                                    Register <ArrowRight className="ml-2 h-5 w-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-700 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
