import React from 'react';
import TaskComponent from './TaskComponent';
import { CalendarIcon } from './Icons';

const TimelineView = ({ allTasks, openEditModal, handleDeleteTask, fetchData }) => {
  const formatDateLabel = (dateStr) => {
    if (!dateStr) return 'No Date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const tasksByDate = allTasks.reduce((acc, task) => {
    const d = task.date || 'No Date';
    if (!acc[d]) acc[d] = [];
    acc[d].push(task);
    return acc;
  }, {});

  const sortedDates = Object.keys(tasksByDate).sort((a, b) => {
    if (a === 'No Date') return 1;
    if (b === 'No Date') return -1;
    return new Date(a) - new Date(b);
  });

  return (
    <div className="space-y-12">
      {sortedDates.map(dateStr => (
        <div key={dateStr} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20">
              <CalendarIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white leading-tight">{formatDateLabel(dateStr)}</h2>
              <p className="text-xs text-slate-500 font-medium">{tasksByDate[dateStr].length} Tasks scheduled</p>
            </div>
          </div>
          
          <div className="grid gap-4">
            {tasksByDate[dateStr].map(task => (
              <TaskComponent 
                key={task.id} 
                task={task} 
                onEdit={() => openEditModal(task)}
                onDelete={() => handleDeleteTask(task.id)}
                onUpdate={fetchData}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineView;