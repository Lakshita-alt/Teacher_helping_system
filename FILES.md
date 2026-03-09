# Teacher Helping System — File & Folder Reference

Complete description of every file and folder in the project.

---

## Table of Contents

1. [Root Files](#root-files)
2. [database/](#database)
3. [server/](#server)
4. [src/](#src)
   - [src/lib/](#srclib)
   - [src/app/](#srcapp)
   - [src/app/api/](#srcappapi)
   - [src/app/home/](#srcapphome)
   - [src/app/admin/](#srcappadmin)
   - [src/component/](#srccomponent)
   - [src/component/teacher/](#srccomponentteacher)
   - [src/component/admin/](#srccomponentadmin)
5. [public/](#public)
6. [Experiments/](#experiments)

---

## Root Files

### `package.json`
**Project manifest and dependency list.**

Defines the project name, version (`0.1.0`), and all npm dependencies:
- **Runtime**: Next.js 16, React 19, Anthropic SDK, Google Generative AI, Recharts, jsPDF
- **Dev**: Tailwind CSS 4, Biome, ESLint

Scripts: `dev` (local dev server), `build` (production build), `start` (serve production), `lint`.

---

### `next.config.mjs`
**Next.js framework configuration.**

- Enables the React Compiler (experimental optimization)
- Sets server action body size limit to 100 MB to support large CSV file uploads

---

### `jsconfig.json`
**JavaScript path alias configuration.**

Configures `@/` as a path alias pointing to `src/`, enabling cleaner imports like `import { getStudents } from "@/lib/data"` instead of relative paths.

---

### `postcss.config.mjs`
**PostCSS configuration.**

Configures PostCSS to process Tailwind CSS 4. Required for Tailwind's utility class generation pipeline.

---

### `biome.json`
**Biome formatter and linter configuration.**

Configures the Biome tool for consistent code formatting and linting rules across the project. An alternative to Prettier + ESLint.

---

### `eslint.config.mjs`
**ESLint linting configuration.**

Standard ESLint setup extending Next.js recommended rules. Runs via `npm run lint`.

---

### `.env`
**Environment variables (not committed to git).**

Stores sensitive API keys required at runtime:
- `GEMINI_API_KEY` — Google Gemini AI key (used by `src/lib/gemini.js`)
- `ANTHROPIC_API_KEY` — Anthropic Claude key (used by `src/lib/anthropic.js`)

Listed in `.gitignore` — never committed to source control.

---

### `.gitignore`
**Git exclusion rules.**

Prevents committing: `node_modules/`, `.next/`, `.env`, build artifacts, and editor-specific files.

---

### `notifications.json`
**System notification store.**

Root-level JSON file that persists application notifications. Read and written by the `/api/notifications` route. Stores notification objects with timestamps and content for both teacher and admin users.

---

### `README.md`
**Main project documentation.**

High-level overview of the project for developers and stakeholders:
- Pedagogical goals and AI-driven feature summary
- Tech stack (Next.js, React 19, Gemini AI, Recharts)
- Feature list: Scaffolding, Analytics, Peer Mentorship, Admin Tools
- Setup instructions including API key configuration

---

### `PROJECT_DOCUMENTATION.md`
**Comprehensive technical documentation (~75 KB).**

Deep-dive reference covering the entire system:
- Technology stack details
- ML model and persona classification logic
- Full database schema (students, pulses, mentor remarks)
- API endpoint documentation
- Component architecture
- Data flow diagrams
- Deployment guide

---

### `VDO.md`
**Supplementary documentation file.**

Additional notes or video/demo documentation for the project.

---

### `text.txt`
**Scratch notes file.**

Informal text notes used during development. Not part of the application.

---

## database/

Local JSON-based persistence layer. No external database is required — all data is stored as flat JSON files read and written directly by the data access layer (`src/lib/data.js`).

### `database/students.json`
**Main student data store.**

The core database file. Contains one record per student with all academic, behavioral, and engagement fields:

- **Identity**: `id`, `name`, `className`
- **ML-classified fields**: `Persona` (learning archetype), `Risk_Category` (Low/Medium/High), `Risk_Score`
- **Academic metrics**: `Attendance`, `Hours_Studied`, `Sleep_Hours`, `Tutoring_Sessions`
- **Behavioral fields**: `Motivation_Level`, `Peer_Influence`, `Extracurricular_Activities`, `Access_to_Resources`
- **Real-time tracking**: `dailyPulse` array (engagement per weekday), `weeklyScores`, `trendTracking`
- **Behavioral evolution**: Simulated historical data used for drift velocity calculations
- **Pedagogical overrides**: Teacher-applied manual interventions (e.g., snooze, low priority)

Updated by the pulse API (`/api/ai/pulse`) and override API (`/api/student/override`).

### `database/pulses.json`
**Daily engagement pulse log.**

Tracks real-time student engagement snapshots:
- Participation level entries (`Passive` / `Steady` / `Active`)
- Timestamped logs for trend analysis

Used in conjunction with `students.json` to calculate drift velocity.

### `database/mentor-remarks.json`
**Teacher annotation store.**

Stores written observations and notes made by teachers for individual students:
- `studentId` — links remark to a student record
- `text` — the actual remark content
- `remarkId` — unique identifier for deletion
- `timestamp` — when the remark was created

Managed via the `/api/mentor-remarks` endpoint (GET / POST / DELETE).

---

## server/

Server-side utility scripts for data initialization and file handling. These are Node.js scripts and Next.js Server Actions that run outside the browser.

### `server/init-db.js`
**Database seed / initialization script.**

Reads the master CSV file from `Experiments/genai_ready_student_profiles.csv` and converts it into the JSON format expected by `database/students.json`.

Key responsibilities:
- Parses CSV rows into structured student objects
- Assigns students to classes (500 students per class)
- Initializes `dailyPulse` arrays (Mon–Fri engagement slots)
- Generates `weeklyScores` and `trendTracking` fields
- Populates `behavioralEvolution` data based on risk categories and motivation levels
- Writes the resulting array to `database/students.json`

Run manually when setting up the project for the first time or re-seeding the database.

### `server/csv.js`
**CSV file upload handler (Next.js Server Action).**

Handles `multipart/form-data` file uploads sent from the frontend upload interface.

Key responsibilities:
- Accepts a `FormData` payload containing a CSV file
- Generates a unique UUID-based filename to avoid collisions
- Saves the uploaded file to the `public/` directory
- Returns `{ success: true, filePath }` on success

Used by the bulk-upload page (`src/app/home/upload/page.js`) to allow teachers to import new student data via CSV.

---

## src/

All application source code. Organized following the Next.js App Router convention.

```
src/
├── app/          # Pages, layouts, and API routes (file-based routing)
├── component/    # Reusable React components
└── lib/          # Core library modules (data access, AI integrations)
```

---

## src/lib/

Core library modules — AI integrations and the central data access layer. Imported by API routes and server-side page logic.

### `src/lib/data.js`
**Central data access layer.**

The single source of truth for reading and writing application data. All API routes go through this module instead of touching JSON files directly.

| Function | Description |
|---|---|
| `getStudents(className?)` | Returns all students (optionally filtered by class). Computes drift velocity and mentor matches on the fly. |
| `getStudentById(id)` | Fetches a single student record. |
| `updateStudentPulse(id, day, engagement)` | Logs a Mon–Fri engagement value (`Passive`/`Steady`/`Active`) into the student's `dailyPulse` array. |
| `updateStudentOverride(id, overrideData)` | Saves a teacher-applied pedagogical override (e.g., snooze, low priority) onto the student record. |
| `getTeachers()` | Returns a hardcoded list of 5 teachers with id, name, and subject. |
| `getClasses()` | Groups students by `className` and returns persona distribution per class. |
| `getClassSummary()` | Aggregates school-wide statistics (attendance, study hours, risk distribution). |
| `getClassSummaryByName(name)` | Same as above but scoped to one class; includes `riskCatalyst` analysis. |

**Special logic:**
- **Drift velocity** — compares attendance across a simulated 3-week history to flag improving/declining students
- **Mentor matching** — pairs High Risk / Passive students with Well-Supported Consistent Learner peers

### `src/lib/anthropic.js`
**Anthropic Claude API integration.**

Wraps the Anthropic SDK to provide AI-generated pedagogical content using the Claude Haiku 4.5 model.

| Function | Description |
|---|---|
| `getStudentSuggestion(student)` | Returns 2 targeted instructional strategies for a specific student. |
| `getClassSuggestion(classSummary)` | Returns engagement improvement strategies for the whole class. |
| `getLessonPlan(topic, classContext)` | Generates a differentiated lesson plan with persona-specific scaffolding. |
| `getBatchSuggestions(students)` | Batch-processes multiple students and returns structured JSON suggestions. |
| `gradeSingle(submission)` | Grades an essay or short answer; returns score, feedback, strengths, and improvements. |

Features: In-memory caching to prevent repeated identical API calls; rate-limit error handling.

### `src/lib/gemini.js`
**Google Gemini AI integration (alternative/backup).**

Mirrors `anthropic.js` but uses the Google Generative AI SDK with the Gemini 2.0 Flash model. Provides the same function signatures so either module can be swapped in at the API route level. Includes delay mechanisms to avoid hitting rate limits and an in-memory result cache per prompt.

Currently used as a backup — the primary AI calls use Anthropic Claude.

---

## src/app/

Next.js App Router root. Contains all pages, layouts, and API routes. File-based routing — every folder maps to a URL segment.

### `src/app/layout.js`
**Global root layout.**

Wraps the entire application. Sets up Geist Sans and Geist Mono fonts, `ThemeProvider` for app-wide dark/light mode, and a global `ThemeToggle` button. All pages inherit this layout.

### `src/app/page.js`
**Root landing page (`/`).**

A client component that immediately redirects to `/admin/school` with a loading spinner. Acts as the application entry point.

### `src/app/login/page.js`
**Teacher login page (`/login`).**

Authentication form that accepts a teacher ID (e.g., `t1`, `t2`) or the admin ID (`admin1`). Validates against `/api/teachers`, checks `localStorage` for an assigned class, creates a Base64-encoded token with a 24-hour expiry, and redirects to `/home` (teachers) or `/admin/school` (admin).

### `src/app/signup/page.js`
**Signup placeholder (`/signup`).**

Placeholder page for a future user registration flow. Not yet functional.

---

## src/app/api/

Next.js App Router API routes. All routes return JSON and are consumed by the frontend pages and components.

### Student Data

| Route | Method | Description |
|---|---|---|
| `/api/students` | GET | Returns all students. Accepts optional `?className=` query param to filter by class. |
| `/api/student/[id]` | GET | Returns a single student by dynamic `id` parameter. Returns 404 if not found. |
| `/api/student/override` | POST | Applies a teacher-defined pedagogical override to a student (`id`, `overrideData` in body). |

### Class & School Data

| Route | Method | Description |
|---|---|---|
| `/api/classes` | GET | Returns all classes with student counts and persona distributions. |
| `/api/class-summary` | GET | Returns school-wide aggregated statistics (attendance, study hours, risk breakdown). |
| `/api/class-summary/[className]` | GET | Returns statistics scoped to one class. Includes `riskCatalyst` — the primary factor driving high risk in that class. |
| `/api/teachers` | GET | Returns the hardcoded list of 5 teachers (id, name, subject). |

### Teacher Interactions

| Route | Methods | Description |
|---|---|---|
| `/api/mentor-remarks` | GET, POST, DELETE | Manages teacher written remarks for students. GET by `?studentId=`, POST with `{studentId, text}`, DELETE with `{studentId, remarkId}`. |
| `/api/notifications` | GET, POST | Reads and creates system notifications stored in `notifications.json`. |

### AI Endpoints

| Route | Method | Description |
|---|---|---|
| `/api/ai/suggestion` | POST | Generates AI suggestions. `type` field: `"student"` (per-student strategies), `"class"` (class-wide strategies), `"lesson-plan"` (differentiated lesson). Uses Anthropic Claude with batch caching. |
| `/api/ai/pulse` | POST | Accepts an array of `{id, engagement}` objects and writes daily pulse updates to student records. |
| `/api/ai/grade` | POST | Batch-grades essay/short-answer submissions. Runs up to 5 concurrent Claude calls (batch size 20). Returns score, feedback, strengths, and improvement notes per submission. |
| `/api/ai/test` | GET | Utility test endpoint to verify AI connectivity. |

---

## src/app/home/

Teacher-facing dashboard routes. All pages require a valid teacher token and an assigned class stored in `localStorage`. Unauthenticated users are redirected to `/login`.

### `src/app/home/layout.js`
**Teacher dashboard shell / auth guard.**

Wraps every `/home/*` page with token validation (Base64 JWT, 24-hour expiry), sidebar navigation, mobile-responsive hamburger menu, theme toggle, and a logout button that clears the token and redirects to `/login`.

### `src/app/home/page.js`
**Main teacher home dashboard.**

Primary landing page after login. Shows a welcome greeting, quick stats bar (total students, average attendance, high-risk count, average study hours), priority inbox of students needing intervention, quick action grid (Record Pulse, Lesson Planner, Student Analysis, Bulk Upload), a Weekly Pulse Logger modal for logging Mon–Fri engagement levels, and PDF export for a full class master report.

### `src/app/home/student/page.js`
**Student performance analysis page.**

Detailed per-student inspection tool with a searchable/filterable student list and a detail panel showing persona, risk category, attendance, study hours, motivation, daily pulse chart (Recharts), teacher remarks (add/view/delete), AI-generated instructional strategies, and manual override controls (snooze, low priority).

### `src/app/home/class/page.js`
**Class-wide analytics dashboard.**

Aggregated view of the teacher's entire class. Shows class size, high-risk percentage, average attendance, average study hours, a timeline switcher (This Week / Last Week / Last Month), risk distribution pie chart, persona breakdown bar chart, engagement trend chart, and AI-generated cluster-specific strategies.

### `src/app/home/lesson-planner/page.js`
**AI-powered lesson planning tool.**

Lets teachers input a lesson topic and design parameters, fetches class persona context, and calls `/api/ai/suggestion` with `type: "lesson-plan"` to produce a differentiated lesson plan with concept anchors, persona-specific adjustments, and engagement methods.

### `src/app/home/personas/page.js`
**Student persona reference guide.**

Static educational display explaining the 7 learning archetypes used by the system. Helps teachers understand what each persona classification means and how to interpret student data.

### `src/app/home/upload/page.js`
**Bulk CSV data upload interface.**

Allows teachers to import new or updated student data by uploading a CSV file. Uses the `Uploadcsv` component and calls the `server/csv.js` Server Action to save the file to `public/`.

---

## src/app/admin/

Admin-facing dashboard routes. Accessible with the hardcoded `admin1` login. Provides school-wide oversight and teacher management tools.

### `src/app/admin/layout.js`
**Admin dashboard shell.**

Shared layout wrapper for all `/admin/*` pages, providing navigation structure and consistent styling.

### `src/app/admin/page.js`
**Admin root redirect.**

Immediately redirects from `/admin` to `/admin/school`, ensuring the admin always lands on the school overview.

### `src/app/admin/school/page.js`
**School-wide overview dashboard.**

Main admin landing page. Displays total students, total classes, average attendance, high-risk count, persona distribution PieChart (top 4), class breakdown cards, academic year info, and a logout button. Fetches from `/api/classes` and `/api/class-summary`.

### `src/app/admin/assign/page.js`
**Teacher-to-class assignment tool.**

Lets the admin link a teacher to a class via dropdowns. Assignments are saved to `localStorage` and read by the teacher login flow to determine class access. Shows current assignment list and success/error feedback.

### `src/app/admin/class/page.js`
**Class management view.**

Admin-level class browsing and management interface with drill-down capability into individual classes.

### `src/app/admin/student/page.js`
**Student management view.**

Admin-level student listing interface for browsing students across all classes.

### `src/app/admin/notifications/page.js`
**Notification management panel.**

Admin interface for viewing and managing system-wide notifications via the `/api/notifications` endpoint.

---

## src/component/

Shared UI components used across the application.

### `src/component/Icons.jsx`
**Centralized SVG icon library.**

A single `Icon` component that renders one of 20+ named icons by `type` prop. All icons are inline SVGs styled with Tailwind CSS. Available types: `lock`, `logout`, `dashboard`, `class`, `student`, `grading`, `suggestion`, `notification`, `school`, `upload`, `close`, `menu`, `search`, `warning`, `trend`, `calendar`, `sparkles`, `folder`, `bolt`, `teacher`, and more.

### `src/component/theme-provider.jsx`
**Dark/light mode context provider.**

Wraps the entire application with `next-themes` to enable persistent theme switching. Stores the user's preference and provides theme context to all child components.

### `src/component/ThemeToggle.jsx`
**Theme switch button component.**

A clickable button that toggles between dark and light mode. Appears in both the teacher and admin dashboard headers.

### `src/component/Uploadcsv.jsx`
**CSV file input component.**

Renders a styled file upload input that accepts `.csv` files and calls the `server/csv.js` Server Action to upload to `public/`. Used in the bulk upload page (`/home/upload`).

---

## src/component/teacher/

Reusable UI components used exclusively within the teacher dashboard (`/home/*` pages).

### `src/component/teacher/DashboardTab.jsx`
**Main navigation structure for the teacher home dashboard.**

Renders the sidebar or tab navigation linking between teacher-facing sections (Home, Students, Class, Lesson Planner, Upload).

### `src/component/teacher/ClassSummary.jsx`
**Navigation shortcut to the class analytics page.**

A link component displayed on the home dashboard that routes directly to `/home/class`.

### `src/component/teacher/StudentSummary.jsx`
**Navigation shortcut to the student analysis page.**

A link component displayed on the home dashboard that routes directly to `/home/student`.

### `src/component/teacher/Suggestions.jsx`
**AI pedagogical suggestions display component.**

Renders AI-generated instructional recommendations from `/api/ai/suggestion`. Handles loading states and formats suggestion text for readability within student detail or class views.

### `src/component/teacher/NotificationBell.jsx`
**Notification indicator icon.**

Displays a bell icon in the teacher dashboard header with an unread notification count badge. Triggers the notification panel on click.

### `src/component/teacher/NotificationsTab.jsx`
**Notification panel for teachers.**

Renders system notifications for the logged-in teacher, fetched from `/api/notifications` in reverse chronological order.

---

## src/component/admin/

Reusable UI components used exclusively within the admin dashboard (`/admin/*` pages).

### `src/component/admin/SchoolSummary.jsx`
**Navigation shortcut to the school overview page.**

A link component on the admin landing area that routes to `/admin/school`.

### `src/component/admin/SingleClassOverview.jsx`
**Individual class summary card.**

Renders a single card with key metrics for one class: student count, average attendance, risk distribution. Used inside `ClassBasedOverView.jsx`.

### `src/component/admin/ClassBasedOverView.jsx`
**List of all class cards.**

Maps over all classes and renders a `SingleClassOverview` card for each. Displayed on the admin school overview page.

### `src/component/admin/ClassOverviewModal.jsx`
**Expanded class detail modal.**

A dialog that shows a detailed breakdown of a class on click — fuller statistics, persona distributions, and risk catalysts.

### `src/component/admin/AssignClassTab.jsx`
**Teacher-to-class assignment UI tab.**

The form for selecting a teacher and a class and saving the assignment. Handles dropdown state, submission, and displays the current assignment list. Used in `/admin/assign`.

### `src/component/admin/SteudentBasedSummary.jsx`
**Student-centric admin summary view.**

*(Note: filename has a typo — "Steudent" instead of "Student".)*

Admin-level summary grouped around individual student metrics across the school. Used in the student management section.

### `src/component/admin/NotificationsTab.jsx`
**Admin notification management panel component.**

Renders the notification list for the admin user. Supports viewing and managing system-wide notifications from `/api/notifications`.

---

## public/

Statically served files. Everything here is accessible at the root URL path (e.g., `/file.svg`).

### `public/next.svg`
Next.js framework logo. Included by default with project scaffolding.

### `public/vercel.svg`
Vercel deployment platform logo. Included by default with project scaffolding.

### `public/file.svg`
Generic file icon SVG asset.

### `public/globe.svg`
Globe icon SVG asset.

### `public/window.svg`
Window icon SVG asset.

### `public/test.csv`
**Sample CSV file for upload testing.**

A test dataset in the expected student CSV format. Used to verify the bulk upload flow works correctly without needing real data.

### `public/blob1770385366457`
**Auto-generated file upload artifact.**

A file saved during a CSV upload operation via `server/csv.js`. The UUID-based naming prevents collisions. Files like this are created whenever a teacher uploads a CSV through the upload interface.

---

## Experiments/

Research, data exploration, and dataset files used during development. Not part of the running application — documents the data science work behind the system's ML-based student classification.

### `Experiments/genai_ready_student_profiles.csv`
**Master student dataset — primary data source.**

Canonical CSV containing 500+ student records with all behavioral, academic, and engagement fields (`Persona`, `Risk_Category`, `Risk_Score`, `Attendance`, `Hours_Studied`, `Sleep_Hours`, `Motivation_Level`, `Peer_Influence`, `Tutoring_Sessions`, `Access_to_Resources`, `Extracurricular_Activities`). Read by `server/init-db.js` to seed `database/students.json`.

### `Experiments/Student_data.csv`
**Raw / original student dataset.**

The unprocessed source data before persona classification and GenAI-readiness preparation. Used as input to the analysis notebooks.

### `Experiments/01.ipynb`
**Initial data exploration notebook.**

Jupyter notebook for early-stage data exploration — loading the raw dataset, inspecting distributions, identifying key features, and assessing data quality before modeling.

### `Experiments/final_experiment.ipynb`
**Final persona generation and classification notebook.**

The core ML/analysis notebook. Contains persona classification logic (assigns each student to one of 7 archetypes), feature engineering, risk score calculation, schema validation, and generation of `genai_ready_student_profiles.csv`.

### `Experiments/Learning Patterns & Classroom Strategy Insights.md`
**Pedagogical research document.**

Explains the theoretical framework behind the system's learning persona classification — the 7 student archetypes, recommended classroom strategies per persona, risk factors, early warning indicators, and the rationale for drift velocity and mentor-matching features. Serves as the domain knowledge foundation for AI prompt design.
