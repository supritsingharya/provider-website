'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReward, fetchRewardDashboard } from '../../lib/rewardSlice';
import { StatsCard, ShareButton, ReferralCodeBox, ReferralUserRow, EmptyState } from '../components/ReferralComponents';
import { Share2, Wallet, Users, Gift, Sparkles, AlertCircle, CheckCircle as LucideCheck } from 'lucide-react';

export default function ReferAndEarn() {
    const dispatch = useDispatch();
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
            <div className="h-64 flex justify-center items-center">
                <div className="relative">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error && !rewardData) {
        return (
            <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-100">
                <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Unable to load referral data</h3>
                <button
                    onClick={() => dispatch(fetchReward())}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-xl transition-all shadow-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-40 h-40 bg-fuchsia-500 opacity-20 rounded-full blur-2xl"></div>

                <div className="relative z-10">
                    <div className="inline-flex items-center space-x-2 bg-indigo-500/30 backdrop-blur-sm px-3 py-1 rounded-full mb-4 border border-indigo-400/30">
                        <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300" />
                        <span className="text-[10px] font-bold tracking-wide uppercase text-indigo-100">Premium Rewards</span>
                    </div>

                    <h2 className="text-3xl sm:text-4xl font-black mb-4 leading-tight">
                        Invite & <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-200">Earn</span>
                    </h2>
                    <p className="text-indigo-100/90 text-sm mb-6 max-w-lg leading-relaxed font-medium">
                        Share your code. Earn cash for every friend who joins and books!
                    </p>

                    <div className="max-w-md">
                        <ReferralCodeBox code={rewardData?.code} onCopy={handleCopy} />
                    </div>

                    {copyFeedback && (
                        <div className="absolute top-8 right-8 text-emerald-300 font-bold bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg flex items-center text-sm">
                            <LucideCheck className="w-4 h-4 mr-1" /> {copyFeedback}
                        </div>
                    )}
                </div>
            </div>

            {/* Stats & Share */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center mb-1">
                            <Share2 className="w-4 h-4 mr-2 text-indigo-600" /> Share
                        </h3>
                        <p className="text-gray-500 text-xs mb-4">Invite friends via social media</p>
                    </div>
                    <ShareButton
                        icon={Gift}
                        label="Share Invite"
                        onClick={handleShare}
                        colorClass="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <StatsCard
                        title="Earnings"
                        value={rewardData?.total_earn || '₹ 0'}
                        icon={Wallet}
                        colorClass="bg-emerald-500 text-emerald-600"
                    />
                    <StatsCard
                        title="Friends"
                        value={rewardData?.total_people_joined || '0'}
                        icon={Users}
                        colorClass="bg-violet-500 text-violet-600"
                    />
                </div>
            </div>

            {/* History List */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Referral History</h3>
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100">
                        {dashboardData?.list?.length || 0} Total
                    </span>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
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
        </div>
    );
}
