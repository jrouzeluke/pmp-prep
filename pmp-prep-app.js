const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [pmpData, setPmpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [studyTab, setStudyTab] = useState('people');
  const [expandedTask, setExpandedTask] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [examTime, setExamTime] = useState(13800);

  useEffect(() => {
    fetch('./pmp-data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: File not found.`);
        return res.json();
      })
      .then(data => { setPmpData(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  useEffect(() => {
    let timer;
    if (currentMode === 'mock') {
      timer = setInterval(() => setExamTime(prev => (prev > 0 ? prev - 1 : 0)), 1000);
    }
    return () => clearInterval(timer);
  }, [currentMode]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h}:${m < 10 ? '0' : ''}${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  if (loading) return <div className="h-screen bg-[#05070a] flex items-center justify-center text-indigo-400 font-black tracking-widest animate-pulse">SYNCING COMMAND CENTER...</div>;
  if (error) return <div className="h-screen bg-[#05070a] flex flex-col items-center justify-center p-10"><div className="glass p-10 border-rose-500/30 text-center"><h2 className="text-rose-500 font-black mb-4">DATA SYNC FAILED</h2><p className="text-slate-400 font-mono text-xs">{error}</p><button onClick={() => window.location.reload()} className="mt-6 text-indigo-400 underline">RETRY</button></div></div>;

  // --- DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-10 animate-fadeIn">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">PMP Mastery 5.2</h1>
            <p className="text-indigo-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">16-Year Veteran Edition</p>
          </div>
          <div className="glass px-6 py-3 rounded-full border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> CLOUD CONNECTED
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'studyhub', icon: 'book-open', label: 'Study Hub', color: 'indigo', sub: '35 ECO Tasks' },
            { id: 'quiz', icon: 'zap', label: 'Quizzes & Sims', color: 'purple', sub: 'Mindset Drills' },
            { id: 'formulas', icon: 'calculator', label: 'Formula Lab', color: 'emerald', sub: 'EVM Math' },
            { id: 'mock', icon: 'award', label: 'Full Mock Exam', color: 'rose', sub: '180 Questions' }
          ].map(m => (
            <button key={m.id} onClick={() => setCurrentMode(m.id)} className={`glass p-10 flex flex-col items-center group border-${m.color}-500/10`}>
              <LucideIcon name={m.icon} className={`w-8 h-8 text-${m.color}-400 mb-4 group-hover:scale-110 transition-transform`}/>
              <h3 className="text-xl font-black italic uppercase">{m.label}</h3>
              <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">{m.sub}</p>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass p-10 lg:col-span-2 min-h-[350px] flex flex-col justify-between border-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Readiness Baseline</h4>
            <div className="flex items-end gap-2 h-40">
              {[30, 60, 40, 85, 55, 75, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-xl" style={{height: `${h}%`}}></div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 font-black uppercase italic mt-4">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="glass p-8 flex-1 border-emerald-500/10"><p className="text-[10px] font-black text-slate-500 uppercase">Accuracy</p><p className="text-5xl font-black text-emerald-400 italic mt-2">92%</p></div>
            <div className="glass p-8 flex-1 border-indigo-500/10"><p className="text-[10px] font-black text-slate-500 uppercase">Tasks Mastery</p><p className="text-5xl font-black text-indigo-400 italic mt-2">28/35</p></div>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-6 md:p-12 bg-[#05070a] flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:text-white transition-colors">
            <LucideIcon name="arrow-left" className="w-4 h-4"/> Dashboard
          </button>
          <div className="flex glass p-1 mb-10 gap-1">
            {['people', 'process', 'business'].map(d => (
              <button key={d} onClick={() => setStudyTab(d)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === d ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500'}`}>{d}</button>
            ))}
          </div>
          <div className="space-y-4">
            {pmpData.tasks[studyTab].map(t => (
              <div key={t.id} className="glass p-8 border-white/5">
                <div onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)} className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">{t.id}: {t.title}</h3>
                  <LucideIcon name={expandedTask === t.id ? "minus" : "plus"} />
                </div>
                {expandedTask === t.id && (
                  <div className="mt-8 space-y-6 animate-fadeIn">
                    <p className="text-slate-400 text-sm leading-relaxed italic">"{t.deepDive}"</p>
                    <div className="bg-emerald-500/5 p-6 rounded-2xl border border-emerald-500/20 text-emerald-400 text-xs font-bold leading-relaxed italic">Veteran Insight: {t.veteranTip}</div>
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
      <div className="min-h-screen p-6 md:p-12 bg-[#05070a] flex flex-col items-center">
        <div className="max-w-3xl w-full">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all hover:text-white"><LucideIcon name="arrow-left" className="w-4 h-4"/> Back</button>
          <div className="glass p-12 border-emerald-500/20 text-center">
            <h2 className="text-4xl font-black italic text-emerald-400 uppercase tracking-tighter mb-4">{f.name}</h2>
            <p className="text-lg text-slate-300 italic mb-10 leading-relaxed border-l-2 border-indigo-500/30 pl-6">"{f.scenario}"</p>
            {!simResult ? (
              <button onClick={() => setSimResult(true)} className="bg-emerald-600 px-10 py-5 rounded-xl font-black uppercase text-xs tracking-widest">Execute Analysis</button>
            ) : (
              <div className="animate-fadeIn space-y-6 text-left">
                <div className="p-6 bg-black/30 rounded-xl font-mono text-indigo-400 text-lg">Result: {f.correctAnswer}</div>
                <div className="p-6 bg-emerald-950/20 rounded-xl border border-emerald-500/20 italic text-slate-300 text-xs">{f.veteranInsight}</div>
                <button onClick={() => {setSimIndex(simIndex + 1); setSimResult(false);}} className="text-[10px] uppercase font-black text-indigo-400 underline tracking-widest">Next Math Drill</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- MOCK EXAM ---
  if (currentMode === 'mock') {
    return (
      <div className="min-h-screen bg-[#05070a] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="glass p-6 flex justify-between items-center border-rose-500/20">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 hover:text-white transition-colors"><LucideIcon name="x" className="w-6 h-6"/></button>
            <div className="text-2xl font-black font-mono text-white tracking-widest">{formatTime(examTime)}</div>
            <button className="bg-rose-600 px-8 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest">Submit Exam</button>
          </header>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3 glass p-12 min-h-[500px] flex flex-col justify-between">
              <div><span className="text-indigo-400 font-black text-xs uppercase tracking-[0.3em]">Question 1 of 180</span><p className="text-2xl font-bold italic text-slate-200 mt-10 mb-10 leading-tight">"{pmpData.mockExam[0].question}"</p><div className="space-y-3">{pmpData.mockExam[0].options.map((opt, i) => (<button key={i} className="w-full text-left p-6 rounded-xl border border-white/5 hover:border-indigo-500/50 hover:bg-white/5 transition-all text-sm font-medium">{opt}</button>))}</div></div>
            </div>
            <div className="glass p-8 h-fit">
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">Navigator</h4>
              <div className="grid grid-cols-5 gap-2">{[...Array(20)].map((_, i) => (<div key={i} className="h-8 flex items-center justify-center rounded text-[10px] font-bold border border-white/10 text-slate-600">{i + 1}</div>))}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));