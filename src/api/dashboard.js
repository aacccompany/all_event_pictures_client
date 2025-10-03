export const getDashboardStats = async () => {
    // Placeholder for fetching general dashboard statistics
    return new Promise(resolve => setTimeout(() => resolve({
        totalEvents: 120,
        totalUsers: 500,
        totalSales: 15000,
        pendingApprovals: 15
    }), 500));
};

export const getTotalUsers = async () => {
    // Placeholder for fetching total number of users
    return new Promise(resolve => setTimeout(() => resolve({ count: 500 }), 500));
};

export const getRecentActivities = async () => {
    // Placeholder for fetching recent activities
    return new Promise(resolve => setTimeout(() => resolve([
        { id: 1, type: 'Event Created', description: 'New Year Party', date: '2025-09-28' },
        { id: 2, type: 'User Registered', description: 'John Doe', date: '2025-09-27' },
        { id: 3, type: 'Sale Completed', description: 'Event Photo Package', date: '2025-09-26' },
    ]), 500));
};

export const getRecentSales = async () => {
    // Placeholder for fetching recent sales
    return new Promise(resolve => setTimeout(() => resolve([
        { id: 1, event: 'New Year Party', amount: 120, date: '2025-09-28' },
        { id: 2, event: 'Summer Festival', amount: 75, date: '2025-09-27' },
        { id: 3, event: 'Charity Gala', amount: 200, date: '2025-09-26' },
    ]), 500));
};

