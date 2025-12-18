const { useState, useEffect } = React;

const PMPApp = () => {
  const domainMap = {
    "People Domain": ["Manage Conflict", "Lead a Team", "Support Performance", "Empower Team", "Train Team", "Build Team", "Address Obstacles", "Negotiate Agreements", "Collaborate Stakeholders", "Build Understanding", "Support Virtual Teams", "Define Team Ground Rules", "Mentor Stakeholders", "Promote Performance"],
    "Process Domain": ["Execute Urgency", "Manage Communications", "Assess Risk", "Engage Stakeholders", "Plan Budget", "Plan Schedule", "Plan Quality", "Plan Scope", "Integrate Planning", "Manage Changes", "Plan Procurement", "Manage Artifacts", "Determine Methodology", "Establish Governance", "Manage Issues", "Transfer Knowledge", "Plan Closure"],
    "Business Domain": ["Plan Compliance", "Evaluate Benefits", "Support Change", "Employ Continuous Improvement"]
  };

  const [view, setView] = useState('executive-hud');
  const [selectedTask, setSelectedTask] = useState('Manage Conflict');
  const [taskDatabase, setTaskDatabase] = useState(null);
  const [subView, setSubView] = useState('overview');

  useEffect(() => {
    fetch('./data/taskData.json')
      .then(res => res.json())
      .then(data => setTaskDatabase(data))
      .catch(err => console.error("Data Load Failure", err));
  }, []);

  if (!taskDatabase) return (
    <div className="text-center p-20 animate-pulse">
      <h1 className="executive-font text-4xl text-white font-semibold tracking-tight">Initializing PMP Prep Center...</h1>
    </div>
  );

  const currentTask = taskDatabase[selectedTask] || { learn: {}, practice: { checklist: [], reflex_prompts: [], stress_test: [] } };

  const GlobalNavFooter = () => (
    <div className="flex justify-center gap-8 mt-12 border-t border-white/10 pt-8">
        <button onClick={() => setView('learn-hub')} className="text-xs text-slate-400 uppercase font-semibold hover:text-blue-400 transition-colors executive-font">Learn</button>
        <button onClick={() => setView('practice-hub')} className="text-xs text-slate-400 uppercase font-semibold hover:text-purple-400 transition-colors executive-font">Practice</button>
        <button onClick={() => setView('strategy-suite')} className="text-xs text-slate-400 uppercase font-semibold hover:text-emerald-400 transition-colors executive-font">Tasks</button>
        <button onClick={() => setView('executive-hud')} className="text-xs text-slate-400 uppercase font-semibold hover:text-blue-400 transition-colors executive-font">Home</button>
    </div>
  );

  // Keep old GlobalFooter for backward compatibility if needed
  const GlobalFooter = GlobalNavFooter;

  // Practice Quizzes View
  if (view === 'practice-quizzes') return (
    <div className="max-w-7xl w-full p-10 animate-fadeIn">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Practice Quizzes</h1>
        <p className="text-slate-400 text-lg">Test your knowledge with targeted practice sessions</p>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => {/* Add quiz navigation */}}
          className="glass-card p-8 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500"
        >
          <h3 className="executive-font text-xl font-semibold text-white mb-3">Quick Practice</h3>
          <p className="text-slate-400 text-sm mb-4">10-20 questions on any topic</p>
          <div className="text-xs text-blue-400 uppercase font-semibold">Start Quiz →</div>
        </button>
        
        <button 
          onClick={() => {/* Add domain quiz navigation */}}
          className="glass-card p-8 text-left hover:bg-purple-500/10 transition-all border-l-4 border-purple-500"
        >
          <h3 className="executive-font text-xl font-semibold text-white mb-3">Domain Focus</h3>
          <p className="text-slate-400 text-sm mb-4">Practice specific domains (People/Process/Business)</p>
          <div className="text-xs text-purple-400 uppercase font-semibold">Start Quiz →</div>
        </button>
        
        <button 
          onClick={() => {/* Add approach quiz navigation */}}
          className="glass-card p-8 text-left hover:bg-emerald-500/10 transition-all border-l-4 border-emerald-500"
        >
          <h3 className="executive-font text-xl font-semibold text-white mb-3">Approach Focus</h3>
          <p className="text-slate-400 text-sm mb-4">Practice methodologies (Agile/Predictive/Hybrid)</p>
          <div className="text-xs text-emerald-400 uppercase font-semibold">Start Quiz →</div>
        </button>
      </div>

      <button 
        onClick={() => setView('executive-hud')} 
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Dashboard
      </button>
      <GlobalNavFooter />
    </div>
  );

  // Deep Dive Analysis View
  if (view === 'deep-dive') return (
    <div className="max-w-6xl w-full p-10 glass-card animate-fadeIn shadow-2xl text-left">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Deep Dive Analysis</h1>
        <p className="text-slate-400 text-lg">{selectedTask}</p>
      </div>
      
      <div className="space-y-6">
        {currentTask.learn?.deep_dive?.foundational_concept && (
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Foundational Concept</h3>
            <div className="text-slate-300 space-y-3">
              <p>{currentTask.learn.deep_dive.foundational_concept}</p>
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.thomas_kilmann_model && (
          <div className="glass-card p-6 border-l-4 border-purple-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Thomas-Kilmann Conflict Model</h3>
            <div className="text-slate-300 space-y-4">
              <p className="mb-4">{currentTask.learn.deep_dive.thomas_kilmann_model.description}</p>
              {currentTask.learn.deep_dive.thomas_kilmann_model.five_modes && (
                <div className="space-y-4">
                  {currentTask.learn.deep_dive.thomas_kilmann_model.five_modes.map((mode, idx) => (
                    <div key={idx} className="border-l-2 border-purple-500/50 pl-4">
                      <h4 className="font-semibold text-white mb-2">{mode.mode}</h4>
                      <p className="text-sm mb-2">{mode.description}</p>
                      <div className="text-xs text-slate-400">
                        <div className="mb-1"><span className="font-semibold">Assertiveness:</span> {mode.assertiveness}</div>
                        <div className="mb-1"><span className="font-semibold">Cooperativeness:</span> {mode.cooperativeness}</div>
                        <div className="mb-1"><span className="font-semibold">Outcome:</span> {mode.outcome}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.step_by_step_process && (
          <div className="glass-card p-6 border-l-4 border-emerald-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Step-by-Step Process</h3>
            <div className="text-slate-300 space-y-4">
              {currentTask.learn.deep_dive.step_by_step_process.map((step, idx) => (
                <div key={idx} className="border-l-2 border-emerald-500/50 pl-4">
                  <h4 className="font-semibold text-white mb-2">Step {step.step}: {step.title}</h4>
                  {step.actions && (
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {step.actions.map((action, actionIdx) => (
                        <li key={actionIdx}>{action}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.common_mistakes && (
          <div className="glass-card p-6 border-l-4 border-rose-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Common Mistakes</h3>
            <div className="text-slate-300 space-y-3">
              {currentTask.learn.deep_dive.common_mistakes.map((mistake, idx) => (
                <div key={idx} className="border-l-2 border-rose-500/50 pl-4">
                  <h4 className="font-semibold text-white mb-1">{mistake.mistake}</h4>
                  <p className="text-sm text-slate-400 mb-1"><span className="font-semibold">Consequence:</span> {mistake.consequence}</p>
                  <p className="text-sm text-emerald-400"><span className="font-semibold">Correction:</span> {mistake.correction}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTask.learn?.deep_dive?.emotional_intelligence_connection && (
          <div className="glass-card p-6 border-l-4 border-cyan-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Emotional Intelligence Connection</h3>
            <div className="text-slate-300 space-y-3 text-sm">
              <div><span className="font-semibold text-white">Self-Awareness:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.self_awareness}</div>
              <div><span className="font-semibold text-white">Self-Management:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.self_management}</div>
              <div><span className="font-semibold text-white">Social Awareness:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.social_awareness}</div>
              <div><span className="font-semibold text-white">Relationship Management:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.relationship_management}</div>
            </div>
          </div>
        )}

        {!currentTask.learn?.deep_dive && (
          <div className="glass-card p-6 border-l-4 border-blue-500">
            <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Detailed Breakdown</h3>
            <div className="text-slate-300 space-y-3">
              <p className="italic text-slate-500">Detailed analysis coming soon...</p>
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => setView('learn-hub')} 
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Learning
      </button>
      <GlobalNavFooter />
    </div>
  );

  // Activity Picker View (Practice Hub)
  if (view === 'activity-picker') return (
    <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Practice Hub</h1>
        <p className="text-slate-400 text-lg">Choose your practice activity for {selectedTask}</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-8">
        <button 
          onClick={() => {/* Add checklist practice */}}
          className="glass-card p-8 text-left hover:bg-purple-500/10 transition-all border-l-4 border-purple-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Checklist Practice</h3>
          <p className="text-slate-400 text-sm">Review and practice key checklists for this task</p>
        </button>
        
        <button 
          onClick={() => {/* Add reflex prompts */}}
          className="glass-card p-8 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Reflex Prompts</h3>
          <p className="text-slate-400 text-sm">Practice quick decision-making scenarios</p>
        </button>
        
        <button 
          onClick={() => {/* Add stress test */}}
          className="glass-card p-8 text-left hover:bg-rose-500/10 transition-all border-l-4 border-rose-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Stress Test</h3>
          <p className="text-slate-400 text-sm">Challenge yourself with advanced scenarios</p>
        </button>
        
        <button 
          onClick={() => setView('practice-quizzes')}
          className="glass-card p-8 text-left hover:bg-emerald-500/10 transition-all border-l-4 border-emerald-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Quick Quiz</h3>
          <p className="text-slate-400 text-sm">Test your knowledge with practice questions</p>
        </button>
      </div>

      <button 
        onClick={() => setView('task-interstitial')} 
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Task
      </button>
      <GlobalNavFooter />
    </div>
  );

  // Statistics View Component
  if (view === 'statistics') return (
    <div className="max-w-7xl w-full p-10 animate-fadeIn">
      <div className="executive-header mb-8">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">The Statistics</h1>
        <p className="text-slate-400 text-lg">Comprehensive performance metrics and analytics</p>
      </div>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Total Questions</div>
          <div className="text-4xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-slate-500">Practice sessions completed</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Accuracy Rate</div>
          <div className="text-4xl font-bold text-white mb-1">0%</div>
          <div className="text-xs text-slate-500">Overall performance</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Study Hours</div>
          <div className="text-4xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-slate-500">Time invested</div>
        </div>
        <div className="stat-card">
          <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Current Streak</div>
          <div className="text-4xl font-bold text-white mb-1">0</div>
          <div className="text-xs text-slate-500">Days in a row</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Domain Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">People Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Process Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Business Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm text-slate-400 italic">No recent activity</div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Achievements</h3>
          <div className="text-sm text-slate-400 italic">No achievements unlocked yet</div>
        </div>
      </div>

      <button 
        onClick={() => setView('executive-hud')} 
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Dashboard
      </button>
      <GlobalNavFooter />
    </div>
  );

  if (view === 'executive-hud') return (
    <div className="max-w-7xl w-full p-10 animate-fadeIn">
      <div className="executive-header mb-12">
        <h1 className="executive-font text-6xl font-bold text-white mb-3 tracking-tight">PMP Prep Center</h1>
        <p className="text-slate-400 text-xl">Executive Learning Platform</p>
      </div>

      {/* Progress Meters Section */}
      <div className="mb-10">
        <h2 className="executive-font text-2xl font-semibold text-white mb-6 tracking-wide">The Statistics</h2>
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="stat-card">
            <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Total Questions</div>
            <div className="text-4xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-slate-500">Practice sessions completed</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Accuracy Rate</div>
            <div className="text-4xl font-bold text-white mb-1">0%</div>
            <div className="text-xs text-slate-500">Overall performance</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Study Hours</div>
            <div className="text-4xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-slate-500">Time invested</div>
          </div>
          <div className="stat-card">
            <div className="text-sm text-slate-400 uppercase font-semibold mb-2 tracking-wide">Current Streak</div>
            <div className="text-4xl font-bold text-white mb-1">0</div>
            <div className="text-xs text-slate-500">Days in a row</div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="executive-font text-lg font-semibold text-white mb-4 uppercase tracking-wide">Domain Performance</h3>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">People Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Process Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-purple-500 h-2.5 rounded-full transition-all" style={{width: '0%'}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">Business Domain</span>
                <span className="text-sm font-semibold text-white">0%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div className="bg-emerald-500 h-2.5 rounded-full transition-all" style={{width: '0%'}}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Action Buttons */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <button 
          onClick={() => setView('strategy-suite')} 
          className="executive-btn p-12 text-left group"
        >
          <div className="text-blue-400 text-sm uppercase font-semibold mb-3 tracking-widest executive-font">Learning Lab</div>
          <div className="text-3xl font-bold text-white mb-2 executive-font">Interactive Study Hub</div>
          <div className="text-slate-400 text-sm">Explore comprehensive PMP knowledge domains and tasks</div>
        </button>
        
        <button 
          onClick={() => setView('practice-quizzes')} 
          className="executive-btn p-12 text-left group"
        >
          <div className="text-purple-400 text-sm uppercase font-semibold mb-3 tracking-widest executive-font">Practice Quizzes</div>
          <div className="text-3xl font-bold text-white mb-2 executive-font">Test Your Knowledge</div>
          <div className="text-slate-400 text-sm">Practice with targeted quizzes and assessments</div>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <button 
          onClick={() => {/* Add Formula Lab navigation */}} 
          className="executive-btn p-12 text-left group"
        >
          <div className="text-emerald-400 text-sm uppercase font-semibold mb-3 tracking-widest executive-font">Formula Lab</div>
          <div className="text-3xl font-bold text-white mb-2 executive-font">Essential Formulas</div>
          <div className="text-slate-400 text-sm">Master key PMP calculations and formulas</div>
        </button>
        
        <button 
          onClick={() => {/* Add Mock Exam navigation */}} 
          className="executive-btn p-12 text-left group"
        >
          <div className="text-rose-400 text-sm uppercase font-semibold mb-3 tracking-widest executive-font">Full Mock Exam</div>
          <div className="text-3xl font-bold text-white mb-2 executive-font">Complete Simulation</div>
          <div className="text-slate-400 text-sm">Full-length 180-question practice exam</div>
          </button>
      </div>
      <GlobalNavFooter />
    </div>
  );

  if (view === 'strategy-suite') return (
    <div className="max-w-[95%] w-full p-12 animate-fadeIn text-left">
      <div className="executive-header mb-10">
        <h2 className="executive-font text-4xl font-bold text-white mb-2 tracking-tight">Learning Lab</h2>
        <p className="text-slate-400 text-lg">Explore PMP knowledge domains and tasks</p>
      </div>
      <div className="grid grid-cols-3 gap-8">
        {Object.entries(domainMap).map(([d, tasks]) => (
          <div key={d} className="glass-card p-6 border-t-4 border-blue-500/50">
            <h3 className="executive-font text-blue-400 mb-6 uppercase text-sm font-bold tracking-widest">{d}</h3>
            <div className="space-y-1 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
              {tasks.map(t => (
                <button 
                  key={t} 
                  onClick={() => { setSelectedTask(t); setView('task-interstitial'); }} 
                  className="task-btn"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <GlobalNavFooter />
    </div>
  );

  if (view === 'task-interstitial') return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-12 animate-fadeIn text-left">
      <div className="max-w-5xl w-full p-16 glass-card border-white/10 shadow-2xl">
          <h1 className="executive-font text-5xl font-bold text-white mb-16 tracking-tight text-center">{selectedTask}</h1>
          <div className="grid grid-cols-2 gap-8 text-center">
              <button onClick={() => setView('learn-hub')} className="executive-btn p-16 border-blue-500/30 hover:bg-blue-500/10 transition-all">
                <h3 className="executive-font text-4xl text-blue-400 font-bold mb-3">Learn</h3>
                <p className="text-slate-400 text-sm">Explore concepts and strategies</p>
              </button>
              <button onClick={() => setView('practice-hub')} className="executive-btn p-16 border-purple-500/30 hover:bg-purple-500/10 transition-all">
                <h3 className="executive-font text-4xl text-purple-400 font-bold mb-3">Practice Hub</h3>
                <p className="text-slate-400 text-sm">Practice with exercises and quizzes</p>
              </button>
          </div>
          <GlobalNavFooter />
      </div>
    </div>
  );

  // Practice Hub View
  if (view === 'practice-hub') return (
    <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
      <div className="executive-header mb-10">
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Practice Hub</h1>
        <p className="text-slate-400 text-lg">Choose your practice activity for {selectedTask}</p>
      </div>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => {/* Checklist Practice */}}
          className="glass-card p-8 text-left hover:bg-purple-500/10 transition-all border-l-4 border-purple-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Checklist Practice</h3>
          <p className="text-slate-400 text-sm">Review and practice key checklists for this task</p>
        </button>
        
        <button 
          onClick={() => {/* Reflex Prompts */}}
          className="glass-card p-8 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Reflex Prompts</h3>
          <p className="text-slate-400 text-sm">Practice quick decision-making scenarios</p>
        </button>
        
        <button 
          onClick={() => {/* Stress Test */}}
          className="glass-card p-8 text-left hover:bg-rose-500/10 transition-all border-l-4 border-rose-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Stress Test</h3>
          <p className="text-slate-400 text-sm">Challenge yourself with advanced scenarios</p>
        </button>
        
        <button 
          onClick={() => setView('practice-quizzes')}
          className="glass-card p-8 text-left hover:bg-emerald-500/10 transition-all border-l-4 border-emerald-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Quick Quiz</h3>
          <p className="text-slate-400 text-sm">Test your knowledge with practice questions</p>
        </button>

        <button 
          onClick={() => {/* Activity Picker */}}
          className="glass-card p-8 text-left hover:bg-cyan-500/10 transition-all border-l-4 border-cyan-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Activity Picker</h3>
          <p className="text-slate-400 text-sm">Browse all available practice activities</p>
        </button>

        <button 
          onClick={() => {/* Mock Exam */}}
          className="glass-card p-8 text-left hover:bg-yellow-500/10 transition-all border-l-4 border-yellow-500"
        >
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Mock Exam</h3>
          <p className="text-slate-400 text-sm">Full-length exam simulation</p>
        </button>
      </div>

      <GlobalNavFooter />
    </div>
  );

  if (view === 'learn-hub') return (
    <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
      {/* Header with Back Button */}
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setView('task-interstitial')}
            className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
        </div>
        <h1 className="executive-font text-5xl font-bold text-white tracking-tight mb-6">{selectedTask}</h1>
        
        {/* Tab Navigation */}
        <div className="flex gap-8 border-b border-white/10">
          <button 
            onClick={() => setSubView('overview')} 
            className={`px-4 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
              subView === 'overview' 
                ? 'text-white border-b-2 border-cyan-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Overview
          </button>
          <button 
            onClick={() => setSubView('pmp-application')} 
            className={`px-4 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
              subView === 'pmp-application' 
                ? 'text-white border-b-2 border-cyan-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            PMP Application
          </button>
          <button 
            onClick={() => setSubView('deep-dive')} 
            className={`px-4 py-3 executive-font text-xs font-semibold uppercase transition-all relative ${
              subView === 'deep-dive' 
                ? 'text-white border-b-2 border-cyan-400' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Deep Dive
          </button>
        </div>
      </header>

      {/* Content Area with Smooth Transitions */}
      <div className="min-h-[400px] max-h-[70vh] overflow-y-auto custom-scrollbar">
        {subView === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {currentTask.learn?.overview?.definition && (
              <div className="glass-card p-10 border-l-4 border-blue-500 bg-white/[0.02]">
                <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Definition</h3>
                <p className="text-3xl text-white font-light italic leading-tight">"{currentTask.learn.overview.definition}"</p>
              </div>
            )}
            
            {currentTask.learn?.overview?.exam_triggers && currentTask.learn.overview.exam_triggers.length > 0 && (
              <div className="glass-card p-6 border-l-4 border-purple-500">
                <h3 className="executive-font text-lg font-semibold text-white mb-4 uppercase tracking-wide">Exam Triggers</h3>
                <ul className="space-y-2">
                  {currentTask.learn.overview.exam_triggers.map((trigger, idx) => (
                    <li key={idx} className="text-slate-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>{trigger}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {currentTask.learn?.overview?.pmi_hierarchy && currentTask.learn.overview.pmi_hierarchy.length > 0 && (
              <div className="glass-card p-6 border-l-4 border-emerald-500">
                <h3 className="executive-font text-lg font-semibold text-white mb-4 uppercase tracking-wide">PMI Hierarchy of Conflict Resolution</h3>
                <div className="space-y-3">
                  {currentTask.learn.overview.pmi_hierarchy.map((item, idx) => (
                    <div key={idx} className="border-l-2 border-emerald-500/50 pl-4">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl">{item.emoji}</span>
                        <span className="font-semibold text-white">{item.rank}. {item.mode}</span>
                      </div>
                      <p className="text-sm text-slate-300 mb-1"><span className="font-semibold">When:</span> {item.when}</p>
                      <p className="text-sm text-emerald-400 italic">{item.exam_tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentTask.learn?.overview?.quick_scenarios && currentTask.learn.overview.quick_scenarios.length > 0 && (
              <div className="glass-card p-6 border-l-4 border-cyan-500">
                <h3 className="executive-font text-lg font-semibold text-white mb-4 uppercase tracking-wide">Quick Scenarios</h3>
                <div className="space-y-4">
                  {currentTask.learn.overview.quick_scenarios.map((scenario, idx) => (
                    <div key={idx} className="border-l-2 border-cyan-500/50 pl-4">
                      <p className="text-white font-semibold mb-2">{scenario.scenario}</p>
                      <p className="text-sm text-red-400 mb-1"><span className="font-semibold">Wrong:</span> {scenario.wrong_answer}</p>
                      <p className="text-sm text-emerald-400 mb-1"><span className="font-semibold">Right:</span> {scenario.right_answer}</p>
                      <p className="text-sm text-slate-400 italic">{scenario.why}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!currentTask.learn?.overview && !currentTask.learn?.definition && (
              <div className="glass-card p-10 border-l-4 border-blue-500 bg-white/[0.02]">
                <p className="text-3xl text-white font-light italic leading-tight">"Briefing Locked."</p>
              </div>
            )}
          </div>
        )}

        {subView === 'pmp-application' && (
            <div className="space-y-6 animate-fadeIn">
              {currentTask.learn?.pmp_application?.exam_strategy && (
                <div className="glass-card p-6 border-l-4 border-purple-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Exam Strategy</h3>
                  <p className="text-slate-300">{currentTask.learn.pmp_application.exam_strategy}</p>
                </div>
              )}

              {currentTask.learn?.pmp_application?.question_patterns && currentTask.learn.pmp_application.question_patterns.length > 0 && (
                <div className="glass-card p-6 border-l-4 border-blue-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Question Patterns</h3>
                  <div className="space-y-4">
                    {currentTask.learn.pmp_application.question_patterns.map((pattern, idx) => (
                      <div key={idx} className="border-l-2 border-blue-500/50 pl-4">
                        <h4 className="font-semibold text-white mb-2">{pattern.pattern}</h4>
                        <p className="text-sm text-slate-300 mb-2">{pattern.setup}</p>
                        <div className="text-sm space-y-1 mb-2">
                          <p className="text-red-400"><span className="font-semibold">Distractor 1:</span> {pattern.distractor_1} - {pattern.why_wrong_1}</p>
                          <p className="text-red-400"><span className="font-semibold">Distractor 2:</span> {pattern.distractor_2} - {pattern.why_wrong_2}</p>
                          <p className="text-red-400"><span className="font-semibold">Distractor 3:</span> {pattern.distractor_3} - {pattern.why_wrong_3}</p>
                        </div>
                        <p className="text-emerald-400 font-semibold"><span className="font-bold">Correct:</span> {pattern.correct}</p>
                        <p className="text-sm text-emerald-300 italic">{pattern.why_correct}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTask.learn?.pmp_application?.agile_vs_traditional && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-6 border-l-4 border-orange-500">
                    <h4 className="executive-font text-lg font-semibold text-white mb-3">Traditional Context</h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      <p><span className="font-semibold">PM Role:</span> {currentTask.learn.pmp_application.agile_vs_traditional.traditional_context.pm_role}</p>
                      <p><span className="font-semibold">Approach:</span> {currentTask.learn.pmp_application.agile_vs_traditional.traditional_context.approach}</p>
                      <p><span className="font-semibold">Escalation:</span> {currentTask.learn.pmp_application.agile_vs_traditional.traditional_context.escalation}</p>
                    </div>
                  </div>
                  <div className="glass-card p-6 border-l-4 border-emerald-500">
                    <h4 className="executive-font text-lg font-semibold text-white mb-3">Agile Context</h4>
                    <div className="text-sm text-slate-300 space-y-2">
                      <p><span className="font-semibold">PM Role:</span> {currentTask.learn.pmp_application.agile_vs_traditional.agile_context.pm_role}</p>
                      <p><span className="font-semibold">Approach:</span> {currentTask.learn.pmp_application.agile_vs_traditional.agile_context.approach}</p>
                      <p><span className="font-semibold">Escalation:</span> {currentTask.learn.pmp_application.agile_vs_traditional.agile_context.escalation}</p>
                    </div>
                  </div>
                </div>
              )}

              {currentTask.learn?.pmp_application?.decision_tree_visual && (
                <div className="glass-card p-6 border-l-4 border-cyan-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Decision Tree</h3>
                  <p className="text-slate-300 font-mono text-sm">{currentTask.learn.pmp_application.decision_tree_visual}</p>
                </div>
              )}
            </div>
        )}

        {subView === 'deep-dive' && (
          <div className="space-y-6 animate-fadeIn">
              {currentTask.learn?.deep_dive?.foundational_concept && (
                <div className="glass-card p-6 border-l-4 border-blue-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Foundational Concept</h3>
                  <div className="text-slate-300 space-y-3">
                    <p>{currentTask.learn.deep_dive.foundational_concept}</p>
                  </div>
                </div>
              )}

              {currentTask.learn?.deep_dive?.thomas_kilmann_model && (
                <div className="glass-card p-6 border-l-4 border-purple-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Thomas-Kilmann Conflict Model</h3>
                  <div className="text-slate-300 space-y-4">
                    <p className="mb-4">{currentTask.learn.deep_dive.thomas_kilmann_model.description}</p>
                    {currentTask.learn.deep_dive.thomas_kilmann_model.five_modes && (
                      <div className="space-y-4">
                        {currentTask.learn.deep_dive.thomas_kilmann_model.five_modes.map((mode, idx) => (
                          <div key={idx} className="border-l-2 border-purple-500/50 pl-4">
                            <h4 className="font-semibold text-white mb-2">{mode.mode}</h4>
                            <p className="text-sm mb-2">{mode.description}</p>
                            <div className="text-xs text-slate-400">
                              <div className="mb-1"><span className="font-semibold">Assertiveness:</span> {mode.assertiveness}</div>
                              <div className="mb-1"><span className="font-semibold">Cooperativeness:</span> {mode.cooperativeness}</div>
                              <div className="mb-1"><span className="font-semibold">Outcome:</span> {mode.outcome}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {currentTask.learn?.deep_dive?.step_by_step_process && (
                <div className="glass-card p-6 border-l-4 border-emerald-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Step-by-Step Process</h3>
                  <div className="text-slate-300 space-y-4">
                    {currentTask.learn.deep_dive.step_by_step_process.map((step, idx) => (
                      <div key={idx} className="border-l-2 border-emerald-500/50 pl-4">
                        <h4 className="font-semibold text-white mb-2">Step {step.step}: {step.title}</h4>
                        {step.actions && (
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {step.actions.map((action, actionIdx) => (
                              <li key={actionIdx}>{action}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTask.learn?.deep_dive?.common_mistakes && (
                <div className="glass-card p-6 border-l-4 border-rose-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Common Mistakes</h3>
                  <div className="text-slate-300 space-y-3">
                    {currentTask.learn.deep_dive.common_mistakes.map((mistake, idx) => (
                      <div key={idx} className="border-l-2 border-rose-500/50 pl-4">
                        <h4 className="font-semibold text-white mb-1">{mistake.mistake}</h4>
                        <p className="text-sm text-slate-400 mb-1"><span className="font-semibold">Consequence:</span> {mistake.consequence}</p>
                        <p className="text-sm text-emerald-400"><span className="font-semibold">Correction:</span> {mistake.correction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentTask.learn?.deep_dive?.emotional_intelligence_connection && (
                <div className="glass-card p-6 border-l-4 border-cyan-500">
                  <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Emotional Intelligence Connection</h3>
                  <div className="text-slate-300 space-y-3 text-sm">
                    <div><span className="font-semibold text-white">Self-Awareness:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.self_awareness}</div>
                    <div><span className="font-semibold text-white">Self-Management:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.self_management}</div>
                    <div><span className="font-semibold text-white">Social Awareness:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.social_awareness}</div>
                    <div><span className="font-semibold text-white">Relationship Management:</span> {currentTask.learn.deep_dive.emotional_intelligence_connection.relationship_management}</div>
                  </div>
                </div>
              )}
          </div>
        )}
      </div>
      <GlobalNavFooter />
    </div>
  );

  return (
    <div className="p-20 text-center">
      <h1 className="executive-font text-4xl text-white animate-pulse font-semibold">Initializing PMP Prep Center...</h1>
      <GlobalNavFooter />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PMPApp />);