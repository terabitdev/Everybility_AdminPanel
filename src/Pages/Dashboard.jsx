import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import TopBar from '../Components/TopBar';
import MetricsCard from '../Components/MetricsCard';
import DashboardGraph from '../Components/DashboardGraph';
import { getDashboardMetrics } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../Components/LoadingSpinner';

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const metricsData = await getDashboardMetrics(currentUser.uid);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [currentUser]);

  // Sample data for the chart
  const chartData = [
    { name: '5k', value: 20 },
    { name: '10k', value: 28 },
    { name: '15k', value: 48 },
    { name: '20k', value: 32 },
    { name: '25k', value: 40 },
    { name: '30k', value: 55 },
    { name: '35k', value: 95 }, // Peak point
    { name: '40k', value: 38 },
    { name: '45k', value: 25 },
    { name: '50k', value: 28 },
    { name: '55k', value: 72 },
    { name: '60k', value: 45 },
    { name: '65k', value: 58 },
    { name: '70k', value: 55 },
    { name: '75k', value: 42 },
    { name: '80k', value: 55 }
  ];

  const metricsCards = metrics ? [
    {
      title: 'Total User',
      value: metrics.totalUsers.toLocaleString(),
      icon: '/assets/users.svg',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Subscriptions',
      value: metrics.totalSubscriptions.toLocaleString(),
      icon: '/assets/subscriptions.svg',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Total Games',
      value: metrics.totalGames.toLocaleString(),
      icon: '/assets/games.svg',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500'
    },
    {
      title: 'Total Programs',
      value: metrics.totalPrograms.toLocaleString(),
      icon: '/assets/programs.svg',
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    }
  ] : [];

  return (
    <div className="min-h-screen bg-[#F5F6FA] flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0 relative">
        {/* Header */}
        <div className="relative z-30">
          <TopBar />
        </div>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 md:p-8 pt-4 md:pt-8 overflow-auto">
          <h1 className='text-3xl sm:text-4xl  font-nunitoSansBold font-bold mb-4 text-primaryBlack'>Dashboard</h1>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Metrics Cards */}
              <MetricsCard metrics={metricsCards} />

              {/* Chart Section */}
              <DashboardGraph chartData={chartData} />
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;