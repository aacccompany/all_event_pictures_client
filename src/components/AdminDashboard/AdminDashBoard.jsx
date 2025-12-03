import React, { useEffect, useState } from 'react';
import { getDashboardEventStats, getRecentActivities, getRecentSales } from '../../api/dashboard';
import DashboardStats from '../Dashboard/DashboardStats';
import RecentEvents from '../Dashboard/RecentEvents';
import RecentSales from '../Dashboard/RecentSales';

const AdminDashBoard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const useMockData = false; // Set to false to fetch real data when APIs are ready

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dashboardStatsData, activities, sales;

        if (useMockData) {
          // This block is now effectively dead code but kept for reference if needed
          dashboardStatsData = { totalEvents: 120, changeSinceLastMonth: 2, percentageChange: 15 };
          activities = [
            { id: 1, type: 'Event Created', description: 'Wedding Ceremony', date: '2025-09-15', status: 'Completed' },
            { id: 2, type: 'Event Created', description: 'Corporate Gala', date: '2025-09-20', status: 'Completed' },
            { id: 3, type: 'Event Created', description: 'Music Festival', date: '2025-10-05', status: 'Upcoming' },
            { id: 4, type: 'Event Created', description: 'Birthday Party', date: '2025-10-12', status: 'Upcoming' },
          ];
          sales = await getRecentSales();
        } else {
          // Real API calls
          dashboardStatsData = await getDashboardEventStats();
          activities = await getRecentActivities();
          sales = await getRecentSales();
        }

        setStats({
          totalEvents: dashboardStatsData.totalEvents,
          totalUsers: 0, // Placeholder for actual total users if needed
          totalSales: 150000, // Placeholder for actual total sales if needed
          pendingApprovals: 0, // Placeholder for actual pending approvals if needed
          eventsChangeSinceLastMonth: dashboardStatsData.changeSinceLastMonth,
          eventsPercentageChange: dashboardStatsData.percentageChange,
        });
        setRecentActivities(activities);
        setRecentSales(sales);
      } catch (err) {
        setError("Failed to fetch dashboard data.");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [useMockData]);

  if (loading) {
    return <div>Loading Dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      {stats && <DashboardStats stats={stats} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <RecentEvents events={recentActivities} />
        <RecentSales sales={recentSales} />
      </div>
    </div>
  );
};

export default AdminDashBoard;