import React, { useState, useEffect } from "react";
import { createTicket, getMyTickets } from "@/api/helpdesk";
import useAuthStore from "@/stores/auth-store";
import { toast } from "sonner";
import { MessageSquare, Send, Clock, CheckCircle, LayoutDashboard } from "lucide-react";

const UserHelpdesk = () => {
    const token = useAuthStore((state) => state.token);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ topic: "", message: "" });

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await getMyTickets(token);
            setTickets(res.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.topic || !form.message) return toast.warning("Please fill all fields");
        
        try {
            setLoading(true);
            await createTicket(token, form);
            toast.success("Ticket submitted successfully!");
            setForm({ topic: "", message: "" });
            fetchTickets();
        } catch (error) {
            toast.error("Failed to submit ticket.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                        <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Helpdesk Support</h1>
                        <p className="text-slate-500 font-medium text-sm">Need help? Submit a ticket below.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm top-28 sticky">
                            <h2 className="text-xl font-bold text-slate-800 mb-6">New Ticket</h2>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Topic</label>
                                    <input 
                                        type="text" 
                                        value={form.topic}
                                        onChange={(e) => setForm({ ...form, topic: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm" 
                                        placeholder="E.g. Payment Issue"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea 
                                        rows="5"
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm resize-none" 
                                        placeholder="Describe your issue..."
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    {loading ? "Submitting..." : "Submit Ticket"}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Your Tickets</h2>
                        {tickets.length === 0 ? (
                            <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                    <LayoutDashboard size={30} />
                                </div>
                                <p className="text-slate-500 font-medium">You have no open tickets.</p>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div key={ticket.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center justify-between transition-all hover:shadow-md">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="font-bold text-slate-800 text-lg">{ticket.topic}</h3>
                                            <span className={`px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-full ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm leading-relaxed">{ticket.message}</p>
                                        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-2">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(ticket.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    {ticket.status === 'RESOLVED' && (
                                        <div className="shrink-0 p-3 bg-green-50 rounded-full text-green-500">
                                            <CheckCircle className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHelpdesk;
