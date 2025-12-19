# Content File Structure Guide

## Folder Organization

Create a `content/` folder at the root level with subfolders for each task.

### Recommended Structure:

```
content/
  ├── manage_conflict/
  │   ├── 1_overview.md
  │   ├── 2_pmp_application.md  (includes application_tips)
  │   ├── 3_deep_dive.md
  │   └── activities/
  │       ├── 1_pm_simulator.md
  │       ├── 2_lightning_round.md
  │       ├── 3_document_detective.md
  │       ├── 4_conflict_matcher.md
  │       ├── 5_timeline_reconstructor.md
  │       └── 6_empathy_exercise.md
  │
  ├── lead_team/
  │   ├── 1_overview.md
  │   ├── 2_pmp_application.md
  │   ├── 3_deep_dive.md
  │   └── activities/
  │       └── (6 activity files)
  │
  ├── support_performance/
  ├── empower_team/
  ├── train_team/
  └── ... (all 35 tasks)
```

## Folder Naming Convention

**Use lowercase with underscores:**
- ✅ `support_performance/`
- ✅ `manage_conflict/`
- ✅ `lead_team/`
- ❌ `Support Performance/` (spaces)
- ❌ `support-performance/` (hyphens)

## File Naming Convention

### Content Files (3 per task):
1. **`1_overview.md`** → Maps to `learn.overview`
2. **`2_pmp_application.md`** → Maps to `learn.pmp_application` (includes application_tips)
3. **`3_deep_dive.md`** → Maps to `learn.deep_dive`

### Activity Files (6 per task):
1. **`1_pm_simulator.md`**
2. **`2_lightning_round.md`**
3. **`3_document_detective.md`**
4. **`4_conflict_matcher.md`**
5. **`5_timeline_reconstructor.md`**
6. **`6_empathy_exercise.md`**

## Content Structure in Each MD File

### `1_overview.md` should contain:
- Definition
- Module Introduction
- What You'll Learn (bulleted list)
- Key Learning Objectives (numbered list)
- Why This Matters
- Exam Triggers (bulleted list)
- Quick Scenarios (optional)

### `2_pmp_application.md` should contain:
- Connection to PMP Certification
- Domain (People/Process/Business)
- Related PMP Tasks (with descriptions)
- How This Module Supports Your PMP Application
- Application Tips

### `3_deep_dive.md` should contain:
- Foundational Concept
- Detailed explanations, frameworks, models
- Any topic-specific deep content

### Activity files:
- Activity instructions
- Scenarios/questions
- Answer keys
- Discussion questions

## Example Task Names (Use These Exact Names):

**People Domain:**
- manage_conflict
- lead_team
- support_performance
- empower_team
- train_team
- build_team
- address_obstacles
- negotiate_agreements
- collaborate_stakeholders
- build_understanding
- support_virtual_teams
- define_team_ground_rules
- mentor_stakeholders
- promote_performance

**Process Domain:**
- execute_urgency
- manage_communications
- assess_risk
- engage_stakeholders
- plan_budget
- plan_schedule
- plan_quality
- plan_scope
- integrate_planning
- manage_changes
- plan_procurement
- manage_artifacts
- determine_methodology
- establish_governance
- manage_issues
- transfer_knowledge
- plan_closure

**Business Domain:**
- plan_compliance
- evaluate_benefits
- support_change
- employ_continuous_improvement

## Notes:

1. **Activities are optional** - You can create them later if needed (they go in practice section, not learn)
2. **Deep Dive can be split** - If deep_dive is very long, you can have `3_deep_dive_part1.md` and `3_deep_dive_part2.md` - I'll combine them
3. **Naming must match** - The folder name should match the task name in taskData.json (see TASK_NAME_MAPPING.md)
4. **application_tips is inside pmp_application** - Don't create a separate file, include it in `2_pmp_application.md`

## What I'll Do With These Files:

Once you have the files created, I will:
1. Read all the MD files from the `content/` folders
2. Parse the content and convert it to the proper JSON structure
3. Insert it into `taskData.json` in the correct format
4. Activities will go into the `practice` section structure

## Example Workflow:

1. You create: `content/support_performance/1_overview.md`
2. You create: `content/support_performance/2_pmp_application.md`
3. You create: `content/support_performance/3_deep_dive.md`
4. You tell me: "I've created content for Support Performance"
5. I read the files and convert them to JSON
6. I update `taskData.json` with the content

