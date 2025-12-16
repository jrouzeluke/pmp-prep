const { useState, useEffect } = React;

// --- ICON COMPONENT ---
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
  const [simResult, setSimResult] = useState(null);
  const [examTime, setExamTime] = useState(13800); // 230 Minutes

  // --- DATA FETCH ENGINE ---
  useEffect(() => {
    fetch('./pmp-data.json')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: Check if pmp-data.json is in the root.`);
        return res.json();
      })
      .then(data => {
        setPmpData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- EXAM TIMER LOGIC ---
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

  // --- RENDER: STATES ---
  if (loading) return <div className="h-screen bg-[#05070a] flex items-center justify-center text-indigo-400 font-black animate-pulse uppercase tracking-widest">Syncing Command Center...</div>;

  if (error) return (
    <div className="h-screen bg-[#05070a] flex flex-col items-center justify-center p-10">
      <div className="glass p-10 border-rose-500/30 text-center">
        <h2 className="text-rose-500 font-black mb-4 uppercase italic">Data Sync Failure</h2>
        <p className="text-slate-400 font-mono text-xs mb-8">{error}</p>
        <button onClick={() => window.location.reload()} className="text-indigo-400 underline font-black uppercase text-[10px]">Restart Sync</button>
      </div>
    </div>
  );

  // --- VIEW: DASHBOARD (COCKPIT) ---
  if (currentMode === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-10 animate-fadeIn">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">PMP Mastery 5.2</h1>
            <p className="text-indigo-500 font-bold uppercase tracking-[0.4em] text-[10px] mt-2">Professional Veteran Edition</p>
          </div>
          <div className="glass px-6 py-3 rounded-full border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Cockpit Live
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { id: 'studyhub', icon: 'book-open', label: 'Study Hub', color: 'indigo' },
            { id: 'quiz', icon: 'zap', label: 'Quizzes', color: 'purple' },
            { id: 'formulas', icon: 'calculator', label: 'Formula Lab', color: 'emerald' },
            { id: 'mock', icon: 'award', label: 'Mock Exam', color: 'rose' }
          ].map(m => (
            <button key={m.id} onClick={() => setCurrentMode(m.id)} className="glass p-10 flex flex-col items-center group">
              <LucideIcon name={m.icon} className={`w-8 h-8 text-${m.color}-400 mb-4 group-hover:scale-110 transition-transform`}/>
              <h3 className="text-xl font-black italic uppercase">{m.label}</h3>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW: STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-6 md:p-12 bg-[#05070a] flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 mb-10 flex items-center gap-2 font-black uppercase text-[10px] tracking-widest hover:text-white">
            <LucideIcon name="arrow-left" className="w-4 h-4"/> Return to Cockpit
          </button>
          
          <div className="flex glass p-1 mb-10 gap-1 rounded-2xl">
            {['people', 'process', 'business'].map(d => (
              <button key={d} onClick={() => {setStudyTab(d); setExpandedTask(null);}} 
                className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === d ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>
                {d}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {(pmpData.tasks[studyTab] || []).map(t => (
              <div key={t.id} className="glass p-8 border-white/5 rounded-[2.5rem]">
                <div onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)} className="flex justify-between items-center cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <span className="text-indigo-400 font-black bg-indigo-500/10 w-10 h-10 rounded-xl flex items-center justify-center border border-indigo-500/20">{t.id}</span>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter group-hover:text-white transition-colors">{t.title}</h3>
                  </div>
                  <LucideIcon name={expandedTask === t.id ? "minus" : "plus"} className="text-slate-600" />
                </div>
                
                {expandedTask === t.id && (
                  <div className="mt-8 space-y-8 animate-fadeIn">
                    <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-indigo-500/30 pl-6">"{t.deepDive}"</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-indigo-400 mb-4 tracking-widest border-b border-indigo-500/10 pb-2">Enablers</h4>
                            <ul className="space-y-3">
                                {(t.enablers || []).map((item, i) => (
                                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 leading-tight">
                                        <span className="text-indigo-500 font-black mt-1">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-purple-400 mb-4 tracking-widest border-b border-purple-500/10 pb-2">Deliverables</h4>
                            <ul className="space-y-3">
                                {(t.deliverables || []).map((item, i) => (
                                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 leading-tight">
                                        <span className="text-purple-500 font-black mt-1">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-black uppercase text-emerald-400 mb-4 tracking-widest border-b border-emerald-500/10 pb-2">Tools</h4>
                            <ul className="space-y-3">
                                {(t.tools || []).map((item, i) => (
                                    <li key={i} className="text-[11px] text-slate-400 flex items-start gap-2 leading-tight">
                                        <span className="text-emerald-500 font-black mt-1">›</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-emerald-500/5 p-6 rounded-3xl border border-emerald-500/10 text-emerald-400 text-xs font-bold leading-relaxed italic">
                        <span className="block text-[8px] uppercase tracking-widest text-emerald-600 mb-2">Veteran Insight (Diagnostic)</span>
                        {t.veteranTip}
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

  // --- VIEW: MOCK EXAM ---
  if (currentMode === 'mock') {
    return (
      <div className="min-h-screen bg-[#05070a] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="glass p-6 flex justify-between items-center border-rose-500/20">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 hover:text-white"><LucideIcon name="x" className="w-6 h-6"/></button>
            <div className="text-2xl font-black font-mono text-white tracking-widest">{formatTime(examTime)}</div>
            <button className="bg-rose-600 px-8 py-2 rounded-lg font-black text-[10px] uppercase">Submit Exam</button>
          </header>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3 glass p-12 min-h-[500px]">
              <span className="text-indigo-400 font-black text-xs uppercase tracking-widest">Question 1 of 180</span>
              <p className="text-2xl font-bold italic text-slate-200 mt-10 mb-10 leading-tight">"{pmpData.mockExam[0].question}"</p>
              <div className="space-y-3">
                {pmpData.mockExam[0].options.map((opt, i) => (
                  <button key={i} className="w-full text-left p-6 rounded-xl border border-white/5 hover:border-indigo-500/50 hover:bg-white/5 transition-all text-sm">{opt}</button>
                ))}
              </div>
            </div>
            <div className="glass p-8 h-fit">
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest text-center italic">Navigator</h4>
              <div className="grid grid-cols-5 gap-2 text-center italic">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="h-8 flex items-center justify-center rounded text-[10px] font-bold border border-white/10 text-slate-600">{i + 1}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));