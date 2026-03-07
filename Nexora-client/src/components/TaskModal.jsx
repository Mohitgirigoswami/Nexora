import React from 'react';
import { PlusIcon, XIcon, CalendarIcon, EditIcon } from './Icons';

const TaskModal = ({ 
  isOpen, 
  onClose, 
  editingTask, 
  newTask, 
  setNewTask, 
  goals, 
  handleCreateOrUpdateTask, 
  isSubmitting 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-[#1e293b] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700/50 bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl">
              {editingTask ? <EditIcon className="w-5 h-5 text-cyan-400" /> : <PlusIcon className="w-5 h-5 text-cyan-400" />}
            </div>
            <h3 className="text-lg font-bold text-white">{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800/50 rounded-xl transition-colors text-slate-400 hover:text-white"><XIcon /></button>
        </div>

        <form onSubmit={handleCreateOrUpdateTask} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">Task Title</label>
            <input autoFocus required type="text" placeholder="What needs to be done?" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">Associate with Goal</label>
            <div className="relative">
              <select 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none"
                value={newTask.goal_id || ''}
                onChange={(e) => setNewTask({...newTask, goal_id: e.target.value ? parseInt(e.target.value) : null})}
              >
                <option value="">No Goal (Standalone)</option>
                {goals.map(g => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-9"/></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">Description</label>
            <textarea placeholder="Add details..." rows="3" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})}></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1 flex items-center gap-2"><CalendarIcon className="w-4 h-4" />Due Date</label>
              <input type="date" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" value={newTask.date} onChange={(e) => setNewTask({...newTask, date: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 ml-1">Duration (Min)</label>
              <input type="number" min="1" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all" value={newTask.duration_minutes} onChange={(e) => setNewTask({...newTask, duration_minutes: parseInt(e.target.value) || 0})} />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              {['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].map(color => (
                <button key={color} type="button" onClick={() => setNewTask({...newTask, color})} className={`w-8 h-8 rounded-full border-2 transition-all ${newTask.color === color ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: color }}></button>
              ))}
              <div className="relative flex items-center">
                <input 
                  type="color"
                  id="customColor"
                  className="absolute inset-0 opacity-0 w-8 h-8 cursor-pointer"
                  value={newTask.color}
                  onChange={(e) => setNewTask({...newTask, color: e.target.value})}
                />
                <label 
                  htmlFor="customColor"
                  className={`w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center transition-all cursor-pointer ${
                    !['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].includes(newTask.color) 
                    ? 'border-white scale-110 shadow-lg bg-slate-700' 
                    : 'border-slate-600 hover:border-slate-400 bg-slate-800/50'
                  }`}
                  style={{ 
                    backgroundColor: !['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'].includes(newTask.color) ? newTask.color : undefined 
                  }}
                >
                  <PlusIcon className="w-4 h-4 text-slate-400" />
                </label>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={onClose} className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50">
                {isSubmitting ? 'Processing...' : (editingTask ? 'Update Task' : 'Create Task')}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;