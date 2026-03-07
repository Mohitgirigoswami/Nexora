import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon, BellIcon, PlusIcon, XIcon, CalendarIcon, CheckCircleIcon, TrashIcon, EditIcon, SendIcon } from './Icons';

const AIInteractionHub = ({ goal, setGoal }) => {
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState(null);
  const [generatedTasks, setGeneratedTasks] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [refineInput, setRefineInput] = useState('');
  const navigate = useNavigate();

  const handleGenerateStrategy = async () => {
    if (!goal.trim()) return;
    
    setLoading(true);
    setError(null);
    setGeneratedTasks([]);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/genai/generate-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: goal })
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedTasks(data.tasks || []);
      } else {
        setError(data.error || 'Failed to generate strategy');
      }
    } catch (err) {
      console.error('Error generating strategy:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefineStrategy = async () => {
    if (!refineInput.trim() || generatedTasks.length === 0) return;
    
    setIsRefining(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/genai/refine-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          tasks: generatedTasks,
          instruction: refineInput 
        })
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedTasks(data.tasks || []);
        setRefineInput('');
      } else {
        setError(data.error || 'Failed to refine strategy');
      }
    } catch (err) {
      console.error('Error refining strategy:', err);
      setError('An error occurred while refining.');
    } finally {
      setIsRefining(false);
    }
  };

  const handleRemoveTask = (index) => {
    setGeneratedTasks(generatedTasks.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleEditTask = (index, field, value) => {
    const updatedTasks = [...generatedTasks];
    updatedTasks[index] = { ...updatedTasks[index], [field]: value };
    setGeneratedTasks(updatedTasks);
  };

  const handleSaveAll = async () => {
    if (generatedTasks.length === 0) return;
    
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/main/add_goal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: goal,
          description: `Strategy generated for: ${goal}`,
          tasks: generatedTasks
        })
      });

      if (response.ok) {
        setGoal('');
        setGeneratedTasks([]);
        navigate('/tasks');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to save strategy');
      }
    } catch (err) {
      console.error('Error saving strategy:', err);
      setError('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
      {/* Loading Overlay */}
      {(loading || isRefining) && (
        <div className="absolute inset-0 z-50 bg-[#0f172a]/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-t-2 border-b-2 border-cyan-500 animate-spin"></div>
            <SparklesIcon className="absolute inset-0 m-auto w-8 h-8 text-purple-500 animate-pulse" />
          </div>
          <h2 className="mt-8 text-xl font-bold text-white tracking-widest uppercase">
            {loading ? 'Nexora is Planning...' : 'Refining Strategy...'}
          </h2>
          <p className="mt-2 text-slate-500 text-sm italic">
            {loading ? 'Decomposing goal into actionable steps' : 'Adjusting roadmap based on your feedback'}
          </p>
        </div>
      )}

      {/* Header */}
      <header className="h-20 flex items-center justify-between px-8 bg-[#0f172a]/60 backdrop-blur-xl border-b border-slate-800/40 sticky top-0 z-10">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white tracking-wide">Overview</h1>
          <span className="text-xs text-slate-500 font-medium tracking-tight">AI Planning Console</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2.5 rounded-xl bg-slate-800/30 hover:bg-slate-700/50 transition-colors border border-slate-700/50 relative group">
            <BellIcon className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-cyan-500 rounded-full border-2 border-[#0f172a]"></span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scroll-smooth">
        {/* Prominent AI Input */}
        <section className="max-w-4xl mx-auto w-full">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
            <div className="relative flex flex-col bg-[#1f2937] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <textarea 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe your goal and let Nexora handle the planning..."
                disabled={loading || isSaving || isRefining}
                className="w-full bg-transparent px-6 py-6 text-[#f3f4f6] placeholder-slate-500 outline-none resize-none min-h-[140px] text-xl leading-relaxed font-medium"
              />
              
              {error && (
                <div className="px-6 py-2 bg-rose-500/10 border-t border-rose-500/20 text-rose-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-end px-6 py-4 bg-slate-900/30 border-t border-slate-800/50">
                <button 
                  onClick={handleGenerateStrategy}
                  disabled={loading || isSaving || isRefining || !goal.trim()}
                  className="flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <SparklesIcon className={`w-5 h-5 transition-transform group-hover:rotate-12 ${loading ? 'animate-spin' : ''}`} />
                  <span className="text-base">Generate Strategy</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Generated Preview & Refinement */}
        {generatedTasks.length > 0 && (
          <section className="max-w-4xl mx-auto w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-xl">
                  <SparklesIcon className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Proposed Strategy</h3>
                  <p className="text-xs text-slate-500">Review, edit, or ask Nexora to adjust the plan.</p>
                </div>
              </div>
              <button 
                onClick={handleSaveAll}
                disabled={isSaving || isRefining}
                className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Confirm & Add Strategy'}
              </button>
            </div>

            {/* Refinement Input */}
            <div className="flex gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800 shadow-inner">
              <input 
                type="text"
                placeholder="Ask Nexora to change something (e.g., 'Make it more detailed', 'Spread tasks over 2 weeks')..."
                className="flex-1 bg-transparent px-4 py-2 text-sm text-white placeholder:text-slate-600 outline-none"
                value={refineInput}
                onChange={(e) => setRefineInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRefineStrategy()}
              />
              <button 
                onClick={handleRefineStrategy}
                disabled={!refineInput.trim() || isRefining}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl transition-all disabled:opacity-50"
              >
                <SendIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="grid gap-4">
              {generatedTasks.map((task, idx) => (
                <div key={idx} className={`group p-5 bg-slate-800/40 rounded-2xl border transition-all ${editingIndex === idx ? 'border-cyan-500/50 ring-1 ring-cyan-500/20' : 'border-slate-700/50 hover:border-purple-500/30'}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-xl bg-slate-700/50 text-slate-500">
                      <CheckCircleIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingIndex === idx ? (
                        <div className="space-y-3">
                          <input 
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm font-bold outline-none focus:border-cyan-500"
                            value={task.title}
                            onChange={(e) => handleEditTask(idx, 'title', e.target.value)}
                          />
                          <textarea 
                            className="w-full bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-cyan-500 resize-none"
                            rows="2"
                            value={task.description}
                            onChange={(e) => handleEditTask(idx, 'description', e.target.value)}
                          />
                          <div className="flex gap-3">
                            <input 
                              type="date"
                              className="bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs outline-none focus:border-cyan-500"
                              value={task.date}
                              onChange={(e) => handleEditTask(idx, 'date', e.target.value)}
                            />
                            <button 
                              onClick={() => setEditingIndex(null)}
                              className="px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-lg text-xs font-bold hover:bg-cyan-500/20"
                            >
                              Done Editing
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-base font-bold text-white truncate">{task.title}</h4>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md mr-2">
                                <CalendarIcon className="w-3 h-3" />
                                {task.date}
                              </span>
                              <button 
                                onClick={() => setEditingIndex(idx)}
                                className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                              >
                                <EditIcon className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleRemoveTask(idx)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-slate-400 line-clamp-2">{task.description}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {!generatedTasks.length && !loading && (
          <section className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
            <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <h3 className="text-slate-200 font-bold mb-2">Smart Decomposition</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Nexora breaks down complex goals into manageable daily chunks using advanced reasoning.</p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <h3 className="text-slate-200 font-bold mb-2">Adaptive Scheduling</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Tasks are scheduled based on priority and logical progression towards your ultimate objective.</p>
            </div>
            <div className="p-6 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <h3 className="text-slate-200 font-bold mb-2">Progressive Tracking</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Watch your roadmap come to life in the tasks section as you execute each step.</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default AIInteractionHub;