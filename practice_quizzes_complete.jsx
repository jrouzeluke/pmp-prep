import React, { useState } from 'react';

// Task data organized by domain
const taskData = {
  people: {
    name: 'People',
    color: 'violet',
    gradient: 'from-violet-600 to-purple-600',
    icon: '👥',
    percentage: '42%',
    tasks: [
      { id: 1, name: 'Manage Conflict', short: 'Conflict' },
      { id: 2, name: 'Lead a Team', short: 'Leadership' },
      { id: 3, name: 'Support Team Performance', short: 'Performance' },
      { id: 4, name: 'Empower Team Members', short: 'Empower' },
      { id: 5, name: 'Ensure Adequate Training', short: 'Training' },
      { id: 6, name: 'Build a Team', short: 'Build Team' },
      { id: 7, name: 'Address Impediments', short: 'Impediments' },
      { id: 8, name: 'Negotiate Agreements', short: 'Negotiate' },
      { id: 9, name: 'Collaborate with Stakeholders', short: 'Collaborate' },
      { id: 10, name: 'Build Shared Understanding', short: 'Shared Understanding' },
      { id: 11, name: 'Engage Virtual Teams', short: 'Virtual Teams' },
      { id: 12, name: 'Define Team Ground Rules', short: 'Ground Rules' },
      { id: 13, name: 'Mentor Stakeholders', short: 'Mentor' },
      { id: 14, name: 'Promote Emotional Intelligence', short: 'EQ' }
    ]
  },
  process: {
    name: 'Process',
    color: 'cyan',
    gradient: 'from-cyan-500 to-blue-600',
    icon: '⚙️',
    percentage: '50%',
    tasks: [
      { id: 15, name: 'Execute with Urgency', short: 'Execute' },
      { id: 16, name: 'Manage Communications', short: 'Communications' },
      { id: 17, name: 'Assess and Manage Risks', short: 'Risks' },
      { id: 18, name: 'Engage Stakeholders', short: 'Engage' },
      { id: 19, name: 'Plan Budget and Resources', short: 'Budget' },
      { id: 20, name: 'Plan and Manage Schedule', short: 'Schedule' },
      { id: 21, name: 'Plan and Manage Quality', short: 'Quality' },
      { id: 22, name: 'Plan and Manage Scope', short: 'Scope' },
      { id: 23, name: 'Integrate Project Planning', short: 'Integration' },
      { id: 24, name: 'Manage Project Changes', short: 'Changes' },
      { id: 25, name: 'Plan and Manage Procurement', short: 'Procurement' },
      { id: 26, name: 'Manage Project Artifacts', short: 'Artifacts' },
      { id: 27, name: 'Determine Methodology', short: 'Methodology' },
      { id: 28, name: 'Establish Governance', short: 'Governance' },
      { id: 29, name: 'Manage Project Issues', short: 'Issues' },
      { id: 30, name: 'Ensure Knowledge Transfer', short: 'Knowledge' },
      { id: 31, name: 'Plan and Manage Closure', short: 'Closure' }
    ]
  },
  business: {
    name: 'Business Environment',
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    icon: '💼',
    percentage: '8%',
    tasks: [
      { id: 32, name: 'Plan and Manage Compliance', short: 'Compliance' },
      { id: 33, name: 'Evaluate and Deliver Benefits', short: 'Benefits' },
      { id: 34, name: 'Evaluate External Changes', short: 'External Changes' },
      { id: 35, name: 'Support Organizational Change', short: 'Org Change' }
    ]
  }
};

