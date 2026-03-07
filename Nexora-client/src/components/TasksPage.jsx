import React, { useState, useEffect } from 'react';
import { TaskIcon, PlusIcon } from './Icons';
import TaskModal from './TaskModal';
import RoadmapView from './RoadmapView';
import TimelineView from './TimelineView';

const TasksPage = () => {
  const [viewMode, setViewMode] = useState('roadmap');
  const [goals, setGoals] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration_minutes: 30,
    color: '#06b6d4',
    goal_id: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const [goalsRes, tasksRes] = await Promise.all([
        fetch('/main/goals', { headers }),
        fetch('/main/tasks', { headers })
      ]);

      const goalsData = await goalsRes.json();
      const tasksData = await tasksRes.json();

      if (goalsRes.ok && tasksRes.ok) {
        setGoals(goalsData.goals || []);
        setAllTasks(tasksData.tasks || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrUpdateTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const url = editingTask ? `/main/update_task/${editingTask.id}` : '/main/add_task';
      const method = editingTask ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask)
      });

      if (response.ok) {
        await fetchData();
        closeModal();
      } else {
        const errorData = await response.json();
        alert(errorData.error || `Failed to ${editingTask ? 'update' : 'create'} task`);
      }
    } catch (error) {
      console.error(`Error ${editingTask ? 'updating' : 'creating'} task:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/main/delete_task/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) await fetchData();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Deleting this goal will also delete all its tasks. Continue?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/main/delete_goal/${goalId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) await fetchData();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || '',
      date: task.date || new Date().toISOString().split('T')[0],
      duration_minutes: task.duration_minutes || 30,
      color: task.color || '#06b6d4',
      goal_id: task.goal_id
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTask({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      duration_minutes: 30,
      color: '#06b6d4',
      goal_id: null
    });
  };

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] overflow-hidden">
      <header className="h-20 flex items-center justify-between px-8 bg-[#0f172a]/60 backdrop-blur-xl border-b border-slate-800/40 sticky top-0 z-10">
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-white tracking-wide">
            {viewMode === 'roadmap' ? 'My Roadmap' : 'Timeline View'}
          </h1>
          <span className="text-xs text-slate-500 font-medium tracking-tight">Structured Productivity</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-[#111827] p-1 rounded-xl border border-slate-800/50 flex">
            <button 
              onClick={() => setViewMode('roadmap')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${viewMode === 'roadmap' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Roadmap
            </button>
            <button 
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${viewMode === 'timeline' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Timeline
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Task</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-12 scroll-smooth">
        <div className="max-w-4xl mx-auto w-full">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
            </div>
          ) : allTasks.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <div className="mb-4 inline-flex p-4 bg-slate-800/50 rounded-full text-slate-500">
                <TaskIcon />
              </div>
              <p className="text-slate-400 mb-6">Your tasks list is empty. Start by adding a task or generating a strategy!</p>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all border border-slate-700"
              >
                <PlusIcon />
                Create First Task
              </button>
            </div>
          ) : viewMode === 'roadmap' ? (
            <RoadmapView 
              goals={goals} 
              allTasks={allTasks} 
              openEditModal={openEditModal} 
              handleDeleteTask={handleDeleteTask} 
              handleDeleteGoal={handleDeleteGoal} 
              fetchData={fetchData} 
            />
          ) : (
            <TimelineView 
              allTasks={allTasks} 
              openEditModal={openEditModal} 
              handleDeleteTask={handleDeleteTask} 
              fetchData={fetchData} 
            />
          )}
        </div>
      </div>

      <TaskModal 
        isOpen={isModalOpen}
        onClose={closeModal}
        editingTask={editingTask}
        newTask={newTask}
        setNewTask={setNewTask}
        goals={goals}
        handleCreateOrUpdateTask={handleCreateOrUpdateTask}
        isSubmitting={isSubmitting}
      />
    </main>
  );
};

export default TasksPage;