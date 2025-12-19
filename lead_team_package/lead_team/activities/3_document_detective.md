Here's the complete content for the Lead a Team Document Detective page:

```markdown
← Back
Lead a Team
Document Detective

Analyze Real Project Artifacts to Identify Team Development and Leadership

Welcome to Document Detective! In this activity, you'll examine realistic project documents, emails, and meeting notes to diagnose team development stages, identify leadership approaches, and spot opportunities for improvement. This mirrors real-world PM work where you must read between the lines to understand team dynamics.

---

## How to Use Document Detective

1. **Read each artifact carefully** - Look for clues about team stage and leadership
2. **Identify key indicators** - What behaviors, language, and patterns do you see?
3. **Diagnose the situation** - What stage? What leadership approach is being used?
4. **Spot the issues** - What's working? What's not?
5. **Recommend improvements** - What should the PM do differently?

**Time Estimate:** 30-40 minutes for all 6 artifacts

---

## Artifact 1: Project Kickoff Meeting Notes

### Document

```
PROJECT: Customer Portal Redesign
MEETING: Team Kickoff
DATE: January 15, 2025
ATTENDEES: Sarah (PM), Alex (UX), Jordan (Dev Lead), Casey (QA), Morgan (BA), Taylor (Designer)

NOTES:
- Sarah welcomed everyone and thanked them for joining the project
- Went through project charter and objectives
- Q: Alex asked "What's our timeline for this project?"
- A: Sarah explained 6-month timeline with quarterly milestones
- Q: Jordan asked "Who has final say on technical architecture decisions?"
- A: Sarah said "We'll discuss that" but didn't provide clear answer
- Q: Casey asked "How often do we meet as a team?"
- A: Sarah suggested "Let's figure that out as we go"
- Q: Morgan asked "Do I report to you or my functional manager?"
- A: Sarah said "Good question - I'll get back to you on that"
- Q: Taylor raised hand and quietly asked "Sorry, what exactly is my role on this project?"
- Everyone nodded politely during Sarah's overview
- No one challenged any information presented
- Several people took detailed notes
- Meeting ended 10 minutes early
- Alex and Jordan stayed after to ask Sarah similar questions privately

ACTION ITEMS:
- Sarah to create meeting schedule (TBD)
- Sarah to clarify reporting relationships (TBD)
- Sarah to define roles more clearly (TBD)
```

### Your Analysis

**Question 1:** What team development stage is this team in?

**Question 2:** What leadership issues do you see?

**Question 3:** What should Sarah do immediately after this meeting?

---

### Analysis & Answers

<details>
<summary>Click to see detailed analysis</summary>

**Question 1: Team Development Stage**

✅ **Answer: Forming**

**Evidence:**
- First meeting (kickoff)
- Polite behavior ("nodded politely")
- Many questions about basic structure (timeline, meetings, roles, reporting)
- No one challenged information
- Uncertain about roles ("what exactly is my role?")
- People staying after to ask questions privately (hesitant to speak up)
- Need for clarity and structure evident

**Key Indicators:**
- "Everyone nodded politely" = classic Forming politeness
- Multiple questions about roles and processes = need for structure
- "Quietly asked" = tentative, uncertain behavior
- Taking detailed notes = trying to understand everything

---

**Question 2: Leadership Issues**

❌ **Problems Identified:**

**1. Lack of Structure and Clarity**
- Sarah didn't provide clear answers to fundamental questions
- "We'll figure that out as we go" = abdicating responsibility to provide structure
- "I'll get back to you" = should have answered or provided timeline
- Multiple action items marked "TBD" = no concrete plan

**2. Missed Opportunity to Establish Foundation**
- Should have had RACI matrix ready
- Should have defined decision-making authority
- Should have established meeting schedule
- Should have clarified reporting relationships

**3. Inappropriate Leadership Style**
- Forming teams need directive leadership
- Sarah being too hands-off
- Not providing the structure team clearly needs
- Expecting team to self-organize prematurely

**4. Multiple People Asking Same Questions**
- Alex and Jordan asked separately after = information wasn't shared with whole team
- Creates inconsistency risk
- Should have been addressed in group

**What This Tells Us:**
Sarah may be trying to be "collaborative" or "servant leader" but Forming teams need structure and direction first. You can't empower a team that doesn't have foundation.

---

**Question 3: What Sarah Should Do Immediately**

✅ **Recommended Actions:**

**Within 24 Hours:**

1. **Create and Share RACI Matrix**
   - Define roles explicitly for each person
   - Clarify decision-making authority
   - Address Jordan's question about technical decisions
   - Make Taylor's role crystal clear

2. **Establish Meeting Schedule**
   - Set up regular team meetings (suggest daily standups, weekly planning)
   - Put meetings on calendars immediately
   - Define purpose of each meeting type

3. **Clarify Reporting Relationships**
   - Document who reports to whom
   - Explain dual reporting if applicable (functional vs. project)
   - Set expectations for escalation

4. **Define Decision-Making Process**
   - Who decides what
   - When consensus vs. PM decision
   - How to escalate disagreements

5. **Create Ground Rules**
   - Facilitate team discussion to establish norms
   - Document and share
   - Get team commitment

6. **Schedule Individual Check-ins**
   - Meet with each team member 1-on-1
   - Understand their concerns, skills, preferences
   - Build relationships
   - Answer their specific questions

**Leadership Style Needed:**
- **Authoritative** - Provide clear vision and structure
- Be decisive and directive
- Don't expect team to figure things out themselves
- Make decisions about team operations confidently

**Email Sarah Should Send:**

```
Subject: Project Structure and Next Steps

Team,

Thank you for today's kickoff meeting. I heard your questions about structure 
and want to provide clarity immediately.

ATTACHED:
- RACI Matrix (your roles and responsibilities)
- Meeting Schedule (now on your calendars)
- Decision-Making Framework
- Reporting Relationships

KEY DECISIONS:
- Technical architecture: Jordan leads with team input
- Team meetings: Daily 15-min standup, weekly planning
- Reporting: You report to me for project work, your functional manager for 
  performance reviews
- Ground rules: We'll establish together in tomorrow's meeting

I'm scheduling 30-minute 1-on-1s with each of you this week to answer any 
specific questions.

Let's have a great project!
Sarah
```

This approach:
- Provides immediate clarity
- Shows decisive leadership
- Addresses all questions raised
- Demonstrates preparation and care
- Appropriate for Forming stage

</details>

---

## Artifact 2: Email Thread - Technical Disagreement

### Document

```
FROM: Jordan (Dev Lead)
TO: Sarah (PM)
DATE: February 10, 2025
SUBJECT: Architecture Decision Needed

Sarah,

Alex and I have been going in circles on the database approach for 3 days now. 
We need you to make a decision so we can move forward.

Alex wants microservices with separate databases for each service. I think 
that's way too complex for our needs and team size. A well-designed monolith 
would be faster to build and easier to maintain.

We've both presented our cases multiple times. Neither of us is backing down. 
This is blocking the entire team from moving forward with development.

Can you please decide by end of day so we can get moving?

Thanks,
Jordan

---

FROM: Sarah (PM)
TO: Jordan (Dev Lead)
CC: Alex (UX)
DATE: February 10, 2025
RE: Architecture Decision Needed

Jordan,

I appreciate you both raising this. Since you both have strong technical 
expertise and I trust your judgment, I'll leave this decision to the two of 
you to work out. You're the technical leads, so I'm confident you can come 
to agreement.

Please let me know once you've decided which way to go.

Sarah

---

FROM: Alex (UX)
TO: Sarah (PM)
CC: Jordan (Dev Lead)
DATE: February 10, 2025
RE: Architecture Decision Needed

Sarah,

With all due respect, that's not helpful. We've been trying to "work it out" 
for 3 days. That's exactly the problem - we CAN'T agree. We need facilitation 
or a decision, not to be told to keep trying the same thing that isn't working.

This is really frustrating. We're wasting time while you avoid the issue.

Alex

---

FROM: Jordan (Dev Lead)
TO: Sarah (PM)
CC: Alex (UX)
DATE: February 10, 2025
RE: Architecture Decision Needed

I have to agree with Alex on this one. We need your leadership here, not to 
be sent back to keep arguing.

Jordan

