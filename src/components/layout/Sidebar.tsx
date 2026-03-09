"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Trello,
    Users,
    Calendar,
    Building2,
    Settings,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Pipeline', href: '/pipeline', icon: Trello },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Visits', href: '/visits', icon: Calendar },
    { name: 'Properties', href: '/properties', icon: Building2 },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-64 flex-col bg-[#181818] border-r border-[#2E2E2E]">
            <div className="flex h-20 items-center px-8">
                <span className="text-2xl font-black italic tracking-tighter text-[#4ADE80]">
                    GHARPAYY
                </span>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-6">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 group",
                                isActive
                                    ? "bg-[#4ADE80] text-[#121212] shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                                    : "text-slate-400 hover:bg-[#2E2E2E] hover:text-white"
                            )}
                        >
                            <item.icon className={cn(
                                "h-5 w-5",
                                isActive ? "text-[#121212]" : "text-slate-500 group-hover:text-[#4ADE80]"
                            )} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-[#2E2E2E]">
                <div className="flex items-center gap-4 p-2 rounded-2xl bg-[#252525]">
                    <div className="h-10 w-10 rounded-full bg-[#4ADE128] green-gradient flex items-center justify-center text-[#121212] font-black text-sm">
                        JD
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-white truncate">John Doe</p>
                        <p className="text-[10px] font-bold text-[#4ADE80] truncate uppercase tracking-widest">Admin</p>
                    </div>
                    <Settings className="h-4 w-4 text-slate-500 cursor-pointer hover:text-white" />
                </div>
            </div>
        </div>
    );
}
