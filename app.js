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
  const [subView, setSubView] = useState('fundamentals');

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

  const GlobalFooter = () => (
    <div className="flex justify-center gap-8 mt-12 border-t border-white/10 pt-8">
        <button onClick={() => setView('briefing')} className="text-xs text-slate-400 uppercase font-semibold hover:text-blue-400 transition-colors executive-font">Learning Lab</button>
        <button onClick={() => setView('strategy-suite')} className="text-xs text-slate-400 uppercase font-semibold hover:text-purple-400 transition-colors executive-font">Strategy Suite</button>
        <button onClick={() => setView('executive-hud')} className="text-xs text-slate-400 uppercase font-semibold hover:text-blue-400 transition-colors executive-font">Dashboard</button>
    </div>
  );

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
      <GlobalFooter />
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
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Detailed Breakdown</h3>
          <div className="text-slate-300 space-y-3">
            {currentTask.learn?.detailed_breakdown ? (
              <p>{currentTask.learn.detailed_breakdown}</p>
            ) : (
              <p className="italic text-slate-500">Detailed analysis coming soon...</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6 border-l-4 border-purple-500">
          <h3 className="executive-font text-xl font-semibold text-white mb-4 uppercase tracking-wide">Key Insights</h3>
          <div className="text-slate-300 space-y-3">
            {currentTask.learn?.key_insights ? (
              <ul className="list-disc list-inside space-y-2">
                {Array.isArray(currentTask.learn.key_insights) 
                  ? currentTask.learn.key_insights.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))
                  : <li>{currentTask.learn.key_insights}</li>
                }
              </ul>
            ) : (
              <p className="italic text-slate-500">Insights will appear here as you progress...</p>
            )}
          </div>
        </div>
      </div>

      <button 
        onClick={() => setView('briefing')} 
        className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
      >
        ← Back to Learning
      </button>
      <GlobalFooter />
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
      <GlobalFooter />
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
      <GlobalFooter />
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
      <GlobalFooter />
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
      <GlobalFooter />
    </div>
  );

  if (view === 'task-interstitial') return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-12 animate-fadeIn text-left">
      <div className="max-w-4xl w-full p-16 glass-card border-white/10 shadow-2xl">
          <h1 className="executive-font text-5xl font-bold text-white mb-16 tracking-tight text-center">{selectedTask}</h1>
          <div className="grid grid-cols-2 gap-8 text-center">
              <button onClick={() => setView('briefing')} className="executive-btn p-12 border-blue-500/30 hover:bg-blue-500/10 transition-all">
                <h3 className="executive-font text-3xl text-blue-400 font-bold">Learn</h3>
              </button>
              <button onClick={() => setView('activity-picker')} className="executive-btn p-12 border-purple-500/30 hover:bg-purple-500/10 transition-all">
                <h3 className="executive-font text-3xl text-purple-400 font-bold">Practice Hub</h3>
              </button>
          </div>
          <GlobalFooter />
      </div>
    </div>
  );

  if (view === 'briefing') return (
    <div className="max-w-6xl w-full p-10 glass-card animate-fadeIn shadow-2xl text-left">
      <header className="flex justify-between items-end mb-10 executive-header">
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">{selectedTask}</h1>
          <div className="flex gap-8">
              <button onClick={() => setSubView('fundamentals')} className={`px-4 py-2 executive-font text-xs font-semibold uppercase transition-all ${subView === 'fundamentals' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-slate-500'}`}>Fundamentals</button>
              <button onClick={() => setSubView('execution')} className={`px-4 py-2 executive-font text-xs font-semibold uppercase transition-all ${subView === 'execution' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-slate-500'}`}>Execution</button>
          </div>
      </header>
      <div className="min-h-[300px]">
          {subView === 'fundamentals' ? (
              <div className="glass-card p-10 border-l-4 border-blue-500 bg-white/[0.02] animate-fadeIn">
                <p className="text-3xl text-white font-light italic leading-tight">"{currentTask.learn?.definition || "Briefing Locked."}"</p>
              </div>
          ) : (
            <div className="grid grid-cols-12 gap-8 animate-fadeIn">
                <div className="col-span-6 glass-card p-8 border-l-4 border-purple-500 bg-purple-500/5">
                  <p className="text-slate-200 text-sm italic">{currentTask.practice?.agile_mindset || "Mindset Analysis Pending."}</p>
                </div>
                <div className="col-span-6 glass-card p-8 border-l-4 border-emerald-500 bg-emerald-500/5">
                  {currentTask.practice?.checklist?.map(item => (
                    <div key={item} className="text-xs text-slate-400 uppercase font-semibold mb-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      {item}
                    </div>
                  ))}
                </div>
            </div>
          )}
      </div>
      <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/10">
          <button onClick={() => setView('deep-dive')} className="executive-btn py-6 executive-font text-sm text-blue-400 font-semibold uppercase tracking-widest hover:bg-blue-400/10 transition-all text-center shadow-lg">Deep Dive Analysis</button>
          <button onClick={() => setView('activity-picker')} className="bg-purple-600 py-6 rounded-xl executive-font text-sm text-white font-semibold uppercase tracking-widest shadow-2xl hover:bg-purple-700 transition-all text-center">Let's Practice</button>
      </div>
      <GlobalFooter />
    </div>
  );

  return (
    <div className="p-20 text-center">
      <h1 className="executive-font text-4xl text-white animate-pulse font-semibold">Initializing PMP Prep Center...</h1>
      <GlobalFooter />
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PMPApp />);