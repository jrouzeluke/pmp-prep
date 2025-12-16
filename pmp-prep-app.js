const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

// --- DATA STRUCTURE: THE 35 TASKS ---
const ECO_TASKS = {
  people: [
    { id: 'P1', title: 'Manage Conflict', mindset: 'Analyze source first; collaborate before escalating.', tips: 'Agile teams self-resolve; Waterfall PM facilitates.' },
    { id: 'P2', title: 'Lead a Team', mindset: 'Practice servant leadership; adapt to team maturity.', tips: 'Shield team from interruptions.' },
    { id: 'P3', title: 'Support Performance', mindset: 'Track growth, not just tasks.', tips: 'Use retrospectives for improvement.' },
    { id: 'P4', title: 'Empower Team', mindset: 'Delegate authority, not just tasks.', tips: 'Support self-organizing teams.' },
    { id: 'P5', title: 'Ensure Training', mindset: 'Identify gaps early; budget for learning.', tips: 'Training is a risk mitigation strategy.' },
    { id: 'P6', title: 'Build a Team', mindset: 'Move from Storming to Norming quickly.', tips: 'Continuous skill assessment.' },
    { id: 'P7', title: 'Address Impediments', mindset: 'Clear roadblocks so the team can work.', tips: 'Scrum Master primary duty.' },
    { id: 'P8', title: 'Negotiate Agreements', mindset: 'Find win-win; document everything.', tips: 'Manage expectations.' },
    { id: 'P9', title: 'Collaborate Stakeholders', mindset: 'Engagement > Communication.', tips: 'Use Power/Interest grid.' },
    { id: 'P10', title: 'Shared Understanding', mindset: 'Align on the "Why" to ensure "What".', tips: 'Use Vision statements.' },
    { id: 'P11', title: 'Virtual Teams', mindset: 'Use tech to bridge distance; sync often.', tips: 'Rotate meeting times.' },
    { id: 'P12', title: 'Ground Rules', mindset: 'Team creates their own rules.', tips: 'Social Contract / Team Charter.' },
    { id: 'P13', title: 'Mentor Stakeholders', mindset: 'Coach PO and Sponsor on value.', tips: 'Enable transition to Agile.' },
    { id: 'P14', title: 'Emotional Intelligence', mindset: 'Self-awareness is the baseline.', tips: 'Use to resolve conflict.' }
  ],
  process: [
    { id: 'PR1', title: 'Execute with Urgency', mindset: 'Deliver value incrementally (MVP).', tips: 'Fast-tracking vs Crashing.' },
    { id: 'PR2', title: 'Communications', mindset: 'Right info, right person, right time.', tips: 'Push vs Pull vs Interactive.' },
    { id: 'PR3', title: 'Risk Management', mindset: 'Risks are uncertain; Issues are current.', tips: 'Identify > Analyze > Respond.' },
    { id: 'PR4', title: 'Stakeholder Engagement', mindset: 'Analyze power and interest.', tips: 'Engage resistant stakeholders first.' },
    { id: 'PR5', title: 'Budget & Resources', mindset: 'Cost baseline is the approved budget.', tips: 'EVM: CPI and SPI metrics.' },
    { id: 'PR6', title: 'Schedule', mindset: 'Critical path has zero float.', tips: 'Lead/Lag vs Compression.' },
    { id: 'PR7', title: 'Quality', mindset: 'Prevention over inspection.', tips: 'QA is Process; QC is Product.' },
    { id: 'PR8', title: 'Scope', mindset: 'Prevent scope creep at all costs.', tips: 'WBS is the foundation.' },
    { id: 'PR9', title: 'Integration', mindset: 'The PM is the integrator.', tips: 'Consolidate all plans.' },
    { id: 'PR10', title: 'Changes', mindset: 'Follow the Change Management Plan.', tips: 'CCB approves/rejects.' },
    { id: 'PR11', title: 'Procurement', mindset: 'Partner with legal; select best fit.', tips: 'Fixed Price vs T&M vs Cost Plus.' },
    { id: 'PR12', title: 'Artifacts', mindset: 'Keep them accessible and current.', tips: 'Configuration management.' },
    { id: 'PR13', title: 'Methodology', mindset: 'Pick Agile, Waterfall, or Hybrid based on risk.', tips: 'Stacey Matrix logic.' },
    { id: 'PR14', title: 'Governance', mindset: 'Establish decision frameworks.', tips: 'Phase gates / Kill points.' },
    { id: 'PR15', title: 'Issue Management', mindset: 'Address active problems fast.', tips: 'Log and assign owners.' },
    { id: 'PR16', title: 'Knowledge Transfer', mindset: 'Lessons learned start on day one.', tips: 'Ensure project continuity.' },
    { id: 'PR17', title: 'Closure', mindset: 'Get formal sign-off.', tips: 'Close procurements and archives.' }
  ],
  business: [
    { id: 'B1', title: 'Compliance', mindset: 'Non-negotiable requirements.', tips: 'Legal/Safety/Regulatory.' },
    { id: 'B2', title: 'Deliver Benefits', mindset: 'Business value > Deliverables.', tips: 'Verify benefits realization.' },
    { id: 'B3', title: 'External Changes', mindset: 'Monitor the environment (PESTLE).', tips: 'Pivot project if needed.' },
    { id: 'B4', title: 'Org Change', mindset: 'Support cultural adoption.', tips: 'Change management plan.' }
  ]
};

const PMPPrepApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [expandedTask, setExpandedTask] = useState(null);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp_m26_v1.5');
    return saved ? JSON.parse(saved) : { attempted: 0, correct: 0, streak: 1 };
  });

  // --- DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative font-sans">
        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
            <div>
              <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent italic leading-none">PMP MASTERY 2026</h1>
              <div className="flex gap-3 mt-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2">
                  <LucideIcon name="shield-check" className="text-emerald-400 w-3 h-3" />
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Privacy First: Device Storage</span>
                </div>
              </div>
            </div>
            <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4">
              <LucideIcon name="flame" className="text-orange-500 w-6 h-6 animate-pulse" />
              <div className="text-xl font-black">{progress.streak} DAY STREAK</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div className="glass p-8 rounded-[2rem]">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Stats</h3>
                <div className="text-4xl font-black">{progress.attempted}</div>
                <div className="text-emerald-400 font-bold text-sm">Questions Completed</div>
              </div>
              
              <button onClick={() => setCurrentMode('quiz_select')} className="w-full bg-indigo-600 hover:bg-indigo-500 p-8 rounded-[2rem] flex items-center justify-between group transition-all">
                <div className="text-left"><div className="font-black text-xl mb-1">QUIZZES & SIMS</div><div className="text-indigo-200 text-xs uppercase">Topic Focus</div></div>
                <LucideIcon name="zap" className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
              </button>

              <button onClick={() => setCurrentMode('studyhub')} className="w-full glass hover:bg-white/5 p-8 rounded-[2rem] flex items-center justify-between group transition-all">
                <div className="text-left"><div className="font-black text-xl mb-1">STUDY HUB</div><div className="text-slate-500 text-xs uppercase">ECO & Tips</div></div>
                <LucideIcon name="book-open" className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>
            </div>

            <div className="lg:col-span-2">
              <div className="h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-[3rem] p-10 flex flex-col justify-between group">
                <div>
                  <h2 className="text-5xl font-black mb-6 leading-tight">Full Exam Simulation</h2>
                  <p className="text-slate-400 text-lg max-w-md">180 Questions • 230 Minutes • The Final Boss.</p>
                </div>
                <button className="bg-white text-[#0f172a] px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all w-fit">BEGIN SIMULATION</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 hover:text-white flex items-center gap-2 font-bold"><LucideIcon name="arrow-left" className="w-5 h-5"/> BACK</button>
          <h2 className="text-2xl font-black italic text-purple-400">STUDY HUB</h2>
        </div>

        <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/10 mb-8 overflow-x-auto no-scrollbar glass">
          {['tasks', 'formulas', 'agile', 'traps'].map(t => (
            <button key={t} onClick={() => {setStudyTab(t); setExpandedTask(null);}} className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${studyTab === t ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500'}`}>{t}</button>
          ))}
        </div>

        <div className="glass p-8 md:p-10 rounded-[2.5rem]">
          {studyTab === 'tasks' && (
            <div className="space-y-12">
              {['People', 'Process', 'Business'].map(domain => (
                <div key={domain}>
                  <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-2">{domain} Domain</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ECO_TASKS[domain.toLowerCase()].map(task => (
                      <div key={task.id} onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)} 
                        className={`p-6 rounded-2xl border transition-all cursor-pointer ${expandedTask === task.id ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-sm">{task.title}</span>
                          <LucideIcon name={expandedTask === task.id ? "chevron-up" : "chevron-down"} className="w-4 h-4 text-slate-500" />
                        </div>
                        {expandedTask === task.id && (
                          <div className="mt-6 space-y-4 animate-fadeIn">
                            <div className="bg-white/5 p-4 rounded-xl">
                              <div className="text-[10px] font-black text-indigo-400 uppercase mb-1">The Mindset</div>
                              <div className="text-sm text-slate-300">{task.mindset}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl">
                              <div className="text-[10px] font-black text-purple-400 uppercase mb-1">Pro Tip</div>
                              <div className="text-sm text-slate-300">{task.tips}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {studyTab === 'formulas' && <div className="text-center py-20 text-slate-500 uppercase tracking-widest text-xs">Formula Content Loading in Step 2...</div>}
          {studyTab === 'agile' && <div className="text-center py-20 text-slate-500 uppercase tracking-widest text-xs">Agile Content Loading in Step 2...</div>}
          {studyTab === 'traps' && <div className="text-center py-20 text-slate-500 uppercase tracking-widest text-xs">Trap Detection Content Loading in Step 2...</div>}
        </div>
      </div>
    );
  }

  // --- QUIZ SELECTOR ---
  if (currentMode === 'quiz_select') {
    return (
      <div className="min-h-screen p-12 max-w-6xl mx-auto">
        <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 hover:text-white mb-12 flex items-center gap-2 font-bold"><LucideIcon name="arrow-left" className="w-5 h-5"/> BACK</button>
        <h2 className="text-5xl font-black mb-12 italic tracking-tighter">SELECT TOPIC</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {['People', 'Process', 'Business'].map(domain => (
            <div key={domain} className="glass p-10 rounded-[3rem] hover:scale-105 transition-all cursor-pointer group border-indigo-500/20 hover:border-indigo-500">
               <div className="text-4xl mb-6 group-hover:animate-bounce">{domain === 'People' ? '👥' : domain === 'Process' ? '⚙️' : '💼'}</div>
               <h4 className="text-2xl font-black mb-2">{domain} Domain</h4>
               <p className="text-slate-500 text-sm mb-8">15 Question focused sprint.</p>
               <div className="bg-indigo-600 py-3 rounded-xl text-center font-bold text-xs uppercase tracking-widest">Start Quiz</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

ReactDOM.render(<PMPPrepApp />, document.getElementById('root'));