# Cursor Instructions: Implement New Progress Dashboard

## Overview
Replace the current "My Progress" page with the new glassmorphism dashboard design featuring Progress Statistics, Domain cards, Activity Scores, and 3D Achievement Badges.

---

## STEP 1: Locate Current Progress Page

Find the current progress/dashboard component. It's likely in one of these locations:
- `src/pages/Progress.jsx` or `src/pages/MyProgress.jsx`
- `src/components/Dashboard/` folder
- `src/views/Progress/`

Look for files containing "Task Mastery Overview" or the progress tracking UI.

---

## STEP 2: Add Required CSS

Add these CSS custom properties to your global styles or the component's style section:

```css
:root {
  /* Background */
  --bg-gradient: linear-gradient(135deg, #0f172a 0%, #1e1b4b 30%, #172554 60%, #0f172a 100%);
  
  /* Glass Card */
  --glass-bg: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  --glass-border: rgba(255,255,255,0.08);
  --glass-hover-bg: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%);
  
  /* Accent Colors */
  --purple: #a78bfa;
  --purple-bg: rgba(139, 92, 246, 0.15);
  --orange: #fb923c;
  --orange-bg: rgba(249, 115, 22, 0.15);
  --teal: #2dd4bf;
  --teal-bg: rgba(45, 212, 191, 0.15);
  --pink: #f472b6;
  --pink-bg: rgba(236, 72, 153, 0.15);
  --cyan: #22d3ee;
  --cyan-bg: rgba(34, 211, 238, 0.15);
  --blue: #60a5fa;
  --blue-bg: rgba(59, 130, 246, 0.15);
  --green: #22c55e;
  --green-bg: rgba(34, 197, 94, 0.15);
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,0.6);
  --text-muted: rgba(255,255,255,0.4);
}
```

---

## STEP 3: Create GlassCard Component

Create a reusable GlassCard component:

```jsx
// src/components/ui/GlassCard.jsx

import React from 'react';
import './GlassCard.css';

const GlassCard = ({ 
  icon, 
  iconColor = 'purple', 
  title, 
  pill, 
  pillColor = 'purple',
  subtitle, 
  children,
  stats,
  percent,
  miniProgress,
  onClick 
}) => {
  return (
    <div className="glass-card" onClick={onClick}>
      <div className={`card-icon ${iconColor}`}>
        {icon}
      </div>
      
      <div className="card-content">
        <div className="card-title">
          <h3>{title}</h3>
          {pill && <span className={`card-pill ${pillColor}`}>{pill}</span>}
        </div>
        <div className="card-subtitle">{subtitle}</div>
      </div>
      
      {miniProgress && (
        <div className="mini-progress" style={{ color: `var(--${iconColor})` }}>
          {miniProgress.map((filled, i) => (
            <div 
              key={i} 
              className={`mini-bar ${filled === 2 ? 'active' : filled === 1 ? 'filled' : ''}`}
            />
          ))}
        </div>
      )}
      
      {stats && (
        <div className="stat-group">
          {stats.map((stat, i) => (
            <div key={i} className={`stat-box ${stat.color || 'muted'}`}>
              <div className="value">{stat.value}</div>
              <div className="label">{stat.label}</div>
            </div>
          ))}
        </div>
      )}
      
      {percent !== undefined && (
        <div className="card-percent">{percent}%</div>
      )}
      
      <div className="card-chevron">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
    </div>
  );
};

export default GlassCard;
```

---

## STEP 4: Create Badge Component

Create the 3D Badge component:

