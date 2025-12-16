const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

// --- SURGICAL DATA 3.0: THE BRAIN OF THE APP ---
const ECO_TASKS = {
  people: [
    { 
      id: 'P1', 
      title: 'Manage Conflict', 
      primeDirective: 'Facilitate, don’t dictate. Always resolve at the source before escalating.',
      deepDive: 'Conflict is inevitable but not always negative. Functional conflict (technical debate) improves the product; Dysfunctional conflict (personal) destroys the team. Your job is to move conflict from personality-based to data-based.',
      surgicalIntel: {
        tools: 'Collaborating (Win-Win), Compromising (Lose-Lose), Smoothing (Yielding), Forcing (Win-Lose).',
        inputs: 'Team Charter (Ground Rules), Issue Log, Resource Management Plan.',
        trapAlert: 'Watch out for "Escalate to Sponsor" or "HR"—these are almost always incorrect first steps unless physical safety is at risk.',
        methodology: 'Agile: The team self-organizes; the Scrum Master facilitates. Waterfall: The PM follows a formal Conflict Resolution Strategy.'
      },
      simulations: [
        {
          scenario: "Two senior developers are arguing over API architecture, stalling the sprint by 3 days. What is your FIRST move?",
          options: [
            { text: "Facilitate a private meeting for them to present data-backed pros/cons.", correct: true, feedback: "Correct! This is Collaborating—the preferred PMI method for long-term resolution." },
            { text: "Decide the architecture yourself to keep the project on track.", correct: false, feedback: "Incorrect. This is 'Forcing' and kills team autonomy and buy-in." }
          ]
        },
        {
          scenario: "A stakeholder is aggressively criticizing a junior dev in a public Slack channel. How do you lead?",
          options: [
            { text: "Intervene and move the conversation to a private channel immediately.", correct: true, feedback: "Correct! Protect the team’s psychological safety and de-escalate privately." },
            { text: "Ignore it unless the junior developer formally complains.", correct: false, feedback: "Incorrect. The PM must proactively address dysfunctional behavior." }
          ]
        }
      ]
    },
    { 
      id: 'P2', 
      title: 'Lead a Team', 
      primeDirective: 'Servant Leadership: You are the blocker-remover, not the boss.',
      deepDive: 'Leadership in PMP is about Emotional Intelligence (EI). You must adjust your style based on the team’s maturity using Tuckman’s Model (Forming, Storming, Norming, Performing).',
      surgicalIntel: {
        tools: 'Situational Leadership, Active Listening, Motivation Theories (Maslow, Herzberg).',
        inputs: 'Project Charter, Stakeholder Register.',
        trapAlert: 'Avoid "Directing" a mature team; for high-performers, the PM should be "Delegating."',
        methodology: 'Agile: The PM is a Servant Leader. Waterfall: The PM can be Transactional or Transformational.'
      },
      simulations: [
        {
          scenario: "Your team has reached the 'Storming' phase. Arguments are frequent. How do you respond?",
          options: [
            { text: "Facilitate a workshop to re-baseline the Team Charter ground rules.", correct: true, feedback: "Correct! Re-focusing on agreed-upon behavior is the best fix for Storming." },
            { text: "Allow them to work it out alone to encourage self-organization.", correct: false, feedback: "Incorrect. In Storming, the leader must be more active in providing guidance." }
          ]
        }
      ]
    }
  ]
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [expandedTask, setExpandedTask] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp_mastery_persistence');
    return saved ? JSON.parse(saved) : { attempted: 0, correct: 0, streak: 1 };
  });

  useEffect(() => { localStorage.setItem('pmp_mastery_persistence', JSON.stringify(progress)); }, [progress]);

  // --- DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative flex flex-col items-center overflow-hidden">
        <div className="animate-blob w-[600px] h-[600px] bg-indigo-600 top-[-10%] left-[-10%] opacity-10"></div>
        <div className="max-w-6xl w-full relative z-10">
          <header className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent uppercase tracking-tighter">PMP Mastery 2026</h1>
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
            <div className="glass p-8">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4 text-center md:text-left">Questions Done</h3>
              <div className="text-5xl font-black text-center md:text-left">{progress.attempted}</div>
            </div>
            <div className="glass p-8 border-emerald-500/20 text-center md:text-left">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Accuracy Rate</h3>
              <div className="text-5xl font-black text-emerald-400">{progress.attempted > 0 ? Math.round((progress.correct/progress.attempted)*100) : 0}%</div>
            </div>
            <div className="glass p-8 text-center md:text-left">
              <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-4">Badges</h3>
              <div className="text-slate-500 italic text-sm py-4 opacity-50 uppercase font-black">Unlock by practicing...</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <button className="glass p-10 flex flex-col items-center group hover:bg-indigo-600/10 border-indigo-500/20">
              <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="play" className="text-white fill-current w-8 h-8" /></div>
              <h2 className="text-2xl font-black italic uppercase mb-2">Quizzes & Sims</h2>
            </button>
            <button onClick={() => setCurrentMode('studyhub')} className="glass p-10 flex flex-col items-center group hover:bg-purple-600/10 border-purple-500/20">
              <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="book-open" className="text-white w-8 h-8" /></div>
              <h2 className="text-2xl font-black italic uppercase mb-2">Study Hub</h2>
            </button>
            <button className="glass p-10 flex flex-col items-center group hover:bg-rose-600/10 border-rose-500/20">
              <div className="bg-rose-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl mb-8 group-hover:scale-110 transition-transform"><LucideIcon name="award" className="text-white w-8 h-8" /></div>
              <h2 className="text-2xl font-black italic uppercase mb-2">Full Exam</h2>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-8 bg-[#0b0f1a] flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <header className="flex justify-between items-center mb-12">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 hover:text-white flex items-center gap-2 font-black uppercase text-[10px] tracking-widest">
              <LucideIcon name="arrow-left" className="w-4 h-4"/> Back to Base
            </button>
            <h2 className="text-2xl font-black italic text-purple-400 tracking-tighter uppercase">Surgical Study Hub</h2>
          </header>

          <nav className="flex glass p-1.5 mb-12 overflow-x-auto no-scrollbar border-white/5">
            {['tasks', 'formulas', 'agile'].map(t => (
              <button key={t} onClick={() => setStudyTab(t)} className={`flex-1 min-w-[140px] py-5 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === t ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/30' : 'text-slate-500 hover:text-white'}`}>
                {t === 'tasks' ? 'ECO TASKS' : t.toUpperCase()}
              </button>
            ))}
          </nav>

          <div className="space-y-6">
            {ECO_TASKS.people.map(task => (
              <div key={task.id} className="glass rounded-[2.5rem] overflow-hidden border-white/5 border">
                <div onClick={() => {setExpandedTask(expandedTask === task.id ? null : task.id); setSimResult(null); setSimIndex(0);}} className="p-10 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-all">
                  <div className="flex items-center gap-6">
                    <span className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-lg shadow-indigo-600/20">{task.id}</span>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight uppercase italic">{task.title}</h3>
                      <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-1">Secret: {task.primeDirective}</p>
                    </div>
                  </div>
                  <LucideIcon name={expandedTask === task.id ? "chevron-up" : "chevron-down"} className="text-slate-600" />
                </div>

                {expandedTask === task.id && (
                  <div className="px-10 pb-10 animate-fadeIn space-y-10 relative">
                    {/* Manual Card Collapse */}
                    <button onClick={() => setExpandedTask(null)} className="absolute top-0 right-10 text-[9px] text-slate-600 uppercase tracking-widest hover:text-white transition-colors italic">Collapse Card</button>

                    <div className="grid md:grid-cols-3 gap-8 border-b border-white/5 pb-10">
                      <div className="md:col-span-2 space-y-6">
                        <div className="space-y-2">
                          <div className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">Expert Analysis</div>
                          <p className="text-slate-300 leading-relaxed text-sm">{task.deepDive}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                             <div className="text-[9px] font-black uppercase text-slate-500 mb-2">Technical Tools (ITTO)</div>
                             <p className="text-[10px] text-slate-400 leading-tight italic">{task.surgicalIntel.tools}</p>
                           </div>
                           <div className="p-4 bg-rose-500/5 rounded-xl border border-rose-500/10">
                             <div className="text-[9px] font-black uppercase text-rose-400 mb-2 tracking-widest">Trap Alert</div>
                             <p className="text-[10px] text-slate-400 leading-tight italic">{task.surgicalIntel.trapAlert}</p>
                           </div>
                        </div>
                      </div>
                      <div className="bg-purple-900/10 p-6 rounded-[2rem] border border-purple-500/10 h-fit">
                        <div className="text-purple-400 font-black text-[10px] uppercase tracking-widest mb-4">The Methodology Split</div>
                        <p className="text-slate-400 text-xs leading-relaxed italic">{task.surgicalIntel.methodology}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-10 rounded-[2.5rem]">
                      <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-8 flex items-center gap-2">Interactive Simulation</h4>
                      <p className="text-xl font-bold mb-8 leading-tight">{task.simulations[simIndex].scenario}</p>
                      <div className="grid gap-4">
                        {task.simulations[simIndex].options.map((opt, i) => (
                          <button key={i} onClick={() => setSimResult(opt)} className={`p-5 rounded-2xl text-left text-sm transition-all border ${simResult?.text === opt.text ? (opt.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500') : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                      {simResult && (
                        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
                          <div className={`text-xs font-bold px-4 py-2 rounded-lg ${simResult.correct ? 'text-emerald-400 bg-emerald-400/10' : 'text-red-400 bg-red-400/10'}`}>{simResult.feedback}</div>
                          <div className="flex gap-6 items-center">
                            <button onClick={() => { setSimIndex((simIndex + 1) % task.simulations.length); setSimResult(null); }} className="text-[10px] font-black uppercase tracking-widest bg-white text-indigo-950 px-6 py-3 rounded-xl hover:scale-105 transition-all">Try Another Scenario</button>
                            <button onClick={() => setExpandedTask(null)} className="text-[10px] text-slate-500 hover:text-white transition-colors italic">collapse small</button>
                          </div>
                        </div>
                      )}
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

  return null;
};

ReactDOM.render(<PMPMasteryApp />, document.getElementById('root'));