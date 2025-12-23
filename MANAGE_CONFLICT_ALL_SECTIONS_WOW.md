# MANAGE CONFLICT - ALL OVERVIEW SECTIONS "WOW" TREATMENT

---

## SECTION 2: EXAM TRIGGERS

```jsx
{/* EXAM TRIGGERS SECTION - ENHANCED */}
<div className="space-y-6">

  {/* Intro */}
  <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl p-5 border border-amber-500/20">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-2xl">🎯</div>
      <p className="text-gray-200 text-lg">
        When you see these <span className="text-amber-400 font-semibold">trigger words</span> in a question, 
        your brain should immediately shift into <span className="text-orange-400 font-semibold">conflict management mode</span>.
      </p>
    </div>
  </div>

  {/* Trigger Words Grid */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-red-400 mb-4">🚨 High-Alert Trigger Words</h4>
    <div className="flex flex-wrap gap-2">
      {["disagree", "argument", "tension", "heated", "frustrated", "clash", "dispute", "hostile", "confrontation", "resistance"].map((word, i) => (
        <span key={i} className="bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-sm font-medium border border-red-500/30">
          {word}
        </span>
      ))}
    </div>
  </div>

  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-amber-400 mb-4">⚠️ Situation Triggers</h4>
    <div className="flex flex-wrap gap-2">
      {["two team members", "refuses to", "won't speak to", "avoiding each other", "complained about", "blame", "not cooperating", "personality conflict", "raised voices"].map((word, i) => (
        <span key={i} className="bg-amber-500/20 text-amber-400 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-500/30">
          {word}
        </span>
      ))}
    </div>
  </div>

  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-blue-400 mb-4">💭 Resolution Triggers</h4>
    <div className="flex flex-wrap gap-2">
      {["resolve", "mediate", "facilitate", "consensus", "common ground", "compromise", "collaborate", "negotiate", "de-escalate", "reconcile"].map((word, i) => (
        <span key={i} className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-500/30">
          {word}
        </span>
      ))}
    </div>
  </div>

  {/* Pattern Recognition */}
  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/20">
    <h4 className="text-lg font-semibold text-purple-400 mb-4">🧠 Question Pattern Recognition</h4>
    <div className="space-y-3">
      <div className="flex items-start gap-3 bg-black/20 rounded-lg p-4">
        <div className="text-purple-400 font-mono text-sm bg-purple-500/20 px-2 py-1 rounded">Pattern 1</div>
        <div>
          <p className="text-gray-300">"Two team members disagree about [technical approach]. What should the PM do FIRST?"</p>
          <p className="text-purple-400 text-sm mt-1">→ Look for: Understand root cause before acting</p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-black/20 rounded-lg p-4">
        <div className="text-purple-400 font-mono text-sm bg-purple-500/20 px-2 py-1 rounded">Pattern 2</div>
        <div>
          <p className="text-gray-300">"A stakeholder is frustrated and confrontational in meetings. The PM should..."</p>
          <p className="text-purple-400 text-sm mt-1">→ Look for: Private conversation, understand concerns</p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-black/20 rounded-lg p-4">
        <div className="text-purple-400 font-mono text-sm bg-purple-500/20 px-2 py-1 rounded">Pattern 3</div>
        <div>
          <p className="text-gray-300">"Team members are avoiding each other after a disagreement. What's the BEST approach?"</p>
          <p className="text-purple-400 text-sm mt-1">→ Look for: Facilitate dialogue, address underlying issues</p>
        </div>
      </div>
    </div>
  </div>

  {/* Quick Decision Tree */}
  <div className="bg-black/40 rounded-xl p-5 border-l-4 border-amber-500">
    <p className="text-gray-200">
      <span className="text-amber-400 font-bold">Pro Tip:</span> When you see conflict triggers, 
      ask yourself: <span className="text-white font-semibold">"What would a calm, emotionally intelligent PM do?"</span> 
      The answer is almost never "escalate," "avoid," or "force a decision."
    </p>
  </div>
</div>
```

---

## SECTION 3: KEY FRAMEWORKS

