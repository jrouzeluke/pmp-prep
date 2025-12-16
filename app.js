const { useState, useEffect } = React;

// --- Helper: Lucide Icon Component ---
const Icon = ({ name, className }) => {
  useEffect(() => {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPApp = () => {
  const [view, setView] = useState('dashboard'); // dashboard, branch-menu
  const [branchData, setBranchData] = useState(null);
  const [activeModule, setActiveModule] = useState(null); // sim, audit, flash
  const [isFlipped, setIsFlipped] = useState(false);

  // --- Logic: The "Universal Fetcher" ---
  const launchBranch = async (branchName) => {
    try {
      const response = await fetch(`./data/${branchName}.json`);
      if (!response.ok) throw new Error("JSON file not found");
      const data = await response.json();
      setBranchData(data);
      setView('branch-menu');
    } catch (err) {
      console.error(err);
      alert(`System Error: Could not load the ${branchName} data. Ensure the folder name is lowercase 'data'.`);
    }
  };

  // --- VIEW 1: MAIN DASHBOARD ---
  if (view === 'dashboard') {
    return (
      <div className="p-12 max-w-5xl mx-auto animate-fadeIn">
        <header className="mb-16 text-center lg:text-left">
          <h1 className="text-6xl font-black italic text-white uppercase tracking-tighter">PMP Cockpit</h1>
          <p className="text-indigo-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic text-center lg:text-left">16-Year Veteran Simulation Engine</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <button onClick={() => launchBranch('initiating')} className="glass p-12 text-left group border-white/5 hover:border-purple-500/50 transition-all">
            <Icon name="anchor" className="text-purple-500 mb-4" />
            <h3 className="text-3xl font-black italic text-white uppercase tracking-tighter">Initiating</h3>
            <p className="text-slate-500 mt-2">Authority & Stakeholders</p>
          </button>
          
          <button className="glass p-12 text-left opacity-20 cursor-not-allowed border-white/5">
            <h3 className="text-3xl font-black italic text-slate-600 uppercase tracking-tighter">Planning</h3>
            <p className="text-slate-800 mt-2 italic text-xs uppercase font-bold tracking-widest">Locked: Complete Initiating</p>
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 2: BRANCH MENU (The 5-Activity Tree) ---
  if (view === 'branch-menu' && !activeModule) {
    return (
      <div className="p-12 max-w-4xl mx-auto animate-fadeIn">
        <button onClick={() => setView('dashboard')} className="text-slate-500 mb-10 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors">
          ← Back to Cockpit
        </button>
        
        <h2 className="text-4xl font-black text-white italic uppercase mb-2 tracking-tighter">{branchData.title}</h2>
        <p className="text-slate-400 mb-12 italic text-lg leading-relaxed">"{branchData.description}"</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button onClick={() => setActiveModule('sim')} className="glass p-6 flex justify-between items-center hover:border-purple-500 group">
             <span className="font-black text-white uppercase tracking-widest text-xs">🕹️ Decision Lab</span>
             <Icon name="play" className="text-purple-500" />
          </button>

          <button onClick={() => setActiveModule('audit')} className="glass p-6 flex justify-between items-center hover:border-emerald-500 group">
             <span className="font-black text-white uppercase tracking-widest text-xs">🔍 Surgical Lab</span>
             <Icon name="search" className="text-emerald-400" />
          </button>

          <button onClick={() => {setActiveModule('flash'); setIsFlipped(false);}} className="glass p-6 flex justify-between items-center hover:border-rose-500 group md:col-span-2">
             <span className="font-black text-white uppercase tracking-widest text-xs">🗂️ Reflex Drill</span>
             <Icon name="layers" className="text-rose-500" />
          </button>
        </div>
      </div>
    );
  }

  // --- VIEW 3: DECISION LAB (Simulation) ---
  if (activeModule === 'sim') {
    return (
      <div className="p-12 max-w-5xl mx-auto animate-slideUp">
        <button onClick={() => setActiveModule(null)} className="text-slate-500 mb-6 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors">← Back to Menu</button>
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
          <img src="./assets/sim-background.png" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity" />
          <div className="relative z-10 p-12 bg-gradient-to-b from-[#05070a]/40 to-[#05070a]/95">
            <h2 className="text-3xl font-black italic text-white uppercase mb-8 tracking-tighter">{branchData.modules.simulation.title}</h2>
            <p className="text-slate-200 mb-12 text-2xl italic font-light leading-relaxed">"{branchData.modules.simulation.scenario}"</p>
            <div className="grid grid-cols-1 gap-4 max-w-2xl">
               <button onClick={() => alert("VETERAN LOGIC: " + branchData.modules.simulation.logic)} 
                       className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/50 text-left transition-all">
                  <span className="text-emerald-400 font-black mr-4 text-xs uppercase tracking-tighter">Correct Action</span>
                  <span className="text-sm text-slate-300 block mt-1 leading-relaxed">Book a 1-on-1 to demonstrate specific project value to them.</span>
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 4: REFLEX DRILL (Flashcards) ---
  if (activeModule === 'flash') {
    const card = branchData.modules.flashcards[0];
    return (
      <div className="p-12 max-w-xl mx-auto animate-fadeIn flex flex-col items-center justify-center min-h-[70vh]">
        <button onClick={() => setActiveModule(null)} className="text-slate-500 mb-10 uppercase text-[10px] font-black tracking-widest hover:text-white transition-colors">← Back to Menu</button>
        <div onClick={() => setIsFlipped(!isFlipped)} className="w-full h-80 perspective-1000 cursor-pointer group">
          <div className={`relative w-full h-full text-center transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            <div className="absolute w-full h-full backface-hidden glass flex flex-col items-center justify-center p-10 border-white/10">
              <span className="text-rose-500 font-black uppercase text-[10px] mb-4 tracking-[0.2em]">Reflex Question</span>
              <p className="text-2xl font-bold text-white italic">"{card.front}"</p>
            </div>
            <div className="absolute w-full h-full backface-hidden glass flex flex-col items-center justify-center p-10 border-rose-500/30 rotate-y-180 bg-rose-500/[0.03]">
              <span className="text-rose-400 font-black uppercase text-[10px] mb-4 tracking-[0.2em]">Veteran Answer</span>
              <p className="text-2xl font-bold text-white italic">"{card.back}"</p>
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