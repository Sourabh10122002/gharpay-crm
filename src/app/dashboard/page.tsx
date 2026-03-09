"use client";

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
    Users,
    Target,
    CalendarCheck,
    TrendingUp,
    ArrowUpRight,
    MoreVertical,
    ChevronRight,
    Settings2,
    Filter
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DataStateDisplay from '@/components/common/DataStateDisplay';

export default function Dashboard() {
    const [statsData, setStatsData] = useState<any>(null);
    const [monthlyLeads, setMonthlyLeads] = useState<number[]>(new Array(12).fill(0));
    const [recentVisits, setRecentVisits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const [leadsRes, propsRes, visitsRes] = await Promise.all([
                fetch(`${apiUrl}/api/leads`),
                fetch(`${apiUrl}/api/properties`),
                fetch(`${apiUrl}/api/visits`)
            ]);
            const leads = await leadsRes.json();
            const props = await propsRes.json();
            const visits = await visitsRes.json();

            console.log('Dashboard Data Fetched:', { leadsCount: leads.length, visitsCount: visits.length });

            // Compute stats
            setStatsData({
                totalLeads: leads.length,
                bookedLeads: leads.filter((l: any) => l.status === 'Booked').length,
                availableProps: props.filter((p: any) => p.available).length,
                conversionRate: leads.length > 0 ? ((leads.filter((l: any) => l.status === 'Booked').length / leads.length) * 100).toFixed(1) : 0
            });

            // Compute monthly leads for bar graph
            const now = new Date();
            const currentYear = now.getFullYear();
            const counts = new Array(12).fill(0);

            leads.forEach((lead: any) => {
                const leadDate = new Date(lead.createdAt);
                if (leadDate.getFullYear() === currentYear) {
                    const month = leadDate.getMonth();
                    counts[month]++;
                }
            });

            setMonthlyLeads(counts);
            setRecentVisits(visits.slice(0, 3));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout>
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time Lead & Property Analytics</p>
                </div>
            </div>

            <DataStateDisplay
                isLoading={loading}
                isEmpty={!loading && statsData?.totalLeads === 0 && recentVisits.length === 0}
                emptyMessage="No data available yet"
                onRefresh={fetchDashboardData}
            >
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
                        {/* Total Leads Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] relative overflow-hidden group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Total Leads</h3>
                                <div className="p-2 bg-[#252525] rounded-full text-slate-600">
                                    <MoreVertical className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex items-center justify-center py-6 relative">
                                <div className="h-40 w-40 rounded-full bg-[#4ADE80] flex items-center justify-center shadow-[0_0_60px_rgba(74,222,128,0.3)]">
                                    <span className="text-3xl font-black text-[#121212]">{statsData?.totalLeads}</span>
                                </div>
                            </div>
                            <div className="mt-8">
                                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Global Outreach</p>
                                <p className="text-slate-300 text-sm mt-1">Acquired from multiple sources</p>
                            </div>
                        </motion.div>

                        {/* Conversion Rate Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Conversion Rate</h3>
                                <div className="p-2 bg-[#252525] rounded-full text-slate-600">
                                    <Settings2 className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="relative h-48 w-48 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-full border-[12px] border-[#252525]"></div>
                                    <div className="absolute inset-0 rounded-full border-[12px] border-transparent border-t-[#4ADE80] border-r-[#4ADE80] rotate-45" style={{ transform: `rotate(${statsData?.conversionRate * 3.6}deg)` }}></div>
                                    <span className="text-4xl font-black text-white">{`${statsData?.conversionRate}%`}</span>
                                </div>
                                <p className="text-slate-500 text-xs font-bold mt-4 italic uppercase tracking-widest text-center">Successful Bookings</p>
                            </div>
                        </motion.div>

                        {/* Available Properties Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white">Available PGs</h3>
                                <div className="p-2 bg-[#252525] rounded-full text-slate-600">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="h-40 flex items-center justify-center mb-8">
                                <span className="text-6xl font-black text-[#4ADE80] drop-shadow-[0_0_20px_rgba(74,222,128,0.3)]">{statsData?.availableProps}</span>
                            </div>
                            <div className="space-y-4">
                                <p className="text-slate-500 text-center font-bold text-xs uppercase tracking-widest">Active Inventory</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E]">
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Monthly Lead Acquisition</h3>
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-[#4ADE80]"></div>
                                        <span className="text-xs font-bold text-slate-500">{new Date().getFullYear()} Stats</span>
                                    </div>
                                </div>
                            </div>

                            <div className="h-72 relative mt-10">
                                {/* Grid Lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                    {[0, 1, 2, 3].map((_, i) => (
                                        <div key={i} className="w-full border-t border-[#2E2E2E]/50 border-dashed relative">
                                            <span className="absolute -left-2 -top-2 text-[8px] font-black text-slate-600 uppercase tracking-tighter">
                                                {Math.round((100 - (i * 33.3)))}%
                                            </span>
                                        </div>
                                    ))}
                                    <div className="w-full border-t border-[#2E2E2E]"></div>
                                </div>

                                {/* Bars Container */}
                                <div className="absolute inset-0 flex items-end gap-3 px-4 pt-4">
                                    {monthlyLeads.map((count, j) => {
                                        const maxVal = Math.max(...monthlyLeads, 1);
                                        let height = (count / maxVal) * 100;
                                        if (count > 0 && height < 5) height = 5;

                                        return (
                                            <div key={j} className="flex-1 flex flex-col items-center gap-4 group h-full justify-end relative z-10">
                                                <div className="w-full bg-[#1E1E1E]/40 group-hover:bg-[#252525]/60 transition-all duration-300 rounded-t-2xl relative h-full flex items-end overflow-visible">
                                                    <motion.div
                                                        initial={{ height: 0 }}
                                                        animate={{ height: `${height}%` }}
                                                        whileHover={{ scaleX: 1.05, filter: "brightness(1.2)" }}
                                                        transition={{
                                                            height: { duration: 1, ease: "circOut", delay: j * 0.05 },
                                                            scaleX: { duration: 0.2 }
                                                        }}
                                                        className="w-full bg-gradient-to-t from-[#166534] via-[#22C55E] to-[#4ADE80] rounded-t-xl shadow-[0_0_25px_rgba(74,222,128,0.1)] border-t border-x border-white/10"
                                                    ></motion.div>

                                                    {/* Tooltip/Count Bubble */}
                                                    {count > 0 && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10 }}
                                                            whileHover={{ opacity: 1, y: -5 }}
                                                            className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#1E1E1E]/80 backdrop-blur-md border border-[#4ADE80]/30 rounded-xl shadow-2xl pointer-events-none z-20 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <span className="text-[11px] font-black text-[#4ADE80] whitespace-nowrap leading-none">
                                                                {count} Leads
                                                            </span>
                                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1E1E1E]/80 border-b border-r border-[#4ADE80]/30 rotate-45"></div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter group-hover:text-white transition-colors">
                                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][j]}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#181818] rounded-[32px] p-8 border border-[#2E2E2E] flex flex-col">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-white tracking-tight">Upcoming Visits</h3>
                                <ArrowUpRight className="h-5 w-5 text-[#4ADE80]" />
                            </div>

                            <div className="space-y-4 flex-1 overflow-y-auto max-h-[300px] scrollbar-hide">
                                {recentVisits.length > 0 ? (
                                    recentVisits.map((visit) => (
                                        <div key={visit._id} className="p-4 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#4ADE80]/30 transition-all">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-white text-sm">{visit.lead?.name}</h4>
                                                <span className="text-[10px] font-black text-[#4ADE80] uppercase">{visit.visitTime}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium truncate">{visit.property?.name}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                        <CalendarCheck className="h-10 w-10 text-slate-800 mb-3" />
                                        <p className="text-slate-600 text-sm font-bold">No upcoming visits</p>
                                    </div>
                                )}
                            </div>

                            <Link href="/visits" className="block">
                                <button className="mt-8 w-full py-4 bg-[#252525] hover:bg-[#2E2E2E] text-slate-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-[#2E2E2E]">
                                    View All Schedule
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </DataStateDisplay>
        </DashboardLayout>
    );
}
