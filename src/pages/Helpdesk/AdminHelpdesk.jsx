import React, { useState, useEffect, useMemo } from "react";
import { getAllTickets, updateTicketStatus } from "@/api/helpdesk";
import useAuthStore from "@/stores/auth-store";
import { toast } from "sonner";
import { MessageSquare, CheckCircle, LayoutDashboard, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

const AdminHelpdesk = () => {
    const token = useAuthStore((state) => state.token);
    const [tickets, setTickets] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, PENDING, RESOLVED
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await getAllTickets(token);
            setTickets(res.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        }
    };

    const handleResolve = async (id) => {
        try {
            await updateTicketStatus(token, id, { status: "RESOLVED" });
            toast.success("Ticket resolved!");
            fetchTickets();
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const filteredTickets = useMemo(() => {
        let result = tickets;

        if (statusFilter !== "ALL") {
            result = result.filter(ticket => ticket.status === statusFilter);
        }

        if (searchQuery) {
            result = result.filter(ticket => 
                ticket.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.message.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [tickets, searchQuery, statusFilter]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
                            <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Helpdesk</h1>
                            <p className="text-slate-500 font-medium text-sm">Review and resolve user tickets.</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white px-5 py-2 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                            <span className="text-sm font-bold text-slate-600">
                                {tickets.filter(t => t.status !== 'RESOLVED').length} Total Pending
                            </span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <Search className="w-5 h-5 text-slate-400 ml-3" />
                        <input 
                            type="text"
                            placeholder="Search by topic or message..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent px-2 py-2 border-none outline-none text-slate-700 placeholder-slate-400"
                        />
                    </div>
                    
                    {/* Status Dropdown Filter */}
                    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 shrink-0">
                        <Filter className="w-5 h-5 text-slate-400 ml-3" />
                        <select 
                            value={statusFilter} 
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent border-none outline-none text-slate-700 font-medium py-2 pr-4 cursor-pointer"
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>
                </div>

                {/* Table Container */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                    <th className="p-5 pl-8">Topic</th>
                                    <th className="p-5 w-1/3">Message</th>
                                    <th className="p-5 text-center">Date</th>
                                    <th className="p-5 text-center">Status</th>
                                    <th className="p-5 pr-8 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedTickets.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="p-16 text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                <LayoutDashboard size={30} />
                                            </div>
                                            <p className="text-slate-500 font-medium text-lg">No tickets found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedTickets.map((ticket) => (
                                        <tr key={ticket.id} className="border-b last:border-0 border-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5 pl-8 font-bold text-slate-800 break-words">{ticket.topic}</td>
                                            <td className="p-5 text-sm text-slate-600">
                                                <div className="max-w-md truncate" title={ticket.message}>
                                                    {ticket.message}
                                                </div>
                                            </td>
                                            <td className="p-5 text-center text-sm font-medium text-slate-500">
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-5 text-center">
                                                <span className={`inline-flex px-3 py-1 text-[10px] uppercase tracking-wider font-extrabold rounded-full ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-500'}`}>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="p-5 pr-8 text-right">
                                                {ticket.status !== 'RESOLVED' && (
                                                    <button
                                                        onClick={() => handleResolve(ticket.id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold transition-all shadow-md shadow-green-200 active:scale-95"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Resolve
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Options */}
                    {totalPages > 0 && (
                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-sm font-medium text-slate-500 pl-3">
                                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTickets.length)} of {filteredTickets.length} tickets
                            </span>
                            <div className="flex items-center gap-2 pr-3">
                                <button 
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-slate-200 bg-white rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <button 
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-slate-200 bg-white rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHelpdesk;
