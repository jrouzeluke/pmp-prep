const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

// --- DATA: SURGICAL 3.0 ---
const ECO_TASKS = {
  people: [
    { 
      id: 'P1', title: 'Manage Conflict', 
      primeDirective: 'Facilitate, don’t dictate. Always resolve at the source.',
      deepDive: 'Conflict management is about preserving the team’s "Psychological Safety."',
      surgicalIntel: {
        tools: 'Collaborating (Win-Win), Compromising, Smoothing, Forcing.',
        inputs: 'Team Charter, Issue Log, Resource Management Plan.',
        trapAlert: 'Watch out for "Escalate to Sponsor"—this is a distractor.',
        methodology: 'Agile: Self-organization. Waterfall: Formal Conflict Management Plan.'
      },
      simulations: [{
        scenario: "Two devs are arguing over architecture, stalling the sprint. FIRST move?",
        options: [
          { text: "Facilitate a private data-backed meeting.", correct: true, feedback: "Correct! Collaborating is the preferred PMI method." },
          { text: "Decide for them.", correct: false, feedback: "Incorrect. That is Forcing." }
        ]
      }]
    }
  ]
};

const PMPMasteryApp = () => {
  // --- NAVIGATION STATE ---
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [expandedTask, setExpandedTask] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  const [simResult, setSimResult] = useState(null);
  
  // --- PERSISTENCE ---
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp_mastery_v3');
    return saved ? JSON.parse(saved) : { attempted: 0, correct: 0, streak: 1 };
  });

  useEffect(() => { localStorage.setItem('pmp_mastery_v3', JSON.stringify(progress)); }, [progress]);

  // --- VIEW: DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative flex flex-col items-center overflow-hidden">
        <div className="animate-blob w-[600px] h-[600px] bg-indigo-600 top-[-10%] left-[-10%] opacity-10"></div>
        <div className="max-w-6xl w-full relative z-10">
          <header className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tighter uppercase">PMP Mastery 2026</h1>
              <div className="flex gap-3 mt-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                  <LucideIcon name="shield-check" className="w-3 h-3" /> Progress Saved Locally
                </div>
              </div>
            </div>
            <div className="glass px-8 py-3 border-indigo-500/30 flex items-center gap-4">
              <LucideIcon name="flame" className="text-orange-500 w-6 h-6 animate-pulse" />
              <span className="font-black text-xl italic uppercase">{progress.streak} Day Streak</span>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass p-8"><h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">Questions Done</h3><div className="text-5xl font-black">{progress.attempted}</div></div>
            <div className="glass p-8 border-emerald-500/20"><h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">Accuracy Rate</h3><div className="text-5xl font-black text-emerald-400">{progress.attempted > 0 ? Math.round((progress.correct/progress.attempted)*100) : 0}%</div></div>
            <div className="glass p-8"><h3 className="text-slate-500 text-[10px] font-black uppercase mb-4">Badges</h3><div className="text-slate-500 italic text-sm opacity-50 uppercase font-black">Practicing...</div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button onClick={() => setCurrentMode('quiz_select')} className="glass p-10 flex flex-col items-center group hover:bg-indigo-600/10 border-indigo-500/20">
              <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="play" className="text-white fill-current w-8 h-8" /></div>
              <h2 className="text-2xl font-black italic uppercase">Quizzes & Sims</h2>
            </button>
            <button onClick={() => setCurrentMode('studyhub')} className="glass p-10 flex flex-col items-center group hover:bg-purple-600/10 border-purple-500/20">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="book-open" className="text-white w-8 h-8" /></div>
              <h2 className="text-2xl font-black italic uppercase">Study Hub</h2>
            </button>
            <button onClick={() => setCurrentMode('full_exam')} className="glass p-10 flex flex-col items-center group hover:bg-rose-600/10 border-rose-500/20">
              <div className="bg-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="award" className="text-white w-8 h-8" /></div>
              <h2 className="text-2xl font-black italic uppercase">Full Exam</h2>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-8 bg-[#0b0f1a] flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <header className="flex justify-between items-center mb-12">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 hover:text-white flex items-center gap-2 font-black uppercase text-[10px] tracking-widest"><LucideIcon name="arrow-left" className="w-4 h-4"/> Back</button>
            <h2 className="text-2xl font-black italic text-purple-400 uppercase">Study Hub</h2>
          </header>
          {ECO_TASKS.people.map(task => (
            <div key={task.id} className="glass rounded-[2.5rem] overflow-hidden border-white/5 border">
              <div onClick={() => {setExpandedTask(expandedTask === task.id ? null : task.id); setSimResult(null);}} className="p-10 flex justify-between items-center cursor-pointer">
                <div className="flex items-center gap-6"><span className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm">{task.id}</span><div><h3 className="text-2xl font-black italic uppercase">{task.title}</h3><p className="text-indigo-400 text-[10px] font-black uppercase">Secret: {task.primeDirective}</p></div></div>
                <LucideIcon name={expandedTask === task.id ? "chevron-up" : "chevron-down"} className="text-slate-600" />
              </div>
              {expandedTask === task.id && (
                <div className="px-10 pb-10 animate-fadeIn space-y-8">
                  <div className="grid md:grid-cols-2 gap-8"><p className="text-slate-300 text-sm leading-relaxed">{task.deepDive}</p><div className="bg-purple-900/10 p-4 rounded-xl text-xs italic text-slate-400">{task.surgicalIntel.methodology}</div></div>
                  <div className="bg-white/5 p-8 rounded-[2rem]"><p className="text-lg font-bold mb-6">{task.simulations[simIndex].scenario}</p>
                  {task.simulations[simIndex].options.map((opt, i) => (
                    <button key={i} onClick={() => setSimResult(opt)} className="w-full text-left p-4 rounded-xl border border-white/5 mb-2 hover:bg-white/5">{opt.text}</button>
                  ))}
                  {simResult && <div className="mt-4 p-4 rounded-xl bg-indigo-500/10 text-xs font-bold text-indigo-400">{simResult.feedback}</div>}
                  </div>
                  <button onClick={() => setExpandedTask(null)} className="text-[10px] text-slate-500 italic">collapse card</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- VIEW: PLACEHOLDERS FOR BROKEN PATHS ---
  if (currentMode === 'full_exam' || currentMode === 'quiz_select') {
    return (
      <div className="min-h-screen p-12 bg-[#0b0f1a] flex flex-col items-center justify-center">
        <LucideIcon name="construction" className="w-16 h-16 text-slate-700 mb-6" />
        <h2 className="text-4xl font-black italic uppercase text-purple-400 mb-4">{currentMode.replace('_', ' ')}</h2>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">This module is being populated with Surgical 3.0 data...</p>
        <button onClick={() => setCurrentMode('dashboard')} className="bg-white text-indigo-950 px-8 py-3 rounded-xl font-black uppercase tracking-widest">Back to Dashboard</button>
      </div>
    );
  }

  return null;
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));