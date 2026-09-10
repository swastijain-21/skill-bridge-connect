# Skill Bridge Connect

Build a complete, modern, responsive full-stack web application called SkillBridge for a national-level hackathon.

PROBLEM STATEMENT

The platform solves the problem of weak academic–industry collaboration in skill mapping, internships and placements.

The platform must connect three major stakeholders:

1. Students

2. Academic Institutions

3. Industry/Recruiters

Also create an Admin/Ministry-level analytics dashboard for demonstration purposes.

The core philosophy is:

Assess → Map Skills → Identify Gaps → Improve Skills → Match Opportunities → Receive Industry Feedback → Update Skills

Do NOT build this as a simple job portal. The core differentiator is skill-first opportunity matching.

---

TECHNOLOGY

Use:

- React / Next.js

- TypeScript

- Tailwind CSS

- Modern component-based architecture

- Supabase for PostgreSQL database and authentication

- Recharts for analytics

- Lucide icons

Use clean reusable components.

The application must be responsive for desktop, tablet and mobile.

---

USER ROLES

Create four roles:

1. STUDENT

Students can:

- Create profile

- Add academic information

- Add technical and soft skills

- Add projects

- Add certifications

- Complete skill assessments

- View skill proficiency

- View skill gaps

- View recommended learning resources

- View internship opportunities

- View placement opportunities

- See opportunity match percentage

- Apply to opportunities

- Track applications

- View feedback

2. INSTITUTION

Institutions can:

- View registered students

- View student skill analytics

- View department-wise skill gaps

- View industry-demand trends

- Track internships

- Track placements

- View student employability analytics

- Identify commonly missing skills

- View industry collaboration opportunities

3. INDUSTRY

Industry users can:

- Create company profile

- Create internship opportunities

- Create job opportunities

- Define required skills

- Define minimum proficiency levels

- Define eligibility requirements

- View matching students

- View candidate profiles

- Shortlist candidates

- Update candidate status

- Provide post-internship feedback

4. ADMIN

Admin dashboard should show:

- Total students

- Total institutions

- Total industry partners

- Total internships

- Total jobs

- Applications

- Placements

- Most demanded skills

- Most common student skill gaps

- Institution-wise statistics

- Industry-wise statistics

---

DATABASE

Create a proper relational database.

Suggested tables:

profiles

students

institutions

companies

skills

student_skills

skill_assessments

assessment_results

projects

certifications

opportunities

opportunity_skills

applications

shortlists

internships

placements

feedback

learning_resources

notifications

Create appropriate primary keys, foreign keys and relationships.

Use role-based access so users can only access appropriate functionality.

---

STUDENT DASHBOARD

Create a visually impressive dashboard showing:

- Profile completion

- Overall skill readiness score

- Top skills

- Skill gaps

- Recommended skills

- Recommended internships

- Recommended jobs

- Application status

- Recent activity

Example:

Career Readiness: 78%

Skills:

Python — 85%

SQL — 62%

Data Analysis — 75%

Power BI — 40%

Skill gaps:

SQL

Power BI

Communication

Then show:

Recommended next steps

1. Complete SQL assessment

2. Learn Power BI

3. Apply for Data Analyst Internship

---

SKILL GAP ENGINE

Implement a rule-based skill matching engine first.

For each opportunity:

Required skills:

Python — 80

SQL — 75

Power BI — 70

Student skills:

Python — 85

SQL — 60

Power BI — 40

Calculate an overall match percentage.

Display:

Opportunity Match: 72%

Show:

Green = Meets requirement

Yellow = Partially meets

Red = Skill gap

Do NOT use random match percentages.

Calculate the score from the student's stored skill levels and opportunity requirements.

---

INTERNSHIP/JOB DISCOVERY

Create an opportunity marketplace.

Each opportunity card should show:

- Company

- Role

- Internship/Job

- Location

- Duration

- Required skills

- Match percentage

- Eligibility

- Apply button

Add filters:

- Role

- Skill

- Location

- Internship/Job

- Experience

- Match percentage

---

INDUSTRY DASHBOARD

Create:

Post Opportunity

Fields:

- Role

- Description

- Internship/job

- Location

- Duration

- Required skills

- Minimum skill proficiency

- Eligibility

- Application deadline

Also create:

Candidate Matching

Show students sorted by match score.

Example:

Candidate | Match | Missing Skills | Status

Ananya | 91% | Power BI | Shortlist

Rahul | 84% | SQL | Review

Priya | 76% | Python | Review

---

INSTITUTION DASHBOARD

Create charts for:

- Students by skill readiness

- Top skill gaps

- Most demanded industry skills

- Internship participation

- Placement rate

- Department-wise skill distribution

Use realistic demo data.

---

ADMIN DASHBOARD

Create a professional national-level analytics dashboard.

Show:

Students: 12,540

Institutions: 86

Industry Partners: 214

Internships: 1,280

Jobs: 740

Placements: 3,420

Create charts for:

- Skill demand

- Skill gaps

- Internship trends

- Placement trends

- Industry participation

- Institution performance

Clearly label these as demo/sample data.

---

AI FEATURES

Keep AI functionality modular so it can be connected later.

Create an AI Career Assistant that can answer questions such as:

“What skills do I need for a Data Analyst role?”

“How can I improve my employability?”

“Which internships match my profile?”

“What skills am I missing?”

The AI should use the student's stored profile and skills when generating recommendations.

Create a separate AI service/function rather than putting API keys in frontend code.

---

UI/UX

Use a professional government/healthcare/education-inspired design.

Do not make it look like a generic social media or gaming website.

Use:

- Clean white background

- Professional green/blue accent colors

- Clear cards

- Modern dashboards

- Accessible typography

- Simple navigation

- Consistent icons

- Responsive layouts

Create separate dashboards for each role.

Add:

- Loading states

- Empty states

- Error states

- Success notifications

- Form validation

---

DEMO DATA

Populate the application with realistic sample data so the portal looks functional immediately.

Create:

10 students

3 institutions

5 companies

15 skills

10 internships

8 jobs

multiple skill assessments

multiple applications

sample feedback

Use fictional names and organizations.

---

DEMO FLOW

The application must support this complete demonstration:

Student login

→ Student dashboard

→ Skill profile

→ Skill assessment

→ Skill gap analysis

→ Recommended learning

→ Internship recommendations

→ Match percentage

→ Apply

Then:

Industry login

→ Create opportunity

→ Define required skills

→ View matching candidates

→ Shortlist student

Then:

Institution login

→ View student skill analytics

→ View skill gaps

→ View industry demand

Then:

Admin login

→ View overall ecosystem analytics

---

IMPORTANT

Do not create fake buttons that do nothing.

Every major button in the demo flow must perform a visible action or navigate to a functional page.

Build the application incrementally.

First create the database, authentication and core navigation.

Then build student functionality.

Then industry functionality.

Then institution functionality.

Then admin analytics.

Finally add AI features.

After every major stage, test the application and fix errors before continuing.

Keep the code modular, readable and maintainable.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f460a0e4-3dfc-4edf-b248-c343297006ab).

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