```jsx
// src/components/ui/Badge3D.jsx

import React, { useState } from 'react';
import './Badge3D.css';

const Badge3D = ({ 
  name, 
  icon, 
  color = 'purple', // purple, orange, teal, pink, cyan, gradient
  tier = 'Rare',
  description,
  requirement,
  xp,
  earnedDate,
  isLocked = false,
  progress // 0-100, only for locked badges
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div 
      className={`badge-container badge-${isLocked ? 'locked' : color}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="badge-3d">
        <div className="badge-face">
          <div className="badge-edge"></div>
          <div className="badge-outer"></div>
          <div className="badge-inner">
            <div className="badge-icon">{icon}</div>
          </div>
          <div className="badge-shine"></div>
        </div>
        <div className={`badge-status ${isLocked ? 'status-locked' : 'status-earned'}`}>
          {isLocked ? '🔒' : '✓'}
        </div>
      </div>
      
      <div className="badge-name">{name}</div>
      
      {showTooltip && (
        <div className="tooltip">
          <div className="tooltip-header">
            <div className="tooltip-mini-badge">{icon}</div>
            <div>
              <div className="tooltip-title">{name}</div>
              <div className="tooltip-tier">{tier}</div>
            </div>
          </div>
          <div className="tooltip-desc">{description}</div>
          <div className="tooltip-requirement">
            <div className="requirement-label">How to Earn</div>
            <div className="requirement-text">{requirement}</div>
          </div>
          {isLocked && progress !== undefined && (
            <div className="tooltip-progress">
              <div className="progress-label">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
          <div className="tooltip-footer">
            <div className="tooltip-xp">⚡ +{xp} XP</div>
            {earnedDate && <div className="tooltip-date">{earnedDate}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Badge3D;
```

---

## STEP 5: Create Main Progress Dashboard

Replace your current progress page with this structure:

```jsx
// src/pages/Progress.jsx

import React, { useMemo } from 'react';
import GlassCard from '../components/ui/GlassCard';
import Badge3D from '../components/ui/Badge3D';
import { useProgress } from '../hooks/useProgress'; // Your existing data hook
import './Progress.css';

// SVG Icons
const Icons = {
  stats: <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>,
  people: <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>,
  process: <svg viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65z"/></svg>,
  business: <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
  trophy: <svg viewBox="0 0 24 24"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2z"/></svg>,
  flame: <svg viewBox="0 0 24 24"><path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/></svg>,
  scholar: <svg viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>,
  check: <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>,
  shield: <svg viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>,
  rocket: <svg viewBox="0 0 24 24"><path d="M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.92 6-4.72 7.28L13 17v5h-2v-5l-2.28 2.28C5.92 18 4 15.21 4 12c0-4.08 3.05-7.44 7-7.93V2.05c-4.5.5-8 4.31-8 8.95 0 4.64 3.5 8.45 8 8.95V22h4v-2.05c4.5-.5 8-4.31 8-8.95 0-4.64-3.5-8.45-8-8.95z"/></svg>,
  chart: <svg viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>,
};

const Progress = () => {
  // Get your actual progress data from your existing hooks/state
  const { 
    totalModules,
    completedModules,
    activities,
    domains,
    badges,
    avgScore,
    attempts
  } = useProgress();

  // Calculate percentages
  const overallPercent = Math.round((completedModules / totalModules) * 100);
  
  // Generate mini progress bars (2 = active, 1 = filled/partial, 0 = empty)
  const generateMiniProgress = (done, total) => {
    return Array(total).fill(0).map((_, i) => i < done ? 2 : 0);
  };

  // Badge definitions - connect to your actual badge/achievement system
  const badgeDefinitions = [
    {
      id: 'quick-start',
      name: 'Quick Start',
      icon: Icons.rocket,
      color: 'cyan',
      tier: 'Uncommon',
      description: 'Complete your first module.',
      requirement: 'Complete your first module',
      xp: 100,
      checkUnlocked: () => completedModules >= 1,
      getProgress: () => Math.min(100, (completedModules / 1) * 100)
    },
    {
      id: 'streak-master',
      name: 'Streak Master',
      icon: Icons.flame,
      color: 'orange',
      tier: 'Epic',
      description: '7 consecutive days of learning.',
      requirement: '7 day learning streak',
      xp: 250,
      checkUnlocked: () => badges?.streakMaster || false,
      getProgress: () => badges?.currentStreak ? (badges.currentStreak / 7) * 100 : 0
    },
    {
      id: 'people-pro',
      name: 'People Pro',
      icon: Icons.people,
      color: 'teal',
      tier: 'Rare',
      description: 'Master the People domain.',
      requirement: '50% People Domain',
      xp: 200,
      checkUnlocked: () => (domains?.people?.percent || 0) >= 50,
      getProgress: () => domains?.people?.percent || 0
    },
    {
      id: 'scholar',
      name: 'Scholar',
      icon: Icons.scholar,
      color: 'pink',
      tier: 'Mythic',
      description: 'Complete 20 modules.',
      requirement: '20 modules completed',
      xp: 300,
      checkUnlocked: () => completedModules >= 20,
      getProgress: () => Math.min(100, (completedModules / 20) * 100)
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      icon: Icons.check,
      color: 'purple',
      tier: 'Legendary',
      description: 'Score 100% on quizzes.',
      requirement: '100% on 5 quizzes',
      xp: 500,
      checkUnlocked: () => badges?.perfectQuizzes >= 5,
      getProgress: () => badges?.perfectQuizzes ? (badges.perfectQuizzes / 5) * 100 : 0
    },
    {
      id: 'process-master',
      name: 'Process Master',
      icon: Icons.process,
      color: 'pink',
      tier: 'Epic',
      description: 'Master the Process domain.',
      requirement: '50% Process Domain',
      xp: 200,
      checkUnlocked: () => (domains?.process?.percent || 0) >= 50,
      getProgress: () => domains?.process?.percent || 0
    },
    {
      id: 'business-guru',
      name: 'Business Guru',
      icon: Icons.chart,
      color: 'orange',
      tier: 'Epic',
      description: 'Master Business Environment.',
      requirement: '50% Business Domain',
      xp: 200,
      checkUnlocked: () => (domains?.business?.percent || 0) >= 50,
      getProgress: () => domains?.business?.percent || 0
    },
    {
      id: 'champion',
      name: 'Champion',
      icon: Icons.trophy,
      color: 'gradient',
      tier: 'Mythic',
      description: 'Complete all 35 modules.',
      requirement: '100% completion',
      xp: 1000,
      checkUnlocked: () => completedModules >= totalModules,
      getProgress: () => overallPercent
    },
    {
      id: 'pmp-master',
      name: 'PMP Master',
      icon: Icons.shield,
      color: 'gradient',
      tier: 'Mythic',
      description: 'Pass the final certification exam.',
      requirement: 'Pass exam with 80%+',
      xp: 2000,
      checkUnlocked: () => badges?.passedFinalExam || false,
      getProgress: () => 0
    }
  ];

  const earnedBadges = badgeDefinitions.filter(b => b.checkUnlocked());
  const lockedBadges = badgeDefinitions.filter(b => !b.checkUnlocked());

  return (
    <div className="progress-page">
      {/* Header */}
      <header className="page-header">
        <button className="back-btn" onClick={() => window.history.back()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          BACK
        </button>
        
        <div className="header-icon">
          <div className="header-bar"></div>
          <div className="header-bar"></div>
          <div className="header-bar"></div>
        </div>
        
        <div className="header-text">
          <h1>Task Mastery Overview</h1>
          <p>PMP Certification Training</p>
        </div>
        
        <div className="header-right">
          <div className="live-badge">
            <div className="live-dot"></div>
            Live
          </div>
          <div className="header-time">
            <div className="time">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
            <div className="date">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
          <div className="header-percent">{overallPercent}%</div>
        </div>
      </header>

      {/* Progress Statistics */}
      <GlassCard
        icon={Icons.stats}
        iconColor="purple"
        title="Progress Statistics"
        pill="3 metrics"
        pillColor="purple"
        subtitle="Completion tracking and task mastery"
        percent={overallPercent}
      >
        <div className="stat-large">
          <div className="value">{completedModules}<span>/{totalModules}</span></div>
          <div className="label">Started</div>
        </div>
        <div className="stat-large">
          <div className="value">{activities.completed}<span>/{activities.total}</span></div>
          <div className="label">Activities</div>
        </div>
        <div className="stat-large">
          <div className="value purple">{activities.mastered}</div>
          <div className="label">Mastered</div>
        </div>
      </GlassCard>

      {/* Activity Scores */}
      <GlassCard
        icon={Icons.stats}
        iconColor="orange"
        title="Activity Scores"
        pill="6 types"
        pillColor="orange"
        subtitle="Average performance by activity type"
        miniProgress={[2,2,2,1,1,0]}
        percent={avgScore}
      >
        <div className="stat-large">
          <div className="value orange">{avgScore}%</div>
          <div className="label">Avg Score</div>
        </div>
        <div className="stat-large">
          <div className="value">{attempts}</div>
          <div className="label">Attempts</div>
        </div>
      </GlassCard>

      {/* People Domain */}
      <GlassCard
        icon={Icons.people}
        iconColor="teal"
        title="People"
        pill={`${domains.people.total} tasks`}
        pillColor="teal"
        subtitle="Leadership & Stakeholder Management"
        miniProgress={generateMiniProgress(domains.people.done, domains.people.total)}
        stats={[
          { value: domains.people.done, label: 'Done', color: 'green' },
          { value: domains.people.active, label: 'Active', color: 'teal' },
          { value: domains.people.left, label: 'Left', color: 'muted' }
        ]}
        percent={domains.people.percent}
      />

      {/* Process Domain */}
      <GlassCard
        icon={Icons.process}
        iconColor="pink"
        title="Process"
        pill={`${domains.process.total} tasks`}
        pillColor="pink"
        subtitle="Planning, Execution & Delivery"
        miniProgress={generateMiniProgress(domains.process.done, domains.process.total)}
        stats={[
          { value: domains.process.done, label: 'Done', color: 'green' },
          { value: domains.process.active, label: 'Active', color: 'pink' },
          { value: domains.process.left, label: 'Left', color: 'muted' }
        ]}
        percent={domains.process.percent}
      />

      {/* Business Environment */}
      <GlassCard
        icon={Icons.business}
        iconColor="blue"
        title="Business Environment"
        pill={`${domains.business.total} tasks`}
        pillColor="blue"
        subtitle="Compliance, Benefits & Change"
        miniProgress={generateMiniProgress(domains.business.done, domains.business.total)}
        stats={[
          { value: domains.business.done, label: 'Done', color: 'green' },
          { value: domains.business.active, label: 'Active', color: 'teal' },
          { value: domains.business.left, label: 'Left', color: 'muted' }
        ]}
        percent={domains.business.percent}
      />

      {/* Achievement Badges */}
      <section className="badges-section">
        <GlassCard
          icon={Icons.trophy}
          iconColor="green"
          title="Achievement Badges"
          pill={`${earnedBadges.length} earned`}
          pillColor="green"
          subtitle="Rewards for mastery and dedication"
          stats={[
            { value: earnedBadges.length, label: 'Earned', color: 'green' },
            { value: lockedBadges.filter(b => b.getProgress() >= 50).length, label: 'Close', color: 'teal' },
            { value: lockedBadges.length, label: 'Left', color: 'muted' }
          ]}
          percent={Math.round((earnedBadges.length / badgeDefinitions.length) * 100)}
        />

        <div className="badges-grid">
          {/* Earned Badges First */}
          {earnedBadges.map(badge => (
            <Badge3D
              key={badge.id}
              name={badge.name}
              icon={badge.icon}
              color={badge.color}
              tier={badge.tier}
              description={badge.description}
              requirement={badge.requirement}
              xp={badge.xp}
              earnedDate={badges?.[badge.id]?.earnedDate || 'Recently'}
              isLocked={false}
            />
          ))}
          
          {/* Locked Badges */}
          {lockedBadges.map(badge => (
            <Badge3D
              key={badge.id}
              name={badge.name}
              icon={badge.icon}
              color={badge.color}
              tier={badge.tier}
              description={badge.description}
              requirement={badge.requirement}
              xp={badge.xp}
              isLocked={true}
              progress={Math.round(badge.getProgress())}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-left">
          <div className="dot"></div>
          System Online
        </div>
        <div className="footer-center">PMP Certification • {totalModules} Modules • 3 Domains</div>
        <div className="footer-right">v2.0</div>
      </footer>
    </div>
  );
};

export default Progress;
```

---

## STEP 6: Create the CSS File

Create `Progress.css` with the complete styles from the HTML file I provided. The key sections are:

1. **Page Background** - The gradient background
2. **Header Styles** - Back button, title, live badge, time, percent circle
3. **Glass Card Styles** - The frosted glass effect cards
4. **Mini Progress Bars** - The vertical bar indicators
5. **Stat Boxes** - Done/Active/Left indicators
6. **Badge 3D Styles** - All the 3D badge effects
7. **Tooltip Styles** - Hover tooltips for badges

Copy all CSS from the `<style>` section of `/mnt/user-data/outputs/pmp-dashboard-complete.html`

---

## STEP 7: Connect to Your Data

Replace the mock `useProgress` hook with your actual data source. You need:

```javascript
// Expected data structure
{
  totalModules: 35,
  completedModules: 24,
  activities: {
    completed: 168,
    total: 210,
    mastered: 18
  },
  avgScore: 87,
  attempts: 142,
  domains: {
    people: { done: 10, active: 2, left: 2, total: 14, percent: 71 },
    process: { done: 11, active: 1, left: 5, total: 17, percent: 65 },
    business: { done: 3, active: 0, left: 1, total: 4, percent: 75 }
  },
  badges: {
    streakMaster: true,
    currentStreak: 14,
    perfectQuizzes: 5,
    passedFinalExam: false,
    // Add earned dates
    'quick-start': { earnedDate: 'Dec 8' },
    'streak-master': { earnedDate: 'Dec 15' },
    // etc.
  }
}
```

---

## STEP 8: Update Routing

Make sure your router points to the new Progress component:

```jsx
// In your router configuration
<Route path="/progress" element={<Progress />} />
// or
<Route path="/my-progress" element={<Progress />} />
```

---

## STEP 9: Test Checklist

- [ ] Background gradient displays correctly
- [ ] Glass cards have blur/transparency effect
- [ ] Mini progress bars animate/display correctly
- [ ] Domain cards show correct Done/Active/Left counts
- [ ] Badges render with 3D effect
- [ ] Badge hover shows tooltip
- [ ] Earned vs Locked badges display differently
- [ ] Progress bars in tooltips show correct percentages
- [ ] Header shows live time
- [ ] Overall percentage updates based on data
- [ ] Footer displays correctly

---

## Files to Create/Modify

1. `src/components/ui/GlassCard.jsx` - New component
2. `src/components/ui/GlassCard.css` - New styles
3. `src/components/ui/Badge3D.jsx` - New component
4. `src/components/ui/Badge3D.css` - New styles
5. `src/pages/Progress.jsx` - Replace existing
6. `src/pages/Progress.css` - Replace existing
7. `src/styles/variables.css` - Add CSS custom properties

---

## Reference HTML File

The complete working HTML with all styles is at:
`/mnt/user-data/outputs/pmp-dashboard-complete.html`

Use this as the source of truth for all CSS values and structure.
