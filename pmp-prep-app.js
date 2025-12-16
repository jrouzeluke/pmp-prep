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
  const [simIndex, setSimIndex] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [examTime, setExamTime] = useState(13800); // 230 Min
  const [flagged, setFlagged] = useState([]);

  useEffect(() => {
    fetch('./pmp-data.json')
      .then(res => res.json())
      .then(data => { setPmpData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Timer Logic for Mock Exam
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

  if (loading) return <div className="h-screen bg-[#05070a] flex items-center justify-center text-indigo-400 font-black tracking-widest">SYNCING COMMAND CENTER...</div>;

  // --- VIEW: DASHBOARD (4 QUADRANTS + ANALYTICS) ---
  if (currentMode === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-fadeIn">
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">PMP Mastery 5.0</h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-indigo-500">Professional Veteran Edition</p>
          </div>
          <div className="glass px-6 py-2 rounded-full border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">System Online</div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button onClick={() => setCurrentMode('studyhub')} className="glass quadrant group p-8">
            <LucideIcon name="book-open" className="w-8 h-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase">Study Hub</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">35 ECO Tasks</p>
          </button>
          <button onClick={() => setCurrentMode('quiz')} className="glass quadrant group p-8">
            <LucideIcon name="zap" className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase">Quizzes & Sims</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">Interactive Drills</p>
          </button>
          <button onClick={() => setCurrentMode('formulas')} className="glass quadrant group p-8">
            <LucideIcon name="calculator" className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase">Formula Lab</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">EVM Analytics</p>
          </button>
          <button onClick={() => setCurrentMode('mock')} className="glass quadrant group p-8 border-rose-500/10">
            <LucideIcon name="award" className="w-8 h-8 text-rose-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase text-center">Full Mock<br/>Exam</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">180 Questions</p>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-8 md:col-span-2 min-h-[300px] flex flex-col justify-between">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Readiness Score</h4>
            <div className="flex items-end gap-2 h-32">
              {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-lg" style={{height: `${h}%`}}></div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 font-black uppercase"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
          </div>
          <div className="space-y-6">
            <div className="glass p-8 border-emerald-500/10"><p className="text-[10px] uppercase font-black text-slate-500">Accuracy</p><p className="text-4xl font-black text-emerald-400 italic">92%</p></div>
            <div className="glass p-8 border-indigo-500/10"><p className="text-[10px] uppercase font-black text-slate-500">Tasks Done</p><p className="text-4xl font-black text-indigo-400 italic">28/35</p></div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-6 md:p-12 bg-[#05070a] flex flex-col items-center">
        <div className="max-w-4xl w-full">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500 mb-10 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><LucideIcon name="arrow-left" className="w-4 h-4"/> Back</button>
          <div className="flex glass p-1 mb-8 gap-1">
            {['people', 'process', 'business'].map(d => (
              <button key={d} onClick={() => setStudyTab(d)} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase ${studyTab === d ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>{d}</button>
            ))}
          </div>
          <div className="space-y-4">
            {pmpData.tasks[studyTab].map(t => (
              <div key={t.id} className="glass p-8">
                <div onClick={() => setExpandedTask(expandedTask === t.id ? null : t.id)} className="flex justify-between items-center cursor-pointer">
                  <h3 className="text-xl font-black italic uppercase tracking-tighter">{t.id}: {t.title}</h3>
                  <LucideIcon name={expandedTask === t.id ? "minus" : "plus"} />
                </div>
                {expandedTask === t.id && (
                  <div className="mt-8 space-y-4 animate-fadeIn">
                    <p className="text-slate-400 text-sm italic">"{t.deepDive}"</p>
                    <div className="bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs font-bold leading-relaxed">Veteran Insight: {t.veteranTip}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: FULL MOCK EXAM ---
  if (currentMode === 'mock') {
    return (
      <div className="min-h-screen bg-[#05070a] p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <header className="glass p-6 flex justify-between items-center border-rose-500/20">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-500"><LucideIcon name="x" className="w-6 h-6"/></button>
            <div className="text-2xl font-black font-mono text-white tracking-widest">{formatTime(examTime)}</div>
            <button className="bg-rose-600 px-6 py-2 rounded-lg font-black text-[10px] uppercase">Finish</button>
          </header>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-3 glass p-12 min-h-[500px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between mb-8"><span className="text-indigo-400 font-black text-xs uppercase tracking-widest">Question 1 of 180</span></div>
                <p className="text-2xl font-bold italic text-slate-200 mb-10 leading-tight">"{pmpData.mockExam[0].question}"</p>
                <div className="space-y-3">
                  {pmpData.mockExam[0].options.map((opt, i) => (
                    <button key={i} className="w-full text-left p-6 rounded-xl border border-white/5 hover:border-indigo-500/50 hover:bg-white/5 transition-all text-sm">{opt}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass p-6 h-fit">
              <h4 className="text-[10px] font-black uppercase text-slate-500 mb-6 tracking-widest">Navigator</h4>
              <div className="grid grid-cols-5 gap-2">
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