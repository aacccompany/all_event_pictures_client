import { get_events } from './event';
import axios from 'axios';
import { API_BASE_URL } from "./config";

export const getDashboardEventStats = async () => {
    try {
        const allEventsResponse = await get_events();
        console.log("allEventsResponse:", allEventsResponse);
        const totalEvents = allEventsResponse.data.length;

        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const eventsLastMonthResponse = await get_events(oneMonthAgo);
        console.log("eventsLastMonthResponse:", eventsLastMonthResponse);
        const eventsLastMonth = eventsLastMonthResponse.data.length;

        const changeSinceLastMonth = totalEvents - eventsLastMonth;
        const percentageChange = eventsLastMonth > 0 ? (changeSinceLastMonth / eventsLastMonth) * 100 : 0;

        console.log("Dashboard Event Stats:", { totalEvents, changeSinceLastMonth, percentageChange });
        return {
            totalEvents,
            changeSinceLastMonth,
            percentageChange,
        };
    } catch (error) {
        console.error("Error fetching dashboard event stats:", error);
        throw error;
    }
};

export const getRecentActivities = async () => {
    try {
        const response = await get_events(null, 4); // Get the 4 most recent events
        console.log("getRecentActivities response:", response);
        // Build local YYYY-MM-DD for reliable lexicographic comparison
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;

        const recentActivities = response.data.map(event => {
            const rawDate = (event.date || event.created_at || '').toString();
            const eventDateStr = rawDate.includes('T') ? rawDate.split('T')[0] : rawDate; // YYYY-MM-DD

            let status = 'Upcoming';
            if (eventDateStr < todayStr) status = 'Completed';
            else if (eventDateStr === todayStr) status = 'Ongoing';

            return {
                id: event.id,
                type: 'Event Created',
                description: event.title,
                date: eventDateStr,
                status,
            };
        });
        console.log("Formatted recent activities:", recentActivities);
        return recentActivities;
    } catch (error) {
        console.error("Error fetching recent events:", error);
        throw error;
    }
};

// Placeholder for fetching recent sales (no changes here)
export const getRecentSales = async (limit = 5) => {
    const res = await axios.get(`${API_BASE_URL}/api/v1/recent-sales`, { params: { limit } });
    // map ให้อยู่รูปแบบที่หน้า Dashboard ใช้งานง่าย
    return res.data.map((s, idx) => ({
        id: idx + 1,
        event: s.event_name,
        amount: s.photo_count, // number of photos
        date: s.purchased_at,
    }));
};

