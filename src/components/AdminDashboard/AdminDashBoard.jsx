import React, { useEffect, useState } from 'react';
import { getDashboardStats, getRecentActivities, getRecentSales } from '../../api/dashboard';
import { get_events } from '../../api/event';
import DashboardStats from '../Dashboard/DashboardStats';
import RecentEvents from '../Dashboard/RecentEvents';
import RecentSales from '../Dashboard/RecentSales';

const AdminDashBoard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const useMockData = true; // Set to false to fetch real data when APIs are ready

  useEffect(() => {
    const fetchData = async () => {
      try {
        let dashboardStats, activities, sales, events;

        if (useMockData) {
          dashboardStats = await getDashboardStats();
          events = { data: [] }; // Mock for get_events when using mock data
          activities = await getRecentActivities();
          sales = await getRecentSales();
        } else {
          // Real API calls go here
          // For total events, we already have a real API call:
          events = await get_events(); 

          // Placeholder for real dashboard stats API call
          dashboardStats = { 
            totalUsers: 0, 
            totalSales: 0,
            pendingApprovals: 0,
          };
          // Replace with actual API call to get dashboard statistics
          // For example: dashboardStats = await getRealDashboardStats();
          
          // Placeholder for real recent activities API call
          activities = [];
          // Replace with actual API call to get recent activities
          // For example: activities = await getRealRecentActivities();

          // Placeholder for real recent sales API call
          sales = [];
          // Replace with actual API call to get recent sales
          // For example: sales = await getRealRecentSales();
        }

        setStats({
          ...dashboardStats,
          totalEvents: events.data.length, 
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