```jsx
{/* KEY FRAMEWORKS SECTION - ENHANCED */}
<div className="space-y-6">

  {/* Thomas-Kilmann Model - The Star Framework */}
  <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl">⭐</div>
      <h4 className="text-xl font-bold text-blue-400">Thomas-Kilmann Conflict Model</h4>
      <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full">PRIMARY FRAMEWORK</span>
    </div>
    <p className="text-gray-300 mb-6">
      The #1 framework for the PMP exam. Know these five approaches cold—when to use each, and what PMI prefers.
    </p>
    
    {/* 5 Approaches Visual */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
      <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30 hover:border-emerald-500/50 transition-all hover:scale-105">
        <div className="text-center">
          <div className="text-3xl mb-2">🤝</div>
          <div className="text-emerald-400 font-bold text-lg">Collaborate</div>
          <div className="text-emerald-400/60 text-xs uppercase tracking-wide mt-1">Win-Win</div>
        </div>
        <div className="mt-3 pt-3 border-t border-emerald-500/20">
          <p className="text-gray-400 text-xs text-center">High assertiveness + High cooperation</p>
        </div>
        <div className="mt-2 bg-emerald-500/20 rounded-lg p-2">
          <p className="text-emerald-400 text-xs text-center font-semibold">⭐ PMI'S FAVORITE</p>
        </div>
      </div>

      <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30 hover:border-amber-500/50 transition-all hover:scale-105">
        <div className="text-center">
          <div className="text-3xl mb-2">⚖️</div>
          <div className="text-amber-400 font-bold text-lg">Compromise</div>
          <div className="text-amber-400/60 text-xs uppercase tracking-wide mt-1">Lose-Lose (Partial)</div>
        </div>
        <div className="mt-3 pt-3 border-t border-amber-500/20">
          <p className="text-gray-400 text-xs text-center">Medium assertiveness + Medium cooperation</p>
        </div>
        <div className="mt-2 bg-amber-500/20 rounded-lg p-2">
          <p className="text-amber-400 text-xs text-center font-semibold">TIME-PRESSURED</p>
        </div>
      </div>

      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30 hover:border-blue-500/50 transition-all hover:scale-105">
        <div className="text-center">
          <div className="text-3xl mb-2">🎁</div>
          <div className="text-blue-400 font-bold text-lg">Accommodate</div>
          <div className="text-blue-400/60 text-xs uppercase tracking-wide mt-1">Lose-Win</div>
        </div>
        <div className="mt-3 pt-3 border-t border-blue-500/20">
          <p className="text-gray-400 text-xs text-center">Low assertiveness + High cooperation</p>
        </div>
        <div className="mt-2 bg-blue-500/20 rounded-lg p-2">
          <p className="text-blue-400 text-xs text-center font-semibold">RELATIONSHIP PRIORITY</p>
        </div>
      </div>

      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30 hover:border-red-500/50 transition-all hover:scale-105">
        <div className="text-center">
          <div className="text-3xl mb-2">💪</div>
          <div className="text-red-400 font-bold text-lg">Force/Direct</div>
          <div className="text-red-400/60 text-xs uppercase tracking-wide mt-1">Win-Lose</div>
        </div>
        <div className="mt-3 pt-3 border-t border-red-500/20">
          <p className="text-gray-400 text-xs text-center">High assertiveness + Low cooperation</p>
        </div>
        <div className="mt-2 bg-red-500/20 rounded-lg p-2">
          <p className="text-red-400 text-xs text-center font-semibold">EMERGENCIES ONLY</p>
        </div>
      </div>

      <div className="bg-gray-500/10 rounded-xl p-4 border border-gray-500/30 hover:border-gray-500/50 transition-all hover:scale-105">
        <div className="text-center">
          <div className="text-3xl mb-2">🚶</div>
          <div className="text-gray-400 font-bold text-lg">Avoid/Withdraw</div>
          <div className="text-gray-400/60 text-xs uppercase tracking-wide mt-1">Lose-Lose</div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-500/20">
          <p className="text-gray-500 text-xs text-center">Low assertiveness + Low cooperation</p>
        </div>
        <div className="mt-2 bg-gray-500/20 rounded-lg p-2">
          <p className="text-gray-400 text-xs text-center font-semibold">COOLING OFF</p>
        </div>
      </div>
    </div>

    {/* When to Use Each */}
    <div className="mt-6 bg-black/30 rounded-lg p-4">
      <h5 className="text-white font-semibold mb-3">When to Use Each Approach:</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-start gap-2">
          <span className="text-emerald-400">🤝</span>
          <span className="text-gray-300"><strong className="text-emerald-400">Collaborate:</strong> Important issues, time available, need buy-in</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-amber-400">⚖️</span>
          <span className="text-gray-300"><strong className="text-amber-400">Compromise:</strong> Moderate importance, time pressure, equal power</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-blue-400">🎁</span>
          <span className="text-gray-300"><strong className="text-blue-400">Accommodate:</strong> Issue matters more to them, preserving relationship</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-red-400">💪</span>
          <span className="text-gray-300"><strong className="text-red-400">Force:</strong> Emergency, safety, unpopular but necessary decisions</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-gray-400">🚶</span>
          <span className="text-gray-300"><strong className="text-gray-400">Avoid:</strong> Trivial issue, need cool-down time, no chance of winning</span>
        </div>
      </div>
    </div>
  </div>

  {/* Conflict Escalation Ladder */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-orange-400 mb-4">📈 Conflict Escalation Ladder</h4>
    <p className="text-gray-300 mb-4">Conflict escalates predictably. Recognize the stage to choose the right intervention:</p>
    
    <div className="relative">
      {/* Ladder visualization */}
      <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 via-amber-500 to-red-500 rounded-full"></div>
      
      <div className="space-y-4 ml-12">
        <div className="relative">
          <div className="absolute -left-8 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black"></div>
          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 font-semibold">Level 1: Discomfort</span>
              <span className="text-emerald-400/60 text-xs">EASIEST TO RESOLVE</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Something feels off but nothing specific yet. Gut feeling.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-4 h-4 bg-lime-500 rounded-full border-2 border-black"></div>
          <div className="bg-lime-500/10 rounded-lg p-3 border border-lime-500/20">
            <span className="text-lime-400 font-semibold">Level 2: Incidents</span>
            <p className="text-gray-400 text-sm mt-1">Short, sharp exchanges. Might be isolated or recurring.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-4 h-4 bg-amber-500 rounded-full border-2 border-black"></div>
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <span className="text-amber-400 font-semibold">Level 3: Misunderstanding</span>
            <p className="text-gray-400 text-sm mt-1">Motives are questioned. Assumptions fill information gaps.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-4 h-4 bg-orange-500 rounded-full border-2 border-black"></div>
          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
            <span className="text-orange-400 font-semibold">Level 4: Tension</span>
            <p className="text-gray-400 text-sm mt-1">Relationship is strained. Negative attitudes solidify.</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-4 h-4 bg-red-500 rounded-full border-2 border-black"></div>
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
            <div className="flex items-center justify-between">
              <span className="text-red-400 font-semibold">Level 5: Crisis</span>
              <span className="text-red-400/60 text-xs">HARDEST TO RESOLVE</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">Open hostility. Normal work is impossible. May need intervention.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Sources of Conflict */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-cyan-400 mb-4">🔍 Seven Sources of Project Conflict</h4>
    <p className="text-gray-400 text-sm mb-4">PMI identifies these as the most common conflict sources. Know them for the exam:</p>
    
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-2xl mb-1">📅</div>
        <div className="text-cyan-400 font-semibold text-sm">Schedules</div>
        <div className="text-gray-500 text-xs mt-1">#1 Source</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-2xl mb-1">🎯</div>
        <div className="text-cyan-400 font-semibold text-sm">Priorities</div>
        <div className="text-gray-500 text-xs mt-1">#2 Source</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-2xl mb-1">👥</div>
        <div className="text-cyan-400 font-semibold text-sm">Resources</div>
        <div className="text-gray-500 text-xs mt-1">#3 Source</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-2xl mb-1">⚙️</div>
        <div className="text-cyan-400 font-semibold text-sm">Technical</div>
        <div className="text-gray-500 text-xs mt-1">#4 Source</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-2xl mb-1">📋</div>
        <div className="text-cyan-400 font-semibold text-sm">Admin</div>
        <div className="text-gray-500 text-xs mt-1">#5 Source</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-2xl mb-1">💰</div>
        <div className="text-cyan-400 font-semibold text-sm">Cost</div>
        <div className="text-gray-500 text-xs mt-1">#6 Source</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-2xl mb-1">😤</div>
        <div className="text-cyan-400 font-semibold text-sm">Personality</div>
        <div className="text-gray-500 text-xs mt-1">#7 Source</div>
      </div>
      <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20 text-center">
        <div className="text-2xl mb-1">💡</div>
        <div className="text-purple-400 font-semibold text-sm">Exam Tip</div>
        <div className="text-gray-500 text-xs mt-1">Focus on issue, not person</div>
      </div>
    </div>
  </div>

  {/* Memory Aid */}
  <div className="bg-black/40 rounded-xl p-5 border-l-4 border-blue-500">
    <p className="text-gray-200">
      <span className="text-blue-400 font-bold">Memory Aid:</span> For Thomas-Kilmann, think 
      <span className="text-emerald-400 font-semibold"> "Collaborate First, Compromise if Rushed, Accommodate to Save Relationships, Force Only in Emergencies, Avoid to Cool Down."</span>
    </p>
  </div>
</div>
```

