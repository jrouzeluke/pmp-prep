# Task 4: Empower Team Members and Stakeholders
## DOCUMENT DETECTIVE (6 Documents)

---

## How This Activity Works

Examine real project documents for empowerment issues. Each document contains problems related to delegation, authority, accountability, or team autonomy. Your job is to identify the issues, explain why they're problematic, and recommend corrections.

---

## Document 1: Delegation Email

**Document Type:** Email from PM to Team Member

```
From: Rachel Martinez (Project Manager)
To: Kevin Park (Senior Developer)
Subject: Database Migration Ownership
Date: Monday, 9:15 AM

Kevin,

I'm assigning you to own the database migration workstream. This is critical 
to our Q2 launch.

You'll be responsible for delivering the migration on schedule and ensuring 
zero data loss. This is a high-visibility deliverable and leadership is 
watching closely.

Let me know if you have questions.

Rachel
```

---

### Your Analysis

**Question 1:** What empowerment elements are present in this delegation?

**Question 2:** What empowerment elements are missing?

**Question 3:** What problems might Kevin encounter?

**Question 4:** How should this delegation be restructured?

---

### Analysis & Answers

<details>
<summary>Click for Answers</summary>

**Question 1: What empowerment elements are present?**

✅ **Present:**
- **Accountability** — Kevin is clearly responsible for delivery and outcomes
- **Visibility** — The importance is communicated

**Question 2: What empowerment elements are missing?**

❌ **Missing:**
- **Authority** — No decision rights defined. Can Kevin approve overtime? Hire contractors? Make technical decisions? Escalate blockers?
- **Autonomy** — No clarity on approach. Must he follow a specific method or can he determine the approach?
- **Resources** — No mention of budget, team support, or tools
- **Boundaries** — No constraints defined (timeline, budget limits, scope boundaries)
- **Support** — No checkpoint schedule or escalation path
- **Success Criteria** — "Zero data loss" is mentioned but no other success measures

**Question 3: What problems might Kevin encounter?**

- **Authority Gap:** Kevin will likely hit decisions he can't make (budget, staffing, timeline changes) and will have to keep coming back to Rachel
- **Setup for Blame:** If it fails, Kevin was "responsible" but didn't have what he needed
- **Ambiguous Expectations:** "On schedule" but no schedule provided; "zero data loss" but no testing/validation approach
- **No Support Structure:** High-stakes deliverable with no checkpoints or help

**Question 4: How should this delegation be restructured?**

**Better Version:**
```
Kevin,

I'm delegating ownership of the database migration workstream to you. Here's 
what that means:

YOUR AUTHORITY:
- Technical approach decisions: You decide
- Budget up to $15K: You approve
- Schedule adjustments within 1 week: You decide, inform me
- Staffing requests: Recommend to me, I'll approve
- Scope changes: Bring to me for discussion

SUCCESS CRITERIA:
- Migration complete by April 15
- Zero data loss (verified by QA validation)
- Maximum 4 hours downtime
- All rollback procedures documented and tested

SUPPORT:
- DBA team available for consultation
- Weekly checkpoint: Thursdays 2pm
- Escalation: Come to me immediately for blockers

BOUNDARIES:
- Stay within approved architecture
- Follow security compliance requirements
- Coordinate with QA on testing windows

You own the "how." I'll support you on obstacles and stakeholder management.

Rachel
```

</details>

---

## Document 2: RACI Matrix

**Document Type:** Responsibility Assignment Matrix

```
PROJECT: Customer Portal Redesign
VERSION: 1.3
DATE: March 15

TASK                          | Sarah | Mike | Lisa | Tom  | Dev Team
------------------------------|-------|------|------|------|----------
Requirements Gathering        |   A   |  R   |  C   |  I   |    C
UI/UX Design                  |   A   |  C   |  R   |  I   |    C
Frontend Development          |   A   |  I   |  C   |  R   |    R
Backend Development           |   A   |  I   |  C   |  A   |    R
Integration Testing           |   A   |  R   |  I   |  A   |    R
User Acceptance Testing       |   A   |  A   |  R   |  I   |    I
Deployment                    |   A   |  I   |  I   |  R   |    R
Post-Launch Support           |   A   |  R   |  I   |  R   |    R

LEGEND:
R = Responsible (does the work)
A = Accountable (owns the outcome)
C = Consulted (provides input)
I = Informed (notified of outcome)
```

