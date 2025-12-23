# EMPOWER TEAM - ACTIVITIES FIXES

## Summary of Issues

1. **PM Simulator** - No scenarios
2. **Lightning Round** - No questions
3. **Delegation Level Matcher** - Still called "Conflict" with conflict content (should be delegation content)
4. **Empathy Exercise** - Shows old name (should be "Empowerment Perspectives") and has no scenarios

---

## FIX 1: PM Simulator Scenarios

Replace empty scenarios array with:

```javascript
const pmSimulatorScenarios = [
  {
    id: 1,
    title: "The Micromanaged Expert",
    setup: "Priya is a senior developer with 8 years of experience. She's delivered complex features flawlessly for the past year. Recently, you've been reviewing all her code before it goes to QA and requiring approval for her technical decisions. She sends you a message: 'Can we talk? I feel like you don't trust my work anymore.'",
    context: "Priya has a perfect track record. Your increased oversight started when the project entered a high-visibility phase, but you never explained this to her.",
    stakpieholds: [
      { name: "Priya", role: "Senior Developer", concern: "Feels micromanaged and undervalued" },
      { name: "VP Engineering", role: "Executive Sponsor", concern: "Wants quality deliverables" },
      { name: "Team", role: "Other Developers", concern: "Watching how you treat top performers" }
    ],
    options: [
      {
        id: "A",
        text: "Explain that the project visibility requires extra oversight for everyone",
        feedback: "Partially helpful but doesn't address that you're treating an expert like a junior. Equal treatment isn't always fair treatment.",
        score: 40,
        consequence: "Priya feels the explanation is an excuse. She starts looking at other opportunities."
      },
      {
        id: "B",
        text: "Apologize and immediately restore her full autonomy with no oversight",
        feedback: "Good intent but overcorrects. Some communication during high-stakes phases is reasonable.",
        score: 60,
        consequence: "Priya appreciates the trust but a critical bug slips through that could have been caught with a light touch."
      },
      {
        id: "C",
        text: "Acknowledge the issue, explain the high-visibility context, and collaborate on an appropriate oversight level for this phase",
        feedback: "Excellent! You're being transparent about context while respecting her capability. Collaborative recalibration builds trust.",
        score: 95,
        consequence: "Priya understands the situation and appreciates being consulted. You agree on brief async updates rather than approval gates."
      },
      {
        id: "D",
        text: "Tell her this is standard process and she shouldn't take it personally",
        feedback: "Dismissive and untrue—you weren't doing this before. This damages trust with your best performer.",
        score: 20,
        consequence: "Priya disengages emotionally. Her work quality drops as motivation decreases."
      }
    ],
    bestAnswer: "C",
    keyLesson: "Match oversight to capability, not just project phase. When you need to adjust, communicate why and collaborate on the approach."
  },
  {
    id: 2,
    title: "The Eager Overreach",
    setup: "Marcus joined 3 months ago and is enthusiastic and confident. Without consulting anyone, he committed to a client that the team would deliver a major feature by end of month—something that would normally take 6 weeks. He proudly tells you about 'closing the deal' in standup.",
    context: "Marcus has good intentions but doesn't yet understand the complexity of your systems or the team's capacity planning process.",
    stakeholders: [
      { name: "Marcus", role: "Junior Developer", concern: "Wants to contribute and impress" },
      { name: "Client", role: "Key Account", concern: "Expects the commitment to be honored" },
      { name: "Team", role: "Development Team", concern: "Worried about unrealistic deadline" }
    ],
    options: [
      {
        id: "A",
        text: "Publicly correct him in standup to ensure the team knows this commitment isn't valid",
        feedback: "Humiliating him publicly will crush his enthusiasm and damage psychological safety for everyone.",
        score: 15,
        consequence: "Marcus is embarrassed and withdraws. Other team members become afraid to take initiative."
      },
      {
        id: "B",
        text: "Honor his commitment to avoid undermining him, then push the team to deliver",
        feedback: "This rewards overreach and burns out the team. You're teaching Marcus that bypassing process works.",
        score: 25,
        consequence: "Team resents both you and Marcus. Quality suffers under the crunch."
      },
      {
        id: "C",
        text: "Talk privately with Marcus, explain the issue, have him help develop a realistic counter-proposal, then support him in the client conversation",
        feedback: "Perfect! You're coaching without humiliating, teaching accountability, and letting him participate in the fix.",
        score: 95,
        consequence: "Marcus learns about capacity planning and client management. He grows from the experience."
      },
      {
        id: "D",
        text: "Take over the client relationship and tell Marcus to check with you before any external communication",
        feedback: "Solves the immediate problem but over-restricts. He'll never learn to handle clients appropriately.",
        score: 45,
        consequence: "Marcus feels sidelined. His development stalls and he becomes passive."
      }
    ],
    bestAnswer: "C",
    keyLesson: "When someone overreaches, coach them through the correction rather than taking over. Use mistakes as teaching moments."
  },
  {
    id: 3,
    title: "The Authority Gap",
    setup: "You assigned Sarah to lead the API redesign. She's technically excellent but keeps coming to you for decisions: 'Should we use REST or GraphQL?', 'Can I schedule a meeting with the platform team?', 'Is it okay to push back the deadline by two days?' You've told her she owns this project.",
    context: "Sarah was previously on a team with a controlling manager. She has the skills but not the confidence to use her authority.",
    stakeholders: [
      { name: "Sarah", role: "Tech Lead", concern: "Afraid of making wrong decisions" },
      { name: "You", role: "PM", concern: "Becoming a bottleneck" },
      { name: "Project", role: "API Redesign", concern: "Delays from decision bottleneck" }
    ],
    options: [
      {
        id: "A",
        text: "Answer her questions quickly to keep the project moving",
        feedback: "This perpetuates her dependency. You'll be answering questions forever.",
        score: 30,
        consequence: "Sarah never builds confidence. You remain the bottleneck."
      },
      {
        id: "B",
        text: "Refuse to answer and tell her to figure it out herself",
        feedback: "Too abrupt. This might cause her to freeze or make avoidable mistakes without support.",
        score: 35,
        consequence: "Sarah feels abandoned. She makes a decision she's unsure about and it goes poorly."
      },
      {
        id: "C",
        text: "For each question, ask 'What would you do?' then affirm her judgment or coach her thinking",
        feedback: "Excellent! You're building her confidence incrementally while staying available as a thought partner.",
        score: 95,
        consequence: "Sarah gradually realizes her instincts are good. Her questions decrease as confidence grows."
      },
      {
        id: "D",
        text: "Create a detailed decision matrix documenting exactly what she can and cannot decide",
        feedback: "Over-engineered and sends the message you don't trust her judgment. Authority isn't about checklists.",
        score: 40,
        consequence: "Sarah follows the matrix rigidly, never developing real judgment."
      }
    ],
    bestAnswer: "C",
    keyLesson: "Empowerment sometimes requires active confidence-building, not just granting authority. Meet people where they are."
  },
  {
    id: 4,
    title: "The Self-Organizing Conflict",
    setup: "Your agile team has been self-organizing effectively for 6 months. A senior stakeholder, David, is frustrated with a recent sprint outcome and tells you: 'You need to start assigning tasks directly. This self-organizing thing isn't working. I want you managing who does what.'",
    context: "The sprint issue was actually caused by an unclear requirement from David's team, not the self-organization approach. Team velocity has been excellent.",
    stakeholders: [
      { name: "David", role: "Senior Stakeholder", concern: "Wants more control and visibility" },
      { name: "Team", role: "Development Team", concern: "Values autonomy and self-organization" },
      { name: "Scrum Master", role: "Process Owner", concern: "Protecting agile principles" }
    ],
    options: [
      {
        id: "A",
        text: "Agree to assign tasks directly to satisfy the stakeholder",
        feedback: "This undermines your team's autonomy and agile principles based on a misdiagnosis of the problem.",
        score: 20,
        consequence: "Team morale drops. The actual problem (unclear requirements) continues."
      },
      {
        id: "B",
        text: "Refuse and tell David he doesn't understand agile",
        feedback: "Dismissive and confrontational. You need to address his legitimate concern about the outcome.",
        score: 25,
        consequence: "David escalates. You've made an enemy instead of solving the problem."
      },
      {
        id: "C",
        text: "Acknowledge his concern, share data on team performance, explain the real root cause, and propose a solution for the requirements issue",
        feedback: "Perfect! You're addressing his concern with evidence while protecting team autonomy and solving the actual problem.",
        score: 95,
        consequence: "David understands the real issue. You implement better requirements processes together."
      },
      {
        id: "D",
        text: "Compromise by assigning only the critical path tasks while letting the team self-organize the rest",
        feedback: "A middle ground, but based on a false premise. You're partially abandoning a working approach.",
        score: 45,
        consequence: "Creates confusion about when self-organization applies. Neither fully empowered nor directed."
      }
    ],
    bestAnswer: "C",
    keyLesson: "Protect team empowerment with data and evidence, not ideology. Address stakeholder concerns by solving real problems."
  },
  {
    id: 5,
    title: "The Capability Mismatch",
    setup: "You delegated budget authority to your technical lead, James. He's excellent technically but just approved $50K in cloud infrastructure spending without comparing vendors or getting competitive quotes—something finance requires for purchases over $10K. Finance is now questioning the expense.",
    context: "James didn't know about the competitive quote policy. You delegated budget authority without explaining the constraints.",
    stakeholders: [
      { name: "James", role: "Technical Lead", concern: "Feels set up to fail" },
      { name: "Finance", role: "Finance Department", concern: "Policy compliance" },
      { name: "You", role: "PM", concern: "Delegated without adequate preparation" }
    ],
    options: [
      {
        id: "A",
        text: "Revoke James's budget authority since he can't be trusted with it",
        feedback: "Unfair—he failed because you didn't prepare him, not because he's untrustworthy.",
        score: 20,
        consequence: "James feels betrayed. Trust is broken and he becomes risk-averse."
      },
      {
        id: "B",
        text: "Blame finance for unclear policies and defend James's decision",
        feedback: "Deflects responsibility and doesn't solve the problem. Finance policies exist for good reasons.",
        score: 30,
        consequence: "Finance relationship damaged. The compliance issue remains unresolved."
      },
      {
        id: "C",
        text: "Take responsibility for inadequate preparation, work with James to retroactively gather quotes, and create a clear authority matrix together",
        feedback: "Excellent! You're owning your part, helping fix the immediate issue, and building proper guardrails for the future.",
        score: 95,
        consequence: "James appreciates your support. The authority matrix prevents future issues."
      },
      {
        id: "D",
        text: "Handle the finance situation yourself and create detailed approval workflows for all future spending",
        feedback: "Solves it but over-corrects with bureaucracy. You're also not involving James in the solution.",
        score: 45,
        consequence: "James loses ownership of budgets. Process becomes a bottleneck."
      }
    ],
    bestAnswer: "C",
    keyLesson: "Delegation requires preparation—authority, boundaries, and context. When delegation fails, look first at how you set them up."
  }
];
```

