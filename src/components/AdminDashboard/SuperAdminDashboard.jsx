import React, { useEffect, useState } from 'react';
import { getDashboardEventStats, getRecentActivities, getRecentSales } from '../../api/dashboard';
import { getUsers, getWithdrawalRequests, getPlatformRevenue } from '../../api/super-admin';
import DashboardStats from '../Dashboard/DashboardStats';
import RecentEvents from '../Dashboard/RecentEvents';
import RecentSales from '../Dashboard/RecentSales';
import TransactionHistory from '../Dashboard/TransactionHistory';
import useAuthStore from "@/stores/auth-store";

const SuperAdminDashboard = () => {
    const token = useAuthStore((state) => state.token);
    const [stats, setStats] = useState(null);
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentSales, setRecentSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const [dashboardStatsData, activities, sales, users, withdrawals, revenue] = await Promise.all([
                    getDashboardEventStats(),
                    getRecentActivities(),
                    getRecentSales(),
                    getUsers(token, 1, 1000, false, "user"), // Get all photographers to count
                    getWithdrawalRequests(token),
                    getPlatformRevenue(token)
                ]);

                const withdrawalList = withdrawals.data;
                const pendingWithdrawals = withdrawalList.filter(w => w.status === 'pending').length;

                setStats({
                    totalEvents: dashboardStatsData.totalEvents,
                    totalUsers: users.data.total,
                    totalSales: (revenue.data.total_revenue / 100).toFixed(2),
                    pendingApprovals: pendingWithdrawals,
                    eventsChangeSinceLastMonth: dashboardStatsData.changeSinceLastMonth,
                    eventsPercentageChange: dashboardStatsData.percentageChange,
                });

                setRecentActivities(activities.map(a => ({
                    name: a.description,
                    date: a.date,
                    status: a.status,
                    photos: a.photos,
                    sales: "-"
                })));
                setRecentSales(sales);
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
        return <div>Loading Dashboard...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
            </div>
            {stats && <DashboardStats stats={stats} totalSalesAction={<TransactionHistory token={token} />} />}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <RecentEvents events={recentActivities} className="col-span-4" />
                <RecentSales sales={recentSales} className="col-span-3" />
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