---

## SECTION 4: HOW TO APPLY IT

```jsx
{/* HOW TO APPLY IT SECTION - ENHANCED */}
<div className="space-y-6">

  {/* The PAUSE Method */}
  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
    <div className="flex items-center gap-3 mb-4">
      <div className="text-2xl">⏸️</div>
      <h4 className="text-xl font-bold text-emerald-400">The PAUSE Method</h4>
      <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full">YOUR GO-TO APPROACH</span>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
      <div className="bg-black/30 rounded-xl p-4 text-center">
        <div className="text-4xl font-bold text-emerald-400 mb-2">P</div>
        <div className="text-white font-semibold">Perceive</div>
        <p className="text-gray-400 text-sm mt-2">Notice the conflict early. Don't ignore warning signs.</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center">
        <div className="text-4xl font-bold text-teal-400 mb-2">A</div>
        <div className="text-white font-semibold">Analyze</div>
        <p className="text-gray-400 text-sm mt-2">Understand root cause. What's really driving this?</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center">
        <div className="text-4xl font-bold text-cyan-400 mb-2">U</div>
        <div className="text-white font-semibold">Understand</div>
        <p className="text-gray-400 text-sm mt-2">Get all perspectives. Listen before acting.</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center">
        <div className="text-4xl font-bold text-blue-400 mb-2">S</div>
        <div className="text-white font-semibold">Strategize</div>
        <p className="text-gray-400 text-sm mt-2">Choose the right approach. Match to situation.</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center">
        <div className="text-4xl font-bold text-purple-400 mb-2">E</div>
        <div className="text-white font-semibold">Execute</div>
        <p className="text-gray-400 text-sm mt-2">Act decisively. Follow through completely.</p>
      </div>
    </div>
  </div>

  {/* Step-by-Step Process */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-amber-400 mb-4">📋 Step-by-Step Conflict Resolution</h4>
    
    <div className="relative">
      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500 to-emerald-500"></div>
      
      <div className="space-y-6 ml-10">
        <div className="relative">
          <div className="absolute -left-8 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">1</div>
          <div>
            <h5 className="text-amber-400 font-semibold">Acknowledge the Conflict</h5>
            <p className="text-gray-400 text-sm mt-1">Don't pretend it doesn't exist. Name it directly but neutrally.</p>
            <div className="bg-amber-500/10 rounded-lg p-3 mt-2 border border-amber-500/20">
              <p className="text-gray-300 text-sm italic">"I've noticed some tension around the deployment timeline. Let's address it directly."</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">2</div>
          <div>
            <h5 className="text-orange-400 font-semibold">Create Safe Space</h5>
            <p className="text-gray-400 text-sm mt-1">Private setting. Neutral ground. No audience, no ambush.</p>
            <div className="bg-orange-500/10 rounded-lg p-3 mt-2 border border-orange-500/20">
              <p className="text-gray-300 text-sm italic">"Can we grab a room and talk through this? Just the three of us, no agenda."</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-black font-bold text-sm">3</div>
          <div>
            <h5 className="text-blue-400 font-semibold">Listen to All Sides</h5>
            <p className="text-gray-400 text-sm mt-1">Equal airtime. No interruptions. Reflect back what you hear.</p>
            <div className="bg-blue-500/10 rounded-lg p-3 mt-2 border border-blue-500/20">
              <p className="text-gray-300 text-sm italic">"Help me understand your perspective. What matters most to you here?"</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-black font-bold text-sm">4</div>
          <div>
            <h5 className="text-purple-400 font-semibold">Find Common Ground</h5>
            <p className="text-gray-400 text-sm mt-1">What do both parties actually agree on? Start there.</p>
            <div className="bg-purple-500/10 rounded-lg p-3 mt-2 border border-purple-500/20">
              <p className="text-gray-300 text-sm italic">"It sounds like you both want the release to succeed. You just disagree on how to get there."</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-black font-bold text-sm">5</div>
          <div>
            <h5 className="text-emerald-400 font-semibold">Develop Options Together</h5>
            <p className="text-gray-400 text-sm mt-1">Brainstorm solutions. They create, you facilitate.</p>
            <div className="bg-emerald-500/10 rounded-lg p-3 mt-2 border border-emerald-500/20">
              <p className="text-gray-300 text-sm italic">"What would need to be true for both of you to feel good about the outcome?"</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-8 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-black font-bold text-sm">6</div>
          <div>
            <h5 className="text-teal-400 font-semibold">Agree on Action & Follow Up</h5>
            <p className="text-gray-400 text-sm mt-1">Document the agreement. Schedule a check-in. Don't declare victory too soon.</p>
            <div className="bg-teal-500/10 rounded-lg p-3 mt-2 border border-teal-500/20">
              <p className="text-gray-300 text-sm italic">"Let's capture what we agreed to. I'll check in with both of you next week to see how it's going."</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Facilitation Phrases */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-cyan-400 mb-4">💬 Power Phrases for Conflict Resolution</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-cyan-500/10 rounded-lg p-4 border border-cyan-500/20">
        <div className="text-cyan-400 font-semibold mb-2">Opening the Conversation</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>"Help me understand your perspective..."</li>
          <li>"I've noticed some tension and want to address it..."</li>
          <li>"What's most important to you in this situation?"</li>
        </ul>
      </div>
      <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
        <div className="text-emerald-400 font-semibold mb-2">Finding Common Ground</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>"It sounds like you both want..."</li>
          <li>"What do you agree on?"</li>
          <li>"Where is there flexibility?"</li>
        </ul>
      </div>
      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
        <div className="text-purple-400 font-semibold mb-2">De-escalating</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>"Let's take a step back..."</li>
          <li>"I hear that this is frustrating..."</li>
          <li>"Can we focus on the problem, not each other?"</li>
        </ul>
      </div>
      <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
        <div className="text-amber-400 font-semibold mb-2">Moving Forward</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>"What would a good outcome look like?"</li>
          <li>"What's one thing we can try?"</li>
          <li>"How will we know this is resolved?"</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Pro Tip */}
  <div className="bg-black/40 rounded-xl p-5 border-l-4 border-emerald-500">
    <p className="text-gray-200">
      <span className="text-emerald-400 font-bold">Pro Tip:</span> The goal isn't to be the 
      <span className="text-white font-semibold"> judge </span>who decides who's right. 
      It's to be the <span className="text-emerald-400 font-semibold">facilitator</span> who helps them find a solution together.
    </p>
  </div>
</div>
```

