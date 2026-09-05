# RailOpt AI

AI-Powered Railway Block Planning System

Build a modern, professional, responsive web application called “RailOpt AI – Intelligent Railway Block Planner” to solve the problem statement:

“AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways.”

The application is a decision-support system for railway maintenance planners. It should intelligently coordinate maintenance activities from different departments such as Track, Electrical/OHE, and Signal & Telecom (S&T), while considering train schedules, asset condition, maintenance duration, manpower, equipment, safety constraints, location, and available maintenance windows.

The goal is to reduce unnecessary maintenance blocks, reduce asset downtime, avoid conflicts with train operations, and maximize asset availability.

1. Overall Design

Create a clean, professional railway/transportation-themed dashboard suitable for a college hackathon presentation.

Use:

Modern responsive UI

Desktop-first dashboard

Mobile responsive design

Professional cards and tables

Interactive charts

Clear status badges

Minimal animations

Accessible typography

Sidebar navigation

Top navigation/header

Light professional theme

Do NOT make it look like a generic student CRUD project.

The application should look like a real Railway Operations Control / Maintenance Planning Dashboard.

2. Main Navigation

Create a left sidebar with:

Dashboard

Train Schedule

Maintenance Tasks

Asset Monitoring

Block Planner

Block Calendar

Optimization Results

Reports

Settings

Highlight Block Planner as the main feature.

3. Dashboard Page

Create a dashboard showing:

KPI Cards

Total Assets

Pending Maintenance Tasks

High Priority Assets

Today's Planned Blocks

Conflicts Detected

Asset Availability %

Maintenance Hours Saved

Use realistic demo data.

Example:

Total Assets: 248
Pending Tasks: 36
High Priority: 8
Today's Blocks: 7
Conflicts: 3
Asset Availability: 94.6%
Estimated Hours Saved: 11.5 hrs

Do not hard-code these values everywhere. Store them in application state/database so they can update when data changes.

Dashboard Charts

Create:

Asset condition distribution

Maintenance tasks by department

Block utilization

Asset availability trend

Before vs AI-optimized block comparison

4. Train Schedule Page

Create a page where railway planners can view and manage train schedules.

Columns:

Train ID

Train Name

Route

Location

Arrival Time

Departure Time

Train Type

Priority

Status

Add:

Search

Filter

Sort

Add Train

Edit

Delete

Include realistic Indian Railway-style demo data.

Example:

Train 12345
Route: Nashik → Mumbai
Location: KM 120
Arrival: 10:30
Departure: 10:35
Type: Express

The train schedule must be used by the block-planning algorithm to identify conflicts.

5. Maintenance Tasks Page

Create a maintenance task management interface.

Fields:

Task ID

Asset ID

Location

Department

Maintenance Type

Estimated Duration

Priority

Required Date

Required Resources

Status

Departments:

Track

Electrical/OHE

Signal & Telecom

Mechanical

Other

Priority:

Critical

High

Medium

Low

Allow the user to:

Add task

Edit task

Delete task

Filter by department

Filter by priority

Search by asset/location

6. Asset Monitoring Page

Create an asset monitoring dashboard.

Each asset should contain:

Asset ID

Asset Type

Location

Condition

Last Maintenance Date

Failure Risk

Criticality

Availability

Next Maintenance Due

Example:

Asset: TRACK-120
Type: Track
Location: KM 120
Condition: Poor
Failure Risk: 89/100
Criticality: High
Availability: 91%

Use visual indicators:

Green = Good
Yellow = Warning
Red = Critical

Add an asset condition chart.

7. AI BLOCK PLANNER — MAIN FEATURE

This is the most important page.

Create a large section titled:

“AI-Powered Automatic Block Planner”

Add a prominent button:

GENERATE OPTIMIZED BLOCK PLAN

When clicked, the system should simulate an AI/optimization process.

Show a short processing animation:

Analyzing maintenance tasks...

Checking train timetable...

Checking asset priority...

Checking department availability...

Checking resource conflicts...

