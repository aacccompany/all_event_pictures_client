import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router";
import { get_my_created_events, get_all_events_with_stats } from "@/api/event";
import useAuthStore from "@/stores/auth-store";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

const MyEventsDetail = () => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const isSuperAdmin = user?.role === "super-admin";
    const [events, setEvents] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);


    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const getStatus = (dateStr) => {
        if (!dateStr) return "Unknown";
        const d = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
        if (d < todayStr) return "Completed";
        if (d === todayStr) return "Ongoing";
        return "Upcoming";
    };

    useEffect(() => {
        const fetchEvents = async () => {
            if (!token) return;
            try {
                const res = isSuperAdmin
                    ? await get_all_events_with_stats(token)  // super-admin: ALL events with stats
                    : await get_my_created_events(token);     // admin: only their own
                setEvents(res.data);
                setFiltered(res.data);
            } catch (err) {
                console.error("Failed to load events", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [token, isSuperAdmin]);

    useEffect(() => {
        const q = search.toLowerCase();
        setFiltered(
            events.filter(
                (e) =>
                    e.title?.toLowerCase().includes(q) ||
                    e.location?.toLowerCase().includes(q)
            )
        );
        setPage(1); // reset to first page on search
    }, [search, events]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = useMemo(
        () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
        [filtered, page]
    );

    const totalEarnings = events.reduce((sum, e) => sum + (e.earnings || 0), 0);
    const totalSales = events.reduce((sum, e) => sum + (e.sales_count || 0), 0);

    const backPath = user?.role === "super-admin" ? "/super-admin/dashboard" : "/org/dashboard";

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Back */}
            <Link
                to={backPath}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
            </Link>

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-bold tracking-tight">
                    {isSuperAdmin ? "All Events" : "My Events"}
                </h2>
                <p className="text-muted-foreground text-sm">
                    {isSuperAdmin
                        ? "Full breakdown of all events across the entire platform."
                        : "Full breakdown of all events you have created including sales and earnings."}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-1">
                        <CardDescription>Total Events</CardDescription>
                        <CardTitle className="text-2xl">{events.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardDescription>Total Sales</CardDescription>
                        <CardTitle className="text-2xl">{totalSales} times</CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader className="pb-1">
                        <CardDescription>Total Earnings</CardDescription>
                        <CardTitle className="text-2xl text-green-600">
                            ฿{totalEarnings.toFixed(2)}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <div>
                        <CardTitle>Event Details</CardTitle>
                        <CardDescription>All events with stats</CardDescription>
                    </div>
                    <div className="relative w-60">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search events..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : filtered.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No events found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Photos</TableHead>
                                    <TableHead className="text-right">Sales</TableHead>
                                    <TableHead className="text-right">Earnings</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((event) => {
                                    const status = getStatus(event.date);
                                    return (
                                        <TableRow key={event.id}>
                                            <TableCell>
                                                <div className="font-medium">{event.title}</div>
                                                <div className="text-xs text-muted-foreground">{event.date}</div>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {event.location || "—"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={status === "Completed" ? "outline" : status === "Ongoing" ? "default" : "secondary"}
                                                    className={status === "Ongoing" ? "bg-emerald-500 text-white hover:bg-emerald-600" : ""}
                                                >
                                                    {status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {event.images?.length ?? 0}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {event.sales_count ?? 0}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-green-600">
                                                ฿{(event.earnings ?? 0).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    )}

                    {/* Pagination */}
                    {!loading && filtered.length > 0 && (
                        <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
                            <span>
                                Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} events
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </Button>
                                <span className="font-medium text-foreground">
                                    Page {page} / {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MyEventsDetail;