---

### Your Analysis

**Question 1:** What RACI rule violations do you see?

**Question 2:** Which tasks have accountability problems?

**Question 3:** What empowerment issues does this matrix reveal?

**Question 4:** How should this be corrected?

---

### Analysis & Answers

<details>
<summary>Click for Answers</summary>

**Question 1: What RACI rule violations do you see?**

❌ **Violations:**
- **Multiple A's:** Backend Development has Sarah AND Tom as Accountable
- **Multiple A's:** Integration Testing has Sarah AND Tom as Accountable
- **Multiple A's:** User Acceptance Testing has Sarah AND Mike as Accountable
- **Rule:** There can only be ONE "A" per task

**Question 2: Which tasks have accountability problems?**

- **Backend Development:** Sarah and Tom both Accountable — who really owns it?
- **Integration Testing:** Sarah and Tom both Accountable — conflict when issues arise
- **User Acceptance Testing:** Sarah and Mike both Accountable — unclear escalation
- **Post-Launch Support:** Two R's (Mike and Tom) with no clarity on division

**Question 3: What empowerment issues does this matrix reveal?**

- **Sarah as A for everything:** Sarah is the PM. Having PM as Accountable for every task means the team doesn't truly own outcomes.
- **False ownership:** Tom and Mike think they're accountable, but so is Sarah — creates confusion about who makes final decisions
- **Bottleneck risk:** If Sarah must be accountable for all tasks, she becomes the constraint
- **Team disempowerment:** Dev Team is only R or C — never Accountable for anything, despite doing the work

**Question 4: How should this be corrected?**

**Corrected RACI:**
```
TASK                          | Sarah | Mike | Lisa | Tom  | Dev Team
------------------------------|-------|------|------|------|----------
Requirements Gathering        |   C   |  A   |  C   |  I   |    C
UI/UX Design                  |   I   |  C   |  A   |  I   |    C
Frontend Development          |   I   |  I   |  C   |  R   |    A
Backend Development           |   I   |  I   |  C   |  A   |    R
Integration Testing           |   I   |  R   |  I   |  A   |    R
User Acceptance Testing       |   I   |  C   |  A   |  I   |    R
Deployment                    |   C   |  I   |  I   |  A   |    R
Post-Launch Support           |   I   |  A   |  I   |  C   |    R
```

**Key Changes:**
- ONE "A" per task (non-negotiable)
- PM (Sarah) is Consulted or Informed, not Accountable for everything
- Team members own outcomes in their domains
- Dev Team is Accountable for technical tasks they control

</details>

---

## Document 3: Meeting Notes

**Document Type:** Sprint Planning Meeting Notes

```
SPRINT PLANNING - SPRINT 14
Date: Tuesday, 10:00 AM
Attendees: PM (Jordan), Dev Team (5 members), Product Owner (Maria)

AGENDA: Plan Sprint 14 work

DISCUSSION:
- Maria presented the prioritized backlog items
- Team discussed complexity of each item
- Jordan assigned tasks:
  * User authentication: Assigned to Derek
  * Payment processing: Assigned to Priya
  * Dashboard redesign: Assigned to Chen and Anika
  * API optimization: Assigned to Marcus
- Team estimated 47 story points
- Jordan said we should commit to 52 points to catch up from last sprint
- Team agreed to 52 points

ACTION ITEMS:
- Derek to start authentication by Wednesday
- Priya to coordinate with payment vendor
- Chen/Anika to review UX specs before starting
- Marcus to identify optimization targets
- Jordan to update sprint board

NEXT MEETING: Daily standup tomorrow 9:00 AM
```

---

### Your Analysis

**Question 1:** What empowerment violations occurred in this meeting?

**Question 2:** What should the team have done instead?

**Question 3:** What is problematic about the commitment decision?

**Question 4:** How should this sprint planning have been conducted?

---

### Analysis & Answers

<details>
<summary>Click for Answers</summary>

**Question 1: What empowerment violations occurred?**

❌ **Violations:**

**1. PM assigned tasks:**
- "Jordan assigned tasks" — In agile, the TEAM self-assigns work
- PM should facilitate, not direct task distribution

**2. PM overrode team capacity:**
- Team estimated 47 points
- Jordan pushed for 52 "to catch up"
- Team capacity belongs to the team, not the PM