Evaluating maintenance windows...

Generating optimized block plan...

Then display the recommended schedule.

8. Block Optimization Logic

Implement a realistic scheduling algorithm.

The system should consider:

Inputs

Train timetable

Maintenance tasks

Asset condition

Asset criticality

Failure risk

Maintenance duration

Location

Department availability

Manpower

Equipment

Maintenance windows

Safety constraints

Task dependencies

Optimization objectives

Minimize:

Number of maintenance blocks

Total block duration

Train disruption

Asset downtime

Resource conflicts

Maximize:

Asset availability

High-priority maintenance completion

Resource utilization

Maintenance tasks completed per block

Use a weighted scoring / heuristic optimization approach for the prototype.

Do not claim that the system controls real railway operations.

It is a decision-support system that generates recommendations for authorized planners.

9. Task Compatibility Logic

The system should NOT blindly combine all tasks.

Before combining tasks, check:

Location compatibility

Tasks at the same or nearby location can be considered for grouping.

Time compatibility

Tasks must fit within the same available maintenance window.

Resource compatibility

Two tasks requiring the same unavailable equipment simultaneously should not be combined.

Department compatibility

Different departments may work together only when their activities are operationally compatible.

Safety compatibility

Tasks with incompatible safety requirements must not be grouped.

Train conflict

The proposed block must not conflict with protected train movements.

Only compatible tasks should be grouped.

10. Example AI Recommendation

Use demo data such as:

Task T101:
Track maintenance
Location: KM 120
Duration: 2 hours
Priority: Critical

Task T102:
OHE inspection
Location: KM 121
Duration: 1 hour
Priority: High

Task T103:
Signal maintenance
Location: KM 120
Duration: 1 hour
Priority: High

If these activities are compatible, generate:

Recommended Block B001

Location: KM 120–121
Time: 10:00 AM – 12:00 PM
Duration: 2 hours

Departments:

✓ Track
✓ Electrical/OHE
✓ Signal & Telecom

Tasks:

T101 + T102 + T103

Status:

Recommended

Reason:

“Compatible location, overlapping maintenance window, available resources, and no protected train conflict.”

11. Conflict Detection

Create a conflict panel.

Possible conflicts:

Train movement conflict

Resource conflict

Manpower conflict

Location conflict

Time conflict

Safety conflict

Department dependency

Example:

Conflict Detected

Train 12345 passes KM 120 at 11:15 AM.

Current proposed block:

10:00 AM – 12:00 PM

Therefore:

❌ Conflict

Suggested alternative:

12:00 PM – 2:00 PM

Add a button:

Apply Suggested Change

12. Block Calendar

Create a visual calendar/timeline showing:

Train movements

Maintenance windows

Recommended blocks

Department activities

Use different visual labels for:

Train
Track Maintenance
Electrical/OHE
Signal & Telecom
Conflict

Allow users to switch between:

Day

Week

Timeline

13. Optimization Results Page

Create a clear comparison:

Before Optimization

Maintenance Blocks: 13
Total Block Duration: 26 hours
Separate Department Activities: 18
Conflicts: 5

After AI Optimization

Maintenance Blocks: 8
Total Block Duration: 17 hours
Coordinated Activities: 12
Conflicts: 0

Calculate these values dynamically from the demo dataset where possible.

Do NOT present the numbers as actual Indian Railways statistics. Clearly label them as:

“Prototype Simulation Results”

Create charts for:

Blocks before vs after

Total duration before vs after

Tasks completed

Asset availability

Resource utilization

14. Asset Availability Calculation

Calculate:

Asset Availability = Available Time / Total Time × 100

Show the improvement after optimized maintenance planning.

Example:

Before optimization: 89.8%

After optimization: 94.6%

Label it:

Prototype Simulation

15. Planner Approval

After generating a block, show:

AI Recommendation

Block ID: B001
Location: KM 120–121
Time: 10:00 AM – 12:00 PM
Departments: Track + Electrical + S&T
Priority: High
Conflicts: None

