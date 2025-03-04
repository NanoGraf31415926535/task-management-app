import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, ClipboardListIcon, PlusCircleIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition duration-300"
        >
          <img 
            src="/logo.svg" 
            alt="TaskMaster Logo" 
            className="h-8 w-8"
          />
          <span>TaskMaster</span>
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <NavLink to="/" icon={<HomeIcon className="w-5 h-5" />} label="Home" />
              <NavLink to="/tasks" icon={<ClipboardListIcon className="w-5 h-5" />} label="Tasks" />
              <NavLink to="/tasks/create" icon={<PlusCircleIcon className="w-5 h-5" />} label="Create" />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
                <span className="font-medium text-gray-700">{user.name}</span>
              </div>
              
              <button 
                onClick={logout} 
                className="group flex items-center space-x-2 text-red-500 hover:text-red-600 transition duration-300"
                title="Logout"
              >
                <LogOutIcon className="w-5 h-5 group-hover:rotate-6 transition" />
              </button>
            </div>
            
          </div>
        ) : (
          <div className="flex space-x-4">
            <Link 
              to="/login" 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

// Helper component for navigation links
const NavLink = ({ to, icon, label }) => (
  <Link 
    to={to} 
    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition duration-300 group"
  >
    {icon}
    <span className="hidden md:inline group-hover:text-blue-600">{label}</span>
  </Link>
);

export default Navbar;