---

## FIX 2: Lightning Round Questions

Replace empty questions array with:

```javascript
const lightningRoundQuestions = [
  {
    id: 1,
    question: "A senior developer with 5 years of excellent performance asks if she can decide the technical approach for a low-risk feature. What delegation level is most appropriate?",
    options: [
      { id: "A", text: "Tell - Direct her on exactly what approach to use" },
      { id: "B", text: "Consult - Get her input but make the decision yourself" },
      { id: "C", text: "Delegate - Give her full authority to decide" },
      { id: "D", text: "Sell - Make the decision and explain your reasoning" }
    ],
    correctAnswer: "C",
    explanation: "Senior developer + excellent track record + low-risk = full delegation. She's earned the authority and the stakes don't require oversight."
  },
  {
    id: 2,
    question: "You gave a team member responsibility for vendor selection but they don't have access to the procurement system or budget information. What's missing?",
    options: [
      { id: "A", text: "Accountability" },
      { id: "B", text: "Authority and resources" },
      { id: "C", text: "Autonomy" },
      { id: "D", text: "Training" }
    ],
    correctAnswer: "B",
    explanation: "Responsibility without the authority (system access) and resources (budget info) to execute is a recipe for failure. All three must be present."
  },
  {
    id: 3,
    question: "Your agile team asks you to assign tasks to individuals. What should you do?",
    options: [
      { id: "A", text: "Assign tasks to ensure fair distribution" },
      { id: "B", text: "Let the team self-organize and choose their own tasks" },
      { id: "C", text: "Assign senior members and let juniors self-select" },
      { id: "D", text: "Create a rotation schedule" }
    ],
    correctAnswer: "B",
    explanation: "Self-organizing teams decide how to accomplish their goals. The PM provides the 'what' and 'why'; the team owns the 'how'."
  },
  {
    id: 4,
    question: "A new team member made a technical decision that turned out poorly. How should you respond?",
    options: [
      { id: "A", text: "Remove their decision-making authority" },
      { id: "B", text: "Use it as a coaching opportunity and adjust support level" },
      { id: "C", text: "Make all their future decisions for them" },
      { id: "D", text: "Ignore it to avoid damaging their confidence" }
    ],
    correctAnswer: "B",
    explanation: "Mistakes are learning opportunities. Adjust support (move down the delegation continuum temporarily) while coaching, don't punish or ignore."
  },
  {
    id: 5,
    question: "Which phrase indicates someone is ready for MORE delegation?",
    options: [
      { id: "A", text: "First time leading this type of work" },
      { id: "B", text: "Proven track record on similar projects" },
      { id: "C", text: "Recently joined the organization" },
      { id: "D", text: "High-stakes compliance requirement" }
    ],
    correctAnswer: "B",
    explanation: "'Proven track record' signals demonstrated capability—the key factor for increasing delegation level."
  },
  {
    id: 6,
    question: "A team member keeps asking for your approval on routine decisions they're authorized to make. What should you do?",
    options: [
      { id: "A", text: "Approve quickly to keep things moving" },
      { id: "B", text: "Refuse to answer until they decide themselves" },
      { id: "C", text: "Ask 'What would you do?' and affirm their judgment" },
      { id: "D", text: "Create a checklist of what needs approval" }
    ],
    correctAnswer: "C",
    explanation: "Build confidence by validating their thinking. 'What would you do?' helps them realize they already know the answer."
  },
  {
    id: 7,
    question: "What's the difference between delegation and abdication?",
    options: [
      { id: "A", text: "Delegation is for experts; abdication is for everyone" },
      { id: "B", text: "Delegation includes support and follow-up; abdication doesn't" },
      { id: "C", text: "Delegation is formal; abdication is informal" },
      { id: "D", text: "There is no difference" }
    ],
    correctAnswer: "B",
    explanation: "Delegation = authority + accountability + support + follow-up. Abdication = 'figure it out' with no support or monitoring."
  },
  {
    id: 8,
    question: "In RACI, why should only ONE person be Accountable for each deliverable?",
    options: [
      { id: "A", text: "To reduce workload" },
      { id: "B", text: "To ensure clear ownership and avoid diffusion of responsibility" },
      { id: "C", text: "Because that's the rule" },
      { id: "D", text: "To minimize meetings" }
    ],
    correctAnswer: "B",
    explanation: "Multiple accountable parties = no one truly accountable. Single ownership ensures someone is clearly responsible for the outcome."
  },
  {
    id: 9,
    question: "A crisis situation occurs. What delegation level is appropriate even for experienced team members?",
    options: [
      { id: "A", text: "Delegate - Trust their expertise" },
      { id: "B", text: "Consult - Get their input first" },
      { id: "C", text: "Tell/Direct - Clear commands, single coordination point" },
      { id: "D", text: "Advise - Offer suggestions" }
    ],
    correctAnswer: "C",
    explanation: "Crisis = Tell/Direct. Even capable teams need single-point coordination in emergencies. Return to normal delegation after."
  },
  {
    id: 10,
    question: "You're reviewing every decision a capable team member makes. What is this called?",
    options: [
      { id: "A", text: "Quality assurance" },
      { id: "B", text: "Micromanagement" },
      { id: "C", text: "Due diligence" },
      { id: "D", text: "Servant leadership" }
    ],
    correctAnswer: "B",
    explanation: "Reviewing every decision of a capable person is micromanagement—it signals distrust and creates bottlenecks."
  },
  {
    id: 11,
    question: "What does 'completed staff work' mean?",
    options: [
      { id: "A", text: "All team members have finished their tasks" },
      { id: "B", text: "Bringing solutions and recommendations, not just problems" },
      { id: "C", text: "Documentation is complete" },
      { id: "D", text: "The project is done" }
    ],
    correctAnswer: "B",
    explanation: "Completed staff work = 'Here's the problem, here are options, here's my recommendation.' It builds ownership and reduces PM bottlenecks."
  },
  {
    id: 12,
    question: "A stakeholder wants you to assign all tasks personally instead of letting the team self-organize. Team velocity has been excellent. What should you do?",
    options: [
      { id: "A", text: "Comply with the stakeholder request" },
      { id: "B", text: "Ignore the stakeholder" },
      { id: "C", text: "Share performance data and explain the benefits of self-organization" },
      { id: "D", text: "Compromise by assigning half the tasks" }
    ],
    correctAnswer: "C",
    explanation: "Protect team empowerment with evidence. Address stakeholder concerns while maintaining what's working."
  },
  {
    id: 13,
    question: "Which scenario requires LESS delegation (more PM involvement)?",
    options: [
      { id: "A", text: "Team member's area of expertise" },
      { id: "B", text: "High-stakes, irreversible decision" },
      { id: "C", text: "Routine, repeated decision" },
      { id: "D", text: "Proven track record on similar work" }
    ],
    correctAnswer: "B",
    explanation: "High stakes + irreversible = move down the delegation scale. The risk warrants more involvement regardless of capability."
  },
  {
    id: 14,
    question: "You delegate a project but the team member fails. What should you examine FIRST?",
    options: [
      { id: "A", text: "Whether they're competent enough for the role" },
      { id: "B", text: "Whether you provided adequate preparation and support" },
      { id: "C", text: "Whether to replace them" },
      { id: "D", text: "Whether delegation was a mistake" }
    ],
    correctAnswer: "B",
    explanation: "Look first at your delegation: Did they have clear outcomes, authority, resources, timeline, and support? Often failure is setup failure."
  },
  {
    id: 15,
    question: "The Empowerment Equation is: Empowerment = Authority + Accountability + Autonomy + ____",
    options: [
      { id: "A", text: "Success" },
      { id: "B", text: "Training" },
      { id: "C", text: "Support" },
      { id: "D", text: "Budget" }
    ],
    correctAnswer: "C",
    explanation: "Empowerment = Authority + Accountability + Autonomy + Support. All four elements must be present."
  }
];
```

