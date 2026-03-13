import React, { useState } from 'react';
import { CheckCircleIcon, CalendarIcon, TrashIcon, EditIcon, LinkIcon } from './Icons';

const TaskComponent = ({ task, onEdit, onDelete, onUpdate }) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const isDone = task.status === 'done';
  const taskColor = task.color || '#06b6d4';

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleStatusToggle = async (e) => {
    e.stopPropagation();
    setIsUpdatingStatus(true);
    try {
      const token = localStorage.getItem('token');
      const newStatus = isDone ? 'pending' : 'done';
      const response = await fetch(`/main/update_task/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };
  
  return (
    <div 
      className={`group p-5 rounded-2xl border transition-all duration-300 ${
        isDone 
        ? 'bg-emerald-500/5 border-emerald-500/20 opacity-75' 
        : 'bg-slate-800/40 border-slate-700/50 shadow-lg'
      }`}
      style={{ 
        borderColor: !isDone ? `${taskColor}33` : undefined,
      }}
      onMouseEnter={(e) => {
        if (!isDone) e.currentTarget.style.borderColor = `${taskColor}88`;
      }}
      onMouseLeave={(e) => {
        if (!isDone) e.currentTarget.style.borderColor = `${taskColor}33`;
      }}
    >
      <div className="flex items-start gap-4">
        <button 
          onClick={handleStatusToggle}
          disabled={isUpdatingStatus}
          className={`mt-1 p-2 rounded-xl transition-all ${
            isDone 
            ? 'bg-emerald-500 text-slate-900' 
            : 'bg-slate-700/50 text-slate-500 hover:text-white'
          } ${isUpdatingStatus ? 'animate-pulse' : ''}`}
          style={{ 
            backgroundColor: !isDone && isUpdatingStatus ? taskColor : undefined,
            color: !isDone ? (isUpdatingStatus ? '#0f172a' : taskColor) : undefined
          }}
        >
          <CheckCircleIcon className="w-5 h-5" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1.5">
            <h4 className={`text-base font-bold truncate transition-all ${
              isDone ? 'text-slate-500 line-through' : 'text-white'
            }`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-2 shrink-0 ml-4">
              {task.date && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-700/30">
                  <CalendarIcon className="w-3 h-3" />
                  {formatDate(task.date)}
                </span>
              )}
            </div>
          </div>
          
          <p className={`text-sm leading-relaxed mb-4 ${isDone ? 'text-slate-600' : 'text-slate-400'}`}>
            {task.description || 'No description provided.'}
          </p>

          {task.resources && task.resources.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {task.resources.map((res, idx) => (
                <a 
                  key={idx}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/50 border border-slate-700/50 text-[10px] font-bold text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <LinkIcon className="w-3 h-3" />
                  {res.title}
                </a>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span 
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                  isDone ? 'bg-emerald-500/10 text-emerald-500' : ''
                }`}
                style={{ 
                  backgroundColor: !isDone ? `${taskColor}22` : undefined,
                  color: !isDone ? taskColor : undefined
                }}
              >
                {task.status}
              </span>
              {task.duration_minutes > 0 && (
                <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                  {task.duration_minutes} mins
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
              <button 
                onClick={onEdit}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                title="Edit Task"
              >
                <EditIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={onDelete}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                title="Delete Task"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskComponent;