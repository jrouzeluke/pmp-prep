# EMPOWER TEAM LEARNING PAGE FIXES

## Summary of Issues to Fix

1. **Overview Tab** - Key Frameworks (blank), How to Apply It (blank)
2. **PMP Application Tab** - Exam Strategy (blank)
3. **Deep Dive Tab** - Practical Application (blank), Delegation Continuum (showing code)
4. **Connections to Other Tasks** - Remove "ECO", make related tasks clickable buttons with navigation

---

## FIX 1: Overview Tab - Key Frameworks

Replace the empty Key Frameworks section with this content:

```jsx
{/* KEY FRAMEWORKS SECTION */}
<div className="space-y-6">
  <p className="text-gray-300">
    Three frameworks help you think about empowerment systematically:
  </p>

  {/* Empowerment Triangle */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-emerald-400 mb-4">The Empowerment Triangle</h4>
    <p className="text-gray-300 mb-4">
      All three elements must be present. Missing any one creates dysfunction:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30">
        <div className="text-emerald-400 font-semibold mb-2">Authority</div>
        <p className="text-gray-400 text-sm">The power to make decisions and take action within defined boundaries</p>
        <p className="text-gray-500 text-xs mt-2 italic">Without authority: Responsibility without power = frustration</p>
      </div>
      <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/30">
        <div className="text-blue-400 font-semibold mb-2">Accountability</div>
        <p className="text-gray-400 text-sm">Ownership of outcomes—both credit for success and responsibility for problems</p>
        <p className="text-gray-500 text-xs mt-2 italic">Without accountability: Authority without ownership = carelessness</p>
      </div>
      <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
        <div className="text-purple-400 font-semibold mb-2">Autonomy</div>
        <p className="text-gray-400 text-sm">Freedom to choose HOW to accomplish goals within constraints</p>
        <p className="text-gray-500 text-xs mt-2 italic">Without autonomy: Authority to decide but not to act = paralysis</p>
      </div>
    </div>
  </div>

  {/* Delegation Levels Summary */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-amber-400 mb-4">The Four Delegation Levels</h4>
    <p className="text-gray-300 mb-4">
      Match your delegation level to the person's capability and the decision's stakes:
    </p>
    <div className="space-y-3">
      <div className="flex items-center gap-4 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <div className="bg-red-500/20 rounded-full px-3 py-1 text-red-400 text-sm font-mono">L1</div>
        <div>
          <span className="text-red-400 font-semibold">Direct (Tell)</span>
          <span className="text-gray-400 ml-2">— PM decides, team executes as directed</span>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
        <div className="bg-orange-500/20 rounded-full px-3 py-1 text-orange-400 text-sm font-mono">L2</div>
        <div>
          <span className="text-orange-400 font-semibold">Coach (Sell)</span>
          <span className="text-gray-400 ml-2">— PM decides, explains reasoning, teaches</span>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
        <div className="bg-blue-500/20 rounded-full px-3 py-1 text-blue-400 text-sm font-mono">L3</div>
        <div>
          <span className="text-blue-400 font-semibold">Support (Participate)</span>
          <span className="text-gray-400 ml-2">— PM facilitates, team decides with input</span>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
        <div className="bg-emerald-500/20 rounded-full px-3 py-1 text-emerald-400 text-sm font-mono">L4</div>
        <div>
          <span className="text-emerald-400 font-semibold">Delegate (Entrust)</span>
          <span className="text-gray-400 ml-2">— Team has full ownership and authority</span>
        </div>
      </div>
    </div>
  </div>

  {/* RACI at a Glance */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-cyan-400 mb-4">RACI for Clarity</h4>
    <p className="text-gray-300 mb-4">
      Use RACI to make authority explicit and prevent confusion:
    </p>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-cyan-400 text-2xl font-bold">R</div>
        <div className="text-gray-300 text-sm">Responsible</div>
        <div className="text-gray-500 text-xs">Does the work</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-cyan-400 text-2xl font-bold">A</div>
        <div className="text-gray-300 text-sm">Accountable</div>
        <div className="text-gray-500 text-xs">Owns the outcome</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-cyan-400 text-2xl font-bold">C</div>
        <div className="text-gray-300 text-sm">Consulted</div>
        <div className="text-gray-500 text-xs">Provides input</div>
      </div>
      <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/20 text-center">
        <div className="text-cyan-400 text-2xl font-bold">I</div>
        <div className="text-gray-300 text-sm">Informed</div>
        <div className="text-gray-500 text-xs">Kept in the loop</div>
      </div>
    </div>
    <p className="text-amber-400/80 text-sm mt-4 italic">
      💡 Key Rule: Only ONE person can be Accountable for any deliverable
    </p>
  </div>
</div>
```

---

## FIX 2: Overview Tab - How to Apply It

Replace the empty How to Apply It section with this content:

```jsx
{/* HOW TO APPLY IT SECTION */}
<div className="space-y-6">
  
  {/* Organizing Around Strengths */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-emerald-400 mb-4">Organizing Around Strengths</h4>
    <p className="text-gray-300 mb-4">
      Empowerment starts with putting people where they can succeed:
    </p>
    <div className="space-y-3">
      <div className="flex items-start gap-3">
        <div className="text-emerald-400 mt-1">✦</div>
        <div>
          <span className="text-gray-200 font-medium">Know your team's capabilities</span>
          <span className="text-gray-400"> — Understand technical skills, experience levels, and growth areas</span>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="text-emerald-400 mt-1">✦</div>
        <div>
          <span className="text-gray-200 font-medium">Match assignments to strengths</span>
          <span className="text-gray-400"> — Give people work that leverages what they do well</span>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="text-emerald-400 mt-1">✦</div>
        <div>
          <span className="text-gray-200 font-medium">Create stretch opportunities</span>
          <span className="text-gray-400"> — Assign challenging work with appropriate support structure</span>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="text-emerald-400 mt-1">✦</div>
        <div>
          <span className="text-gray-200 font-medium">Balance workload fairly</span>
          <span className="text-gray-400"> — Don't overload your best performers; develop everyone</span>
        </div>
      </div>
    </div>
  </div>

  {/* Bestowing Authority */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-blue-400 mb-4">Bestowing Decision-Making Authority</h4>
    <p className="text-gray-300 mb-4">
      Make authority explicit — don't leave people guessing about what they can decide:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
        <div className="text-green-400 font-semibold mb-2">✓ DO</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• Define clear decision boundaries</li>
          <li>• State explicitly what they CAN decide</li>
          <li>• Specify when to escalate</li>
          <li>• Match authority to accountability</li>
          <li>• Adjust as capability grows</li>
        </ul>
      </div>
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-2">✗ DON'T</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• Say "use your judgment" without boundaries</li>
          <li>• Give responsibility without authority</li>
          <li>• Override decisions after delegating</li>
          <li>• Change rules without communication</li>
          <li>• Delegate to avoid accountability yourself</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Supporting Accountability */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-purple-400 mb-4">Supporting Accountability</h4>
    <p className="text-gray-300 mb-4">
      Accountability requires ongoing support, not just assignment and hope:
    </p>
    <div className="space-y-3">
      <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
        <div className="text-purple-400 font-bold text-lg">1</div>
        <div>
          <span className="text-gray-200 font-medium">Set clear expectations</span>
          <p className="text-gray-400 text-sm">Define what success looks like and by when</p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
        <div className="text-purple-400 font-bold text-lg">2</div>
        <div>
          <span className="text-gray-200 font-medium">Provide necessary resources</span>
          <p className="text-gray-400 text-sm">Tools, information, access, and budget to succeed</p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
        <div className="text-purple-400 font-bold text-lg">3</div>
        <div>
          <span className="text-gray-200 font-medium">Remove obstacles</span>
          <p className="text-gray-400 text-sm">Clear organizational barriers they can't remove themselves</p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
        <div className="text-purple-400 font-bold text-lg">4</div>
        <div>
          <span className="text-gray-200 font-medium">Monitor outcomes, not activity</span>
          <p className="text-gray-400 text-sm">Check results at appropriate intervals; don't micromanage steps</p>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
        <div className="text-purple-400 font-bold text-lg">5</div>
        <div>
          <span className="text-gray-200 font-medium">Give feedback promptly</span>
          <p className="text-gray-400 text-sm">Celebrate wins, address issues early, help them learn</p>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

## FIX 3: PMP Application Tab - Exam Strategy

Replace the empty Exam Strategy section with this content:

```jsx
{/* EXAM STRATEGY SECTION */}
<div className="space-y-6">

  {/* Decision Guide */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-emerald-400 mb-4">The Empowerment Decision Guide</h4>
    <p className="text-gray-300 mb-4">
      When facing an empowerment question, run through these four checks:
    </p>
    <div className="space-y-3">
      <div className="flex items-center gap-4 bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
        <div className="text-emerald-400 text-2xl">1</div>
        <div>
          <span className="text-gray-200 font-medium">Does this INCREASE or DECREASE the team's ability to act?</span>
          <p className="text-gray-400 text-sm">Choose answers that expand capability, not restrict it</p>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
        <div className="text-blue-400 text-2xl">2</div>
        <div>
          <span className="text-gray-200 font-medium">Does this BUILD or DIMINISH trust?</span>
          <p className="text-gray-400 text-sm">PMI values trust-building leadership</p>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
        <div className="text-purple-400 text-2xl">3</div>
        <div>
          <span className="text-gray-200 font-medium">Does this CREATE or PREVENT ownership?</span>
          <p className="text-gray-400 text-sm">Empowerment requires genuine ownership</p>
        </div>
      </div>
      <div className="flex items-center gap-4 bg-amber-500/10 rounded-lg p-4 border border-amber-500/20">
        <div className="text-amber-400 text-2xl">4</div>
        <div>
          <span className="text-gray-200 font-medium">Does this MATCH authority to capability?</span>
          <p className="text-gray-400 text-sm">Right level for the right person at the right time</p>
        </div>
      </div>
    </div>
  </div>

  {/* Phrase Recognition */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-cyan-400 mb-4">Key Phrase Recognition</h4>
    <p className="text-gray-300 mb-4">
      Watch for these trigger phrases that signal empowerment questions:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="text-cyan-400 font-semibold mb-2">Phrases Suggesting MORE Delegation</div>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• "Experienced team member..."</li>
          <li>• "Proven track record..."</li>
          <li>• "Senior developer..."</li>
          <li>• "Has successfully delivered..."</li>
          <li>• "Self-organizing team..."</li>
          <li>• "Subject matter expert..."</li>
        </ul>
      </div>
      <div>
        <div className="text-orange-400 font-semibold mb-2">Phrases Suggesting LESS Delegation</div>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• "New to the role..."</li>
          <li>• "First time leading..."</li>
          <li>• "Recently joined..."</li>
          <li>• "High-stakes decision..."</li>
          <li>• "Compliance requirement..."</li>
          <li>• "Crisis situation..."</li>
        </ul>
      </div>
    </div>
  </div>

  {/* DO vs DON'T */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-amber-400 mb-4">Answer Selection: DO vs DON'T</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
        <div className="text-green-400 font-semibold mb-3">✓ Choose Answers That...</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• Trust capable team members with decisions</li>
          <li>• Provide authority matching responsibility</li>
          <li>• Support self-organization in agile teams</li>
          <li>• Monitor outcomes rather than activities</li>
          <li>• Clear obstacles the team can't remove</li>
          <li>• Adjust delegation as capability grows</li>
        </ul>
      </div>
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-3">✗ Avoid Answers That...</div>
        <ul className="text-gray-300 text-sm space-y-2">
          <li>• Micromanage experienced professionals</li>
          <li>• Require PM approval for routine decisions</li>
          <li>• Take over work the team can handle</li>
          <li>• Give responsibility without authority</li>
          <li>• Abandon without support (abdication)</li>
          <li>• Override team decisions unnecessarily</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Trap Patterns */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-red-400 mb-4">Common Trap Patterns</h4>
    <div className="space-y-4">
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-2">Trap 1: The "Helpful" Takeover</div>
        <p className="text-gray-400 text-sm">
          Wrong answer sounds supportive: "PM steps in to ensure quality by personally reviewing..." 
          <span className="text-red-400"> — This is micromanagement disguised as help</span>
        </p>
      </div>
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-2">Trap 2: The Full Delegation Trap</div>
        <p className="text-gray-400 text-sm">
          Wrong answer for new/struggling team: "PM delegates full authority to team member..." 
          <span className="text-red-400"> — Match delegation level to actual capability</span>
        </p>
      </div>
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-2">Trap 3: The Process Over People Trap</div>
        <p className="text-gray-400 text-sm">
          Wrong answer adds bureaucracy: "PM creates approval process for all team decisions..." 
          <span className="text-red-400"> — Process should enable, not constrain</span>
        </p>
      </div>
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-2">Trap 4: The "Equal Treatment" Trap</div>
        <p className="text-gray-400 text-sm">
          Wrong answer applies one-size-fits-all: "PM applies same oversight to all team members..." 
          <span className="text-red-400"> — Treat people appropriately to their level</span>
        </p>
      </div>
    </div>
  </div>

  {/* Quick Memory Aid */}
  <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl p-6 border border-emerald-500/20">
    <h4 className="text-lg font-semibold text-white mb-3">💡 Quick Memory Aid</h4>
    <p className="text-gray-300 text-lg text-center">
      "Empowerment means giving people the <span className="text-emerald-400 font-semibold">authority</span> they need, 
      the <span className="text-blue-400 font-semibold">accountability</span> they deserve, 
      and the <span className="text-purple-400 font-semibold">support</span> to succeed."
    </p>
  </div>
</div>
```

---

## FIX 4: Deep Dive Tab - Practical Application

Replace the empty Practical Application section with this content:

```jsx
{/* PRACTICAL APPLICATION SECTION */}
<div className="space-y-6">
  <p className="text-gray-300">
    These five techniques help you implement empowerment systematically in real projects:
  </p>

  {/* Technique 1: Delegation Checklist */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-emerald-500/20 rounded-full w-8 h-8 flex items-center justify-center text-emerald-400 font-bold">1</div>
      <h4 className="text-lg font-semibold text-emerald-400">The Delegation Checklist</h4>
    </div>
    <p className="text-gray-300 mb-4">
      Before delegating any significant task, confirm these five elements:
    </p>
    <div className="bg-black/30 rounded-lg p-4 space-y-2">
      <div className="flex items-center gap-3 text-gray-300">
        <div className="text-emerald-400">□</div>
        <span><strong>Clear outcome:</strong> They know what success looks like</span>
      </div>
      <div className="flex items-center gap-3 text-gray-300">
        <div className="text-emerald-400">□</div>
        <span><strong>Defined authority:</strong> They know what they can decide</span>
      </div>
      <div className="flex items-center gap-3 text-gray-300">
        <div className="text-emerald-400">□</div>
        <span><strong>Sufficient resources:</strong> They have tools, budget, and access needed</span>
      </div>
      <div className="flex items-center gap-3 text-gray-300">
        <div className="text-emerald-400">□</div>
        <span><strong>Timeline clarity:</strong> They know when it's due and key milestones</span>
      </div>
      <div className="flex items-center gap-3 text-gray-300">
        <div className="text-emerald-400">□</div>
        <span><strong>Support available:</strong> They know when and how to get help</span>
      </div>
    </div>
    <p className="text-amber-400/80 text-sm mt-4 italic">
      If you can't check all five boxes, you're setting them up to fail.
    </p>
  </div>

  {/* Technique 2: Completed Staff Work */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-blue-500/20 rounded-full w-8 h-8 flex items-center justify-center text-blue-400 font-bold">2</div>
      <h4 className="text-lg font-semibold text-blue-400">Completed Staff Work</h4>
    </div>
    <p className="text-gray-300 mb-4">
      Teach team members to bring solutions, not just problems. The four-level framework:
    </p>
    <div className="space-y-3">
      <div className="flex items-start gap-3 bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <div className="text-red-400 font-mono text-sm">L1</div>
        <div>
          <span className="text-red-400 font-medium">Investigate</span>
          <span className="text-gray-400"> — "Here are the options I found"</span>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
        <div className="text-orange-400 font-mono text-sm">L2</div>
        <div>
          <span className="text-orange-400 font-medium">Recommend</span>
          <span className="text-gray-400"> — "Here's what I recommend and why"</span>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
        <div className="text-blue-400 font-mono text-sm">L3</div>
        <div>
          <span className="text-blue-400 font-medium">Decide & Inform</span>
          <span className="text-gray-400"> — "I decided X, here's why, FYI"</span>
        </div>
      </div>
      <div className="flex items-start gap-3 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
        <div className="text-emerald-400 font-mono text-sm">L4</div>
        <div>
          <span className="text-emerald-400 font-medium">Decide & Act</span>
          <span className="text-gray-400"> — "Done. Results attached."</span>
        </div>
      </div>
    </div>
    <p className="text-gray-400 text-sm mt-4">
      Progress team members from L1 → L4 as they demonstrate capability.
    </p>
  </div>

  {/* Technique 3: RACI Conversation */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-purple-500/20 rounded-full w-8 h-8 flex items-center justify-center text-purple-400 font-bold">3</div>
      <h4 className="text-lg font-semibold text-purple-400">The RACI Conversation</h4>
    </div>
    <p className="text-gray-300 mb-4">
      For ambiguous situations, have an explicit conversation using these prompts:
    </p>
    <div className="bg-black/30 rounded-lg p-4 space-y-3">
      <p className="text-gray-300">
        <span className="text-purple-400 font-medium">"For this deliverable..."</span>
      </p>
      <ul className="text-gray-300 ml-4 space-y-2">
        <li>• <span className="text-cyan-400">Who is doing the work?</span> (Responsible)</li>
        <li>• <span className="text-cyan-400">Who owns the final outcome?</span> (Accountable)</li>
        <li>• <span className="text-cyan-400">Who needs to give input before decisions?</span> (Consulted)</li>
        <li>• <span className="text-cyan-400">Who needs to know what was decided?</span> (Informed)</li>
      </ul>
    </div>
    <p className="text-gray-400 text-sm mt-4">
      Make this conversation part of every delegation, especially cross-functional work.
    </p>
  </div>

  {/* Technique 4: Progressive Delegation */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-amber-500/20 rounded-full w-8 h-8 flex items-center justify-center text-amber-400 font-bold">4</div>
      <h4 className="text-lg font-semibold text-amber-400">Progressive Delegation</h4>
    </div>
    <p className="text-gray-300 mb-4">
      Build capability systematically with this four-stage approach:
    </p>
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 to-emerald-500"></div>
      <div className="space-y-4 ml-8">
        <div className="relative">
          <div className="absolute -left-6 w-3 h-3 bg-amber-500 rounded-full"></div>
          <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
            <span className="text-amber-400 font-semibold">Stage 1: Shadow</span>
            <p className="text-gray-400 text-sm">Team member observes you making decisions</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-6 w-3 h-3 bg-orange-500 rounded-full"></div>
          <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
            <span className="text-orange-400 font-semibold">Stage 2: Assist</span>
            <p className="text-gray-400 text-sm">You decide together, you have final say</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-6 w-3 h-3 bg-blue-500 rounded-full"></div>
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
            <span className="text-blue-400 font-semibold">Stage 3: Lead</span>
            <p className="text-gray-400 text-sm">They decide, you review before execution</p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-6 w-3 h-3 bg-emerald-500 rounded-full"></div>
          <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
            <span className="text-emerald-400 font-semibold">Stage 4: Own</span>
            <p className="text-gray-400 text-sm">Full authority — they inform you of results</p>
          </div>
        </div>
      </div>
    </div>
    <p className="text-gray-400 text-sm mt-4">
      Progression speed depends on capability growth and stakes involved.
    </p>
  </div>

  {/* Technique 5: Authority Matrix */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-cyan-500/20 rounded-full w-8 h-8 flex items-center justify-center text-cyan-400 font-bold">5</div>
      <h4 className="text-lg font-semibold text-cyan-400">The Authority Matrix</h4>
    </div>
    <p className="text-gray-300 mb-4">
      Create explicit documentation of who can decide what. Example structure:
    </p>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left p-2 text-gray-400">Decision Type</th>
            <th className="text-center p-2 text-gray-400">Team Lead</th>
            <th className="text-center p-2 text-gray-400">Dev Lead</th>
            <th className="text-center p-2 text-gray-400">PM</th>
            <th className="text-center p-2 text-gray-400">Sponsor</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          <tr className="border-b border-white/10">
            <td className="p-2">Task assignments</td>
            <td className="text-center p-2 text-emerald-400">✓</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2">—</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="p-2">Technical approach</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2 text-emerald-400">✓</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2">—</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="p-2">Scope changes &lt;$5K</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2 text-emerald-400">✓</td>
            <td className="text-center p-2">—</td>
          </tr>
          <tr className="border-b border-white/10">
            <td className="p-2">Scope changes &gt;$5K</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2">—</td>
            <td className="text-center p-2 text-emerald-400">✓</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p className="text-gray-400 text-sm mt-4">
      Post this visibly. Refer to it. Update it as the project evolves.
    </p>
  </div>
</div>
```

---

## FIX 5: Deep Dive Tab - Delegation Continuum (Polished Version)

Replace the section showing code with this polished content:

```jsx
{/* DELEGATION CONTINUUM SECTION */}
<div className="space-y-6">
  <p className="text-gray-300">
    Delegation is not binary. It's a spectrum with seven distinct levels. Effective leaders adjust 
    their level based on the person, task, and situation.
  </p>

  {/* Seven Levels Visual */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-emerald-400 mb-4">The Seven Levels of Delegation</h4>
    <div className="space-y-3">
      <div className="group">
        <div className="flex items-center gap-4 bg-gradient-to-r from-red-500/20 to-red-500/5 rounded-lg p-4 border border-red-500/30 hover:border-red-500/50 transition-colors">
          <div className="bg-red-500/30 rounded-full w-10 h-10 flex items-center justify-center text-red-400 font-bold text-lg">1</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-red-400 font-semibold">TELL</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">PM decides and directs</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Use for: Crisis, safety issues, compliance requirements, new team members</p>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="flex items-center gap-4 bg-gradient-to-r from-orange-500/20 to-orange-500/5 rounded-lg p-4 border border-orange-500/30 hover:border-orange-500/50 transition-colors">
          <div className="bg-orange-500/30 rounded-full w-10 h-10 flex items-center justify-center text-orange-400 font-bold text-lg">2</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-orange-400 font-semibold">SELL</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">PM decides and explains why</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Use for: Building buy-in, teaching moments, developing understanding</p>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="flex items-center gap-4 bg-gradient-to-r from-amber-500/20 to-amber-500/5 rounded-lg p-4 border border-amber-500/30 hover:border-amber-500/50 transition-colors">
          <div className="bg-amber-500/30 rounded-full w-10 h-10 flex items-center justify-center text-amber-400 font-bold text-lg">3</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-semibold">CONSULT</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">PM gathers input, then decides</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Use for: Complex decisions, building capability, leveraging expertise</p>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-500/20 to-yellow-500/5 rounded-lg p-4 border border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
          <div className="bg-yellow-500/30 rounded-full w-10 h-10 flex items-center justify-center text-yellow-400 font-bold text-lg">4</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-yellow-400 font-semibold">AGREE</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">PM facilitates joint decision</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Use for: Shared ownership needed, equal expertise, collaborative culture</p>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-500/20 to-blue-500/5 rounded-lg p-4 border border-blue-500/30 hover:border-blue-500/50 transition-colors">
          <div className="bg-blue-500/30 rounded-full w-10 h-10 flex items-center justify-center text-blue-400 font-bold text-lg">5</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-blue-400 font-semibold">ADVISE</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">PM offers perspective if asked</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Use for: Confident team, moderate risk, their domain expertise</p>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="flex items-center gap-4 bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 rounded-lg p-4 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors">
          <div className="bg-cyan-500/30 rounded-full w-10 h-10 flex items-center justify-center text-cyan-400 font-bold text-lg">6</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-cyan-400 font-semibold">INQUIRE</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">PM asks about decision after</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Use for: Trusted team, lower risk, routine decisions in their scope</p>
          </div>
        </div>
      </div>

      <div className="group">
        <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-500/20 to-emerald-500/5 rounded-lg p-4 border border-emerald-500/30 hover:border-emerald-500/50 transition-colors">
          <div className="bg-emerald-500/30 rounded-full w-10 h-10 flex items-center justify-center text-emerald-400 font-bold text-lg">7</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-semibold">DELEGATE</span>
              <span className="text-gray-500">|</span>
              <span className="text-gray-400 text-sm">Full ownership, PM stays out</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Use for: Proven capability, trust established, appropriate scope</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Choosing the Right Level */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-amber-400 mb-4">Choosing the Right Level</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
        <div className="text-red-400 font-semibold mb-2">↓ Move DOWN (More PM Control)</div>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• New or unproven team member</li>
          <li>• High-stakes / irreversible decision</li>
          <li>• Compliance or safety requirement</li>
          <li>• Crisis situation</li>
          <li>• Cross-functional impact</li>
        </ul>
      </div>
      <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
        <div className="text-emerald-400 font-semibold mb-2">↑ Move UP (More Team Control)</div>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Proven track record on similar work</li>
          <li>• Team member's area of expertise</li>
          <li>• Reversible / low-risk decision</li>
          <li>• Time pressure (faster if team decides)</li>
          <li>• Repeated routine decision</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Situational Leadership Connection */}
  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
    <h4 className="text-lg font-semibold text-purple-400 mb-4">Situational Leadership Connection</h4>
    <p className="text-gray-300 mb-4">
      The Delegation Continuum aligns with Hersey & Blanchard's Situational Leadership:
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
        <div className="text-red-400 font-semibold">D1: Low competence, high commitment</div>
        <p className="text-gray-400 text-sm">→ Use Levels 1-2 (Tell, Sell) = Directing style</p>
      </div>
      <div className="bg-orange-500/10 rounded-lg p-3 border border-orange-500/20">
        <div className="text-orange-400 font-semibold">D2: Some competence, low commitment</div>
        <p className="text-gray-400 text-sm">→ Use Levels 2-3 (Sell, Consult) = Coaching style</p>
      </div>
      <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
        <div className="text-blue-400 font-semibold">D3: High competence, variable commitment</div>
        <p className="text-gray-400 text-sm">→ Use Levels 4-5 (Agree, Advise) = Supporting style</p>
      </div>
      <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
        <div className="text-emerald-400 font-semibold">D4: High competence, high commitment</div>
        <p className="text-gray-400 text-sm">→ Use Levels 6-7 (Inquire, Delegate) = Delegating style</p>
      </div>
    </div>
  </div>
</div>
```

---

## FIX 6: Connections to Other Tasks - Navigation Component

Replace the current Connections to Other Tasks section with this version that removes "ECO" and adds clickable navigation buttons:

```jsx
{/* CONNECTIONS TO OTHER TASKS SECTION */}
{/* Note: This requires state management and navigation function */}

// Add this state at the component level if not already present:
const [showingRelatedTask, setShowingRelatedTask] = useState(false);
const [relatedTaskId, setRelatedTaskId] = useState(null);
const [returnToSection, setReturnToSection] = useState('connections');

// Navigation function:
const navigateToRelatedTask = (taskId) => {
  setRelatedTaskId(taskId);
  setReturnToSection('connections');
  setShowingRelatedTask(true);
  // Navigate to that task's learn page
  // Your existing navigation logic here
};

const returnToConnections = () => {
  setShowingRelatedTask(false);
  setRelatedTaskId(null);
  // Scroll back to connections section
  document.getElementById('connections-section')?.scrollIntoView({ behavior: 'smooth' });
};

{/* The Section Content */}
<div id="connections-section" className="space-y-6">
  <p className="text-gray-300">
    Empowerment connects directly to other People Domain tasks. Understanding these relationships 
    helps you apply empowerment principles holistically.
  </p>

  {/* Related Tasks Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    
    {/* Task 2: Lead a Team */}
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-emerald-400 font-semibold">Task 2: Lead a Team</span>
        <button 
          onClick={() => navigateToRelatedTask(2)}
          className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm">
        <span className="text-gray-300 font-medium">Connection:</span> Leadership creates the conditions for empowerment. 
        Servant leaders empower by removing obstacles and building trust.
      </p>
    </div>

    {/* Task 3: Support Team Performance */}
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-blue-400 font-semibold">Task 3: Support Team Performance</span>
        <button 
          onClick={() => navigateToRelatedTask(3)}
          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm">
        <span className="text-gray-300 font-medium">Connection:</span> Empowered teams perform better. 
        Performance support includes progressively expanding authority as capability grows.
      </p>
    </div>

    {/* Task 5: Ensure Training */}
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-purple-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-purple-400 font-semibold">Task 5: Ensure Training</span>
        <button 
          onClick={() => navigateToRelatedTask(5)}
          className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm">
        <span className="text-gray-300 font-medium">Connection:</span> Training builds capability that enables empowerment. 
        You can only delegate authority people are prepared to handle.
      </p>
    </div>

    {/* Task 7: Address Impediments */}
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-amber-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-amber-400 font-semibold">Task 7: Address Impediments</span>
        <button 
          onClick={() => navigateToRelatedTask(7)}
          className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm">
        <span className="text-gray-300 font-medium">Connection:</span> Empowerment requires clearing obstacles teams can't remove themselves. 
        The PM enables by removing what blocks the team.
      </p>
    </div>

    {/* Task 9: Collaborate with Stakeholders */}
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-cyan-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-cyan-400 font-semibold">Task 9: Collaborate with Stakeholders</span>
        <button 
          onClick={() => navigateToRelatedTask(9)}
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm">
        <span className="text-gray-300 font-medium">Connection:</span> Stakeholders need empowerment too. 
        Give them authority appropriate to their role and involvement level.
      </p>
    </div>

    {/* Task 1: Manage Conflict */}
    <div className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-rose-500/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <span className="text-rose-400 font-semibold">Task 1: Manage Conflict</span>
        <button 
          onClick={() => navigateToRelatedTask(1)}
          className="bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          Learn More
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="text-gray-400 text-sm">
        <span className="text-gray-300 font-medium">Connection:</span> Unclear authority creates conflict. 
        Well-defined empowerment with explicit boundaries reduces role confusion and turf battles.
      </p>
    </div>
  </div>

  {/* Agile Connection Callout */}
  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
    <h4 className="text-lg font-semibold text-white mb-3">🔄 Agile Connection</h4>
    <p className="text-gray-300">
      Self-organizing teams are the ultimate expression of empowerment. In Agile, the team decides 
      <span className="text-blue-400 font-medium"> how</span> to accomplish sprint goals. The PM/Scrum Master 
      focuses on <span className="text-purple-400 font-medium">what</span> and <span className="text-purple-400 font-medium">why</span>, 
      removing obstacles rather than directing work.
    </p>
  </div>
</div>

{/* Back Button Component - Show when viewing from another task */}
{showingRelatedTask && (
  <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
    <button
      onClick={returnToConnections}
      className="bg-gray-800/90 backdrop-blur-sm hover:bg-gray-700/90 text-white px-6 py-3 rounded-full shadow-lg border border-white/10 flex items-center gap-3 transition-colors"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      <span>Back to Empower Team Connections</span>
    </button>
  </div>
)}
```

---

## CURSOR IMPLEMENTATION INSTRUCTIONS

Copy and paste these fixes into your Empower Team learning page component. Here's the sequence:

### Step 1: Find the Overview Tab sections
Look for empty/placeholder sections for:
- Key Frameworks → Replace with FIX 1
- How to Apply It → Replace with FIX 2

### Step 2: Find the PMP Application Tab sections
Look for empty/placeholder section for:
- Exam Strategy → Replace with FIX 3

### Step 3: Find the Deep Dive Tab sections
Look for:
- Delegation Continuum (showing code) → Replace with FIX 5
- Practical Application (empty) → Replace with FIX 4
- Connections to Other Tasks → Replace with FIX 6

### Step 4: Add Navigation State
At the top of your component (if not already there), add the state variables from FIX 6

### Step 5: Test Navigation
- Click each "Learn More" button to verify it navigates to the correct task
- Verify the back button appears and returns you to the connections section

---

## QUICK REFERENCE: What Changed

| Section | Tab | Issue | Fix |
|---------|-----|-------|-----|
| Key Frameworks | Overview | Blank | Added 3 frameworks with visual cards |
| How to Apply It | Overview | Blank | Added 3 application areas with examples |
| Exam Strategy | PMP Application | Blank | Added decision guide + trap patterns |
| Delegation Continuum | Deep Dive | Shows code | Added polished 7-level visual |
| Practical Application | Deep Dive | Blank | Added 5 techniques with details |
| Connections to Other Tasks | Deep Dive | Shows "ECO", no navigation | Removed ECO, added clickable buttons |
