const { useState, useEffect } = React;

const Icon = ({ name, className }) => {
  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPApp = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-12 animate-fadeIn">
      {/* Top Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="hud-font chrome-text text-4xl font-black italic">PMP Mastery</h1>
          <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] mt-1 uppercase">Surgical Engine V5.3</p>
        </div>
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-lg border border-white/5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
          <span className="hud-font text-[10px] text-emerald-500">System Ready</span>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {[
          { id: 'study', label: 'Study Hub', icon: 'book-open', color: 'border-purple-500', desc: 'Surgical Tips' },
          { id: 'quiz', label: 'Quizzes & Sims', icon: 'zap', color: 'border-emerald-500', desc: 'Knowledge Drills' },
          { id: 'math', label: 'Formula Lab', icon: 'calculator', color: 'border-blue-500', desc: 'Math Logic' },
          { id: 'mock', label: 'Mock Exam', icon: 'user', color: 'border-rose-500', desc: '180 Question Final' }
        ].map(card => (
          <button key={card.id} className={`hud-card scan-line p-10 text-left border-l-4 ${card.color} group`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-lg group-hover:scale-110 transition-transform"><Icon name={card.icon} className="w-6 h-6" /></div>
              <span className="text-[9px] text-slate-600 font-mono font-bold tracking-widest uppercase">Operational</span>
            </div>
            <h3 className="hud-font text-xl font-bold italic text-white mb-1">{card.label}</h3>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">{card.desc}</p>
          </button>
        ))}
      </div>

      {/* Enhanced Performance Dashboard */}
      <div className="border-t border-white/5 pt-10">
        <h4 className="hud-font text-xs text-slate-600 mb-8 italic tracking-widest">Diagnostic Analytics</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
           {[
             { label: 'Progress', val: '120', unit: 'Solved' },
             { label: 'Accuracy', val: '85%', unit: 'Avg Score' },
             { label: 'Streak', val: '16', unit: 'Active Days' }
           ].map(stat => (
             <div key={stat.label} className="hud-card p-8 bg-white/[0.02] flex flex-col items-center">
                <p className="text-[8px] uppercase font-black text-slate-500 mb-2 tracking-[0.2em]">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-emerald-400">{stat.val}</span>
                    <span className="text-[9px] text-slate-600 font-bold uppercase">{stat.unit}</span>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PMPApp />);