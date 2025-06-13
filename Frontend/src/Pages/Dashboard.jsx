import React, { useState } from 'react';
import {
  Users,
  Store,
  ChefHat,
  TrendingUp,
  Table as TableIcon,
  Cctv,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useGetDashboardStatsQuery } from '../redux/api/commonApi';
import { MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';

// Sample data for monthly and yearly
const monthlyData = [
  { name: 'Jan', count: 400 },
  { name: 'Feb', count: 300 },
  { name: 'Mar', count: 200 },
  { name: 'Apr', count: 500 },
  { name: 'May', count: 600 },
  { name: 'Jun', count: 700 },
  { name: 'Jul', count: 800 },
  { name: 'Aug', count: 900 },
  { name: 'Sep', count: 1000 },
  { name: 'Oct', count: 1100 },
  { name: 'Nov', count: 1200 },
  { name: 'Dec', count: 1300 },
];

const yearlyData = [
  { name: '2020', count: 1500 },
  { name: '2021', count: 2500 },
  { name: '2022', count: 3500 },
  { name: '2023', count: 4500 },
];


function Dashboard() {
  const { user } = useAuth();
  const { data } = useGetDashboardStatsQuery(user?.accessToken);
  const [timeRange, setTimeRange] = useState('monthly');

  console.log(data?.stats, 'data');

  // Function to get the appropriate icon based on the title
  const getIcon = (title) => {
    switch (title) {
      case 'Total Restaurants':
        return Store;
      case 'Restaurant Admins':
        return ChefHat;
      case 'Total Users':
        return Users;
      case 'Total Cameras':
        return Cctv;
      default:
        return Users; // Default icon
    }
  };

  // Ensure `data?.stats` is an array before mapping
  const stats = data?.stats.map((item) => ({
    title: item.title || 'N/A', // Default title if undefined
    value: item.value || 0, // Default value to 0 if undefined
    icon: getIcon(item.title), // Get the icon based on the title
    color: 'bg-indigo-800',
  }));

  // Determine which data to display based on the time range
  const restaurantData = timeRange === 'monthly' ? monthlyData : yearlyData;

  return (
    <div className="min-h-screen sm:w-full">
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-indigo-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, Super Admin</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 sm:w-full lg:grid-cols-4 gap-6 mb-8">
          {stats?.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    {React.createElement(stat.icon, { className: 'h-6 w-6 text-white' })}
                  </div>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="bg-indigo-50 px-6 py-3">
                <div className="flex items-center text-sm text-indigo-900">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <span>vs. previous month</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Restaurant Types Chart */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
            <h2 className="text-lg font-semibold text-indigo-900">Our Clients</h2>
            <FormControl variant="outlined" size="small">
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={restaurantData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#312e81" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;