**3. Forced agreement:**
- "Team agreed to 52 points" after PM pressure
- This isn't real agreement—it's compliance
- Team owns their commitment; PM shouldn't dictate it

**4. PM owns sprint board:**
- "Jordan to update sprint board"
- Team should own their own artifacts

**Question 2: What should the team have done instead?**

- **Self-assign work:** Team members volunteer for tasks based on skills and interest
- **Own their estimate:** Team commits to what THEY believe is achievable
- **Push back on pressure:** "We've estimated 47 points based on our capacity. Committing to more isn't realistic."
- **Own their tools:** Team updates their own sprint board

**Question 3: What is problematic about the commitment decision?**

- **Unsustainable pace:** Pushing beyond capacity leads to burnout and shortcuts
- **False commitment:** Team didn't genuinely commit—they complied with PM pressure
- **Undermined trust:** Team's professional judgment was overridden
- **Sets bad precedent:** Teaches team that their estimates don't matter
- **Predictable failure:** Over-commitment usually leads to incomplete sprints

**Question 4: How should this sprint planning have been conducted?**

**Better Meeting Flow:**
```
SPRINT PLANNING - SPRINT 14

DISCUSSION:
- Maria presented prioritized backlog items
- TEAM discussed complexity and assigned story points
- TEAM MEMBERS volunteered for work items:
  * Derek volunteered for user authentication
  * Priya volunteered for payment processing
  * Chen and Anika volunteered to pair on dashboard
  * Marcus volunteered for API optimization
- Team calculated capacity: 47 points based on velocity
- Maria asked if team could stretch to close gap from Sprint 13
- Team discussed and agreed to 49 points (small stretch)
- Jordan asked what obstacles might prevent success
- Team identified vendor dependency risk on payment processing
- Jordan committed to escalating vendor response time

ACTION ITEMS:
- Team to update sprint board
- Jordan to address vendor dependency
- Maria to be available for backlog questions
```

</details>

---

## Document 4: Performance Review Excerpt

**Document Type:** Annual Performance Review

```
EMPLOYEE: Samantha Chen
ROLE: Senior Business Analyst
REVIEWER: Michael Torres (Project Manager)
PERIOD: January - December 2024

PERFORMANCE RATING: Meets Expectations

COMMENTS:

Samantha has been a reliable team member this year. She completes assigned 
work on time and follows established processes well.

AREAS FOR IMPROVEMENT:

- Samantha needs to take more initiative. She waits for direction rather 
  than proactively identifying work.

- When facing ambiguous situations, Samantha asks for guidance rather than 
  making decisions herself.

- Samantha should demonstrate more ownership of her deliverables rather 
  than checking with me on every detail.

DEVELOPMENT GOALS FOR NEXT YEAR:

- Take more initiative and ownership
- Make more independent decisions
- Reduce dependency on manager guidance
```

---

### Your Analysis

**Question 1:** What does this review reveal about the PM's leadership style?

**Question 2:** Is this feedback fair to Samantha?

**Question 3:** What questions should we ask before accepting this feedback?

**Question 4:** If you were Samantha, how might you respond?

---

### Analysis & Answers

<details>
<summary>Click for Answers</summary>

**Question 1: What does this review reveal about the PM's leadership style?**

🔍 **Reveals:**
- **Possible micromanagement:** If Samantha "checks on every detail," was that trained behavior or her natural style?
- **Unclear expectations:** Was Samantha ever told she COULD make decisions independently?
- **Authority ambiguity:** Were decision rights ever defined?
- **Blame shifting:** PM may be criticizing behavior they created

**Red Flag Questions:**
- Did Michael ever explicitly empower Samantha to decide?
- Were there consequences when Samantha acted independently?
- Is the culture one where independent decisions are welcomed or punished?

**Question 2: Is this feedback fair to Samantha?**

⚠️ **Potentially Unfair If:**
- Samantha was never told she had authority to decide
- Previous independent decisions were criticized or overruled
- The culture punishes mistakes from autonomous decisions
- Michael wants approval on everything but criticizes Samantha for seeking it

✅ **Fair If:**
- Samantha was explicitly empowered and chose not to act
- Authority was clearly defined and Samantha still deferred
- Michael has been actively encouraging autonomy

**The feedback blames Samantha for behavior the PM may have created or reinforced.**

**Question 3: What questions should we ask before accepting this feedback?**

