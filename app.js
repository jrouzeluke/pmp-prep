const { useState, useEffect } = React;

const PMPApp = () => {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState('Manage Conflict');
  const [taskDatabase, setTaskDatabase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NETLIFY DATA STREAM ---
  useEffect(() => {
    // Fetches the consolidated JSON from your GitHub/Netlify data folder
    fetch('./data/taskData.json')
      .then(res => {
        if (!res.ok) throw new Error("Telemetry Link Offline");
        return res.json();
      })
      .then(data => {
        setTaskDatabase(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Critical System Error:", err);
        setIsLoading(false);
      });
  }, []);

  // --- LOADING / ERROR SAFETY RENDER ---
  if (isLoading) return <div className="hud-font text-white p-20 text-center animate-pulse">Initializing Data Stream...</div>;
  
  // Helper to safely get task content
  const currentTask = taskDatabase ? taskDatabase[selectedTask] : null;

  // --- VIEW 1: EXECUTIVE DASHBOARD ---
  if (view === 'dashboard') {
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <h1 className="hud-font text-5xl font-black italic text-white">PMP MASTERY <span className="text-purple-500">2026</span></h1>
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase mt-2">Operational HUD // System Ready</p>
            </div>
            <div className="glass-card px-6 py-2 border-rose-500/20 text-rose-500 text-[10px] font-black tracking-widest uppercase">16 DAY STREAK</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { id: 'hub', label: 'Learning Center', color: 'border-purple' },
            { id: 'quiz', label: 'Practice Quizzes', color: 'border-emerald' },
            { id: 'math', label: 'Formula Lab', color: 'border-blue' },
            { id: 'mock', label: 'Full Mock Exam', color: 'border-purple' }
          ].map(btn => (
            <button key={btn.id} onClick={() => btn.id === 'hub' && setView('learning-center')}
                    className={`glass-card p-10 flex flex-col items-center justify-center h-48 group ${btn.color} hover:bg-white/5`}>
              <span className="hud-font text-[12px] font-bold text-white text-center">{btn.label}</span>
            </button>
          ))}
        </div>

        <div className="glass-card p-10 border-t-2 border-emerald-500 bg-emerald-500/5">
            <h3 className="hud-font text-xs text-emerald-400 font-black tracking-widest uppercase mb-6">Diagnostic Performance Dashboard</h3>
            <div className="grid grid-cols-3 gap-16">
                <div><p className="text-[9px] text-slate-500 font-bold uppercase mb-2">Global Readiness</p><h4 className="hud-font text-4xl text-white">84.2%</h4></div>
                <div><p className="text-[9px] text-slate-500 font-bold uppercase mb-2">Mindset Accuracy</p><h4 className="hud-font text-4xl text-purple-400">92.0%</h4></div>
                <div><p className="text-[9px] text-slate-500 font-bold uppercase mb-2">Agile Pivot Rate</p><h4 className="hud-font text-4xl text-blue-400">78.5%</h4></div>
            </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: LEARNING CENTER (3-COLUMN TASK LIST) ---
  if (view === 'learning-center') {
    return (
      <div className="max-w-[98%] w-full p-10">
        <header className="flex justify-between items-center mb-10">
          <h2 className="hud-font text-3xl italic text-white">Learning Center</h2>
          <button onClick={() => setView('dashboard')} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">// RETURN_TO_HOME</button>
        </header>
        <div className="grid grid-cols-3 gap-6">
          {['people', 'process', 'business'].map(domain => (
            <div key={domain} className="flex flex-col gap-3">
              <div className="glass-card p-5 border-t-2 border-purple-500 bg-white/[0.02]">
                <h3 className="hud-font text-lg text-white opacity-80 uppercase">{domain}</h3>
              </div>
              {/* This is where tasks populate from your selection logic */}
              <button onClick={() => { setSelectedTask('Manage Conflict'); setView('task-interstitial'); }}
                      className="glass-card p-4 text-[10px] font-bold text-left hover:bg-white/10 uppercase text-white/70">
                Manage Conflict
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 3: LEARN (FOUNDATIONAL DEEP DIVE) ---
  if (view === 'learning-designed' && currentTask) {
    return (
      <div className="max-w-6xl w-full p-12 glass-card animate-fadeIn">
        <header className="flex justify-between items-center mb-12">
          <button onClick={() => setView('task-interstitial')} className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">// BACK</button>
          <h1 className="hud-font text-4xl font-black italic text-white uppercase">{selectedTask}</h1>
          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Foundational Tier</div>
        </header>
        <div className="grid grid-cols-2 gap-8 mb-12">
           <div className="glass-card p-8 border-l-2 border-cyan-500 bg-cyan-500/5">
              <h4 className="hud-font text-[10px] text-cyan-400 mb-4 tracking-widest">01. Definition</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTask.learn.definition}</p>
           </div>
           <div className="glass-card p-8 border-l-2 border-white/10">
              <h4 className="hud-font text-[10px] text-white/40 mb-4 tracking-widest">02. Context</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTask.learn.context}</p>
           </div>
           <div className="glass-card p-8 border-l-2 border-white/10">
              <h4 className="hud-font text-[10px] text-white/40 mb-4 tracking-widest">03. Path</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTask.learn.path}</p>
           </div>
           <div className="glass-card p-8 border-l-2 border-cyan-500 bg-cyan-500/5">
              <h4 className="hud-font text-[10px] text-cyan-400 mb-4 tracking-widest">04. Boundary</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTask.learn.boundary}</p>
           </div>
        </div>
        <button onClick={() => setView('practice-selection')} className="w-full glass-card border-cyan-500/50 py-5 hud-font text-[12px] text-cyan-400 hover:bg-cyan-500/10 tracking-[0.5em] uppercase transition-all">
           Launch Operational Intelligence (Practice)
        </button>
      </div>
    );
  }

  // --- (View 4: Task Interstitial, View 5: Practice Selection, View 6: Simulation follow the same pattern) ---
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PMPApp />);