const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [pmpData, setPmpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studyTab, setStudyTab] = useState('people');
  const [expandedTask, setExpandedTask] = useState(null);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const [simIndex, setSimIndex] = useState(0);
  const [simResult, setSimResult] = useState(null);

  useEffect(() => {
    fetch('./pmp-data.json')
      .then(res => res.json())
      .then(data => { setPmpData(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  if (loading) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-indigo-400 font-black animate-pulse">LOADING SURGICAL ENGINE...</div>;
  if (!pmpData) return <div className="text-white p-10">Error: pmp-data.json not found.</div>;

  // --- DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-12 bg-[#0b0f1a] relative overflow-hidden flex flex-col items-center">
        <div className="max-w-6xl w-full relative z-10">
          <header className="flex justify-between items-center mb-20">
            <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-tighter">PMP Mastery 2026</h1>
            <div className="glass px-6 py-2 text-emerald-400 font-black text-[10px] uppercase border-emerald-500/20">16-Year Veteran Mode</div>
          </header>
          <div className="grid md:grid-cols-3 gap-8">
            <button onClick={() => setCurrentMode('studyhub')} className="glass p-16 flex flex-col items-center group">
              <LucideIcon name="book-open" className="w-12 h-12 mb-6 text-indigo-400" />
              <h2 className="text-2xl font-black uppercase italic">Study Hub</h2>
            </button>
            <button onClick={() => setCurrentMode('formulas')} className="glass p-16 flex flex-col items-center group">
              <LucideIcon name="calculator" className="w-12 h-12 mb-6 text-emerald-400" />
              <h2 className="text-2xl font-black uppercase italic">Formula Lab</h2>
            </button>
            <button onClick={() => setCurrentMode('quiz')} className="glass p-16 flex flex-col items-center group opacity-50">
              <LucideIcon name="zap" className="w-12 h-12 mb-6 text-rose-400" />
              <h2 className="text-2xl font-black uppercase italic">Exam Mock</h2>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-12 bg-[#0b0f1a] flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><LucideIcon name="arrow-left" className="w-4 h-4"/> Back</button>
          <div className="flex glass p-2 mb-10 border-white/5">
            {['people', 'process', 'business'].map(domain => (
              <button key={domain} onClick={() => setStudyTab(domain)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === domain ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>{domain}</button>
            ))}
          </div>
          <div className="space-y-4">
            {pmpData.tasks[studyTab].map(task => (
              <div key={task.id} className="glass p-8 border-white/5">
                <div onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)} className="flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-6">
                    <span className="text-indigo-400 font-black">{task.id}</span>
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">{task.title}</h3>
                  </div>
                  <LucideIcon name={expandedTask === task.id ? "chevron-up" : "chevron-down"} className="text-slate-600" />
                </div>
                {expandedTask === task.id && (
                  <div className="mt-8 pt-8 border-t border-white/5 space-y-6 animate-fadeIn">
                    <p className="text-slate-300 text-sm leading-relaxed">{task.deepDive}</p>
                    <div className="bg-emerald-900/10 p-6 rounded-2xl border border-emerald-500/20 italic text-emerald-400 text-xs">
                      <span className="font-black uppercase block mb-2 text-[9px] non-italic tracking-widest">Veteran Pro-Tip:</span>
                      {task.veteranTip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULA LAB ---
  if (currentMode === 'formulas') {
    const f = pmpData.formulas[simIndex % pmpData.formulas.length];
    return (
      <div className="min-h-screen p-12 bg-[#0b0f1a] flex flex-col items-center">
        <div className="max-w-3xl w-full">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 mb-10 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><LucideIcon name="arrow-left" className="w-4 h-4"/> Back</button>
          <div className="glass p-12 border-emerald-500/20 text-center">
            <h2 className="text-4xl font-black italic text-emerald-400 uppercase tracking-tighter mb-4">{f.name}</h2>
            <p className="text-slate-300 italic mb-10 leading-relaxed">"{f.scenario}"</p>
            {!simResult ? (
              <button onClick={() => setSimResult(true)} className="bg-emerald-600 px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-xl">Calculate Result</button>
            ) : (
              <div className="animate-fadeIn space-y-6 text-left">
                <div className="bg-white/5 p-6 rounded-xl font-mono text-indigo-400">Result: {f.correctAnswer}</div>
                <div className="p-6 bg-emerald-950/20 rounded-xl border border-emerald-500/20 italic text-slate-300 text-xs">{f.veteranInsight}</div>
                <button onClick={() => {setSimIndex(simIndex + 1); setSimResult(false);}} className="text-[10px] uppercase font-black text-indigo-400 underline">Try Next Formula</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));