- Has Samantha been explicitly told what she can decide independently?
- What happened when Samantha made independent decisions in the past?
- Does the team culture encourage or discourage autonomous action?
- Has Michael ever said "you should have checked with me" when Samantha acted independently?
- What authority has been formally delegated to Samantha?

**Question 4: If you were Samantha, how might you respond?**

**Possible Response:**
```
"I appreciate the feedback. I want to clarify something: I'd like to take 
more ownership, but I haven't been clear on what decisions I'm empowered 
to make independently. 

Can we create a decision rights framework that defines:
- What I can decide on my own
- What I should decide and inform you about
- What requires your input before I decide
- What needs your approval

With that clarity, I can demonstrate the initiative you're looking for."
```

**This reframes from "Samantha's weakness" to "clarity needed on both sides."**

</details>

---

## Document 5: Team Survey Results

**Document Type:** Team Health Survey Summary

```
TEAM HEALTH SURVEY - Q3 RESULTS
PROJECT: Enterprise Platform Modernization
RESPONDENTS: 8 of 9 team members (89% response rate)

QUESTION                                          | SCORE (1-5) | TREND
--------------------------------------------------|-------------|-------
I understand what is expected of me               |    4.2      |  ↑
I have the resources I need to do my job          |    3.1      |  ↓
I have authority to make decisions in my area     |    2.3      |  ↓
My input is valued when decisions are made        |    3.8      |  →
I feel ownership over my work                     |    2.6      |  ↓
I can act without waiting for approval            |    2.1      |  ↓
The PM trusts the team                            |    3.4      |  ↓
I feel empowered to solve problems                |    2.5      |  ↓

OPEN COMMENTS (Selected):
- "I know what to do, but I need permission to do it."
- "Every decision goes through [PM name] no matter how small."
- "I've stopped making suggestions because they never get approved."
- "We used to have more autonomy. Something changed."
- "I feel like I'm just executing someone else's decisions."
```

---

### Your Analysis

**Question 1:** What pattern do you see in these results?

**Question 2:** What is the likely root cause?

**Question 3:** What is the business impact of these scores?

**Question 4:** What actions should the PM take?

---

### Analysis & Answers

<details>
<summary>Click for Answers</summary>

**Question 1: What pattern do you see?**

📊 **Pattern: Empowerment Crisis**

**High scores:**
- Understanding expectations (4.2) — People know WHAT to do
- Input valued (3.8) — They're asked for opinions

**Low scores (all empowerment-related):**
- Authority to decide (2.3) — Can't act on what they know
- Acting without approval (2.1) — Stuck waiting
- Ownership (2.6) — Don't feel like their work is theirs
- Empowered to solve problems (2.5) — Learned helplessness

**Trend:** All empowerment metrics declining (↓)

**Question 2: What is the likely root cause?**

🎯 **Root Cause: Centralized Decision-Making**

Evidence from comments:
- "Every decision goes through [PM]" — Bottleneck
- "I need permission to do it" — Authority gap
- "Stopped making suggestions" — Learned helplessness
- "Something changed" — Possible PM change or new controls

**The PM is likely:**
- Requiring approval for too many decisions
- Overruling team suggestions
- Not delegating decision authority
- Possibly responding to pressure by increasing control

**Question 3: What is the business impact?**

💰 **Business Impact:**

**Speed:** Decisions wait for PM → Slower delivery
**Quality:** Disengaged workers → Lower quality, less innovation
**Retention:** "Just executing" → Top talent will leave
**Scalability:** PM is bottleneck → Can't grow the team effectively
**Morale:** Declining scores → Expect continued deterioration

**Predictable outcomes:**
- Increased turnover (especially high performers)
- Missed deadlines (approval delays)
- Reduced innovation (why bother suggesting?)
- PM burnout (everything depends on them)

**Question 4: What actions should the PM take?**

**Immediate Actions:**

1. **Acknowledge the feedback** — Don't be defensive. "I hear this and I want to fix it."

2. **Create decision rights matrix** — Define explicitly what team decides vs. what needs PM input

3. **Delegate immediately** — Identify 3-5 decision areas to hand to the team this week

4. **Investigate "something changed"** — What triggered the decline? New controls? PM behavior change?

5. **Stop approval theater** — If you approve 95% without changes, you don't need to approve

