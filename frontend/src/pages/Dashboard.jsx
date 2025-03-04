import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ClipboardListIcon, 
  CheckCircleIcon, 
  ClockIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const StatCard = ({ icon, title, value, color }) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className={`bg-white shadow-lg rounded-2xl p-6 border-l-4 ${color} flex items-center space-x-4`}
  >
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const statsResponse = await axios.get('/api/dashboard/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const tasksResponse = await axios.get('/api/tasks?limit=5', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setStats(statsResponse.data);
        setRecentTasks(tasksResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
            <p className="text-blue-100">Your productivity dashboard</p>
          </div>
          <img 
            src="/dashboard-illustration.svg" 
            alt="Dashboard" 
            className="hidden md:block w-32 h-32"
          />
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard 
          icon={<ClipboardListIcon className="w-6 h-6 text-blue-500" />}
          title="Total Tasks"
          value={stats.totalTasks}
          color="border-blue-500"
        />
        <StatCard 
          icon={<CheckCircleIcon className="w-6 h-6 text-green-500" />}
          title="Completed Tasks"
          value={stats.completedTasks}
          color="border-green-500"
        />
        <StatCard 
          icon={<ClockIcon className="w-6 h-6 text-yellow-500" />}
          title="Pending Tasks"
          value={stats.pendingTasks}
          color="border-yellow-500"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Tasks</h2>
          <Link 
            to="/tasks" 
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-2"
          >
            <span>View All</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" 
                clipRule="evenodd" 
              />
            </svg>
          </Link>
        </div>

        {recentTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No recent tasks. Start creating!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentTasks.map(task => (
              <motion.div 
                key={task.id} 
                whileHover={{ scale: 1.02 }}
                className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 flex justify-between items-center transition duration-300"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{task.title}</h3>
                  <p className="text-sm text-gray-500">{task.description}</p>
                </div>
                <Link 
                  to={`/tasks/${task.id}`} 
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Details
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;