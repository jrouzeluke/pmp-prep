const { useState, useEffect } = React;

const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

// --- DATA: MULTI-SCENARIO SURGICAL TASKS ---
const ECO_TASKS = {
  people: [
    { 
      id: 'P1', title: 'Manage Conflict', 
      deepDive: 'Conflict management focuses on identifying the source and stage to apply the right resolution technique.',
      surgicalSteps: ['Determine conflict source.', 'Analyze stage of escalation.', 'Pick: Collaborate, Compromise, Force, Smooth, or Withdraw.'],
      methodology: 'Agile: Team resolves. Waterfall: PM mediates.',
      simulations: [
        {
          scenario: "Scenario A: Two senior developers disagree on the API architecture. Morale is dropping. What is your FIRST move?",
          options: [
            { text: "Facilitate a data-backed discussion.", correct: true, feedback: "Correct! Collaborate/Problem-Solve is preferred." },
            { text: "Decide for them to save time.", correct: false, feedback: "Incorrect. This is 'Forcing' and kills autonomy." }
          ]
        },
        {
          scenario: "Scenario B: A team member is being aggressive toward others during a meeting. What do you do?",
          options: [
            { text: "Address the behavior privately with the individual.", correct: true, feedback: "Correct! Address conflict early and privately." },
            { text: "Publicly reprimand them to set a standard.", correct: false, feedback: "Incorrect. This creates a toxic environment." }
          ]
        }
      ]
    },
    { 
      id: 'P2', title: 'Lead a Team', 
      deepDive: 'Servant Leadership is the baseline. You remove blockers and shield the team.',
      surgicalSteps: ['Set vision.', 'Practice Emotional Intelligence.', 'Foster Inclusion.'],
      methodology: 'Agile: Facilitator. Waterfall: Direct Manager.',
      simulations: [
        {
          scenario: "Scenario A: A high-performer is suddenly quiet and missing deadlines. How do you lead?",
          options: [
            { text: "Have a private 1-on-1 to identify root blockers.", correct: true, feedback: "Correct! Empathetic leadership." },
            { text: "Issue a performance warning.", correct: false, feedback: "Incorrect. Understand before punishing." }
          ]
        },
        {
          scenario: "Scenario B: The team is confused about the project's long-term goal. What is your move?",
          options: [
            { text: "Re-communicate the Project Vision and Roadmap.", correct: true, feedback: "Correct! Leaders provide clarity." },
            { text: "Tell them to focus on their individual tasks.", correct: false, feedback: "Incorrect. This leads to silos." }
          ]
        }
      ]
    }
    // ... Additional tasks follow the same multi-scenario structure
  ],
  process: [],
  business: []
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [expandedTask, setExpandedTask] = useState(null);
  const [simIndex, setSimIndex] = useState(0);
  const [simResult, setSimResult] = useState(null);
  const [progress, setProgress] = useState({ attempted: 0, correct: 0, streak: 1 });

  // --- DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <header className="mb-12">
            <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">PMP COMMAND CENTER</h1>
            <div className="flex gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-400 text-[10px] font-bold uppercase">Device Storage Active</div>
            </div>
          </header>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="space-y-6">
              <button onClick={() => setCurrentMode('studyhub')} className="w-full glass p-10 rounded-[2.5rem] flex items-center justify-between group">
                <div className="text-left font-black text-xl">STUDY HUB</div>
                <LucideIcon name="book-open" className="w-8 h-8 text-purple-400" />
              </button>
            </aside>
            <main className="lg:col-span-2">
              <div className="h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-[3rem] p-10 md:p-14 flex flex-col justify-between">
                <h2 className="text-5xl font-black mb-6">Full Exam Simulation</h2>
                <button className="bg-white text-indigo-950 px-12 py-5 rounded-2xl font-black text-xl w-fit">BEGIN SIMULATION</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // --- STUDY HUB ---
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
              <button key={t} onClick={() => {setStudyTab(t); setExpandedTask(null);}} className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === t ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500'}`}>{t}</button>
            ))}
          </nav>

          <div className="space-y-6">
            {studyTab === 'tasks' && ECO_TASKS.people.map(task => (
              <div key={task.id} className="glass rounded-[2rem] overflow-hidden transition-all border-white/5 border">
                <div onClick={() => {setExpandedTask(expandedTask === task.id ? null : task.id); setSimResult(null); setSimIndex(0);}} className="p-8 flex justify-between items-center cursor-pointer hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <span className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">{task.id}</span>
                    <h3 className="text-xl font-bold">{task.title}</h3>
                  </div>
                  <LucideIcon name={expandedTask === task.id ? "chevron-up" : "chevron-down"} className="text-slate-500" />
                </div>

                {expandedTask === task.id && (
                  <div className="px-8 pb-8 animate-fadeIn space-y-8">
                    <div className="grid md:grid-cols-2 gap-8 border-b border-white/5 pb-8">
                      <div className="space-y-4">
                        <div className="text-indigo-400 font-black text-[10px] uppercase tracking-widest underline decoration-indigo-500/50 underline-offset-4">Surgical Analysis</div>
                        <p className="text-slate-300 text-sm leading-relaxed">{task.deepDive}</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 h-fit italic text-xs text-slate-400">
                        {task.methodology}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 p-8 rounded-[2rem]">
                      <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                        <LucideIcon name="zap" className="w-4 h-4 fill-current" /> Interactive Simulation
                      </h4>
                      <p className="text-lg font-bold mb-6">{task.simulations[simIndex].scenario}</p>
                      <div className="grid gap-3">
                        {task.simulations[simIndex].options.map((opt, i) => (
                          <button key={i} onClick={() => setSimResult(opt)} className={`p-4 rounded-xl text-left text-sm transition-all border ${simResult?.text === opt.text ? (opt.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500') : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                      
                      {simResult && (
                        <div className="mt-6 space-y-4 animate-fadeIn">
                          <div className={`p-4 rounded-xl text-xs font-bold ${simResult.correct ? 'text-emerald-400 bg-emerald-400/5' : 'text-red-400 bg-red-400/5'}`}>
                            {simResult.feedback}
                          </div>
                          
                          <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <button 
                              onClick={() => {
                                const nextIndex = (simIndex + 1) % task.simulations.length;
                                setSimIndex(nextIndex);
                                setSimResult(null);
                              }}
                              className="text-xs bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-black uppercase tracking-widest flex items-center gap-2"
                            >
                              <LucideIcon name="refresh-cw" className="w-3 h-3" /> Try Another Scenario
                            </button>
                            
                            <button 
                              onClick={() => setExpandedTask(null)}
                              className="text-[10px] text-slate-500 hover:text-white transition-colors italic"
                            >
                              collapse small
                            </button>
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