const { useState, useEffect } = React;

// --- ICON COMPONENTS (Consolidated List) ---

const Target = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
);

const Zap = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const AlertCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

const Award = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 18 17 23 15.79 13.88"/></svg>
);

const CheckCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-8.58"/><path d="M22 4L12 14.01l-3-3"/></svg>
);

const XCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

const ArrowLeft = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const BarChart3 = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);

const Timer = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="18" x2="12" y2="22"/><path d="M12 12V6"/><circle cx="12" cy="13" r="8"/>
  </svg>
);

const Users = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Repeat = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m17 2 4 4-4 4"/><path d="M21 6H3"/><path d="m7 22-4-4 4-4"/><path d="M3 18h18"/>
  </svg>
);

const Settings = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.22a2 2 0 0 0-1.28 1.48l-.22 1.5a2 2 0 0 0-1.8 1.13l-1.55 1.46a2 2 0 0 0-.15 2.58l.94 1.18a2 2 0 0 0 .8 1.83v1.17a2 2 0 0 0 1.28 1.48l.22 1.5a2 2 0 0 0 1.8 1.13l1.55 1.46a2 2 0 0 0 2.58-.15l1.18-.94a2 2 0 0 0 1.83-.8v1.17a2 2 0 0 0 1.48 1.28l1.5.22a2 2 0 0 0 2-2v-.44a2 2 0 0 0-2-2h-.22a2 2 0 0 0-1.48-1.28l-1.5-.22a2 2 0 0 0-1.13-1.8l-1.46-1.55a2 2 0 0 0 .15-2.58l.94-1.18a2 2 0 0 0 .8-1.83v-1.17a2 2 0 0 0 1.28-1.48l.22-1.5a2 2 0 0 0-2-2h-.44a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// --- MAIN APP COMPONENT ---

