# Pedagogical Architect & Classroom Insights System

A sophisticated Next.js-based educational intelligence platform designed to empower teachers and administrators with AI-driven student analytics, risk assessment, and personalized instructional strategies.

## Overview

The **Teacher Helping System** is a data-driven dashboard that bridges the gap between raw student data and actionable pedagogical intervention. By leveraging **Google Gemini AI**, the system analyzes learning patterns, attendance velocity, and social dynamics to provide tailored scaffolding for every student.

## Key Features

### AI-Driven Scaffolding (Powered by Gemini 2.0 Flash)
- **Individual Student Suggestions:** Generates 2-3 qualitative, actionable instructional strategies (e.g., Metacognitive Scaffolding, Affective Support).
- **Classroom Climate Shifts:** Analyzes class-wide persona distributions to suggest high-level pedagogical shifts.
- **Automated Lesson Planning:** Tailors lesson plans to the dominant personas and risk profiles of a specific class.

### Advanced Student Analytics
- **Risk Category Mapping:** Automatically classifies students based on attendance, study hours, and resource access.
- **Drift Velocity Tracking:** Measures "Attendance Velocity" to identify students whose engagement is trending downward before it becomes a critical issue.
- **Daily Pulse Monitoring:** Real-time tracking of student engagement and participation levels.

### Social Scaffolding & Mentorship
- **Peer Mentorship Matching:** Intelligent logic that pairs "High Risk" or "Passive" students with "Well-Supported Consistent Learners" within the same class.

### Administrative & Teacher Tools
- **Class-Based Overview:** High-level school summaries for administrators to monitor risk distribution across the entire institution.
- **CSV Data Synchronization:** Seamlessly import student data from CSV files.
- **PDF Reports:** Export comprehensive student and class summaries for offline review or parent-teacher meetings.

## Implementation Details

### Tech Stack
- **Framework:** [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with `next-themes` for Dark Mode.
- **AI Engine:** [Google Generative AI SDK](https://ai.google.dev/gemini-api/docs/quickstart/nodejs) (Gemini 2.0 Flash).
- **Data Visualization:** [Recharts](https://recharts.org/) for risk distribution and pulse charts.
- **Persistence:** JSON-based local database (optimized for fast prototyping and portable data).

### Project Structure
- `src/app/`: Next.js App Router structure.
  - `admin/`: Institutional oversight and class assignment modules.
  - `home/`: Teacher-centric dashboards, lesson planners, and student personas.
  - `api/`: RESTful endpoints for AI integration and data synchronization.
- `src/component/`: Modular UI components.
  - `teacher/`: Focused on classroom management (Suggestions, Pulse, Summaries).
  - `admin/`: Focused on school-wide analytics and management.
- `src/lib/`:
  - `gemini.js`: Logic for pedagogical prompt engineering and AI communication.
  - `data.js`: Core data access layer (Drift calculation, Mentor matching, JSON DB management).
- `database/`: Local JSON storage for `students` and `pulses`.
- `Experiments/`: Jupyter Notebooks and CSV datasets used for developing the pedagogical models.

## Setup & Installation

### Prerequisites
- Node.js (Latest LTS recommended)
- A Google Gemini API Key

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Teacher_helping_system
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Initialize the Database:**
   Run the initialization script to populate the local JSON store from the CSV data:
   ```bash
   node server/init-db.js
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Access the Dashboard:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Research & Data
The project includes an `Experiments` folder containing:
- `Learning Patterns & Classroom Strategy Insights.md`: Documentation of the pedagogical theories applied.
- `final_experiment.ipynb`: Data analysis and persona generation logic.
- `genai_ready_student_profiles.csv`: The processed dataset powering the system.

---
*Developed to transform classroom data into student success.*
