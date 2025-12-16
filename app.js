const { useState, useEffect } = React;

const Icon = ({ name, className }) => {
  useEffect(() => { if (window.lucide) window.lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPApp = () => {
  const [view, setView] = useState('dashboard'); 
  const [branchData, setBranchData] = useState(null);
  const [activeModule, setActiveModule] = useState(null); 
  const [isFlipped, setIsFlipped] = useState(false);

  const launchBranch = async (branchName) => {
    try {
      const response = await fetch(`./data/${branchName}.json`);
      if (!response.ok) throw new Error("Path Fail");
      const data = await response.json();
      setBranchData(data);
      setView('branch-menu');
    } catch (err) {
      alert("System Offline: Ensure data/" + branchName + ".json exists.");
    }
  };

  // --- DASHBOARD (Tactical Cockpit) ---
  if (view === 'dashboard') {
    return (
      <div className="p-12 max-w-7xl mx-auto animate-fadeIn">
        <header className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
            <span className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase">System Ready // Cockpit v5.2</span>
          </div>
          <h1 className="text-6xl font-black italic">PMP Cockpit</h1>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <button onClick={() => launchBranch('initiating')} 
                  className="glass accent-initiating glow-initiating p-12 text-left group">
            <div className="flex justify-between items-start mb-8">
              <Icon name="anchor" className="text-purple-500 w-10 h-10 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-slate-600 tracking-widest uppercase text-right">0% COMPLETED<br/>BRANCH_ID: 001</span>
            </div>
            <h3 className="text-4xl font-black italic text-white uppercase tracking-tighter">Initiating</h3>
            <p className="text-slate-400 mt-2 font-light italic leading-relaxed">Establish foundational authority and secure the project mandate.</p>
            <div className="mt-10 h-[2px] w-full bg-slate-900 overflow-hidden">
                <div className="h-full bg-purple-500 w-0 group-hover:w-full transition-all duration-1000"></div>
            </div>
          </button>
          
          <div className="glass p-12 opacity-20 border-dashed border-white/5 flex flex-col items-center justify-center text-slate-700">
            <Icon name="lock" className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-black uppercase italic tracking-widest">Planning</h3>
          </div>
        </div>
      </div>
    );
  }

  // --- BRANCH MENU (The Interactive Hub) ---
  if (view === 'branch-menu' && !activeModule) {
    return (
      <div className="p-12 max-w-6xl mx-auto animate-fadeIn">
        <button onClick={() => setView('dashboard')} className="text-slate-600 mb-12 uppercase text-[10px] font-black tracking-[0.3em] hover:text-white transition-colors">
          // TERMINATE_SESSION
        </button>
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="lg:w-1/3">
                <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter mb-4">{branchData.title}</h2>
                <p className="text-slate-400 italic text-lg leading-relaxed border-l-2 border-purple-500/30 pl-6">"{branchData.description}"</p>
            </div>
            
            <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {[
                { id: 'sim', label: 'Decision Lab', icon: 'play', color: 'text-purple-500' },
                { id: 'audit', label: 'Surgical Lab', icon: 'search', color: 'text-emerald-500' },
                { id: 'flash', label: 'Reflex Drill', icon: 'layers', color: 'text-rose-500' }
              ].map((mod) => (
                <button key={mod.id} onClick={() => setActiveModule(mod.id)} 
                        className="glass p-8 flex justify-between items-center hover:bg-white/[0.02]">
                  <span className="font-black text-white uppercase tracking-widest text-xs tracking-[0.2em]">{mod.label}</span>
                  <Icon name={mod.icon} className={`${mod.color} w-5 h-5`} />
                </button>
              ))}
            </div>
        </div>
      </div>
    );
  }

  // --- FLASHCARD MODULE ---
  if (activeModule === 'flash') {
    const card = branchData.modules.flashcards[0];
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-screen animate-fadeIn">
        <button onClick={() => setActiveModule(null)} className="text-slate-500 mb-10 text-[10px] font-black tracking-widest hover:text-white transition-colors uppercase">// EXIT_DRILL</button>
        <div onClick={() => setIsFlipped(!isFlipped)} className="w-full max-w-md h-96 perspective-1000 cursor-pointer">
          <div className={`relative w-full h-full transition-transform duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute w-full h-full backface-hidden glass flex flex-col items-center justify-center p-12 border-white/10">
              <span className="text-rose-500 font-black uppercase text-[10px] mb-8 tracking-[0.3em]">REFLEX_QUERY</span>
              <p className="text-3xl font-bold text-white italic text-center">"{card.front}"</p>
            </div>
            <div className="absolute w-full h-full backface-hidden glass flex flex-col items-center justify-center p-12 rotate-y-180 bg-rose-500/[0.03] border-rose-500/20">
              <span className="text-rose-400 font-black uppercase text-[10px] mb-8 tracking-[0.3em]">VETERAN_RESPONSE</span>
              <p className="text-3xl font-bold text-white italic text-center">"{card.back}"</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PMPApp />);