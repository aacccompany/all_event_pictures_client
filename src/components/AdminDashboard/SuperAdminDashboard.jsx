import React, { useEffect, useState } from 'react';
import { getDashboardEventStats, getRecentActivities, getRecentSales } from '../../api/dashboard';
import { getUsers, getWithdrawalRequests, getPlatformRevenue } from '../../api/super-admin';
import { get_events } from '@/api/event';
import RecentEvents from '../Dashboard/RecentEvents';
import RecentSales from '../Dashboard/RecentSales';
import TransactionHistory from '../Dashboard/TransactionHistory';
import useAuthStore from "@/stores/auth-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, Image, ShoppingCart, Calendar, Clock, TrendingUp } from "lucide-react";
import { Link } from 'react-router';

const StatCard = ({ title, value, subtitle, icon: Icon, color = "text-blue-600", linkTo }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className={`w-5 h-5 ${color}`} />
        </CardHeader>
        <CardContent>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
            {linkTo && (
                <Link to={linkTo} className="text-xs text-blue-500 hover:underline mt-2 block">
                    View details →
                </Link>
            )}
        </CardContent>
    </Card>
);

const SuperAdminDashboard = () => {
    const token = useAuthStore((state) => state.token);
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Platform stats
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalPhotographers, setTotalPhotographers] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalPhotos, setTotalPhotos] = useState(0);
    const [platformRevenue, setPlatformRevenue] = useState(0);
    const [pendingWithdrawals, setPendingWithdrawals] = useState(0);
    const [totalSalesCount, setTotalSalesCount] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const [eventStats, activities, sales, photographers, admins, withdrawals, revenue, allEvents] = await Promise.all([
                    getDashboardEventStats(),
                    getRecentActivities(),
                    getRecentSales(),
                    getUsers(token, 1, 1000, false, "user"),
                    getUsers(token, 1, 1000, false, "admin"),
                    getWithdrawalRequests(token),
                    getPlatformRevenue(token),
                    get_events(), // all events to count photos
                ]);

                // Total Events
                setTotalEvents(eventStats.totalEvents);

                // Users by role
                setTotalPhotographers(photographers.data.total);
                setTotalAdmins(admins.data.total);

                // Total photos across all events
                const photoCount = allEvents.data.reduce(
                    (sum, ev) => sum + (ev.images ? ev.images.length : 0), 0
                );
                setTotalPhotos(photoCount);

                // Revenue
                setPlatformRevenue((revenue.data.total_revenue / 100).toFixed(2));

                // Pending withdrawals
                const pending = withdrawals.data.filter(w => w.status === 'pending');
                setPendingWithdrawals(pending.length);

                // Total platform sales count
                setTotalSalesCount(sales.length);

                // Recent activities (platform-wide)
                setRecentActivities(activities.map(a => ({
                    id: a.id,
                    name: a.description,
                    date: a.date,
                    status: a.status,
                    photos: a.photos,
                    sales: a.sales || 0,
                    earnings: a.earnings || 0,
                })));
                // Super admin doesn't personally earn from individual sales — earnings = ฿0
                setRecentSales(sales.map(s => ({ ...s, earnings: 0 })));
            } catch (err) {
                setError("Failed to fetch dashboard data.");
                console.error("Error fetching dashboard data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Loading platform overview...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="p-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Platform Overview</h2>
                    <p className="text-muted-foreground text-sm mt-1">
                        Full visibility of all events, users, photos, and sales across the platform.
                    </p>
                </div>
                <TransactionHistory token={token} />
            </div>

            {/* Platform Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard
                    title="Total Events"
                    value={totalEvents}
                    subtitle="All platform events"
                    icon={Calendar}
                    color="text-indigo-600"
                    linkTo="/super-admin/my-events"
                />
                <StatCard
                    title="Photographers"
                    value={totalPhotographers}
                    subtitle="Registered users"
                    icon={Users}
                    color="text-blue-600"
                    linkTo="/super-admin/photographers"
                />
                <StatCard
                    title="Organizers"
                    value={totalAdmins}
                    subtitle="Admin accounts"
                    icon={Users}
                    color="text-purple-600"
                    linkTo="/super-admin/users"
                />
                <StatCard
                    title="Photos Uploaded"
                    value={totalPhotos}
                    subtitle="Across all events"
                    icon={Image}
                    color="text-amber-600"
                />
                <StatCard
                    title="Platform Revenue"
                    value={`฿${platformRevenue}`}
                    subtitle="Total sales revenue"
                    icon={TrendingUp}
                    color="text-green-600"
                    linkTo="/super-admin/detailed-sales"
                />
                <StatCard
                    title="Pending Withdrawals"
                    value={pendingWithdrawals}
                    subtitle="Awaiting approval"
                    icon={Clock}
                    color={pendingWithdrawals > 0 ? "text-red-500" : "text-gray-400"}
                    linkTo="/super-admin/withdrawals"
                />
            </div>

            {/* Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RecentEvents
                    events={recentActivities}
                    className="col-span-4"
                    viewAllPath="/super-admin/my-events"
                />
                <RecentSales
                    sales={recentSales}
                    className="col-span-3"
                    viewAllPath="/super-admin/detailed-sales"
                />
            </div>
        </div>
    );
};

export default SuperAdminDashboard;