**Longer-term:**
- Regular empowerment check-ins
- Celebrate autonomous decisions
- Coach instead of approve
- Measure and report on authority distribution

</details>

---

## Document 6: Authority Matrix

**Document Type:** Decision Authority Guidelines

```
PROJECT DECISION AUTHORITY MATRIX
Project: Digital Transformation Initiative
Version: 2.1
Approved by: Steering Committee

DECISION CATEGORY              | AUTHORITY LEVEL
-------------------------------|----------------------------------------
Technical architecture         | PM approval required
Technology/tool selection      | PM approval required
Code review standards          | PM approval required
Sprint commitments             | PM approval required
Task assignments               | PM approval required
Meeting schedules              | PM approval required
Working hours/location         | PM approval required
Documentation format           | PM approval required
Defect prioritization          | PM approval required
Vendor communications          | PM approval required
Process improvements           | PM approval required
Budget expenditures            | Steering Committee approval required
Scope changes                  | Steering Committee approval required
Timeline changes               | Steering Committee approval required
Resource additions             | Steering Committee approval required
Stakeholder escalations        | PM approval required
Team conflicts                 | PM decision
Training requests              | PM approval required

NOTE: All other decisions not listed require PM approval.
```

---

### Your Analysis

**Question 1:** What is wrong with this authority matrix?

**Question 2:** What message does this send to the team?

**Question 3:** What decisions SHOULD be delegated to the team?

**Question 4:** Rewrite this matrix with appropriate authority distribution.

---

### Analysis & Answers

<details>
<summary>Click for Answers</summary>

**Question 1: What is wrong with this authority matrix?**

❌ **Problems:**

**1. Everything requires PM approval:**
- 17 of 17 categories require PM or higher approval
- Team has ZERO decision authority
- PM is bottleneck for everything

**2. Absurd control items:**
- "Meeting schedules" — Team can't schedule their own meetings?
- "Documentation format" — PM approves formatting?
- "Working hours/location" — Micromanagement
- "Task assignments" — Violates self-organization

**3. Default to control:**
- "All other decisions not listed require PM approval"
- Assumes no trust unless explicitly granted

**4. Technical decisions centralized:**
- Architecture, tools, code standards — should be technical team
- PM may not have expertise to make these calls

**Question 2: What message does this send to the team?**

📢 **Message Received:**
- "We don't trust you"
- "You're just here to execute"
- "Your judgment isn't valued"
- "Don't think, just ask"
- "PM knows better than experts"

**Consequences:**
- Learned helplessness
- Disengagement
- Top talent departure
- Innovation death
- PM burnout
- Slow delivery

**Question 3: What decisions SHOULD be delegated to the team?**

| Decision | Why Team Should Own It |
|----------|------------------------|
| Technical architecture | Technical experts know best |
| Tool selection | Users should choose their tools |
| Code standards | Team lives with the consequences |
| Task assignments | Self-organization principle |
| Sprint commitments | Team owns their capacity |
| Meeting schedules | Basic professional autonomy |
| Process improvements | Team knows what's broken |
| Documentation format | Minimal impact, high annoyance |
| Working approach | Trust professionals |

**Question 4: Rewrite with appropriate authority distribution**

**Revised Authority Matrix:**

```
DECISION CATEGORY              | AUTHORITY LEVEL
-------------------------------|----------------------------------------
Technical architecture         | Tech Lead decides, informs PM
Technology/tool selection      | Team decides (within budget)
Code review standards          | Team decides
Sprint commitments             | Team decides (PM input)
Task assignments               | Team self-assigns
Meeting schedules              | Team decides
Working hours/location         | Team decides (within policy)
Documentation format           | Team decides
Defect prioritization          | Team decides (PO input on business impact)
Vendor communications          | Assigned owner decides
Process improvements           | Team decides, informs PM
Budget expenditures <$5K       | PM decides
Budget expenditures >$5K       | Steering Committee
Scope changes                  | Steering Committee
Timeline changes >1 week       | Steering Committee
Resource additions             | Steering Committee (PM recommends)
Stakeholder escalations        | PM handles
Team conflicts                 | Team first, PM if unresolved
Training requests <$2K         | PM approves
Training requests >$2K         | Steering Committee

DEFAULT: Decisions within team's domain belong to the team.
When in doubt, decide and inform rather than wait for approval.
```

</details>

---

## END OF DOCUMENT DETECTIVE