// Approach data
const approachData = {
  agile: {
    name: 'Agile',
    subtitle: 'Adaptive & Iterative',
    gradient: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    icon: '🔄',
    description: 'Scrum, Kanban, sprints, user stories, continuous delivery',
    concepts: ['Sprints & Iterations', 'Product Backlog', 'Daily Standups', 'Retrospectives', 'User Stories', 'Velocity'],
    examTip: '~50% of PMP questions have agile context'
  },
  predictive: {
    name: 'Predictive',
    subtitle: 'Plan-Driven & Sequential',
    gradient: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
    icon: '📋',
    description: 'Waterfall, detailed planning, phase gates, formal change control',
    concepts: ['WBS & Scope Baseline', 'Critical Path', 'Earned Value', 'Change Control Board', 'Phase Gates', 'Formal Sign-offs'],
    examTip: 'Foundation of traditional PM knowledge'
  },
  hybrid: {
    name: 'Hybrid',
    subtitle: 'Best of Both Worlds',
    gradient: 'from-orange-500 to-amber-500',
    borderColor: 'border-orange-500',
    icon: '🔀',
    description: 'Combining approaches based on project needs and context',
    concepts: ['Tailoring', 'Adaptive Planning', 'Rolling Wave', 'Mixed Teams', 'Phased Agile', 'Context-Driven'],
    examTip: 'PMI emphasizes choosing the right approach'
  }
};

// Sample quiz results for demo
const sampleResults = {
  total: 15,
  correct: 11,
  timeSpent: '14:32',
  questions: [
    { id: 1, correct: true, task: 'Manage Conflict', domain: 'people' },
    { id: 2, correct: true, task: 'Lead a Team', domain: 'people' },
    { id: 3, correct: false, task: 'Support Team Performance', domain: 'people', weakness: 'SBI Feedback Model' },
    { id: 4, correct: true, task: 'Empower Team Members', domain: 'people' },
    { id: 5, correct: true, task: 'Assess and Manage Risks', domain: 'process' },
    { id: 6, correct: false, task: 'Plan Budget and Resources', domain: 'process', weakness: 'EVM Calculations' },
    { id: 7, correct: true, task: 'Plan and Manage Schedule', domain: 'process' },
    { id: 8, correct: true, task: 'Manage Project Changes', domain: 'process' },
    { id: 9, correct: false, task: 'Plan and Manage Procurement', domain: 'process', weakness: 'Contract Types' },
    { id: 10, correct: true, task: 'Determine Methodology', domain: 'process' },
    { id: 11, correct: true, task: 'Plan and Manage Compliance', domain: 'business' },
    { id: 12, correct: true, task: 'Evaluate and Deliver Benefits', domain: 'business' },
    { id: 13, correct: false, task: 'Support Organizational Change', domain: 'business', weakness: 'Change Management Models' },
    { id: 14, correct: true, task: 'Negotiate Agreements', domain: 'people' },
    { id: 15, correct: true, task: 'Build Shared Understanding', domain: 'people' }
  ]
};