---

## FIX 3: Delegation Level Matcher (Rename from Conflict + New Content)

Update the activity name and replace content:

```javascript
// Update activity metadata
const delegationLevelMatcherActivity = {
  id: "delegation-level-matcher",
  title: "Delegation Level Matcher",
  description: "Match scenarios to the appropriate delegation level based on capability, stakes, and context",
  icon: "🎯", // or use an appropriate icon component
  duration: "8-10 min",
  difficulty: "Intermediate"
};

// Replace scenarios
const delegationMatcherScenarios = [
  {
    id: 1,
    scenario: "Maya just graduated and joined your team. She has strong theoretical knowledge but no practical experience. You need her to create test cases for a small feature.",
    factors: ["First real task", "No track record", "Strong theory but no practice", "Low-risk assignment"],
    correctLevel: 1,
    levelName: "TELL (Direct)",
    explanation: "New team member with no practical experience needs clear direction. Set her up for success with specific guidance now so you can delegate more later."
  },
  {
    id: 2,
    scenario: "Derek is your senior architect with 3 years on the team. He's successfully led 4 system migrations with zero production incidents. A new migration needs architecture decisions.",
    factors: ["3 years proven track record", "4 successful migrations", "Zero incidents", "His domain of expertise"],
    correctLevel: 7,
    levelName: "DELEGATE (Entrust)",
    explanation: "Proven expert with consistent track record in exactly this type of work. Full delegation—don't waste his time or yours with unnecessary oversight."
  },
  {
    id: 3,
    scenario: "Your highly capable team wants to adopt a new CI/CD tool. The decision would affect 3 other teams and require migrating all existing pipelines.",
    factors: ["Capable team", "High cross-functional impact", "Significant change", "Technical complexity"],
    correctLevel: 4,
    levelName: "AGREE (Collaborate)",
    explanation: "Capable team BUT high organizational impact. Work together—they own technical evaluation, you help navigate cross-team implications."
  },
  {
    id: 4,
    scenario: "Raj has been solid for a year but lately his work quality has declined—missed details, incomplete deliverables, uncharacteristic mistakes. He needs to work on the next feature.",
    factors: ["Previous good performance", "Recent decline", "Needs support structure", "Unknown root cause"],
    correctLevel: 2,
    levelName: "SELL (Coach)",
    explanation: "Has capability but is struggling. Move down temporarily to coach through the rough patch—direct enough to ensure success, supportive enough to help recover."
  },
  {
    id: 5,
    scenario: "Production is down, customers are impacted, the CEO wants updates every 15 minutes. Your experienced team knows the system well but emotions are high and people are shouting different theories.",
    factors: ["Crisis situation", "High stakes", "Chaos and emotions", "Time pressure"],
    correctLevel: 1,
    levelName: "TELL (Direct)",
    explanation: "Crisis = Direct, even with experienced teams. Cut through chaos with clear roles and single coordination point. Return to normal delegation after."
  },
  {
    id: 6,
    scenario: "A team member asks whether to use JSON or XML for a configuration file. Your self-organizing team has been effective, there's no strong organizational standard, and either format works fine.",
    factors: ["Self-organizing team", "Low-impact decision", "No constraints", "Routine technical choice"],
    correctLevel: 7,
    levelName: "DELEGATE (Entrust)",
    explanation: "Low-stakes routine decision within their expertise. Break the dependency on unnecessary approval—'You decide, it's your code.'"
  },
  {
    id: 7,
    scenario: "Kim is ready for growth after 2 years of solid performance. A medium-complexity project needs a technical lead. It's a stretch assignment but bounded risk.",
    factors: ["Development opportunity", "First time in role", "Solid performer", "Medium complexity"],
    correctLevel: 3,
    levelName: "CONSULT (Support)",
    explanation: "Stretch assignment = Support level. Enough autonomy to grow, enough backup to succeed. Be a thought partner, not a decision-maker."
  },
  {
    id: 8,
    scenario: "Aisha has been on the team 4 months and picks things up quickly. She's eager but sometimes overconfident. She just volunteered to handle a stakeholder negotiation that typically requires senior experience.",
    factors: ["4 months experience", "Eager and confident", "High-visibility task", "Needs development"],
    correctLevel: 2,
    levelName: "SELL (Coach)",
    explanation: "Channel enthusiasm into learning. Don't crush confidence, but provide structure for a high-stakes situation. Role-play first, observe, debrief."
  },
  {
    id: 9,
    scenario: "Your team recommends adopting a new testing framework. They've researched thoroughly and are confident. However, your Technology Standards Board requires approval for new tools (6-8 week process).",
    factors: ["Good team recommendation", "Organizational governance", "External constraint", "Process requirement"],
    correctLevel: 3,
    levelName: "CONSULT (Support)",
    explanation: "Team made a good call but organizational process exists. Support them through the approval process—they can't bypass governance unilaterally."
  },
  {
    id: 10,
    scenario: "Chen is your most experienced developer. She's handled similar decisions dozens of times. She asks about a technical approach for a routine feature that's entirely within her expertise.",
    factors: ["Most experienced", "Routine decision", "Her expertise", "Done many times before"],
    correctLevel: 6,
    levelName: "INQUIRE (Trust)",
    explanation: "Proven expert on routine work. Let her decide, ask about it later for your awareness. Don't create bottlenecks for decisions she's mastered."
  },
  {
    id: 11,
    scenario: "A junior developer wants to refactor a critical payment processing module. It's complex code with compliance implications.",
    factors: ["Junior developer", "Critical system", "Compliance implications", "Complex code"],
    correctLevel: 2,
    levelName: "SELL (Coach)",
    explanation: "High stakes + junior = close involvement. Explain your concerns, teach the context, potentially pair with a senior or defer until they've grown."
  },
  {
    id: 12,
    scenario: "Your team has been self-organizing for 6 months with excellent velocity. Sprint planning is coming up and they're discussing how to divide the work.",
    factors: ["Proven self-organization", "Excellent track record", "Their process", "Routine sprint activity"],
    correctLevel: 7,
    levelName: "DELEGATE (Entrust)",
    explanation: "Self-organizing team with proven success. Stay out of how they divide work—that's the whole point of self-organization."
  }
];

// Delegation levels reference for the matcher
const delegationLevels = [
  { level: 1, name: "TELL (Direct)", description: "PM decides and directs specifically", color: "red" },
  { level: 2, name: "SELL (Coach)", description: "PM decides and explains reasoning", color: "orange" },
  { level: 3, name: "CONSULT (Support)", description: "PM gathers input, then decides", color: "amber" },
  { level: 4, name: "AGREE (Collaborate)", description: "PM facilitates joint decision", color: "yellow" },
  { level: 5, name: "ADVISE (Guide)", description: "PM offers perspective if asked", color: "blue" },
  { level: 6, name: "INQUIRE (Trust)", description: "PM asks about decision after", color: "cyan" },
  { level: 7, name: "DELEGATE (Entrust)", description: "Full ownership, PM stays out", color: "emerald" }
];
```

