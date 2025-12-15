const { useState, useEffect } = React;

// SVG Icon Components - all the icons used in the app
// (Icon definitions will go here)

const CheckCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

const XCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="m15 9-6 6"/><path d="m9 9 6 6"/>
  </svg>
);

const Clock = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
  </svg>
);

const BookOpen = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const BarChart3 = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>
  </svg>
);

const RefreshCw = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
    <path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
    <path d="M8 16H3v5"/>
  </svg>
);

const Award = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);

const TrendingUp = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);

const Book = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
  </svg>
);

const Lightbulb = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
    <path d="M9 18h6"/><path d="M10 22h4"/>
  </svg>
);

const AlertCircle = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" x2="12" y1="8" y2="12"/>
    <line x1="12" x2="12.01" y1="16" y2="16"/>
  </svg>
);

const Target = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const Zap = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const Users = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Settings = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0 .73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

const Briefcase = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
  </svg>
);

const ArrowRight = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const ArrowLeft = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
  </svg>
);

const Repeat = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>
  </svg>
);
const Play = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

const Brain = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
    <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
    <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/>
    <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/>
    <path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.967-.516"/>
    <path d="M19.967 17.484A4 4 0 0 1 18 18"/>
  </svg>
);

const Trophy = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

const Timer = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="10" x2="14" y1="2" y2="2"/>
    <line x1="12" x2="15" y1="14" y2="11"/>
    <circle cx="12" cy="14" r="8"/>
  </svg>
);

const Flame = ({ className }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);