Buttons:

Approve Block

Modify

Reject

After approval, change status to:

🟢 Approved

Important:

The AI must never be presented as independently authorizing or controlling railway operations.

16. Explainable AI Section

For every recommendation, show:

Why did AI select this block?

Example:

Same/nearby location

High-priority assets

Compatible maintenance activities

Available manpower

Equipment available

No train conflict

Fits available maintenance window

Reduces separate blocks

Create a small “Why this recommendation?” expandable section.

This is important for judges because the recommendation should be explainable.

17. Reports Page

Allow generation of a maintenance planning report containing:

Block ID

Date

Location

Tasks

Departments

Duration

Priority

Resources

Conflicts

Optimization score

Asset availability impact

Include:

Download Report

If actual PDF generation is not implemented, provide a print-friendly report view.

18. Database Structure

Create these logical entities/tables:

trains

id
train_id
route
location
arrival_time
departure_time
priority

assets

id
asset_id
type
location
condition
criticality
failure_risk
availability
last_maintenance

maintenance_tasks

id
task_id
asset_id
department
maintenance_type
duration
priority
required_date
status

resources

id
resource_name
resource_type
availability
department

blocks

id
block_id
location
start_time
end_time
duration
status
optimization_score

block_tasks

block_id
task_id

19. Technical Stack

Use:

Frontend:

React

Tailwind CSS

Lucide icons

Recharts

Backend:

Python

Flask or FastAPI

Optimization:

Python

Pandas

NumPy

OR-Tools or a custom weighted heuristic algorithm

Database:

MySQL

If a backend/database is difficult for the prototype, initially use structured mock JSON data, but keep the architecture ready for backend integration.

20. UI Requirements

Use:

Professional railway operations dashboard

Responsive layout

Sidebar

KPI cards

Tables

Charts

Timeline

Status badges

Modal forms

Toast notifications

Confirmation dialogs

Use a professional color palette based around:

Deep blue

White

Neutral gray

Green for successful recommendations

Amber for warnings

Red for conflicts

Avoid excessive gradients, flashy animations, or unnecessary decorative elements.

21. Demo Flow

The application must support this complete demo:

Dashboard
↓
Add/View Train Schedule
↓
Add/View Maintenance Tasks
↓
View Asset Conditions
↓
Open AI Block Planner
↓
Click “Generate Optimized Block Plan”
↓
AI analyzes data
↓
Show recommended blocks
↓
Show explanation
↓
Show conflicts
↓
Show optimized schedule
↓
Compare Before vs After
↓
Planner approves block
↓
Updated dashboard metrics

22. Important Demo Scenario

Preload the application with a realistic scenario involving:

10–15 trains

15–25 maintenance tasks

Track department

Electrical/OHE department

Signal & Telecom department

10+ assets

Different priorities

Different maintenance durations

Some train conflicts

Some resource conflicts

Several compatible tasks

The AI planner should produce multiple recommended blocks instead of only one.

Include at least:

A successful multi-department block

A rejected block because of a train conflict

A rejected combination because of a resource conflict

A high-priority emergency/critical maintenance task

A case where tasks remain separate because they are incompatible

23. Key Innovation to Highlight

Display this statement prominently on the landing/dashboard page:

“Coordinate compatible maintenance activities into fewer, smarter blocks — while protecting train operations and maximizing asset availability.”

The main innovation is cross-departmental maintenance coordination, not simply timetable management.

24. Safety Disclaimer

Add a small note in the application:

“This prototype is a decision-support and planning system. Final maintenance blocks must be validated and authorized by qualified railway personnel according to applicable railway safety procedures.”

25. Final Goal

The finished application should convincingly demonstrate:

Railway Data → AI Analysis → Conflict Detection → Task Coordination → Optimized Block → Human Approval → Improved Asset Availability

Make the AI Block Planner the centerpiece of the application and ensure the entire UI supports this story.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rail-opti-plan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eef623b4-7b51-4661-914a-6be9dc3482fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
