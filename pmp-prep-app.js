const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

// --- DATA STRUCTURE ---
const ECO_TASKS = {
  people: [
    { 
      id: 'P1', title: 'Manage Conflict', 
      deepDive: 'Focus on identifying the source and stage of conflict. Use Collaborate (Win-Win) as the primary resolution goal.',
      surgicalSteps: ['Analyze source.', 'Identify stage.', 'Apply resolution strategy.'],
      methodology: 'Agile teams self-organize to resolve. Waterfall PMs mediate.',
      simulations: [
        {
          scenario: "Two developers disagree on architecture, stalling the sprint. What is your FIRST move?",
          options: [
            { text: "Facilitate a private discussion between them.", correct: true, feedback: "Correct! Collaboration is the PMI preferred method." },
            { text: "Decide the architecture yourself.", correct: false, feedback: "Incorrect. This is 'Forcing' and hurts team autonomy." }
          ]
        },
        {
          scenario: "A stakeholder is being aggressive in a meeting. What do you do?",
          options: [
            { text: "Speak with them privately after the meeting.", correct: true, feedback: "Correct! Always address behavior privately first." },
            { text: "Ask them to leave immediately.", correct: false, feedback: "Incorrect. Escalation should be a later step." }
          ]
        }
      ]
    },
    { 
      id: 'P2', title: 'Lead a Team', 
      deepDive: 'Servant Leadership: You serve the team by removing impediments and shielding them from noise.',
      surgicalSteps: ['Define vision.', 'Empower others.', 'Foster psychological safety.'],
      methodology: 'Agile uses Servant Leaders. Predictive uses Transactional/Directing.',
      simulations: [
        {
          scenario: "A high-performer is suddenly missing deadlines. How do you lead?",
          options: [
            { text: "Schedule a 1-on-1 to identify hidden blockers.", correct: true, feedback: "Correct! Practice empathy and investigation." },
            { text: "Assign their tasks to someone else.", correct: false, feedback: "Incorrect. This masks the problem instead of solving it." }
          ]
        }
      ]
    }
  ]
};

const PMPPrepApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [expandedTask, setExpandedTask] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [progress, setProgress] = useState({ attempted: 12, correct: 9, streak: 1 });

  // --- DASHBOARD VIEW ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
        {/* Animated Backgrounds */}
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-blob"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="mb-12">
            <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tighter">PMP COMMAND CENTER</h1>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-[10px] font-bold uppercase w-fit mt-4">Device Storage Active</div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar with Stats */}
            <aside className="space-y-6">
              <div className="glass p-8 rounded-[2rem]">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Local Progress</h3>
                <div className="text-4xl font-black mb-1">{progress.attempted}</div>
                <div className="text-xs text-slate-400 font-bold uppercase">Questions Completed</div>
                <div className="mt-4 text-emerald-400 font-bold text-sm">{Math.round((progress.correct/progress.attempted)*100)}% Accuracy</div>
              </div>

              <button onClick={() => setCurrentMode('studyhub')} className="w-full glass p-10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/5 transition-all">
                <div className="text-left font-black text-xl">STUDY HUB</div>
                <LucideIcon name="book-open" className="w-8 h-8 text-purple-400" />
              </button>
            </aside>

            {/* Featured Simulation Area */}
            <main className="lg:col-span-2">
              <div className="h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-[3rem] p-10 md:p-14 flex flex-col justify-between group relative">
                <div className="absolute top-0 right-0 p-10 opacity-5"><LucideIcon name="award" className="w-64 h-64 text-white" /></div>
                <div>
                  <h2 className="text-5xl font-black mb-6 leading-tight">Full Exam Simulation</h2>
                  <p className="text-slate-400 text-lg max-w-sm mb-10">Standard 180-question blue-print simulation.</p>
                </div>
                <button className="bg-white text-indigo-950 px-12 py-5 rounded-2xl font-black text-xl w-fit shadow-2xl hover:scale-105 transition-all">BEGIN SIMULATION</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDY HUB VIEW ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 font-bold hover:text-white flex items-center gap-2"><LucideIcon name="arrow-left" className="w-4 h-4"/> BACK</button>
            <h2 className="text-2xl font-black italic text-purple-400 uppercase">Study Hub</h2>
          </div>

          <nav className="flex glass p-1 rounded-3xl mb-12 overflow-x-auto no-scrollbar">
            {['tasks', 'formulas', 'agile'].map(t => (
              <button key={t} onClick={() => {setStudyTab(t); setExpandedTask(null);}} 
                className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === t ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
                {t}
              </button>
            ))}
          </nav>

          <div className="space-y-6">
            {studyTab === 'tasks' && ECO_TASKS.people.map(task => (
              <div key={task.id} className="glass rounded-[2rem] overflow-hidden border-white/5 border">
                <div onClick={() => {setExpandedTask(expandedTask === task.id ? null : task.id); setSimResult(null); setSimIndex(0);}} className="p-8 flex justify-between items-center cursor-pointer">
                  <div className="flex items-center gap-4">
                    <span className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">{task.id}</span>
                    <h3 className="text-xl font-bold">{task.title}</h3>
                  </div>
                  <LucideIcon name={expandedTask === task.id ? "chevron-up" : "chevron-down"} className="text-slate-500" />
                </div>

                {expandedTask === task.id && (
                  <div className="px-8 pb-8 space-y-8 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-8 border-b border-white/5 pb-8">
                      <div>
                        <div className="text-indigo-400 font-black text-[10px] uppercase mb-4 tracking-widest">Analysis</div>
                        <p className="text-slate-300 text-sm leading-relaxed">{task.deepDive}</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 text-xs text-slate-400 italic">
                        {task.methodology}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 p-8 rounded-[2rem]">
                      <h4 className="text-indigo-400 font-black text-[10px] uppercase mb-6 flex items-center gap-2">Interactive Simulation</h4>
                      <p className="text-lg font-bold mb-6">{task.simulations[simIndex].scenario}</p>
                      <div className="grid gap-3">
                        {task.simulations[simIndex].options.map((opt, i) => (
                          <button key={i} onClick={() => setSimResult(opt)} className={`p-4 rounded-xl text-left text-sm transition-all border ${simResult?.text === opt.text ? (opt.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500') : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                      
                      {simResult && (
                        <div className="mt-6 space-y-4">
                          <div className={`p-4 rounded-xl text-xs font-bold ${simResult.correct ? 'text-emerald-400' : 'text-red-400'}`}>{simResult.feedback}</div>
                          <div className="flex justify-between items-center pt-4">
                            <button onClick={() => { setSimIndex((simIndex + 1) % task.simulations.length); setSimResult(null); }} className="text-xs bg-indigo-600 px-4 py-2 rounded-lg font-black uppercase">Try Another Scenario</button>
                            <button onClick={() => setExpandedTask(null)} className="text-[10px] text-slate-500 italic">collapse small</button>
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

ReactDOM.render(<PMPPrepApp />, document.getElementById('root'));