---

## SECTION 5: QUICK SCENARIOS

```jsx
{/* QUICK SCENARIOS SECTION - ENHANCED */}
<div className="space-y-6">

  <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20">
    <p className="text-gray-200">
      <span className="text-purple-400 font-semibold">Test your instincts:</span> For each scenario, 
      identify the RIGHT approach and the WRONG approach. Think before revealing!
    </p>
  </div>

  {/* Scenario Cards */}
  <div className="space-y-4">
    
    {/* Scenario 1 */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="bg-blue-500/30 text-blue-400 font-bold px-3 py-1 rounded-full text-sm">1</span>
          <span className="text-white font-semibold">Two developers argue about code architecture in a team meeting.</span>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            RIGHT
          </div>
          <p className="text-gray-300 text-sm">Acknowledge both perspectives, take the detailed discussion offline, facilitate a focused technical review with relevant stakeholders.</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <div className="text-red-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            WRONG
          </div>
          <p className="text-gray-300 text-sm">Let the argument continue publicly, pick a winner on the spot, or dismiss the disagreement as unimportant.</p>
        </div>
      </div>
    </div>

    {/* Scenario 2 */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="bg-amber-500/30 text-amber-400 font-bold px-3 py-1 rounded-full text-sm">2</span>
          <span className="text-white font-semibold">A stakeholder sends an angry email blaming your team for a delay.</span>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            RIGHT
          </div>
          <p className="text-gray-300 text-sm">Respond calmly, acknowledge their frustration, request a call to discuss and understand their concerns, then address the root cause.</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <div className="text-red-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            WRONG
          </div>
          <p className="text-gray-300 text-sm">Reply-all with a defensive response, ignore the email, or immediately escalate without attempting direct conversation.</p>
        </div>
      </div>
    </div>

    {/* Scenario 3 */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500/30 text-emerald-400 font-bold px-3 py-1 rounded-full text-sm">3</span>
          <span className="text-white font-semibold">Two team members refuse to speak to each other after a disagreement.</span>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            RIGHT
          </div>
          <p className="text-gray-300 text-sm">Meet with each individually first to understand perspectives, then facilitate a structured conversation focused on moving forward.</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <div className="text-red-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            WRONG
          </div>
          <p className="text-gray-300 text-sm">Hope it resolves itself, force them into a room unprepared, or reassign one to avoid dealing with it.</p>
        </div>
      </div>
    </div>

    {/* Scenario 4 */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="bg-red-500/30 text-red-400 font-bold px-3 py-1 rounded-full text-sm">4</span>
          <span className="text-white font-semibold">A heated argument breaks out during sprint planning.</span>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            RIGHT
          </div>
          <p className="text-gray-300 text-sm">Call a brief break, let emotions cool, then resume with ground rules. Address the underlying issue separately if needed.</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <div className="text-red-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            WRONG
          </div>
          <p className="text-gray-300 text-sm">Let the argument continue, take sides publicly, or pretend nothing is happening and push through the agenda.</p>
        </div>
      </div>
    </div>

    {/* Scenario 5 */}
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="bg-cyan-500/30 text-cyan-400 font-bold px-3 py-1 rounded-full text-sm">5</span>
          <span className="text-white font-semibold">You discover a conflict exists but both parties deny there's a problem.</span>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
          <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            RIGHT
          </div>
          <p className="text-gray-300 text-sm">Share specific observations (not accusations), express concern for team dynamics, and create safety for honest conversation.</p>
        </div>
        <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
          <div className="text-red-400 font-semibold mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            WRONG
          </div>
          <p className="text-gray-300 text-sm">Accuse them of lying, drop it entirely, or gossip with others about the "real" situation.</p>
        </div>
      </div>
    </div>
  </div>

  {/* Key Takeaway */}
  <div className="bg-black/40 rounded-xl p-5 border-l-4 border-purple-500">
    <p className="text-gray-200">
      <span className="text-purple-400 font-bold">Pattern:</span> Notice that the RIGHT approach always involves 
      <span className="text-white font-semibold"> understanding before acting</span>, 
      <span className="text-white font-semibold"> private before public</span>, and 
      <span className="text-white font-semibold"> facilitating rather than judging</span>.
    </p>
  </div>
</div>
```

