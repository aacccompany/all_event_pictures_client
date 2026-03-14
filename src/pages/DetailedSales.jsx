import React, { useState, useEffect, useMemo } from "react";
import { getRecentSalesByRole } from "@/api/dashboard";
import useAuthStore from "@/stores/auth-store";
import { Loader2, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";

const DetailedSales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [eventFilter, setEventFilter] = useState("all");
    const [organizerFilter, setOrganizerFilter] = useState("all");
    const itemsPerPage = 10;

    const token = useAuthStore((state) => state.token);
    const userRole = useAuthStore((state) => state.user?.role);

    const fetchSales = async () => {
        try {
            const res = await getRecentSalesByRole(userRole, token, 50);
            setSales(res);
        } catch (error) {
            console.error("Failed to fetch detailed sales:", error);
            toast.error("Failed to load detailed sales.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && userRole) {
            fetchSales();
        }
    }, [token, userRole]);

    // Unique event names for the filter dropdown
    const eventNames = useMemo(() => {
        const names = [...new Set(sales.map((s) => s.event_name).filter(Boolean))];
        return names.sort();
    }, [sales]);

    const organizerNames = useMemo(() => {
        const names = [...new Set(sales.map((s) => s.organizer_name).filter(Boolean))];
        return names.sort();
    }, [sales]);

    // Filtered result
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return sales.filter((s) => {
            const matchSearch =
                !q ||
                s.event_name?.toLowerCase().includes(q) ||
                s.buyer_name?.toLowerCase().includes(q) ||
                s.buyer_email?.toLowerCase().includes(q);
            const matchEvent = eventFilter === "all" || s.event_name === eventFilter;
            const matchOrganizer = organizerFilter === "all" || s.organizer_name === organizerFilter;
            return matchSearch && matchEvent && matchOrganizer;
        });
    }, [sales, search, eventFilter, organizerFilter]);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [search, eventFilter, organizerFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const currentSales = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

    const clearFilters = () => { setSearch(""); setEventFilter("all"); setOrganizerFilter("all"); };
    const hasActiveFilter = search || eventFilter !== "all" || organizerFilter !== "all";

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="shadow overflow-hidden sm:rounded-lg">
                <CardHeader className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                    <CardTitle className="text-xl leading-6 font-semibold text-gray-900">
                        Detailed Sales
                    </CardTitle>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        A comprehensive list of your sales including buyer information.
                    </p>

                    {/* Filters */}
                    <div className="mt-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        {/* Search */}
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by event or buyer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 h-9 text-sm"
                            />
                        </div>

                        {/* Event dropdown filter */}
                        <select
                            value={eventFilter}
                            onChange={(e) => setEventFilter(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="all">All Events</option>
                            {eventNames.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>

                        {/* Organizer dropdown filter (Super Admin only) */}
                        {userRole === 'super-admin' && (
                            <select
                                value={organizerFilter}
                                onChange={(e) => setOrganizerFilter(e.target.value)}
                                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                <option value="all">All Organizers</option>
                                {organizerNames.map((name) => (
                                    <option key={name} value={name}>{name}</option>
                                ))}
                            </select>
                        )}

                        {/* Clear filters */}
                        {hasActiveFilter && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                            >
                                <X className="w-4 h-4" />
                                Clear
                            </button>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            No sales found{hasActiveFilter ? " for the selected filters" : ""}.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-gray-50">
                                    <TableRow>
                                        <TableHead className="w-24">Thumbnail</TableHead>
                                        <TableHead>Sale ID</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Photos Sold</TableHead>
                                        <TableHead>Photographer</TableHead>
                                        <TableHead>Organizer</TableHead>
                                        <TableHead>Buyer</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white">
                                    {currentSales.map((sale) => (
                                        <TableRow key={sale.sale_id} className="hover:bg-gray-50">
                                            <TableCell>
                                                {sale.image_url ? (
                                                    <img
                                                        src={sale.image_url}
                                                        alt={sale.event_name}
                                                        className="h-12 w-12 rounded object-cover shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                                                        No Img
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-gray-900">
                                                #{sale.sale_id}
                                            </TableCell>
                                            <TableCell className="whitespace-nowrap text-sm text-gray-500">
                                                {new Date(sale.purchased_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-900">
                                                {sale.event_name}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500 font-medium">
                                                {sale.photo_count} รูป
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-900">
                                                {sale.photographer_name}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-900">
                                                {sale.organizer_name}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                <div className="font-medium text-gray-900">
                                                    {sale.buyer_name || "Guest User"}
                                                </div>
                                                <div className="text-gray-500">
                                                    {sale.buyer_email || "-"}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6 mt-4">
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, filtered.length)}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> results
                                </p>
                                <nav className="inline-flex shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DetailedSales;

