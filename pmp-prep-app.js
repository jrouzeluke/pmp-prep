const { useState, useEffect } = React;

// --- ICON COMPONENT (Simplified for Step 1) ---
const Icon = ({ name, className }) => {
  const icons = {
    target: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
    zap: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    award: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 18 17 23 15.79 13.88"/></svg>,
    chart: <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
  };
  return icons[name] || <span>?</span>;
};

const PMPPrepApp = () => {
  // --- STATE ---
  const [currentMode, setCurrentMode] = useState('dashboard'); // Forces start on Dashboard
  const [stats, setStats] = useState({ correct: 0, total: 0, streak: 1 });

  // --- RENDER DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white font-sans p-6 overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Header Card (Your Original Style + Glassmorphism) */}
          <div className="bg-gradient-to-br from-indigo-600/40 to-purple-700/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-black italic tracking-tight">PMP MASTERY 2026</h1>
                <p className="text-indigo-200 text-sm">Elite Roadmap to Above Target Performance</p>
              </div>
              <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold border border-white/20">EDITION 1.0</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-black">{stats.total > 0 ? Math.round((stats.correct/stats.total)*100) : 0}%</div>
                <div className="text-[10px] uppercase font-bold text-indigo-300">Current Accuracy</div>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <div className="text-3xl font-black">{stats.streak}</div>
                <div className="text-[10px] uppercase font-bold text-indigo-300">Day Streak 🔥</div>
              </div>
            </div>
          </div>

          {/* Main Action Cards (Your Original Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button onClick={() => setCurrentMode('quiz')} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all text-center group">
              <Icon name="zap" className="w-12 h-12 text-amber-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black mb-1">START QUIZ</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">300 Question Bank</div>
            </button>
            <button onClick={() => setCurrentMode('studyguide')} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all text-center group">
              <Icon name="target" className="w-12 h-12 text-indigo-400 mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-2xl font-black mb-1">STUDY GUIDE</div>
              <div className="text-xs text-slate-400 uppercase tracking-widest">ECO Tasks & Tips</div>
            </button>
          </div>

          {/* Bottom Utility Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10">
              <Icon name="chart" className="text-blue-400 w-5 h-5" />
              <span className="font-bold text-xs">Formulas</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3 cursor-pointer hover:bg-white/10">
              <Icon name="award" className="text-emerald-400 w-5 h-5" />
              <span className="font-bold text-xs">Agile</span>
            </div>
            {/* Add more as needed */}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for other modes
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-20 text-center">
      <button onClick={() => setCurrentMode('dashboard')} className="bg-indigo-600 px-6 py-2 rounded-full font-bold">← Back to Dashboard</button>
      <p className="mt-8 text-slate-400 uppercase tracking-[0.2em]">Step 2: Questions Loading...</p>
    </div>
  );
};

ReactDOM.render(<PMPPrepApp />, document.getElementById('root'));