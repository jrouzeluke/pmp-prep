const { useState, useEffect } = React;

const PMPApp = () => {
  // --- STATE MANAGEMENT ---
  const [view, setView] = useState('dashboard');
  const [selectedTask, setSelectedTask] = useState('Manage Conflict');
  const [taskDatabase, setTaskDatabase] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [methodology, setMethodology] = useState('agile'); // Global Methodology Toggle

  // --- DATA TELEMETRY (GITHUB/NETLIFY FETCH) ---
  useEffect(() => {
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

  // --- SAFETY RENDER ---
  if (isLoading) return <div className="hud-font text-white p-20 text-center animate-pulse tracking-[0.5em]">INITIALIZING HUD...</div>;
  
  const currentTaskContent = taskDatabase ? taskDatabase[selectedTask] : null;

  // --- VIEW 1: EXECUTIVE DASHBOARD ---
  if (view === 'dashboard') {
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn">
        <header className="mb-12 flex justify-between items-end">
            <div>
                <h1 className="hud-font text-5xl font-black italic text-white tracking-tighter">PMP MASTERY <span className="text-purple-500">2026</span></h1>
                <p className="text-[10px] text-slate-500 font-bold tracking-[0.4em] uppercase mt-2">Operational HUD // System Ready</p>
            </div>
            <div className="glass-card px-6 py-2 border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-widest">PRO_VERSION</div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { id: 'hub', label: 'Learning Center', color: 'border-purple' },
            { id: 'quiz', label: 'Practice Quizzes', color: 'border-emerald' },
            { id: 'math', label: 'Formula Lab', color: 'border-blue' },
            { id: 'mock', label: 'Full Mock Exam', color: 'border-purple' }
          ].map(btn => (
            <button key={btn.id} onClick={() => btn.id === 'hub' && setView('learning-center')}
                    className={`glass-card p-10 flex flex-col items-center justify-center h-48 group ${btn.color} hover:bg-white/5 transition-all`}>
              <span className="hud-font text-[12px] font-bold text-white text-center group-hover:scale-110 transition-transform uppercase tracking-widest">{btn.label}</span>
            </button>
          ))}
        </div>

        <div className="glass-card p-10 border-t-2 border-emerald-500 bg-emerald-500/5">
            <h3 className="hud-font text-xs text-emerald-400 font-black tracking-widest uppercase mb-6">Performance HUD</h3>
            <div className="grid grid-cols-3 gap-16">
                <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Global Readiness</p><h4 className="hud-font text-4xl text-white">84.2%</h4></div>
                <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Mindset Accuracy</p><h4 className="hud-font text-4xl text-purple-400">92.0%</h4></div>
                <div><p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-2">Agile Pivot Rate</p><h4 className="hud-font text-4xl text-blue-400">78.5%</h4></div>
            </div>
        </div>
      </div>
    );
  }

  // --- VIEW 2: LEARNING CENTER (3-COLUMN TASK LIST) ---
  if (view === 'learning-center') {
    const categories = {
      people: Object.keys(taskDatabase).filter(key => key !== "Process" && key !== "Business"), // Simple filtering logic
      process: ['Execute Value', 'Manage Comms', 'Assess Risk'], // Extend as JSON grows
      business: ['Compliance', 'Deliver Benefits']
    };

    return (
      <div className="max-w-[98%] w-full p-10 animate-fadeIn">
        <header className="flex justify-between items-center mb-10">
          <h2 className="hud-font text-3xl italic text-white">Learning Center</h2>
          <button onClick={() => setView('dashboard')} className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest">// RETURN_TO_HOME</button>
        </header>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(categories).map(([domain, list]) => (
            <div key={domain} className="flex flex-col gap-3">
              <div className={`glass-card p-5 border-t-2 ${domain === 'people' ? 'border-purple-500' : domain === 'process' ? 'border-emerald-500' : 'border-blue-500'} bg-white/[0.02]`}>
                <h3 className="hud-font text-lg text-white opacity-80 uppercase">{domain}</h3>
              </div>
              {list.map(t => (
                <button key={t} onClick={() => { setSelectedTask(t); setView('task-interstitial'); }}
                        className="glass-card p-4 text-[10px] font-bold text-left hover:bg-white/10 uppercase transition-all tracking-tight text-white/70 hover:text-white">
                  {t}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW 3: TASK INTERSTITIAL ---
  if (view === 'task-interstitial') {
    return (
      <div className="max-w-4xl w-full p-20 text-center glass-card animate-fadeIn border-white/5">
        <h2 className="hud-font text-white/40 text-xs mb-4 uppercase tracking-widest">Objective Selected</h2>
        <h1 className="hud-font text-5xl italic text-white mb-16 underline decoration-purple-500/50 underline-offset-8">{selectedTask}</h1>
        <div className="grid grid-cols-2 gap-10">
            <button onClick={() => setView('learning-designed')} className="glass-card p-16 border-cyan-500/30 hover:bg-cyan-500/10 group transition-all">
                <h3 className="hud-font text-2xl text-cyan-400 group-hover:scale-105 transition-all italic uppercase tracking-tighter">Learn</h3>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-[0.3em]">Foundational Theory</p>
            </button>
            <button onClick={() => setView('practice-selection')} className="glass-card p-16 border-purple-500/30 hover:bg-purple-500/10 group transition-all">
                <h3 className="hud-font text-2xl text-purple-400 group-hover:scale-105 transition-all italic uppercase tracking-tighter">Practice</h3>
                <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-[0.3em]">Tactical Operation</p>
            </button>
        </div>
        <button onClick={() => setView('learning-center')} className="mt-12 text-[10px] text-slate-600 uppercase font-black tracking-widest hover:text-white transition-colors">Abort Selection</button>
      </div>
    );
  }

  // --- VIEW 4: LEARN (FOUNDATIONAL) ---
  if (view === 'learning-designed' && currentTaskContent) {
    return (
      <div className="max-w-6xl w-full p-12 glass-card animate-fadeIn">
        <header className="flex justify-between items-center mb-12 border-b border-white/5 pb-6">
          <button onClick={() => setView('task-interstitial')} className="text-cyan-400 text-[10px] font-black uppercase tracking-widest">// BACK</button>
          <h1 className="hud-font text-4xl font-black italic text-white uppercase">{selectedTask}</h1>
          <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.4em]">Theory Layer</div>
        </header>
        <div className="grid grid-cols-2 gap-8 mb-16">
           <div className="glass-card p-8 border-l-2 border-cyan-500 bg-cyan-500/5">
              <h4 className="hud-font text-[10px] text-cyan-400 mb-4 tracking-widest uppercase">01. Definition</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTaskContent.learn.definition}</p>
           </div>
           <div className="glass-card p-8 border-l-2 border-white/10 bg-white/[0.02]">
              <h4 className="hud-font text-[10px] text-white/40 mb-4 tracking-widest uppercase">02. Context</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTaskContent.learn.context}</p>
           </div>
           <div className="glass-card p-8 border-l-2 border-white/10 bg-white/[0.02]">
              <h4 className="hud-font text-[10px] text-white/40 mb-4 tracking-widest uppercase">03. Path</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTaskContent.learn.path}</p>
           </div>
           <div className="glass-card p-8 border-l-2 border-cyan-500 bg-cyan-500/5">
              <h4 className="hud-font text-[10px] text-cyan-400 mb-4 tracking-widest uppercase">04. Boundary</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{currentTaskContent.learn.boundary}</p>
           </div>
        </div>
        <button onClick={() => setView('practice-selection')} className="w-full glass-card border-cyan-500/50 py-5 hud-font text-[12px] text-cyan-400 hover:bg-cyan-500/10 tracking-[0.6em] uppercase transition-all">
           Transition to Tactical Practice
        </button>
      </div>
    );
  }

  // --- VIEW 5: PRACTICE SELECTION ---
  if (view === 'practice-selection') {
    return (
      <div className="max-w-5xl w-full p-16 animate-fadeIn text-center glass-card border-purple-500/30">
        <header className="mb-12">
            <button onClick={() => setView('task-interstitial')} className="text-purple-400 text-[10px] font-black tracking-widest uppercase mb-4 block hover:text-white transition-all">// BACK</button>
            <h1 className="hud-font text-4xl italic text-white uppercase">{selectedTask}: Practice</h1>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button onClick={() => setView('simulation')} className="glass-card p-12 border-emerald-500/30 hover:bg-emerald-500/10 group text-left transition-all">
                <h3 className="hud-font text-xl text-emerald-400 mb-4 italic uppercase tracking-tighter">01. Tactical Blueprint</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed uppercase font-bold tracking-tight">Interactive diagnostic HUD for Waterfall & Agile workflows.</p>
            </button>
            <button onClick={() => setView('decision-lab')} className="glass-card p-12 border-purple-500/30 hover:bg-purple-500/10 group text-left transition-all">
                <h3 className="hud-font text-xl text-purple-400 mb-4 italic uppercase tracking-tighter">02. Decision Lab</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed uppercase font-bold tracking-tight">Scenario-based stress test with real-time consequences.</p>
            </button>
        </div>
      </div>
    );
  }

  // --- VIEW 6: SIMULATION (TACTICAL BLUEPRINT HUD) ---
  if (view === 'simulation' && currentTaskContent) {
    return (
      <div className="max-w-6xl w-full p-12 animate-fadeIn relative">
        <header className="flex justify-between items-center mb-10">
            <button onClick={() => setView('practice-selection')} className="text-purple-400 text-[10px] font-black tracking-widest uppercase">// BACK</button>
            <div className="text-center">
                <h1 className="hud-font text-4xl font-black italic text-white uppercase tracking-tighter">Tactical Blueprint</h1>
                <div className="mt-4 flex gap-4 justify-center">
                    <button onClick={() => setMethodology('predictive')} className={`text-[9px] font-black px-4 py-1 rounded border transition-all tracking-widest ${methodology === 'predictive' ? 'bg-purple-500 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-white/10 text-slate-500 hover:text-white'}`}>WATERFALL</button>
                    <button onClick={() => setMethodology('agile')} className={`text-[9px] font-black px-4 py-1 rounded border transition-all tracking-widest ${methodology === 'agile' ? 'bg-cyan-500 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'border-white/10 text-slate-500 hover:text-white'}`}>AGILE/HYBRID</button>
                </div>
            </div>
            <span className="hud-font text-[10px] text-purple-400 font-bold uppercase tracking-widest">Active Scan</span>
        </header>

        <div className="grid grid-cols-2 gap-8 mb-10">
          {/* 01. MINDSET */}
          <div className="glass-card p-8 border-l-4 border-purple-500 bg-purple-500/5">
            <h4 className="hud-font text-[10px] text-purple-500 mb-4 tracking-widest uppercase">01. {methodology.toUpperCase()} MINDSET</h4>
            <p className="text-slate-300 text-sm italic leading-relaxed">
                {methodology === 'agile' ? currentTaskContent.practice.agile_mindset : currentTaskContent.practice.predictive_mindset}
            </p>
          </div>

          {/* 02. CHECKLIST */}
          <div className="glass-card p-8 border-l-4 border-emerald-500 bg-emerald-500/5">
            <h4 className="hud-font text-[10px] text-emerald-500 mb-4 tracking-widest uppercase">02. TACTICAL CHECKLIST</h4>
            <div className="space-y-3">
                {currentTaskContent.practice.checklist.map(item => (
                    <div key={item} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-sm"></div>
                        <span className="text-[10px] text-slate-400 uppercase font-black tracking-tight">{item}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* 03. FILTERS */}
          <div className="glass-card p-8 border-l-4 border-rose-500 bg-rose-500/5">
            <h4 className="hud-font text-[10px] text-rose-500 mb-4 tracking-widest uppercase">03. PRECISION FILTERS</h4>
            <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest leading-loose">{currentTaskContent.practice.traps}</p>
          </div>

          {/* 04. ARTIFACTS */}
          <div className="glass-card p-8 border-l-4 border-blue-500 bg-blue-500/5">
            <h4 className="hud-font text-[10px] text-blue-500 mb-4 tracking-widest uppercase">04. ARTIFACTS</h4>
            <p className="text-slate-300 text-[10px] font-mono uppercase tracking-widest">{currentTaskContent.practice.artifacts}</p>
          </div>
        </div>

        <button onClick={() => setView('decision-lab')} className="w-full bg-purple-600 border border-purple-400 py-6 rounded-2xl hud-font text-[14px] font-black uppercase tracking-[0.6em] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition-all">
           Initialize Decision Lab
        </button>
      </div>
    );
  }

  // --- VIEW 7: DECISION LAB ---
  if (view === 'decision-lab') {
    return (
      <div className="max-w-4xl w-full p-20 glass-card animate-fadeIn text-center border-rose-500/20">
         <h1 className="hud-font text-3xl italic text-purple-400 mb-6 uppercase tracking-tighter">Decision Lab</h1>
         <p className="text-slate-300 text-sm mb-12 uppercase font-bold tracking-[0.3em]">Dynamic Scenario Logic Syncing with taskData.json...</p>
         <button onClick={() => setView('simulation')} className="text-[10px] text-slate-500 uppercase font-black hover:text-white transition-all tracking-widest">// REBOOT SIMULATION</button>
      </div>
    );
  }
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PMPApp />);