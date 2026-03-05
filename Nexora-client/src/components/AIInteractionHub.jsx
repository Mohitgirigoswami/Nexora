import { SparklesIcon, BellIcon } from './Icons';

const AIInteractionHub = ({ goal, setGoal }) => {
  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a]">
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

      <div className="flex-1 overflow-y-auto p-8 space-y-10">
        {/* Prominent AI Input */}
        <section className="max-w-4xl mx-auto w-full">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 to-purple-600/10 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition duration-700"></div>
            <div className="relative flex flex-col bg-[#1f2937] rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <textarea 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Describe your goal and let Nexora handle the planning..."
                className="w-full bg-transparent px-6 py-6 text-[#f3f4f6] placeholder-slate-500 outline-none resize-none min-h-[140px] text-lg leading-relaxed font-medium"
              />
              <div className="flex items-center justify-between px-6 py-4 bg-slate-900/30 border-t border-slate-800/50">
                <span className="text-xs text-slate-500 font-medium italic">Powered by Nexora-ML Engine</span>
                <button className="flex items-center gap-2.5 px-6 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl font-bold transition-all shadow-xl shadow-purple-500/20 active:scale-95">
                  <SparklesIcon className="w-4 h-4" />
                  <span>Generate Strategy</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Task Feed */}
        <section className="max-w-4xl mx-auto w-full space-y-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Roadmap</h3>
            <span className="text-xs font-medium text-cyan-400 cursor-pointer hover:underline">View All</span>
          </div>
          
          {[
            { title: 'Foundation & Core Architecture', time: '2 Days', desc: 'Define system requirements and establish basic API structures.', color: 'cyan' },
            { title: 'ML Model Integration', time: '5 Days', desc: 'Connecting the Python backend with the React interface.', isAI: true, color: 'purple' },
            { title: 'Production Deployment', time: '1 Day', desc: 'Finalizing CI/CD pipelines and monitoring tools.', color: 'emerald' }
          ].map((task, i) => (
            <div key={i} className={`p-6 rounded-2xl bg-[#1f2937] border border-slate-800/50 hover:border-slate-700 hover:bg-[#252d3a] transition-all cursor-pointer group relative overflow-hidden`}>
              {task.isAI && <div className="absolute top-0 left-0 w-1 h-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></div>}
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h4 className="font-bold text-slate-100 text-base">{task.title}</h4>
                    {task.isAI && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-[10px] font-black text-purple-400 uppercase tracking-tighter border border-purple-500/20">
                        AI-Optimized
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 font-medium leading-relaxed">{task.desc}</p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-900/50 px-4 py-2 rounded-xl border border-slate-800 tabular-nums">
                  {task.time}
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
};

export default AIInteractionHub;