---

## SECTION 6: COMMON MISTAKES

```jsx
{/* COMMON MISTAKES SECTION - ENHANCED */}
<div className="space-y-6">

  <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 rounded-xl p-5 border border-red-500/20">
    <p className="text-gray-200">
      <span className="text-red-400 font-semibold">Watch out:</span> These mistakes appear as 
      <span className="text-white font-semibold"> tempting but wrong </span> answer choices on the exam—and 
      they'll derail you in real projects too.
    </p>
  </div>

  {/* Mistake Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-500/20 rounded-full p-2">
          <span className="text-xl">🙈</span>
        </div>
        <h4 className="text-red-400 font-semibold">The Avoider</h4>
      </div>
      <p className="text-gray-300 text-sm mb-3">Hoping conflict will resolve itself. Ignoring tension. Pretending everything is fine.</p>
      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <p className="text-red-400 text-xs font-semibold mb-1">WHY IT FAILS:</p>
        <p className="text-gray-400 text-xs">Conflict festers and escalates. Small issues become major rifts. Trust erodes.</p>
      </div>
    </div>

    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-500/20 rounded-full p-2">
          <span className="text-xl">⚖️</span>
        </div>
        <h4 className="text-red-400 font-semibold">The Judge</h4>
      </div>
      <p className="text-gray-300 text-sm mb-3">Quickly deciding who's right and wrong. Taking sides. Declaring winners and losers.</p>
      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <p className="text-red-400 text-xs font-semibold mb-1">WHY IT FAILS:</p>
        <p className="text-gray-400 text-xs">The "loser" disengages or retaliates. You're now part of the conflict. Future issues get hidden.</p>
      </div>
    </div>

    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-500/20 rounded-full p-2">
          <span className="text-xl">📢</span>
        </div>
        <h4 className="text-red-400 font-semibold">The Public Resolver</h4>
      </div>
      <p className="text-gray-300 text-sm mb-3">Addressing personal conflicts in group settings. Calling people out in meetings.</p>
      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <p className="text-red-400 text-xs font-semibold mb-1">WHY IT FAILS:</p>
        <p className="text-gray-400 text-xs">Humiliates people. Forces defensive reactions. Damages psychological safety for everyone.</p>
      </div>
    </div>

    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-500/20 rounded-full p-2">
          <span className="text-xl">🚀</span>
        </div>
        <h4 className="text-red-400 font-semibold">The Escalator</h4>
      </div>
      <p className="text-gray-300 text-sm mb-3">Immediately escalating to management before trying to resolve directly.</p>
      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <p className="text-red-400 text-xs font-semibold mb-1">WHY IT FAILS:</p>
        <p className="text-gray-400 text-xs">Makes you look ineffective. Damages your relationship with parties. Escalation should be last resort.</p>
      </div>
    </div>

    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-500/20 rounded-full p-2">
          <span className="text-xl">💨</span>
        </div>
        <h4 className="text-red-400 font-semibold">The Quick Fixer</h4>
      </div>
      <p className="text-gray-300 text-sm mb-3">Jumping to solutions before understanding the real problem. "Let's just split the difference."</p>
      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <p className="text-red-400 text-xs font-semibold mb-1">WHY IT FAILS:</p>
        <p className="text-gray-400 text-xs">Surface symptoms get addressed, root causes don't. Conflict resurfaces repeatedly.</p>
      </div>
    </div>

    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-red-500/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-red-500/20 rounded-full p-2">
          <span className="text-xl">🎭</span>
        </div>
        <h4 className="text-red-400 font-semibold">The Peacekeeper</h4>
      </div>
      <p className="text-gray-300 text-sm mb-3">Smoothing over everything. "Let's all just get along." Suppressing healthy disagreement.</p>
      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <p className="text-red-400 text-xs font-semibold mb-1">WHY IT FAILS:</p>
        <p className="text-gray-400 text-xs">Real issues go underground. Team loses ability to have productive disagreements. Groupthink sets in.</p>
      </div>
    </div>
  </div>

  {/* What PMI Prefers */}
  <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20">
    <h4 className="text-lg font-semibold text-emerald-400 mb-4">✅ What PMI Prefers Instead</h4>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-3xl mb-2">🔍</div>
        <div className="text-white font-semibold">Investigate First</div>
        <p className="text-gray-400 text-sm mt-1">Understand root cause before choosing an approach</p>
      </div>
      <div className="text-center">
        <div className="text-3xl mb-2">🤝</div>
        <div className="text-white font-semibold">Facilitate, Don't Judge</div>
        <p className="text-gray-400 text-sm mt-1">Help parties find their own solution</p>
      </div>
      <div className="text-center">
        <div className="text-3xl mb-2">🎯</div>
        <div className="text-white font-semibold">Address Early</div>
        <p className="text-gray-400 text-sm mt-1">Deal with issues when they're still small</p>
      </div>
    </div>
  </div>

  {/* Exam Trap Alert */}
  <div className="bg-black/40 rounded-xl p-5 border-l-4 border-amber-500">
    <p className="text-gray-200">
      <span className="text-amber-400 font-bold">⚠️ Exam Trap:</span> Wrong answers often sound decisive and action-oriented: 
      <span className="text-gray-400 italic"> "Tell them to work it out," "Escalate to HR," "Make the decision for them."</span> 
      The right answer usually involves <span className="text-emerald-400 font-semibold">understanding first, then facilitating a collaborative solution</span>.
    </p>
  </div>
</div>
```