export default function PracticeQuizzes() {
  const [view, setView] = useState('main'); // main, domain-select, task-select, approach-select, quiz, results
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedApproach, setSelectedApproach] = useState(null);
  const [expandedDomain, setExpandedDomain] = useState('people');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);

  // Filter tasks based on search
  const filterTasks = (tasks) => {
    if (!searchTerm) return tasks;
    return tasks.filter(t => 
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.short.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Main Quiz Selection View
  const MainView = () => {
    const quizOptions = [
      {
        id: 'random',
        title: 'Random 15',
        description: '15 questions across all domains',
        icon: '🎲',
        color: 'from-violet-600 to-purple-600',
        borderColor: 'border-violet-500',
        badge: 'POPULAR',
        action: () => setView('quiz')
      },
      {
        id: 'domain',
        title: 'By Domain',
        description: 'People • Process • Business',
        icon: '🎯',
        color: 'from-cyan-500 to-blue-600',
        borderColor: 'border-cyan-500',
        action: () => setView('domain-select')
      },
      {
        id: 'task',
        title: 'By Task Area',
        description: 'Target specific ECO tasks',
        icon: '📋',
        color: 'from-emerald-500 to-teal-600',
        borderColor: 'border-emerald-500',
        action: () => setView('task-select')
      },
      {
        id: 'approach',
        title: 'By Approach',
        description: 'Agile • Predictive • Hybrid',
        icon: '⚡',
        color: 'from-orange-500 to-amber-500',
        borderColor: 'border-orange-500',
        action: () => setView('approach-select')
      }
    ];

    return (
      <>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Practice Quizzes
          </h1>
          <p className="text-slate-400 text-sm mt-1">Choose your challenge</p>
        </div>

        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-4">
          {quizOptions.map((quiz) => (
            <div
              key={quiz.id}
              onClick={quiz.action}
              className={`
                relative cursor-pointer rounded-2xl
                bg-slate-900/80 backdrop-blur-sm
                border-2 transition-all duration-300
                ${hoveredCard === quiz.id ? `${quiz.borderColor} scale-[1.02]` : 'border-slate-800'}
                flex flex-col justify-center items-center text-center p-6
              `}
              onMouseEnter={() => setHoveredCard(quiz.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${quiz.color} opacity-0 blur-xl transition-opacity duration-300 -z-10 ${hoveredCard === quiz.id ? 'opacity-30' : ''}`}></div>
              
              {quiz.badge && (
                <span className="absolute top-3 right-3 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
                  {quiz.badge}
                </span>
              )}

              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${quiz.color} flex items-center justify-center text-3xl mb-4 shadow-lg transition-transform duration-300 ${hoveredCard === quiz.id ? 'scale-110' : ''}`}>
                {quiz.icon}
              </div>

              <h3 className="text-xl font-bold mb-1">{quiz.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{quiz.description}</p>

              <button className={`px-5 py-2 rounded-lg bg-gradient-to-r ${quiz.color} font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2`}>
                Select <span>→</span>
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Domain Selection View - 3 Beautiful Cards
  const DomainSelectView = () => {
    const domains = [
      { key: 'people', ...taskData.people },
      { key: 'process', ...taskData.process },
      { key: 'business', ...taskData.business }
    ];

    return (
      <>
        <div className="text-center mb-6">
          <button onClick={() => setView('main')} className="text-slate-400 hover:text-white text-sm mb-2 flex items-center gap-1 mx-auto">
            ← Back to Quiz Types
          </button>
          <h1 className="text-3xl font-bold text-white">Select Domain</h1>
          <p className="text-slate-400 text-sm mt-1">Choose a domain to focus your practice</p>
        </div>

        <div className="flex-1 flex gap-4 items-stretch">
          {domains.map((domain) => (
            <div
              key={domain.key}
              onClick={() => {
                setSelectedDomain(domain.key);
                setView('quiz');
              }}
              className={`
                flex-1 cursor-pointer rounded-2xl
                bg-slate-900/80 backdrop-blur-sm
                border-2 border-slate-800 hover:border-${domain.color}-500
                transition-all duration-300 hover:scale-[1.02]
                flex flex-col p-6 relative overflow-hidden group
              `}
            >
              {/* Background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${domain.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Percentage badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-slate-800 rounded-full text-xs font-bold text-slate-300">
                {domain.percentage} of exam
              </div>

              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${domain.gradient} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                {domain.icon}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold text-white mb-2">{domain.name}</h2>
              
              {/* Task count */}
              <p className="text-slate-400 mb-4">{domain.tasks.length} task areas</p>

              {/* Task preview */}
              <div className="flex-1 space-y-1">
                {domain.tasks.slice(0, 4).map((task, i) => (
                  <div key={i} className="text-xs text-slate-500 truncate">• {task.short}</div>
                ))}
                {domain.tasks.length > 4 && (
                  <div className="text-xs text-slate-600">+{domain.tasks.length - 4} more...</div>
                )}
              </div>

              {/* Button */}
              <button className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${domain.gradient} font-semibold transition-all hover:shadow-lg`}>
                Start {domain.name} Quiz →
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Approach Selection View - 3 Beautiful Cards
  const ApproachSelectView = () => {
    const approaches = [
      { key: 'agile', ...approachData.agile },
      { key: 'predictive', ...approachData.predictive },
      { key: 'hybrid', ...approachData.hybrid }
    ];

    return (
      <>
        <div className="text-center mb-6">
          <button onClick={() => setView('main')} className="text-slate-400 hover:text-white text-sm mb-2 flex items-center gap-1 mx-auto">
            ← Back to Quiz Types
          </button>
          <h1 className="text-3xl font-bold text-white">Select Approach</h1>
          <p className="text-slate-400 text-sm mt-1">Choose a methodology to focus your practice</p>
        </div>

        <div className="flex-1 flex gap-4 items-stretch">
          {approaches.map((approach) => (
            <div
              key={approach.key}
              onClick={() => {
                setSelectedApproach(approach.key);
                setView('quiz');
              }}
              className={`
                flex-1 cursor-pointer rounded-2xl
                bg-slate-900/80 backdrop-blur-sm
                border-2 border-slate-800 hover:${approach.borderColor}
                transition-all duration-300 hover:scale-[1.02]
                flex flex-col p-6 relative overflow-hidden group
              `}
            >
              {/* Background glow */}
              <div className={`absolute inset-0 bg-gradient-to-br ${approach.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
              
              {/* Icon */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${approach.gradient} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                {approach.icon}
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl font-bold text-white mb-1">{approach.name}</h2>
              <p className="text-sm text-slate-400 mb-3">{approach.subtitle}</p>
              
              {/* Description */}
              <p className="text-xs text-slate-500 mb-4">{approach.description}</p>

              {/* Key concepts */}
              <div className="flex-1">
                <div className="text-xs text-slate-400 mb-2 font-medium">Key Concepts:</div>
                <div className="flex flex-wrap gap-1">
                  {approach.concepts.map((concept, i) => (
                    <span key={i} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Exam tip */}
              <div className="mt-4 p-2 bg-slate-800/50 rounded-lg">
                <span className="text-xs text-amber-400">💡 {approach.examTip}</span>
              </div>

              {/* Button */}
              <button className={`mt-4 w-full py-3 rounded-xl bg-gradient-to-r ${approach.gradient} font-semibold transition-all hover:shadow-lg`}>
                Start {approach.name} Quiz →
              </button>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Task Area Selection View - Creative Visual Selector
  const TaskSelectView = () => {
    return (
      <>
        <div className="text-center mb-4">
          <button onClick={() => setView('main')} className="text-slate-400 hover:text-white text-sm mb-2 flex items-center gap-1 mx-auto">
            ← Back to Quiz Types
          </button>
          <h1 className="text-2xl font-bold text-white">Select Task Area</h1>
          
          {/* Search bar */}
          <div className="mt-3 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search 35 task areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-500">🔍</span>
          </div>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Domain tabs on left */}
          <div className="w-48 flex flex-col gap-2">
            {Object.entries(taskData).map(([key, domain]) => (
              <button
                key={key}
                onClick={() => setExpandedDomain(key)}
                className={`
                  p-3 rounded-xl text-left transition-all duration-300
                  ${expandedDomain === key 
                    ? `bg-gradient-to-r ${domain.gradient} text-white` 
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}
                `}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{domain.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{domain.name}</div>
                    <div className="text-xs opacity-70">{domain.tasks.length} tasks</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Task grid on right */}
          <div className="flex-1 bg-slate-900/50 rounded-2xl p-4 overflow-y-auto">
            <div className="grid grid-cols-3 gap-2">
              {filterTasks(taskData[expandedDomain].tasks).map((task) => (
                <button
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setView('quiz');
                  }}
                  className={`
                    p-3 rounded-xl text-left transition-all duration-200
                    bg-slate-800/50 hover:bg-slate-700 border border-slate-700
                    hover:border-${taskData[expandedDomain].color}-500 hover:scale-[1.02]
                    group
                  `}
                >
                  <div className="text-lg mb-1">#{task.id}</div>
                  <div className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {task.name}
                  </div>
                </button>
              ))}
            </div>
            
            {filterTasks(taskData[expandedDomain].tasks).length === 0 && (
              <div className="text-center text-slate-500 py-8">
                No tasks found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Quiz Results View
  const ResultsView = () => {
    const percentage = Math.round((sampleResults.correct / sampleResults.total) * 100);
    const isPassing = percentage >= 70;
    
    // Group incorrect answers by domain
    const incorrectByDomain = sampleResults.questions
      .filter(q => !q.correct)
      .reduce((acc, q) => {
        if (!acc[q.domain]) acc[q.domain] = [];
        acc[q.domain].push(q);
        return acc;
      }, {});

    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with score */}
        <div className="text-center mb-4">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${isPassing ? 'from-emerald-500 to-teal-600' : 'from-orange-500 to-red-500'} mb-3`}>
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isPassing ? '🎉 Great Job!' : '📚 Keep Studying!'}
          </h1>
          <p className="text-slate-400 text-sm">
            {sampleResults.correct} of {sampleResults.total} correct • {sampleResults.timeSpent} elapsed
          </p>
        </div>

        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Left: Question breakdown */}
          <div className="w-1/2 bg-slate-900/50 rounded-2xl p-4 overflow-y-auto">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>📊</span> Question Breakdown
            </h3>
            <div className="space-y-2">
              {sampleResults.questions.map((q, i) => (
                <div 
                  key={i}
                  className={`flex items-center gap-3 p-2 rounded-lg ${q.correct ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${q.correct ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    {q.correct ? '✓' : '✗'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{q.task}</div>
                    <div className="text-xs text-slate-500 capitalize">{q.domain}</div>
                  </div>
                  {!q.correct && (
                    <span className="text-xs text-red-400 truncate max-w-24">{q.weakness}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Areas to study */}
          <div className="w-1/2 bg-slate-900/50 rounded-2xl p-4 overflow-y-auto">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <span>🎯</span> Areas to Study
            </h3>
            
            {Object.keys(incorrectByDomain).length === 0 ? (
              <div className="text-center py-8">
                <span className="text-4xl mb-2 block">🏆</span>
                <p className="text-emerald-400 font-medium">Perfect Score!</p>
                <p className="text-slate-500 text-sm">No areas need review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(incorrectByDomain).map(([domain, questions]) => (
                  <div key={domain} className="bg-slate-800/50 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{taskData[domain].icon}</span>
                      <span className="font-medium text-white">{taskData[domain].name}</span>
                      <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                        {questions.length} missed
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      {questions.map((q, i) => (
                        <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-2">
                          <div>
                            <div className="text-sm text-white">{q.task}</div>
                            <div className="text-xs text-orange-400">Review: {q.weakness}</div>
                          </div>
                          <button className={`px-3 py-1 rounded-lg bg-gradient-to-r ${taskData[domain].gradient} text-xs font-medium hover:scale-105 transition-transform`}>
                            Study →
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-4 pt-4 border-t border-slate-700 space-y-2">
              <button 
                onClick={() => setView('quiz')}
                className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold hover:scale-[1.02] transition-transform"
              >
                🔄 Retry Quiz
              </button>
              <button 
                onClick={() => setView('main')}
                className="w-full py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                ← Back to Quiz Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Simple Quiz placeholder (just shows a "Finish" button for demo)
  const QuizView = () => (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-white mb-2">Quiz in Progress...</h2>
        <p className="text-slate-400 mb-6">
          {selectedDomain && `Domain: ${taskData[selectedDomain].name}`}
          {selectedTask && `Task: ${selectedTask.name}`}
          {selectedApproach && `Approach: ${approachData[selectedApproach].name}`}
          {!selectedDomain && !selectedTask && !selectedApproach && 'Random 15 Questions'}
        </p>
        <button 
          onClick={() => setView('results')}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold hover:scale-105 transition-transform"
        >
          Finish Quiz (Demo) →
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-slate-950 text-white p-6 flex flex-col overflow-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex flex-col h-full max-w-5xl mx-auto w-full">
        {view === 'main' && <MainView />}
        {view === 'domain-select' && <DomainSelectView />}
        {view === 'task-select' && <TaskSelectView />}
        {view === 'approach-select' && <ApproachSelectView />}
        {view === 'quiz' && <QuizView />}
        {view === 'results' && <ResultsView />}

        {/* Footer Nav */}
        <div className="flex justify-center gap-8 pt-4 mt-4 border-t border-slate-800">
          {['LEARN', 'PRACTICE', 'QUIZZES', 'TASK AREAS', 'MY PROGRESS', 'HOME'].map((item) => (
            <button 
              key={item} 
              className={`text-xs font-medium transition-colors ${item === 'QUIZZES' ? 'text-cyan-400' : 'text-slate-500 hover:text-white'}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