---

## FIX 4: Empowerment Perspectives (Rename from Empathy Exercise + New Content)

Update the activity name and replace scenarios:

```javascript
// Update activity metadata
const empowermentPerspectivesActivity = {
  id: "empowerment-perspectives",
  title: "Empowerment Perspectives",
  description: "See empowerment situations from multiple stakeholder viewpoints to build understanding and make better decisions",
  icon: "👁️", // or use an appropriate icon component
  duration: "10-12 min",
  difficulty: "Advanced"
};

// Replace scenarios
const empowermentPerspectivesScenarios = [
  {
    id: 1,
    title: "The Competent but Constrained",
    situation: "Priya is a senior developer who's been delivering excellent work for 2 years. Recently, all her code now requires PM approval before going to QA. She wasn't told why. Deployment velocity has dropped 40%.",
    perspectives: [
      {
        role: "Priya (Senior Developer)",
        emoji: "👩‍💻",
        thoughts: "What did I do wrong? I've never had a quality issue. Does the PM not trust me anymore? I feel like I'm being treated like a junior. This is insulting after everything I've delivered. Maybe I should look for a team that values my experience.",
        feelings: ["Frustrated", "Undervalued", "Confused", "Demotivated"],
        needs: "Understanding why oversight increased, acknowledgment of track record, appropriate autonomy for skill level"
      },
      {
        role: "PM (You)",
        emoji: "📋",
        thoughts: "The project entered a critical phase with executive visibility. I can't afford any mistakes right now. Priya is great, but I need to make sure everything is perfect. I'm not trying to micromanage—I'm trying to protect the project and her.",
        feelings: ["Pressured", "Risk-averse", "Protective"],
        needs: "Quality assurance during high-stakes phase, confidence in deliverables, executive confidence"
      },
      {
        role: "Team Observer",
        emoji: "👀",
        thoughts: "If Priya—our best performer—is being micromanaged, what does that mean for the rest of us? Is this the new normal? Why would I go above and beyond if this is how top performers get treated?",
        feelings: ["Worried", "Cautious", "Demotivated"],
        needs: "Understanding that performance is recognized, psychological safety, fair treatment"
      }
    ],
    insight: "Increased oversight without explanation damages trust with high performers AND sends negative signals to the whole team. When stakes change, communicate why and collaborate on appropriate adjustments.",
    betterApproach: "Explain the high-visibility context, acknowledge Priya's track record, and work together on a lighter-touch review process that gives you confidence without creating bottlenecks."
  },
  {
    id: 2,
    title: "The Eager Overreacher",
    situation: "Marcus (3 months on the team) committed to a client that the team would deliver a major feature in 2 weeks—work that typically takes 6 weeks. He announced this 'win' proudly in standup. The team is stunned.",
    perspectives: [
      {
        role: "Marcus (Junior Developer)",
        emoji: "🧑‍💻",
        thoughts: "I saw an opportunity to help the team! The client seemed so happy. I wanted to show I can contribute beyond just coding. I thought everyone would be excited that I closed this deal. Why do they look so worried?",
        feelings: ["Proud", "Eager", "Confused", "Vulnerable"],
        needs: "Recognition for initiative, learning about processes, guidance without humiliation"
      },
      {
        role: "Senior Team Member",
        emoji: "👨‍💻",
        thoughts: "Does he have any idea what he just committed us to? That's 4 weeks of overtime minimum. Who gave him authority to make commitments? The PM needs to handle this—we can't just let this slide.",
        feelings: ["Frustrated", "Anxious", "Resentful"],
        needs: "Realistic commitments, clear authority boundaries, protection from overwork"
      },
      {
        role: "Client",
        emoji: "🤝",
        thoughts: "Marcus was so confident and helpful. He really understood our urgency. I've already told my leadership we're getting this feature. If they walk it back now, I'll look foolish.",
        feelings: ["Expectant", "Trusting", "Invested"],
        needs: "Commitment honored or graceful alternative, not feeling foolish"
      }
    ],
    insight: "Eagerness without boundaries creates real damage—to client relationships, team morale, and the person's own reputation. But public humiliation destroys psychological safety for everyone.",
    betterApproach: "Talk with Marcus privately. Help him understand the impact and develop a realistic counter-proposal. Support him in the client conversation so he learns to manage expectations appropriately."
  },
  {
    id: 3,
    title: "The Dependency Loop",
    situation: "Sarah was assigned to lead the API redesign with 'full ownership.' But she keeps coming to the PM for every decision: technical approach, meeting scheduling, minor timeline adjustments. The PM is frustrated; Sarah seems stuck.",
    perspectives: [
      {
        role: "Sarah (Tech Lead)",
        emoji: "👩‍💻",
        thoughts: "I've been told I 'own' this, but what if I make the wrong call? My last PM second-guessed everything I did. I'd rather check than get blamed later. The PM seems annoyed when I ask, but also annoyed when things go wrong. I can't win.",
        feelings: ["Anxious", "Uncertain", "Afraid of failure", "Confused"],
        needs: "Confidence building, clear boundaries, safety to make mistakes, consistent response"
      },
      {
        role: "PM (You)",
        emoji: "📋",
        thoughts: "I gave her ownership—why won't she take it? Every question creates a bottleneck. I don't have time to make decisions she should be making. Maybe I was wrong about her readiness for this role.",
        feelings: ["Frustrated", "Impatient", "Overwhelmed"],
        needs: "Sarah to act autonomously, fewer interruptions, project progress"
      },
      {
        role: "Previous Manager (Context)",
        emoji: "👔",
        thoughts: "(Sarah's former manager was highly controlling, reviewed everything, often overruled decisions after the fact. Sarah learned that 'ownership' was just a word—real decisions needed approval.)",
        feelings: ["N/A - Context"],
        needs: "N/A - Context"
      }
    ],
    insight: "Past experiences shape behavior. 'Granting authority' isn't enough when someone has learned that exercising authority leads to problems. Empowerment requires active confidence-building.",
    betterApproach: "Instead of answering questions directly, ask 'What would you do?' Affirm her judgment. Gradually she'll realize her instincts are good and the questions will decrease."
  },
  {
    id: 4,
    title: "The Stakeholder Takeover",
    situation: "A senior stakeholder, David, is unhappy with a sprint outcome and demands the PM start assigning tasks directly instead of letting the team self-organize. Team velocity has actually been excellent—the issue was an unclear requirement from David's team.",
    perspectives: [
      {
        role: "David (Senior Stakeholder)",
        emoji: "👔",
        thoughts: "This 'self-organizing' thing isn't working. I don't even know who's doing what. The PM should be managing the team, not letting them figure it out themselves. I need more visibility and control.",
        feelings: ["Frustrated", "Out of control", "Concerned"],
        needs: "Visibility into work, confidence in delivery, feeling heard"
      },
      {
        role: "Development Team",
        emoji: "👥",
        thoughts: "We've been crushing it for 6 months. One bad sprint—caused by unclear requirements from David's team—and suddenly we can't be trusted to organize ourselves? If the PM caves on this, we'll all lose autonomy.",
        feelings: ["Defensive", "Anxious", "Frustrated"],
        needs: "Autonomy preserved, fair assessment, protection from blame"
      },
      {
        role: "PM (You)",
        emoji: "📋",
        thoughts: "David has legitimate concerns but his solution would destroy what's working. The real problem is requirements clarity, not self-organization. But David is senior and I can't just tell him he's wrong.",
        feelings: ["Caught in middle", "Protective of team", "Diplomatic"],
        needs: "Address David's concern while protecting team autonomy, solve real problem"
      }
    ],
    insight: "Stakeholders often diagnose symptoms, not root causes. Protecting team empowerment requires addressing real concerns with evidence while solving the actual problem.",
    betterApproach: "Share velocity data showing excellent performance. Acknowledge the sprint issue and trace it to unclear requirements. Propose a solution for requirements clarity that gives David the visibility he needs without dismantling self-organization."
  },
  {
    id: 5,
    title: "The Setup Failure",
    situation: "James, a technical lead, was given budget authority and approved $50K in cloud infrastructure without getting competitive quotes—violating finance policy for purchases over $10K. Finance is questioning the expense. James didn't know about the policy.",
    perspectives: [
      {
        role: "James (Technical Lead)",
        emoji: "👨‍💻",
        thoughts: "I was told I had budget authority. I made a good technical decision. Now I'm being questioned like I did something wrong? Nobody told me about a quote requirement. I feel set up to fail.",
        feelings: ["Blindsided", "Defensive", "Betrayed"],
        needs: "Clear boundaries upfront, support when process fails, fair treatment"
      },
      {
        role: "Finance Team",
        emoji: "💰",
        thoughts: "The policy exists for good reasons—we need competitive pricing and audit trails. This wasn't communicated properly to the technical lead. But we still need compliance.",
        feelings: ["Concerned", "Process-focused"],
        needs: "Policy compliance, proper documentation, process improvement"
      },
      {
        role: "PM (You)",
        emoji: "📋",
        thoughts: "I delegated budget authority but never explained the constraints. This is my failure, not James's. I need to fix this without throwing him under the bus or revoking authority unfairly.",
        feelings: ["Responsible", "Guilty", "Problem-solving"],
        needs: "Fix immediate issue, create proper guardrails, maintain trust with James"
      }
    ],
    insight: "Delegation without preparation is setup for failure. When delegation fails, look first at how you set them up—did they have clear outcomes, authority boundaries, and context?",
    betterApproach: "Take responsibility for inadequate preparation. Work with James to retroactively gather quotes if possible. Create a clear authority matrix together so boundaries are explicit going forward."
  }
];
```

