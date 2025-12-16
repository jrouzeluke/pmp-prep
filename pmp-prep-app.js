const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [pmpData, setPmpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({ attempted: 42, correct: 38, tasksDone: 12 });

  useEffect(() => {
    fetch('./pmp-data.json')
      .then(res => res.json())
      .then(data => { setPmpData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-indigo-400 font-black">SYNCING COMMAND CENTER...</div>;

  if (currentMode === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-8 animate-fadeIn">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase italic bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">PMP Mastery 5.0</h1>
            <p className="text-[10px] uppercase font-bold tracking-[0.5em] text-indigo-500">Professional Veteran Edition</p>
          </div>
          <div className="glass px-6 py-2 rounded-full border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase">Session Active: 16-Year Pro Mode</div>
        </header>

        {/* THE 4 QUADRANTS (TOP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <button onClick={() => setCurrentMode('studyhub')} className="glass quadrant group border-indigo-500/10">
            <LucideIcon name="book-open" className="w-8 h-8 text-indigo-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase italic">Study Hub</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">35 ECO Tasks</p>
          </button>
          
          <button onClick={() => setCurrentMode('quiz')} className="glass quadrant group border-purple-500/10">
            <LucideIcon name="zap" className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase italic">Quizzes & Sims</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">Interactive Drills</p>
          </button>

          <button onClick={() => setCurrentMode('formulas')} className="glass quadrant group border-emerald-500/10">
            <LucideIcon name="calculator" className="w-8 h-8 text-emerald-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase italic">Formula Lab</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">EVM Analytics</p>
          </button>

          <button onClick={() => setCurrentMode('mock')} className="glass quadrant group border-rose-500/10">
            <LucideIcon name="award" className="w-8 h-8 text-rose-400 mb-4 group-hover:scale-110 transition-transform"/>
            <h3 className="text-xl font-black italic uppercase italic text-center">Full Mock<br/>Exam</h3>
            <p className="text-[9px] text-slate-500 mt-2 uppercase tracking-widest">180 Questions</p>
          </button>
        </div>

        {/* THE DASHBOARD (BOTTOM) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-8 md:col-span-2 flex flex-col justify-between min-h-[300px]">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">Performance Analytics</h4>
            <div className="flex items-end gap-2 h-32 mb-8">
              {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-lg transition-all hover:bg-indigo-500/40" style={{height: `${h}%`}}></div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-600 uppercase">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass p-8 border-emerald-500/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Accuracy Rate</h4>
              <div className="text-4xl font-black text-emerald-400 italic">92%</div>
            </div>
            <div className="glass p-8 border-indigo-500/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tasks Mastered</h4>
              <div className="text-4xl font-black text-indigo-400 italic">28/35</div>
            </div>
            <div className="glass p-8 border-rose-500/10">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Weakest Area</h4>
              <div className="text-xl font-black text-rose-400 italic uppercase">Risk Management</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Study Hub and other modes follow previous logic...
  return <div className="p-20 text-center"><button onClick={() => setCurrentMode('dashboard')} className="text-indigo-400 uppercase font-black tracking-widest">Return to Cockpit</button></div>;
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));