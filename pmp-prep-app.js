const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp_mastery_persistence');
    return saved ? JSON.parse(saved) : { attempted: 0, correct: 0, streak: 1 };
  });

  return (
    <div className="min-h-screen p-6 md:p-12 relative flex flex-col items-center overflow-hidden">
      <div className="animate-blob w-[600px] h-[600px] bg-indigo-600 top-[-10%] left-[-10%]"></div>
      <div className="animate-blob w-[500px] h-[500px] bg-purple-600 bottom-[-10%] right-[-10%]"></div>

      <div className="max-w-6xl w-full relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-tighter">PMP Mastery 2026</h1>
            <div className="flex gap-3 mt-4 justify-center md:justify-start">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                <LucideIcon name="shield-check" className="w-3 h-3" /> Progress Saved Locally
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                <LucideIcon name="database" className="w-3 h-3" /> No Data Sent to Server
              </div>
            </div>
          </div>
          <div className="glass px-8 py-3 flex items-center gap-4 border-indigo-500/30 shadow-lg mt-8 md:mt-0">
            <LucideIcon name="flame" className="text-orange-500 w-6 h-6 animate-pulse" />
            <span className="font-black text-xl italic">{progress.streak} DAY STREAK</span>
          </div>
        </header>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass p-8">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Questions Done</h3>
            <div className="text-5xl font-black mb-6">{progress.attempted}</div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-indigo-500 h-full" style={{width: `${Math.min(progress.attempted, 100)}%`}}></div>
            </div>
          </div>
          <div className="glass p-8 border-emerald-500/20">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Accuracy Rate</h3>
            <div className="text-5xl font-black text-emerald-400">{progress.attempted > 0 ? Math.round((progress.correct/progress.attempted)*100) : 0}%</div>
          </div>
          <div className="glass p-8">
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Badges</h3>
            <div className="text-slate-500 italic text-sm py-4 opacity-50 font-black uppercase">Unlock by practicing...</div>
          </div>
        </div>

        {/* 3-CARD BALANCED GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <button className="glass p-10 flex flex-col items-center text-center group hover:bg-indigo-600/10 border-indigo-500/20">
            <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="play" className="text-white fill-current w-8 h-8" /></div>
            <h2 className="text-2xl font-black italic uppercase mb-2">Quizzes & Sims</h2>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">Topic Drills</p>
          </button>
          <button className="glass p-10 flex flex-col items-center text-center group hover:bg-purple-600/10 border-purple-500/20">
            <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="book-open" className="text-white w-8 h-8" /></div>
            <h2 className="text-2xl font-black italic uppercase mb-2">Study Hub</h2>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">35 ECO Tasks</p>
          </button>
          <button className="glass p-10 flex flex-col items-center text-center group hover:bg-rose-600/10 border-rose-500/20">
            <div className="bg-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="award" className="text-white w-8 h-8" /></div>
            <h2 className="text-2xl font-black italic uppercase mb-2">Full Exam</h2>
            <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">180 Questions</p>
          </button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));