---

## CURSOR IMPLEMENTATION INSTRUCTIONS

### Step 1: PM Simulator
Find the PM Simulator component for Empower Team and replace the empty scenarios array with the `pmSimulatorScenarios` from FIX 1.

### Step 2: Lightning Round
Find the Lightning Round component for Empower Team and replace the empty questions array with the `lightningRoundQuestions` from FIX 2.

### Step 3: Delegation Level Matcher
1. Rename the activity from "Conflict [whatever]" to "Delegation Level Matcher"
2. Update the activity metadata
3. Replace all scenario content with `delegationMatcherScenarios` from FIX 3
4. Add the `delegationLevels` reference array

### Step 4: Empowerment Perspectives
1. Rename from "Empathy Exercise" to "Empowerment Perspectives"
2. Update the activity metadata with new title and description
3. Replace all scenario content with `empowermentPerspectivesScenarios` from FIX 4

---

## QUICK CHECKLIST

| Activity | Current State | Fix |
|----------|---------------|-----|
| PM Simulator | No scenarios | Add 5 empowerment-focused scenarios |
| Lightning Round | No questions | Add 15 empowerment questions |
| Delegation Level Matcher | Called "Conflict", has conflict content | Rename + replace with 12 delegation scenarios |
| Empowerment Perspectives | Called "Empathy Exercise", no scenarios | Rename + add 5 multi-perspective scenarios |
