import React, { useState } from 'react';
import { 
  Users, 
  Package,
  Gamepad2,
  BookOpen
} from 'lucide-react';
import Sidebar from '../Components/Sidebar';
import TopBar from '../Components/TopBar';
import MetricsCard from '../Components/MetricsCard';
import DashboardGraph from '../Components/DashboardGraph';

const Dashboard = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const metrics = [
    {
      title: 'Total User',
      value: '40,689',
      icon: Users,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-500'
    },
    {
      title: 'Subscriptions',
      value: '10293',
      icon: Package,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Total Games',
      value: '20',
      icon: Gamepad2,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-500'
    },
    {
      title: 'Total Programs',
      value: '45',
      icon: BookOpen,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar 
        activeNav={activeNav} 
        setActiveNav={setActiveNav}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-0">
        {/* Header */}
        <TopBar 
          userName="Moni Roy"
          userRole="Admin"
          userInitials="MR"
        />

        {/* Dashboard Content */}
        <main className="flex-1 p-8 md:p-8 pt-16 md:pt-8">
          <h1 className='text-2xl font-nunitoSansBold mb-4 text-primaryBlack'>Dashboard</h1>
          {/* Metrics Cards */}
          <MetricsCard metrics={metrics} />

          {/* Chart Section */}
          <DashboardGraph chartData={chartData} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;