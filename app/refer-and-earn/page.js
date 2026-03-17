"use client";

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReward, fetchRewardDashboard } from '../../lib/rewardSlice';
import { StatsCard, ShareButton, ReferralCodeBox, ReferralUserRow, EmptyState } from '../components/ReferralComponents';
import { Share2, Wallet, Users, ChevronLeft, Gift, Sparkles, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import MaxWidthWrapper from '../components/MaxWidthWrapper';

export default function ReferAndEarn() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { rewardData, dashboardData, loading, error } = useSelector((state) => state.reward);

    const [copyFeedback, setCopyFeedback] = useState('');

    useEffect(() => {
        dispatch(fetchReward());
    }, [dispatch]);

    useEffect(() => {
        if (rewardData?.id) {
            dispatch(fetchRewardDashboard({ id: rewardData.id }));
        }
    }, [dispatch, rewardData]);

    const handleCopy = (text) => {
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            setCopyFeedback('Copied!');
            setTimeout(() => setCopyFeedback(''), 2000);
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: rewardData?.share_details?.title || 'Join Dream Provider',
            text: rewardData?.share_details?.message || 'Check out this amazing app!',
            url: rewardData?.share_details?.url || 'https://providerapp.in',
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopy(`${shareData.text} ${shareData.url}`);
        }
    };

    if (loading && !rewardData) {
        return (
            <div className="min-h-[80vh] flex justify-center items-center bg-white">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="mt-4 text-indigo-600 font-medium text-center animate-pulse">Loading Rewards...</div>
                </div>
            </div>
        );
    }

    if (error && !rewardData) {
        return (
            <div className="min-h-[80vh] flex justify-center items-center bg-white px-4">
                <div className="bg-red-50 p-8 rounded-3xl shadow-sm max-w-md w-full text-center border border-red-100">
                    <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to load data</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">We encountered an issue fetching your referral details. Please check your connection and try again.</p>
                    <button
                        onClick={() => dispatch(fetchReward())}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-white overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">

            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[20%] left-[-10%] w-[400px] h-[400px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <MaxWidthWrapper>
                <div className="relative z-10 py-8 lg:py-12">

                    {/* Header / Breadcrumb */}
                    <div className="flex items-center space-x-2 mb-8 group cursor-pointer" onClick={() => router.back()}>
                        <div className="p-2 bg-gray-100 rounded-full group-hover:bg-indigo-50 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-500 group-hover:text-indigo-600 transition-colors">Back</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                        {/* Left Column: Hero & Stats */}
                        <div className="lg:col-span-5 space-y-8">
                            {/* Hero Card */}
                            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-500">
                                {/* Decorative Circles */}
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-fuchsia-500 opacity-20 rounded-full blur-2xl"></div>

                                <div className="relative z-10">
                                    <div className="inline-flex items-center space-x-2 bg-indigo-500/30 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 border border-indigo-400/30 shadow-inner">
                                        <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                                        <span className="text-xs font-bold tracking-wide uppercase text-indigo-100">Premium Rewards</span>
                                    </div>

                                    <h2 className="text-4xl sm:text-5xl font-black mb-6 leading-tight tracking-tight">
                                        Invite & <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-200 drop-shadow-sm">Earn Big!</span>
                                    </h2>
                                    <p className="text-indigo-100/90 text-lg mb-8 leading-relaxed font-medium">
                                        Share your exclusive code. Earn real cash directly to your wallet for every friend who joins and books.
                                    </p>

                                    <ReferralCodeBox code={rewardData?.code} onCopy={handleCopy} />

                                    {copyFeedback && (
                                        <div className="absolute bottom-8 right-12 text-emerald-300 font-bold animate-bounce flex items-center bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg">
                                            <CheckCircle className="w-4 h-4 mr-1" /> {copyFeedback}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Share Section */}
                            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-xl">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                            <Share2 className="w-5 h-5 mr-2 text-indigo-600" />
                                            Share & Earn
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">Spread the word on your social networks</p>
                                    </div>
                                    <ShareButton
                                        icon={Gift}
                                        label="Share Now"
                                        onClick={handleShare}
                                        colorClass="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Stats & History */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <StatsCard
                                    title="Total Earnings"
                                    value={rewardData?.total_earn || '₹ 0'}
                                    subtext="Lifetime earnings"
                                    icon={Wallet}
                                    colorClass="bg-emerald-500 text-emerald-600"
                                />
                                <StatsCard
                                    title="Friends Invited"
                                    value={rewardData?.total_people_joined || '0'}
                                    subtext="Successful referrals"
                                    icon={Users}
                                    colorClass="bg-violet-500 text-violet-600"
                                />
                            </div>

                            <div className="bg-white/50 backdrop-blur-lg rounded-[2.5rem] p-8 border border-white/60 shadow-xl min-h-[400px]">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-800 tracking-tight">Referral History</h3>
                                        <p className="text-gray-500 text-sm mt-1">Track your invitation status</p>
                                    </div>
                                    <span className="bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                        {dashboardData?.list?.length || 0} Total
                                    </span>
                                </div>

                                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
                                    {dashboardData?.list?.length > 0 ? (
                                        dashboardData.list.map((item, index) => (
                                            <ReferralUserRow
                                                key={index}
                                                user={item.users_permissions_user}
                                                status={item.status}
                                            />
                                        ))
                                    ) : (
                                        <EmptyState />
                                    )}
                                </div>
                            </div>

                            <div className="text-center">
                                <a
                                    href={rewardData?.share_details?.terms_link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-medium text-gray-400 hover:text-indigo-600 transition-colors inline-block py-2 px-4 rounded-lg hover:bg-white/50"
                                >
                                    Terms & Conditions apply
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </MaxWidthWrapper>
        </div>
    );
}

// Helper for copy feedback
function CheckCircle({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
    )
}