const PMPPrepApp = () => {
  // Mock data for persistent state (must be initialized if it wasn't before)
  const initialData = {
    totalQuestions: 15,
    correct: 12, // Set to higher numbers to make dashboard look good initially
    incorrect: 3,
    history: [], // Placeholder for quiz history
  };
  
  const [appData, setAppData] = useState(
    JSON.parse(localStorage.getItem('pmpAppData')) || initialData
  );
  
  // State for application mode and study guide sub-section
  const [currentMode, setCurrentMode] = useState('dashboard'); // 'dashboard', 'quiz', 'studyguide', 'formulas', 'overview', 'menu'
  const [studyGuideSection, setStudyGuideSection] = useState('overview'); // 'overview', 'tasks', 'formulas', 'agile', 'traps'

  // Persist state to localStorage whenever appData changes (Crucial for persistence)
  useEffect(() => {
    localStorage.setItem('pmpAppData', JSON.stringify(appData));
  }, [appData]);

  // --- NEW SECTION: KEY FORMULAS VIEW (Full-Screen) ---
  if (currentMode === 'formulas') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setCurrentMode('dashboard')}
              className="bg-white p-3 rounded-full shadow hover:shadow-md transition-all text-slate-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Key Formulas</h1>
              <p className="text-slate-600">The math you need for the PMP</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Earned Value Management */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-indigo-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-indigo-500" /> Earned Value (EVM)
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex justify-between font-bold text-indigo-900 mb-1">
                    <span>CPI (Cost Perf. Index)</span>
                    <span>EV / AC</span>
                  </div>
                  <div className="text-xs text-indigo-700">
                    &gt; 1.0 = Under Budget (Good) 🟢<br/>
                    &lt; 1.0 = Over Budget (Bad) 🔴
                  </div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <div className="flex justify-between font-bold text-indigo-900 mb-1">
                    <span>SPI (Sched. Perf. Index)</span>
                    <span>EV / PV</span>
                  </div>
                  <div className="text-xs text-indigo-700">
                    &gt; 1.0 = Ahead of Schedule (Good) 🟢<br/>
                    &lt; 1.0 = Behind Schedule (Bad) 🔴
                  </div>
                </div>
                 <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>SV (Schedule Variance)</span>
                    <span>EV - PV</span>
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex justify-between font-bold text-slate-700 mb-1">
                    <span>CV (Cost Variance)</span>
                    <span>EV - AC</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estimating & PERT */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-emerald-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5 text-emerald-500" /> Estimation (PERT)
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="font-bold text-emerald-900 mb-1">Beta Distribution (PERT)</div>
                  <div className="font-mono text-sm bg-white p-2 rounded border border-emerald-100 text-center mb-2">
                    (Optimistic + 4(Most Likely) + Pessimistic) / 6
                  </div>
                  <div className="text-xs text-emerald-700">
                    Used when you have historical data. Weighted average.
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-700 mb-1">Triangular Distribution</div>
                  <div className="font-mono text-sm bg-white p-2 rounded border border-slate-200 text-center">
                    (O + M + P) / 3
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="font-bold text-slate-700 mb-1">Standard Deviation</div>
                  <div className="font-mono text-sm bg-white p-2 rounded border border-slate-200 text-center">
                    (P - O) / 6
                  </div>
                </div>
              </div>
            </div>

            {/* Communications */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-amber-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" /> Communications
              </h3>
              <div className="p-4 bg-amber-50 rounded-xl">
                <div className="font-bold text-amber-900 mb-2">Communication Channels</div>
                <div className="font-mono text-xl bg-white p-3 rounded-lg border border-amber-100 text-center mb-3">
                  N (N - 1) / 2
                </div>
                <p className="text-sm text-amber-800">
                  Where N is the number of stakeholders.
                  <br/><br/>
                  <em>Example: 10 people = 10(9)/2 = 45 channels.</em>
                </p>
              </div>
            </div>

             {/* Agile Metrics */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-rose-500">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Repeat className="w-5 h-5 text-rose-500" /> Agile Metrics
              </h3>
              <ul className="space-y-3">
                <li className="flex justify-between items-center p-2 bg-rose-50 rounded text-sm">
                  <span className="font-bold text-rose-900">Velocity</span>
                  <span>Avg points per sprint</span>
                </li>
                <li className="flex justify-between items-center p-2 bg-rose-50 rounded text-sm">
                  <span className="font-bold text-rose-900">Burnup</span>
                  <span>Tracks completed work vs total</span>
                </li>
                <li className="flex justify-between items-center p-2 bg-rose-50 rounded text-sm">
                  <span className="font-bold text-rose-900">Burndown</span>
                  <span>Tracks remaining work vs time</span>
                </li>
                 <li className="flex justify-between items-center p-2 bg-rose-50 rounded text-sm">
                  <span className="font-bold text-rose-900">Cycle Time</span>
                  <span>Start to Finish (Work in Progress)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- NEW SECTION: EXAM OVERVIEW VIEW (Full-Screen) ---
  if (currentMode === 'overview') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setCurrentMode('dashboard')}
              className="bg-white p-3 rounded-full shadow hover:shadow-md transition-all text-slate-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Exam Overview</h1>
              <p className="text-slate-600">The 2021 ECO Framework Breakdown</p>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-black text-indigo-600">180</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Questions</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-black text-indigo-600">230</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Minutes</div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-black text-indigo-600">2</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Breaks</div>
            </div>
             <div className="bg-white p-4 rounded-xl shadow-sm text-center">
              <div className="text-3xl font-black text-indigo-600">3</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Domains</div>
            </div>
          </div>

          {/* Domain Breakdown */}
          <h2 className="text-xl font-bold text-slate-800 mb-4">The 3 Domains</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
               <div className="text-4xl font-black opacity-20 absolute top-2 right-2">42%</div>
               <Users className="w-8 h-8 mb-4" />
               <h3 className="text-xl font-bold mb-2">People</h3>
               <p className="text-sm opacity-90 leading-relaxed">
                 Managing conflict, leading teams, supporting performance, mentoring, and emotional intelligence.
                 <br/>Key: Servant Leadership.
               </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden">
               <div className="text-4xl font-black opacity-20 absolute top-2 right-2">50%</div>
               <Settings className="w-8 h-8 mb-4" />
               <h3 className="text-xl font-bold mb-2">Process</h3>
               <p className="text-sm opacity-90 leading-relaxed">
                 Executing the project. Methodologies (Agile/Waterfall), Budget, Schedule, Scope, Quality, and Procurement.
               </p>
            </div>
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white relative overflow-hidden">
               <div className="text-4xl font-black opacity-20 absolute top-2 right-2">8%</div>
               <Target className="w-8 h-8 mb-4" />
               <h3 className="text-xl font-bold mb-2">Business Env.</h3>
               <p className="text-sm opacity-90 leading-relaxed">
                 Compliance, delivering organizational value, and supporting organizational change.
               </p>
            </div>
          </div>

          {/* Strategy Section */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Exam Day Strategy</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-lg">Manage Your Time</h4>
                  <p className="text-slate-600">You have roughly 1 minute and 15 seconds per question. If a question takes longer, flag it and move on.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-lg">Take the Breaks</h4>
                  <p className="text-slate-600">The exam is split into 3 sections (60 questions each). You get a 10-minute break after Q60 and Q120. Take them. Refresh your brain.</p>
                </div>
              </div>

               <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-lg">Read the Last Sentence First</h4>
                  <p className="text-slate-600">Often, the scenario is full of fluff. Read the actual question first (e.g., "What should the PM do next?") to know what to look for.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // --- STUDY GUIDE VIEW (Expanded Logic) ---
  if (currentMode === 'studyguide') {
    return (
      <div className="min-h-screen bg-slate-50 p-6 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setCurrentMode('dashboard')}
              className="bg-white p-3 rounded-full shadow hover:shadow-md transition-all text-slate-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-black text-slate-900">Study Guide</h1>
          </div>
          
          {/* Study Guide Navigation */}
          <div className="flex overflow-x-auto border-b border-gray-200 mb-6 space-x-2">
            {['overview', 'tasks', 'formulas', 'agile', 'traps'].map((section) => (
              <button
                key={section}
                onClick={() => setStudyGuideSection(section)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  studyGuideSection === section 
                    ? 'border-b-2 border-indigo-600 text-indigo-600' 
                    : 'text-gray-500 hover:text-indigo-600 hover:border-gray-300'
                }`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Study Guide Content based on selection */}
          {studyGuideSection === 'overview' ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Award className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your PMP Study Guide</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Select a tab above to deep dive into specific content areas. 
                The "Tasks" tab contains the complete breakdown of the 2021 Exam Content Outline (ECO).
              </p>
            </div>
          ) : studyGuideSection === 'tasks' ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">ECO Task Breakdown</h2>
              <p className="text-gray-600">
                <span className="font-semibold text-red-500">
                  *** PLACEHOLDER FOR YOUR DETAILED TASK LIST/MENU CONTENT ***
                </span>
                <br/>
                This is where your original long lists and deep dive menus for the ECO Tasks must be re-inserted.
              </p>
            </div>
          ) : studyGuideSection === 'formulas' ? (
            // FORMULAS SECTION - (From Enhancement 1)
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Target className="w-8 h-8" />
                  Mastering PMP Formulas
                </h2>
                <p className="text-purple-100 text-lg">
                  You don't need to be a mathematician, but you must know how to interpret these numbers.
                  Remember: Greater than 1 is GOOD for indices.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Cost Performance */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-purple-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    💰 Cost Management (EVM)
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-purple-900">CPI (Cost Performance Index)</span>
                        <code className="bg-white px-2 py-1 rounded border border-purple-200 text-purple-700 font-mono text-sm">EV / AC</code>
                      </div>
                      <p className="text-sm text-gray-600">The #1 most important formula. Measures cost efficiency.</p>
                      <div className="mt-2 text-xs flex gap-2">
                        <span className="text-green-600 font-bold">&gt; 1 = Under Budget (Good)</span>
                        <span className="text-red-500 font-bold">&lt; 1 = Over Budget (Bad)</span>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-purple-900">CV (Cost Variance)</span>
                        <code className="bg-white px-2 py-1 rounded border border-purple-200 text-purple-700 font-mono text-sm">EV - AC</code>
                      </div>
                      <p className="text-sm text-gray-600">The actual amount you are over or under budget.</p>
                      <div className="mt-2 text-xs flex gap-2">
                        <span className="text-green-600 font-bold">Positive = Under Budget</span>
                        <span className="text-red-500 font-bold">Negative = Over Budget</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Performance */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-indigo-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📅 Schedule Management
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-indigo-900">SPI (Schedule Performance Index)</span>
                        <code className="bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-700 font-mono text-sm">EV / PV</code>
                      </div>
                      <p className="text-sm text-gray-600">Measures schedule efficiency (speed).</p>
                      <div className="mt-2 text-xs flex gap-2">
                        <span className="text-green-600 font-bold">&gt; 1 = Ahead of Schedule</span>
                        <span className="text-red-500 font-bold">&lt; 1 = Behind Schedule</span>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-indigo-900">SV (Schedule Variance)</span>
                        <code className="bg-white px-2 py-1 rounded border border-indigo-200 text-indigo-700 font-mono text-sm">EV - PV</code>
                      </div>
                      <p className="text-sm text-gray-600">The dollar value of work you are ahead/behind.</p>
                    </div>
                  </div>
                </div>

                {/* Forecasting */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-blue-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    🔮 Forecasting (EAC)
                  </h3>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg bg-gray-50">
                      <div className="font-bold text-gray-800 mb-1">Typical Variance (Most Common)</div>
                      <code className="block bg-white p-2 rounded border border-gray-200 text-blue-700 font-mono text-sm mb-1">BAC / CPI</code>
                      <p className="text-xs text-gray-500">Use when current variances are expected to continue.</p>
                    </div>
                    <div className="p-3 border rounded-lg bg-gray-50">
                      <div className="font-bold text-gray-800 mb-1">Atypical Variance (One-time)</div>
                      <code className="block bg-white p-2 rounded border border-gray-200 text-blue-700 font-mono text-sm mb-1">AC + (BAC - EV)</code>
                      <p className="text-xs text-gray-500">Use when the delay was a one-time event (e.g., a storm).</p>
                    </div>
                  </div>
                </div>

                {/* Estimation */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-pink-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    📐 Estimation & Communication
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-pink-900">PERT (Beta Distribution)</span>
                        <code className="bg-white px-2 py-1 rounded border border-pink-200 text-pink-700 font-mono text-sm">(O + 4M + P) / 6</code>
                      </div>
                      <p className="text-sm text-gray-600">Weighted average using Optimistic, Most Likely, Pessimistic.</p>
                    </div>

                    <div className="bg-pink-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-pink-900">Communication Channels</span>
                        <code className="bg-white px-2 py-1 rounded border border-pink-200 text-pink-700 font-mono text-sm">N(N - 1) / 2</code>
                      </div>
                      <p className="text-sm text-gray-600">Where N = number of stakeholders. Adds up fast!</p>
                      <p className="text-xs text-gray-500 mt-1">Ex: 10 people = 45 channels.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : studyGuideSection === 'agile' ? (
            // AGILE SECTION - (From Enhancement 1)
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Zap className="w-8 h-8" />
                  Agile & Scrum Framework
                </h2>
                <p className="text-pink-100 text-lg">
                  About 50% of the exam questions will be Agile or Hybrid.
                  Remember: The PM is a Servant Leader, not a dictator.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Roles */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-pink-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3 Scrum Roles</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-pink-700">Product Owner (PO)</h4>
                      <p className="text-sm text-gray-600">Owns the "What". Prioritizes backlog. Maximizes value. Voice of the customer.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-pink-700">Scrum Master (SM)</h4>
                      <p className="text-sm text-gray-600">Owns the "Process". Servant leader. Removes impediments. Coaches the team.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-pink-700">Developers (Team)</h4>
                      <p className="text-sm text-gray-600">Owns the "How". Cross-functional. Self-organizing. Delivers the increment.</p>
                    </div>
                  </div>
                </div>

                {/* Artifacts */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-rose-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">3 Artifacts</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-bold text-rose-700">Product Backlog</h4>
                      <p className="text-sm text-gray-600">Ordered list of everything needed. Never complete. Owned by PO.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-700">Sprint Backlog</h4>
                      <p className="text-sm text-gray-600">Items selected for this sprint + plan to deliver them. Owned by Team.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-rose-700">Increment</h4>
                      <p className="text-sm text-gray-600">Sum of all backlog items completed. Must be "Done" (usable).</p>
                    </div>
                  </div>
                </div>

                {/* Events */}
                <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">5 Events</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex gap-2">
                      <span className="font-bold text-purple-700 min-w-[80px]">Sprint:</span>
                      <span className="text-gray-600">The container. Fixed length (1-4 weeks).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-purple-700 min-w-[80px]">Planning:</span>
                      <span className="text-gray-600">Define "Why", "What", and "How". Output: Sprint Goal.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-purple-700 min-w-[80px]">Daily Scrum:</span>
                      <span className="text-gray-600">15 min. Inspect progress toward Goal. Plan next 24h.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-purple-700 min-w-[80px]">Review:</span>
                      <span className="text-gray-600">Inspect Increment. Demo to stakeholders. Adapt backlog.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold text-purple-700 min-w-[80px]">Retro:</span>
                      <span className="text-gray-600">Inspect Team/Process. Continuous improvement plan.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          ) : studyGuideSection === 'traps' ? (
             // TRAPS SECTION - (From Enhancement 1)
             <div className="space-y-6">
               <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
                 <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                   <AlertCircle className="w-8 h-8" />
                   Common Exam Traps
                 </h2>
                 <p className="text-orange-100 text-lg">
                   The PMP exam tests your judgment. PMI has a specific "mindset" that often differs from the real world.
                 </p>
               </div>
 
               <div className="grid md:grid-cols-2 gap-6">
                 <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                   <h3 className="text-lg font-bold text-gray-900 mb-3">⛔ The "Do It Yourself" Trap</h3>
                   <p className="text-gray-600 mb-3 text-sm">
                     <span className="font-bold text-red-600">Trap:</span> The PM personally fixes a coding bug or writes the test script.
                   </p>
                   <p className="text-gray-800 text-sm">
                     <span className="font-bold text-green-600">Correct:</span> The PM manages, facilitates, and removes impediments. You don't do the technical work; you enable the team to do it.
                   </p>
                 </div>
 
                 <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                   <h3 className="text-lg font-bold text-gray-900 mb-3">⛔ The "Escalate Immediately" Trap</h3>
                   <p className="text-gray-600 mb-3 text-sm">
                     <span className="font-bold text-red-600">Trap:</span> A problem occurs and you immediately tell the Sponsor or HR.
                   </p>
                   <p className="text-gray-800 text-sm">
                     <span className="font-bold text-green-600">Correct:</span> Analyze first. Then try to solve it with the team. Escalate only as a last resort or if it exceeds your authority thresholds.
                   </p>
                 </div>
 
                 <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">⛔ The "Process Over People" Trap</h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      <span className="font-bold text-red-600">Trap:</span> Following the plan rigidly when the team is burning out.
                    </p>
                    <p className="text-gray-800 text-sm">
                      <span className="font-bold text-green-600">Correct:</span> Servant leadership comes first. Protect the team. If the plan is unrealistic, negotiate the plan; don't break the people.
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-red-500">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">⛔ The "Firing" Trap</h3>
                    <p className="text-gray-600 mb-3 text-sm">
                      <span className="font-bold text-red-600">Trap:</span> Removing a low performer immediately.
                    </p>
                    <p className="text-gray-800 text-sm">
                      <span className="font-bold text-green-600">Correct:</span> Coach first. Understand the root cause (Skills? Motivation? Personal issue?). Offer training or mentoring. Removal is the absolute last step.
                    </p>
                  </div>
               </div>
             </div>
          ) : (
            // FALLBACK
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <Award className="w-16 h-16 mx-auto text-indigo-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to your PMP Study Guide</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Select a tab above to deep dive into specific content areas. 
                The "Tasks" tab contains the complete breakdown of the 2021 Exam Content Outline (ECO).
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // --- QUIZ MODE (Placeholder for your original quiz logic) ---
  if (currentMode === 'quiz') {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setCurrentMode('dashboard')}
              className="bg-gray-200 p-3 rounded-full shadow hover:bg-gray-300 transition-all text-gray-700"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-black text-gray-900">Quiz Mode</h1>
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-600">
             <p className="text-indigo-800">
               <span className="font-semibold text-red-500">
                  *** PLACEHOLDER FOR YOUR QUIZ QUESTION/ANSWER LOGIC ***
               </span>
               <br/>
               This is where your original question, answer, and score calculation logic must be re-inserted.
             </p>
             <div className="mt-4 flex gap-4">
                 <button className="bg-indigo-600 text-white px-4 py-2 rounded">Next Question</button>
                 <button className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded" onClick={() => setCurrentMode('dashboard')}>End Quiz</button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW (Original Structure - Default View) ---
  // This view renders if currentMode === 'dashboard'
  const percentage = appData.totalQuestions > 0 ? Math.round((appData.correct / appData.totalQuestions) * 100) : 0;
  
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">PMP Mastery Dashboard</h1>
        
        {/* Stats Widget */}
        <div className="bg-white rounded-xl shadow-xl p-6 mb-8 border-t-4 border-indigo-600">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Progress</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-4xl font-black text-indigo-600">{appData.totalQuestions}</div>
              <div className="text-sm text-gray-500">Total Questions</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600">{appData.correct}</div>
              <div className="text-sm text-gray-500">Correct</div>
            </div>
            <div>
              <div className="text-4xl font-black text-red-600">{appData.incorrect}</div>
              <div className="text-sm text-gray-500">Incorrect</div>
            </div>
          </div>
          
          <div className="mt-6">
            <p className="text-lg font-bold text-gray-700 mb-2">Overall Score: {percentage}%</p>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="bg-indigo-600 h-3 rounded-full" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        </div>
        
        {/* Main Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={() => setCurrentMode('quiz')} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white p-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex flex-col items-center"
          >
            <CheckCircle className="w-8 h-8 mb-2" />
            <span className="text-xl font-bold">Start New Quiz</span>
            <span className="text-sm opacity-90">Test your knowledge.</span>
          </button>
          <button 
            onClick={() => setCurrentMode('studyguide')} 
            className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex flex-col items-center"
          >
            <Target className="w-8 h-8 mb-2" />
            <span className="text-xl font-bold">Study Guide</span>
            <span className="text-sm opacity-90">Deep dive into domains.</span>
          </button>
           <button 
            onClick={() => setCurrentMode('overview')} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-xl shadow-lg transition-transform hover:scale-[1.02] flex flex-col items-center"
          >
            <Award className="w-8 h-8 mb-2" />
            <span className="text-xl font-bold">Exam Overview</span>
            <span className="text-sm opacity-90">Structure & strategy.</span>
          </button>
        </div>
        
        {/* Quick Links (now functional) */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quick Study Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => setCurrentMode('formulas')} 
            className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition-colors text-gray-700 flex flex-col items-center"
          >
            <BarChart3 className="w-6 h-6 text-blue-500 mb-1" />
            <span className="text-sm font-medium">Key Formulas</span>
          </button>
          <button 
            onClick={() => { setCurrentMode('studyguide'); setStudyGuideSection('agile'); }} 
            className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition-colors text-gray-700 flex flex-col items-center"
          >
            <Zap className="w-6 h-6 text-pink-500 mb-1" />
            <span className="text-sm font-medium">Agile Framework</span>
          </button>
          <button 
            onClick={() => { setCurrentMode('studyguide'); setStudyGuideSection('traps'); }} 
            className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition-colors text-gray-700 flex flex-col items-center"
          >
            <AlertCircle className="w-6 h-6 text-amber-500 mb-1" />
            <span className="text-sm font-medium">Common Traps</span>
          </button>
          <button 
            onClick={() => { setCurrentMode('studyguide'); setStudyGuideSection('tasks'); }} 
            className="bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition-colors text-gray-700 flex flex-col items-center"
          >
            <Users className="w-6 h-6 text-red-500 mb-1" />
            <span className="text-sm font-medium">ECO Tasks</span>
          </button>
        </div>
        
        <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded">
          <p className="font-semibold text-yellow-700">
            ACTION REQUIRED: Please re-insert your detailed content in the placeholder sections marked 
            <span className="text-red-600">*** PLACEHOLDER ***</span> within the `quiz` and `studyGuideSection === 'tasks'` blocks.
          </p>
        </div>
        
      </div>
    </div>
  );
};