"use client";

import { Bell, Search, User } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Header Search Submitted:', searchQuery);
        if (searchQuery.trim()) {
            const url = `/leads?search=${encodeURIComponent(searchQuery.trim())}`;
            console.log('Navigating to:', url);
            router.push(url);
        }
    };

    return (
        <header className="h-20 border-b border-[#2E2E2E] bg-[#121212] px-10 flex items-center justify-between sticky top-0 z-10">
            <div className="flex-1 max-w-lg relative group">
                <form onSubmit={handleSearch} className="relative">
                    <button
                        type="submit"
                        className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-[#4ADE80] hover:text-[#4ADE80] transition-colors z-10"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                    <input
                        type="text"
                        placeholder="Search leads, analytics, data..."
                        className="w-full pl-12 pr-4 py-3 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </form>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative p-3 text-slate-500">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 bg-[#4ADE80] rounded-full border-2 border-[#121212]"></span>
                </div>
                <div className="h-10 w-px bg-[#2E2E2E] mx-2"></div>
                <div className="h-10 w-10 rounded-xl bg-[#1E1E1E] flex items-center justify-center border border-[#2E2E2E]">
                    <User className="h-5 w-5 text-slate-500" />
                </div>
            </div>
        </header>
    );
}
