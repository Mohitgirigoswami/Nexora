import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SidebarComponent from './components/SidebarComponent';
import AIInteractionHub from './components/AIInteractionHub';
import ExecutionTimeline from './components/ExecutionTimeline';
import Signup from './components/Signup';
import Login from './components/Login';
import VerifyOTP from './components/VerifyOTP';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/signup" replace />;
  }
  return children;
};

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [goal, setGoal] = useState('');

  return (
    <div className="flex h-screen w-full bg-[#111827] text-[#f3f4f6] font-sans selection:bg-cyan-500/30 overflow-hidden">
      <SidebarComponent 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />
      <div className="flex-1 flex overflow-hidden relative">
        <AIInteractionHub 
          goal={goal} 
          setGoal={setGoal} 
        />
        <ExecutionTimeline />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App