---

## SECTION 7: KEY TAKEAWAYS

```jsx
{/* KEY TAKEAWAYS SECTION - ENHANCED */}
<div className="space-y-6">

  {/* The Big 5 */}
  <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20">
    <h4 className="text-xl font-bold text-white mb-6 text-center">🏆 The Big 5: What You MUST Remember</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="bg-black/30 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">🤝</div>
        <div className="text-emerald-400 font-bold">Collaborate First</div>
        <p className="text-gray-400 text-xs mt-2">PMI's preferred approach when time allows</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">⏰</div>
        <div className="text-blue-400 font-bold">Early Is Better</div>
        <p className="text-gray-400 text-xs mt-2">Address conflict before it escalates</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">🔍</div>
        <div className="text-purple-400 font-bold">Understand First</div>
        <p className="text-gray-400 text-xs mt-2">Root cause before resolution</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">🚪</div>
        <div className="text-amber-400 font-bold">Private Settings</div>
        <p className="text-gray-400 text-xs mt-2">Personal conflicts need private space</p>
      </div>
      <div className="bg-black/30 rounded-xl p-4 text-center transform hover:scale-105 transition-transform">
        <div className="text-4xl mb-3">❤️</div>
        <div className="text-rose-400 font-bold">Protect Relationships</div>
        <p className="text-gray-400 text-xs mt-2">Long-term collaboration > short-term win</p>
      </div>
    </div>
  </div>

  {/* Thomas-Kilmann Cheat Sheet */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-cyan-400 mb-4">📋 Thomas-Kilmann Cheat Sheet</h4>
    
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left p-3 text-gray-400">Approach</th>
            <th className="text-left p-3 text-gray-400">When to Use</th>
            <th className="text-left p-3 text-gray-400">Outcome</th>
            <th className="text-center p-3 text-gray-400">PMI Preference</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-white/10 bg-emerald-500/5">
            <td className="p-3 text-emerald-400 font-semibold">Collaborate</td>
            <td className="p-3 text-gray-300">Important issue, time available, need buy-in</td>
            <td className="p-3 text-gray-300">Win-Win</td>
            <td className="p-3 text-center"><span className="text-emerald-400 text-lg">⭐⭐⭐</span></td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="p-3 text-amber-400 font-semibold">Compromise</td>
            <td className="p-3 text-gray-300">Moderate importance, time pressure</td>
            <td className="p-3 text-gray-300">Partial Win-Win</td>
            <td className="p-3 text-center"><span className="text-amber-400 text-lg">⭐⭐</span></td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="p-3 text-blue-400 font-semibold">Accommodate</td>
            <td className="p-3 text-gray-300">Issue matters more to them, save relationship</td>
            <td className="p-3 text-gray-300">Lose-Win</td>
            <td className="p-3 text-center"><span className="text-blue-400 text-lg">⭐⭐</span></td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="p-3 text-red-400 font-semibold">Force</td>
            <td className="p-3 text-gray-300">Emergency, safety, unpopular necessity</td>
            <td className="p-3 text-gray-300">Win-Lose</td>
            <td className="p-3 text-center"><span className="text-red-400 text-lg">⭐</span></td>
          </tr>
          <tr>
            <td className="p-3 text-gray-400 font-semibold">Avoid</td>
            <td className="p-3 text-gray-300">Trivial issue, need cool-down, no chance</td>
            <td className="p-3 text-gray-300">Lose-Lose</td>
            <td className="p-3 text-center"><span className="text-gray-400 text-lg">⭐</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  {/* Exam Quick Reference */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-purple-400 mb-4">🎯 Exam Quick Reference</h4>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
        <div className="text-emerald-400 font-semibold mb-2">If the question asks "FIRST"...</div>
        <p className="text-gray-300 text-sm">Usually: Understand the situation, investigate root cause, or meet privately with parties.</p>
      </div>
      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
        <div className="text-blue-400 font-semibold mb-2">If the question asks "BEST"...</div>
        <p className="text-gray-300 text-sm">Usually: Collaborate or facilitate. Look for win-win approaches.</p>
      </div>
      <div className="bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
        <div className="text-amber-400 font-semibold mb-2">If it's time-pressured...</div>
        <p className="text-gray-300 text-sm">Compromise may be acceptable. Quick resolution over perfect resolution.</p>
      </div>
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-2">If it's a safety/emergency...</div>
        <p className="text-gray-300 text-sm">Force/Direct is acceptable. Crisis situations justify command decisions.</p>
      </div>
    </div>
  </div>

  {/* Final Memory Hook */}
  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
    <h4 className="text-lg font-semibold text-white mb-4 text-center">🧠 Memory Hook</h4>
    <p className="text-2xl text-center text-gray-200 font-light">
      "<span className="text-emerald-400 font-semibold">Understand</span> before you act. 
      <span className="text-blue-400 font-semibold">Facilitate</span>, don't judge. 
      <span className="text-purple-400 font-semibold">Collaborate</span> when you can. 
      <span className="text-amber-400 font-semibold">Protect</span> the relationship."
    </p>
  </div>

  {/* Bottom Line */}
  <div className="bg-black/40 rounded-xl p-5 border-l-4 border-emerald-500">
    <p className="text-gray-200 text-lg">
      <span className="text-emerald-400 font-bold">Bottom Line:</span> On the exam and in real life, 
      the best conflict managers are <span className="text-white font-semibold">emotionally intelligent facilitators</span> who 
      help people find solutions together—not judges who pick winners.
    </p>
  </div>
</div>
```

---

## CURSOR INSTRUCTIONS

```
Enhance ALL sections in Manage Conflict Overview tab with the "wow" treatment.

Replace each section with the enhanced version from MANAGE_CONFLICT_ALL_SECTIONS_WOW.md:

1. **Exam Triggers** - Trigger word tags (color-coded), pattern recognition, pro tip
2. **Key Frameworks** - Thomas-Kilmann 5-card visual with icons, Escalation Ladder, 7 Sources grid
3. **How to Apply It** - PAUSE method visual, 6-step process with example phrases, Power Phrases grid
4. **Quick Scenarios** - 5 scenario cards with RIGHT/WRONG side-by-side comparisons
5. **Common Mistakes** - 6 mistake cards with "why it fails", PMI preferences
6. **Key Takeaways** - Big 5 visual, Thomas-Kilmann cheat sheet table, Exam Quick Reference, Memory Hook

Each section should have:
- Gradient headers and callouts
- Visual elements (icons, cards, color-coded tags)
- Interactive hover effects where appropriate
- Pro tips / bottom line callouts with left border accent
```
