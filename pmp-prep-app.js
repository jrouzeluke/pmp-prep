const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp_mastery_persistence');
    return saved ? JSON.parse(saved) : { attempted: 0, correct: 0, streak: 1 };
  });

  useEffect(() => { localStorage.setItem('pmp_mastery_persistence', JSON.stringify(progress)); }, [progress]);

  // --- DASHBOARD VIEW ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative">
        {/* Background Visuals */}
        <div className="animate-blob w-[500px] h-[500px] bg-indigo-600 top-[-10%] left-[-10%]"></div>
        <div className="animate-blob w-[500px] h-[500px] bg-purple-600 bottom-[-10%] right-[-10%] animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div className="text-center md:text-left">
              <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tighter leading-none">PMP MASTERY 2026</h1>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                  <LucideIcon name="shield-check" className="w-3 h-3" /> Progress Saved to this Device
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                  <LucideIcon name="database" className="w-3 h-3" /> No Data Sent to Server
                </div>
              </div>
            </div>
            <div className="glass px-6 py-2 flex items-center gap-3 border-indigo-500/30 mt-6 md:mt-0">
              <LucideIcon name="flame" className="text-orange-500 w-5 h-5 animate-pulse" />
              <span className="font-black text-lg">{progress.streak} DAY STREAK</span>
            </div>
          </header>

          {/* STATS ROW (from image_1074ef.png) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass p-8">
              <h3 className="text-slate-500 text-xs font-black uppercase mb-4">Questions Done</h3>
              <div className="text-5xl font-black">{progress.attempted}</div>
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-6 overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{width: `${Math.min(progress.attempted, 100)}%`}}></div>
              </div>
            </div>
            <div className="glass p-8 border-emerald-500/20">
              <h3 className="text-slate-500 text-xs font-black uppercase mb-4">Accuracy Rate</h3>
              <div className="text-5xl font-black text-emerald-400">
                {progress.attempted > 0 ? Math.round((progress.correct/progress.attempted)*100) : 0}%
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase mt-4">Target: 80% for Above Target</p>
            </div>
            <div className="glass p-8">
              <h3 className="text-slate-500 text-xs font-black uppercase mb-4">Badges</h3>
              <div className="flex gap-2 text-slate-600 italic text-sm mt-4">Practice to unlock...</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <button onClick={() => setCurrentMode('quiz_select')} className="w-full glass p-8 flex items-center justify-between group">
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="bg-indigo-600 p-2 rounded-lg"><LucideIcon name="play" className="w-4 h-4 fill-current"/></div>
                    <span className="font-black text-xl italic">QUIZZES & SIMS</span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Topic Focus • Logic Drills</p>
                </div>
                <LucideIcon name="chevron-right" className="w-5 h-5 text-slate-600 group-hover:text-white" />
              </button>

              <button onClick={() => setCurrentMode('studyhub')} className="w-full glass p-8 flex items-center justify-between group">
                <div className="text-left">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="bg-purple-600 p-2 rounded-lg"><LucideIcon name="book-open" className="w-4 h-4"/></div>
                    <span className="font-black text-xl italic">STUDY HUB</span>
                  </div>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">35 Tasks • Formulas • Agile</p>
                </div>
                <LucideIcon name="chevron-right" className="w-5 h-5 text-slate-600 group-hover:text-white" />
              </button>
            </div>

            {/* FULL EXAM HERO (on Dashboard) */}
            <div className="lg:col-span-2">
              <div className="h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 rounded-[2.5rem] p-12 relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><LucideIcon name="award" className="w-64 h-64 text-white" /></div>
                <div>
                  <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase w-fit mb-6">Simulation Engine</div>
                  <h2 className="text-6xl font-black mb-6 italic tracking-tighter">Full Exam Simulation</h2>
                  <p className="text-slate-400 text-lg max-w-sm mb-10 leading-relaxed">The ultimate 180-question challenge. Balanced across People, Process, and Business.</p>
                </div>
                <button className="bg-white text-indigo-950 px-12 py-5 rounded-2xl font-black text-2xl hover:scale-105 transition-all w-fit shadow-2xl">BEGIN SIMULATION</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDY HUB VIEW ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-8 bg-[#0b0f1a]">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-center mb-12">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 hover:text-white flex items-center gap-2 font-black uppercase text-xs tracking-widest"><LucideIcon name="arrow-left" className="w-4 h-4"/> Back to Base</button>
            <h2 className="text-2xl font-black italic text-purple-400 tracking-tighter uppercase">Study Hub</h2>
          </header>

          <nav className="flex glass p-1 mb-12 overflow-x-auto no-scrollbar">
            {['tasks', 'formulas', 'agile', 'traps'].map(t => (
              <button key={t} onClick={() => setStudyTab(t)} className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === t ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'}`}>{t}</button>
            ))}
          </nav>

          <div className="glass p-12 text-center min-h-[400px]">
            <LucideIcon name="database" className="w-12 h-12 mx-auto mb-6 text-slate-700" />
            <h3 className="text-3xl font-black italic uppercase mb-2">{studyTab} Breakdown</h3>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Populating surgical content in Step 2...</p>
          </div>
        </div>
      </div>
    );
  }

  // --- QUIZ SELECTOR VIEW ---
  if (currentMode === 'quiz_select') {
    return (
      <div className="min-h-screen p-12 bg-[#0b0f1a]">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <button onClick={() => setCurrentMode('dashboard')} className="self-start text-slate-400 hover:text-white mb-12 flex items-center gap-2 font-black uppercase text-xs tracking-widest"><LucideIcon name="arrow-left" className="w-4 h-4"/> Back</button>
          <h2 className="text-5xl font-black mb-12 italic tracking-tighter">SELECT TOPIC DRILL</h2>
          <div className="grid md:grid-cols-3 gap-8 w-full">
            {['People', 'Process', 'Business'].map(domain => (
              <div key={domain} className="glass p-12 hover:scale-105 transition-all cursor-pointer group text-center border-indigo-500/20 hover:border-indigo-500">
                 <div className="text-4xl mb-6">{domain === 'People' ? '👥' : domain === 'Process' ? '⚙️' : '💼'}</div>
                 <h4 className="text-2xl font-black mb-4 uppercase italic">{domain}</h4>
                 <p className="text-slate-500 text-sm mb-10 font-bold uppercase">15 Question Sprint</p>
                 <div className="bg-indigo-600 py-4 rounded-xl font-black text-xs uppercase tracking-widest text-white shadow-xl">Start Quiz</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));