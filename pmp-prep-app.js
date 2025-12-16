const { useState, useEffect } = React;

// --- DYNAMIC ICON COMPONENT ---
const LucideIcon = ({ name, className }) => {
  useEffect(() => { if(window.lucide) lucide.createIcons(); }, [name]);
  return <i data-lucide={name} className={className}></i>;
};

// --- DATA: THE 35 SURGICAL TASK BREAKDOWNS ---
const ECO_TASKS = {
  people: [
    { 
      id: 'P1', title: 'Manage Conflict', 
      deepDive: 'Conflict management focuses on identifying the source (Resources, Priorities, Personalities) and applying the right resolution technique. Functional conflict improves the product; Dysfunctional conflict hurts morale.',
      surgicalSteps: ['Determine conflict source/stage.', 'Assess impact on timeline.', 'Apply resolution: Collaborate, Compromise, Force, Smooth, or Withdraw.'],
      methodology: 'Agile: Scrum Master facilitates team self-resolution. Waterfall: PM acts as direct mediator.',
      simulation: {
        scenario: "Two senior developers disagree on the sprint priority. Morale is dropping. What is your FIRST move?",
        options: [
          { text: "Facilitate a data-backed discussion.", correct: true, feedback: "Correct! Collaborate/Problem-Solve is the PMI preferred method." },
          { text: "Escalate to the Sponsor.", correct: false, feedback: "Incorrect. Try to resolve at your level first." }
        ]
      }
    },
    { 
      id: 'P2', title: 'Lead a Team', 
      deepDive: 'Focus on Servant Leadership. You serve the team by removing blockers and shielding them from outside interference. Adjust your leadership style based on team maturity (Tuckman’s Model).',
      surgicalSteps: ['Set clear vision/mission.', 'Practice empathy and Emotional Intelligence.', 'Foster D&I (Diversity & Inclusion).'],
      methodology: 'Agile: Servant Leader (Facilitator). Predictive: Transactional/Transformational Leader.',
      simulation: {
        scenario: "A high-performing team member is suddenly underperforming and quiet. What do you do?",
        options: [
          { text: "Schedule a private check-in to offer support.", correct: true, feedback: "Correct! Empathetic leadership identifies root blockers." },
          { text: "Document performance for HR.", correct: false, feedback: "Incorrect. Seek to understand before punishing." }
        ]
      }
    },
    { id: 'P3', title: 'Support Performance', deepDive: 'Mentoring and coaching for continuous growth.', surgicalSteps: ['Verify progress.', 'Coach team members.', 'Recognize achievements.'], methodology: 'Agile: Retrospectives. Waterfall: Performance Reviews.', simulation: { scenario: "The team velocity is dipping. How do you respond?", options: [{ text: "Hold a retrospective to find blockers.", correct: true, feedback: "Correct!" }, { text: "Ask team to work overtime.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P4', title: 'Empower Team', deepDive: 'Delegating authority to foster self-organization.', surgicalSteps: ['Define boundaries.', 'Delegate decisions.', 'Encourage ownership.'], methodology: 'Agile: Self-organizing teams.', simulation: { scenario: "A team member asks you to solve a technical bug they found.", options: [{ text: "Encourage them to propose a solution first.", correct: true, feedback: "Correct!" }, { text: "Solve it yourself to save time.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P5', title: 'Ensure Training', deepDive: 'Proactive skill building as a risk response.', surgicalSteps: ['Assess skill gaps.', 'Determine budget.', 'Measure outcomes.'], methodology: 'Agile: Peer-pairing.', simulation: { scenario: "The project needs a new coding language the team doesn't know.", options: [{ text: "Build training time into the schedule.", correct: true, feedback: "Correct!" }, { text: "Hire contractors to do the work.", correct: false, feedback: "Not the first choice." }] } },
    { id: 'P6', title: 'Build a Team', deepDive: 'Using Tuckman’s model (Forming, Storming, Norming, Performing).', surgicalSteps: ['Assess team skills.', 'Define ground rules.', 'Sync distributed members.'], methodology: 'Agile: T-Shaped skills.', simulation: { scenario: "The new team is arguing over every decision.", options: [{ text: "Facilitate a ground-rules workshop.", correct: true, feedback: "Correct!" }, { text: "Replace the team.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P7', title: 'Address Impediments', deepDive: 'Scrum Master\'s primary duty: Clearing the path.', surgicalSteps: ['Identify blockers.', 'Prioritize fixes.', 'Verify resolution.'], methodology: 'Agile: Daily Standups.', simulation: { scenario: "A developer is waiting 3 days for a server password.", options: [{ text: "Immediately contact the DevOps lead.", correct: true, feedback: "Correct!" }, { text: "Wait for the status report.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P8', title: 'Negotiate Agreements', deepDive: 'Managing internal/external expectations.', surgicalSteps: ['Define scope.', 'Analyze interests.', 'Document sign-off.'], methodology: 'Predictive: Signed SOWs.', simulation: { scenario: "A stakeholder wants to add scope without more budget.", options: [{ text: "Explain the impact and negotiate priorities.", correct: true, feedback: "Correct!" }, { text: "Just say yes to maintain relationship.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P9', title: 'Collaborate Stakeholders', deepDive: 'Engagement levels: Unaware, Resistant, Neutral, Supportive, Leading.', surgicalSteps: ['Analyze power/interest.', 'Tailor engagement.', 'Build trust.'], methodology: 'Hybrid: Consistent feedback loops.', simulation: { scenario: "A resistant stakeholder is blocking project sign-off.", options: [{ text: "Involve them in early decision-making.", correct: true, feedback: "Correct!" }, { text: "Ignore them.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P10', title: 'Shared Understanding', deepDive: 'Aligning on project vision and goals.', surgicalSteps: ['Facilitate consensus.', 'Resolve misalignments.', 'Publish Vision.'], methodology: 'Agile: Product Backlog Refinement.', simulation: { scenario: "The team and client disagree on 'Done'.", options: [{ text: "Collaboratively define 'Definition of Done'.", correct: true, feedback: "Correct!" }, { text: "Use your own definition.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P11', title: 'Virtual Teams', deepDive: 'Managing distance, time zones, and technology.', surgicalSteps: ['Pick tools.', 'Create sync points.', 'Foster culture.'], methodology: 'Distributed Agile teams.', simulation: { scenario: "Remote team members feel left out of office decisions.", options: [{ text: "Move all decisions to a digital wiki/Slack.", correct: true, feedback: "Correct!" }, { text: "Only hire local.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P12', title: 'Ground Rules', deepDive: 'Team Charter / Social Contract creation.', surgicalSteps: ['Facilitate creation.', 'Ensure team ownership.', 'Review rules periodically.'], methodology: 'Agile: Daily standup rules.', simulation: { scenario: "A member is consistently late to meetings.", options: [{ text: "Refer to the Team Charter rules.", correct: true, feedback: "Correct!" }, { text: "Report to HR.", correct: false, feedback: "Too soon." }] } },
    { id: 'P13', title: 'Mentor Stakeholders', deepDive: 'Coaching POs and Sponsors on the PM process.', surgicalSteps: ['Identify coaching needs.', 'Allocate mentoring time.', 'Verify value.'], methodology: 'Agile: Coaching the Product Owner.', simulation: { scenario: "The PO doesn't understand why we have retrospectives.", options: [{ text: "Mentor them on the value of improvement.", correct: true, feedback: "Correct!" }, { text: "Cancel the meeting.", correct: false, feedback: "Incorrect." }] } },
    { id: 'P14', title: 'Emotional Intelligence', deepDive: 'Self-awareness, self-regulation, empathy.', surgicalSteps: ['Assess own bias.', 'Analyze team moods.', 'Regulate social interactions.'], methodology: 'PMI Leadership Competency.', simulation: { scenario: "The PM feels angry about a client criticism.", options: [{ text: "Pause, self-regulate, and respond calmly.", correct: true, feedback: "Correct!" }, { text: "React immediately.", correct: false, feedback: "Incorrect." }] } }
  ],
  process: [],
  business: []
};

const PMPMasteryApp = () => {
  const [currentMode, setCurrentMode] = useState('dashboard');
  const [studyTab, setStudyTab] = useState('tasks');
  const [expandedTask, setExpandedTask] = useState(null);
  const [simResult, setSimResult] = useState(null);
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('pmp_m26_final');
    return saved ? JSON.parse(saved) : { attempted: 0, correct: 0, streak: 1 };
  });

  useEffect(() => { localStorage.setItem('pmp_m26_final', JSON.stringify(progress)); }, [progress]);

  // --- VIEW: DASHBOARD ---
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <header className="mb-12">
            <h1 className="text-6xl font-black italic bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tighter leading-none mb-4">PMP MASTERY 2026</h1>
            <div className="flex flex-wrap gap-3">
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                <LucideIcon name="shield-check" className="w-3 h-3" /> Progress Saved to this Device
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-2 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                <LucideIcon name="database" className="w-3 h-3" /> No Account Required
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <aside className="space-y-6">
              <div className="glass p-8 rounded-[2rem]">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Local Progress</h3>
                <div className="text-4xl font-black mb-1">{progress.attempted}</div>
                <div className="text-xs text-slate-400 font-bold uppercase">Questions Answered</div>
              </div>
              <button onClick={() => setCurrentMode('quiz_select')} className="w-full bg-indigo-600 hover:bg-indigo-500 p-8 rounded-[2.5rem] transition-all flex items-center justify-between group">
                <div className="text-left font-black text-xl">TOPIC DRILLS</div>
                <LucideIcon name="zap" className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
              <button onClick={() => setCurrentMode('studyhub')} className="w-full glass hover:bg-white/5 p-8 rounded-[2.5rem] transition-all flex items-center justify-between group">
                <div className="text-left font-black text-xl">STUDY HUB</div>
                <LucideIcon name="book-open" className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
              </button>
            </aside>

            <main className="lg:col-span-2">
              <div className="h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-[3rem] p-10 md:p-14 flex flex-col justify-between group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity"><LucideIcon name="award" className="w-64 h-64 text-white" /></div>
                <div>
                  <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase w-fit mb-6">Hero Mode</div>
                  <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">Full Exam Simulation</h2>
                  <p className="text-slate-400 text-lg max-w-sm mb-10">Realistic 180-question simulation. Timed for 230 minutes.</p>
                </div>
                <button className="bg-white text-indigo-950 px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all w-fit shadow-2xl">BEGIN SIMULATION</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW: STUDY HUB ---
  if (currentMode === 'studyhub') {
    return (
      <div className="min-h-screen p-6 md:p-12 bg-[#0f172a] text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 font-bold hover:text-white flex items-center gap-2"><LucideIcon name="arrow-left" className="w-4 h-4"/> BACK</button>
            <h2 className="text-2xl font-black italic text-purple-400">STUDY HUB</h2>
          </div>

          <nav className="flex glass p-1 rounded-3xl mb-12 no-scrollbar overflow-x-auto">
            {['tasks', 'formulas', 'agile'].map(t => (
              <button key={t} onClick={() => {setStudyTab(t); setExpandedTask(null);}} className={`flex-1 min-w-[120px] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${studyTab === t ? 'bg-indigo-600 shadow-xl' : 'text-slate-500'}`}>{t}</button>
            ))}
          </nav>

          <div className="space-y-6">
            {studyTab === 'tasks' && ECO_TASKS.people.map(task => (
              <div key={task.id} className="glass rounded-[2rem] overflow-hidden transition-all border-white/5 border">
                <div onClick={() => {setExpandedTask(expandedTask === task.id ? null : task.id); setSimResult(null);}} className="p-8 flex justify-between items-center cursor-pointer hover:bg-white/5">
                  <div className="flex items-center gap-4">
                    <span className="bg-indigo-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">{task.id}</span>
                    <h3 className="text-xl font-bold">{task.title}</h3>
                  </div>
                  <LucideIcon name={expandedTask === task.id ? "chevron-up" : "chevron-down"} className="text-slate-500" />
                </div>

                {expandedTask === task.id && (
                  <div className="px-8 pb-8 animate-fadeIn space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="text-indigo-400 font-black text-[10px] uppercase tracking-widest">Surgical Deep Dive</div>
                        <p className="text-slate-300 text-sm leading-relaxed">{task.deepDive}</p>
                        <div className="space-y-2">
                          {task.surgicalSteps.map((step, i) => (
                            <div key={i} className="flex gap-3 text-xs text-slate-400 italic">
                               <LucideIcon name="arrow-right" className="w-3 h-3 text-indigo-500 mt-1" /> {step}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 h-fit">
                        <div className="text-purple-400 font-black text-[10px] uppercase tracking-widest mb-3">Agile vs Waterfall</div>
                        <p className="text-slate-400 text-xs leading-relaxed italic">{task.methodology}</p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border border-indigo-500/20 p-8 rounded-[2rem]">
                      <h4 className="text-indigo-400 font-black text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
                        <LucideIcon name="zap" className="w-4 h-4 fill-current" /> Interactive Simulation
                      </h4>
                      <p className="text-lg font-bold mb-6">{task.simulation.scenario}</p>
                      <div className="grid gap-3">
                        {task.simulation.options.map((opt, i) => (
                          <button key={i} onClick={() => setSimResult(opt)} className={`p-4 rounded-xl text-left text-sm transition-all border ${simResult?.text === opt.text ? (opt.correct ? 'bg-emerald-500/20 border-emerald-500' : 'bg-red-500/20 border-red-500') : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
                            {opt.text}
                          </button>
                        ))}
                      </div>
                      {simResult && <div className={`mt-6 p-4 rounded-xl text-xs font-bold animate-fadeIn ${simResult.correct ? 'text-emerald-400 bg-emerald-400/5' : 'text-red-400 bg-red-400/5'}`}>{simResult.feedback}</div>}
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

  // --- VIEW: QUIZ SELECTION ---
  if (currentMode === 'quiz_select') {
    return (
      <div className="min-h-screen p-12 bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => setCurrentMode('dashboard')} className="text-slate-400 font-bold hover:text-white mb-12 flex items-center gap-2"><LucideIcon name="arrow-left" className="w-4 h-4"/> BACK</button>
          <h2 className="text-5xl font-black mb-12 italic tracking-tighter">SELECT TOPIC DRILL</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {['People', 'Process', 'Business'].map(domain => (
              <div key={domain} className="glass p-10 rounded-[3rem] hover:scale-105 transition-all cursor-pointer group hover:border-indigo-500">
                 <div className="text-4xl mb-6">{domain === 'People' ? '👥' : domain === 'Process' ? '⚙️' : '💼'}</div>
                 <h4 className="text-2xl font-black mb-2">{domain} Domain</h4>
                 <p className="text-slate-500 text-sm mb-8">15 Questions • 20 Minutes • Focused Sprint</p>
                 <div className="bg-indigo-600 py-4 rounded-xl text-center font-bold text-xs uppercase tracking-widest shadow-xl">Start Quiz</div>
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