import React from 'react';

const DashboardStats = ({ stats }) => {
  const handleWithdrawClick = () => {
    console.log("Withdraw button clicked from Total Sales!");
    // Implement actual withdrawal logic here
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Events" value={stats.totalEvents} />
      <StatCard title="Total Users" value={stats.totalUsers} />
      <StatCard title="Total Sales" value={`THB ${stats.totalSales}`} showWithdrawButton={true} onWithdrawClick={handleWithdrawClick} />
      <StatCard title="Pending Approvals" value={stats.pendingApprovals} />
    </div>
  );
};

const StatCard = ({ title, value, showWithdrawButton, onWithdrawClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      {showWithdrawButton && (
        <button 
          onClick={onWithdrawClick}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Withdraw
        </button>
      )}
    </div>
  );
};

export default DashboardStats;