const { useState, useEffect } = React;

// --- DYNAMIC ICON COMPONENT ---
const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

const PMPPrepApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp_mastery_2026_data');
    return saved ? JSON.parse(saved) : { attempted: 0, correct: 0, streak: 1, badges: [] };
  });

  useEffect(() => {
    localStorage.setItem('pmp_mastery_2026_data', JSON.stringify(progress));
  }, [progress]);

  // --- PAGE: MAIN DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header & Trust Badges */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
            <div>
              <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic leading-none">PMP MASTERY 2026</h1>
              <div className="flex flex-wrap gap-3 mt-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                  <LucideIcon name="shield-check" className="text-emerald-400 w-3 h-3" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Privacy First: Progress stored locally</span>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                  <LucideIcon name="database" className="text-blue-400 w-3 h-3" />
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">No Account Required</span>
                </div>
              </div>
            </div>
            <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4">
              <LucideIcon name="flame" className="text-orange-500 w-6 h-6 animate-pulse" />
              <div>
                <div className="text-xl font-black leading-none">{progress.streak}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Sidebar Stats */}
            <div className="space-y-6">
              <div className="glass p-8 rounded-[2rem]">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] mb-6">Performance</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-4xl font-black">{progress.attempted}</span>
                    <span className="text-slate-400 text-xs font-bold uppercase">Questions</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{width: `${Math.min(progress.attempted, 100)}%`}}></div>
                  </div>
                  <div className="text-emerald-400 font-black text-sm pt-2">
                    {progress.attempted > 0 ? Math.round((progress.correct/progress.attempted)*100) : 0}% Global Accuracy
                  </div>
                </div>
              </div>

              <button onClick={() => setCurrentMode('quiz_select')} className="w-full glass hover:bg-white/5 p-8 rounded-[2rem] flex items-center justify-between group transition-all">
                <div className="text-left">
                  <div className="font-black text-xl mb-1">QUIZZES & SIMS</div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Practice by Topic</div>
                </div>
                <div className="bg-indigo-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <LucideIcon name="zap" className="text-indigo-400 w-6 h-6" />
                </div>
              </button>

              <button onClick={() => setCurrentMode('studyguide')} className="w-full glass hover:bg-white/5 p-8 rounded-[2rem] flex items-center justify-between group transition-all">
                <div className="text-left">
                  <div className="font-black text-xl mb-1 text-slate-200">STUDY HUB</div>
                  <div className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">ECO Tasks & Tips</div>
                </div>
                <div className="bg-purple-500/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <LucideIcon name="book-open" className="text-purple-400 w-6 h-6" />
                </div>
              </button>
            </div>

            {/* Main Hero: Full Exam Sim */}
            <div className="lg:col-span-2">
              <div className="h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-[3rem] p-10 md:p-14 relative overflow-hidden flex flex-col justify-between group">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                  <LucideIcon name="award" className="w-64 h-64" />
                </div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-indigo-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">Ultimate Challenge</div>
                  <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Full Exam Simulation</h2>
                  <p className="text-slate-400 text-lg max-w-md leading-relaxed">The realistic 180-question "Final Boss" mode. Timed for 230 minutes to build your mental stamina.</p>
                </div>

                <div className="mt-12 flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <button onClick={() => setCurrentMode('full_exam')} className="w-full md:w-auto bg-white text-[#0f172a] px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-indigo-500/20">
                    BEGIN SIMULATION
                  </button>
                  <div className="flex gap-8 border-l border-white/10 pl-8">
                    <div className="text-center">
                      <div className="text-xl font-black">230</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Minutes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-black">180</div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Questions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PAGE: STUDY HUB (TABBED) ---
  if (currentMode === 'studyguide') {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => setCurrentMode('dashboard')} className="flex items-center gap-3 text-slate-400 font-bold hover:text-white transition-all uppercase tracking-widest text-xs">
              <LucideIcon name="arrow-left" className="w-5 h-5" /> Back to Base
            </button>
            <h2 className="text-2xl font-black italic tracking-tighter text-purple-400">STUDY HUB</h2>
          </div>

          <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/10 mb-8 overflow-x-auto no-scrollbar glass">
            {['tasks', 'formulas', 'agile', 'traps'].map(t => (
              <button key={t} onClick={() => setStudyTab(t)}
                className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${studyTab === t ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="glass p-12 rounded-[3rem] min-h-[500px]">
            <div className="animate-pulse">
              <h3 className="text-4xl font-black mb-6 uppercase italic tracking-tighter">
                {studyTab === 'tasks' && "ECO Task Breakdown"}
                {studyTab === 'formulas' && "EVM & Formula Bank"}
                {studyTab === 'agile' && "Agile & Scrum Logic"}
                {studyTab === 'traps' && "Exam Trap Detection"}
              </h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">Preparing surgical content for Step 2...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- PAGE: QUIZ SELECTOR ---
  if (currentMode === 'quiz_select') {
    return (
      <div className="min-h-screen p-6 md:p-12 flex flex-col items-center">
        <div className="max-w-5xl w-full">
           <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 font-bold hover:text-white mb-12 flex items-center gap-2 uppercase tracking-widest text-xs">
             <LucideIcon name="arrow-left" className="w-5 h-5" /> Back
           </button>
           <h2 className="text-5xl font-black mb-12 italic tracking-tighter">CHOOSE YOUR CHALLENGE</h2>
           
           <div className="grid md:grid-cols-3 gap-8">
              <div className="glass p-10 rounded-[2.5rem] hover:bg-white/5 cursor-pointer transition-all border-amber-500/20 hover:border-amber-500/50">
                <LucideIcon name="zap" className="text-amber-500 w-12 h-12 mb-6" />
                <h4 className="text-2xl font-black mb-2 leading-none">Micro-Quiz</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Focused 15-question sprints for rapid reinforcement.</p>
              </div>
              <div className="glass p-10 rounded-[2.5rem] hover:bg-white/5 cursor-pointer transition-all border-indigo-500/20 hover:border-indigo-500/50">
                <LucideIcon name="brain" className="text-indigo-500 w-12 h-12 mb-6" />
                <h4 className="text-2xl font-black mb-2 leading-none">Simulations</h4>
                <p className="text-slate-500 text-sm leading-relaxed">Decision-based interactive logic scenarios.</p>
              </div>
              <div className="bg-gradient-to-br from-rose-600/20 to-purple-600/20 border border-rose-500/30 p-10 rounded-[2.5rem] hover:scale-105 transition-all">
                <LucideIcon name="trophy" className="text-rose-500 w-12 h-12 mb-6" />
                <h4 className="text-2xl font-black mb-2 leading-none text-white">Full Exam</h4>
                <p className="text-rose-200/60 text-sm leading-relaxed">Direct path to the 180-question simulation.</p>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return <div className="p-20 text-center font-black italic text-4xl">Step 1 Ready. Signal for Step 2.</div>;
};

ReactDOM.render(<PMPPrepApp />, document.getElementById('root'));