---

FROM: Sarah (PM)
TO: Team
DATE: February 10, 2025
SUBJECT: Architecture Decision

Team,

After consideration, we will proceed with the monolithic architecture approach. 
This decision is final. Jordan, please proceed with implementation.

Alex, I understand you disagree, but we need to move forward.

Meeting is tomorrow at 10am - see you there.

Sarah
```

### Your Analysis

**Question 1:** What team development stage is this team in?

**Question 2:** What leadership mistakes did Sarah make?

**Question 3:** What should Sarah have done instead?

**Question 4:** What's likely to happen next with this team?

---

### Analysis & Answers

<details>
<summary>Click to see detailed analysis</summary>

**Question 1: Team Development Stage**

✅ **Answer: Storming**

**Evidence:**
- Open disagreement between team members (Alex vs. Jordan)
- "Going in circles for 3 days" = extended conflict
- "Neither of us is backing down" = power struggle
- Frustration evident in emails
- Challenging PM's authority ("that's not helpful", "you avoid the issue")
- Team blocked by conflict = energy going to disagreement, not work

**Key Indicators:**
- Technical disagreement that's become personal
- Direct challenges to PM ("With all due respect, that's not helpful")
- Frustration and irritability showing
- Productivity blocked by conflict
- Classic Storming stage dynamics

---

**Question 2: Sarah's Leadership Mistakes**

❌ **Multiple Critical Errors:**

**Mistake #1: Avoiding Facilitation (First Response)**
- "I'll leave this decision to the two of you"
- They already told her they CAN'T agree
- This is abdication, not empowerment
- Wrong style for Storming stage

**Why It's Wrong:**
- Storming teams need facilitation, not avoidance
- Conflict won't resolve itself
- PM's job is to guide through disagreement
- Team explicitly asked for help

**Mistake #2: Forcing Decision Without Discussion (Final Response)**
- Went from hands-off to forcing unilateral decision
- No facilitation or discussion
- Picked Jordan's approach without explanation
- No criteria for decision

**Why It's Wrong:**
- Alex will feel shut down and unsupported
- Decision made without full technical analysis
- Lost opportunity to teach team how to resolve conflicts
- Damages trust with Alex

**Mistake #3: Poor Communication**
- Dismissive tone ("I understand you disagree, but...")
- No explanation of decision rationale
- No acknowledgment of Alex's perspective
- Defensive when challenged

**Mistake #4: Failing to Recognize Storming**
- Didn't see this as normal development stage
- Treated it as personality problem
- Reacted to discomfort instead of facilitating

**Leadership Style Used:**
- First: Avoiding (not a style, abdication)
- Then: Commanding (forced decision)
- Neither appropriate for this situation

**Appropriate Style:**
- **Coaching** - Facilitate structured discussion
- Help them work through it constructively
- Don't avoid, don't force

---

**Question 3: What Sarah Should Have Done**

✅ **Correct Approach:**

**Immediate Response (First Email):**

```
FROM: Sarah (PM)
TO: Jordan, Alex
DATE: February 10, 2025
RE: Architecture Decision Needed

Jordan and Alex,

Thank you for raising this - it's an important decision. I can see you've both 
put significant thought into your approaches.

Rather than deciding unilaterally or having you continue the same discussion, 
let's take a structured approach:

