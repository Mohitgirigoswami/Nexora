import { useState } from 'react'
import SidebarComponent from './components/SidebarComponent';
import AIInteractionHub from './components/AIInteractionHub';
import ExecutionTimeline from './components/ExecutionTimeline';

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [goal, setGoal] = useState('');

  return (
    <div className="flex h-screen w-full bg-[#111827] text-[#f3f4f6] font-sans selection:bg-cyan-500/30 overflow-hidden">
      
      {/* 1. GLOBAL SIDEBAR (LEFT) */}
      <SidebarComponent 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />

      {/* MAIN CONTENT AREA (CENTER + RIGHT) */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* 2. AI INTERACTION HUB (CENTER) */}
        <AIInteractionHub 
          goal={goal} 
          setGoal={setGoal} 
        />

        {/* 3. EXECUTION TIMELINE / TIMETABLE (RIGHT) */}
        <ExecutionTimeline />
        
      </div>
    </div>
  )
}

export default App