const ModernPMPPrep = () => {
  const [currentMode, setCurrentMode] = useState('menu');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedApproach, setSelectedApproach] = useState('all');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [questionsPool, setQuestionsPool] = useState([]);
  const [studyGuideSection, setStudyGuideSection] = useState('overview');
  const [selectedTask, setSelectedTask] = useState(null);
  const [progress, setProgress] = useState({
    questionsAttempted: 0,
    questionsCorrect: 0,
    byDomain: {
      people: { attempted: 0, correct: 0 },
      process: { attempted: 0, correct: 0 },
      business: { attempted: 0, correct: 0 }
    },
    byApproach: {
      predictive: { attempted: 0, correct: 0 },
      agile: { attempted: 0, correct: 0 },
      hybrid: { attempted: 0, correct: 0 }
    },
    quizHistory: [],
    studyTime: 0,
    lastActivity: null,
    streak: 0,
    badges: []
  });

  // Load progress from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pmp-prep-progress');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading progress:', e);
      }
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('pmp-prep-progress', JSON.stringify(progress));
  }, [progress]);

  // Update progress after completing a quiz
  const updateProgress = (quizResults) => {
    const newProgress = { ...progress };
    
    quizResults.forEach(result => {
      const question = questionsPool.find(q => q.id === result.questionId);
      if (!question) return;

      // Update overall stats
      newProgress.questionsAttempted++;
      if (result.correct) newProgress.questionsCorrect++;

      // Update by domain
      newProgress.byDomain[question.domain].attempted++;
      if (result.correct) newProgress.byDomain[question.domain].correct++;

      // Update by approach
      newProgress.byApproach[question.approach].attempted++;
      if (result.correct) newProgress.byApproach[question.approach].correct++;
    });

    // Add to quiz history
    const quizRecord = {
      date: new Date().toISOString(),
      score: quizResults.filter(r => r.correct).length,
      total: quizResults.length,
      percentage: Math.round((quizResults.filter(r => r.correct).length / quizResults.length) * 100),
      domain: selectedDomain,
      approach: selectedApproach,
      timed: timeRemaining !== null
    };
    newProgress.quizHistory.unshift(quizRecord);
    newProgress.quizHistory = newProgress.quizHistory.slice(0, 50); // Keep last 50

    // Update streak
    const today = new Date().toDateString();
    const lastActivity = newProgress.lastActivity ? new Date(newProgress.lastActivity).toDateString() : null;
    if (lastActivity === today) {
      // Same day, maintain streak
    } else if (lastActivity === new Date(Date.now() - 86400000).toDateString()) {
      // Yesterday, increment streak
      newProgress.streak++;
    } else {
      // Streak broken, reset
      newProgress.streak = 1;
    }
    newProgress.lastActivity = new Date().toISOString();

    // Award badges
    checkAndAwardBadges(newProgress);

    setProgress(newProgress);
  };

  const checkAndAwardBadges = (prog) => {
    const badges = [...prog.badges];
    
    // First quiz badge
    if (prog.questionsAttempted >= 10 && !badges.includes('first_quiz')) {
      badges.push('first_quiz');
    }
    
    // Domain master badges
    Object.keys(prog.byDomain).forEach(domain => {
      const domainData = prog.byDomain[domain];
      if (domainData.attempted >= 30 && !badges.includes(`${domain}_master`)) {
        badges.push(`${domain}_master`);
      }
    });

    // Accuracy badges
    const accuracy = prog.questionsAttempted > 0 ? prog.questionsCorrect / prog.questionsAttempted : 0;
    if (prog.questionsAttempted >= 50 && accuracy >= 0.8 && !badges.includes('accuracy_pro')) {
      badges.push('accuracy_pro');
    }

    // Streak badges
    if (prog.streak >= 7 && !badges.includes('week_streak')) {
      badges.push('week_streak');
    }
    if (prog.streak >= 30 && !badges.includes('month_streak')) {
      badges.push('month_streak');
    }

    // Century badge
    if (prog.questionsAttempted >= 100 && !badges.includes('century')) {
      badges.push('century');
    }

    prog.badges = badges;
  };

  const getBadgeInfo = (badge) => {
    const badgeData = {
      first_quiz: { name: 'Getting Started', icon: '🎯', desc: 'Completed 10 questions' },
      people_master: { name: 'People Expert', icon: '👥', desc: 'Attempted 30+ People domain questions' },
      process_master: { name: 'Process Pro', icon: '⚙️', desc: 'Attempted 30+ Process domain questions' },
      business_master: { name: 'Business Ace', icon: '💼', desc: 'Attempted 30+ Business questions' },
      accuracy_pro: { name: 'Accuracy Pro', icon: '🎯', desc: '80%+ accuracy on 50+ questions' },
      week_streak: { name: 'Week Warrior', icon: '🔥', desc: '7-day practice streak' },
      month_streak: { name: 'Monthly Master', icon: '⭐', desc: '30-day practice streak' },
      century: { name: 'Centurion', icon: '💯', desc: 'Attempted 100+ questions' }
    };
    return badgeData[badge] || { name: badge, icon: '🏆', desc: 'Achievement unlocked' };
  };

  // Domains with modern color palette
  const domains = [
    { id: 'people', name: 'People', color: '#6366f1', gradient: 'from-indigo-500 to-indigo-600', weight: 42, tasks: 14 },
    { id: 'process', name: 'Process', color: '#10b981', gradient: 'from-emerald-500 to-emerald-600', weight: 50, tasks: 17 },
    { id: 'business', name: 'Business Environment', color: '#f59e0b', gradient: 'from-amber-500 to-amber-600', weight: 8, tasks: 4 }
  ];

  const approaches = [
    { id: 'predictive', name: 'Predictive', color: '#8b5cf6', icon: '📋' },
    { id: 'agile', name: 'Agile', color: '#ec4899', icon: '⚡' },
    { id: 'hybrid', name: 'Hybrid', color: '#14b8a6', icon: '🔄' }
  ];

  // Comprehensive Task Database
  // COMPLETE 35 ECO TASKS DATABASE
  const taskDatabase = {
    people: [
      // PEOPLE DOMAIN - 14 Tasks (42% of exam)
      {
        id: 'P1',
        number: 'Task 1',
        title: 'Manage Conflict',
        enablers: [
          'Interpret the source and stage of the conflict',
          'Analyze the context for the conflict',
          'Evaluate/recommend/reconcile appropriate conflict resolution solution'
        ],
        keyPoints: [
          'Five conflict resolution techniques: Collaborate/Problem-Solve, Compromise, Force/Direct, Smooth/Accommodate, Withdraw/Avoid',
          'Collaborate is preferred when time permits and relationships matter',
          'Force/Direct for emergencies or when quick decision needed',
          'Smooth/Accommodate when relationship is more important than issue',
          'Withdraw/Avoid for cooling-off period or when issue is trivial'
        ],
        deepDive: `Conflict Resolution Ladder: Start with Collaborate (win-win), move to Compromise (give and take), use Force only when necessary. Context matters: time available, relationship importance, issue significance.`,
        scenarios: [
          {
            title: 'Technical Disagreement',
            situation: 'Two senior developers disagree about architecture choice. Team morale is affected.',
            options: [
              'Choose the approach yourself',
              'Facilitate collaborative discussion on requirements and trade-offs',
              'Let them vote',
              'Escalate to architect'
            ],
            correctAnswer: 1,
            explanation: 'Collaborate when both parties have expertise and relationships matter. Facilitating helps find best technical solution while preserving team dynamics.'
          }
        ],
        commonMistakes: ['Always using Force/Direct', 'Avoiding all conflict', 'Escalating too quickly'],
        examTips: ['If "FIRST" appears, try Collaborate before escalating', 'Consider time and relationship factors']
      },
      {
        id: 'P2',
        number: 'Task 2',
        title: 'Lead a Team',
        enablers: [
          'Set a clear vision and mission',
          'Support diversity and inclusion',
          'Value servant leadership',
          'Determine appropriate leadership style',
          'Inspire, motivate, and influence team members'
        ],
        keyPoints: [
          'Servant leadership: Leader serves the team',
          'Situational leadership: Adjust style to team maturity',
          'Transformational leadership: Inspire and develop people',
          'Emotional intelligence: Self-awareness and empathy',
          'Lead by example: Model desired behaviors'
        ],
        deepDive: `Servant Leadership Focus: Remove impediments, provide resources, shield from distractions, develop capabilities, facilitate decisions. Ask "How can I help my team succeed?"`,
        scenarios: [
          {
            title: 'Disengaged Team Member',
            situation: 'High performer becomes withdrawn, missing deadlines, appears stressed.',
            options: [
              'Document issues and start corrective action',
              'Have private empathetic conversation to understand',
              'Ignore and hope it resolves',
              'Reassign work to avoid delays'
            ],
            correctAnswer: 1,
            explanation: 'Servant leadership means showing empathy first. Private conversation may reveal addressable issues affecting performance.'
          }
        ],
        commonMistakes: ['Micromanaging', 'One-size-fits-all leadership', 'Task-focus over people-focus'],
        examTips: ['Servant leadership is default PMI approach', 'When in doubt, choose empathetic option']
      },
      {
        id: 'P3',
        number: 'Task 3',
        title: 'Support Team Performance',
        enablers: [
          'Appraise team member performance',
          'Support and recognize team member growth and development',
          'Determine appropriate feedback approach',
          'Verify team member performance'
        ],
        keyPoints: [
          'Regular feedback: Both positive and constructive',
          'Performance appraisals: Fair, objective, documented',
          'Recognition: Public praise for achievements',
          'Development: Provide training and growth opportunities',
          'Address issues early: Don\'t wait for formal reviews'
        ],
        deepDive: `Feedback Best Practices: Timely (close to event), specific (concrete examples), balanced (positive and constructive), actionable (clear next steps), private for corrections.`,
        commonMistakes: ['Only giving negative feedback', 'Waiting too long to address issues', 'Public criticism'],
        examTips: ['Praise publicly, criticize privately', 'Focus on behavior not personality', 'Regular informal feedback > annual reviews']
      },
      {
        id: 'P4',
        number: 'Task 4',
        title: 'Empower Team Members and Stakeholders',
        enablers: [
          'Organize around team strengths',
          'Support team task accountability and decision-making',
          'Evaluate demonstration of task accountability'
        ],
        keyPoints: [
          'Self-organizing teams: Let team decide HOW to do work',
          'Authority vs. Accountability: Match them appropriately',
          'Delegation: Transfer authority with responsibility',
          'Trust: Believe in team capabilities',
          'Safety net: Support available when needed'
        ],
        deepDive: `Empowerment Triangle: Give Authority (right to decide), Accountability (ownership of outcome), Autonomy (freedom to choose approach). All three required for true empowerment.`,
        commonMistakes: ['Accountability without authority', 'Micromanaging after delegating', 'Not providing needed support'],
        examTips: ['Agile teams are self-organizing', 'PM facilitates, team decides execution', 'Remove impediments, don\'t solve problems for team']
      },
      {
        id: 'P5',
        number: 'Task 5',
        title: 'Ensure Team Members/Stakeholders are Adequately Trained',
        enablers: [
          'Determine required competencies and elements of training',
          'Determine training options based on needs',
          'Allocate resources for training',
          'Measure training outcomes'
        ],
        keyPoints: [
          'Training needs assessment: Gap between current and required skills',
          'Just-in-time training: When skills are needed',
          'Various formats: Formal courses, mentoring, self-study, on-the-job',
          'Budget consideration: Balance cost and benefit',
          'Effectiveness measurement: Did skills improve? Applied on job?'
        ],
        deepDive: `Training ROI: Improved performance, reduced errors, faster completion, better quality. Investment in people = investment in project success.`,
        commonMistakes: ['Assuming team has all needed skills', 'Training too early (knowledge decay)', 'No follow-up on application'],
        examTips: ['Training is project cost, budget for it', 'Verify training effectiveness', 'Different people learn differently']
      },
      {
        id: 'P6',
        number: 'Task 6',
        title: 'Build a Team',
        enablers: [
          'Appraise stakeholder skills',
          'Deduce project resource requirements',
          'Continuously assess and refresh team skills',
          'Maintain team and knowledge'
        ],
        keyPoints: [
          'Tuckman Model: Forming, Storming, Norming, Performing, Adjourning',
          'Team building activities: Build trust and collaboration',
          'Co-location when possible: Enhance communication',
          'Ground rules: Establish behavioral expectations',
          'Virtual teams: Extra effort for cohesion'
        ],
        deepDive: `Storming is NORMAL: Conflict during Storming phase is expected as team establishes norms. PM facilitates through to Norming and Performing. Rushing through Storming leads to dysfunctional team.`,
        commonMistakes: ['Avoiding Storming phase', 'One-time team building only', 'Ignoring virtual team challenges'],
        examTips: ['All teams go through Tuckman stages', 'Can cycle back to Storming with changes', 'Co-location preferred but not always possible']
      },
      {
        id: 'P7',
        number: 'Task 7',
        title: 'Address and Remove Impediments, Obstacles, and Blockers',
        enablers: [
          'Determine critical impediments, obstacles, and blockers',
          'Prioritize critical impediments using network diagram',
          'Use network to implement solution',
          'Re-assess continually'
        ],
        keyPoints: [
          'Impediment: Anything slowing team progress',
          'PM responsibility: Remove or escalate impediments',
          'Agile focus: Daily standup surfaces blockers',
          'Types: Resource constraints, dependencies, approvals, technical issues',
          'Escalate: When impediment beyond PM authority'
        ],
        deepDive: `Impediment Removal Process: (1) Identify in standup/retrospective, (2) Categorize by type and urgency, (3) Remove if in PM control, (4) Escalate if external, (5) Track until resolved, (6) Prevent recurrence.`,
        commonMistakes: ['Ignoring impediments hoping they resolve', 'Not escalating when needed', 'Blaming team for external blocks'],
        examTips: ['Servant leader removes impediments', 'Don\'t wait - address immediately', 'Track and follow through']
      },
      {
        id: 'P8',
        number: 'Task 8',
        title: 'Negotiate Project Agreements',
        enablers: [
          'Analyze bounds of negotiations',
          'Assess priorities and determine ultimate objective(s)',
          'Verify objectives of project agreement are met',
          'Participate in agreement negotiations',
          'Determine strategy for negotiations'
        ],
        keyPoints: [
          'BATNA: Best Alternative To Negotiated Agreement (your walk-away point)',
          'Win-Win preferred: Both parties satisfied',
          'ZOPA: Zone of Possible Agreement (overlap between parties)',
          'Preparation: Know your priorities and limits',
          'Active listening: Understand other party needs'
        ],
        deepDive: `Principled Negotiation (Fisher & Ury): (1) Separate people from problem, (2) Focus on interests not positions, (3) Generate options for mutual gain, (4) Use objective criteria. Collaborative not adversarial.`,
        commonMistakes: ['Positional bargaining', 'Not knowing BATNA', 'Win-lose mindset', 'Emotional reactions'],
        examTips: ['Know your BATNA before negotiating', 'Focus on interests behind positions', 'Create value before claiming value']
      },
      {
        id: 'P9',
        number: 'Task 9',
        title: 'Collaborate with Stakeholders',
        enablers: [
          'Evaluate engagement needs',
          'Optimize alignment between stakeholder needs/expectations and project',
          'Build trust and influence stakeholders',
          'Employ collaboration tools'
        ],
        keyPoints: [
          'Stakeholder engagement: Continuous not one-time',
          'Power/Interest Grid: Manage, Keep Satisfied, Keep Informed, Monitor',
          'Communication preferences: Adapt to stakeholder style',
          'Influence without authority: Build relationships',
          'Collaborative tools: Wikis, shared documents, virtual meetings'
        ],
        deepDive: `Engagement Strategies by Stakeholder Type: High Power/High Interest = Manage Closely (key decisions), High Power/Low Interest = Keep Satisfied (major milestones), Low Power/High Interest = Keep Informed (detailed updates), Low Power/Low Interest = Monitor (minimal effort).`,
        commonMistakes: ['Treating all stakeholders equally', 'Infrequent engagement', 'One-way communication'],
        examTips: ['Stakeholder engagement is continuous', 'Different strategies for different stakeholders', 'Build relationships early']
      },
      {
        id: 'P10',
        number: 'Task 10',
        title: 'Build Shared Understanding',
        enablers: [
          'Break down situation to identify misunderstandings',
          'Support outcome alignment',
          'Collaborate with stakeholders',
          'Employ collaboration and team-building tools'
        ],
        keyPoints: [
          'Common vision: Everyone understands project goals',
          'Definition of Done: Clear acceptance criteria',
          'Ubiquitous language: Shared terminology',
          'Working agreements: Team norms and processes',
          'Visual management: Make information visible'
        ],
        deepDive: `Creating Shared Understanding: Use user stories (stakeholder language), acceptance criteria (specific outcomes), frequent demos (validate understanding), retrospectives (align on process), visual boards (transparency).`,
        commonMistakes: ['Assuming everyone has same understanding', 'Technical jargon with business stakeholders', 'Implicit assumptions'],
        examTips: ['Definition of Done prevents misunderstandings', 'Frequent validation of understanding', 'Visual tools aid shared understanding']
      },
      {
        id: 'P11',
        number: 'Task 11',
        title: 'Engage and Support Virtual Teams',
        enablers: [
          'Examine virtual team member needs',
          'Investigate alternatives for virtual team member engagement',
          'Implement options for virtual team member engagement',
          'Continually evaluate effectiveness of virtual team engagement'
        ],
        keyPoints: [
          'Challenges: Time zones, cultural differences, lack of informal interaction',
          'Communication: Over-communicate, use video when possible',
          'Technology: Collaboration platforms, video conferencing',
          'Social connection: Virtual coffee breaks, team building',
          'Documentation: Write things down more than co-located teams'
        ],
        deepDive: `Virtual Team Best Practices: (1) Establish core hours for overlap, (2) Rotate meeting times to share burden, (3) Use video to build connection, (4) Create virtual water cooler spaces, (5) Document decisions and discussions, (6) Visit in person periodically if possible.`,
        commonMistakes: ['No consideration for time zones', 'Email-only communication', 'No team bonding activities'],
        examTips: ['Virtual teams need MORE communication not less', 'Technology is enabler not solution', 'Build relationships deliberately']
      },
      {
        id: 'P12',
        number: 'Task 12',
        title: 'Define Team Ground Rules',
        enablers: [
          'Communicate organizational principles with team',
          'Establish environment that fosters adherence to ground rules',
          'Manage and rectify ground rule violations'
        ],
        keyPoints: [
          'Team creates rules: Not imposed by PM',
          'Areas covered: Communication, decision-making, conflict, meetings',
          'Examples: No phones in meetings, all opinions valued, start on time',
          'Living document: Update as team evolves',
          'Enforcement: Team holds each other accountable'
        ],
        deepDive: `Ground Rules Process: (1) Team brainstorms norms, (2) Discuss and agree on each, (3) Document visibly, (4) Revisit in retrospectives, (5) Update as needed. Self-organizing teams create own rules.`,
        commonMistakes: ['PM dictates rules', 'Too many rules', 'Never updating rules', 'Not enforcing violations'],
        examTips: ['Team creates own ground rules', 'Visible and living document', 'Accountability to team not PM']
      },
      {
        id: 'P13',
        number: 'Task 13',
        title: 'Mentor Relevant Stakeholders',
        enablers: [
          'Allocate time for mentoring',
          'Recognize and act on mentoring opportunities'
        ],
        keyPoints: [
          'Mentoring vs Coaching: Mentor shares experience, Coach asks questions',
          'Benefits: Develops people, builds relationships, transfers knowledge',
          'Time investment: Regular mentoring sessions',
          'Two-way: Mentor also learns from mentee',
          'Formal or informal: Both have value'
        ],
        deepDive: `Effective Mentoring: (1) Build trust through confidentiality, (2) Listen more than talk, (3) Share stories and experiences, (4) Ask questions to promote thinking, (5) Provide honest feedback, (6) Celebrate mentee successes.`,
        commonMistakes: ['No time allocated', 'Telling instead of guiding', 'One-way relationship'],
        examTips: ['Mentoring develops people and relationships', 'Both formal and informal valuable', 'Investment in organizational capability']
      },
      {
        id: 'P14',
        number: 'Task 14',
        title: 'Promote Team Performance Through Application of Emotional Intelligence',
        enablers: [
          'Assess behavior through use of personality indicators',
          'Analyze personality indicators',
          'Apply frameworks to enhance emotional intelligence'
        ],
        keyPoints: [
          'Four quadrants: Self-awareness, Self-management, Social awareness, Relationship management',
          'Self-awareness: Know your emotions and triggers',
          'Self-management: Control your reactions',
          'Social awareness: Recognize others\' emotions (empathy)',
          'Relationship management: Navigate social situations effectively'
        ],
        deepDive: `EI in PM: (1) Recognize when team member is frustrated → Offer support, (2) Sense tension in meeting → Address directly, (3) Notice stakeholder disengagement → Re-engage proactively, (4) Feel own stress rising → Take break before reacting.`,
        commonMistakes: ['Ignoring emotional dynamics', 'Reacting instead of responding', 'Low empathy for team concerns'],
        examTips: ['EI more important than IQ for PM success', 'Self-awareness is foundation', 'Empathy critical for collaboration']
      }
    ],
    
    process: [
      // PROCESS DOMAIN - 17 Tasks (50% of exam)
      {
        id: 'PR1',
        number: 'Task 1',
        title: 'Execute Project with Urgency Required to Deliver Business Value',
        enablers: [
          'Assess opportunities to deliver value incrementally',
          'Examine business value throughout project',
          'Support team to subdivide project tasks'
        ],
        keyPoints: [
          'MVP: Minimum Viable Product delivers core value quickly',
          'Incremental delivery: Release value frequently not all at end',
          'Time-to-market: Speed matters for competitive advantage',
          'Value over features: Focus on outcomes not outputs',
          'Iterative approach: Learn and adapt based on feedback'
        ],
        deepDive: `Value-Driven Delivery: (1) Identify highest-value features first, (2) Release thin vertical slices (end-to-end functionality), (3) Get user feedback early, (4) Adapt based on learnings, (5) Deliver business value continuously not at project end.`,
        commonMistakes: ['Waiting until end to deliver value', 'Building everything before releasing anything', 'Feature-driven vs value-driven'],
        examTips: ['Deliver value early and often', 'MVP is not low quality, it\'s minimum scope', 'Business value > feature completeness']
      },
      {
        id: 'PR2',
        number: 'Task 2',
        title: 'Manage Communications',
        enablers: [
          'Analyze communication needs',
          'Determine communication methods/channels/frequency',
          'Communicate project information and updates effectively',
          'Confirm communication is understood and feedback is received'
        ],
        keyPoints: [
          'Communication models: Sender-Receiver, Push-Pull, Interactive',
          'Channels: Number = n(n-1)/2 where n is number of people',
          'Types: Formal/Informal, Written/Verbal, Internal/External',
          'Active listening: Understand before being understood',
          'Feedback loop: Verify message understood correctly'
        ],
        deepDive: `Communication Formula: 93% is non-verbal (55% body language + 38% tone, only 7% words). In-person and video far more effective than email for complex or sensitive topics.`,
        commonMistakes: ['Over-reliance on email', 'No feedback loop', 'One-size-fits-all communication'],
        examTips: ['Face-to-face most effective', 'Confirm understanding don\'t assume', 'Communication channels increase exponentially']
      },
      {
        id: 'PR3',
        number: 'Task 3',
        title: 'Assess and Manage Risks',
        enablers: [
          'Determine risk management options',
          'Iteratively assess and prioritize risks'
        ],
        keyPoints: [
          'Risk responses: Avoid, Mitigate, Transfer, Accept (negative), Exploit, Enhance, Share, Accept (positive)',
          'Risk register: Living document updated continuously',
          'Probability × Impact = Risk score for prioritization',
          'Risk owner: Someone responsible for monitoring and response',
          'Agile approach: Address risks in each iteration'
        ],
        deepDive: `Risk vs Issue: Risk is uncertain future event (might happen), Issue is current problem (already happened). Risk has probability, Issue has impact. Manage risks proactively, resolve issues reactively.`,
        commonMistakes: ['One-time risk identification', 'No risk owners assigned', 'Ignoring positive risks (opportunities)'],
        examTips: ['Risks are iteratively identified throughout project', 'Both threats and opportunities', 'High probability × High impact = highest priority']
      },
      {
        id: 'PR4',
        number: 'Task 4',
        title: 'Engage Stakeholders',
        enablers: [
          'Analyze stakeholders',
          'Categorize stakeholders',
          'Engage stakeholders by category',
          'Develop/execute/validate strategy for stakeholder engagement'
        ],
        keyPoints: [
          'Salience model: Power, Legitimacy, Urgency',
          'Engagement levels: Unaware, Resistant, Neutral, Supportive, Leading',
          'Move stakeholders: From current to desired engagement level',
          'Influence strategies: Pull (attract), Push (convince), Collaborate (involve)',
          'Monitor engagement: Adjust approach as needed'
        ],
        deepDive: `Stakeholder Analysis Matrix: (1) Identify all stakeholders, (2) Assess Power/Interest, (3) Determine current engagement level, (4) Define desired engagement level, (5) Plan engagement strategy, (6) Execute and monitor, (7) Adjust based on effectiveness.`,
        commonMistakes: ['Identifying stakeholders once at start', 'No strategy per stakeholder type', 'Reactive vs proactive engagement'],
        examTips: ['Stakeholder analysis is ongoing', 'Different strategies for different stakeholders', 'Move toward desired engagement levels']
      },
      {
        id: 'PR5',
        number: 'Task 5',
        title: 'Plan and Manage Budget and Resources',
        enablers: [
          'Estimate budgetary needs',
          'Anticipate future budget challenges',
          'Monitor budget variations and work with governance',
          'Plan and manage resources'
        ],
        keyPoints: [
          'EVM formulas: PV, EV, AC, SV, CV, SPI, CPI, EAC, ETC, VAC',
          'CPI = EV/AC (cost performance), SPI = EV/PV (schedule performance)',
          'EAC = BAC/CPI (estimate at completion)',
          'Resource leveling: Smooth resource usage (may extend schedule)',
          'Resource smoothing: Keep schedule, adjust non-critical resources'
        ],
        deepDive: `EVM Interpretation: CPI < 1 = over budget (bad), CPI > 1 = under budget (good), SPI < 1 = behind schedule (bad), SPI > 1 = ahead of schedule (good). To finish on budget when CPI = 0.9, you need to improve performance by 11% (1/0.9).`,
        commonMistakes: ['Confusing SPI and CPI', 'Thinking CPI of 0.9 is good (it\'s 10% over budget)', 'Not re-forecasting based on current performance'],
        examTips: ['MEMORIZE EVM formulas', 'CPI/SPI > 1 is good, < 1 is bad', 'EAC assumes current trends continue']
      },
      {
        id: 'PR6',
        number: 'Task 6',
        title: 'Plan and Manage Schedule',
        enablers: [
          'Estimate project tasks',
          'Utilize benchmarks and historical data',
          'Prepare schedule based on methodology',
          'Measure ongoing progress',
          'Modify schedule based on methodology'
        ],
        keyPoints: [
          'Critical Path: Longest path, zero float, determines project duration',
          'Float/Slack: Total float = LS - ES or LF - EF',
          'Fast tracking: Parallel activities (increases risk)',
          'Crashing: Add resources to critical path (increases cost)',
          'Three-point estimates: (O + 4M + P) / 6 for realistic duration'
        ],
        deepDive: `Critical Path Method: (1) List all activities, (2) Determine dependencies, (3) Estimate durations, (4) Draw network diagram, (5) Calculate forward pass (ES, EF), (6) Calculate backward pass (LS, LF), (7) Identify critical path (zero float).`,
        commonMistakes: ['Crashing non-critical activities', 'Not updating schedule regularly', 'Ignoring resource constraints'],
        examTips: ['Only crashing critical path shortens project', 'Fast tracking increases risk', 'Critical path can change']
      },
      {
        id: 'PR7',
        number: 'Task 7',
        title: 'Plan and Manage Quality',
        enablers: [
          'Determine quality standard required for deliverables',
          'Recommend options for improvement',
          'Continually survey project deliverable quality'
        ],
        keyPoints: [
          'Quality vs Grade: Quality = conformance to requirements, Grade = category',
          'Cost of Quality: Prevention + Appraisal vs Internal failure + External failure',
          'Quality management: Plan (standards), Assure (processes), Control (deliverables)',
          'Continuous improvement: Kaizen, PDCA (Plan-Do-Check-Act)',
          'Customer satisfaction: Meeting requirements + fitness for use'
        ],
        deepDive: `Cost of Quality: (1) Prevention costs (training, planning) are cheapest, (2) Appraisal costs (testing, inspection) are moderate, (3) Internal failure (rework) is expensive, (4) External failure (warranty, reputation) is most expensive. Invest in prevention!`,
        commonMistakes: ['Focusing on inspection vs prevention', 'Low quality acceptable to save cost', 'Quality = high grade'],
        examTips: ['Prevention over inspection', 'Quality is meeting requirements not gold-plating', 'Customer satisfaction is ultimate measure']
      },
      {
        id: 'PR8',
        number: 'Task 8',
        title: 'Plan and Manage Scope',
        enablers: [
          'Determine and prioritize requirements',
          'Break down scope',
          'Monitor and validate scope'
        ],
        keyPoints: [
          'Requirements gathering: Interviews, surveys, observation, prototypes',
          'WBS: Work Breakdown Structure decomposes scope into manageable pieces',
          '100% rule: WBS includes ALL work, nothing more',
          'Scope baseline: Approved WBS + WBS dictionary + Scope statement',
          'Scope creep: Uncontrolled changes to scope'
        ],
        deepDive: `WBS Decomposition: (1) Start with project deliverable, (2) Decompose to major deliverables, (3) Break down to work packages, (4) Work package should be 8-80 hours, (5) Bottom level is 100% of work needed. Use deliverable-oriented structure.`,
        commonMistakes: ['WBS organized by phases not deliverables', 'Too little or too much decomposition', 'Allowing scope creep'],
        examTips: ['WBS is deliverable-oriented', '100% rule applies', 'Control scope changes through change control']
      },
      {
        id: 'PR9',
        number: 'Task 9',
        title: 'Integrate Project Planning Activities',
        enablers: [
          'Consolidate project/phase plans',
          'Assess consolidated project plans for dependencies/gaps/continued business value',
          'Analyze data collected',
          'Collect and analyze data to make informed decisions',
          'Determine critical information requirements'
        ],
        keyPoints: [
          'Project Management Plan: Integration of all subsidiary plans',
          'Baselines: Scope, Schedule, Cost (performance measurement baseline)',
          'Dependencies: Between tasks, phases, projects',
          'Assumptions and constraints: Document and validate',
          'Integrated change control: All changes go through one process'
        ],
        deepDive: `Integration Management: PM is integrator who ensures all pieces work together. Example: Schedule change may affect cost and resource plans. Quality requirements may affect schedule and budget. Risk response may require scope or schedule changes.`,
        commonMistakes: ['Managing plans in silos', 'Not integrating subsidiary plans', 'Ignoring interdependencies'],
        examTips: ['PM is integrator', 'All plans must work together', 'Changes ripple across multiple plans']
      },
      {
        id: 'PR10',
        number: 'Task 10',
        title: 'Manage Project Changes',
        enablers: [
          'Anticipate and embrace need for change',
          'Determine strategy to handle change',
          'Execute change management strategy',
          'Determine change response to move project forward'
        ],
        keyPoints: [
          'Change is inevitable: Especially in agile environments',
          'Change control board (CCB): Reviews and approves changes',
          'Impact analysis: How change affects scope, schedule, cost, quality, risk',
          'Configuration management: Track product versions and baselines',
          'Agile embraces change: Change is expected and welcome'
        ],
        deepDive: `Change Management Process: (1) Submit change request, (2) Analyze impact on baselines, (3) Present to CCB with recommendation, (4) CCB approves/rejects, (5) If approved: update plans, communicate, implement, (6) Verify change implemented correctly.`,
        commonMistakes: ['Informal change process', 'PM approves all changes alone', 'Not analyzing full impact'],
        examTips: ['All changes go through integrated change control', 'Analyze impact before approving', 'Agile welcomes change, predictive controls it']
      },
      {
        id: 'PR11',
        number: 'Task 11',
        title: 'Plan and Manage Procurement',
        enablers: [
          'Define resource requirements and needs',
          'Communicate resource requirements',
          'Manage suppliers/contracts',
          'Plan and manage procurement strategy',
          'Develop delivery solution'
        ],
        keyPoints: [
          'Make or buy analysis: Build internally vs purchase externally',
          'Contract types: Fixed Price (FP), Cost Reimbursable (CR), Time & Materials (T&M)',
          'Risk transfer: FP = seller bears risk, CR = buyer bears risk, T&M = shared',
          'Procurement documents: RFP (Request for Proposal), RFQ (Request for Quote), RFI (Request for Information)',
          'Contract closure: Formal acceptance and administrative closure'
        ],
        deepDive: `Contract Type Selection: Use FP when scope is clear and you want cost certainty (seller risk). Use CR when scope uncertain or R&D work (buyer risk). Use T&M when staff augmentation or scope evolving. Each has place depending on situation and risk tolerance.`,
        commonMistakes: ['Wrong contract type for situation', 'Informal contract changes', 'Poor vendor selection'],
        examTips: ['FP shifts risk to seller', 'CR shifts risk to buyer', 'All contract changes must be formal']
      },
      {
        id: 'PR12',
        number: 'Task 12',
        title: 'Manage Project Artifacts',
        enablers: [
          'Determine requirements for managing project artifacts',
          'Validate project information is kept up to date',
          'Make relevant information available to stakeholders'
        ],
        keyPoints: [
          'Artifacts: Any project document or deliverable',
          'Version control: Track changes to documents',
          'Configuration management: Baseline versions',
          'Information radiators: Visible project information (agile)',
          'Document repository: Central storage location'
        ],
        deepDive: `Artifact Management: (1) Identify which artifacts to maintain, (2) Establish naming conventions, (3) Implement version control, (4) Define access permissions, (5) Regular updates, (6) Archive historical versions, (7) Make easily searchable.`,
        commonMistakes: ['No version control', 'Outdated artifacts', 'Information silos'],
        examTips: ['Keep artifacts current and accessible', 'Use configuration management', 'Information radiators in agile']
      },
      {
        id: 'PR13',
        number: 'Task 13',
        title: 'Determine Appropriate Project Methodology/Methods and Practices',
        enablers: [
          'Assess project needs/complexity/magnitude',
          'Recommend project execution strategy',
          'Recommend project methodology/approach',
          'Use iterative/incremental practices throughout project life cycle'
        ],
        keyPoints: [
          'Predictive: Plan-driven, sequential, requirements known upfront',
          'Agile: Change-driven, iterative, requirements emerge',
          'Hybrid: Combination of predictive and agile',
          'Selection factors: Requirements clarity, risk, change frequency, team experience',
          'Tailor: Adapt methodology to project needs'
        ],
        deepDive: `Methodology Selection: High requirements uncertainty + Frequent changes + Fast feedback needed = Agile. Clear requirements + Low change + Regulatory compliance = Predictive. Mix of both = Hybrid. No one-size-fits-all; tailor to context.`,
        commonMistakes: ['Forcing one methodology on all projects', 'Not tailoring to project needs', 'Methodology for methodology\'s sake'],
        examTips: ['Tailor approach to project', 'Consider multiple factors', 'Hybrid is valid choice']
      },
      {
        id: 'PR14',
        number: 'Task 14',
        title: 'Establish Project Governance Structure',
        enablers: [
          'Determine appropriate governance for project',
          'Define escalation paths and thresholds'
        ],
        keyPoints: [
          'Governance: Framework for decision-making and accountability',
          'Roles: Sponsor, Steering committee, PM, Team',
          'Decision rights: Who can approve what',
          'Escalation: When and how to escalate issues',
          'Gates: Stage gates or phase gates for go/no-go decisions'
        ],
        deepDive: `Governance Framework: (1) Define decision-making authority levels, (2) Establish steering committee for major decisions, (3) Set escalation thresholds (time, cost, scope variances), (4) Define phase gate criteria, (5) Regular governance meetings (frequency and attendees).`,
        commonMistakes: ['No clear decision authority', 'Bypassing governance', 'Too heavy or too light governance'],
        examTips: ['Governance ensures proper oversight', 'Escalate per defined thresholds', 'Sponsor has ultimate authority']
      },
      {
        id: 'PR15',
        number: 'Task 15',
        title: 'Manage Project Issues',
        enablers: [
          'Recognize when issue occurs',
          'Attack issue with optimal action',
          'Collaborate with relevant stakeholders',
          'Determine solution to remove obstacle'
        ],
        keyPoints: [
          'Issue: Current problem affecting project (vs risk = future uncertainty)',
          'Issue log: Track all issues with status, owner, target date',
          'Root cause analysis: 5 Whys, Fishbone diagram, Pareto analysis',
          'Escalate: When issue beyond PM authority or threshold exceeded',
          'Close loop: Verify issue resolved, document lessons learned'
        ],
        deepDive: `Issue Resolution Process: (1) Identify and log issue, (2) Assign owner, (3) Analyze root cause, (4) Develop solution options, (5) Select and implement solution, (6) Verify resolved, (7) Close issue, (8) Document lesson learned for future.`,
        commonMistakes: ['Confusing issues with risks', 'No ownership assigned', 'Treating symptoms not root cause'],
        examTips: ['Issue = current problem, Risk = future uncertainty', 'Root cause analysis prevents recurrence', 'Every issue needs owner']
      },
      {
        id: 'PR16',
        number: 'Task 16',
        title: 'Ensure Knowledge Transfer for Project Continuity',
        enablers: [
          'Discuss project responsibilities within team',
          'Outline expectations for working environment',
          'Confirm approach for knowledge transfers'
        ],
        keyPoints: [
          'Knowledge transfer: Documentation, cross-training, shadowing, mentoring',
          'Tacit knowledge: Hard to document, requires interaction',
          'Explicit knowledge: Easily documented and transferred',
          'Continuity: Ensure project can continue if team members leave',
          'Lessons learned: Capture and share knowledge for future projects'
        ],
        deepDive: `Knowledge Management: (1) Identify critical knowledge holders, (2) Document processes and decisions, (3) Cross-train team members, (4) Pair programming or shadowing, (5) Regular knowledge sharing sessions, (6) Maintain updated documentation, (7) Exit interviews when people leave.`,
        commonMistakes: ['Single point of failure (one person knows critical info)', 'Poor documentation', 'No knowledge transfer plan'],
        examTips: ['Prevent knowledge silos', 'Both explicit and tacit knowledge matter', 'Continuous knowledge sharing']
      },
      {
        id: 'PR17',
        number: 'Task 17',
        title: 'Plan and Manage Project/Phase Closure or Transitions',
        enablers: [
          'Determine criteria to successfully close project or phase',
          'Validate readiness for transition',
          'Conclude activities to close out project or phase'
        ],
        keyPoints: [
          'Administrative closure: Close contracts, archive documents, release resources',
          'Product transition: Train users, transfer to operations, warranty period',
          'Lessons learned: What went well, what to improve, recommendations',
          'Final report: Summary of performance, outcomes, variances',
          'Celebrate: Recognize team contributions and achievements'
        ],
        deepDive: `Project Closure Checklist: (1) Confirm all deliverables accepted, (2) Close all contracts and procurements, (3) Release project resources, (4) Archive all documents, (5) Conduct lessons learned session, (6) Create final report, (7) Transition product to operations, (8) Celebrate team success.`,
        commonMistakes: ['Skipping closure activities', 'No lessons learned', 'Immediate team dissolution'],
        examTips: ['Formal closure for both successful and cancelled projects', 'Lessons learned benefit future projects', 'Celebrate even if project cancelled']
      }
    ],
    
    business: [
      // BUSINESS ENVIRONMENT DOMAIN - 4 Tasks (8% of exam)
      {
        id: 'B1',
        number: 'Task 1',
        title: 'Plan and Manage Project Compliance',
        enablers: [
          'Confirm project compliance requirements',
          'Classify compliance categories',
          'Determine potential threats to compliance',
          'Use methods to support compliance',
          'Analyze consequences of noncompliance',
          'Determine necessary approach and action',
          'Measure extent of project compliance'
        ],
        keyPoints: [
          'Compliance types: Legal, regulatory, industry standards, organizational policies',
          'Examples: GDPR (data privacy), SOX (financial), HIPAA (healthcare), ISO standards',
          'Consequences: Fines, legal action, reputation damage, project shutdown',
          'Proactive compliance: Build into project from start',
          'Audit trail: Document compliance activities'
        ],
        deepDive: `Compliance Management: (1) Identify all applicable regulations and standards, (2) Map requirements to project activities, (3) Assign compliance owners, (4) Build controls into processes, (5) Regular compliance reviews, (6) Document everything, (7) Address gaps immediately.`,
        commonMistakes: ['Compliance as afterthought', 'Not knowing regulations', 'Poor documentation'],
        examTips: ['Compliance is non-negotiable', 'Proactive not reactive', 'Document all compliance activities']
      },
      {
        id: 'B2',
        number: 'Task 2',
        title: 'Evaluate and Deliver Project Benefits and Value',
        enablers: [
          'Investigate that benefits are identified',
          'Document agreement on ownership for ongoing benefit realization',
          'Verify measurement system is in place',
          'Evaluate delivery options for max value',
          'Appraise stakeholders are aware of benefits'
        ],
        keyPoints: [
          'Benefits: Business value realized from project outcomes (post-project)',
          'Benefits realization: Occurs after project closure, measured by operations',
          'Leading vs lagging indicators: Early signals vs final outcomes',
          'Value proposition: Why project is worth doing',
          'Incremental delivery: Realize benefits sooner through phased releases'
        ],
        deepDive: `Benefits vs Deliverables: Deliverables are project outputs (software, building). Benefits are business outcomes (revenue increase, cost reduction, customer satisfaction). Projects deliver outputs, organizations realize benefits through adoption and use.`,
        commonMistakes: ['Confusing deliverables with benefits', 'No benefit measurement plan', 'Assuming delivered features will automatically be adopted'],
        examTips: ['Benefits realized after project closure', 'Operations measures benefits not PM', 'Plan for benefits realization during project']
      },
      {
        id: 'B3',
        number: 'Task 3',
        title: 'Evaluate and Address External Business Environment Changes',
        enablers: [
          'Survey external business environment',
          'Assess and prioritize impact',
          'Recommend options including response/changes',
          'Continually review external business environment'
        ],
        keyPoints: [
          'External factors: Market conditions, regulations, technology, competition, economy',
          'PESTLE analysis: Political, Economic, Social, Technological, Legal, Environmental',
          'Monitoring: Regular environmental scanning',
          'Agility: Ability to adapt to external changes',
          'Strategic alignment: Ensure project still aligned with business strategy'
        ],
        deepDive: `Environmental Scanning: (1) Monitor industry news and trends, (2) Track competitor actions, (3) Watch for regulatory changes, (4) Assess economic indicators, (5) Evaluate impact on project, (6) Recommend adjustments, (7) Escalate strategic misalignments.`,
        commonMistakes: ['Internal focus only', 'Ignoring market changes', 'No regular monitoring'],
        examTips: ['External environment constantly changes', 'May require project scope/approach changes', 'Strategic alignment is ongoing not one-time']
      },
      {
        id: 'B4',
        number: 'Task 4',
        title: 'Support Organizational Change',
        enablers: [
          'Assess organizational culture',
          'Evaluate impact of organizational change',
          'Determine strategy to facilitate change'
        ],
        keyPoints: [
          'Change management: People side of change (vs project change control)',
          'Resistance: Natural human response to change',
          'ADKAR model: Awareness, Desire, Knowledge, Ability, Reinforcement',
          'Communication: Frequent, transparent, two-way',
          'Stakeholder buy-in: Critical for change success'
        ],
        deepDive: `Organizational Change: (1) Assess current culture and readiness, (2) Create compelling case for change, (3) Build coalition of supporters, (4) Communicate vision clearly and repeatedly, (5) Enable action and quick wins, (6) Sustain momentum, (7) Anchor change in culture.`,
        commonMistakes: ['Underestimating resistance', 'Top-down mandates only', 'Insufficient communication'],
        examTips: ['People side of change separate from technical side', 'Resistance is normal', 'Communication and engagement are key']
      }
    ]
  };

  // EXPANDED QUESTION BANK - 150+ questions
  const allQuestions = [
    // PEOPLE DOMAIN QUESTIONS (60+ questions)
    {
      id: 1,
      domain: 'people',
      task: 'Task 1: Manage conflict',
      approach: 'agile',
      question: "During a sprint retrospective, two senior developers have a heated disagreement about code review standards. One believes the current process is too slow, while the other insists thoroughness is critical. The disagreement is affecting team morale. What should the Scrum Master do FIRST?",
      options: [
        "Make a decision on the code review process to resolve the conflict quickly",
        "Facilitate a discussion to understand both perspectives and guide the team toward consensus",
        "Escalate to the Product Owner to decide the appropriate standard",
        "Suggest they agree to disagree and move forward with current practices"
      ],
      correct: 1,
      explanation: "ECO Task: Manage conflict. As a servant leader, the Scrum Master facilitates (doesn't dictate) and helps the team self-organize to resolve conflicts. Facilitating discussion to understand root causes and find collaborative solutions builds team ownership. This is the 'collaborate/problem-solve' conflict resolution technique."
    },
    {
      id: 2,
      domain: 'people',
      task: 'Task 2: Lead a team',
      approach: 'predictive',
      question: "You're leading a critical infrastructure project with a team of 15 specialists. Several team members come to you privately expressing concerns that the project timeline is unrealistic. What should you do?",
      options: [
        "Tell them the timeline is fixed and they need to find a way to deliver",
        "Gather data on the concerns, assess the timeline feasibility, and communicate findings to the sponsor",
        "Immediately request a schedule extension from the sponsor",
        "Reassign the concerned team members to reduce negativity"
      ],
      correct: 1,
      explanation: "ECO Task: Lead a team. Leadership requires listening to team concerns, gathering facts, and making informed decisions. Assessing the situation objectively before taking action demonstrates servant leadership."
    },
    {
      id: 3,
      domain: 'people',
      task: 'Task 3: Support team performance',
      approach: 'agile',
      question: "Your agile team's velocity has dropped from 40 to 22 story points over two sprints, with no team changes or absences. What should you do FIRST?",
      options: [
        "Pressure the team to return to their previous velocity",
        "Investigate with the team to understand root causes and identify impediments",
        "Reduce future sprint commitments to 22 points",
        "Report the decline to stakeholders immediately"
      ],
      correct: 1,
      explanation: "ECO Task: Support team performance. Sudden velocity drops signal impediments or emerging issues. A servant leader investigates root causes collaboratively rather than assuming problems."
    },
    {
      id: 4,
      domain: 'people',
      task: 'Task 4: Empower team members',
      approach: 'hybrid',
      question: "A junior team member identifies an opportunity to improve the deployment process that would save 30% deployment time but requires modest investment. They're hesitant to propose it formally. How should you respond?",
      options: [
        "Thank them for the idea and evaluate it yourself before presenting to leadership",
        "Coach them on how to develop a business case and support them in presenting it",
        "Implement the change immediately since it's clearly beneficial",
        "Add it to a suggestion box for future consideration"
      ],
      correct: 1,
      explanation: "ECO Task: Empower team members. Empowerment means building capability, not doing things for people. Coaching them to develop and present their idea builds confidence and skills."
    },
    {
      id: 5,
      domain: 'people',
      task: 'Task 5: Ensure adequate training',
      approach: 'predictive',
      question: "Your project requires using a new cloud platform that none of your team members have experience with. The project timeline is tight. What's the BEST approach?",
      options: [
        "Proceed with the project and let team members learn on the job",
        "Hire external consultants to handle the cloud platform work",
        "Invest in focused training upfront and adjust the schedule if needed",
        "Replace team members with others who have cloud experience"
      ],
      correct: 2,
      explanation: "ECO Task: Ensure adequate training. Skill gaps create significant risk. Training invests in capability building, which benefits this project and the organization long-term."
    },
    {
      id: 6,
      domain: 'people',
      task: 'Task 1: Manage conflict',
      approach: 'predictive',
      question: "Two functional managers are in conflict over resource allocation for your project. Both have valid needs. The conflict is delaying your project. What should you do?",
      options: [
        "Escalate to their common manager to decide",
        "Facilitate a meeting to find a collaborative solution that addresses both needs",
        "Choose the manager whose department is more critical to your project",
        "Document the delay and adjust your schedule"
      ],
      correct: 1,
      explanation: "ECO Task: Manage conflict. Before escalating, attempt to facilitate problem-solving. The collaborate/problem-solve approach should be attempted first."
    },
    {
      id: 7,
      domain: 'people',
      task: 'Task 7: Address impediments',
      approach: 'agile',
      question: "During daily standup, a developer mentions they've been waiting 4 days for security review approval. This isn't the first time security reviews have caused delays. What should you do?",
      options: [
        "Note it and address it after standup by working with the security team on the process",
        "Tell the developer to work on other tasks while waiting",
        "Escalate immediately to senior management about security delays",
        "Have the team skip security reviews to maintain velocity"
      ],
      correct: 0,
      explanation: "ECO Task: Address impediments. This is a systemic impediment requiring process improvement. Address the root cause by working with security to improve the review process."
    },
    {
      id: 8,
      domain: 'people',
      task: 'Task 9: Collaborate with stakeholders',
      approach: 'hybrid',
      question: "A key stakeholder rarely attends sprint reviews, then complains about product direction. When they do attend, they request major changes. How should you address this?",
      options: [
        "Continue as is and document their lack of participation",
        "Meet one-on-one to understand their concerns, constraints, and preferred engagement style",
        "Have the Product Owner enforce mandatory attendance",
        "Stop incorporating their feedback since they're not consistently engaged"
      ],
      correct: 1,
      explanation: "ECO Task: Collaborate with stakeholders. Lack of engagement usually indicates barriers or concerns. Understanding their situation enables tailoring engagement."
    },
    {
      id: 9,
      domain: 'people',
      task: 'Task 10: Build shared understanding',
      approach: 'agile',
      question: "During sprint planning, the Product Owner, developers, and UX designer have different interpretations of a user story. What should happen NEXT?",
      options: [
        "Defer the story until requirements are clearer",
        "The Product Owner clarifies their intent and the team proceeds",
        "Facilitate a collaborative discussion to align on acceptance criteria and definition of done",
        "Have each role document their interpretation and reconcile differences later"
      ],
      correct: 2,
      explanation: "ECO Task: Build shared understanding. Sprint planning is the right time to build shared understanding through collaborative discussion and writing acceptance criteria together."
    },
    {
      id: 10,
      domain: 'people',
      task: 'Task 11: Engage virtual teams',
      approach: 'hybrid',
      question: "Your team is distributed across 4 time zones. Team members report feeling disconnected and missing context on decisions. What's the MOST effective approach?",
      options: [
        "Require everyone to attend daily standups at a fixed time",
        "Rotate meeting times, use asynchronous communication tools, and create detailed documentation",
        "Divide into regional sub-teams that work independently",
        "Require all team members to work during overlapping hours"
      ],
      correct: 1,
      explanation: "ECO Task: Engage virtual teams. Effective virtual team management requires multiple strategies: rotating meetings shares burden fairly, async tools enable participation, documentation reduces gaps."
    },
    {
      id: 11,
      domain: 'people',
      task: 'Task 14: Apply emotional intelligence',
      approach: 'predictive',
      question: "During a status meeting, a normally engaged team member is quiet and appears upset. After the meeting, what should you do?",
      options: [
        "Give them space and wait to see if they bring it up",
        "Check in privately, express concern, and offer support",
        "Mention it in the team meeting to show you care about wellbeing",
        "Report the behavior to HR as a potential issue"
      ],
      correct: 1,
      explanation: "ECO Task: Apply emotional intelligence. A private check-in shows care while respecting privacy. Creating psychological safety means showing you notice and care."
    },
    {
      id: 12,
      domain: 'people',
      task: 'Task 2: Lead a team',
      approach: 'agile',
      question: "A high-performing team member is offered a promotion that would require them to leave the project with 6 weeks remaining. They ask for your advice. What should you do?",
      options: [
        "Encourage them to delay the promotion until project completion",
        "Support their career growth and help plan knowledge transfer",
        "Explain the impact to the project and let them decide",
        "Escalate to their functional manager to block the move"
      ],
      correct: 1,
      explanation: "ECO Task: Lead a team. Servant leadership means supporting team members' careers over project convenience. This builds trust and organizational capability long-term."
    },

    // PROCESS DOMAIN QUESTIONS (75+ questions)
    {
      id: 13,
      domain: 'process',
      task: 'Task 1: Execute with urgency',
      approach: 'agile',
      question: "Your startup has 6 months of funding. Product Owner wants features sequenced as: 1) User auth, 2) Core functionality, 3) Payment processing, 4) Reporting. This means payments work in month 5. What do you recommend?",
      options: [
        "Follow the PO's sequencing since they own the backlog",
        "Recommend resequencing to deliver end-to-end value earlier, enabling revenue sooner",
        "Build all features in parallel to finish faster",
        "Focus on the most technically complex features first"
      ],
      correct: 1,
      explanation: "ECO Task: Execute with urgency. The current sequence delays revenue until month 5-6. Deliver thin vertical slice (auth + minimal functionality + payment) earlier to enable revenue and learning."
    },
    {
      id: 14,
      domain: 'process',
      task: 'Task 2: Manage communications',
      approach: 'predictive',
      question: "You're managing a construction project with 15 subcontractors, regulatory agencies, community stakeholders, and internal executives. What's the MOST important communication management activity?",
      options: [
        "Creating detailed status reports for all stakeholders weekly",
        "Developing a communication matrix specifying who needs what information, when, and how",
        "Holding weekly all-hands meetings to keep everyone informed",
        "Setting up a project website where all information is available"
      ],
      correct: 1,
      explanation: "ECO Task: Manage communications. A communication matrix ensures stakeholders get relevant information at appropriate times through preferred channels."
    },
    {
      id: 15,
      domain: 'process',
      task: 'Task 3: Assess and manage risks',
      approach: 'hybrid',
      question: "During sprint planning, the team identifies that a critical API they depend on is deprecated and will be shut down in 3 months, mid-project. What should happen?",
      options: [
        "Document as a risk and continue planning the sprint",
        "Immediately re-prioritize the backlog to address this dependency before other work",
        "Escalate to the API vendor to extend the deprecation timeline",
        "Accept the risk since it's 3 months away"
      ],
      correct: 1,
      explanation: "ECO Task: Assess and manage risks. This is a certainty - the API will shut down. Immediate mitigation is needed. The backlog must be re-prioritized to address this existential issue."
    },
    {
      id: 16,
      domain: 'process',
      task: 'Task 5: Plan and manage budget',
      approach: 'predictive',
      question: "At the 60% completion point, your project shows: EV=$600K, AC=$660K, PV=$700K. What should you do?",
      options: [
        "Celebrate being ahead of schedule (EV>AC)",
        "Investigate cost overruns and assess impact on project completion (CPI=0.91)",
        "Request additional budget since you're behind schedule (SPI=0.86)",
        "Continue as planned since variances are normal"
      ],
      correct: 1,
      explanation: "ECO Task: Manage budget. CPI=0.91 (over budget), SPI=0.86 (behind schedule). Both variances signal problems requiring investigation and corrective action."
    },
    {
      id: 17,
      domain: 'process',
      task: 'Task 6: Plan and manage schedule',
      approach: 'hybrid',
      question: "Your hybrid project has fixed regulatory milestones (waterfall) but feature development is agile. How should you manage the schedule?",
      options: [
        "Create a detailed schedule for everything and track to it",
        "Only plan the regulatory milestones and wing the feature work",
        "Create milestone-driven roadmap with agile iteration planning for features",
        "Switch entirely to waterfall to enable scheduling"
      ],
      correct: 2,
      explanation: "ECO Task: Manage schedule. Hybrid projects require different planning cadences. Regulatory milestones need firm dates; feature work uses release planning with sprint-level detail."
    },
    {
      id: 18,
      domain: 'process',
      task: 'Task 7: Plan and manage quality',
      approach: 'agile',
      question: "Your team's Definition of Done includes: code complete, unit tests, integration tests, code reviewed, documentation updated. Frequently, stories are 'done' but bugs emerge later. What should you do?",
      options: [
        "Accept that some bugs are normal in agile development",
        "Add more items to the Definition of Done (e.g., performance testing, security review)",
        "Slow down development to allow more thorough testing",
        "Create a separate hardening sprint every 3 sprints"
      ],
      correct: 1,
      explanation: "ECO Task: Manage quality. If the Definition of Done doesn't prevent bugs, it's incomplete. Tighten quality standards so 'done' means 'potentially shippable.'"
    },
    {
      id: 19,
      domain: 'process',
      task: 'Task 8: Plan and manage scope',
      approach: 'predictive',
      question: "A stakeholder requests a scope change that would add significant value but requires a 2-month schedule extension. The original deadline is contractually fixed. What should you do?",
      options: [
        "Reject the change to protect the deadline",
        "Accept the change and negotiate a contract modification",
        "Evaluate the change and present options: reduce other scope, extend deadline, or reject",
        "Implement the change and absorb the schedule impact"
      ],
      correct: 2,
      explanation: "ECO Task: Manage scope. All changes require impact analysis. Evaluate options and trade-offs, then stakeholders decide based on informed analysis."
    },
    {
      id: 20,
      domain: 'process',
      task: 'Task 10: Manage changes',
      approach: 'agile',
      question: "Halfway through a sprint, the Product Owner wants to swap a low-priority story for a high-priority one that just emerged. The team has capacity. What should happen?",
      options: [
        "Make the swap since the Product Owner owns prioritization",
        "Explain that the sprint scope is fixed and add it to the next sprint",
        "Negotiate with the team - if they agree and the sprint goal isn't impacted, make the swap",
        "Refuse since it violates Scrum rules"
      ],
      correct: 2,
      explanation: "ECO Task: Manage changes. Scrum protects sprint commitments but allows flexibility if the team agrees and sprint goal isn't compromised. The sprint goal is sacred, not the backlog."
    },
    {
      id: 21,
      domain: 'process',
      task: 'Task 13: Determine methodology',
      approach: 'hybrid',
      question: "You're starting a project with: stable regulatory requirements, uncertain user preferences, distributed team, and 9-month timeline. Which approach should you recommend?",
      options: [
        "Pure waterfall since requirements are partially defined",
        "Pure agile since user preferences are uncertain",
        "Hybrid: waterfall for regulatory, agile for user-facing features",
        "Start with waterfall and switch to agile midway"
      ],
      correct: 2,
      explanation: "ECO Task: Determine methodology. Different work types need different approaches. Regulatory requirements need traceability (predictive); user preferences need experimentation (agile)."
    },

    // BUSINESS ENVIRONMENT QUESTIONS (15+ questions)
    {
      id: 22,
      domain: 'business',
      task: 'Task 1: Plan compliance',
      approach: 'predictive',
      question: "Your project must comply with GDPR regulations. Midway through, regulations change, requiring additional consent mechanisms. What should you do FIRST?",
      options: [
        "Continue with current approach since the project was planned under old regulations",
        "Assess the impact on scope, schedule, cost and update the project plan",
        "Immediately implement the new requirements",
        "Escalate to legal to determine if the project must comply"
      ],
      correct: 1,
      explanation: "ECO Task: Plan compliance. Regulatory changes aren't optional - compliance is mandatory. Assess impact, update plans, and implement through change control."
    },
    {
      id: 23,
      domain: 'business',
      task: 'Task 2: Deliver benefits and value',
      approach: 'agile',
      question: "Your product has been live for 3 months. The business case projected 30% increase in user engagement, but you're only seeing 10%. What should you do?",
      options: [
        "Continue as planned - it's early and improvements take time",
        "Analyze usage data, gather user feedback, and adjust the roadmap based on learnings",
        "Declare the project a failure and shut down the product",
        "Add more features to increase engagement"
      ],
      correct: 1,
      explanation: "ECO Task: Deliver value. Benefits realization is about learning and adapting. Investigate why the gap exists and adapt based on data."
    },
    {
      id: 24,
      domain: 'business',
      task: 'Task 3: Address external changes',
      approach: 'hybrid',
      question: "A major competitor releases a product with features your project is building. Your product won't launch for 6 months. What should you do FIRST?",
      options: [
        "Accelerate the schedule to launch sooner",
        "Meet with stakeholders to reassess the business case and strategic positioning",
        "Add differentiating features to your roadmap",
        "Continue as planned since significant investment has been made"
      ],
      correct: 1,
      explanation: "ECO Task: Address external changes. Market changes may invalidate the business case. Reassess viability and strategic options with stakeholders."
    },
    {
      id: 25,
      domain: 'business',
      task: 'Task 4: Support organizational change',
      approach: 'predictive',
      question: "Your project will significantly change how the finance department operates. Users are resistant, saying 'the old system works fine.' How should you address this?",
      options: [
        "Mandate the change since it's approved by leadership",
        "Develop a change management plan: communicate benefits, provide training, identify champions",
        "Delay the project until users are more accepting",
        "Implement the change and let users adapt over time"
      ],
      correct: 1,
      explanation: "ECO Task: Support organizational change. Resistance signals insufficient change management. Address through communication, training, and building advocates."
    },

    // Additional questions continuing the pattern...
    // Adding more to reach 150+ total
    
    {
      id: 26,
      domain: 'people',
      task: 'Task 6: Build a team',
      approach: 'agile',
      question: "You're forming a new Scrum team for a complex product. You have the opportunity to select team members. What should be your PRIMARY consideration?",
      options: [
        "Select the most senior and experienced developers available",
        "Build a cross-functional team with complementary skills and T-shaped capabilities",
        "Choose team members who have worked together successfully before",
        "Select individuals who are immediately available regardless of skills"
      ],
      correct: 1,
      explanation: "ECO Task: Build a team. Agile teams need to be self-sufficient and cross-functional to deliver end-to-end. T-shaped people enable flexibility."
    },
    {
      id: 27,
      domain: 'process',
      task: 'Task 4: Engage stakeholders',
      approach: 'agile',
      question: "Your Product Owner struggles to get time with key stakeholders for feedback. Sprint reviews are poorly attended. What should you do?",
      options: [
        "Continue with sprint reviews and document the lack of engagement",
        "Help the Product Owner develop strategies to increase stakeholder engagement",
        "Cancel sprint reviews if stakeholders aren't attending",
        "Have the team skip sprint reviews to save time"
      ],
      correct: 1,
      explanation: "ECO Task: Engage stakeholders. This is a significant impediment. Help the PO by exploring barriers and adjusting approach to demonstrate value."
    },
    {
      id: 28,
      domain: 'process',
      task: 'Task 16: Ensure knowledge transfer',
      approach: 'hybrid',
      question: "Your lead developer is leaving mid-project. They're the only person who understands the core architecture. What should you do?",
      options: [
        "Offer them more money to stay until project completion",
        "Implement immediate knowledge transfer: documentation, pairing sessions, architecture reviews",
        "Hire their replacement immediately to overlap for training",
        "Accept the risk and have the team figure it out after they leave"
      ],
      correct: 1,
      explanation: "ECO Task: Ensure knowledge transfer. Multiple transfer mechanisms are needed: documentation, pairing, and reviews enable hands-on learning and Q&A."
    },
    {
      id: 29,
      domain: 'process',
      task: 'Task 12: Manage artifacts',
      approach: 'agile',
      question: "Your distributed team is struggling to find current information. Documents are scattered across email, Slack, SharePoint, and Confluence. What should you do?",
      options: [
        "Mandate that all documents must be in one location",
        "Create an information radiator/wiki with clear structure and linking across tools",
        "Hire a documentation specialist to organize everything",
        "Accept that distributed information is normal in agile"
      ],
      correct: 1,
      explanation: "ECO Task: Manage artifacts. Information radiators and well-organized wikis provide transparent, easily accessible information without forcing everything into one tool."
    },
    {
      id: 30,
      domain: 'people',
      task: 'Task 13: Mentor stakeholders',
      approach: 'hybrid',
      question: "Your Product Owner is new to the role and keeps accepting changes mid-sprint despite coaching about protecting sprint commitments. What should you do?",
      options: [
        "Escalate to the Product Owner's manager about the performance issue",
        "Continue coaching and consider pairing them with an experienced Product Owner mentor",
        "Work around them by having the team politely refuse mid-sprint changes",
        "Request a different Product Owner for the project"
      ],
      correct: 1,
      explanation: "ECO Task: Mentor stakeholders. Behavioral change takes time and support. Continued coaching combined with peer mentoring is most effective."
    },
    {
      id: 31,
      domain: 'people',
      task: 'Task 6: Build a team',
      approach: 'agile',
      question: "Your agile team is in the 'Storming' phase. Team members are arguing about the definition of 'Done' and velocity is suffering. As a servant leader, what is your BEST course of action?",
      options: [
        "Intervene and dictate the Definition of Done to stop the arguing",
        "Allow the conflict to continue as it is a natural part of team formation",
        "Facilitate a working session to help the team co-create their norms and agreements",
        "Report the behavior to functional managers"
      ],
      correct: 2,
      explanation: "ECO Task: Build a team. Storming is normal, but the PM must facilitate the team through it, not ignore it or dictate solutions. Co-creation builds buy-in."
    },
    {
      id: 32,
      domain: 'process',
      task: 'Task 1: Execute with urgency',
      approach: 'hybrid',
      question: "You are managing a hybrid project. The hardware component (predictive) is delayed, which blocks the software team (agile). The software team has run out of backlog items unrelated to hardware. What should you do?",
      options: [
        "Pause the software team's sprint until hardware arrives",
        "Ask the Product Owner to identify value-add work (technical debt, refactoring) that doesn't depend on hardware",
        "Force the hardware team to work overtime",
        "Have the software team help the hardware team"
      ],
      correct: 1,
      explanation: "ECO Task: Execute with urgency. Do not stop the line. If a blocker exists, find other value-add work (like reducing technical debt) to keep the team productive."
    },
    {
      id: 33,
      domain: 'business',
      task: 'Task 1: Plan and manage compliance',
      approach: 'predictive',
      question: "A new environmental regulation is passed that affects your construction project. The project is 90% complete. Complying will cost $50k and delay the finish by 2 weeks. What should you do FIRST?",
      options: [
        "Ignore the regulation since the project is almost done",
        "Implement the change immediately to avoid fines",
        "Analyze the impact and submit a formal change request",
        "Ask the sponsor for the extra money"
      ],
      correct: 2,
      explanation: "ECO Task: Manage compliance. Even mandatory compliance changes must go through the Change Control process to update baselines (cost/schedule) formally."
    },
    {
      id: 34,
      domain: 'process',
      task: 'Task 10: Manage changes',
      approach: 'agile',
      question: "During a Sprint Review, a key stakeholder asks to add a new feature. The Product Owner agrees it is high value. What happens next?",
      options: [
        "The team adds it to the current sprint immediately",
        "The Product Owner adds it to the Product Backlog and prioritizes it for a future sprint",
        "The Scrum Master rejects it because the scope is frozen",
        "The team works overtime to include it in the current increment"
      ],
      correct: 1,
      explanation: "ECO Task: Manage changes. In Agile, new requirements go to the Product Backlog. They are prioritized by the PO for *future* sprints, not injected into the *current* sprint (unless the team creates space)."
    },
    {
      id: 35,
      domain: 'people',
      task: 'Task 11: Engage virtual teams',
      approach: 'predictive',
      question: "You have a distributed team in London, New York, and Tokyo. The Tokyo team complains they are always attending meetings at midnight. What is the BEST solution?",
      options: [
        "Tell the Tokyo team it is a temporary requirement",
        "Rotate the meeting times so the inconvenience is shared equally",
        "Cancel all synchronous meetings and use email only",
        "Hold separate meetings for each region"
      ],
      correct: 1,
      explanation: "ECO Task: Engage virtual teams. Fairness is key in virtual teams. Rotating meeting times shares the pain and shows respect for all team members."
    },
    {
      id: 36,
      domain: 'process',
      task: 'Task 5: Plan and manage budget',
      approach: 'predictive',
      question: "Your project has a BAC of $100,000. Currently, EV = $45,000 and AC = $50,000. What is the CPI and status?",
      options: [
        "CPI = 1.1; Under Budget",
        "CPI = 0.9; Over Budget",
        "CPI = 0.9; Under Budget",
        "CPI = 1.1; Over Budget"
      ],
      correct: 1,
      explanation: "ECO Task: Manage budget. CPI = EV / AC ($45k / $50k = 0.9). CPI < 1.0 indicates the project is Over Budget."
    },
    {
      id: 37,
      domain: 'process',
      task: 'Task 13: Determine methodology',
      approach: 'hybrid',
      question: "Your organization is transitioning to Agile. A stakeholder demands a detailed Gantt chart for the next 12 months. How should you respond?",
      options: [
        "Create the Gantt chart to keep the stakeholder happy",
        "Explain that Agile doesn't use plans",
        "Provide a high-level roadmap for the year and detailed iteration plans for the next month",
        "Ignore the request as it fits the old methodology"
      ],
      correct: 2,
      explanation: "ECO Task: Determine methodology. In hybrid/agile transitions, you bridge the gap. A roadmap satisfies long-term visibility needs, while iteration plans manage the actual agile work."
    },
    {
      id: 38,
      domain: 'process',
      task: 'Task 15: Manage project issues',
      approach: 'predictive',
      question: "A vendor discovers a defect in a critical component they supplied. They can fix it, but it will take 5 days. This activity is on the Critical Path. What is the immediate impact?",
      options: [
        "The project will be delayed by 5 days unless action is taken",
        "There is no impact if you use float",
        "The cost will increase but schedule will remain same",
        "The project float will increase"
      ],
      correct: 0,
      explanation: "ECO Task: Manage issues. The Critical Path has zero float (usually). Any delay on the Critical Path delays the project end date immediately."
    },
    {
      id: 39,
      domain: 'people',
      task: 'Task 1: Manage conflict',
      approach: 'agile',
      question: "A team member consistently interrupts others during the Daily Scrum. The team is frustrated. What should the Scrum Master do?",
      options: [
        "Interrupt the offender and demand silence",
        "Remind the team of their Ground Rules regarding respect and facilitation",
        "Expel the member from the meeting",
        "Let the team handle it without interference"
      ],
      correct: 1,
      explanation: "ECO Task: Manage conflict. Referring to Ground Rules is a neutral, objective way to enforce behavior without personal attacks."
    },
    {
      id: 40,
      domain: 'business',
      task: 'Task 2: Evaluate and deliver benefits',
      approach: 'agile',
      question: "The team has completed all features in the backlog, but the customer says the product does not solve their business problem. What likely went wrong?",
      options: [
        "The team had low velocity",
        "The Definition of Done was weak",
        "There was a lack of value validation and feedback loops during development",
        "The code quality was poor"
      ],
      correct: 2,
      explanation: "ECO Task: Deliver benefits. Building the 'wrong thing' happens when we focus on output (features) rather than outcome (value). Regular feedback loops prevent this."
    },
    {
      id: 41,
      domain: 'people',
      task: 'Task 12: Define team ground rules',
      approach: 'hybrid',
      question: "You are taking over a project where team members constantly blame each other for errors. What is the FIRST step to fix this culture?",
      options: [
        "Report the toxicity to HR",
        "Establish a 'No Blame' ground rule and model the behavior yourself",
        "Fire the loudest complainer",
        "Separate the team members"
      ],
      correct: 1,
      explanation: "ECO Task: Define ground rules. Psychological safety is built by establishing norms (ground rules) that encourage problem-solving over finger-pointing."
    },
    {
      id: 42,
      domain: 'process',
      task: 'Task 17: Project closure',
      approach: 'predictive',
      question: "The project was terminated early due to budget cuts. The team is upset. What must the PM do?",
      options: [
        "Release the team immediately to save money",
        "Follow the formal closing procedures, including documenting lessons learned",
        "Delete the project files since they aren't needed",
        "Apologize and leave"
      ],
      correct: 1,
      explanation: "ECO Task: Closure. Projects must be formally closed even if terminated early. This preserves organizational knowledge (lessons learned) and assets."
    },
    {
      id: 43,
      domain: 'process',
      task: 'Task 9: Integrate planning activities',
      approach: 'predictive',
      question: "You have just received the Project Charter. What is your very next step?",
      options: [
        "Create the WBS",
        "Identify Stakeholders",
        "Create the Schedule",
        "Hold the Kick-off Meeting"
      ],
      correct: 1,
      explanation: "ECO Task: Integrate activities. After the Charter (Initiating), the first step is Identifying Stakeholders. You cannot gather requirements or plan without knowing who the stakeholders are."
    },
    {
      id: 44,
      domain: 'people',
      task: 'Task 3: Support team performance',
      approach: 'agile',
      question: "A developer is struggling to complete tasks. They admit they lack skills in the new language being used. What should the PM do?",
      options: [
        "Replace the developer",
        "Assign them to documentation only",
        "Pair them with a senior developer for mentoring and training",
        "Escalate to the functional manager"
      ],
      correct: 2,
      explanation: "ECO Task: Support team performance. Invest in your people. Pair programming is an excellent agile technique for upskilling and knowledge transfer."
    },
    {
      id: 45,
      domain: 'process',
      task: 'Task 8: Plan and manage scope',
      approach: 'predictive',
      question: "The client asks for a small change. 'It's just a logo color,' they say. It will take 1 hour. What do you do?",
      options: [
        "Just do it to build goodwill (Gold Plating)",
        "Refuse it as out of scope",
        "Follow the change management process, even for small changes",
        "Tell the team to squeeze it in"
      ],
      correct: 2,
      explanation: "ECO Task: Manage scope. Beware of Scope Creep. All changes, no matter how small, should be tracked. For tiny changes, the process can be fast, but it must exist."
    },
    {
      id: 46,
      domain: 'business',
      task: 'Task 4: Support organizational change',
      approach: 'predictive',
      question: "Your project implements a new AI tool that will automate 30% of the staff's work. Rumors of layoffs are spreading, and resistance is high. What should you do?",
      options: [
        "Ignore the rumors and focus on the technical implementation",
        "Communicate transparently about the change vision and benefits, and engage HR to address job security concerns",
        "Tell the staff the tool is mandatory",
        "Delay the launch"
      ],
      correct: 1,
      explanation: "ECO Task: Support organizational change. You must address the 'people side' of change. Communication and transparency reduce fear and resistance."
    },
    {
      id: 47,
      domain: 'process',
      task: 'Task 12: Manage artifacts',
      approach: 'agile',
      question: "The team says updating the Jira board is 'administrative waste' and they stopped doing it. Stakeholders have no visibility. What should you do?",
      options: [
        "Update the board yourself",
        "Explain that information radiators are critical for transparency and trust, and ask the team how to make updates easier",
        "Force them to update it",
        "Stop reporting to stakeholders"
      ],
      correct: 1,
      explanation: "ECO Task: Manage artifacts. In Agile, transparency is a pillar. If the team sees it as waste, coach them on the value of trust and visibility."
    },
    {
      id: 48,
      domain: 'process',
      task: 'Task 3: Assess and manage risks',
      approach: 'predictive',
      question: "You identified a risk that a vendor might go bankrupt. You decided to insure the contract. What type of risk response is this?",
      options: [
        "Avoid",
        "Mitigate",
        "Transfer",
        "Accept"
      ],
      correct: 2,
      explanation: "ECO Task: Manage risks. Insurance is the classic example of 'Transfer'. You shift the financial impact to a third party."
    },
    {
      id: 49,
      domain: 'process',
      task: 'Task 6: Plan and manage schedule',
      approach: 'agile',
      question: "The product owner wants to know when the project will be done. The team uses story points. What tool gives the best forecast?",
      options: [
        "Gantt Chart",
        "Burnup Chart",
        "Network Diagram",
        "Project Charter"
      ],
      correct: 1,
      explanation: "ECO Task: Manage schedule. Burnup (or Burndown) charts track velocity against total scope, providing empirical data to forecast completion dates."
    },
    {
      id: 50,
      domain: 'people',
      task: 'Task 14: Emotional Intelligence',
      approach: 'hybrid',
      question: "You notice a team member is constantly checking their phone during meetings and rolling their eyes at suggestions. The team is annoyed. Using EI, what is the best response?",
      options: [
        "Call them out publicly",
        "Pull them aside privately to understand if something is wrong (empathy) and discuss the impact on the team",
        "Report them to management",
        "Ignore it"
      ],
      correct: 1,
      explanation: "ECO Task: Emotional Intelligence. Self-regulation and empathy. Understand the root cause (maybe a personal issue?) before judging, but address the behavior privately."
    },
    {
      id: 51,
      domain: 'process',
      task: 'Task 7: Plan and manage quality',
      approach: 'predictive',
      question: "You are in the testing phase. A defect is found. You fix the defect. What must you do next?",
      options: [
        "Close the defect ticket",
        "Perform Regression Testing to ensure the fix didn't break something else",
        "Update the project management plan",
        "Blame the developer"
      ],
      correct: 1,
      explanation: "ECO Task: Manage quality. After a fix, Regression Testing is mandatory to ensure system integrity."
    },
    {
      id: 52,
      domain: 'people',
      task: 'Task 8: Negotiate project agreements',
      approach: 'predictive',
      question: "A functional manager refuses to release a key resource to your project because they are 'too busy'. You need this specific person. What do you do?",
      options: [
        "Complain to the sponsor",
        "Negotiate with the manager: ask 'When will they be available?' or offer to trade value",
        "Steal the resource",
        "Update the risk register and give up"
      ],
      correct: 1,
      explanation: "ECO Task: Negotiate agreements. Negotiation involves finding a middle ground. Understanding the manager's constraints is the first step to solving the resource block."
    },
    {
      id: 53,
      domain: 'process',
      task: 'Task 16: Knowledge transfer',
      approach: 'agile',
      question: "A sprint is ending. The team did great work but forgot to update the technical wiki. What should happen?",
      options: [
        "The story is not Done",
        "The Scrum Master updates the wiki",
        "Mark it done and do it next sprint",
        "Skip it this time"
      ],
      correct: 0,
      explanation: "ECO Task: Knowledge transfer. If the Definition of Done requires documentation, the story is NOT Done. Incomplete work returns to the backlog."
    },
    {
      id: 54,
      domain: 'process',
      task: 'Task 4: Engage stakeholders',
      approach: 'hybrid',
      question: "A stakeholder is 'Resistant' to your project. You need them to be 'Supportive'. What strategy in your Stakeholder Engagement Plan is best?",
      options: [
        "Send them generic newsletters",
        "Meet with them to understand their objections and show how the project benefits them personally",
        "Ignore them and focus on supportive stakeholders",
        "Escalate to their boss"
      ],
      correct: 1,
      explanation: "ECO Task: Engage stakeholders. Moving from Resistant to Supportive requires active engagement, listening, and WIIFM (What's in it for me)."
    },
    {
      id: 55,
      domain: 'process',
      task: 'Task 13: Determine methodology',
      approach: 'predictive',
      question: "You are building a bridge. The requirements are well known, regulations are strict, and changes are expensive. Which methodology is best?",
      options: [
        "Agile",
        "Scrum",
        "Predictive (Waterfall)",
        "Kanban"
      ],
      correct: 2,
      explanation: "ECO Task: Determine methodology. Physical construction with high constraints and clear scope is the textbook use case for Predictive/Waterfall."
    },
    {
      id: 56,
      domain: 'process',
      task: 'Task 11: Plan and manage procurement',
      approach: 'predictive',
      question: "You need to hire a vendor for a project where the scope is not well defined and will likely change. Which contract type is best to protect both parties?",
      options: [
        "Fixed Price",
        "Time and Materials (T&M)",
        "Cost Plus Fixed Fee",
        "Purchase Order"
      ],
      correct: 1,
      explanation: "ECO Task: Procurement. T&M is best for undefined scope or staff augmentation, as it pays for time spent rather than a fixed deliverable."
    },
    {
      id: 57,
      domain: 'people',
      task: 'Task 2: Lead a team',
      approach: 'agile',
      question: "The team asks the Scrum Master to assign tasks to them for the next Sprint. What should the SM do?",
      options: [
        "Assign the tasks based on skills",
        "Ask the Product Owner to assign tasks",
        "Coach the team on self-organization and have them sign up for tasks themselves",
        "Create a roster"
      ],
      correct: 2,
      explanation: "ECO Task: Lead a team. Agile teams are self-organizing. The SM should not assign work; they should coach the team to take ownership."
    },
    {
      id: 58,
      domain: 'process',
      task: 'Task 2: Manage communications',
      approach: 'predictive',
      question: "You have 6 stakeholders. A new one joins. How many communication channels do you have now?",
      options: [
        "15",
        "21",
        "28",
        "7"
      ],
      correct: 1,
      explanation: "ECO Task: Manage communications. Formula: N(N-1)/2. New N=7. 7(6)/2 = 42/2 = 21."
    },
    {
      id: 59,
      domain: 'business',
      task: 'Task 3: External environment',
      approach: 'predictive',
      question: "A trade war increases the cost of steel by 25%. Your budget is blown. What do you do?",
      options: [
        "Use the Management Reserve (with approval)",
        "Use the Contingency Reserve",
        "Cut scope",
        "Cancel the project"
      ],
      correct: 0,
      explanation: "ECO Task: External environment. Price fluctuations due to external political events are 'Unknown Unknowns'. These are covered by Management Reserves (requires Change Request), not Contingency Reserves (Known Unknowns)."
    },
    {
      id: 60,
      domain: 'process',
      task: 'Task 14: Governance',
      approach: 'predictive',
      question: "You want to move from the 'Design' phase to the 'Build' phase. Who decides?",
      options: [
        "The Project Manager",
        "The Team",
        "The Governance Board / Steering Committee (Phase Gate)",
        "The Customer"
      ],
      correct: 2,
      explanation: "ECO Task: Governance. Moving between major phases usually requires a 'Kill Point' or Phase Gate review by a governance body."
    },
    {
      id: 61,
      domain: 'process',
      task: 'Task 10: Manage changes',
      approach: 'predictive',
      question: "A stakeholder calls you to request a change. What is the FIRST thing you do?",
      options: [
        "Issue a Change Request",
        "Analyze the impact of the change",
        "Consult the Sponsor",
        "Say no"
      ],
      correct: 1,
      explanation: "ECO Task: Manage changes. Before you can fill out a form or ask for approval, you must understand the IMPACT (Cost, Schedule, Risk) of the change."
    },
    {
      id: 62,
      domain: 'people',
      task: 'Task 4: Empower team',
      approach: 'agile',
      question: "The team decides to try 'Pair Programming' to improve quality. You think it will be too slow. What should you do?",
      options: [
        "Forbid it",
        "Support their experiment and review the results in the Retrospective",
        "Ask the sponsor for permission",
        "Require detailed logs of who paired with whom"
      ],
      correct: 1,
      explanation: "ECO Task: Empower team. Safe-to-fail experiments are core to Agile. Let them try. If it fails, they learn. If it works, quality improves."
    },
    {
      id: 63,
      domain: 'process',
      task: 'Task 5: Manage budget',
      approach: 'predictive',
      question: "You are calculating the Estimate at Completion (EAC). You believe the current variance is typical and will continue. Which formula do you use?",
      options: [
        "BAC / CPI",
        "AC + (BAC - EV)",
        "AC + Bottom-up ETC",
        "BAC - CV"
      ],
      correct: 0,
      explanation: "ECO Task: Manage budget. If current performance (CPI) is expected to continue, you divide the total budget (BAC) by the current efficiency (CPI)."
    },
    {
      id: 64,
      domain: 'people',
      task: 'Task 13: Mentor stakeholders',
      approach: 'agile',
      question: "A stakeholder keeps asking for detailed status reports in a Scrum project. What is the mentoring opportunity here?",
      options: [
        "Teach them how to use Jira",
        "Invite them to the Daily Scrum",
        "Invite them to the Sprint Review to see the working product",
        "Create the report for them"
      ],
      correct: 2,
      explanation: "ECO Task: Mentor stakeholders. Shift their focus from 'status reports' (proxies) to 'working software' (reality). The Sprint Review is the place for this."
    },
    {
      id: 65,
      domain: 'process',
      task: 'Task 1: Execute with urgency',
      approach: 'agile',
      question: "The team has a choice: Build the 'User Login' (low value, high necessity) or 'Search Algorithm' (high value, high risk). What should they do first?",
      options: [
        "User Login",
        "Search Algorithm",
        "Both simultaneously",
        "Ask the PM"
      ],
      correct: 1,
      explanation: "ECO Task: Execute with urgency. Agile favors 'Risk-First' or 'Value-First'. Tackling the high-value/high-risk item first proves viability (Fail Fast). Login is easy and can wait."
    },
    {
      id: 66,
      domain: 'process',
      task: 'Task 12: Manage artifacts',
      approach: 'predictive',
      question: "You are looking for the detailed description of a work package, including the acceptance criteria and responsible party. Where do you look?",
      options: [
        "The WBS",
        "The WBS Dictionary",
        "The Project Charter",
        "The Scope Statement"
      ],
      correct: 1,
      explanation: "ECO Task: Manage artifacts. The WBS is just boxes/names. The WBS Dictionary contains the *details* behind the boxes."
    },
    {
      id: 67,
      domain: 'people',
      task: 'Task 7: Remove impediments',
      approach: 'agile',
      question: "The team complains that the testing server is too slow and crashes often. It is slowing down the sprint. This is an:",
      options: [
        "Risk",
        "Impediment",
        "Issue",
        "Assumption"
      ],
      correct: 1,
      explanation: "ECO Task: Remove impediments. In Agile, anything slowing the team down right now is an impediment (or blocker) to be removed by the Scrum Master."
    },
    {
      id: 68,
      domain: 'process',
      task: 'Task 8: Plan scope',
      approach: 'agile',
      question: "What is the primary tool for managing scope in an Agile project?",
      options: [
        "Scope Statement",
        "WBS",
        "Product Backlog",
        "Project Plan"
      ],
      correct: 2,
      explanation: "ECO Task: Plan scope. The Product Backlog is the single source of truth for all work (scope) in the project."
    },
    {
      id: 69,
      domain: 'process',
      task: 'Task 9: Integrate planning',
      approach: 'hybrid',
      question: "You are running a hybrid project. How do you integrate the agile team's progress into the overall predictive schedule?",
      options: [
        "Force the agile team to use MS Project",
        "Map the Agile 'Sprints' or 'Releases' as milestones in the master schedule",
        "Don't track the agile team",
        "Convert the predictive part to agile"
      ],
      correct: 1,
      explanation: "ECO Task: Integrate planning. The best practice is to treat Agile Release points or Sprint Ends as milestones in the overarching Master Schedule."
    },
    {
      id: 70,
      domain: 'process',
      task: 'Task 15: Manage issues',
      approach: 'predictive',
      question: "A key team member has a family emergency and will be gone for 2 weeks. This was not a risk. It is now happening. What do you update?",
      options: [
        "Risk Register",
        "Issue Log",
        "Stakeholder Register",
        "Lessons Learned"
      ],
      correct: 1,
      explanation: "ECO Task: Manage issues. Risks are future/uncertain. Issues are present/happening. You must log this in the Issue Log and manage it."
    },
    {
      id: 71,
      domain: 'people',
      task: 'Task 5: Ensure training',
      approach: 'predictive',
      question: "You notice the team is making many errors in the new software. You check the budget and have no money for training. What do you do?",
      options: [
        "Tell them to be more careful",
        "Submit a Change Request to increase the budget for training",
        "Fire the team",
        "Ignore the errors"
      ],
      correct: 1,
      explanation: "ECO Task: Ensure training. If training is required for quality and wasn't planned, you must formally request the funds to correct the situation via Change Control."
    },
    {
      id: 72,
      domain: 'business',
      task: 'Task 2: Deliver value',
      approach: 'agile',
      question: "The Net Promoter Score (NPS) of the product is declining even though you are delivering features on time. What should you do?",
      options: [
        "Deliver more features faster",
        "Stop development and conduct user interviews to understand the dissatisfaction",
        "Change the metric",
        "Blame marketing"
      ],
      correct: 1,
      explanation: "ECO Task: Deliver value. Value is defined by the customer. If customers are unhappy, building more 'stuff' is waste. You must Pivot or Pause to understand why."
    },
    {
      id: 73,
      domain: 'people',
      task: 'Task 9: Collaborate with stakeholders',
      approach: 'predictive',
      question: "You send a weekly email status report, but a key executive complains they 'don't know what's going on'. What is the problem?",
      options: [
        "The executive is not reading",
        "The communication method (Push) is not effective for this stakeholder",
        "The report is too long",
        "You need to send it daily"
      ],
      correct: 1,
      explanation: "ECO Task: Collaborate with stakeholders. 'Push' communication (email) doesn't ensure understanding. You likely need an 'Interactive' method (meeting/call) for this stakeholder."
    },
    {
      id: 74,
      domain: 'process',
      task: 'Task 6: Manage schedule',
      approach: 'predictive',
      question: "Activity A takes 5 days. Activity B takes 2 days. Activity B cannot start until A is finished (FS). What is the duration?",
      options: [
        "5 days",
        "2 days",
        "7 days",
        "3 days"
      ],
      correct: 2,
      explanation: "ECO Task: Manage schedule. FS (Finish-to-Start) means A must finish (5) then B starts (2). 5+2=7."
    },
    {
      id: 75,
      domain: 'process',
      task: 'Task 7: Manage quality',
      approach: 'agile',
      question: "Who is responsible for quality in an Agile team?",
      options: [
        "The QA Tester",
        "The Developer",
        "The Scrum Master",
        "The Entire Team"
      ],
      correct: 3,
      explanation: "ECO Task: Manage quality. In Agile, the 'Whole Team' is accountable for quality. You don't toss code over the wall to QA."
    },
    {
      id: 76,
      domain: 'process',
      task: 'Task 3: Manage risks',
      approach: 'predictive',
      question: "You want to evaluate risks by looking at their Strengths, Weaknesses, Opportunities, and Threats. What tool is this?",
      options: [
        "Monte Carlo Analysis",
        "SWOT Analysis",
        "Decision Tree",
        "Tornado Diagram"
      ],
      correct: 1,
      explanation: "ECO Task: Manage risks. SWOT Analysis is a classic identification technique for both positive (Opportunities) and negative (Threats) risks."
    },
    {
      id: 77,
      domain: 'people',
      task: 'Task 1: Manage conflict',
      approach: 'predictive',
      question: "A conflict arises. You decide to separate the parties to let them cool down. What technique is this?",
      options: [
        "Smooth/Accommodate",
        "Withdraw/Avoid",
        "Force/Direct",
        "Compromise"
      ],
      correct: 1,
      explanation: "ECO Task: Manage conflict. Stepping away or postponing the issue is 'Withdraw/Avoid'. It is temporary."
    },
    {
      id: 78,
      domain: 'process',
      task: 'Task 11: Procurement',
      approach: 'predictive',
      question: "The project is done. The product is accepted. What must you do to close the procurement?",
      options: [
        "Stop paying the vendor",
        "Send a letter of thanks",
        "Provide formal written notice that the contract is complete",
        "Archive the emails"
      ],
      correct: 2,
      explanation: "ECO Task: Procurement. Contracts are legal documents. They require formal written notice of completion/closure to limit liability."
    },
    {
      id: 79,
      domain: 'people',
      task: 'Task 6: Build a team',
      approach: 'agile',
      question: "Your team is 'Performing'. As a PM/Servant Leader, what is your role now?",
      options: [
        "Direct their daily work",
        "Delegate and facilitate/monitor",
        "Leave them alone completely",
        "Go back to Storming"
      ],
      correct: 1,
      explanation: "ECO Task: Build a team. In the Performing stage, the team is autonomous. You Delegate and Facilitate (remove impediments), but you do not micromanage."
    },
    {
      id: 80,
      domain: 'process',
      task: 'Task 4: Engage stakeholders',
      approach: 'hybrid',
      question: "You are prioritizing the backlog. A stakeholder demands their feature be #1. Another stakeholder demands theirs. What do you do?",
      options: [
        "Do the easiest one first",
        "Ask the Sponsor to decide",
        "Facilitate a negotiation based on Value and ROI",
        "Flip a coin"
      ],
      correct: 2,
      explanation: "ECO Task: Engage stakeholders. Decisions should be based on data (Value/ROI). Facilitate the conversation so they see whose feature brings more value to the org."
    },

    {
      id: 81,
      domain: 'process',
      task: 'Task 3: Manage risks',
      approach: 'predictive',
      question: "You implemented a risk response plan to install a firewall. However, the firewall slowed down the system significantly. What is this new problem called?",
      options: [
        "Residual Risk",
        "Secondary Risk",
        "Workaround",
        "Fallout"
      ],
      correct: 1,
      explanation: "ECO Task: Manage risks. A 'Secondary Risk' is a risk that arises as a direct result of implementing a risk response."
    },
    {
      id: 82,
      domain: 'people',
      task: 'Task 16: Knowledge transfer',
      approach: 'agile',
      question: "A senior developer is the only one who knows the legacy code. They are retiring in 1 month. What is the best agile technique to transfer this knowledge?",
      options: [
        "Ask them to write a manual",
        "Pair Programming (Pairing)",
        "Record them coding",
        "Hire a replacement immediately"
      ],
      correct: 1,
      explanation: "ECO Task: Knowledge transfer. Pairing allows the senior dev to transfer tacit knowledge and techniques in real-time to other team members."
    },
    {
      id: 83,
      domain: 'business',
      task: 'Task 2: Deliver value',
      approach: 'predictive',
      question: "You have spent $1M on a project. You realize the market has shifted and the product will have zero value. What should you do?",
      options: [
        "Finish the project because you already spent $1M (Sunk Cost)",
        "Recommend terminating the project",
        "Reduce scope to save money",
        "Launch anyway to see what happens"
      ],
      correct: 1,
      explanation: "ECO Task: Deliver value. Sunk Costs ($1M) should not influence future decisions. If the Value is zero, stop spending. Terminate."
    },
    {
      id: 84,
      domain: 'process',
      task: 'Task 7: Manage quality',
      approach: 'predictive',
      question: "The team is checking if the deliverables meet the specific requirements (measuring dimensions, testing code). What process is this?",
      options: [
        "Manage Quality (QA)",
        "Control Quality (QC)",
        "Plan Quality",
        "Define Scope"
      ],
      correct: 1,
      explanation: "ECO Task: Manage quality. Inspecting the actual product/deliverable is Control Quality (QC). Checking the *process* is Manage Quality (QA)."
    },
    {
      id: 85,
      domain: 'process',
      task: 'Task 6: Manage schedule',
      approach: 'agile',
      question: "The team's average velocity is 20 points. For the next sprint, the Product Owner wants to assign 30 points of work. What should the Scrum Master do?",
      options: [
        "Accept the 30 points",
        "Ask the team to work overtime",
        "Remind the Product Owner that velocity is based on historical data and the team selects their own workload",
        "Change the story point values"
      ],
      correct: 2,
      explanation: "ECO Task: Manage schedule. Agile relies on empirical data (velocity). Forcing more work than historical capacity leads to burnout and poor quality."
    },
    {
      id: 86,
      domain: 'process',
      task: 'Task 8: Plan scope',
      approach: 'predictive',
      question: "A team member adds extra features that were not requested 'just to be nice'. What is this called?",
      options: [
        "Scope Creep",
        "Gold Plating",
        "Value Engineering",
        "Kaizen"
      ],
      correct: 1,
      explanation: "ECO Task: Plan scope. Adding unrequested features is 'Gold Plating'. It wastes resources and adds risk. Do not do it."
    },
    {
      id: 87,
      domain: 'people',
      task: 'Task 2: Lead a team',
      approach: 'hybrid',
      question: "You are leading a team with members from Japan, Brazil, and Germany. Misunderstandings are frequent due to communication styles. What should you do?",
      options: [
        "Force everyone to use one style",
        "Conduct cultural awareness training and establish team communication norms",
        "Ignore it",
        "Replace the team"
      ],
      correct: 1,
      explanation: "ECO Task: Lead a team. Cultural awareness is part of the 'People' domain. Training and establishing ground rules help bridge gaps."
    },
    {
      id: 88,
      domain: 'process',
      task: 'Task 11: Procurement',
      approach: 'predictive',
      question: "A vendor claims they performed extra work and wants payment. You disagree. What is the first thing to check?",
      options: [
        "The Contract",
        "The Invoice",
        "The Sponsor",
        "The Lawyer"
      ],
      correct: 0,
      explanation: "ECO Task: Procurement. The Contract is the source of truth. Does it allow for this work? Was it approved? Claims administration starts with the contract."
    },
    {
      id: 89,
      domain: 'process',
      task: 'Task 5: Manage budget/resources',
      approach: 'hybrid',
      question: "A critical resource is double-booked on two projects. What technique helps you resolve this schedule conflict?",
      options: [
        "Resource Leveling",
        "Fast Tracking",
        "Crashing",
        "Monte Carlo"
      ],
      correct: 0,
      explanation: "ECO Task: Manage resources. Resource Leveling adjusts the schedule to deal with resource constraints (often extending the timeline)."
    },
    {
      id: 90,
      domain: 'process',
      task: 'Task 9: Integration',
      approach: 'predictive',
      question: "You are in the 'Direct and Manage Project Work' process. What is the primary output you are producing?",
      options: [
        "The Project Plan",
        "Deliverables",
        "The Charter",
        "The WBS"
      ],
      correct: 1,
      explanation: "ECO Task: Integration. The main purpose of 'doing the work' (Execution) is to produce the Deliverables (the product)."
    },
    {
      id: 91,
      domain: 'process',
      task: 'Task 10: Manage changes',
      approach: 'agile',
      question: "The team wants to change the way they run the Daily Scrum because it takes too long. When is the right time to discuss this change?",
      options: [
        "Sprint Review",
        "Sprint Retrospective",
        "Sprint Planning",
        "Daily Scrum"
      ],
      correct: 1,
      explanation: "ECO Task: Manage changes. The Retrospective is specifically for inspecting and adapting the PROCESS and team interactions."
    },
    {
      id: 92,
      domain: 'process',
      task: 'Task 10: Manage changes',
      approach: 'predictive',
      question: "An emergency occurs (fire, flood, safety breach). Immediate action is required. There is no time for the Change Control Board (CCB). What do you do?",
      options: [
        "Do nothing until CCB meets",
        "Act immediately to protect safety/assets, then document and submit the Change Request retroactively",
        "Call the sponsor",
        "Guess"
      ],
      correct: 1,
      explanation: "ECO Task: Manage changes. In emergencies, protection of life/safety comes first. Act, then follow up with the formal process."
    },
    {
      id: 93,
      domain: 'business',
      task: 'Task 1: Compliance',
      approach: 'predictive',
      question: "An internal auditor wants to see if your project is following the organization's policies. What do you provide?",
      options: [
        "Access to project documents and processes",
        "A summary report only",
        "Deny access",
        "Ask them to wait until the project is done"
      ],
      correct: 0,
      explanation: "ECO Task: Compliance. Audits ensure compliance. You must provide transparency and access to the requested evidence."
    },
    {
      id: 94,
      domain: 'people',
      task: 'Task 11: Virtual teams',
      approach: 'agile',
      question: "To encourage collaboration in a distributed agile team, you create an 'always-on' video conference link where people can work together if they choose. What is this concept called?",
      options: [
        "Fishbowl window / Remote pairing",
        "Micromanagement",
        "Spyware",
        "Virtual Reality"
      ],
      correct: 0,
      explanation: "ECO Task: Virtual teams. A 'Fishbowl' or open channel simulates sitting in the same room, reducing friction for spontaneous collaboration."
    },
    {
      id: 95,
      domain: 'process',
      task: 'Task 5: Manage budget',
      approach: 'predictive',
      question: "You are over budget. You need to calculate the efficiency required for the remaining work to finish within the original budget. What formula do you use?",
      options: [
        "CPI",
        "TCPI (To-Complete Performance Index)",
        "SPI",
        "CV"
      ],
      correct: 1,
      explanation: "ECO Task: Manage budget. TCPI calculates the performance needed to meet a goal (BAC or EAC). TCPI > 1 means you must work harder/cheaper."
    },
    {
      id: 96,
      domain: 'process',
      task: 'Task 8: Plan scope (Prioritization)',
      approach: 'agile',
      question: "The Product Owner is prioritizing the backlog. Which factor is LEAST important?",
      options: [
        "Business Value",
        "Risk",
        "Dependencies",
        "The Project Manager's personal preference"
      ],
      correct: 3,
      explanation: "ECO Task: Plan scope. Prioritization is based on Value, Risk, Cost of Delay, and Dependencies. The PM's opinion is not a primary factor."
    },
    {
      id: 97,
      domain: 'process',
      task: 'Task 6: Manage schedule',
      approach: 'predictive',
      question: "You want to wait 3 days after pouring concrete before painting. This waiting time is called:",
      options: [
        "Lead",
        "Lag",
        "Float",
        "Slack"
      ],
      correct: 1,
      explanation: "ECO Task: Manage schedule. 'Lag' is a directed delay between activities (Wait time). 'Lead' is acceleration (overlap)."
    },
    {
      id: 98,
      domain: 'people',
      task: 'Task 9: Collaborate with stakeholders',
      approach: 'predictive',
      question: "You identify a stakeholder who is 'Unaware' of the project. Your goal is to make them 'Supportive'. Where do you document this strategy?",
      options: [
        "Stakeholder Engagement Assessment Matrix",
        "Risk Register",
        "Resource Calendar",
        "Issue Log"
      ],
      correct: 0,
      explanation: "ECO Task: Collaborate with stakeholders. The SEAM tracks Current (C) vs Desired (D) engagement levels."
    },
    {
      id: 99,
      domain: 'process',
      task: 'Task 17: Transitions',
      approach: 'hybrid',
      question: "The project is delivering a new software tool. What is critical to ensure the Operations team can support it after you leave?",
      options: [
        "Knowledge Transfer and Training",
        "Give them the password",
        "Wish them luck",
        "Keep the project team on standby forever"
      ],
      correct: 0,
      explanation: "ECO Task: Transitions. Operational readiness requires training, documentation, and knowledge transfer before the project closes."
    },
    {
      id: 100,
      domain: 'process',
      task: 'Task 3: Manage risks',
      approach: 'predictive',
      question: "A risk has a very low probability and low impact. You decide not to take active action but to monitor it. Where do you put it?",
      options: [
        "The Watchlist",
        "The Trash",
        "The Issue Log",
        "The Scope Statement"
      ],
      correct: 0,
      explanation: "ECO Task: Manage risks. Low priority risks are placed on a Watchlist and reviewed periodically to see if they change."
    },
    {
      id: 101,
      domain: 'process',
      task: 'Task 12: Manage artifacts',
      approach: 'agile',
      question: "A big visible chart on the wall showing the project progress is an example of:",
      options: [
        "Information Radiator",
        "Secret Data",
        "Dashboarding",
        "Micro-management"
      ],
      correct: 0,
      explanation: "ECO Task: Manage artifacts. 'Information Radiators' (like Kanban boards or Burndown charts) broadcast info to anyone walking by."
    },
    {
      id: 102,
      domain: 'process',
      task: 'Task 7: Manage quality',
      approach: 'predictive',
      question: "The Quality Assurance department comes to audit your project to see if you are following the company's quality policies. This is an example of:",
      options: [
        "Manage Quality",
        "Control Quality",
        "Plan Quality",
        "Scope Definition"
      ],
      correct: 0,
      explanation: "ECO Task: Manage quality. Audits of the *process* fall under Manage Quality (QA). Testing the *product* is Control Quality (QC)."
    },
    {
      id: 103,
      domain: 'business',
      task: 'Task 2: Deliver benefits',
      approach: 'predictive',
      question: "The project is closed. Who is responsible for measuring the long-term business benefits (ROI) realized from the project?",
      options: [
        "The Project Manager",
        "The Project Team",
        "Operations / Business Owner",
        "The Vendor"
      ],
      correct: 2,
      explanation: "ECO Task: Deliver benefits. Benefits often accrue long after the project closes. The Business Owner or Operations tracks this, not the temporary PM."
    },
    {
      id: 104,
      domain: 'people',
      task: 'Task 6: Build a team',
      approach: 'agile',
      question: "Agile teams prefer members who have a deep specialty but also broad general skills. This is called:",
      options: [
        "T-Shaped Skills",
        "I-Shaped Skills",
        "Generalists",
        "Specialists"
      ],
      correct: 0,
      explanation: "ECO Task: Build a team. T-Shaped people can help out in areas outside their specialty, reducing bottlenecks."
    },
    {
      id: 105,
      domain: 'process',
      task: 'Task 8: Plan scope',
      approach: 'predictive',
      question: "The technique of breaking down the project scope into smaller, manageable parts is called:",
      options: [
        "Decomposition",
        "Analysis",
        "Slicing",
        "Crashing"
      ],
      correct: 0,
      explanation: "ECO Task: Plan scope. Decomposition creates the WBS (Work Breakdown Structure)."
    },
    {
      id: 106,
      domain: 'people',
      task: 'Task 2: Lead a team',
      approach: 'agile',
      question: "Management keeps interrupting the team with 'urgent' requests during the sprint. The Scrum Master steps in to stop this. This is called:",
      options: [
        "Shielding the team",
        "Insubordination",
        "Gatekeeping",
        "Risk Management"
      ],
      correct: 0,
      explanation: "ECO Task: Lead a team. One of the SM's key servant leadership duties is shielding the team from distractions to preserve focus."
    },
    {
      id: 107,
      domain: 'process',
      task: 'Task 17: Closure',
      approach: 'predictive',
      question: "The final deliverable is accepted. What is the LAST thing the PM does before leaving the project?",
      options: [
        "Release the Resources",
        "Update the Resume",
        "Throw a party",
        "Pay the bills"
      ],
      correct: 0,
      explanation: "ECO Task: Closure. After all admin/lessons learned/archiving is done, the very last step is releasing the resources (team) to other projects."
    },
    {
      id: 108,
      domain: 'process',
      task: 'Task 2: Manage communications',
      approach: 'predictive',
      question: "You upload a document to a SharePoint server and tell people to read it. What communication method is this?",
      options: [
        "Pull",
        "Push",
        "Interactive",
        "Direct"
      ],
      correct: 0,
      explanation: "ECO Task: Manage communications. Placing info for others to retrieve at their leisure is 'Pull'. Emailing it to them is 'Push'."
    },
    {
      id: 109,
      domain: 'process',
      task: 'Task 3: Manage risks',
      approach: 'predictive',
      question: "You identify an Opportunity (Positive Risk) to finish early. You partner with another company to make sure it happens. This strategy is:",
      options: [
        "Share",
        "Exploit",
        "Enhance",
        "Accept"
      ],
      correct: 0,
      explanation: "ECO Task: Manage risks. Partnering/Joint Ventures to capture an opportunity is 'Sharing' (unlike 'Transfer' for threats)."
    },
    {
      id: 110,
      domain: 'people',
      task: 'Task 1: Manage conflict',
      approach: 'predictive',
      question: "Conflict is inevitable. Which statement is TRUE about conflict in projects?",
      options: [
        "It should be avoided at all costs",
        "It can be beneficial if managed well (Creative friction)",
        "It is always the PM's fault",
        "It means the team is bad"
      ],
      correct: 1,
      explanation: "ECO Task: Manage conflict. Constructive conflict (ideas, approaches) leads to better solutions. Personal conflict is bad."
    },
    {
      id: 111,
      domain: 'process',
      task: 'Task 6: Manage schedule (Estimation)',
      approach: 'agile',
      question: "The team uses cards with Fibonacci numbers (1, 2, 3, 5, 8...) to estimate user stories. This game is called:",
      options: [
        "Planning Poker",
        "Monte Carlo",
        "Tarot",
        "Blackjack"
      ],
      correct: 0,
      explanation: "ECO Task: Manage schedule. Planning Poker is a consensus-based estimation technique to size stories relatively."
    },
    {
      id: 112,
      domain: 'process',
      task: 'Task 5: Manage resources',
      approach: 'predictive',
      question: "You adjust the schedule to ensure no resource is working overtime, even if it delays the project end date. This is:",
      options: [
        "Resource Leveling",
        "Resource Smoothing",
        "Fast Tracking",
        "Crashing"
      ],
      correct: 0,
      explanation: "ECO Task: Manage resources. Leveling honors resource constraints over schedule constraints (can extend critical path). Smoothing honors the end date (uses float)."
    },
    {
      id: 113,
      domain: 'process',
      task: 'Task 1: Execute with urgency',
      approach: 'agile',
      question: "You are building a product. You decide to launch with just enough features to satisfy early customers and provide feedback. This version is called:",
      options: [
        "MVP (Minimum Viable Product)",
        "Prototype",
        "Alpha",
        "Beta"
      ],
      correct: 0,
      explanation: "ECO Task: Execute with urgency. MVP focuses on the smallest thing that delivers value and generates learning."
    },
    {
      id: 114,
      domain: 'people',
      task: 'Task 8: Negotiate agreements',
      approach: 'predictive',
      question: "You are negotiating with a seller. They want $100k. You want to pay $80k. You offer $90k and they accept. This is:",
      options: [
        "Compromise",
        "Collaboration",
        "Forcing",
        "Smoothing"
      ],
      correct: 0,
      explanation: "ECO Task: Negotiate agreements. Meeting in the middle where both give up something is Compromise."
    },
    {
      id: 115,
      domain: 'process',
      task: 'Task 16: Knowledge transfer',
      approach: 'predictive',
      question: "Where do you document lessons learned *during* the project vs *after* the project?",
      options: [
        "During: Lessons Learned Register; After: Lessons Learned Repository",
        "During: Repository; After: Register",
        "During: Issue Log; After: Risk Register",
        "During: Notebook; After: Shredder"
      ],
      correct: 0,
      explanation: "ECO Task: Knowledge transfer. The Register is the living document for the current project. At closing, it updates the corporate Repository."
    },
    {
      id: 116,
      domain: 'people',
      task: 'Task 7: Impediments',
      approach: 'agile',
      question: "During the Daily Scrum, two developers start solving a complex technical problem. The meeting runs over time. What should the SM do?",
      options: [
        "Let them finish, it's important",
        "Ask them to take it 'offline' (Sidebar) and continue the standup",
        "Cancel the meeting",
        "Join the discussion"
      ],
      correct: 1,
      explanation: "ECO Task: Remove impediments. The Daily Scrum is for status/coordination, not problem solving. Deep dives happen after the meeting."
    },
    {
      id: 117,
      domain: 'process',
      task: 'Task 11: Procurement',
      approach: 'predictive',
      question: "You are deciding whether to build a module in-house or buy it from a vendor. You calculate the costs of both. This is:",
      options: [
        "Make-or-Buy Analysis",
        "SWOT Analysis",
        "Cost-Benefit Analysis",
        "Root Cause Analysis"
      ],
      correct: 0,
      explanation: "ECO Task: Procurement. Make-or-Buy analysis compares the cost/risk of internal vs external execution."
    },
    {
      id: 118,
      domain: 'process',
      task: 'Task 4: Engage stakeholders',
      approach: 'predictive',
      question: "Which document contains the stakeholders' names, roles, and contact info? Which document contains the *strategy* to manage them?",
      options: [
        "Register; Engagement Plan",
        "Engagement Plan; Register",
        "Charter; Plan",
        "Matrix; Log"
      ],
      correct: 0,
      explanation: "ECO Task: Engage stakeholders. The Register identifies WHO. The Plan defines HOW (strategy)."
    },
    {
      id: 119,
      domain: 'process',
      task: 'Task 13: Methodology',
      approach: 'hybrid',
      question: "Your project has both hardware (waterfall) and software (agile) components. How do you report progress to leadership?",
      options: [
        "Two separate reports",
        "Unified report showing milestone status (Predictive) and feature burnup (Agile)",
        "Only report the hardware",
        "Guess percentage complete"
      ],
      correct: 1,
      explanation: "ECO Task: Methodology. In Hybrid, you must aggregate disparate metrics into a unified view of 'Value Delivered' for leadership."
    },
    {
      id: 120,
      domain: 'process',
      task: 'Task 8: Plan scope',
      approach: 'predictive',
      question: "The client formally signs off on the acceptance of the deliverables. Which process is this?",
      options: [
        "Validate Scope",
        "Close Project",
        "Control Quality",
        "Collect Requirements"
      ],
      correct: 0,
      explanation: "ECO Task: Plan scope. Validate Scope is where the CUSTOMER accepts the deliverables (Sign-off). Control Quality is internal testing."
    },
    {
      id: 121,
      domain: 'process',
      task: 'Task 8: Plan scope',
      approach: 'agile',
      question: "The team meets mid-sprint to break down upcoming stories and estimate them for the NEXT sprint. This activity is:",
      options: [
        "Backlog Refinement (Grooming)",
        "Sprint Planning",
        "Sprint Review",
        "Daily Scrum"
      ],
      correct: 0,
      explanation: "ECO Task: Plan scope. Refinement prepares the backlog for the *next* sprint. It is an ongoing activity, not a formal event."
    },
    {
      id: 122,
      domain: 'process',
      task: 'Task 5: Manage budget',
      approach: 'predictive',
      question: "You estimate the cost of every single activity and roll them up to get the total project budget. This is:",
      options: [
        "Bottom-Up Estimating",
        "Top-Down Estimating",
        "Parametric Estimating",
        "Analogous Estimating"
      ],
      correct: 0,
      explanation: "ECO Task: Manage budget. Bottom-up is the most accurate but most time-consuming method."
    },
    {
      id: 123,
      domain: 'business',
      task: 'Task 4: Organizational change',
      approach: 'predictive',
      question: "You work in a 'Projectized' organization. What power does the PM have?",
      options: [
        "High to Almost Total",
        "Low",
        "None",
        "Balanced"
      ],
      correct: 0,
      explanation: "ECO Task: Organizational change. In Projectized orgs, the PM is the boss. In Functional orgs, the PM has little power."
    },
    {
      id: 124,
      domain: 'people',
      task: 'Task 2: Lead a team',
      approach: 'predictive',
      question: "According to Herzberg's theory, things like salary and safety are 'Hygiene Factors'. They do not motivate, but their absence causes dissatisfaction. What actually motivates?",
      options: [
        "Achievement, Recognition, Responsibility",
        "More Money",
        "Free Food",
        "Corner Office"
      ],
      correct: 0,
      explanation: "ECO Task: Lead a team. Herzberg's 'Motivators' are intrinsic: growth, achievement, and recognition."
    },
    {
      id: 125,
      domain: 'process',
      task: 'Task 3: Manage risks',
      approach: 'predictive',
      question: "You rank risks as 'High, Medium, Low'. This is:",
      options: [
        "Qualitative Risk Analysis",
        "Quantitative Risk Analysis",
        "Risk Identification",
        "Risk Response"
      ],
      correct: 0,
      explanation: "ECO Task: Manage risks. Qualitative is subjective (H/M/L). Quantitative uses numbers/data (Monte Carlo, EMV)."
    },
    {
      id: 126,
      domain: 'process',
      task: 'Task 7: Manage quality (Agile)',
      approach: 'agile',
      question: "In the Retrospective, the team decides to start using automated testing to reduce bugs. This is an example of:",
      options: [
        "Kaizen / Continuous Improvement",
        "Scope Creep",
        "Gold Plating",
        "Compliance"
      ],
      correct: 0,
      explanation: "ECO Task: Manage quality. Agile teams constantly inspect and adapt (Kaizen) to improve their processes."
    },
    {
      id: 127,
      domain: 'process',
      task: 'Task 6: Manage schedule',
      approach: 'predictive',
      question: "You add extra resources to the critical path to finish faster. Costs go up. This is:",
      options: [
        "Crashing",
        "Fast Tracking",
        "Leveling",
        "Smoothing"
      ],
      correct: 0,
      explanation: "ECO Task: Manage schedule. Crashing = trading money for time (adding people). Fast Tracking = trading risk for time (parallel work)."
    },
    {
      id: 128,
      domain: 'process',
      task: 'Task 2: Manage communications',
      approach: 'predictive',
      question: "You verify that the right information was received and understood by the stakeholders. This is part of:",
      options: [
        "Monitor Communications",
        "Plan Communications",
        "Manage Communications",
        "Identify Stakeholders"
      ],
      correct: 0,
      explanation: "ECO Task: Manage communications. Monitoring ensures the communication strategy is actually working."
    },
    {
      id: 129,
      domain: 'process',
      task: 'Task 8: Plan scope',
      approach: 'hybrid',
      question: "Can you have a WBS in a Hybrid project?",
      options: [
        "Yes, for the predictive parts and high-level agile deliverables",
        "No, Agile forbids WBS",
        "Only for costs",
        "Only if the Sponsor asks"
      ],
      correct: 0,
      explanation: "ECO Task: Plan scope. Yes. The WBS organizes the total scope. Agile 'Epics' and 'Features' can sit within a WBS hierarchy."
    },
    {
      id: 130,
      domain: 'people',
      task: 'Task 9: Stakeholders',
      approach: 'predictive',
      question: "A stakeholder has High Power and High Interest. How do you manage them?",
      options: [
        "Manage Closely",
        "Keep Informed",
        "Keep Satisfied",
        "Monitor"
      ],
      correct: 0,
      explanation: "ECO Task: Engage stakeholders. High/High stakeholders are key players. You must partner with them and manage them closely."
    },

    {
      id: 131,
      domain: 'process',
      task: 'Task 6: Manage schedule',
      approach: 'agile',
      question: "The team has a velocity of 20. The Product Owner insists on adding a story sized at 8 points to the current sprint, which is half over. What is the likely result?",
      options: [
        "The team will work harder and finish it",
        "The sprint goal will be endangered",
        "The velocity will increase to 28",
        "The Scrum Master will approve it"
      ],
      correct: 1,
      explanation: "ECO Task: Manage schedule. Adding scope mid-sprint without removing other work endangers the commitment/Sprint Goal. Scope in a sprint is fixed (mostly)."
    },
    {
      id: 132,
      domain: 'people',
      task: 'Task 3: Support team',
      approach: 'hybrid',
      question: "You are moving from a Command-and-Control environment to Servant Leadership. A team member asks, 'What should I do today?' How do you answer?",
      options: [
        "Give them a task list",
        "Ask them: 'What do you think is the most important thing to work on right now?'",
        "Tell them to ask the client",
        "Ignore them"
      ],
      correct: 1,
      explanation: "ECO Task: Support team. Servant leaders coach the team toward self-management rather than directing tasks."
    },
    {
      id: 133,
      domain: 'process',
      task: 'Task 12: Artifacts',
      approach: 'agile',
      question: "Which chart shows how much work remains in the backlog compared to time remaining?",
      options: [
        "Burndown Chart",
        "Gantt Chart",
        "Control Chart",
        "Pareto Chart"
      ],
      correct: 0,
      explanation: "ECO Task: Manage artifacts. A Burndown chart tracks 'Work Remaining' on the Y-axis and 'Time' on the X-axis."
    },
    {
      id: 134,
      domain: 'process',
      task: 'Task 3: Manage risks',
      approach: 'predictive',
      question: "You buy a lottery ticket for the project team. If you win, you will fund a party. This is an example of:",
      options: [
        "Pure Risk",
        "Speculative Risk",
        "Issue",
        "Assumption"
      ],
      correct: 1,
      explanation: "ECO Task: Manage risks. Speculative risks can result in gain or loss. Pure risks (like fire/theft) only result in loss."
    },
    {
      id: 135,
      domain: 'process',
      task: 'Task 10: Changes',
      approach: 'predictive',
      question: "The Change Control Board (CCB) rejects a change request from a senior stakeholder. The stakeholder is angry and calls you. What do you do?",
      options: [
        "Implement the change anyway",
        "Explain the CCB's decision and the impact analysis that led to the rejection",
        "Blame the CCB",
        "Resubmit the request immediately"
      ],
      correct: 1,
      explanation: "ECO Task: Manage changes. You must communicate the decision and the *data* behind it. Do not bypass the process."
    },
    {
      id: 136,
      domain: 'people',
      task: 'Task 4: Empower team',
      approach: 'agile',
      question: "Who determines how many user stories can be completed in a Sprint?",
      options: [
        "The Product Owner",
        "The Scrum Master",
        "The Developers (The Team)",
        "The Project Manager"
      ],
      correct: 2,
      explanation: "ECO Task: Empower team. Only the people doing the work (The Team) can decide how much work they can pull into the sprint."
    },
    {
      id: 137,
      domain: 'process',
      task: 'Task 7: Quality',
      approach: 'predictive',
      question: "80% of your defects are caused by 20% of the root causes. Which tool shows this?",
      options: [
        "Pareto Chart",
        "Scatter Diagram",
        "Fishbone Diagram",
        "Flowchart"
      ],
      correct: 0,
      explanation: "ECO Task: Manage quality. The Pareto Chart (histogram) implements the 80/20 rule to help you focus on the vital few problems."
    },
    {
      id: 138,
      domain: 'business',
      task: 'Task 1: Compliance',
      approach: 'predictive',
      question: "Your project involves handling sensitive personal data. You realize midway that you are violating GDPR. What is the immediate risk?",
      options: [
        "Schedule delay",
        "Cost overrun",
        "Legal/Regulatory penalties and reputation damage",
        "Scope creep"
      ],
      correct: 2,
      explanation: "ECO Task: Compliance. Regulatory breaches carry heavy legal and reputational risks, often stopping the project entirely."
    },
    {
      id: 139,
      domain: 'process',
      task: 'Task 1: Execute',
      approach: 'agile',
      question: "The 'Cone of Uncertainty' suggests that estimates are:",
      options: [
        "Perfect at the start of the project",
        "Highly uncertain at the start and get more accurate over time",
        "Always wrong",
        "Not needed in Agile"
      ],
      correct: 1,
      explanation: "ECO Task: Execute. As you learn more (progressive elaboration), uncertainty decreases and estimates become more accurate."
    },
    {
      id: 140,
      domain: 'people',
      task: 'Task 14: Emotional Intelligence',
      approach: 'hybrid',
      question: "A stakeholder is yelling at you because the project is late. You stay calm, listen, and do not get defensive. You are practicing:",
      options: [
        "Self-Regulation",
        "Motivation",
        "Social Skills",
        "Apathy"
      ],
      correct: 0,
      explanation: "ECO Task: Emotional Intelligence. Self-Regulation is the ability to control disruptive impulses and moods."
    },
    {
      id: 141,
      domain: 'process',
      task: 'Task 5: Budget',
      approach: 'predictive',
      question: "What is the S-Curve?",
      options: [
        "A graph showing cumulative costs (PV, EV, AC) over time",
        "A risk analysis tool",
        "A quality metric",
        "The team's mood"
      ],
      correct: 0,
      explanation: "ECO Task: Manage budget. The S-Curve visually tracks the budget (PV) and progress (EV) over the life of the project."
    },
    {
      id: 142,
      domain: 'process',
      task: 'Task 11: Procurement',
      approach: 'agile',
      question: "In an Agile contract, how do you handle scope changes?",
      options: [
        "Charge a penalty for every change",
        "Use a 'Money for Nothing, Change for Free' clause",
        "Refuse all changes",
        "Switch to Fixed Price"
      ],
      correct: 1,
      explanation: "ECO Task: Procurement. Agile contracts often allow swapping features of equal value for free, or cancelling early for a shared benefit."
    },
    {
      id: 143,
      domain: 'people',
      task: 'Task 1: Conflict',
      approach: 'predictive',
      question: "You are the PM. You make a decision and say, 'Because I am the project manager, we will do it this way.' What power are you using?",
      options: [
        "Expert Power",
        "Referent Power",
        "Formal (Legitimate) Power",
        "Reward Power"
      ],
      correct: 2,
      explanation: "ECO Task: Lead a team. Formal/Legitimate power comes from your title. It is generally one of the less effective forms of leadership."
    },
    {
      id: 144,
      domain: 'process',
      task: 'Task 9: Integration',
      approach: 'predictive',
      question: "Which document authorizes the existence of the project and gives the PM authority?",
      options: [
        "Project Management Plan",
        "Project Charter",
        "Business Case",
        "Contract"
      ],
      correct: 1,
      explanation: "ECO Task: Integration. The Charter is the birth certificate of the project."
    },
    {
      id: 145,
      domain: 'process',
      task: 'Task 6: Schedule',
      approach: 'predictive',
      question: "You have a task with Optimistic=2, Most Likely=5, Pessimistic=14. Using Beta (PERT) distribution, what is the estimate?",
      options: [
        "5",
        "6",
        "7",
        "8"
      ],
      correct: 1,
      explanation: "ECO Task: Schedule. Formula: (O + 4M + P) / 6. (2 + 20 + 14) / 6 = 36 / 6 = 6."
    },
    {
      id: 146,
      domain: 'process',
      task: 'Task 8: Scope',
      approach: 'agile',
      question: "A user story format usually looks like:",
      options: [
        "As a <role>, I want <feature>, so that <benefit>",
        "Do X by Y date",
        "Feature: Login",
        "Requirement 1.0"
      ],
      correct: 0,
      explanation: "ECO Task: Plan scope. The 'As a... I want... So that...' format ensures we understand the user and the value/benefit."
    },
    {
      id: 147,
      domain: 'process',
      task: 'Task 13: Methodology',
      approach: 'agile',
      question: "What is the primary measure of progress in Agile?",
      options: [
        "Percent complete of documentation",
        "Working Software / Product",
        "Hours spent",
        "Milestones met"
      ],
      correct: 1,
      explanation: "ECO Task: Methodology. Agile Principle: 'Working software is the primary measure of progress.'"
    },
    {
      id: 148,
      domain: 'process',
      task: 'Task 3: Risks',
      approach: 'predictive',
      question: "You have a 50% chance of losing $10,000. What is the EMV (Expected Monetary Value)?",
      options: [
        "-$10,000",
        "-$5,000",
        "$5,000",
        "$0"
      ],
      correct: 1,
      explanation: "ECO Task: Manage risks. EMV = Probability * Impact. 0.50 * -$10,000 = -$5,000."
    },
    {
      id: 149,
      domain: 'people',
      task: 'Task 5: Training',
      approach: 'hybrid',
      question: "The team doesn't understand how to use the new hybrid dashboard. You organize a 'Lunch and Learn'. This is:",
      options: [
        "Formal Training",
        "Informal Training / Knowledge Sharing",
        "A waste of time",
        "Procurement"
      ],
      correct: 1,
      explanation: "ECO Task: Ensure training. Training doesn't have to be a paid course. Informal sessions are highly effective."
    },
    {
      id: 150,
      domain: 'process',
      task: 'Task 2: Communications',
      approach: 'predictive',
      question: "Which meeting is generally NOT part of a Predictive/Waterfall project?",
      options: [
        "Kick-off",
        "Status Meeting",
        "Daily Standup",
        "Steering Committee"
      ],
      correct: 2,
      explanation: "ECO Task: Communications. The 'Daily Standup' is specific to Agile/Scrum. Waterfall usually relies on weekly status meetings."
    },
    {
      id: 151,
      domain: 'process',
      task: 'Task 17: Closure',
      approach: 'predictive',
      question: "To close the project, you need formal acceptance from the customer. They refuse to sign because of a tiny defect that was not in the requirements. What do you do?",
      options: [
        "Fix it for free",
        "Show them the Requirements Traceability Matrix proving it was not in scope",
        "Sign it yourself",
        "Keep the project open forever"
      ],
      correct: 1,
      explanation: "ECO Task: Closure/Scope. Acceptance is based on the agreed-upon scope/requirements. If it wasn't in the requirements, it's not a valid reason to reject the project (though you might negotiate a separate small contract to fix it)."
    },
    {
      id: 152,
      domain: 'people',
      task: 'Task 6: Build a team',
      approach: 'agile',
      question: "Osmotic Communication happens best when:",
      options: [
        "The team is co-located in the same room",
        "Everyone works from home",
        "You use email",
        "You use a megaphone"
      ],
      correct: 0,
      explanation: "ECO Task: Build a team. Osmotic communication is picking up information by overhearing background conversations in a shared space."
    },
    {
      id: 153,
      domain: 'process',
      task: 'Task 4: Stakeholders',
      approach: 'predictive',
      question: "A stakeholder suggests a change. You realize this change will negatively impact another stakeholder. What do you do?",
      options: [
        "Do it anyway",
        "Facilitate a discussion between the stakeholders to align needs",
        "Reject it immediately",
        "Hide the impact"
      ],
      correct: 1,
      explanation: "ECO Task: Engage stakeholders. The PM's job is to balance competing stakeholder interests through facilitation."
    },
    {
      id: 154,
      domain: 'business',
      task: 'Task 3: External environment',
      approach: 'hybrid',
      question: "A new technology appears that makes your current product obsolete. This is a form of:",
      options: [
        "Disruptive Change",
        "Internal Risk",
        "Scope Creep",
        "Compliance"
      ],
      correct: 0,
      explanation: "ECO Task: External environment. Disruption often comes from external technology shifts requiring a Pivot."
    },
    {
      id: 155,
      domain: 'process',
      task: 'Task 15: Issues',
      approach: 'predictive',
      question: "Root Cause Analysis often uses 'The 5 Whys'. What is the goal?",
      options: [
        "To find who to blame",
        "To annoy the team",
        "To get past symptoms to the underlying cause",
        "To spend time"
      ],
      correct: 2,
      explanation: "ECO Task: Manage issues. You cannot fix a problem permanently if you only treat the symptom. You must find the root cause."
    },
    {
      id: 156,
      domain: 'process',
      task: 'Task 6: Schedule',
      approach: 'agile',
      question: "What is Timeboxing?",
      options: [
        "Setting a fixed maximum time for an activity (e.g., Sprint is 2 weeks)",
        "Measuring how long a task takes",
        "Clocking in and out",
        "Estimating"
      ],
      correct: 0,
      explanation: "ECO Task: Manage schedule. Timeboxing fixes the schedule/time and lets scope vary (Agile), rather than fixing scope and letting time vary (Waterfall)."
    },
    {
      id: 157,
      domain: 'people',
      task: 'Task 13: Mentoring',
      approach: 'hybrid',
      question: "A junior PM asks you what the 'Halo Effect' is. You explain:",
      options: [
        "It's a video game",
        "Assuming someone is good at everything because they are good at one thing (e.g., a great coder will be a great manager)",
        "Being a servant leader",
        "Having a positive attitude"
      ],
      correct: 1,
      explanation: "ECO Task: Mentor stakeholders. The Halo Effect is a cognitive bias that often leads to promoting technical experts into management roles they aren't ready for."
    },
    {
      id: 158,
      domain: 'process',
      task: 'Task 1: Execute',
      approach: 'agile',
      question: "Which of these is a value in the Agile Manifesto?",
      options: [
        "Processes and tools over individuals and interactions",
        "Responding to change over following a plan",
        "Contract negotiation over customer collaboration",
        "Comprehensive documentation over working software"
      ],
      correct: 1,
      explanation: "ECO Task: Execute. The 4 values favor the items on the left (e.g., Responding to Change), while valuing items on the right less."
    },
    {
      id: 159,
      domain: 'process',
      task: 'Task 12: Artifacts',
      approach: 'predictive',
      question: "What is the difference between the Project Charter and the Scope Statement?",
      options: [
        "Charter is high-level/authorization; Scope Statement is detailed deliverables",
        "They are the same",
        "Scope Statement comes first",
        "Charter is for Agile only"
      ],
      correct: 0,
      explanation: "ECO Task: Manage artifacts. Charter authorizes the project (Initiating). Scope Statement defines exactly what will be built (Planning)."
    },
    {
      id: 160,
      domain: 'people',
      task: 'Task 2: Lead a team',
      approach: 'predictive',
      question: "McGregor's Theory X manager believes:",
      options: [
        "Employees are self-motivated and love work",
        "Employees are lazy, dislike work, and need micromanagement",
        "Employees need hygiene factors",
        "Employees need self-actualization"
      ],
      correct: 1,
      explanation: "ECO Task: Lead a team. Theory X = Authoritarian/Negative view. Theory Y = Participative/Positive view."
    },
    {
      id: 161,
      domain: 'process',
      task: 'Task 10: Changes',
      approach: 'predictive',
      question: "Scope Creep is:",
      options: [
        "Uncontrolled changes without cost/schedule adjustments",
        "Formal changes approved by CCB",
        "Agile iterations",
        "A scary movie"
      ],
      correct: 0,
      explanation: "ECO Task: Manage changes. Scope Creep is the enemy. It is adding features without adding the necessary budget or time."
    },
    {
      id: 162,
      domain: 'process',
      task: 'Task 8: Scope',
      approach: 'agile',
      question: "The 'Definition of Done' (DoD) applies to:",
      options: [
        "The Increment",
        "The Project Charter",
        "The Team Rules",
        "The Email Server"
      ],
      correct: 0,
      explanation: "ECO Task: Plan scope. The DoD is the quality checklist that every Increment must meet to be considered releasable."
    },
    {
      id: 163,
      domain: 'people',
      task: 'Task 7: Impediments',
      approach: 'hybrid',
      question: "A predictive team depends on an agile team for a component. The agile team is late. This is a:",
      options: [
        "Cross-team dependency / Integration risk",
        "Procurement issue",
        "Staffing issue",
        "Communication failure"
      ],
      correct: 0,
      explanation: "ECO Task: Impediments/Risk. Managing dependencies between hybrid workstreams is a key integration challenge."
    },
    {
      id: 164,
      domain: 'process',
      task: 'Task 5: Budget',
      approach: 'predictive',
      question: "Management Reserves are for:",
      options: [
        "Known Unknowns (identified risks)",
        "Unknown Unknowns (unforeseen events)",
        "buying lunch",
        "Planned work"
      ],
      correct: 1,
      explanation: "ECO Task: Manage budget. Contingency Reserves = Known risks. Management Reserves = Unknown risks (requires change control to access)."
    },
    {
      id: 165,
      domain: 'process',
      task: 'Task 11: Procurement',
      approach: 'predictive',
      question: "The 'Point of Total Assumption' (PTA) relates to which contract type?",
      options: [
        "Fixed Price Incentive Fee (FPIF)",
        "Cost Plus Fixed Fee",
        "Time and Materials",
        "Cost Plus Award Fee"
      ],
      correct: 0,
      explanation: "ECO Task: Procurement. PTA is the point where the seller assumes all further cost overruns in an incentive fee contract."
    },
    {
      id: 166,
      domain: 'people',
      task: 'Task 8: Negotiate',
      approach: 'predictive',
      question: "You are negotiating. You use silence to make the other party uncomfortable so they talk more. This is:",
      options: [
        "Active Listening",
        "A negotiation tactic",
        "Rude",
        "Avoidance"
      ],
      correct: 1,
      explanation: "ECO Task: Negotiate. Silence is a powerful tool to elicit information or concessions."
    },
    {
      id: 167,
      domain: 'process',
      task: 'Task 7: Quality',
      approach: 'agile',
      question: "Test-Driven Development (TDD) means:",
      options: [
        "Write the test first, see it fail, then write code to pass it",
        "Test after coding",
        "Let the users test it",
        "Test only at the end"
      ],
      correct: 0,
      explanation: "ECO Task: Manage quality. TDD builds quality in from the start ('Shift Left')."
    },
    {
      id: 168,
      domain: 'process',
      task: 'Task 14: Governance',
      approach: 'predictive',
      question: "Which role typically chairs the Project Governance / Steering Committee?",
      options: [
        "The Project Sponsor",
        "The Project Manager",
        "The Scrum Master",
        "The Vendor"
      ],
      correct: 0,
      explanation: "ECO Task: Governance. The Sponsor provides the financial resources and usually heads the governance board."
    },
    {
      id: 169,
      domain: 'business',
      task: 'Task 2: Benefits',
      approach: 'predictive',
      question: "Payback Period is:",
      options: [
        "The time it takes to recover the investment",
        "The profit margin",
        "The interest rate",
        "The project duration"
      ],
      correct: 0,
      explanation: "ECO Task: Deliver benefits. A shorter payback period is generally better (less risk)."
    },
    {
      id: 170,
      domain: 'process',
      task: 'Task 13: Methodology',
      approach: 'predictive',
      question: "Rolling Wave Planning is:",
      options: [
        "Planning in detail for the near term, and high level for the far term",
        "Planning everything at the start",
        "Planning nothing",
        "Surfing"
      ],
      correct: 0,
      explanation: "ECO Task: Methodology. It is a form of progressive elaboration used when the future is uncertain."
    },
    {
      id: 171,
      domain: 'people',
      task: 'Task 1: Conflict',
      approach: 'predictive',
      question: "Which document might help you prevent conflict regarding who does what?",
      options: [
        "RACI Matrix",
        "Risk Register",
        "Budget",
        "Lessons Learned"
      ],
      correct: 0,
      explanation: "ECO Task: Manage conflict. RACI (Responsible, Accountable, Consult, Inform) clarifies roles and responsibilities, reducing ambiguity."
    },
    {
      id: 172,
      domain: 'process',
      task: 'Task 1: Execute',
      approach: 'agile',
      question: "A 'Spike' in Agile is:",
      options: [
        "A time-boxed research or experiment to reduce risk/uncertainty",
        "A sudden increase in work",
        "A celebration",
        "A bug"
      ],
      correct: 0,
      explanation: "ECO Task: Execute. Spikes are used to learn about a new technology or estimate a complex story."
    },
    {
      id: 173,
      domain: 'process',
      task: 'Task 10: Changes',
      approach: 'predictive',
      question: "Regression Analysis is used to:",
      options: [
        "Predict future performance based on past variables",
        "Fix bugs",
        "Analyze stakeholders",
        "Close contracts"
      ],
      correct: 0,
      explanation: "ECO Task: Manage changes/Forecasting. It is a statistical method to understand relationships between variables."
    },
    {
      id: 174,
      domain: 'people',
      task: 'Task 6: Build a team',
      approach: 'agile',
      question: "Shu-Ha-Ri is a model of:",
      options: [
        "Skill acquisition / Mastery",
        "Martial arts only",
        "Conflict resolution",
        "Budgeting"
      ],
      correct: 0,
      explanation: "ECO Task: Build a team. Shu (Follow rules), Ha (Break rules), Ri (Be the rule). It describes the journey to agile mastery."
    },
    {
      id: 175,
      domain: 'process',
      task: 'Task 11: Procurement',
      approach: 'predictive',
      question: "You send an RFP (Request for Proposal). The vendor sends back a proposal. This proposal is legally considered:",
      options: [
        "An Offer",
        "A Contract",
        "An Acceptance",
        "A Consideration"
      ],
      correct: 0,
      explanation: "ECO Task: Procurement. An RFP is an invitation. The Proposal is the Offer. If you sign it, that is Acceptance."
    },
    {
      id: 176,
      domain: 'process',
      task: 'Task 15: Issues',
      approach: 'predictive',
      question: "A 'Workaround' is a response to:",
      options: [
        "An unidentified risk that has occurred (an Issue)",
        "A planned risk",
        "A scope change",
        "A stakeholder request"
      ],
      correct: 0,
      explanation: "ECO Task: Manage issues. Workarounds are unplanned responses to negative events (issues) that were not identified risks."
    },
    {
      id: 177,
      domain: 'business',
      task: 'Task 4: Organizational change',
      approach: 'agile',
      question: "When introducing Agile to a strict Waterfall organization, it is often best to:",
      options: [
        "Pilot it with one small, willing team first",
        "Change everyone at once",
        "Force the PMO to resign",
        "Rewrite all contracts immediately"
      ],
      correct: 0,
      explanation: "ECO Task: Support organizational change. A pilot project creates a 'safe to fail' environment and generates a success story to help sell the change."
    },
    {
      id: 178,
      domain: 'process',
      task: 'Task 9: Integration',
      approach: 'predictive',
      question: "What is the key benefit of the 'Close Project or Phase' process?",
      options: [
        "It transfers the product to operations and updates organizational knowledge",
        "It pays the bills",
        "It fires the team",
        "It stops scope creep"
      ],
      correct: 0,
      explanation: "ECO Task: Integration/Closure. Formal closure ensures the organization accepts the product and learns from the experience."
    },
    {
      id: 179,
      domain: 'people',
      task: 'Task 14: Emotional Intelligence',
      approach: 'hybrid',
      question: "Empathy is:",
      options: [
        "Understanding and sharing the feelings of another",
        "Feeling sorry for someone",
        "Agreeing with everyone",
        "Giving money"
      ],
      correct: 0,
      explanation: "ECO Task: Emotional Intelligence. Empathy allows the PM to understand stakeholder perspectives and build trust."
    },
    {
      id: 180,
      domain: 'process',
      task: 'Task 1: Execute',
      approach: 'predictive',
      question: "PMI Code of Ethics: You discover a major error in the cost estimate just before the project gets approved. It will likely kill the project. What do you do?",
      options: [
        "Disclose the error to the sponsor immediately",
        "Hide it and fix it later with reserves",
        "Quit",
        "Blame the finance team"
      ],
      correct: 0,
      explanation: "ECO Task: Ethics. Honesty is a core value. You must disclose the truth, even if it has negative consequences for the project."
    }
    
  ];

  // Interactive Scenario Practice Component
  const ScenarioPractice = ({ scenarios }) => {
    const [currentScenario, setCurrentScenario] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showAnswer, setShowAnswer] = useState(false);

    const scenario = scenarios[currentScenario];

    const handleOptionClick = (optIdx) => {
      if (showAnswer) return;
      setSelectedOption(optIdx);
    };

    const handleCheckAnswer = () => {
      if (selectedOption === null) return;
      setShowAnswer(true);
    };

    const handleTryAgain = () => {
      setSelectedOption(null);
      setShowAnswer(false);
      setCurrentScenario((prev) => (prev + 1) % scenarios.length);
    };

    const handleReset = () => {
      setSelectedOption(null);
      setShowAnswer(false);
    };

    return (
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 mb-6 border border-amber-200 shadow-lg">
        <h3 className="font-bold text-amber-900 mb-4 text-xl flex items-center gap-2">
          <Lightbulb className="w-6 h-6" />
          Interactive Practice Scenario {currentScenario + 1} of {scenarios.length}
        </h3>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-100">
          <h4 className="font-bold text-gray-900 mb-3 text-lg">{scenario.title}</h4>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-500 p-4 mb-4 rounded-r-lg">
            <p className="text-gray-700 italic leading-relaxed">{scenario.situation}</p>
          </div>

          <p className="text-sm font-semibold text-gray-600 mb-3">What should you do?</p>
          
          <div className="space-y-3 mb-4">
            {scenario.options.map((option, optIdx) => {
              let buttonStyle = 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200 hover:border-gray-300';
              let textColor = 'text-gray-800';
              let icon = null;

              if (showAnswer) {
                if (optIdx === scenario.correctAnswer) {
                  buttonStyle = 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-500 shadow-md';
                  textColor = 'text-emerald-900';
                  icon = <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
                } else if (optIdx === selectedOption) {
                  buttonStyle = 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400';
                  textColor = 'text-red-900';
                  icon = <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />;
                }
              } else if (selectedOption === optIdx) {
                buttonStyle = 'bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-500 shadow-md';
                textColor = 'text-indigo-900';
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleOptionClick(optIdx)}
                  disabled={showAnswer}
                  className={`w-full text-left p-4 rounded-xl transition-all transform hover:scale-[1.01] ${buttonStyle} ${
                    showAnswer ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`font-bold flex-shrink-0 ${textColor}`}>
                      {String.fromCharCode(65 + optIdx)}.
                    </span>
                    <span className={`flex-1 ${textColor}`}>{option}</span>
                    {icon && <div className="flex-shrink-0">{icon}</div>}
                  </div>
                </button>
              );
            })}
          </div>

          {!showAnswer && selectedOption !== null && (
            <button
              onClick={handleCheckAnswer}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Check Answer
            </button>
          )}

          {showAnswer && (
            <div className="space-y-4">
              <div className={`rounded-xl border-l-4 p-4 ${
                selectedOption === scenario.correctAnswer
                  ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500'
                  : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-500'
              }`}>
                <div className="flex items-start gap-3">
                  {selectedOption === scenario.correctAnswer ? (
                    <>
                      <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-emerald-900 mb-1">Excellent! ✨</p>
                        <p className="text-sm text-emerald-800">
                          You selected the best answer according to PMI principles.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-orange-900 mb-1">Not Quite</p>
                        <p className="text-sm text-orange-800">
                          The correct answer is <strong>{String.fromCharCode(65 + scenario.correctAnswer)}</strong>. Review the explanation below.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                <p className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  Explanation:
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{scenario.explanation}</p>
              </div>

              <div className="flex gap-3">
                {scenarios.length > 1 && (
                  <button
                    onClick={handleTryAgain}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-3 px-6 rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Try Different Scenario
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-3 px-6 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-md hover:shadow-lg"
                >
                  Try This One Again
                </button>
              </div>
            </div>
          )}
        </div>

        {scenarios.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {scenarios.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentScenario(idx);
                  setSelectedOption(null);
                  setShowAnswer(false);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === currentScenario 
                    ? 'bg-amber-600 scale-125' 
                    : 'bg-amber-300 hover:bg-amber-400 hover:scale-110'
                }`}
                aria-label={`Go to scenario ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };


  // Study guide content
  const studyGuideContent = {
    overview: {
      title: 'Exam Overview & Strategy',
      content: (
        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-indigo-900 text-lg mb-2">The PMP Exam Structure</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>180 Questions</strong> total</li>
              <li>• <strong>230 Minutes</strong> (3 hours 50 mins)</li>
              <li>• <strong>2 Breaks</strong> (10 mins each) after question 60 and 120</li>
              <li>• Questions are a mix of multiple choice, multiple responses, matching, hotspot, and fill-in-the-blank.</li>
            </ul>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-indigo-500">
              <div className="text-3xl font-black text-indigo-600 mb-1">42%</div>
              <div className="font-bold text-gray-900">People</div>
              <p className="text-xs text-gray-500 mt-1">Leading, conflict, teams, negotiation, support.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-emerald-500">
              <div className="text-3xl font-black text-emerald-600 mb-1">50%</div>
              <div className="font-bold text-gray-900">Process</div>
              <p className="text-xs text-gray-500 mt-1">Methodology, budget, schedule, scope, quality, closing.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-t-4 border-amber-500">
              <div className="text-3xl font-black text-amber-600 mb-1">8%</div>
              <div className="font-bold text-gray-900">Business</div>
              <p className="text-xs text-gray-500 mt-1">Compliance, value delivery, organizational change.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 text-lg mb-4">Critical Mindset for Success</h4>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div><strong className="text-gray-900">Be a Servant Leader:</strong> Always support the team, remove blockers, and shield them from distractions. Never dictate or punish.</div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div><strong className="text-gray-900">Analyze First:</strong> Never act before understanding the root cause. If a choice says "Assess," "Analyze," or "Review," it's often correct.</div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div><strong className="text-gray-900">Changes are Formal:</strong> In predictive projects, you can't just say "yes" to changes. You must analyze impact -> submit CR -> get CCB approval.</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    formulas: {
      title: 'Mastering the Formulas',
      content: (
        <div className="space-y-6">
          <div className="bg-yellow-50 p-4 rounded-xl border-l-4 border-yellow-400 text-yellow-800">
            <strong>Pro Tip:</strong> You don't need to be a math genius. Focus on understanding what the numbers <em>mean</em> (Good vs. Bad) rather than just memorizing calculation steps.
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* CPI & SPI */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-bold text-indigo-600 mb-3 border-b pb-2">Cost & Schedule Performance</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1"><span className="font-bold">CPI (Cost Performance Index)</span> <code className="bg-gray-100 px-2 rounded">EV / AC</code></div>
                  <p className="text-sm text-gray-600">greater than 1 = Under Budget (Good) 🟢<br/>less than 1 = Over Budget (Bad) 🔴</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="font-bold">SPI (Schedule Performance Index)</span> <code className="bg-gray-100 px-2 rounded">EV / PV</code></div>
                  <p className="text-sm text-gray-600">greater than 1 = Ahead of Schedule (Good) 🟢<br/>less than 1 = Behind Schedule (Bad) 🔴</p>
                </div>
              </div>
            </div>

            {/* Variances */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-bold text-emerald-600 mb-3 border-b pb-2">Variances</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1"><span className="font-bold">CV (Cost Variance)</span> <code className="bg-gray-100 px-2 rounded">EV - AC</code></div>
                  <p className="text-sm text-gray-600">Positive = Under Budget 🟢<br/>Negative = Over Budget 🔴</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1"><span className="font-bold">SV (Schedule Variance)</span> <code className="bg-gray-100 px-2 rounded">EV - PV</code></div>
                  <p className="text-sm text-gray-600">Positive = Ahead of Schedule 🟢<br/>Negative = Behind Schedule 🔴</p>
                </div>
              </div>
            </div>

            {/* Estimation */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-bold text-purple-600 mb-3 border-b pb-2">PERT Estimation (Beta)</h4>
              <div className="text-center py-2">
                <code className="bg-gray-100 text-lg px-4 py-2 rounded-lg font-bold">(O + 4M + P) / 6</code>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                O = Optimistic, M = Most Likely, P = Pessimistic.<br/>
                <em>Used for weighted average duration estimates.</em>
              </p>
            </div>

            {/* Comms */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
              <h4 className="font-bold text-rose-600 mb-3 border-b pb-2">Communication Channels</h4>
              <div className="text-center py-2">
                <code className="bg-gray-100 text-lg px-4 py-2 rounded-lg font-bold">N(N - 1) / 2</code>
              </div>
              <p className="text-sm text-gray-600 mt-2 text-center">
                N = Number of stakeholders.<br/>
                <em>Example: 5 people = 5(4)/2 = 10 channels.</em>
              </p>
            </div>
          </div>
        </div>
      )
    },
    agile: {
      title: 'Agile & Scrum Framework',
      content: (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 text-lg mb-4">The Agile Manifesto Values</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded border border-green-100 text-green-800 font-medium">Individuals and interactions</div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-500 line-through decoration-gray-400">over processes and tools</div>
              
              <div className="bg-green-50 p-3 rounded border border-green-100 text-green-800 font-medium">Working software</div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-500 line-through decoration-gray-400">over comprehensive documentation</div>
              
              <div className="bg-green-50 p-3 rounded border border-green-100 text-green-800 font-medium">Customer collaboration</div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-500 line-through decoration-gray-400">over contract negotiation</div>
              
              <div className="bg-green-50 p-3 rounded border border-green-100 text-green-800 font-medium">Responding to change</div>
              <div className="bg-gray-50 p-3 rounded border border-gray-100 text-gray-500 line-through decoration-gray-400">over following a plan</div>
            </div>
          </div>

          <h4 className="font-bold text-gray-900 text-lg">Scrum Roles & Events</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="font-bold text-indigo-600 mb-2">Product Owner (PO)</div>
              <p className="text-sm text-gray-600">Maximizes value. Owns the Product Backlog. Prioritizes work. Accepts/Rejects stories. The "Voice of the Customer".</p>
            </div>
            <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="font-bold text-indigo-600 mb-2">Scrum Master (SM)</div>
              <p className="text-sm text-gray-600">Servant Leader. Removes impediments. Coaches the team. Facilitates events. Shields team from distractions.</p>
            </div>
            <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="font-bold text-indigo-600 mb-2">The Team</div>
              <p className="text-sm text-gray-600">Cross-functional, self-organizing. They decide "How" and "How much" work to do. Accountable for quality.</p>
            </div>
            <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="font-bold text-purple-600 mb-2">Sprint Retrospective</div>
              <p className="text-sm text-gray-600">Most important event for improvement. Inspects the *process* and *team* (not the product). Result: Improvement plan.</p>
            </div>
          </div>
        </div>
      )
    },
    traps: {
      title: 'Common PMP Exam Traps',
      content: (
        <div className="space-y-6">
          <div className="bg-rose-50 p-6 rounded-xl border border-rose-100">
             <h4 className="font-bold text-rose-900 text-lg mb-4 flex items-center gap-2">
               <AlertCircle className="w-5 h-5" /> Beware of these Distractors
             </h4>
             <ul className="space-y-4">
               <li className="flex gap-3">
                 <div className="font-bold text-rose-600 whitespace-nowrap">Gold Plating:</div>
                 <div className="text-gray-700">Giving the customer extra features they didn't ask for. <br/><span className="text-xs font-bold uppercase text-rose-500">Verdict: Always Bad (Waste/Risk)</span></div>
               </li>
               <li className="flex gap-3">
                 <div className="font-bold text-rose-600 whitespace-nowrap">Student Syndrome:</div>
                 <div className="text-gray-700">Leaving work until the very last minute possible.</div>
               </li>
               <li className="flex gap-3">
                 <div className="font-bold text-rose-600 whitespace-nowrap">Parkinson's Law:</div>
                 <div className="text-gray-700">"Work expands to fill the time available." If you give someone 5 days for a 2-day task, it will take 5 days.</div>
               </li>
               <li className="flex gap-3">
                 <div className="font-bold text-rose-600 whitespace-nowrap">Sunk Cost Fallacy:</div>
                 <div className="text-gray-700">Continuing a failing project just because you already spent money on it. <br/><span className="text-xs font-bold uppercase text-emerald-600">Verdict: Ignore sunk costs. Decide based on future value.</span></div>
               </li>
             </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h4 className="font-bold text-gray-900 text-lg mb-4">Words that indicate WRONG answers</h4>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Always</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Never</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Must</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Force</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Demand</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Immediately Report</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Fire</span>
              <span className="px-3 py-1 bg-gray-100 rounded text-gray-600 font-mono text-sm">Suspend</span>
            </div>
            <p className="text-sm text-gray-500 mt-3">PMI prefers "Analyze," "Collaborate," "Facilitate," and "Review" over extreme actions.</p>
          </div>
        </div>
      )
    }
  };

  // Event handlers (keeping existing logic)
  useEffect(() => {
    if (isTimerActive && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleTimeUp();
    }
  }, [timeRemaining, isTimerActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startMode = (mode, domain = 'all', approach = 'all', questionCount = 10, timeLimit = null) => {
    let questions = [...allQuestions];
    
    if (domain !== 'all') {
      questions = questions.filter(q => q.domain === domain);
    }
    
    if (approach !== 'all') {
      questions = questions.filter(q => q.approach === approach);
    }
    
    questions = questions.sort(() => Math.random() - 0.5).slice(0, Math.min(questionCount, questions.length));
    
    setQuestionsPool(questions);
    setCurrentMode(mode);
    setSelectedDomain(domain);
    setSelectedApproach(approach);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setAnsweredQuestions([]);
    
    if (timeLimit) {
      setTimeRemaining(timeLimit * 60);
      setIsTimerActive(true);
    } else {
      setTimeRemaining(null);
      setIsTimerActive(false);
    }
  };

  const handleAnswerSelect = (index) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === questionsPool[currentQuestion].correct;
    const newAnsweredQuestions = [...answeredQuestions, {
      questionId: questionsPool[currentQuestion].id,
      correct: isCorrect,
      selectedAnswer
    }];
    
    setAnsweredQuestions(newAnsweredQuestions);
    if (isCorrect) setScore(score + 1);
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questionsPool.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      showResults();
    }
  };

  const handleTimeUp = () => {
    setIsTimerActive(false);
    showResults();
  };

  const showResults = () => {
    updateProgress(answeredQuestions);
    setCurrentMode('results');
    setIsTimerActive(false);
  };

  // DASHBOARD VIEW
// DASHBOARD VIEW
  if (currentMode === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans">
        {/* Top Nav */}
        <div className="bg-indigo-900 text-white p-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2" onClick={() => setCurrentMode('menu')}>
              <Award className="w-6 h-6 text-amber-400" />
              <span className="font-bold text-lg tracking-tight cursor-pointer">PMP Master</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-medium">
              <div className="bg-indigo-800 px-3 py-1 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Day {progress.streak}
              </div>
              <div>{progress.questionsAttempted} Qs</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <button 
            onClick={() => setCurrentMode('menu')}
            className="mb-6 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>

          <h2 className="text-3xl font-black text-slate-900 mb-6">Study Dashboard</h2>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500">
              <div className="text-slate-500 text-xs font-bold uppercase mb-1">Accuracy</div>
              <div className="text-2xl font-black text-indigo-900">
                 {progress.questionsAttempted > 0 
                    ? Math.round((progress.questionsCorrect / progress.questionsAttempted) * 100) 
                    : 0}%
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-amber-500">
              <div className="text-slate-500 text-xs font-bold uppercase mb-1">Time Spent</div>
              <div className="text-2xl font-black text-amber-900">
                {Math.round(progress.timeSpent / 60)}m
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-emerald-500">
              <div className="text-slate-500 text-xs font-bold uppercase mb-1">Correct</div>
              <div className="text-2xl font-black text-emerald-900">{progress.questionsCorrect}</div>
            </div>
             <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-rose-500">
              <div className="text-slate-500 text-xs font-bold uppercase mb-1">Weakest</div>
              <div className="text-lg font-bold text-rose-900 truncate">Procurement</div>
            </div>
          </div>

          {/* Reference Library Grid - NOW CONNECTED */}
          <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Reference</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            <div 
              onClick={() => setCurrentMode('overview')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-slate-100 group"
            >
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Exam Overview</h4>
              <p className="text-xs text-slate-500 mt-1">Domains & timing</p>
            </div>

            <div 
              onClick={() => setCurrentMode('formulas')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-slate-100 group"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Key Formulas</h4>
              <p className="text-xs text-slate-500 mt-1">EVM & PERT math</p>
            </div>

            <div 
              onClick={() => setCurrentMode('agile')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-slate-100 group"
            >
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Repeat className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Agile & Scrum</h4>
              <p className="text-xs text-slate-500 mt-1">Roles & Events</p>
            </div>

            <div 
              onClick={() => setCurrentMode('traps')}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition-all border border-slate-100 group"
            >
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Common Traps</h4>
              <p className="text-xs text-slate-500 mt-1">Exam pitfalls</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // STUDY GUIDE VIEW
  if (currentMode === 'studyguide') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h1 className="text-5xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Book className="w-12 h-12 text-emerald-600" />
                Study Guide 📚
              </h1>
              <p className="text-gray-600 text-lg">Master all 35 ECO tasks with deep dives and examples</p>
            </div>
            <button
              onClick={() => setCurrentMode('menu')}
              className="px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-md border border-gray-200 flex items-center gap-2"
            >
              ← Back to Menu
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mb-8 flex-wrap">
            {['overview', 'formulas', 'agile', 'traps', 'tasks'].map((section) => {
              const sectionInfo = {
                overview: { name: 'Exam Overview', icon: Award, color: 'indigo' },
                formulas: { name: 'Key Formulas', icon: Target, color: 'purple' },
                agile: { name: 'Agile & Scrum', icon: Zap, color: 'pink' },
                traps: { name: 'Common Traps', icon: AlertCircle, color: 'orange' },
                tasks: { name: 'All 35 Tasks', icon: Lightbulb, color: 'emerald' }
              }[section];
              
              const SectionIcon = sectionInfo.icon;
              const isActive = studyGuideSection === section && !selectedTask;
              
              return (
                <button
                  key={section}
                  onClick={() => {
                    setStudyGuideSection(section);
                    setSelectedTask(null);
                  }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
                    isActive
                      ? `bg-gradient-to-r from-${sectionInfo.color}-500 to-${sectionInfo.color}-600 text-white shadow-lg scale-105`
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                  }`}
                >
                  <SectionIcon className="w-5 h-5" />
                  {sectionInfo.name}
                </button>
              );
            })}
          </div>

          {/* Task Detail View */}
          {selectedTask ? (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <button
                onClick={() => setSelectedTask(null)}
                className="mb-6 text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-2"
              >
                ← Back to Task List
              </button>
              
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full text-sm font-bold">
                    {selectedTask.number}
                  </span>
                  <h2 className="text-3xl font-bold text-gray-900">{selectedTask.title}</h2>
                </div>
              </div>

              {/* Enablers */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-4 text-xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Enablers:
                </h3>
                <ul className="space-y-3">
                  {selectedTask.enablers.map((enabler, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-gray-800 leading-relaxed">{enabler}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Key Points */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 mb-6 border border-amber-200">
                <h3 className="font-bold text-amber-900 mb-4 text-xl flex items-center gap-2">
                  <Target className="w-6 h-6" />
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {selectedTask.keyPoints.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-amber-600 font-bold text-xl">•</span>
                      <span className="text-gray-800">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deep Dive - with special rendering for conflict resolution */}
              <div className="bg-white rounded-xl p-6 mb-6 border-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-6 text-2xl">Deep Dive</h3>
                <div className="prose max-w-none">
                  {selectedTask.id === 'P1' ? (
                    // Special rendering for conflict resolution techniques
                    <div>
                      <h4 className="font-bold text-gray-800 mb-4 text-xl">
                        Five Conflict Resolution Techniques (in order of preference)
                      </h4>
                      <div className="space-y-4 mb-6">
                        {/* Collaborate */}
                        <div className="border-l-4 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-r-xl shadow-md">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">1</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-green-900 text-xl mb-2">Collaborate/Problem-Solve</h5>
                              <span className="inline-block bg-green-200 text-green-800 text-xs px-3 py-1 rounded-full font-bold">Win-Win • BEST OPTION ✨</span>
                            </div>
                          </div>
                          <ul className="ml-13 space-y-2 text-sm text-gray-700 mb-3">
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              Most effective when time permits and relationships matter
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              Open dialogue to understand all perspectives
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              Seeks solutions satisfying all parties
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-600 font-bold">✓</span>
                              Builds long-term trust and relationships
                            </li>
                          </ul>
                          <div className="ml-13 bg-white p-3 rounded-lg border border-green-200 shadow-sm">
                            <span className="font-bold text-green-900">💡 Example:</span> Two team members disagree on technical approach → Facilitate discussion to find solution incorporating both perspectives
                          </div>
                        </div>

                        {/* Compromise */}
                        <div className="border-l-4 border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-r-xl shadow-md">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">2</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-blue-900 text-xl mb-2">Compromise</h5>
                              <span className="inline-block bg-blue-200 text-blue-800 text-xs px-3 py-1 rounded-full font-bold">Lose-Lose • MODERATE</span>
                            </div>
                          </div>
                          <ul className="ml-13 space-y-2 text-sm text-gray-700 mb-3">
                            <li>• Each party gives up something</li>
                            <li>• Moderately effective, partial satisfaction</li>
                            <li>• Use when stakes moderate and time limited</li>
                          </ul>
                          <div className="ml-13 bg-white p-3 rounded-lg border border-blue-200 shadow-sm">
                            <span className="font-bold text-blue-900">💡 Example:</span> Two departments want same resource → Split resource or alternate weeks
                          </div>
                        </div>

                        {/* Force/Direct */}
                        <div className="border-l-4 border-orange-500 bg-gradient-to-r from-orange-50 to-amber-50 p-5 rounded-r-xl shadow-md">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-orange-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">3</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-orange-900 text-xl mb-2">Force/Direct</h5>
                              <span className="inline-block bg-orange-200 text-orange-800 text-xs px-3 py-1 rounded-full font-bold">Win-Lose • USE SPARINGLY ⚠️</span>
                            </div>
                          </div>
                          <ul className="ml-13 space-y-2 text-sm text-gray-700 mb-3">
                            <li>⚠ PM makes decision, others comply</li>
                            <li>⚠ Only when quick decision needed or stakes very high</li>
                            <li>⚠ Damages relationships if overused</li>
                          </ul>
                          <div className="ml-13 bg-white p-3 rounded-lg border border-orange-200 shadow-sm">
                            <span className="font-bold text-orange-900">💡 Example:</span> Safety issue requires immediate action
                          </div>
                        </div>

                        {/* Smooth/Accommodate */}
                        <div className="border-l-4 border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-r-xl shadow-md">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">4</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-purple-900 text-xl mb-2">Smooth/Accommodate</h5>
                              <span className="inline-block bg-purple-200 text-purple-800 text-xs px-3 py-1 rounded-full font-bold">Lose-Win • SITUATIONAL</span>
                            </div>
                          </div>
                          <ul className="ml-13 space-y-2 text-sm text-gray-700 mb-3">
                            <li>• One party yields to maintain harmony</li>
                            <li>• Use when relationship more important than issue</li>
                            <li>• Can build goodwill for future</li>
                          </ul>
                          <div className="ml-13 bg-white p-3 rounded-lg border border-purple-200 shadow-sm">
                            <span className="font-bold text-purple-900">💡 Example:</span> Defer to team member's preference on minor styling issue
                          </div>
                        </div>

                        {/* Withdraw/Avoid */}
                        <div className="border-l-4 border-red-500 bg-gradient-to-r from-red-50 to-rose-50 p-5 rounded-r-xl shadow-md">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="bg-red-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0 text-lg">5</div>
                            <div className="flex-1">
                              <h5 className="font-bold text-red-900 text-xl mb-2">Withdraw/Avoid</h5>
                              <span className="inline-block bg-red-200 text-red-800 text-xs px-3 py-1 rounded-full font-bold">Lose-Lose • WORST OPTION ❌</span>
                            </div>
                          </div>
                          <ul className="ml-13 space-y-2 text-sm text-gray-700 mb-3">
                            <li>✗ Postpone or ignore conflict</li>
                            <li>✗ Only when conflict will self-resolve or emotions need cooling</li>
                            <li>✗ Worst if used as permanent solution</li>
                          </ul>
                          <div className="ml-13 bg-white p-3 rounded-lg border border-red-200 shadow-sm">
                            <span className="font-bold text-red-900">💡 Example:</span> Table heated discussion until next meeting when people calmer
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <p className="text-sm text-gray-700">
                          <strong className="text-indigo-900">PMI Perspective:</strong> The exam strongly favors collaborative approaches. 
                          Always attempt collaboration before escalating or forcing decisions. Emotional intelligence and active listening are critical.
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Regular rendering for other tasks
                    selectedTask.deepDive.split('\n').map((paragraph, idx) => {
                      if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                        return (
                          <h4 key={idx} className="font-bold text-gray-800 mt-6 mb-3 text-lg">
                            {paragraph.replace(/\*\*/g, '')}
                          </h4>
                        );
                      }
                      if (paragraph.trim().startsWith('•')) {
                        return (
                          <li key={idx} className="ml-4 text-gray-700 mb-2">
                            {paragraph.replace('•', '').trim()}
                          </li>
                        );
                      }
                      if (paragraph.trim()) {
                        return (
                          <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                            {paragraph}
                          </p>
                        );
                      }
                      return null;
                    })
                  )}
                </div>
              </div>

              {/* Scenarios */}
              {selectedTask.scenarios && selectedTask.scenarios.length > 0 && (
                <ScenarioPractice scenarios={selectedTask.scenarios} />
              )}

              {/* Common Mistakes */}
              {selectedTask.commonMistakes && (
                <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 mb-6 border border-red-200">
                  <h3 className="font-bold text-red-900 mb-4 text-xl flex items-center gap-2">
                    <AlertCircle className="w-6 h-6" />
                    Common Mistakes to Avoid
                  </h3>
                  <ul className="space-y-3">
                    {selectedTask.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exam Tips */}
              {selectedTask.examTips && (
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="font-bold text-purple-900 mb-4 text-xl flex items-center gap-2">
                    <Award className="w-6 h-6" />
                    Exam Tips
                  </h3>
                  <ul className="space-y-3">
                    {selectedTask.examTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Zap className="w-6 h-6 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-800">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : studyGuideSection === 'tasks' ? (
            // Task List View
            <div className="space-y-8">
              {/* People Domain */}
              <div>
                <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-3">
                  <div className="w-3 h-10 bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-full"></div>
                  People Domain (14 Tasks) 👥
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {taskDatabase.people.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white rounded-xl p-5 border-2 border-indigo-200 hover:border-indigo-500 cursor-pointer transition-all hover:shadow-lg card-hover"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">{task.number}</span>
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{task.enablers.length} enablers • Click for deep dive 🚀</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Domain */}
              <div>
                <h3 className="text-2xl font-bold text-emerald-700 mb-4 flex items-center gap-3">
                  <div className="w-3 h-10 bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-full"></div>
                  Process Domain (17 Tasks) ⚙️
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {taskDatabase.process.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white rounded-xl p-5 border-2 border-emerald-200 hover:border-emerald-500 cursor-pointer transition-all hover:shadow-lg card-hover"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">{task.number}</span>
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{task.enablers.length} enablers • Click for deep dive 🚀</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Business Domain */}
              <div>
                <h3 className="text-2xl font-bold text-amber-700 mb-4 flex items-center gap-3">
                  <div className="w-3 h-10 bg-gradient-to-b from-amber-500 to-amber-600 rounded-full"></div>
                  Business Environment Domain (4 Tasks) 💼
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {taskDatabase.business.map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className="bg-white rounded-xl p-5 border-2 border-amber-200 hover:border-amber-500 cursor-pointer transition-all hover:shadow-lg card-hover"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">{task.number}</span>
                        <h4 className="font-bold text-gray-900">{task.title}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{task.enablers.length} enablers • Click for deep dive 🚀</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200">
                <p className="text-gray-700">
                  <strong className="text-purple-900">📚 Note:</strong> Currently showing {taskDatabase.people.length + taskDatabase.process.length + taskDatabase.business.length} tasks with deep content. 
                  Click any task to see detailed explanations, scenarios, and exam tips!
                </p>
              </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-200">
                <p className="text-gray-700">
                  <strong className="text-purple-900">📚 Note:</strong> Currently showing {taskDatabase.people.length + taskDatabase.process.length + taskDatabase.business.length} tasks with deep content. 
                  Click any task to see detailed explanations, scenarios, and exam tips!
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              {studyGuideContent[studyGuideSection] ? (
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    {studyGuideSection === 'overview' && <Award className="w-8 h-8 text-indigo-600" />}
                    {studyGuideSection === 'formulas' && <BarChart3 className="w-8 h-8 text-purple-600" />}
                    {studyGuideSection === 'agile' && <Zap className="w-8 h-8 text-pink-600" />}
                    {studyGuideSection === 'traps' && <AlertCircle className="w-8 h-8 text-orange-600" />}
                    {studyGuideContent[studyGuideSection].title}
                  </h2>
                  <div className="prose max-w-none">
                    {studyGuideContent[studyGuideSection].content}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-lg">Select a section to begin studying.</p>
              )}
            </div>
          )}
      

  // PRACTICE/TIMED QUESTIONS VIEW  
  if (currentMode === 'practice' || currentMode === 'timed') {
    if (!questionsPool || questionsPool.length === 0) {
      return <div>Loading...</div>;
    }
    
    const question = questionsPool[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setCurrentMode('menu')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-semibold"
                >
                  ← Exit
                </button>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    Question {currentQuestion + 1} of {questionsPool.length}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {timeRemaining !== null && (
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold ${
                    timeRemaining < 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Clock className="w-5 h-5" />
                    {formatTime(timeRemaining)}
                  </div>
                )}
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-600">{score}</div>
                  <div className="text-xs text-gray-600">Correct</div>
                </div>
              </div>
            </div>
            
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500"
                style={{ width: `${((currentQuestion + 1) / questionsPool.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span 
                className="px-4 py-2 rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: domains.find(d => d.id === question.domain)?.color }}
              >
                {question.domain.toUpperCase()}
              </span>
            </div>

            <div className="mb-8">
              <p className="text-lg text-gray-800 leading-relaxed font-medium">
                {question.question}
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {question.options.map((option, idx) => {
                let buttonStyle = 'bg-gray-50 hover:bg-gray-100 border-2 border-gray-200';
                let textColor = 'text-gray-800';

                if (showExplanation) {
                  if (idx === question.correct) {
                    buttonStyle = 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-500';
                    textColor = 'text-emerald-900';
                  } else if (idx === selectedAnswer && selectedAnswer !== question.correct) {
                    buttonStyle = 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-400';
                    textColor = 'text-red-900';
                  }
                } else if (selectedAnswer === idx) {
                  buttonStyle = 'bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-500';
                  textColor = 'text-indigo-900';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(idx)}
                    disabled={showExplanation}
                    className={`w-full text-left p-6 rounded-xl transition-all ${buttonStyle} ${
                      showExplanation ? 'cursor-default' : 'cursor-pointer hover:scale-[1.02]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold ${textColor}`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className={`flex-1 ${textColor} text-base leading-relaxed`}>
                        {option}
                      </span>
                      {showExplanation && idx === question.correct && (
                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {!showExplanation && selectedAnswer !== null && (
              <button
                onClick={handleSubmitAnswer}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-bold text-lg shadow-lg"
              >
                Check Answer
              </button>
            )}

            {showExplanation && (
              <div className="space-y-4">
                <div className={`rounded-xl p-6 ${
                  selectedAnswer === question.correct
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-500'
                    : 'bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-500'
                }`}>
                  <div className="flex items-center gap-3">
                    {selectedAnswer === question.correct ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-emerald-600" />
                        <p className="font-bold text-emerald-900 text-xl">Excellent! 🎉</p>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-8 h-8 text-orange-600" />
                        <p className="font-bold text-orange-900 text-xl">Not quite</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <p className="text-sm font-bold text-blue-900 mb-3">Explanation:</p>
                  <p className="text-gray-700 leading-relaxed">{question.explanation}</p>
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  {currentQuestion < questionsPool.length - 1 ? 'Next Question' : 'View Results'}
                  <Play className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RESULTS VIEW
  if (currentMode === 'results') {
    const percentage = Math.round((score / questionsPool.length) * 100);
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className={`rounded-3xl p-12 mb-8 text-center relative overflow-hidden ${
            passed ? 'bg-gradient-to-br from-emerald-500 to-teal-600' : 'bg-gradient-to-br from-orange-500 to-amber-600'
          }`}>
            <div className="text-8xl mb-6">{passed ? '🎉' : '💪'}</div>
            <h1 className="text-5xl font-black text-white mb-4">
              {passed ? 'Excellent Work!' : 'Keep Practicing!'}
            </h1>
            <div className="text-8xl font-black text-white mb-4">{percentage}%</div>
            <p className="text-2xl text-white/90">{score} out of {questionsPool.length} correct</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <button
              onClick={() => startMode(currentMode === 'timed' ? 'timed' : 'practice', selectedDomain, selectedApproach, questionsPool.length)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={() => setCurrentMode('menu')}
              className="bg-white text-gray-700 py-4 px-8 rounded-xl font-bold text-lg shadow-lg border-2 border-gray-200 flex items-center justify-center gap-2"
            >
              Back to Menu
            </button>
          </div>
        </div>
      </div>
    );

  }
// MAIN MENU VIEW
  if (currentMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <div className="max-w-5xl w-full">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block p-4 rounded-full bg-white shadow-xl mb-6">
              <Award className="w-16 h-16 text-indigo-600" />
            </div>
            <h1 className="text-6xl font-black text-slate-900 mb-4 tracking-tight">
              PMP<span className="text-indigo-600">Master</span>
            </h1>
            <p className="text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              The ultimate interactive preparation tool for your Project Management Professional certification.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-indigo-100 flex items-center gap-4">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{progress.questionsAttempted}</div>
                <div className="text-xs text-slate-500 font-bold uppercase">Answered</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {progress.questionsAttempted > 0 
                    ? Math.round((progress.questionsCorrect / progress.questionsAttempted) * 100) 
                    : 0}%
                </div>
                <div className="text-xs text-slate-500 font-bold uppercase">Accuracy</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-amber-100 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{progress.streak}</div>
                <div className="text-xs text-slate-500 font-bold uppercase">Day Streak</div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-900">{progress.badges.length}</div>
                <div className="text-xs text-slate-500 font-bold uppercase">Badges</div>
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Quick Practice */}
            <button 
              onClick={() => startMode('practice', 'all', 'all', 10)}
              className="group bg-white hover:bg-indigo-50 border-2 border-white hover:border-indigo-200 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="w-32 h-32 text-indigo-600 transform rotate-12" />
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Quick Practice</h3>
              <p className="text-slate-500 font-medium mb-6">10 rapid-fire questions to test your knowledge.</p>
              <span className="inline-flex items-center gap-2 text-indigo-600 font-bold">
                Start Quiz <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            {/* Study Dashboard */}
            <button 
              onClick={() => setCurrentMode('dashboard')}
              className="group bg-white hover:bg-emerald-50 border-2 border-white hover:border-emerald-200 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart3 className="w-32 h-32 text-emerald-600 transform rotate-12" />
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Dashboard</h3>
              <p className="text-slate-500 font-medium mb-6">Track progress, view stats, and identify weak areas.</p>
              <span className="inline-flex items-center gap-2 text-emerald-600 font-bold">
                View Stats <ArrowRight className="w-5 h-5" />
              </span>
            </button>

            {/* Deep Study */}
            <button 
              onClick={() => setCurrentMode('studyguide')}
              className="group bg-white hover:bg-amber-50 border-2 border-white hover:border-amber-200 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all text-left relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen className="w-32 h-32 text-amber-600 transform rotate-12" />
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Study Guide</h3>
              <p className="text-slate-500 font-medium mb-6">Deep dives into all 35 ECO tasks and concepts.</p>
              <span className="inline-flex items-center gap-2 text-amber-600 font-bold">
                Open Guide <ArrowRight className="w-5 h-5" />
              </span>
            </button>
          </div>

          {/* Domain Selectors */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <button 
              onClick={() => startMode('practice', 'people', 'all', 20)}
              className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900">People Domain</div>
                <div className="text-xs text-slate-500">Practice this area</div>
              </div>
            </button>

            <button 
              onClick={() => startMode('practice', 'process', 'all', 20)}
              className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-emerald-200 hover:bg-emerald-50 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900">Process Domain</div>
                <div className="text-xs text-slate-500">Practice this area</div>
              </div>
            </button>

            <button 
              onClick={() => startMode('practice', 'business', 'all', 20)}
              className="bg-white p-4 rounded-xl shadow-sm border-2 border-transparent hover:border-amber-200 hover:bg-amber-50 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900">Business Domain</div>
                <div className="text-xs text-slate-500">Practice this area</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => setCurrentMode('menu')}
          className="mb-6 px-6 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold shadow-md"
        >
          ← Back to Menu
        </button>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    </div>
  );
};

// Render to DOM
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ModernPMPPrep />);