MEETING: Tomorrow 2pm, 90 minutes
WHO: You two, plus Casey and Morgan (they'll be affected)
FORMAT:
1. Alex presents microservices approach (20 min)
2. Jordan presents monolithic approach (20 min)
3. Team discussion using these criteria:
   - Development speed (we have 6-month deadline)
   - Maintenance complexity (we're a team of 5)
   - Scalability needs (based on projected load)
   - Risk factors
4. Group decision or my decision based on criteria

I'll facilitate the discussion. Come prepared to present objectively, not 
argue. Bring data if possible.

This type of technical disagreement is normal and healthy - we just need a 
better process for resolving it. Let's model that tomorrow.

Sarah
```

**What This Does:**
- Acknowledges both perspectives (Affiliative element)
- Creates structure for resolution (Coaching)
- Sets objective criteria (removes emotion)
- Involves broader team (Democratic element)
- PM facilitates, doesn't dictate
- Teaches team how to resolve future conflicts
- Appropriate for Storming stage

**During the Meeting:**

1. **Set Ground Rules**
   - Respectful discussion
   - Focus on project needs, not personal preferences
   - Listen to understand, not to argue
   - Assume positive intent

2. **Facilitate Presentations**
   - Each person presents uninterrupted
   - Ask clarifying questions
   - Take notes on flip chart

3. **Lead Criteria-Based Discussion**
   - "Let's evaluate each approach against our criteria"
   - Keep focus on data and project needs
   - Draw out quieter team members
   - Manage time

4. **Reach Decision**
   - Ideally: Team consensus on best approach
   - If no consensus: PM decides based on criteria and explains why
   - Acknowledge both perspectives
   - Commit forward as team

**After the Meeting:**

```
FROM: Sarah (PM)
TO: Team
DATE: After meeting
SUBJECT: Architecture Decision and Process Learning

Team,

Great discussion today. Here's what we decided and why:

DECISION: [Chosen approach]

RATIONALE:
- Development speed: [Analysis]
- Maintenance: [Analysis]  
- Scalability: [Analysis]
- Risk: [Analysis]

I want to acknowledge both Alex and Jordan brought strong technical thinking. 
This wasn't about one being right and one wrong - both approaches had merit. 
We chose based on what best fits our project constraints.

GOING FORWARD:
When we have technical disagreements:
1. Try to resolve between yourselves first
2. If stuck after reasonable effort, bring to team
3. Use structured discussion with criteria
4. Team decides or PM decides with clear rationale

Thanks for working through this constructively.

Sarah
```

**This Approach:**
- ✅ Facilitates, doesn't avoid or force
- ✅ Teaches conflict resolution process
- ✅ Respects both perspectives
- ✅ Uses objective criteria
- ✅ Appropriate Coaching style for Storming
- ✅ Moves team toward Norming

---

**Question 4: What's Likely to Happen Next**

❌ **Based on Sarah's Actual Response:**

**Short-Term Consequences:**
- Alex feels undermined and unsupported
- Jordan "won" but relationship with Alex damaged
- Team sees PM will force decisions under pressure
- Conflict went underground (not resolved)
- Trust in PM's leadership damaged
- Tomorrow's meeting will be awkward

**Medium-Term Consequences:**
- Future conflicts will escalate to Sarah (team doesn't learn to resolve)
- Alex may disengage or start job searching
- Team dynamic strained
- Storming stage prolonged
- Technical decision may be sub-optimal (made without full analysis)

**Long-Term Consequences:**
- Team may never reach Norming/Performing
- Good people may leave
- Project may fail due to team dysfunction
- Sarah's reputation as leader damaged

**Alternative Path (If Done Right):**
- Team learns to resolve conflicts constructively
- Both Alex and Jordan feel heard
- Team moves toward Norming
- Process established for future disagreements
- Trust in leadership increases
- Better technical decision made collaboratively

---

**Key Learning Points:**

**For Storming Stage:**
- ❌ DON'T: Avoid conflict or force decisions
- ✅ DO: Facilitate structured resolution
- Conflict is normal and healthy
- Your job is to guide, not avoid or dominate

**Leadership Styles:**
- **Avoiding** = Not a leadership style, it's abdication
- **Coaching** = Right style for Storming
- **Commanding** = Wrong for this situation (unless true emergency)

**Conflict Resolution:**
- Use objective criteria
- Involve relevant team members
- Facilitate, don't dictate
- Teach process for future

</details>

---

## Artifact 3: Sprint Retrospective Notes

### Document

```
PROJECT: Customer Portal Redesign
MEETING: Sprint 4 Retrospective
DATE: March 8, 2025
FACILITATOR: Sarah (PM)
ATTENDEES: Full team

WHAT WENT WELL:
- "We're finally finding our groove" - Morgan
- "I really appreciate how Jordan helped me debug that API issue" - Casey
- "Team is supporting each other more" - Alex
- "Our standups feel productive now, not just status updates" - Taylor
- "We hit our sprint goal for the first time!" - Jordan
- "I feel like we're actually a team now, not just people working on same project" - Casey

WHAT COULD BE IMPROVED:
- "Still some confusion on who approves UI changes" - Alex
- "Would like earlier heads-up when priorities shift" - Morgan
- "Documentation is falling behind" - Taylor

ACTION ITEMS:
- Sarah to clarify UI approval process
- Team to try documentation pairing next sprint
- Add priority changes to standup agenda

TEAM MOOD:
Generally positive. Lots of friendly joking. Jordan and Alex were laughing 
about something before meeting started. Group went out for coffee after the 
retrospective together (first time they've done that voluntarily).

OBSERVATIONS:
- Team finished each other's sentences a few times
- Used "we" and "our" language throughout
- No one defensive when issues raised
- People volunteered to help with action items without being asked
- Team self-organized to solve blocking issue during sprint without escalating 
  to Sarah
```

### Your Analysis

**Question 1:** What team development stage is this team in?

**Question 2:** What leadership style should Sarah use now?

**Question 3:** What should Sarah do differently going forward?

**Question 4:** What risks should Sarah watch for?

---

### Analysis & Answers

<details>
<summary>Click to see detailed analysis</summary>

**Question 1: Team Development Stage**

✅ **Answer: Norming**

**Clear Evidence:**
- "Finding our groove" = establishing effective patterns
- "Actually a team now" = team identity formed
- Using "we" and "our" language = collective identity
- Supporting each other = cooperation
- Finished each other's sentences = understanding each other well
- Self-organized to solve problems = emerging autonomy
- Went for coffee voluntarily = social bonding beyond work
- No defensiveness = psychological safety
- Friendly joking = comfort and trust

**Key Transition Indicators:**
- "First time they've done that voluntarily" = new behavior emerging
- Self-solved blocking issue = growing autonomy
- Hit sprint goal for first time = processes working

**Comparison to Earlier Stages:**
- Not Forming: No longer uncertain or dependent on PM
- Not Storming: No conflict, power struggles gone
- Not Performing yet: Still some process issues, haven't sustained excellence

**Norming Characteristics Present:**
✓ Cooperation and mutual support
✓ Shared processes working
✓ Team identity ("our team")
✓ Psychological safety
✓ "We" language dominant
✓ Problems raised without defensiveness
✓ Social connections forming

---

**Question 2: Leadership Style Now**

✅ **Answer: Democratic (transitioning toward Delegating)**

**Why Democratic:**

**Team is Ready For:**
- Participation in decisions (showing judgment)
- Input on process improvements
- Collaborative problem-solving
- Shared ownership

**Evidence They Can Handle It:**
- Self-organized problem resolution
- Constructive retrospective feedback
- Volunteering for action items
- Supporting each other
- Good technical decisions

**What Democratic Looks Like Here:**

1. **Decision-Making**
   - "What do you think about [decision]?"
   - Seek team input before deciding
   - Build consensus when possible
   - Explain how input influenced decision

2. **Problem-Solving**
   - Let team propose solutions
   - Facilitate discussions
   - Support their recommendations
   - Trust their expertise

3. **Process Improvements**
   - Team suggests changes
   - Experiment with their ideas
   - Regular retrospectives driving change
   - Team owns their processes

**Transitioning Toward Delegating:**
- Watch for sustained performance
- Gradually increase autonomy
- Let them make more decisions independently
- Focus PM time on obstacles and strategy

**Wrong Styles Now:**
- ❌ **Commanding/Authoritative** - Too directive for this stage
- ❌ **Affiliative** - Not needed (relationships healthy)
- ❌ **Pacesetting** - Would damage current climate
- ⚠️ **Coaching** - Still some use, but less directive

---

**Question 3: What Sarah Should Do Differently**

✅ **Recommended Changes:**

**1. Reduce Directive Leadership**

**Before (Forming/Storming):**
- Made most decisions
- Provided lots of structure
- Intervened frequently
- Closely monitored

**Now (Norming):**
- Seek team input on decisions
- Let team own processes
- Intervene less often
- Monitor outputs, not activities

**Concrete Changes:**

**In Meetings:**
- Ask more, tell less
- "What do you all think?" not "Here's what we'll do"
- Let team run standups (Sarah observes)
- Team members facilitate retrospectives

**Decision-Making:**
- "Team, how should we handle [situation]?"
- Get input before deciding
- Explain when you override (rare)
- Let team make more decisions independently

**Problem-Solving:**
- Stop jumping in to solve
- "How do you want to handle this?"
- Support their solutions
- Let them try and learn

**2. Empower More**

**Examples:**

**UI Approval Process (mentioned in retro):**
- Wrong: "Here's the new approval process I created"
- Right: "Let's discuss what approval process makes sense"

**Documentation (mentioned in retro):**
- Wrong: "Everyone must document like this"
- Right: "What documentation approach would work for you?"

**Priority Changes (mentioned in retro):**
- Wrong: "I'll give earlier notice"
- Right: "How can we communicate priority changes better?"

**3. Focus PM Energy Differently**

**Less Time On:**
- Day-to-day team management
- Telling team what to do
- Monitoring their work closely
- Solving their problems

**More Time On:**
- Stakeholder management
- Removing organizational obstacles
- Strategic planning
- Protecting team from disruption
- Securing resources

**4. Recognize and Reinforce**

**What to Reinforce:**
- Mutual support (Jordan helping Casey)
- Self-organization (solving blocking issue)
- Team bonding (going for coffee)
- Constructive feedback (retro discussion)

**How to Reinforce:**
- Public recognition
- Explicit positive feedback
- Share wins with stakeholders
- Give team credit visibly

**5. Continue Team Development**

**Support Norming:**
- Regular retrospectives
- Celebrate milestones together
- Protect team time and focus
- Support process improvements

**Prepare for Performing:**
- Gradually increase complexity of delegated work
- Reduce PM involvement systematically
- Build team confidence
- Create conditions for excellence

---

**Question 4: Risks to Watch For**

⚠️ **Potential Problems:**

**Risk #1: Complacency**

**What It Looks Like:**
- Team becomes comfortable, stops improving
- "Good enough" becomes standard
- Innovation declines
- Process becomes rigid

**How to Prevent:**
- Continue challenging team with stretch goals
- Encourage experimentation
- Celebrate improvements and innovation
- Ask "How can we do this better?"

**Risk #2: Groupthink**

**What It Looks Like:**
- Desire for harmony suppresses good ideas
- No one challenges assumptions
- Dissent discouraged
- Poor decisions not caught

**How to Prevent:**
- Encourage constructive disagreement
- "What are we missing?"
- Assign "devil's advocate" role
- Welcome diverse perspectives

**Risk #3: Insularity**

**What It Looks Like:**
- Team becomes closed to outside input
- "Not invented here" syndrome
- Defensive about their approach
- Ignore lessons from others

**How to Prevent:**
- Bring in external perspectives occasionally
- Share lessons from other teams
- Encourage learning from outside
- Rotate team members if possible

**Risk #4: Regression**

**What Triggers It:**
- New team members joining
- Major scope or priority changes
- External crises or pressure
- Leadership changes

**How to Recognize:**
- Conflict re-emerges
- Politeness returns (bad sign in Norming)
- Productivity drops
- Team asks for more direction

**How to Respond:**
- Recognize regression early
- Adjust leadership style temporarily
- Re-establish foundation if needed
- Don't panic - can be temporary

**Risk #5: PM Disrupts Working Norms**

**What It Looks Like:**
- Sarah introduces unnecessary changes
- Reverts to directive style under pressure
- Doesn't trust team's judgment
- Micromanages during challenges

**How to Prevent:**
- Think twice before changing what works
- Trust the team you've developed
- Remember they've earned autonomy
- Involve team in any changes

**Risk #6: Avoiding Necessary Conflict**

**What It Looks Like:**
- Team avoids disagreements to maintain harmony
- Problems go unaddressed
- Quality issues not raised
- "Nice" becomes more important than "right"

**How to Prevent:**
- Model constructive disagreement
- Reward people who raise issues
- "What are we not talking about?"
- Distinguish healthy conflict from Storming

---

**Key Actions for Sarah:**

**This Week:**
✅ Clarify UI approval process (but involve team in solution)
✅ Thank team publicly for progress
✅ Share retrospective highlights with sponsor
✅ Start stepping back in next sprint
✅ Let team drive more decisions

**This Month:**
✅ Gradually increase delegation
✅ Focus more on obstacles and stakeholders
✅ Continue building team capability
✅ Prepare for Performing stage
✅ Watch for risks above

**Signs of Success:**
- Team continues progressing
- Autonomy increases
- Quality remains high or improves
- Morale stays positive
- Team takes ownership

---

**Key Learning:**

**Norming Stage Leadership:**
- Step back strategically
- Empower rather than direct
- Democratic style primary
- Protect what's working
- Prepare for Performing
- Watch for risks

**Common Mistake:**
Many PMs don't recognize Norming and either:
1. Continue being too directive (stifles development)
2. Step back too quickly (team not quite ready)

**Right Balance:**
Gradually reduce direction while maintaining support. Team should increasingly drive, PM should increasingly enable.

</details>

---

## Artifact 4: Project Status Email

### Document

```
FROM: Sarah (PM)
TO: Executive Sponsor
DATE: April 15, 2025
SUBJECT: Customer Portal Project - Month 3 Status

Hi Lisa,

I'm pleased to report excellent progress on the Customer Portal project.

PROJECT HEALTH: GREEN

ACCOMPLISHMENTS:
- Delivered 4 consecutive sprints on time
- Quality metrics above target (2.1% defect rate vs. 5% target)
- All major technical decisions made collaboratively
- Team velocity stabilized at 42 points/sprint
- Zero escalations this month

TEAM PERFORMANCE:
The team has really come together. They're self-organizing effectively and 
I'm seeing high autonomy in day-to-day work. This morning I arrived to find 
they'd already:
- Resolved a blocking API issue
- Reprioritized work based on customer feedback
- Made architectural decision on caching approach
- Onboarded the new developer (Robin) who started yesterday

I barely had to intervene - just removed an organizational obstacle (got 
approval for additional test environment).

Yesterday's demo with stakeholders went perfectly. The team presented 
confidently, handled tough questions well, and even suggested improvements 
based on stakeholder feedback during the session.

CONCERNS:
None at this time. The team is firing on all cylinders.

NEXT MONTH:
- Complete authentication module
- Begin payment integration
- Performance testing
- User acceptance testing prep

This team has exceeded my expectations. They've grown from a group of 
individuals into a truly high-performing team. I'm confident in our ability 
to deliver this project successfully.

Please let me know if you need any additional information.

Sarah
```

### Your Analysis

**Question 1:** What team development stage is this team in?

**Question 2:** What leadership style should Sarah be using?

**Question 3:** What should Sarah focus on now?

**Question 4:** What's one thing Sarah should be careful about?

---

### Analysis & Answers

<details>
<summary>Click to see detailed analysis</summary>

**Question 1: Team Development Stage**

✅ **Answer: Performing**

**Strong Evidence:**

**Autonomy:**
- "Self-organizing effectively"
- Resolved blocking issue without PM
- Made architectural decisions independently
- Reprioritized work themselves
- "I barely had to intervene"

**Sustained Excellence:**
- "4 consecutive sprints on time"
- Quality above target (2.1% vs 5%)
- Velocity stabilized
- "Firing on all cylinders"

**High Capability:**
- Handled tough stakeholder questions
- Suggested improvements in real-time
- Onboarded new team member themselves
- Made good decisions without PM

**Proactivity:**
- Resolved issues before Sarah arrived
- Anticipated customer feedback
- Took initiative constantly

**Confidence:**
- "Presented confidently"
- Handled pressure well
- Self-assured in decisions

**Comparison to Earlier Stages:**
- Not Forming: Highly autonomous, not dependent
- Not Storming: No conflict, collaborative
- Not Norming: Beyond cooperation, achieving excellence consistently
- Performing: All indicators present

**Key Distinction from Norming:**
- Norming = cooperation and working well together
- Performing = sustained excellence with high autonomy
- This team has crossed that threshold

---

**Question 2: Leadership Style**

✅ **Answer: Delegating**

**What Delegating Looks Like:**

**PM Role Shifts to:**
- Remove strategic obstacles (Sarah got test environment approval)
- Focus on stakeholder management
- Provide resources and support
- Get out of team's way
- Celebrate and recognize excellence

**What PM Does NOT Do:**
- Make day-to-day decisions for team
- Solve team's problems
- Monitor their work closely
- Direct their activities
- Intervene in their processes

**Evidence Sarah is Doing This Right:**
- "I barely had to intervene"
- Team made decisions before she arrived
- She focused on organizational obstacle (test environment)
- She gave them space to perform

**Wrong Styles Now:**
- ❌ **Commanding/Authoritative** - Would micromanage high performers
- ❌ **Democratic** - Team beyond needing to discuss every decision
- ❌ **Affiliative** - Relationships already strong
- ❌ **Pacesetting** - Would demotivate
- ❌ **Coaching** - Don't need constant feedback anymore

**Delegating Characteristics:**
✓ High trust
✓ High autonomy
✓ PM as enabler, not director
✓ Focus on removing obstacles
✓ Team makes most decisions
✓ PM focuses on strategy and external

---

**Question 3: What Sarah Should Focus On**

✅ **Right Priorities for Performing Team:**

**1. Strategic Obstacle Removal**

**What This Means:**
- Organizational barriers
- Resource constraints
- Political obstacles
- Process roadblocks

**Examples:**
- Getting test environment approval (she did this)
- Securing budget for tools
- Managing difficult stakeholders
- Navigating organizational politics

**Not:**
- Team's day-to-day problems (they handle these)
- Technical decisions (team decides)
- Process improvements (team owns)

**2. Stakeholder Management**

**What This Includes:**
- Managing expectations
- Communicating progress
- Building stakeholder relationships
- Securing continued support
- Shielding team from disruption

**Example:**
Sarah's email to sponsor is part of this - keeping sponsor informed and confident.

**3. Team Recognition and Support**

**What This Means:**
- Publicly acknowledge excellence
- Give team credit (not take it)
- Ensure organizational recognition
- Protect team's reputation
- Celebrate wins

**From Email:**
"This team has exceeded my expectations" - good
But make sure TEAM gets this recognition, not just Sarah

**4. Continuous Capability Building**

**Even Performing Teams Need:**
- Challenging work
- Growth opportunities
- Learning and development
- New challenges
- Career development support

**For This Team:**
- Next-level technical challenges
- Leadership opportunities
- Mentoring newer members
- Innovation projects

**5. Onboarding Support**

**Note:** Robin (new developer) started yesterday

**Critical Action:**
- Team onboarded Robin (excellent)
- Sarah should ensure Robin gets proper ramp-up
- Watch for team regression with new member
- May temporarily need more structure again

**6. Project Continuity Planning**

**Questions to Address:**
- Knowledge transfer
- Documentation
- Operational handoff
- Team transition after project
- Lessons learned capture

---

**Question 4: What to Be Careful About**

⚠️ **Critical Warnings:**

**Warning #1: Don't Take Success for Granted**

**Risk:**
- Assuming performance will continue without support
- Neglecting team maintenance
- Reducing recognition and appreciation

**Why It's Dangerous:**
- Even high performers need acknowledgment
- Burnout can happen at any level
- Good people leave when undervalued

**What to Do:**
- Continue recognition
- Monitor for burnout signs
- Check in regularly
- Don't become invisible

**Warning #2: Don't Micromanage During Challenges**

**Risk:**
- When problem arises, reverting to directive style
- Taking over when team faces difficulty
- Undermining the trust you've built

**Why It's Dangerous:**
- Destroys trust instantly
- Demotivates team
- They become dependent again
- Performance drops

**What to Do:**
- Trust them through challenges
- Offer support, don't take over
- "What do you need from me?"
- Let them own the solution

**Warning #3: Watch for New Member Impact**

**Risk:**
- Robin's addition could cause temporary regression
- Team dynamics may shift
- Performing status could be disrupted

**Why It's Dangerous:**
- Team composition change is biggest regression trigger
- May temporarily need more structure
- Could slow velocity

**What to Watch:**
- Team interactions
- Conflict emerging?
- Confusion about processes?
- Robin's integration

**What to Do:**
- Be more present temporarily
- Support Robin's onboarding
- Watch for regression signs
- Adjust style if needed (temporarily)

**Warning #4: Don't Introduce Unnecessary Change**

**Risk:**
- "Improving" processes that are working
- New tools or methodologies
- Organizational mandates

**Why It's Dangerous:**
- Disrupts successful patterns
- Team resents unnecessary change
- "Fix what ain't broke"

**What to Do:**
- Think twice before changing anything
- Involve team in any changes
- Don't mess with success
- Protect team from organizational churn

**Warning #5: Don't Take Personal Credit**

**Risk (from email):**
- "This team has exceeded MY expectations"
- PM appears to take credit
- Team's accomplishments attributed to PM

**Why It's Dangerous:**
- Team resents credit-stealing
- Reduces motivation
- Damages trust
- People leave

**What to Do:**
- Give credit to team explicitly
- "They did this, not me"
- Public recognition of individuals
- Share their success stories

**Better Email Phrasing:**
```
"The team has demonstrated exceptional capability. Their self-organization, 
technical excellence, and collaborative approach have exceeded all targets. 
Alex, Jordan, Casey, Morgan, Taylor, and Robin deserve significant 
recognition for this performance."
```

**Warning #6: Prepare for Transition**

**Risk:**
- No planning for project end
- Knowledge loss
- Team dissolution not managed
- Abrupt ending

**Why It's Important:**
- Performing teams ending need care
- Lessons learned valuable
- People need next opportunities
- Knowledge must transfer

**What to Do:**
- Begin closure planning (not too early)
- Document continuously
- Plan transitions
- Think about Adjourning stage

---

**Recommended Actions for Sarah:**

**Immediately:**
✅ Ensure team (not just Sarah) gets credit
✅ Monitor Robin's integration closely
✅ Continue current Delegating approach
✅ Remove any obstacles team mentions

**This Month:**
✅ Watch for any regression signs
✅ Protect team from organizational disruption
✅ Continue stakeholder management
✅ Individual recognition for team members

**Long-Term:**
✅ Maintain their autonomy
✅ Challenge them appropriately
✅ Plan for eventual transition
✅ Document their success for org learning

---

**Key Learning:**

**Performing Stage Leadership:**
- Delegating is appropriate style
- PM focuses on strategy and obstacles
- Don't take success for granted
- Watch for regression triggers
- Give credit generously
- Trust through challenges

**Common Mistakes with Performing Teams:**
1. Reverting to directive style during challenges
2. Taking credit for team's success
3. Introducing unnecessary change
4. Neglecting recognition and development
5. Micromanaging high performers

**Sarah's Doing Well:**
- Recognized stage correctly
- Using appropriate style
- Focusing on right things
- Communicating status effectively

**Sarah Should Improve:**
- Give more explicit credit to team
- Be mindful of Robin's impact
- Stay alert for complacency or burnout

</details>

---

## Artifact 5: Slack Conversation

### Document

```
CHANNEL: #customer-portal-team
DATE: May 3, 2025

[9:47 AM] Sarah: Morning team! Don't forget our 10am standup
[9:48 AM] Jordan: 👍
[9:49 AM] Taylor: Will be 5 min late - finishing something
[9:50 AM] Alex: No worries

[10:15 AM] Casey: @team FYI I'm blocked on testing until the dev environment 
is back up. IT says it'll be down until this afternoon.
[10:16 AM] Morgan: Oh that impacts me too - I was going to test the new reports
[10:17 AM] Jordan: We can work on that documentation we've been putting off?
[10:17 AM] Alex: Good idea. I'll start the API docs
[10:18 AM] Taylor: I'll do the user guide
[10:18 AM] Casey: I'll document the test scenarios
[10:19 AM] Morgan: And I'll update the business requirements doc

[2:34 PM] Jordan: @Sarah Quick question - AWS is offering a discount on that 
caching service we talked about. 30% off if we commit this month. Should we 
take it?
[2:45 PM] Sarah: What do you all think? Does the discount justify committing now?
[2:46 PM] Alex: We were going to need it anyway
[2:46 PM] Jordan: Yeah, and 30% is significant over a year
[2:47 PM] Morgan: What's the commitment period?
[2:47 PM] Jordan: 12 months
[2:48 PM] Morgan: Project is only 6 more months. What happens after?
[2:49 PM] Jordan: Good point. Let me check if operations team wants it after 
we hand off
[2:50 PM] Sarah: Smart thinking. Check with ops and let me know. If they want 
it long-term, we should take the discount.
[2:51 PM] Jordan: On it 👍

[4:22 PM] Taylor: @team Just finished the user acceptance test with the 
customer focus group. They LOVED the new interface! Especially the dashboard 
redesign.
[4:23 PM] Alex: 🎉
[4:23 PM] Casey: That's awesome!
[4:24 PM] Morgan: What feedback did they give?
[4:24 PM] Taylor: Want to show the export feature more prominently, and they 
want to save custom filters. I told them we'd discuss as a team.
[4:25 PM] Jordan: We could do the custom filters pretty easily
[4:25 PM] Alex: Yeah, that's maybe 2-3 days of work
[4:26 PM] Morgan: Should we add to backlog for discussion in planning tomorrow?
[4:26 PM] Taylor: Done ✅
[4:27 PM] Sarah: Nice work Taylor! And great customer focus. Thanks for 
bringing it back to team instead of committing.

[4:45 PM] Robin: @team Quick update - I deployed the payment module to staging. 
Ready for testing whenever Casey has time.
[4:46 PM] Casey: I can test it now actually
[4:46 PM] Robin: Thanks! Ping me if you find any issues
[4:47 PM] Jordan: Robin's getting the hang of our deployment process 🎉
[4:48 PM] Robin: Thanks for all the help everyone. This team is great.
[4:48 PM] Alex: Welcome to the team! 😊
```

### Your Analysis

**Question 1:** What team development stage is evident in this conversation?

**Question 2:** What leadership style is Sarah using?

**Question 3:** What positive team behaviors do you see?

**Question 4:** How has Robin's integration gone?

**Question 5:** What might Sarah be concerned about (if anything)?

---

### Analysis & Answers

<details>
<summary>Click for Answer</summary>

**Question 1: Team Development Stage**

✅ **Answer: Performing (sustained)**

**Evidence Throughout Conversation:**

**Self-Organization:**
- Team handled environment outage without PM
- Independently pivoted to documentation work
- No panic or escalation needed

**Proactive Problem-Solving:**
- Jordan raised AWS discount opportunity
- Team discussed trade-offs
- Thought about long-term implications (operations handoff)

**Autonomous Decision-Making:**
- Technical decisions made by team
- Morgan raised good question about commitment period
- Team evaluated without PM directing

**Mutual Support:**
- Welcoming Robin
- Jordan recognizing Robin's progress
- Team helping each other naturally

**Quality Focus:**
- Taylor conducted UAT proactively
- Brought feedback to team (didn't commit unilaterally)
- Customer-focused approach

**Positive Climate:**
- Emojis and celebration (🎉, 😊, 👍)
- Appreciation for each other
- "This team is great" - Robin's observation

---

**Question 2: Sarah's Leadership Style**

✅ **Answer: Delegating (perfectly executed)**

**How Sarah Demonstrates Delegating:**

**1. Minimal Intervention**
- Only 4 messages all day from PM
- Team handled most things without her
- She observed more than directed

**2. Asked Rather Than Told**
- "What do you all think?" (not "Here's what we'll do")
- Sought team input on AWS decision
- Democratic question but with delegation approach

**3. Supported Team Decisions**
- "Smart thinking" - reinforced good analysis
- "If they want it long-term, we should take discount" - guidance, not command
- Trusted Jordan to follow through

**4. Recognized Good Work**
- "Nice work Taylor!"
- "Great customer focus"
- "Thanks for bringing it back to team"
- Specific, genuine recognition

**5. Reinforced Good Behaviors**
- Praised Taylor for not committing without team
- Recognized Robin's progress (through Jordan)
- Encouraged collaborative approach

**What Sarah Didn't Do:**
- ❌ Didn't solve environment outage for them
- ❌ Didn't make AWS decision herself
- ❌ Didn't tell Taylor what to commit to customer
- ❌ Didn't manage every interaction
- ❌ Didn't micromanage Robin's deployment

**This is Textbook Delegating:**
- Trust evident
- Team has authority
- PM provides guidance when asked
- PM recognizes and supports
- PM focuses on enabling, not directing

---

**Question 3: Positive Team Behaviors**

✅ **Excellent Performing Team Indicators:**

**1. Autonomous Problem-Solving**
- Environment down? → Pivot to documentation
- No escalation, no waiting, no panic
- Team figured it out themselves instantly

**2. Collaborative Decision-Making**
- AWS discount discussed by team
- Multiple perspectives considered
- Good questions raised (Morgan on commitment period)
- Thought about stakeholders (operations team)

**3. Proactive Communication**
- Casey alerted team to blocking issue
- Taylor shared UAT results immediately
- Robin announced deployment proactively
- No one hoarding information

**4. Mutual Support**
- "Thanks for all the help everyone" - Robin
- Jordan recognizing Robin's progress
- Team welcoming Robin warmly
- Offering help naturally

**5. Customer Focus**
- Taylor conducted UAT proactively
- Brought feedback to team properly
- Didn't commit without team input
- Team receptive to customer feedback

**6. Quality Mindset**
- Documentation prioritized when blocked
- Thoughtful analysis of AWS commitment
- Proper testing process (Robin → Casey)
- Long-term thinking

**7. Efficient Communication**
- Quick responses
- Clear updates
- Emojis for quick acknowledgment
- Minimal noise

**8. Psychological Safety**
- People ask questions freely
- Robin comfortable as new member
- No defensiveness
- Help offered without being asked

**9. Initiative**
- Multiple people taking ownership
- Don't wait for PM to direct
- See what needs doing and do it
- Proactive rather than reactive

**10. Team Identity**
- "This team is great" - Robin
- Celebrating together (🎉)
- "We" language throughout
- Pride in team membership

---

**Question 4: Robin's Integration**

✅ **Integration Going Very Well**

**Positive Signs:**

**Week 1 Progress:**
- Robin deployed to staging independently
- Following deployment process correctly
- Proactive communication about readiness
- Contributing productively

**Team Support:**
- Jordan publicly recognizing Robin's progress
- Alex welcoming warmly
- Team helped Robin get up to speed
- No signs of friction

**Robin's Perspective:**
- "Thanks for all the help everyone"
- "This team is great"
- Feeling welcomed and supported
- Comfortable participating

**Why Integration Succeeded:**

**1. Team Onboarded Actively**
- Didn't leave Robin to figure it out alone
- Provided help willingly
- Set Robin up for success

**2. Robin Contributing Quickly**
- Deployment within 2 weeks
- Following processes
- Taking initiative

**3. No Apparent Regression**
- Team still functioning at Performing level
- No conflict or storming behaviors
- Processes still working smoothly
- Robin integrated into existing patterns

**4. Psychological Safety**
- Robin comfortable asking for help
- Team receptive and supportive
- No judgment or impatience

**5. Clear Processes**
- Robin knew deployment process
- Testing handoff to Casey understood
- Communication patterns clear

**Sarah's Role:**
- Stayed present but not intrusive
- Let team handle onboarding
- Recognized Robin's progress
- Monitored without micromanaging

**Conclusion:**
Robin's integration is model example of how Performing teams can onboard new members without regressing. Key was:
- Team owned the onboarding
- Clear processes existed
- Welcoming culture
- Sarah stayed supportive but not directive

---

**Question 5: Concerns for Sarah**

⚠️ **Potential Issues to Monitor:**

**Concern #1: Complacency Risk**

**What to Watch:**
- Team might become too comfortable
- Innovation could slow
- "Good enough" becomes standard
- Continuous improvement stalls

**Current Status:**
- No evidence yet
- Team still improving (documentation, customer feedback)
- But worth monitoring

**What Sarah Should Do:**
- Continue challenging appropriately
- Encourage experimentation
- Celebrate innovation
- Ask "How can we do this better?"

**Concern #2: Burnout Prevention**

**Risk Factors:**
- High performance is demanding
- Been at it for months
- May be working long hours
- Pressure to maintain excellence

**What to Watch:**
- Working hours
- Stress indicators
- Quality of work-life balance
- Irritability or exhaustion

**What Sarah Should Do:**
- Monitor workload
- Encourage breaks and time off
- Check in individually
- Watch for unsustainable pace

**Concern #3: Documentation Debt**

**Evidence:**
- "Documentation we've been putting off" - Jordan
- Only doing it because blocked
- Suggests it's been neglected

**Risk:**
- Knowledge loss
- Operational handoff problems
- Onboarding future members harder
- Technical debt

**What Sarah Should Do:**
- Check documentation status
- Make it priority, not afterthought
- Build into regular workflow
- Essential for project closure

**Concern #4: Over-Reliance on Key People**

**Question:**
- What if Jordan leaves?
- What if Alex is out?
- Is knowledge distributed?
- Are there single points of failure?

**What Sarah Should Do:**
- Assess knowledge distribution
- Encourage knowledge sharing
- Cross-training where needed
- Succession planning

**Concern #5: Scope Creep from Customer Feedback**

**Observation:**
- Customer wants custom filters and export prominence
- Team "could do it pretty easily"
- Risk of "while we're at it" scope growth

**What Sarah Should Do:**
- Ensure proper backlog management
- Don't commit to every request
- Maintain timeline focus
- Balance customer requests with project goals

**Concern #6: AWS Commitment Decision**

**Good:**
- Team evaluating thoughtfully
- Considering long-term

**Watch:**
- Ensure operations team consulted
- Don't commit if uncertain
- Discount shouldn't drive decision
- Financial decision needs proper approval

**What Sarah Should Do:**
- Confirm Jordan follows through with ops
- Review decision before finalizing
- Ensure proper stakeholder approval
- Don't let discount pressure poor decision

**Overall Assessment:**

**No Immediate Concerns:**
- Team functioning excellently
- Robin integration successful
- Communication strong
- Performance sustained

**Monitoring Needed:**
- Documentation completion
- Workload sustainability
- Scope management
- Knowledge distribution

**Sarah's Approach is Good:**
- Right style for stage
- Appropriate level of involvement
- Good recognition and support
- Letting team own their work

---

**Key Learning:**

**Performing Stage Communication:**
- Efficient and effective
- High trust evident
- Autonomous operation
- PM involved appropriately

**Leadership Indicators:**
- Sarah uses Delegating correctly
- Team demonstrates capability
- Integration successful
- Sustained performance

**What Makes This Work:**
- Clear processes
- Psychological safety
- Mutual support
- PM trusts team
- Team owns work

**For Your Teams:**
This Slack conversation shows what Performing looks like in daily communication. Notice:
- Efficiency
- Autonomy
- Support
- Initiative
- Quality focus

</details>

---

## Artifact 6: Project Closure Meeting Agenda

### Document

```
PROJECT: Customer Portal Redesign
MEETING: Project Closure & Celebration
DATE: June 30, 2025
TIME: 2:00 PM - 4:00 PM
LOCATION: Conference Room A (plus virtual link)
ATTENDEES: Full team + Sponsor (Lisa)

AGENDA:

2:00 - 2:10 PM: Welcome & Project Overview
- Sarah: Quick overview of what we accomplished
- Sponsor remarks

2:10 - 2:40 PM: Team Retrospective
- What went well
- What we learned
- What we'd do differently
- Key lessons for organization

2:40 - 3:00 PM: Individual Recognition
- Sarah: Recognition of each team member's contributions
- Sponsor: Thank you to team

3:00 - 3:20 PM: Knowledge Transfer Status
- Documentation review
- Operational handoff status
- Training completion
- Open items

3:20 - 3:40 PM: Next Steps
- Team member transitions
- Where everyone is going next
- How to stay connected

3:40 - 4:00 PM: Celebration
- Cake and refreshments
- Team photos
- Thank yous

---

EMAIL FROM SARAH TO TEAM (sent June 28):

Subject: Our Last Week Together

Team,

I can't believe we're here already - our last week working together on the 
Customer Portal project. 

We started as strangers in January, worked through some rocky periods, found 
our groove, and became something pretty special. You delivered an exceptional 
product, but more importantly, you showed what great teamwork looks like.

I want to acknowledge that endings are hard. Some of you have told me you're 
sad the project is ending. That's completely normal and actually a sign of 
what we built together.

HOUSEKEEPING:
- Please complete your final documentation by Thursday
- Operations team shadowing continues through Friday
- Friday's closure meeting agenda attached
- Monday most of you start new assignments

I've scheduled 30-minute 1-on-1s with each of you this week to:
- Thank you personally
- Discuss your next steps
- Offer support for transitions
- Get your feedback on my leadership

CLOSURE MEETING:
Please come prepared to share:
- One thing you're proud of from this project
- One lesson you'll take forward
- One piece of advice for future teams

Looking forward to celebrating together on Friday. You've earned it.

With gratitude,
Sarah

---

SLACK MESSAGE from Jordan (June 28, 10:23 PM):

@Sarah Just wanted to say thanks before the week gets crazy. This was the 
best team I've ever worked on. You gave us space to figure things out, had 
our backs when we needed it, and made us better than we thought we could be.

I know I was difficult in February (that architecture argument with Alex). 
Thanks for not forcing it and helping us work through it. We're actually 
good friends now because of how you handled that.

Good luck with whatever you're doing next. Hope we work together again.

- J
```

### Your Analysis

**Question 1:** What team development stage is this?

**Question 2:** What leadership style is Sarah using?

**Question 3:** What is Sarah doing well in the closure process?

**Question 4:** What emotions might team members be experiencing?

**Question 5:** What advice would you give Sarah for the closure meeting?

---

### Analysis & Answers

<details>
<summary>Click for Answer</summary>

**Question 1: Team Development Stage**

✅ **Answer: Adjourning**

**Clear Indicators:**

**Closure Phase:**
- "Our last week together"
- Project completed successfully
- Team disbanding
- Transitions to new assignments

**Reflection and Looking Back:**
- Retrospective planned
- "What we learned" focus
- Lessons for organization
- Individual recognition

**Emotional Processing:**
- "Endings are hard"
- "Some of you are sad"
- Jordan's grateful message
- Nostalgia evident

**Transition Planning:**
- Next steps on agenda
- Individual transitions discussed
- "How to stay connected"
- Monday new assignments start

**Knowledge Transfer:**
- Documentation completion
- Operational handoff
- Training completion
- Open items review

**Celebration and Recognition:**
- Closure meeting with cake
- Individual recognition planned
- Team photos
- Thank yous

**Classic Adjourning Characteristics:**
✓ Project ending
✓ Team reflecting
✓ Emotions about ending
✓ Transition planning
✓ Celebration
✓ Knowledge transfer
✓ Closure activities

---

**Question 2: Sarah's Leadership Style**

✅ **Answer: Coaching/Affiliative (appropriate for Adjourning)**

**Coaching Elements:**

**1. Reflection Focus**
- Retrospective to capture lessons
- "What we learned"
- Individual feedback sessions
- Learning orientation

**2. Development Oriented**
- "One lesson you'll take forward"
- Supporting transitions
- Individual 1-on-1s about next steps
- Preparing them for future

**3. Feedback Seeking**
- "Get your feedback on my leadership"
- Open to learning herself
- Modeling growth mindset

**Affiliative Elements:**

**1. Emotional Acknowledgment**
- "Endings are hard"
- "That's completely normal"
- Validates feelings openly
- Creates space for emotions

**2. Relationship Focus**
- "How to stay connected"
- Personal thank yous planned
- Gratitude expressed
- Relationship preservation

**3. Celebration**
- Closure meeting with celebration
- Team photos
- Recognition of individuals
- Honoring what they built

**4. Personal Touch**
- Individual 1-on-1s
- Personal thank yous
- Acknowledging journey
- "With gratitude"

**Why This Style is Right:**

**Adjourning Needs:**
- Emotional support (Affiliative)
- Reflection and learning (Coaching)
- Closure and celebration (Both)
- Transition support (Coaching)

**What Would Be Wrong:**
- ❌ Commanding - Too directive for closure
- ❌ Pacesetting - Inappropriate urgency
- ❌ Authoritative - Don't need new vision
- ❌ Democratic - Not time for group decisions
- ⚠️ Delegating - Need more PM involvement now

---

**Question 3: What Sarah is Doing Well**

✅ **Excellent Closure Process:**

**1. Acknowledging Emotions**

**What She's Doing:**
- "Endings are hard"
- "That's completely normal"
- "Some of you are sad"
- Validates feelings

**Why It's Good:**
- Creates psychological safety
- Normalizes sadness
- Lets people process
- Shows emotional intelligence

**Common Mistake:**
Many PMs ignore emotions and treat closure as purely transactional. Sarah recognizes the human element.

**2. Structured Closure Process**

**Components:**
- Retrospective for lessons
- Individual recognition
- Knowledge transfer review
- Transition planning
- Celebration

**Why It's Good:**
- Comprehensive approach
- Nothing forgotten
- Both task and relationship focus
- Proper ceremony

**3. Individual Attention**

**What She's Doing:**
- 30-minute 1-on-1s with each person
- Personal thank yous planned
- Individual recognition in meeting
- Transition support

**Why It's Good:**
- Personalized closure
- Each person feels valued
- Individual relationships honored
- Career support provided

**4. Knowledge Capture**

**What She's Doing:**
- Documentation completion
- Lessons learned
- Operational handoff
- Training completion

**Why It's Good:**
- Organizational learning
- Prevents knowledge loss
- Proper handoff
- Professional closure

**5. Reflection and Learning**

**What She's Asking:**
- "What we learned"
- "What we'd do differently"
- "Lessons for organization"
- Team member feedback

**Why It's Good:**
- Continuous improvement
- Organizational capability building
- Self-improvement (asking for feedback)
- Models growth mindset

**6. Future Connection**

**What She's Including:**
- "How to stay connected"
- Relationship preservation
- Professional network building

**Why It's Good:**
- Relationships continue
- Professional network maintained
- Reduces sense of loss
- Career support ongoing

**7. Celebration**

**What She Planned:**
- Team celebration
- Cake and refreshments
- Team photos
- Recognition

**Why It's Good:**
- Honors accomplishment
- Creates positive closure
- Memorable ending
- Shows appreciation

**8. Honoring the Journey**

**From Email:**
- "Started as strangers"
- "Worked through rocky periods"
- "Found our groove"
- "Became something special"

**Why It's Good:**
- Acknowledges full journey
- Recognizes growth
- Validates challenges
- Celebrates transformation

**9. Timely Communication**

**What She Did:**
- Email sent 2 days before last week
- Meeting scheduled with notice
- 1-on-1s scheduled in advance
- Clear timeline

**Why It's Good:**
- No surprises
- Time to prepare emotionally
- Professional approach
- Respectful of people's time

**10. Sponsor Involvement**

**What She Did:**
- Invited sponsor to closure meeting
- Sponsor giving remarks
- Team gets executive recognition

**Why It's Good:**
- Team recognized at high level
- Career visibility
- Proper organizational closure
- Credit given appropriately

---

**Question 4: Team Member Emotions**

😊😢 **Mixed Emotions Expected:**

**Likely Feeling:**

**1. Pride**
- Accomplished something significant
- Delivered excellent product
- Grew as professionals
- Part of special team

**2. Sadness**
- Losing daily connection
- Won't work together anymore
- End of special experience
- Uncertainty about future

**3. Gratitude**
- For experience
- For each other
- For Sarah's leadership
- For growth opportunities

**4. Anxiety**
- About next assignments
- New teams to join
- Will next team be as good?
- Career uncertainty

**5. Nostalgia**
- Looking back fondly
- Remembering journey
- Appreciating relationships
- Wishing it could continue

**6. Relief**
- Project pressure is over
- Can rest
- Accomplished the goal
- Stress reduced

**7. Loss**
- "This team is great" reality ending
- Daily interactions gone
- Special bond breaking
- Routine disrupted

**Evidence from Documents:**

**Jordan's Message:**
- "Best team I've ever worked on" = pride
- "Thanks" = gratitude
- "Hope we work together again" = not wanting it to end

**Sarah's Email:**
- "Some of you have told me you're sad" = direct evidence
- She acknowledges "endings are hard" = validates emotions

**Why These Emotions Matter:**

**For Sarah:**
- Must acknowledge and validate
- Create space for processing
- Don't rush through closure
- Support emotional needs

**For Team:**
- Normal and healthy
- Sign of good experience
- Not something to suppress
- Part of healthy closure

**Common Patterns:**

**High-Performing Teams:**
- Feel MORE loss (had great experience)
- Stronger emotional bonds
- Harder to say goodbye
- Need MORE closure support

**Poorly-Performing Teams:**
- May feel relief, less loss
- Weaker emotional bonds
- Easier goodbyes
- Need LESS closure support

**This Team:**
Jordan's message and team reactions suggest strong bonds and significant sense of loss - natural for Performing team that became close.

---

**Question 5: Advice for Closure Meeting**

✅ **Recommendations for Sarah:**

**Before the Meeting:**

**1. Prepare Individual Recognition**
- Specific accomplishments for each person
- Not generic praise
- Meaningful and personal
- Career-relevant

**Example:**
"Jordan, your technical leadership on the architecture decisions and your growth in mentoring Robin showed real maturity. Any team would be lucky to have you as their tech lead."

Not: "Jordan, good job on the project."

**2. Prepare Your Own Emotions**
- This will be emotional for you too
- It's okay to show emotion
- But maintain composure to support team
- Have tissues available

**3. Coordinate with Sponsor**
- Brief Lisa on individual contributions
- Ensure her remarks are meaningful
- Ask her to be specific, not generic
- Get her to stay for full celebration

**During the Meeting:**

**1. Opening (2:00-2:10)**

**Do:**
- Acknowledge the journey honestly
- "We started with uncertainty, worked through conflict, and achieved excellence"
- Express genuine gratitude
- Set tone: reflection, celebration, closure

**Don't:**
- Rush through this
- Be overly formal
- Ignore emotions
- Make it all about you

**2. Retrospective (2:10-2:40)**

**Do:**
- Give everyone voice
- Draw out quieter members
- Capture lessons formally
- Acknowledge challenges honestly (February architecture debate)

**Don't:**
- Skip over rough periods
- Sugarcoat everything
- Let one person dominate
- Rush the discussion

**Questions to Ask:**
- "What was our finest moment as a team?"
- "When did you know we'd become something special?"
- "What will you remember most?"
- "What surprised you about our journey?"

**3. Individual Recognition (2:40-3:00)**

**Do:**
- Speak to each person
- Be specific and personal
- Highlight growth and contribution
- Make eye contact
- Take your time

**Don't:**
- Be generic
- Compare people
- Make it quick
- Read from notes only

**Structure:**
For each person:
1. What they contributed
2. How they grew
3. Impact on team
4. What you'll remember
5. Wish for future

**4. Knowledge Transfer (3:00-3:20)**

**Do:**
- Confirm completion
- Thank them for thoroughness
- Frame as gift to organization
- Acknowledge this work matters

**Don't:**
- Make it dry and transactional
- Assign last-minute tasks
- Stress about gaps
- End on work focus

**Keep it Brief:**
- Quick status review
- Celebrate completion
- Thank operations team if present
- Move to celebration

**5. Next Steps (3:20-3:40)**

**Do:**
- Let each person share where they're going
- Express confidence in them
- Offer ongoing support
- Exchange contact information

**Don't:**
- Skip this (tempting when emotional)
- Let it be awkward
- Ignore future
- End without closure

**Questions:**
- "What's next for you?"
- "What are you excited about?"
- "How can we stay connected?"
- "What will you take with you?"

**6. Celebration (3:40-4:00)**

**Do:**
- Lighten the mood
- Tell favorite stories
- Take lots of photos
- Laugh together
- Give small gifts if appropriate (team photo book?)

**Don't:**
- Let it be stiff
- Forget to take photos
- Rush out
- End abruptly

**Closing Words:**
- Final thank you
- Express what they meant to you
- Wish them well
- Leave door open

**After the Meeting:**

**1. Follow Through**
- Send team photo
- Share lessons learned document
- Connect on LinkedIn
- Follow up on any commitments

**2. Personal Reflection**
- What did you learn as leader?
- How did you grow?
- What would you do differently?
- Document for yourself

**3. Organizational Sharing**
- Share lessons learned with organization
- Document what made team successful
- Recognize team to broader organization
- Build organizational capability

**4. Stay Connected**
- Actually follow through
- Periodic check-ins
- Celebrate their future successes
- Maintain relationships

---

**Specific Things to Say:**

**Opening:**
"Six months ago, we started as strangers with a big challenge ahead. Today, we're ending as a team that delivered something exceptional. More importantly, we showed what great collaboration looks like. Thank you for this experience."

**About Challenges:**
"We didn't avoid conflict - we worked through it. Remember February when Alex and Jordan couldn't agree on architecture? That moment taught us how to disagree constructively. That's one reason we became excellent."

**About Growth:**
"Each of you grew. You started polite and uncertain. You became confident, autonomous, and excellent. That transformation is what I'm most proud of."

**About Future:**
"This team is ending, but what you learned here continues. Take this experience forward. Build teams like this wherever you go. And stay in touch - I want to know what amazing things you do next."

**Closing:**
"Thank you for making me a better leader. Thank you for your excellence. Thank you for what we built together. I'm proud of this team and proud to have led you."

---

**What NOT to Say:**

❌ "Well, all good things must end"
(Too dismissive of emotions)

❌ "You're all easily replaceable"
(Never say this!)

❌ "I hope your next team is this good"
(Implies they might not be)

❌ "Stop being sad, you'll see each other around"
(Invalidates emotions)

❌ "This was just another project"
(Diminishes what they experienced)

---

**Physical Considerations:**

**Room Setup:**
- Circle or U-shape (not classroom style)
- Tissues available
- Flipchart for capturing lessons
- Camera ready for photos
- Cake/refreshments ready

**Timing:**
- Don't rush any segment
- Better to run over than rush
- Let emotions happen
- Pause when needed

**Your Presence:**
- Be fully present
- Put phone away
- Make eye contact
- Show emotion authentically
- Be the leader they need

---

**Key Learning:**

**Adjourning Stage Leadership:**
- Make it meaningful, not transactional
- Honor the journey
- Acknowledge emotions
- Capture lessons
- Celebrate appropriately
- Support transitions
- Maintain relationships

**Common Mistakes:**
Many PMs rush closure because it's uncomfortable. Sarah is doing it right - taking time, being thorough, honoring what was built.

**Jordan's Message Shows:**
Sarah's leadership throughout the project created the conditions for this excellent closure. His gratitude and reflection indicate she led well at every stage.

</details>

---

## Summary and Key Takeaways

### What Document Detective Teaches

**1. Reading Between the Lines**
- Team stage isn't always explicit
- Look for behavior patterns
- Communication style reveals dynamics
- Emotions tell stories

**2. Leadership in Action**
- See how styles play out in real documents
- Understand impact of approaches
- Learn from both good and poor examples
- Apply to your own situations

**3. Stage Recognition**
- Practice identifying stages from artifacts
- Notice transition indicators
- Recognize regression triggers
- Understand stage characteristics

**4. Style Application**
- See when styles work and don't work
- Understand consequences of choices
- Learn appropriate interventions
- Build judgment skills

### Skills You've Developed

By completing Document Detective, you can now:

✅ Diagnose team development stages from written artifacts
✅ Identify leadership styles in action
✅ Spot issues and opportunities in team communications
✅ Recognize what good (and poor) leadership looks like
✅ Apply frameworks to real-world situations
✅ Read emotional dynamics in written communication
✅ Understand full team lifecycle from formation to closure

### Application to Your Work

**Use These Skills:**
- Review your own team's communications
- Diagnose your current team stage
- Evaluate your leadership approach
- Identify opportunities for improvement
- Anticipate team needs
- Intervene appropriately

**Questions to Ask:**
- What stage is my team in based on their communications?
- What leadership style am I using?
- Is it appropriate for our stage?
- What behaviors do I see in our artifacts?
- How could I lead more effectively?

---

**End of Document Detective**

**Remember:** Real leadership happens in the everyday interactions - emails, meetings, Slack messages, and documents. Learning to read and respond to these effectively is core to excellent project management.
```

**This comprehensive Document Detective content is ready for your Learn Hub!**