import { useState } from 'react';
import { CalendarIcon, SparklesIcon } from './Icons';

const ExecutionTimeline = () => {
  const [activeTab, setActiveTab] = useState('today'); // 'today' or 'explore'
  const [step, setStep] = useState('year'); // 'year', 'month', 'date', 'tasks'
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const years = [2024, 2025, 2026];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Mock data for tasks
  const tasksByDate = {
    '2026-March-5': [
      { time: '09:00 AM', label: 'Standup Meeting', status: 'done' },
      { time: '10:30 AM', label: 'ML Strategy Sync', active: true },
      { time: '02:00 PM', label: 'UI/UX Review', status: 'pending' },
      { time: '04:30 PM', label: 'Code Commit', status: 'pending' }
    ],
    '2026-March-6': [
      { time: '10:00 AM', label: 'Client Presentation', active: true },
      { time: '01:00 PM', label: 'Team Lunch', status: 'pending' },
    ]
  };

  const resetSelection = () => {
    setStep('year');
    setSelectedYear(null);
    setSelectedMonth(null);
    setSelectedDate(null);
  };

  const renderPicker = () => {
    if (step === 'year') {
      return (
        <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {years.map(y => (
            <button key={y} onClick={() => { setSelectedYear(y); setStep('month'); }} className="p-3 bg-slate-800/30 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-xl border border-slate-700/50 text-xs font-bold transition-all hover:scale-[1.02]">
              {y}
            </button>
          ))}
        </div>
      );
    }
    if (step === 'month') {
      return (
        <div className="grid grid-cols-3 gap-2 overflow-y-auto max-h-60 pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-300">
          {months.map(m => (
            <button key={m} onClick={() => { setSelectedMonth(m); setStep('date'); }} className="p-2 bg-slate-800/30 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg border border-slate-700/50 text-[10px] font-bold transition-all">
              {m.substring(0, 3)}
            </button>
          ))}
        </div>
      );
    }
    if (step === 'date') {
      return (
        <div className="grid grid-cols-7 gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
            <button key={d} onClick={() => { setSelectedDate(d); setStep('tasks'); }} className="aspect-square flex items-center justify-center bg-slate-800/30 hover:bg-cyan-500/20 hover:text-cyan-400 rounded-lg border border-slate-700/50 text-[10px] font-bold transition-all">
              {d}
            </button>
          ))}
        </div>
      );
    }
  };

  const todayKey = '2026-March-5';
  const explorerKey = `${selectedYear}-${selectedMonth}-${selectedDate}`;
  const currentTasks = activeTab === 'today' ? tasksByDate[todayKey] : tasksByDate[explorerKey] || [];

  return (
    <aside className="w-80 bg-[#1f2937] border-l border-[#111827] hidden 2xl:flex flex-col shadow-2xl overflow-hidden">
      <header className="h-20 flex flex-col justify-center px-6 border-b border-slate-800/50 shrink-0 space-y-3">
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-200 flex items-center gap-2.5 uppercase tracking-widest">
            <CalendarIcon className="text-cyan-500 w-4 h-4" />
            Timetable
            </h2>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-[#111827] p-1 rounded-xl border border-slate-800/50">
            <button 
                onClick={() => setActiveTab('today')}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${activeTab === 'today' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Today
            </button>
            <button 
                onClick={() => setActiveTab('explore')}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${activeTab === 'explore' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
                Explore
            </button>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
        
        {activeTab === 'today' ? (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Progress Tracker */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today's Progress</span>
                        <span className="text-xs font-bold text-cyan-400">75%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-900 rounded-full p-0.5 border border-slate-800">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 w-[75%] rounded-full shadow-[0_0_10px_rgba(6,182,212,0.3)] transition-all duration-1000"></div>
                    </div>
                </div>

                {/* Today's Tasks */}
                <div className="space-y-6">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Current Schedule</span>
                    <div className="relative pl-6 space-y-10 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                        {tasksByDate[todayKey].map((item, i) => (
                            <div key={i} className="relative group cursor-pointer">
                                <div className={`absolute -left-[24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#1f2937] transition-all ${item.active ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : item.status === 'done' ? 'bg-slate-500' : 'bg-slate-800'}`}></div>
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.time}</span>
                                    <span className={`text-sm font-bold tracking-tight transition-colors ${item.active ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>{item.label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ) : (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Date Selection Display */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">History Explorer</span>
                        {(selectedYear || step !== 'year') && (
                        <button onClick={resetSelection} className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 transition-colors">Reset Filter</button>
                        )}
                    </div>
                    <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                        {step === 'tasks' ? (
                        <span className="text-sm font-bold text-slate-100">{selectedDate} {selectedMonth} {selectedYear}</span>
                        ) : (
                        <span className="text-sm font-bold text-slate-500 italic">Select {step}...</span>
                        )}
                    </div>
                </div>

                {/* Dynamic Picker / Task List */}
                <div className="min-h-[200px]">
                    {step !== 'tasks' ? (
                        <div className="space-y-4">
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest block">Choose {step}</span>
                        {renderPicker()}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Results</span>
                            </div>
                            
                            {currentTasks.length > 0 ? (
                                <div className="relative pl-6 space-y-10 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                                {currentTasks.map((item, i) => (
                                    <div key={i} className="relative group cursor-pointer">
                                    <div className={`absolute -left-[24px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[#1f2937] transition-all ${item.active ? 'bg-cyan-500 shadow-[0_0_10px_#06b6d4]' : item.status === 'done' ? 'bg-slate-500' : 'bg-slate-800'}`}></div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.time}</span>
                                        <span className={`text-sm font-bold tracking-tight transition-colors ${item.active ? 'text-cyan-400' : 'text-slate-300 group-hover:text-white'}`}>{item.label}</span>
                                    </div>
                                    </div>
                                ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center opacity-40">
                                <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center mb-4">
                                    <CalendarIcon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">No history found</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Smart Action */}
        <div className="pt-8 border-t border-slate-800 shrink-0">
           <button className="w-full py-4 bg-slate-800/20 hover:bg-slate-800/50 border border-slate-700/50 text-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 group">
             <SparklesIcon className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform" />
             AI Optimize Schedule
           </button>
        </div>
      </div>
    </aside>
  );
};

export default ExecutionTimeline;