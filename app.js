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
  const [simulatorState, setSimulatorState] = useState({
    currentScene: 0,
    morale: 75,
    projectHealth: 75,
    trust: 75,
    choices: [],
    showingFeedback: false,
    showEndScreen: false
  });
  const [lightningRoundState, setLightningRoundState] = useState({
    currentQuestion: 0,
    score: 0,
    streak: 0,
    timeRemaining: 30,
    userAnswers: [],
    showingFeedback: false,
    lastAnswerCorrect: false,
    lastAnswerTime: 0,
    showEndScreen: false,
    quizStarted: false
  });
  const [documentDetectiveState, setDocumentDetectiveState] = useState({
    currentCase: 0,
    selectedDocs: [],
    showingFeedback: false,
    score: 0
  });
  const [conflictMatcherState, setConflictMatcherState] = useState({
    matches: {}, // { scenarioId: mode }
    showingFeedback: false,
    score: 0,
    draggedScenario: null
  });
  const [timelineReconstructorState, setTimelineReconstructorState] = useState({
    steps: [], // Array of step objects in current order
    showingFeedback: false,
    score: 0,
    draggedStep: null,
    dragOverIndex: null
  });

  useEffect(() => {
    fetch('./data/taskData.json')
      .then(res => res.json())
      .then(data => setTaskDatabase(data))
      .catch(err => console.error("Data Load Failure", err));
  }, []);

  // Lightning Round Timer Effect
  useEffect(() => {
    if (view !== 'lightning-round') return;
    if (!lightningRoundState.quizStarted || lightningRoundState.showingFeedback || lightningRoundState.showEndScreen) return;
    
    if (lightningRoundState.timeRemaining > 0) {
      const timer = setTimeout(() => {
        setLightningRoundState(prev => ({ ...prev, timeRemaining: prev.timeRemaining - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Time ran out - mark as incorrect
      setLightningRoundState(prev => {
        const timeUsed = 30;
        return {
          ...prev,
          showingFeedback: true,
          lastAnswerCorrect: false,
          lastAnswerTime: timeUsed,
          streak: 0,
          userAnswers: [...prev.userAnswers, {
            question: prev.currentQuestion,
            correct: false,
            timeUsed,
            points: 0
          }]
        };
      });

      // Auto-advance after timeout feedback
      setTimeout(() => {
        setLightningRoundState(prev => {
          const reflexPrompts = taskDatabase?.[selectedTask]?.practice?.reflex_prompts || [];
          const totalQuestions = Math.min(10, reflexPrompts.length);
          const bestScore = parseInt(localStorage.getItem(`lightning-round-best-${selectedTask}`) || '0');
          
          if (prev.currentQuestion < totalQuestions - 1) {
            return {
              ...prev,
              currentQuestion: prev.currentQuestion + 1,
              timeRemaining: 30,
              showingFeedback: false
            };
          } else {
            const finalScore = prev.score;
            if (finalScore > bestScore) {
              localStorage.setItem(`lightning-round-best-${selectedTask}`, finalScore.toString());
            }
            return {
              ...prev,
              showEndScreen: true,
              showingFeedback: false
            };
          }
        });
      }, 3000);
    }
  }, [view, lightningRoundState.timeRemaining, lightningRoundState.quizStarted, lightningRoundState.showingFeedback, lightningRoundState.showEndScreen, selectedTask, taskDatabase]);

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

  // PM Simulator Activity View
  if (view === 'pm-simulator') {
    const stressTests = currentTask.practice?.stress_test || [];
    const currentScenario = stressTests[simulatorState.currentScene];
    const totalScenes = stressTests.length;
    
    const handleChoice = (choiceIndex) => {
      if (!currentScenario?.options) return;
      const choice = currentScenario.options[choiceIndex];
      
      // Infer meter changes based on outcome - SUCCESS outcomes increase, others decrease
      const isSuccess = choice.outcome?.toUpperCase().includes('SUCCESS') || choice.outcome?.toUpperCase().includes('BEST OUTCOME');
      const isBad = choice.outcome?.toLowerCase().includes('loses') || choice.outcome?.toLowerCase().includes('collapses') || choice.outcome?.toLowerCase().includes('fails');
      
      let moraleChange = 0;
      let projectHealthChange = 0;
      let trustChange = 0;
      
      if (isSuccess) {
        moraleChange = 15;
        projectHealthChange = 15;
        trustChange = 15;
      } else if (isBad) {
        moraleChange = -20;
        projectHealthChange = -20;
        trustChange = -25;
      } else {
        // Neutral outcomes - small changes
        moraleChange = -5;
        projectHealthChange = -5;
        trustChange = -5;
      }
      
      const newMorale = Math.max(0, Math.min(100, simulatorState.morale + moraleChange));
      const newProjectHealth = Math.max(0, Math.min(100, simulatorState.projectHealth + projectHealthChange));
      const newTrust = Math.max(0, Math.min(100, simulatorState.trust + trustChange));
      
      setSimulatorState({
        ...simulatorState,
        choices: [...simulatorState.choices, { scene: simulatorState.currentScene, choiceIndex, choice }],
        showingFeedback: true,
        lastChoice: choiceIndex,
        moraleChange,
        projectHealthChange,
        trustChange,
        morale: newMorale,
        projectHealth: newProjectHealth,
        trust: newTrust
      });
    };

    const continueToNextScene = () => {
      if (simulatorState.currentScene < totalScenes - 1) {
        setSimulatorState({
          ...simulatorState,
          currentScene: simulatorState.currentScene + 1,
          showingFeedback: false
        });
      } else {
        setSimulatorState({
          ...simulatorState,
          showingFeedback: false,
          showEndScreen: true
        });
      }
    };

    const getBarColor = (value) => {
      if (value >= 70) return 'bg-emerald-500';
      if (value >= 40) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    if (!stressTests || stressTests.length === 0) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">PM Simulator</h1>
            <p className="text-slate-400">No scenarios available for this task.</p>
            <button 
              onClick={() => setView('practice-hub')}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    // End Screen
    if (simulatorState.showEndScreen) {
      const finalScore = (simulatorState.morale + simulatorState.projectHealth + simulatorState.trust) / 3;
      const missionStatus = finalScore >= 70 ? "Mission Complete" : "Mission Failed";
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">{missionStatus}</h1>
          </header>

          <div className="glass-card p-8 mb-6">
            <h2 className="executive-font text-2xl font-bold text-white mb-6">Final Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Team Morale</span>
                  <span className="text-white font-bold">{simulatorState.morale}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.morale)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.morale}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Project Health</span>
                  <span className="text-white font-bold">{simulatorState.projectHealth}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.projectHealth)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.projectHealth}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Trust</span>
                  <span className="text-white font-bold">{simulatorState.trust}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.trust)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.trust}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {simulatorState.choices.length > 0 && (
            <div className="glass-card p-8 mb-6">
              <h2 className="executive-font text-2xl font-bold text-white mb-4">Your Choices</h2>
              <div className="space-y-4">
                {simulatorState.choices.map((choiceRecord, idx) => {
                  const choice = choiceRecord.choice;
                  return (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-white font-semibold mb-2">Scene {choiceRecord.scene + 1}</h3>
                      <p className="text-slate-300 text-sm mb-2">{choice.text}</p>
                      {choice.analysis && <p className="text-xs text-slate-400 mb-1">{choice.analysis}</p>}
                      {choice.outcome && <p className="text-xs text-slate-400">{choice.outcome}</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button 
              onClick={() => setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false })}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Try Again
            </button>
            <button 
              onClick={() => {
                setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                setView('practice-hub');
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Feedback Screen
    if (simulatorState.showingFeedback && simulatorState.lastChoice !== undefined && currentScenario?.options) {
      const choice = currentScenario.options[simulatorState.lastChoice];
      const isGoodChoice = (simulatorState.moraleChange || 0) + (simulatorState.projectHealthChange || 0) + (simulatorState.trustChange || 0) > 0;
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">PM Simulator: {currentScenario?.title || 'Scenario'}</h1>
          </header>

          {/* Status Meters */}
          <div className="glass-card p-6 mb-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Team Morale</span>
                  <span className="text-white font-bold">{simulatorState.morale}% {simulatorState.moraleChange > 0 ? '↗️' : simulatorState.moraleChange < 0 ? '↘️' : ''} {simulatorState.moraleChange !== 0 && `${simulatorState.moraleChange > 0 ? '+' : ''}${simulatorState.moraleChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.morale)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.morale}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Project Health</span>
                  <span className="text-white font-bold">{simulatorState.projectHealth}% {simulatorState.projectHealthChange > 0 ? '↗️' : simulatorState.projectHealthChange < 0 ? '↘️' : ''} {simulatorState.projectHealthChange !== 0 && `${simulatorState.projectHealthChange > 0 ? '+' : ''}${simulatorState.projectHealthChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.projectHealth)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.projectHealth}%`}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-white font-semibold">Trust</span>
                  <span className="text-white font-bold">{simulatorState.trust}% {simulatorState.trustChange > 0 ? '↗️' : simulatorState.trustChange < 0 ? '↘️' : ''} {simulatorState.trustChange !== 0 && `${simulatorState.trustChange > 0 ? '+' : ''}${simulatorState.trustChange}%`}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-4">
                  <div className={`${getBarColor(simulatorState.trust)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.trust}%`}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Card */}
          <div className="glass-card p-8 mb-6">
            <div className={`text-4xl mb-4 ${isGoodChoice ? 'text-emerald-400' : 'text-yellow-400'}`}>
              {isGoodChoice ? '✅ EXCELLENT CHOICE!' : '⚠️ NOT IDEAL'}
            </div>
            <h2 className="executive-font text-2xl font-bold text-white mb-4">What Happened</h2>
            {choice.outcome && <p className="text-slate-300 mb-4">{choice.outcome}</p>}
            {choice.analysis && (
              <>
                <h3 className="executive-font text-lg font-semibold text-white mb-2">Analysis</h3>
                <p className="text-slate-300 mb-4">{choice.analysis}</p>
              </>
            )}
          </div>

          <button 
            onClick={continueToNextScene}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
          >
            {simulatorState.currentScene < totalScenes - 1 ? `Continue to Scene ${simulatorState.currentScene + 2}` : 'View Results'}
          </button>
          <GlobalNavFooter />
        </div>
      );
    }

    // Main Scene Display
    if (!currentScenario) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">PM Simulator</h1>
            <p className="text-slate-400">Loading scenario...</p>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => {
                setSimulatorState({ currentScene: 0, morale: 75, projectHealth: 75, trust: 75, choices: [], showingFeedback: false, showEndScreen: false });
                setView('practice-hub');
              }}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">PM Simulator: {currentScenario?.title || 'Scenario'}</h1>
        </header>

        {/* Status Meters */}
        <div className="glass-card p-6 mb-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">Team Morale</span>
                <span className="text-white font-bold">{simulatorState.morale}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4">
                <div className={`${getBarColor(simulatorState.morale)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.morale}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">Project Health</span>
                <span className="text-white font-bold">{simulatorState.projectHealth}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4">
                <div className={`${getBarColor(simulatorState.projectHealth)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.projectHealth}%`}}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-white font-semibold">Trust</span>
                <span className="text-white font-bold">{simulatorState.trust}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-4">
                <div className={`${getBarColor(simulatorState.trust)} h-4 rounded-full transition-all duration-500`} style={{width: `${simulatorState.trust}%`}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scene Display */}
        <div className="glass-card p-8 mb-6">
          <div className="text-slate-400 text-sm mb-4 uppercase tracking-wide">Scene {simulatorState.currentScene + 1} of {totalScenes}</div>
          <h2 className="executive-font text-2xl font-bold text-white mb-4">{currentScenario?.scenario || 'No scenario description available'}</h2>
          
          {currentScenario.options && currentScenario.options.length > 0 && (
            <div className="space-y-3 mt-6">
              {currentScenario.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(idx)}
                  className="w-full glass-card p-4 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500/50 hover:border-blue-500"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-blue-400 text-xl">{String.fromCharCode(65 + idx)}.</span>
                    <span className="text-white flex-1">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Lightning Round Activity View
  if (view === 'lightning-round') {
    const reflexPrompts = currentTask.practice?.reflex_prompts || [];
    const totalQuestions = Math.min(10, reflexPrompts.length);
    const currentPrompt = reflexPrompts[lightningRoundState.currentQuestion];
    const bestScore = parseInt(localStorage.getItem(`lightning-round-best-${selectedTask}`) || '0');

    const handleAnswer = (answerIndex) => {
      if (!currentPrompt) return;
      const isCorrect = answerIndex === (currentPrompt.correct - 1); // Convert to 0-based index
      const timeUsed = 30 - lightningRoundState.timeRemaining;
      const newStreak = isCorrect ? lightningRoundState.streak + 1 : 0;
      
      // Calculate score
      let points = 0;
      if (isCorrect) {
        points = 500; // Base points
        points += (lightningRoundState.timeRemaining * 10); // Time bonus
        if (newStreak >= 3) {
          points = Math.floor(points * 1.5); // Streak bonus
        }
      }

      setLightningRoundState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: newStreak,
        showingFeedback: true,
        lastAnswerCorrect: isCorrect,
        lastAnswerTime: timeUsed,
        userAnswers: [...prev.userAnswers, {
          question: prev.currentQuestion,
          correct: isCorrect,
          timeUsed,
          points
        }]
      }));

      // Auto-advance after 3 seconds
      setTimeout(() => {
        advanceToNextQuestion();
      }, 3000);
    };

    const advanceToNextQuestion = () => {
      if (lightningRoundState.currentQuestion < totalQuestions - 1) {
        setLightningRoundState(prev => ({
          ...prev,
          currentQuestion: prev.currentQuestion + 1,
          timeRemaining: 30,
          showingFeedback: false
        }));
      } else {
        // Quiz complete
        const finalScore = lightningRoundState.score;
        if (finalScore > bestScore) {
          localStorage.setItem(`lightning-round-best-${selectedTask}`, finalScore.toString());
        }
        setLightningRoundState(prev => ({
          ...prev,
          showEndScreen: true,
          showingFeedback: false
        }));
      }
    };

    const startQuiz = () => {
      setLightningRoundState({
        currentQuestion: 0,
        score: 0,
        streak: 0,
        timeRemaining: 30,
        userAnswers: [],
        showingFeedback: false,
        lastAnswerCorrect: false,
        lastAnswerTime: 0,
        showEndScreen: false,
        quizStarted: true
      });
    };

    const resetQuiz = () => {
      setLightningRoundState({
        currentQuestion: 0,
        score: 0,
        streak: 0,
        timeRemaining: 30,
        userAnswers: [],
        showingFeedback: false,
        lastAnswerCorrect: false,
        lastAnswerTime: 0,
        showEndScreen: false,
        quizStarted: false
      });
    };

    // Start screen
    if (!lightningRoundState.quizStarted) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  resetQuiz();
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">⚡ Lightning Round</h1>
          </header>
          <div className="glass-card p-10 text-center">
            <h2 className="executive-font text-2xl font-bold text-white mb-4">{selectedTask}</h2>
            <p className="text-slate-400 mb-6">Test your reflexes with 10 rapid-fire questions. 30 seconds per question!</p>
            <p className="text-slate-300 mb-8">Best Score: <span className="text-emerald-400 font-bold">{bestScore.toLocaleString()}</span> points</p>
            <button 
              onClick={startQuiz}
              className="px-8 py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition-colors executive-font text-lg"
            >
              Start Quiz ⚡
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // End Screen
    if (lightningRoundState.showEndScreen) {
      const correctCount = lightningRoundState.userAnswers.filter(a => a.correct).length;
      const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      const avgTime = lightningRoundState.userAnswers.length > 0 ? lightningRoundState.userAnswers.reduce((sum, a) => sum + a.timeUsed, 0) / lightningRoundState.userAnswers.length : 0;
      
      // Calculate longest streak
      let longestStreak = 0;
      let currentStreak = 0;
      lightningRoundState.userAnswers.forEach(a => {
        if (a.correct) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      const fastestAnswer = lightningRoundState.userAnswers.length > 0 ? Math.min(...lightningRoundState.userAnswers.map(a => a.timeUsed)) : 0;
      const isNewBest = lightningRoundState.score > bestScore;
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => {
                  resetQuiz();
                  setView('practice-hub');
                }}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🎉 Lightning Round Complete!</h1>
          </header>

          <div className="glass-card p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="executive-font text-4xl font-bold text-white mb-2">Final Score: {lightningRoundState.score.toLocaleString()}</h2>
              {isNewBest && (
                <p className="text-emerald-400 text-xl font-bold animate-pulse">🏆 NEW HIGH SCORE! 🏆</p>
              )}
              <p className="text-slate-400 mt-2">Best Score: {Math.max(lightningRoundState.score, bestScore).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="glass-card p-4 border-l-4 border-blue-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Accuracy</div>
                <div className="text-3xl font-bold text-white">{accuracy}%</div>
                <div className="text-xs text-slate-500">({correctCount}/{totalQuestions} correct)</div>
              </div>
              <div className="glass-card p-4 border-l-4 border-purple-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Average Time</div>
                <div className="text-3xl font-bold text-white">{avgTime.toFixed(1)}s</div>
              </div>
              <div className="glass-card p-4 border-l-4 border-emerald-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Longest Streak</div>
                <div className="text-3xl font-bold text-white">{'🔥'.repeat(Math.min(longestStreak, 5))} {longestStreak}x</div>
              </div>
              <div className="glass-card p-4 border-l-4 border-yellow-500">
                <div className="text-sm text-slate-400 uppercase mb-1">Fastest Answer</div>
                <div className="text-3xl font-bold text-white">{fastestAnswer.toFixed(1)}s</div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => {
                startQuiz();
              }}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Play Again ⚡
            </button>
            <button 
              onClick={() => {
                resetQuiz();
                setView('practice-hub');
              }}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    if (!currentPrompt) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">⚡ Lightning Round</h1>
            <p className="text-slate-400">No questions available for this task.</p>
            <button 
              onClick={() => {
                resetQuiz();
                setView('practice-hub');
              }}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    // Feedback Screen
    if (lightningRoundState.showingFeedback) {
      const lastAnswer = lightningRoundState.userAnswers[lightningRoundState.userAnswers.length - 1];
      const isCorrect = lightningRoundState.lastAnswerCorrect;
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-6">
            <h1 className="executive-font text-4xl font-bold text-white tracking-tight">⚡ Lightning Round</h1>
          </header>

          <div className="glass-card p-8 text-center mb-6">
            <div className={`text-6xl mb-4 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? '✅' : '❌'}
            </div>
            {isCorrect && (
              <div className="text-2xl font-bold text-emerald-400 mb-2">
                +{lastAnswer.points.toLocaleString()} points
              </div>
            )}
            {currentPrompt.explanation && (
              <p className="text-slate-300 mb-4">{currentPrompt.explanation}</p>
            )}
            {currentPrompt.mode_used && (
              <div className="text-emerald-400 font-semibold mb-2">Conflict Mode: {currentPrompt.mode_used}</div>
            )}
          </div>

          <div className="text-center text-slate-400">Moving to next question...</div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Question Display
    const timeProgress = (lightningRoundState.timeRemaining / 30) * 100;
    const streakFires = '🔥'.repeat(Math.min(lightningRoundState.streak, 5));

    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={() => {
                resetQuiz();
                setView('practice-hub');
              }}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-4xl font-bold text-white tracking-tight">⚡ Lightning Round</h1>
        </header>

        {/* Timer Progress Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-slate-400 text-sm">⏱️ {lightningRoundState.timeRemaining}s</div>
            <div className="text-slate-400 text-sm">Streak: {streakFires} {lightningRoundState.streak}x</div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3">
            <div 
              className={`${lightningRoundState.timeRemaining > 10 ? 'bg-yellow-500' : 'bg-red-500'} h-3 rounded-full transition-all duration-1000`}
              style={{width: `${timeProgress}%`}}
            ></div>
          </div>
        </div>

        {/* Question Counter and Score */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-slate-400 text-sm uppercase tracking-wide">Question {lightningRoundState.currentQuestion + 1}/10</div>
          <div className="flex gap-4 text-sm">
            <div className="text-white">Score: <span className="text-yellow-400 font-bold">{lightningRoundState.score.toLocaleString()}</span></div>
            <div className="text-slate-400">Best: <span className="text-emerald-400">{bestScore.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Question */}
        <div className="glass-card p-8 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-6">{currentPrompt.question}</h2>
          
          <div className="space-y-3">
            {currentPrompt.options?.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="w-full glass-card p-4 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500/50 hover:border-blue-500"
              >
                <div className="flex items-start gap-3">
                  <span className="font-bold text-blue-400 text-xl">{String.fromCharCode(65 + idx)}.</span>
                  <span className="text-white flex-1">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Document Detective Activity View
  if (view === 'document-detective') {
    // For now, create sample cases if document_detective data doesn't exist
    const documentDetectiveCases = currentTask.practice?.document_detective || [
      {
        title: "The Resource Conflict",
        scenario: "Two departments are requesting the same senior developer for overlapping project timelines. Marketing needs the developer for a critical customer-facing feature launch in 3 weeks. Engineering needs them for a technical debt refactoring that's blocking 5 other features. Both projects are high priority. Team meetings have become tense, with each department presenting their case more aggressively. You need to resolve this conflict and ensure both projects can proceed.",
        correctDocs: ["Resource Management Plan", "Stakeholder Engagement Plan", "Communication Plan"],
        allDocs: [
          "Team Charter",
          "Stakeholder Engagement Plan",
          "Resource Management Plan",
          "Risk Register",
          "Communication Plan",
          "Budget Report",
          "Project Schedule",
          "Issue Log",
          "Scope Statement",
          "RACI Matrix"
        ],
        explanations: {
          "Resource Management Plan": {
            howToUse: "Check the resource allocation matrix and availability windows. Look for alternative resources or capacity adjustments.",
            purpose: "Determine actual resource availability and identify if the conflict can be resolved through scheduling or alternative assignments.",
            example: "Review the Resource Management Plan to see if another developer has similar skills, or if the timelines can be adjusted by a few days to allow sequential allocation."
          },
          "Stakeholder Engagement Plan": {
            howToUse: "Identify the key stakeholders from each department. Understand their influence, interest, and communication preferences.",
            purpose: "Plan how to engage both departments in a collaborative discussion, ensuring their concerns are heard and addressed.",
            example: "Use the Stakeholder Engagement Plan to schedule a joint meeting with both department heads, using their preferred communication channels and presenting the situation in terms that matter to each group."
          },
          "Communication Plan": {
            howToUse: "Follow the established escalation path and communication protocols. Ensure transparent communication with both parties.",
            purpose: "Maintain open dialogue, prevent information asymmetry, and ensure both departments understand the full context and constraints.",
            example: "Follow the Communication Plan to send a structured update to both departments, schedule a facilitated discussion, and document the resolution process."
          }
        },
        missedDocs: {
          "Issue Log": {
            why: "This resource conflict should be documented in the Issue Log to track it as an active impediment and ensure it's addressed systematically."
          }
        }
      }
    ];

    const currentCaseData = documentDetectiveCases[documentDetectiveState.currentCase];

    const toggleDocument = (docName) => {
      setDocumentDetectiveState(prev => {
        if (prev.selectedDocs.includes(docName)) {
          // Deselect
          return { ...prev, selectedDocs: prev.selectedDocs.filter(d => d !== docName) };
        } else if (prev.selectedDocs.length < 3) {
          // Select (if less than 3)
          return { ...prev, selectedDocs: [...prev.selectedDocs, docName] };
        }
        return prev; // Can't select more than 3
      });
    };

    const submitSelections = () => {
      if (documentDetectiveState.selectedDocs.length !== 3) return;
      
      const correctCount = documentDetectiveState.selectedDocs.filter(doc => 
        currentCaseData.correctDocs.includes(doc)
      ).length;
      
      setDocumentDetectiveState(prev => ({
        ...prev,
        showingFeedback: true,
        score: correctCount
      }));
    };

    const resetCase = () => {
      setDocumentDetectiveState(prev => ({
        ...prev,
        selectedDocs: [],
        showingFeedback: false,
        score: 0
      }));
    };

    const nextCase = () => {
      if (documentDetectiveState.currentCase < documentDetectiveCases.length - 1) {
        setDocumentDetectiveState({
          currentCase: documentDetectiveState.currentCase + 1,
          selectedDocs: [],
          showingFeedback: false,
          score: 0
        });
      } else {
        // All cases complete - loop back to first
        setDocumentDetectiveState({
          currentCase: 0,
          selectedDocs: [],
          showingFeedback: false,
          score: 0
        });
      }
    };

    const goToPracticeHub = () => {
      setDocumentDetectiveState({
        currentCase: 0,
        selectedDocs: [],
        showingFeedback: false,
        score: 0
      });
      setView('practice-hub');
    };

    if (!currentCaseData) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">🕵️ Document Detective</h1>
            <p className="text-slate-400">No cases available for this task.</p>
            <button 
              onClick={goToPracticeHub}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    // Feedback Screen
    if (documentDetectiveState.showingFeedback) {
      const selectedCorrect = documentDetectiveState.selectedDocs.filter(doc => 
        currentCaseData.correctDocs.includes(doc)
      );
      const selectedIncorrect = documentDetectiveState.selectedDocs.filter(doc => 
        !currentCaseData.correctDocs.includes(doc)
      );
      const missedImportant = currentCaseData.correctDocs.filter(doc => 
        !documentDetectiveState.selectedDocs.includes(doc)
      );

      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🕵️ Document Detective: {currentCaseData.title}</h1>
          </header>

          {/* Score Display */}
          <div className="glass-card p-6 mb-6 text-center">
            <h2 className="executive-font text-3xl font-bold text-white mb-2">
              Score: {documentDetectiveState.score}/3
            </h2>
            <p className="text-slate-400">You selected {documentDetectiveState.score} out of 3 correct documents</p>
          </div>

          {/* Correct Selections */}
          {selectedCorrect.length > 0 && (
            <div className="mb-6">
              <h3 className="executive-font text-xl font-semibold text-white mb-4">✅ Correct Selections</h3>
              <div className="space-y-4">
                {selectedCorrect.map((doc, idx) => {
                  const explanation = currentCaseData.explanations[doc];
                  return (
                    <div key={idx} className="glass-card p-6 border-l-4 border-emerald-500">
                      <h4 className="executive-font text-lg font-semibold text-white mb-3">{doc}</h4>
                      {explanation && (
                        <>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-emerald-400">Look for: </span>
                            <span className="text-slate-300">{explanation.howToUse}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-emerald-400">Use it to: </span>
                            <span className="text-slate-300">{explanation.purpose}</span>
                          </div>
                          {explanation.example && (
                            <div className="bg-slate-800/50 p-3 rounded border-l-2 border-emerald-400/50">
                              <p className="text-sm text-slate-300 italic">{explanation.example}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Missed Important Documents */}
          {missedImportant.length > 0 && (
            <div className="mb-6">
              <h3 className="executive-font text-xl font-semibold text-white mb-4">❌ Important Documents You Missed</h3>
              <div className="space-y-4">
                {missedImportant.map((doc, idx) => {
                  const explanation = currentCaseData.explanations[doc];
                  return (
                    <div key={idx} className="glass-card p-6 border-l-4 border-orange-500">
                      <h4 className="executive-font text-lg font-semibold text-white mb-3">You didn't pick {doc}</h4>
                      {explanation && (
                        <>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-orange-400">Why it matters: </span>
                            <span className="text-slate-300">{explanation.purpose}</span>
                          </div>
                          <div className="mb-3">
                            <span className="text-sm font-semibold text-orange-400">How to use it: </span>
                            <span className="text-slate-300">{explanation.howToUse}</span>
                          </div>
                          {explanation.example && (
                            <div className="bg-slate-800/50 p-3 rounded border-l-2 border-orange-400/50">
                              <p className="text-sm text-slate-300 italic">{explanation.example}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Incorrect Selections (if any) */}
          {selectedIncorrect.length > 0 && (
            <div className="mb-6">
              <h3 className="executive-font text-xl font-semibold text-white mb-4">Incorrect Selections</h3>
              <div className="space-y-2">
                {selectedIncorrect.map((doc, idx) => (
                  <div key={idx} className="glass-card p-4 border-l-4 border-slate-600">
                    <p className="text-slate-400">{doc} - Not the most relevant for this scenario</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={resetCase}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Try Again
            </button>
            {documentDetectiveCases.length > 1 && (
              <button 
                onClick={nextCase}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors executive-font"
              >
                Next Case →
              </button>
            )}
            <button 
              onClick={goToPracticeHub}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Case Display
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🕵️ Document Detective: {currentCaseData.title}</h1>
        </header>

        {/* Case Display */}
        <div className="glass-card p-8 mb-6">
          <h2 className="executive-font text-2xl font-bold text-white mb-4">{currentCaseData.title}</h2>
          <div className="text-slate-300 mb-6 whitespace-pre-line leading-relaxed">
            {currentCaseData.scenario}
          </div>
          <div className="glass-card p-4 bg-blue-500/10 border-l-4 border-blue-500">
            <p className="text-blue-400 font-semibold">📋 Your Mission: Select the 3 most relevant documents</p>
          </div>
        </div>

        {/* Document Selection */}
        <div className="glass-card p-6 mb-6">
          <h3 className="executive-font text-xl font-semibold text-white mb-4">
            Available Documents ({documentDetectiveState.selectedDocs.length}/3 selected)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCaseData.allDocs.map((doc, idx) => {
              const isSelected = documentDetectiveState.selectedDocs.includes(doc);
              return (
                <button
                  key={idx}
                  onClick={() => toggleDocument(doc)}
                  disabled={!isSelected && documentDetectiveState.selectedDocs.length >= 3}
                  className={`glass-card p-4 text-left transition-all border-l-4 ${
                    isSelected 
                      ? 'border-cyan-500 bg-cyan-500/10' 
                      : documentDetectiveState.selectedDocs.length >= 3
                        ? 'border-slate-600 opacity-50 cursor-not-allowed'
                        : 'border-slate-600 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected ? 'bg-cyan-500 border-cyan-500' : 'border-slate-400'
                    }`}>
                      {isSelected && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className={`font-semibold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>{doc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={submitSelections}
            disabled={documentDetectiveState.selectedDocs.length !== 3}
            className={`px-8 py-4 font-semibold rounded-lg transition-colors executive-font text-lg ${
              documentDetectiveState.selectedDocs.length === 3
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            Submit Selections
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Conflict Mode Matcher Activity View
  if (view === 'conflict-matcher') {
    const conflictMatcherScenarios = currentTask.practice?.conflict_matcher || [
      {
        id: 1,
        scenario: "Two developers disagree on API design during Sprint Planning. Both have valid technical arguments.",
        correctMode: "COLLABORATE",
        explanation: "Technical decisions benefit from collaborative discussion to find the best solution that leverages both perspectives.",
        examTip: "For technical disagreements between team members, collaboration is almost always the best answer."
      },
      {
        id: 2,
        scenario: "Team member consistently misses daily standup. When asked, they say it's not important.",
        correctMode: "CONFRONT",
        explanation: "Address issues directly with facts and empathy. This is a behavior that needs correction.",
        examTip: "When someone isn't following agreed processes, confront (direct but respectful) is the right first step."
      },
      {
        id: 3,
        scenario: "Emergency: Production system down. Two experts suggest different fixes. Decision needed NOW.",
        correctMode: "FORCE",
        explanation: "In emergency situations, use expertise and authority to make fast decision. Document rationale afterwards.",
        examTip: "Force mode is only correct for emergencies, safety issues, or legal/ethical violations."
      },
      {
        id: 4,
        scenario: "Designer prefers blue interface, you prefer green. Both work. Issue is minor.",
        correctMode: "ACCOMMODATE",
        explanation: "When the issue is minor and the other party is the expert (designer), accommodating preserves relationship and leverages their expertise.",
        examTip: "Accommodate when issue is minor and relationship/expertise matters more than the specific choice."
      },
      {
        id: 5,
        scenario: "Two departments want same resource for overlapping timeframes. Both projects critical. Budget is fixed.",
        correctMode: "COMPROMISE",
        explanation: "When both parties have equal legitimate needs and time/budget constraints prevent full satisfaction, compromise finds middle ground.",
        examTip: "Compromise is acceptable when time is limited and both parties can give ground."
      },
      {
        id: 6,
        scenario: "Two team members have minor disagreement about meeting time. One prefers morning, one prefers afternoon.",
        correctMode: "COLLABORATE",
        explanation: "Even for minor issues, collaboration builds team ownership and may reveal creative solutions (e.g., alternating times).",
        examTip: "PMI prefers collaboration whenever possible, even for minor issues."
      }
    ];

    const conflictModes = [
      { name: "COLLABORATE", emoji: "🤝", color: "emerald" },
      { name: "CONFRONT", emoji: "🎯", color: "blue" },
      { name: "COMPROMISE", emoji: "⚖️", color: "yellow" },
      { name: "ACCOMMODATE", emoji: "🤝", color: "orange" },
      { name: "FORCE", emoji: "⚠️", color: "red" },
      { name: "AVOID", emoji: "❌", color: "slate" }
    ];

    const handleDragStart = (scenarioId) => {
      setConflictMatcherState(prev => ({ ...prev, draggedScenario: scenarioId }));
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (modeName) => {
      if (!conflictMatcherState.draggedScenario) return;
      
      setConflictMatcherState(prev => ({
        ...prev,
        matches: { ...prev.matches, [prev.draggedScenario]: modeName },
        draggedScenario: null
      }));
    };

    const handleClickSelect = (scenarioId, modeName) => {
      setConflictMatcherState(prev => ({
        ...prev,
        matches: { ...prev.matches, [scenarioId]: modeName },
        draggedScenario: null
      }));
    };

    const checkAnswers = () => {
      let correctCount = 0;
      conflictMatcherScenarios.forEach(scenario => {
        if (conflictMatcherState.matches[scenario.id] === scenario.correctMode) {
          correctCount++;
        }
      });

      setConflictMatcherState(prev => ({
        ...prev,
        showingFeedback: true,
        score: correctCount
      }));
    };

    const resetGame = () => {
      setConflictMatcherState({
        matches: {},
        showingFeedback: false,
        score: 0,
        draggedScenario: null
      });
    };

    const goToPracticeHub = () => {
      resetGame();
      setView('practice-hub');
    };

    const allMatched = Object.keys(conflictMatcherState.matches).length === conflictMatcherScenarios.length;

    // Feedback Screen
    if (conflictMatcherState.showingFeedback) {
      return (
        <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🧩 Conflict Mode Matcher</h1>
          </header>

          {/* Score Display */}
          <div className="glass-card p-6 mb-6 text-center">
            <h2 className="executive-font text-3xl font-bold text-white mb-2">
              Score: {conflictMatcherState.score}/6
            </h2>
            {conflictMatcherState.score === 6 && (
              <p className="text-emerald-400 text-xl font-bold animate-pulse">🎉 Perfect! All matches correct! 🎉</p>
            )}
          </div>

          {/* Feedback for each scenario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {conflictMatcherScenarios.map(scenario => {
              const userMatch = conflictMatcherState.matches[scenario.id];
              const isCorrect = userMatch === scenario.correctMode;

              return (
                <div 
                  key={scenario.id} 
                  className={`glass-card p-6 border-l-4 ${
                    isCorrect ? 'border-emerald-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <span className="text-3xl">{isCorrect ? '✅' : '❌'}</span>
                    <div className="flex-1">
                      <p className="text-white mb-2">{scenario.scenario}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-slate-400">Your match:</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {userMatch || 'No match'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-slate-400">Correct:</span>
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-400">
                            {scenario.correctMode}
                          </span>
                        </div>
                      )}
                      {isCorrect && (
                        <span className="text-emerald-400 font-bold text-sm">+100 points</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <span className="text-sm font-semibold text-white">Why {scenario.correctMode}:</span>
                      <p className="text-sm text-slate-300 mt-1">{scenario.explanation}</p>
                    </div>
                    {scenario.examTip && (
                      <div className="bg-blue-500/10 p-3 rounded border-l-2 border-blue-500">
                        <p className="text-xs text-blue-400 italic">{scenario.examTip}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Try Again
            </button>
            <button 
              onClick={goToPracticeHub}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Game Display
    return (
      <div className="max-w-7xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">🧩 Conflict Mode Matcher</h1>
          <p className="text-slate-400 mt-2">Drag each scenario to the correct conflict mode, or click scenario then select mode</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
          {/* Left Column - Scenarios */}
          <div>
            <h2 className="executive-font text-2xl font-bold text-white mb-4">Scenarios</h2>
            <div className="space-y-4">
              {conflictMatcherScenarios.map(scenario => {
                const isMatched = conflictMatcherState.matches[scenario.id];
                const isDragging = conflictMatcherState.draggedScenario === scenario.id;

                if (isMatched) return null; // Don't show matched scenarios

                return (
                  <div
                    key={scenario.id}
                    draggable
                    onDragStart={() => handleDragStart(scenario.id)}
                    onClick={() => setConflictMatcherState(prev => ({ ...prev, draggedScenario: scenario.id }))}
                    className={`glass-card p-4 cursor-move transition-all ${
                      isDragging ? 'opacity-50 scale-95' : 'hover:scale-105'
                    } ${!isMatched ? 'animate-pulse' : ''}`}
                    style={{ boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.3)' : 'none' }}
                  >
                    <p className="text-white text-sm">{scenario.scenario}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - Conflict Modes */}
          <div>
            <h2 className="executive-font text-2xl font-bold text-white mb-4">Conflict Modes</h2>
            <div className="space-y-4">
              {conflictModes.map(mode => {
                const matchedScenarioId = Object.keys(conflictMatcherState.matches).find(
                  id => conflictMatcherState.matches[id] === mode.name
                );
                const matchedScenario = matchedScenarioId ? 
                  conflictMatcherScenarios.find(s => s.id === parseInt(matchedScenarioId)) : null;
                const isEmpty = !matchedScenario;
                const borderColor = isEmpty ? 'border-slate-600' : mode.color === 'emerald' ? 'border-emerald-500' : mode.color === 'blue' ? 'border-blue-500' : mode.color === 'yellow' ? 'border-yellow-500' : mode.color === 'orange' ? 'border-orange-500' : mode.color === 'red' ? 'border-red-500' : 'border-slate-500';

                return (
                  <div
                    key={mode.name}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(mode.name)}
                    onClick={() => conflictMatcherState.draggedScenario && handleClickSelect(conflictMatcherState.draggedScenario, mode.name)}
                    className={`glass-card p-4 border-2 transition-all cursor-pointer ${
                      isEmpty 
                        ? 'border-dashed border-slate-600 hover:border-cyan-500' 
                        : `border-solid ${borderColor}`
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{mode.emoji}</span>
                      <span className="executive-font text-lg font-semibold text-white">{mode.name}</span>
                    </div>
                    {matchedScenario ? (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-slate-300 text-sm">{matchedScenario.scenario}</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConflictMatcherState(prev => {
                              const newMatches = { ...prev.matches };
                              delete newMatches[matchedScenario.id];
                              return { ...prev, matches: newMatches };
                            });
                          }}
                          className="text-xs text-red-400 hover:text-red-300 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs mt-2">Drop scenario here or click to select</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Click-to-Select Alternative (for accessibility) */}
        {conflictMatcherState.draggedScenario && (
          <div className="glass-card p-4 mb-6">
            <p className="text-slate-400 text-sm mb-3">Select conflict mode for this scenario:</p>
            <div className="flex flex-wrap gap-2">
              {conflictModes.map(mode => (
                <button
                  key={mode.name}
                  onClick={() => handleClickSelect(conflictMatcherState.draggedScenario, mode.name)}
                  className="px-4 py-2 glass-card hover:bg-blue-500/10 text-white text-sm transition-colors"
                >
                  {mode.emoji} {mode.name}
                </button>
              ))}
              <button
                onClick={() => setConflictMatcherState(prev => ({ ...prev, draggedScenario: null }))}
                className="px-4 py-2 glass-card hover:bg-red-500/10 text-red-400 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Check Answers Button */}
        <div className="flex justify-center">
          <button
            onClick={checkAnswers}
            disabled={!allMatched}
            className={`px-8 py-4 font-semibold rounded-lg transition-colors executive-font text-lg ${
              allMatched
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            Check Answers ({Object.keys(conflictMatcherState.matches).length}/6)
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Timeline Reconstructor Activity View
  if (view === 'timeline-reconstructor') {
    const timelineData = currentTask.practice?.timeline_reconstructor;
    
    // Initialize steps in random order if not already initialized
    const initializeSteps = () => {
      if (!timelineData?.steps) return [];
      const steps = [...timelineData.steps];
      // Shuffle array using Fisher-Yates
      for (let i = steps.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [steps[i], steps[j]] = [steps[j], steps[i]];
      }
      return steps;
    };

    // Initialize steps on first render if needed
    if (timelineReconstructorState.steps.length === 0 && timelineData?.steps && timelineData.steps.length > 0) {
      // Initialize with shuffled steps - this will run on component mount
      const shuffledSteps = initializeSteps();
      if (shuffledSteps.length > 0) {
        // Use setTimeout to avoid state update during render
        setTimeout(() => {
          setTimelineReconstructorState(prev => ({ ...prev, steps: shuffledSteps }));
        }, 0);
      }
    }

    const handleDragStart = (stepId) => {
      setTimelineReconstructorState(prev => ({ ...prev, draggedStep: stepId }));
    };

    const handleDragOver = (e, index) => {
      e.preventDefault();
      setTimelineReconstructorState(prev => ({ ...prev, dragOverIndex: index }));
    };

    const handleDrop = (e, dropIndex) => {
      e.preventDefault();
      if (timelineReconstructorState.draggedStep === null) return;

      const draggedStepId = timelineReconstructorState.draggedStep;
      const steps = [...timelineReconstructorState.steps];
      const draggedIndex = steps.findIndex(s => s.id === draggedStepId);

      if (draggedIndex === -1 || draggedIndex === dropIndex) {
        setTimelineReconstructorState(prev => ({ ...prev, draggedStep: null, dragOverIndex: null }));
        return;
      }

      // Remove dragged step and insert at new position
      const [draggedStep] = steps.splice(draggedIndex, 1);
      steps.splice(dropIndex, 0, draggedStep);

      setTimelineReconstructorState(prev => ({
        ...prev,
        steps,
        draggedStep: null,
        dragOverIndex: null
      }));
    };

    const moveStep = (stepId, direction) => {
      const steps = [...timelineReconstructorState.steps];
      const index = steps.findIndex(s => s.id === stepId);
      if (index === -1) return;

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= steps.length) return;

      [steps[index], steps[newIndex]] = [steps[newIndex], steps[index]];

      setTimelineReconstructorState(prev => ({ ...prev, steps }));
    };

    const checkOrder = () => {
      if (!timelineData?.steps) return;
      
      let correctCount = 0;
      timelineReconstructorState.steps.forEach((step, index) => {
        if (step.correctOrder === index + 1) {
          correctCount++;
        }
      });

      setTimelineReconstructorState(prev => ({
        ...prev,
        showingFeedback: true,
        score: correctCount
      }));
    };

    const resetGame = () => {
      const newSteps = timelineData?.steps ? initializeSteps() : [];
      setTimelineReconstructorState({
        steps: newSteps,
        showingFeedback: false,
        score: 0,
        draggedStep: null,
        dragOverIndex: null
      });
    };

    const goToPracticeHub = () => {
      setTimelineReconstructorState({
        steps: [],
        showingFeedback: false,
        score: 0,
        draggedStep: null,
        dragOverIndex: null
      });
      setView('practice-hub');
    };

    if (!timelineData || !timelineData.steps || timelineData.steps.length === 0) {
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <div className="glass-card p-10 text-center">
            <h1 className="executive-font text-3xl font-bold text-white mb-4">📋 Timeline Reconstructor</h1>
            <p className="text-slate-400">No timeline data available for this task.</p>
            <button 
              onClick={goToPracticeHub}
              className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              ← Back to Practice Hub
            </button>
            <GlobalNavFooter />
          </div>
        </div>
      );
    }

    // Use initialized steps or initialize on first render
    const currentSteps = timelineReconstructorState.steps.length > 0 
      ? timelineReconstructorState.steps 
      : initializeSteps();

    // Initialize on mount if needed
    if (timelineReconstructorState.steps.length === 0 && currentSteps.length > 0) {
      setTimeout(() => {
        setTimelineReconstructorState(prev => ({ ...prev, steps: currentSteps }));
      }, 0);
    }

    // Feedback Screen
    if (timelineReconstructorState.showingFeedback) {
      const stepsForFeedback = timelineReconstructorState.steps.length > 0 ? timelineReconstructorState.steps : currentSteps;
      
      return (
        <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={goToPracticeHub}
                className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="executive-font text-5xl font-bold text-white tracking-tight">📋 Timeline Reconstructor: {timelineData.title}</h1>
          </header>

          {/* Score Display */}
          <div className="glass-card p-6 mb-6 text-center">
            <h2 className="executive-font text-3xl font-bold text-white mb-2">
              Score: {timelineReconstructorState.score}/{timelineData.steps.length}
            </h2>
            <p className="text-slate-400">You got {timelineReconstructorState.score} steps in the correct order</p>
          </div>

          {/* Feedback for each step */}
          <div className="space-y-4 mb-6">
            {stepsForFeedback.map((step, index) => {
              const isCorrect = step.correctOrder === index + 1;
              const correctStep = timelineData.steps.find(s => s.correctOrder === index + 1);

              return (
                <div 
                  key={step.id} 
                  className={`glass-card p-6 border-l-4 ${
                    isCorrect ? 'border-emerald-500' : 'border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl`}>
                        {isCorrect ? '✅' : '❌'}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg font-bold text-white">Step {index + 1}:</span>
                        <span className="text-white font-semibold">{step.text}</span>
                        {isCorrect && <span className="text-emerald-400 font-bold text-sm">+50 points</span>}
                      </div>
                      {!isCorrect && (
                        <div className="mb-3">
                          <span className="text-sm text-slate-400">Correct position: Step {step.correctOrder}</span>
                          {correctStep && (
                            <span className="text-sm text-emerald-400 ml-2">({correctStep.text})</span>
                          )}
                        </div>
                      )}
                      <div className="mt-3">
                        <span className="text-sm font-semibold text-white">Why this order:</span>
                        <p className="text-sm text-slate-300 mt-1">{step.whyThisOrder}</p>
                      </div>
                      {step.commonMistake && (
                        <div className="mt-2 bg-slate-800/50 p-3 rounded border-l-2 border-orange-500/50">
                          <p className="text-xs text-orange-400 italic">Common mistake: {step.commonMistake}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Correct Sequence Display */}
          <div className="glass-card p-6 mb-6">
            <h3 className="executive-font text-xl font-semibold text-white mb-4">Correct Sequence</h3>
            <div className="space-y-3">
              {[...timelineData.steps].sort((a, b) => a.correctOrder - b.correctOrder).map((step) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center flex-shrink-0">
                    {step.correctOrder}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{step.text}</p>
                    <p className="text-sm text-slate-400 mt-1">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Try Again
            </button>
            <button 
              onClick={resetGame}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              New Challenge
            </button>
            <button 
              onClick={goToPracticeHub}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors executive-font"
            >
              Back to Practice Hub
            </button>
          </div>
          <GlobalNavFooter />
        </div>
      );
    }

    // Game Display - use current steps
    const displaySteps = timelineReconstructorState.steps.length > 0 ? timelineReconstructorState.steps : currentSteps;
    
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={goToPracticeHub}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">📋 Timeline Reconstructor: {timelineData.title}</h1>
        </header>

        {/* Instructions Card */}
        <div className="glass-card p-6 mb-6 bg-blue-500/10 border-l-4 border-blue-500">
          <p className="text-blue-400 font-semibold text-lg">{timelineData.description || "A conflict just occurred. Arrange these conflict resolution steps in the CORRECT order (drag to reorder)."}</p>
        </div>

        {/* Steps Display */}
        <div className="glass-card p-6 mb-6">
          <div className="space-y-3">
            {displaySteps.map((step, index) => {
              const isDragging = timelineReconstructorState.draggedStep === step.id;
              const isDragOver = timelineReconstructorState.dragOverIndex === index;

              return (
                <div
                  key={step.id}
                  draggable
                  onDragStart={() => handleDragStart(step.id)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`glass-card p-4 flex items-center gap-4 cursor-move transition-all ${
                    isDragging ? 'opacity-50 scale-95' : 'hover:scale-[1.02]'
                  } ${isDragOver ? 'border-t-4 border-cyan-500' : ''}`}
                  style={{ 
                    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.4)' : 'none'
                  }}
                >
                  {/* Drag Handle */}
                  <div className="text-slate-400 text-2xl cursor-grab active:cursor-grabbing">☰</div>
                  
                  {/* Step Number */}
                  <div className="w-10 h-10 rounded-full bg-slate-700 text-white font-bold flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>

                  {/* Step Text */}
                  <div className="flex-1">
                    <p className="text-white font-semibold">{step.text}</p>
                  </div>

                  {/* Up/Down Arrow Buttons (Accessibility) */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(step.id, 'up');
                      }}
                      disabled={index === 0}
                      className="px-2 py-1 text-xs glass-card hover:bg-blue-500/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        moveStep(step.id, 'down');
                      }}
                      disabled={index === displaySteps.length - 1}
                      className="px-2 py-1 text-xs glass-card hover:bg-blue-500/10 text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      ↓
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Check Order Button */}
        <div className="flex justify-center">
          <button
            onClick={checkOrder}
            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors executive-font text-lg"
          >
            Check Order
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

  // Placeholder views for other activities
  if (view === 'empathy-exercise') {
    const activityNames = {
      'timeline-reconstructor': 'Timeline Reconstructor',
      'empathy-exercise': 'Empathy Exercise'
    };
    
    return (
      <div className="max-w-6xl w-full p-10 animate-fadeIn text-left">
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <button 
              onClick={() => setView('practice-hub')}
              className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
            >
              ← Back
            </button>
          </div>
          <h1 className="executive-font text-5xl font-bold text-white tracking-tight">{activityNames[view]}: {selectedTask}</h1>
        </header>
        <div className="glass-card p-10 text-center">
          <p className="text-slate-400 text-lg mb-6">This activity is coming soon!</p>
          <button 
            onClick={() => setView('practice-hub')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors executive-font"
          >
            ← Back to Practice Hub
          </button>
        </div>
        <GlobalNavFooter />
      </div>
    );
  }

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
      {/* Header with Back Button */}
      <header className="mb-10">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => setView('task-interstitial')}
            className="px-4 py-2 executive-font text-xs text-slate-400 hover:text-white uppercase font-semibold transition-colors flex items-center gap-2"
          >
            ← Back
          </button>
        </div>
        <h1 className="executive-font text-5xl font-bold text-white mb-2 tracking-tight">Practice Hub: {selectedTask}</h1>
      </header>
      
      {/* Activity Cards Grid - 3x2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <button 
          onClick={() => setView('pm-simulator')}
          className="glass-card p-8 text-left hover:bg-blue-500/10 transition-all border-l-4 border-blue-500 min-h-[200px] transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">PM Simulator</h3>
          <p className="text-slate-400 text-sm">Branching scenarios with consequences</p>
        </button>
        
        <button 
          onClick={() => setView('lightning-round')}
          className="glass-card p-8 text-left hover:bg-yellow-500/10 transition-all border-l-4 border-yellow-500 min-h-[200px] transform hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20"
        >
          <div className="text-6xl mb-4">⚡</div>
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Lightning Round</h3>
          <p className="text-slate-400 text-sm">Fast-paced quiz - 10 questions</p>
        </button>
        
        <button 
          onClick={() => setView('document-detective')}
          className="glass-card p-8 text-left hover:bg-purple-500/10 transition-all border-l-4 border-purple-500 min-h-[200px] transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
        >
          <div className="text-6xl mb-4">🕵️</div>
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Document Detective</h3>
          <p className="text-slate-400 text-sm">Match documents to scenarios</p>
        </button>
        
        <button 
          onClick={() => setView('conflict-matcher')}
          className="glass-card p-8 text-left hover:bg-emerald-500/10 transition-all border-l-4 border-emerald-500 min-h-[200px] transform hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/20"
        >
          <div className="text-6xl mb-4">🧩</div>
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Conflict Mode Matcher</h3>
          <p className="text-slate-400 text-sm">Drag-drop conflict modes</p>
        </button>
        
        <button 
          onClick={() => setView('timeline-reconstructor')}
          className="glass-card p-8 text-left hover:bg-cyan-500/10 transition-all border-l-4 border-cyan-500 min-h-[200px] transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <div className="text-6xl mb-4">📋</div>
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Timeline Reconstructor</h3>
          <p className="text-slate-400 text-sm">Order resolution steps</p>
        </button>
        
        <button 
          onClick={() => setView('empathy-exercise')}
          className="glass-card p-8 text-left hover:bg-rose-500/10 transition-all border-l-4 border-rose-500 min-h-[200px] transform hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/20"
        >
          <div className="text-6xl mb-4">👥</div>
          <h3 className="executive-font text-2xl font-semibold text-white mb-3">Empathy Exercise</h3>
          <p className="text-slate-400 text-sm">See all perspectives</p>
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