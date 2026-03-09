import { useState, useEffect } from 'react';
import { Lead, Visit } from '@/lib/types';
import Link from 'next/link';
import { formatDate, cn } from '@/lib/utils';
import { Phone, Mail, MessageSquare, Calendar, Building2, User, Clock, Check, ChevronDown, MapPin, CheckCircle2 } from 'lucide-react';

interface LeadProfileProps {
    lead: Lead;
}

interface Agent {
    _id: string;
    name: string;
    email: string;
}

export default function LeadProfile({ lead: initialLead }: LeadProfileProps) {
    const [lead, setLead] = useState<Lead>(initialLead);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [visits, setVisits] = useState<Visit[]>([]);
    const [isAssigning, setIsAssigning] = useState(false);
    const [showAgentDropdown, setShowAgentDropdown] = useState(false);
    const [loadingVisits, setLoadingVisits] = useState(false);

    const fetchLeadVisits = async () => {
        setLoadingVisits(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/visits?leadId=${lead._id || lead.id}`);
            const data = await response.json();
            setVisits(data);
        } catch (error) {
            console.error('Error fetching lead visits:', error);
        } finally {
            setLoadingVisits(false);
        }
    };

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                const response = await fetch(`${apiUrl}/api/users/agents`);
                const data = await response.json();
                setAgents(data);
            } catch (error) {
                console.error('Error fetching agents:', error);
            }
        };
        fetchAgents();
        fetchLeadVisits();
    }, [lead._id, lead.id]);

    const handleAssignAgent = async (agentId: string) => {
        setIsAssigning(true);
        setShowAgentDropdown(false);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/leads/${lead._id || lead.id}/assign`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentId })
            });

            if (response.ok) {
                const updatedLead = await response.json();
                setLead(updatedLead);
            }
        } catch (error) {
            console.error('Error assigning agent:', error);
        } finally {
            setIsAssigning(false);
        }
    };

    const handleUpdateVisitOutcome = async (visitId: string, outcome: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const response = await fetch(`${apiUrl}/api/visits/${visitId}/outcome`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ outcome })
            });

            if (response.ok) {
                fetchLeadVisits();
            }
        } catch (error) {
            console.error('Error updating visit outcome:', error);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Lead Info */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8 shadow-2xl">
                    <div className="flex items-start justify-between mb-10">
                        <div className="flex items-center gap-6">
                            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-[#4ADE80] to-[#22C55E] flex items-center justify-center text-[#121212] text-3xl font-black shadow-[0_10px_40px_rgba(74,222,128,0.2)]">
                                {lead.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-white tracking-tight">{lead.name}</h1>
                                <div className="flex items-center gap-3 mt-2">
                                    <span className="bg-[#252525] text-[#4ADE80] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-[#4ADE80]/20">
                                        {lead.status}
                                    </span>
                                    <span className="text-slate-600 text-sm">•</span>
                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Added on {formatDate(lead.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-5 py-2.5 bg-[#252525] hover:bg-[#2E2E2E] text-slate-300 rounded-xl font-bold text-sm border border-[#2E2E2E] transition-all">
                                Edit Profile
                            </button>
                            <button className="px-5 py-2.5 bg-[#4ADE80] hover:bg-[#38C172] text-[#121212] rounded-xl font-black text-sm transition-all shadow-lg shadow-[#4ADE80]/20">
                                Mark as Booked
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 pt-10 border-t border-[#2E2E2E]">
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Phone Number</p>
                            <div className="flex items-center gap-3 text-white font-bold">
                                <div className="p-2 bg-[#252525] rounded-xl">
                                    <Phone className="h-4 w-4 text-[#4ADE80]" />
                                </div>
                                {lead.phoneNumber}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Assigned Agent</p>
                            <div className="relative">
                                <button
                                    onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                                    className="flex items-center gap-3 text-white font-bold hover:text-[#4ADE80] transition-colors"
                                >
                                    <div className="p-2 bg-[#252525] rounded-xl">
                                        <User className="h-4 w-4 text-[#4ADE80]" />
                                    </div>
                                    {lead.assignedAgent?.name || 'Unassigned'}
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                </button>

                                {showAgentDropdown && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl shadow-2xl z-50 overflow-hidden">
                                        <div className="max-h-48 overflow-y-auto p-2 space-y-1">
                                            {agents.map((agent) => (
                                                <button
                                                    key={agent._id}
                                                    onClick={() => handleAssignAgent(agent._id)}
                                                    className={cn(
                                                        "w-full text-left px-4 py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-between",
                                                        lead.assignedAgent?._id === agent._id ? "bg-[#4ADE80] text-[#121212]" : "text-slate-400 hover:bg-[#252525] hover:text-white"
                                                    )}
                                                >
                                                    {agent.name}
                                                    {lead.assignedAgent?._id === agent._id && <Check className="h-3 w-3" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Lead Source</p>
                            <div className="flex items-center gap-3 text-primary-green font-bold capitalize">
                                <div className="p-2 bg-[#252525] rounded-xl">
                                    <MessageSquare className="h-4 w-4 text-[#4ADE80]" />
                                </div>
                                {lead.source}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8">
                    <h3 className="text-xl font-black text-white mb-8 tracking-tight">Visit History</h3>
                    <div className="space-y-6">
                        {loadingVisits ? (
                            <p className="text-slate-500 text-sm animate-pulse">Loading visits...</p>
                        ) : visits.length > 0 ? (
                            visits.map((visit) => (
                                <div key={visit._id} className="p-6 rounded-2xl bg-[#1E1E1E] border border-[#2E2E2E] group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-[#252525] flex items-center justify-center text-[#4ADE80]">
                                                <Calendar className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest">{formatDate(visit.visitDate)} • {visit.visitTime}</p>
                                                <h4 className="font-bold text-white group-hover:text-[#4ADE80] transition-colors">{visit.property?.name}</h4>
                                            </div>
                                        </div>
                                        <select
                                            value={visit.outcome}
                                            onChange={(e) => handleUpdateVisitOutcome(visit._id, e.target.value)}
                                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest text-[#4ADE80] cursor-pointer focus:ring-0"
                                        >
                                            <option value="Pending" className="bg-[#181818]">Pending</option>
                                            <option value="Interested" className="bg-[#181818]">Interested</option>
                                            <option value="Not Interested" className="bg-[#181818]">Not Interested</option>
                                            <option value="Booked" className="bg-[#181818]">Booked</option>
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold ml-14">
                                        <MapPin className="h-3.5 w-3.5" />
                                        {visit.property?.location}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-slate-600 text-sm font-bold">No visits recorded</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8">
                    <h3 className="text-xl font-black text-white mb-8 tracking-tight">Activity History</h3>
                    <div className="space-y-8">
                        {[1].map((i) => (
                            <div key={i} className="flex gap-6 relative">
                                <div className="h-10 w-10 rounded-2xl bg-[#252525] border border-[#2E2E2E] flex items-center justify-center relative z-10 shrink-0">
                                    <Clock className="h-5 w-5 text-[#4ADE80]" />
                                </div>
                                <div className="pt-1">
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        <span className="font-bold text-white">System</span> updated status to <span className={cn("font-black text-[#4ADE80]")}>{lead.status}</span>
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2 px-2 py-1 bg-[#252525] inline-block rounded-lg">Recently</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-8">
                <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8">
                    <h3 className="text-xl font-black text-white mb-6 tracking-tight">Quick Actions</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <Link href="/visits" className="block">
                            <button className="w-full flex items-center gap-4 p-4 rounded-[24px] bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#4ADE80]/50 hover:bg-[#252525] transition-all group text-left shadow-lg">
                                <div className="h-12 w-12 rounded-2xl bg-[#252525] group-hover:bg-[#4ADE80] flex items-center justify-center text-[#4ADE80] group-hover:text-[#121212] transition-all">
                                    <Calendar className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-base font-black text-white">Schedule Visit</p>
                                    <p className="text-xs font-bold text-slate-500 mt-0.5">Pick date and property</p>
                                </div>
                            </button>
                        </Link>
                        <button className="flex items-center gap-4 p-4 rounded-[24px] bg-[#1E1E1E] border border-[#2E2E2E] hover:border-[#4ADE80]/50 hover:bg-[#252525] transition-all group text-left shadow-lg">
                            <div className="h-12 w-12 rounded-2xl bg-[#252525] group-hover:bg-[#4ADE80] flex items-center justify-center text-[#4ADE80] group-hover:text-[#121212] transition-all">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-base font-black text-white">Suggest Property</p>
                                <p className="text-xs font-bold text-slate-500 mt-0.5">Share catalog links</p>
                            </div>
                        </button>
                    </div>
                </div>

                <div className="bg-[#181818] rounded-[32px] border border-[#2E2E2E] p-8">
                    <h3 className="text-xl font-black text-white mb-6 tracking-tight">Notes</h3>
                    <textarea
                        placeholder="Add a note about this lead..."
                        className="w-full h-40 p-5 bg-[#1E1E1E] border border-[#2E2E2E] rounded-2xl text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#4ADE80] focus:border-[#4ADE80] transition-all resize-none placeholder-slate-600"
                    ></textarea>
                    <button className="w-full mt-6 bg-[#2E2E2E] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#4ADE80] hover:text-[#121212] transition-all">
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
}
