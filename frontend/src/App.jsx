import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '/src/pages/Navbar.jsx';
import TaskList from '/src/pages/TaskList.jsx';
import TaskDetail from '/src/pages/TaskDetail';
import CreateTask from '/src/pages/CreateTask';
import Dashboard from '/src/pages/Dashboard';
import Login from '/src/pages/Login';
import Register from '/src/pages/Register';
import { AuthProvider } from '/src/context/AuthContext';
import PrivateRoute from '/src/components/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans antialiased">
          <Navbar />
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route 
                    path="/" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/tasks" 
                    element={
                      <PrivateRoute>
                        <TaskList />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/tasks/create" 
                    element={
                      <PrivateRoute>
                        <CreateTask />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/tasks/:id" 
                    element={
                      <PrivateRoute>
                        <TaskDetail />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;