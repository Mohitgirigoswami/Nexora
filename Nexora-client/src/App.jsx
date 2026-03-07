import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SidebarComponent from './components/SidebarComponent';
import AIInteractionHub from './components/AIInteractionHub';
import ExecutionTimeline from './components/ExecutionTimeline';
import Signup from './components/Signup';
import Login from './components/Login';
import VerifyOTP from './components/VerifyOTP';
import TasksPage from './components/TasksPage';

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
  const [me, setMe] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('/main/who_am_i', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setMe(data.user);
        } else {
          console.error('Failed to fetch user:', data.msg);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchMe();
  }, []);
  return (
    <div className="flex h-screen w-full bg-[#111827] text-[#f3f4f6] font-sans selection:bg-cyan-500/30 overflow-hidden">
      <SidebarComponent 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
        me={me}
      />
      <div className="flex-1 flex overflow-hidden relative">
        <Routes>
          <Route path="/" element={
            <>
              <AIInteractionHub 
                goal={goal} 
                setGoal={setGoal} 
              />
              <ExecutionTimeline />
            </>
          } />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
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
          path="/*" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App
