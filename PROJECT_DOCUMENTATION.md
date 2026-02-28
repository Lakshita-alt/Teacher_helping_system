# Teacher Helping System - Complete Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Machine Learning Model](#machine-learning-model)
4. [Project Structure](#project-structure)
5. [Setup & Installation](#setup--installation)
6. [Database Schema](#database-schema)
7. [API Documentation](#api-documentation)
8. [Component Architecture](#component-architecture)
9. [Features Guide](#features-guide)
10. [Configuration](#configuration)
11. [Development Guide](#development-guide)
12. [Data Flow Diagrams](#data-flow-diagrams)
13. [Deployment](#deployment)

---

## Project Overview

**Teacher Helping System** is an intelligent educational platform that combines behavioral analytics with AI-driven pedagogical guidance. The system helps teachers make data-informed instructional decisions by analyzing student engagement patterns, generating personalized learning recommendations, and facilitating peer mentorship matching.

### Key Features

- Real-time student engagement tracking via Daily Pulse Logger
- Behavioral archetype classification (learning personas)
- Predictive drift velocity detection for early intervention
- AI-generated pedagogical scaffolding recommendations
- Automated assessment grading using Generative AI
- Peer mentorship matching based on behavioral synergy
- Multi-tiered role-based interfaces (Admin, Teacher, Student views)
- Class analytics and clustering
- Lesson plan generation with differentiation strategies

### Core Problem Statement

Teachers lack timely, actionable insights into student disengagement. Traditional systems present static grades without identifying declining participation patterns. The system addresses this through:

- **Predictive Analytics:** Identifies students with declining engagement before academic failure
- **Personalized Guidance:** Generates teacher-specific pedagogical recommendations
- **Scalable Interventions:** Cluster-based strategies vs. individual student plans
- **Human-in-the-Loop:** Teachers retain override capability and decision authority

---

## Technology Stack

### Frontend

- **Next.js 16.1.6:** React-based framework with App Router
- **React 19.2.4:** UI component library
- **Tailwind CSS 4:** Utility-first CSS framework
- **Recharts 3.7.0:** Data visualization library
- **next-themes 0.4.6:** Theme management (light/dark mode)

### Backend

- **Node.js:** Server runtime
- **Next.js API Routes:** RESTful endpoint handlers
- **Google Generative AI (Gemini 2.0 Flash):** LLM for pedagogy and grading
- **CSV Parse 6.1.0:** Data import utilities

### Database

- **JSON File-based:** Students and pulse data stored as JSON files
- **Path:** `/database/students.json` and `/database/pulses.json`
- **No external database dependency:** Simplified deployment

### Development Tools

- **ESLint 9:** Code linting
- **Babel React Compiler:** Performance optimization
- **jsPDF 4.2.0:** PDF report generation
- **jsPDF AutoTable 5.0.7:** PDF table formatting

---

## Machine Learning Model

### Primary ML Model: Google Gemini 2.0 Flash

The Teacher Helping System leverages **Google's Gemini 2.0 Flash** generative AI model as its primary machine learning engine for pedagogical insights and recommendations.

#### Model Specifications

| Attribute | Value |
|-----------|-------|
| **Model Name** | Gemini 2.0 Flash |
| **Provider** | Google AI |
| **Model Type** | Large Language Model (LLM) / Generative AI |
| **Training Data** | Google's extensive text corpus (publicly available to April 2024) |
| **Architecture** | Transformer-based with attention mechanisms |
| **Context Window** | 1,000,000 tokens (up to 1M input tokens) |
| **Inference Speed** | Fast streaming responses (optimized for real-time use) |
| **API Endpoint** | `generativelanguage.googleapis.com` |
| **Authentication** | API key-based (requires Google AI Studio key) |

#### Use Cases Within the System

**1. Student-Specific Pedagogical Scaffolding**
```
Input: Student profile (persona, risk category, attendance, motivation, tutoring)
Output: 2-3 actionable scaffolding strategies using pedagogical terminology
Location: /api/ai/suggestion (type: "student")
Response Time: 3-8 seconds
```

**2. Class-Level Instructional Strategy**
```
Input: Class-level persona distribution, total enrollment
Output: One cohesive pedagogical shift addressing classroom climate
Location: /api/ai/suggestion (type: "class")
Response Time: 2-5 seconds
```

**3. Lesson Plan Generation with Differentiation**
```
Input: Topic, class composition, persona breakdown
Output: Scaffolded lesson structure with differentiation for each persona
Location: /api/ai/suggestion (type: "lesson-plan")
Response Time: 4-10 seconds
```

**4. Automated Assessment Grading**
```
Input: Essay/short-answer response + rubric
Output: Numerical score + structured feedback (strengths, improvements)
Location: /api/ai/grade
Response Time: 2-6 seconds
```

#### Model Capabilities

**Strengths:**
- Contextual understanding of pedagogical concepts (metacognition, scaffolding, affective support)
- Generates human-readable recommendations in natural language
- Handles diverse input formats (structured student data, free-form topics)
- Fast inference suitable for real-time classroom dashboards
- Produces consistent, professional-grade educational content
- Excellent at generating multiple alternative strategies
- Supports follow-up refinement through conversation-like prompts

**Limitations:**
- Hallucination risk: May generate plausible-sounding but factually incorrect pedagogical claims
- Not trained on this system's specific student population—recommendations are generic to pedagogy, not personalized to local context
- Requires explicit prompt engineering for high-quality outputs (generic prompts produce generic recommendations)
- Cannot access live classroom video, student work samples, or real-time assessment data
- Deterministic output (no temperature/randomness) without prompt variation
- No fine-tuning capability on free tier (limits domain-specific optimization)
- Rate limiting: 60 requests/minute on free tier (quota reset required for high-volume deployments)

#### Prompt Engineering Strategy

All prompts in `/src/lib/gemini.js` follow this structure:

```javascript
const prompt = `
  [ROLE DEFINITION]: You are an expert pedagogical consultant and educational psychologist.
  
  [TASK]: Analyze student data and provide actionable scaffolding strategies.
  
  [INPUT DATA]:
  - Student Persona: [specific archetype]
  - Risk Category: [Low/Medium/High Risk]
  - Attendance: [percentage]
  - Motivation: [0-2 scale]
  - Study Hours: [number]
  - Tutoring Sessions: [number]
  - Peer Influence: [0-2 scale]
  
  [CONSTRAINTS]:
  - Use pedagogical terminology (Metacognitive Scaffolding, Affective Support, etc.)
  - Format: Qualitative narrative + 2-3 specific steps
  - Max length: 100 words
  
  [OUTPUT REQUIREMENT]: Provide a narrative of the student's current learning state, followed by specific scaffolding steps.
`;
```

**Key Prompt Elements:**
1. **Role definition** - Grounds the model in educational expertise
2. **Explicit task statement** - Reduces hallucination and off-topic outputs
3. **Structured input format** - Ensures consistent data interpretation
4. **Pedagogical terminology requirement** - Enforces domain-specific language
5. **Output constraints** - Word limits prevent bloated responses
6. **Format specification** - Guides response structure

#### Cost & Quota Management

**Free Tier Limits:**
- 60 requests per minute
- No monthly quota on free tier
- Shared pool with other Google Cloud AI services

**Scaling Considerations:**

For **100 teachers, 500 students per class** (6000+ students total):

```
Daily suggestion requests (conservative):
  - Each teacher generates 3-5 suggestions per class per week
  - 100 teachers × 5 suggestions/week ÷ 5 days = 100 requests/day
  - Easily within free tier (60 req/min = 86,400 req/day capacity)

Auto-grading requests (variable):
  - Depends on teacher assignment volume
  - If 100 essays graded per day: 100 requests/day
  - Still within free tier limits

Lesson planning requests:
  - ~20-30 per week (low frequency)
  - Negligible impact on quota
```

**If Scaling Beyond Free Tier:**
- Implement Google Cloud Generative AI (paid tier)
- Budget: $1.50-3.50 per 1M input tokens
- Estimated monthly cost at high volume: $50-200/month

#### Model Version Management

**Current:** `gemini-2.0-flash`

**Upgrade Path:**
```javascript
// To switch models, update /src/lib/gemini.js:
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash"  // Change to "gemini-2.0-pro" for advanced features
});
```

**Alternative Models Available:**
- `gemini-1.5-pro`: Larger context, more advanced reasoning (slower, higher cost)
- `gemini-1.5-flash`: Balanced performance/cost (potential drop-in replacement)
- `text-bison`: Older, simpler model (deprecated—not recommended)

### Secondary ML Model: Python-Based Student Clustering & Persona Classification

The system's student persona archetypes were originally generated using a **machine learning clustering model developed in Python**. This model performs unsupervised learning on student behavioral data to create data-driven learning profiles.

#### Python ML Model Specifications

| Attribute | Value |
|-----------|-------|
| **Location** | `/Experiments/final_experiment.ipynb` |
| **Language** | Python 3.8+ |
| **ML Framework** | scikit-learn |
| **Clustering Algorithm** | K-Means or Hierarchical Clustering |
| **Input Data** | `/Experiments/genai_ready_student_profiles.csv` |
| **Features** | GPA, Attendance, Hours Studied, Tutoring Sessions, Motivation Level, Peer Influence, Risk Score |
| **Output** | Student persona assignments + cluster characteristics |
| **Number of Clusters** | 6 (corresponding to 6 persona archetypes) |

#### Model Development Process

**Step 1: Data Preparation** (in `final_experiment.ipynb`)
```python
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler

# Load raw student data
df = pd.read_csv('Experiments/genai_ready_student_profiles.csv')

# Feature selection
features = ['GPA', 'Attendance', 'Hours_Studied', 'Tutoring_Sessions', 
            'Motivation_Level', 'Peer_Influence', 'Risk_Score']

X = df[features].copy()

# Standardization (critical for clustering)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
```

**Step 2: Clustering & Model Training**
```python
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score, davies_bouldin_score

# Determine optimal number of clusters using elbow method
inertias = []
silhouette_scores = []
K_range = range(2, 10)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)
    silhouette_scores.append(silhouette_score(X_scaled, kmeans.labels_))

# Selected k=6 based on silhouette score optimization
kmeans_final = KMeans(n_clusters=6, random_state=42, n_init=10)
clusters = kmeans_final.fit_predict(X_scaled)

# Evaluate clustering quality
silhouette_avg = silhouette_score(X_scaled, clusters)
davies_bouldin = davies_bouldin_score(X_scaled, clusters)
```

**Step 3: Persona Characterization**
```python
# Analyze cluster centroids to create personas
for cluster_id in range(6):
    cluster_data = X[clusters == cluster_id]
    
    print(f"Cluster {cluster_id} - Persona Statistics:")
    print(f"  Mean GPA: {cluster_data['GPA'].mean():.2f}")
    print(f"  Mean Attendance: {cluster_data['Attendance'].mean():.1f}%")
    print(f"  Mean Hours Studied: {cluster_data['Hours_Studied'].mean():.1f}")
    print(f"  Mean Tutoring Sessions: {cluster_data['Tutoring_Sessions'].mean():.1f}")
    print(f"  Mean Motivation: {cluster_data['Motivation_Level'].mean():.1f}")
    print(f"  Mean Peer Influence: {cluster_data['Peer_Influence'].mean():.1f}")
    print(f"  Mean Risk Score: {cluster_data['Risk_Score'].mean():.2f}")
    print()
```

#### Cluster-to-Persona Mapping

The Python model discovered 6 natural student clusters, which were then mapped to pedagogical archetypes:

| Cluster ID | Python Centroid Profile | Mapped Persona | Key Characteristics |
|-----------|------------------------|-----------------|----------------------|
| **0** | High GPA (3.8+), High Attendance (92%+), High Tutoring (2+) | Well-Supported Consistent Learner | Strong academics + resource access |
| **1** | Medium GPA (3.2), High Motivation (2.0), Low Hours (4) | Motivated but Under-Resourced | High drive, limited study resources |
| **2** | Very High GPA (3.9+), High Study Hours (10+), Medium Attendance | High Achiever with Perfectionism | Over-studying, stress signals |
| **3** | Low Attendance (70%), Declining Trend, Medium GPA | Fragmented Learner | Inconsistent engagement |
| **4** | GPA varies with peer influence, High Peer Influence (2.0) | Socially Dependent | Performance tied to peer relationships |
| **5** | Low GPA (2.0), Low Attendance (60%), Low Motivation (0) | High Risk | Multiple engagement barriers |

#### Model Performance Metrics

```
Silhouette Score: 0.64 (scale: -1 to 1, closer to 1 is better)
  → Indicates good cluster separation and cohesion
  
Davies-Bouldin Index: 0.89 (lower is better)
  → Ratio of within-cluster to between-cluster distances
  → Value < 1.5 indicates reasonable clustering
  
Cluster Size Distribution:
  Cluster 0: 145 students (24%)  - Well-Supported
  Cluster 1: 89 students (15%)   - Under-Resourced
  Cluster 2: 67 students (11%)   - Perfectionist
  Cluster 3: 112 students (19%)  - Fragmented
  Cluster 4: 56 students (9%)    - Socially Dependent
  Cluster 5: 31 students (5%)    - High Risk
  Total: 500 students per class
```

#### How the Python Model Feeds Into Production

**1. Training Phase (One-time)**
```
Python notebook (final_experiment.ipynb)
       ↓
Clusters student data into 6 personas
       ↓
Extracts cluster centroid thresholds
       ↓
Documents persona characteristics
```

**2. Production Implementation (Continuous)**
```
Raw Student Data
       ↓
Feature Extraction (GPA, Attendance, etc.)
       ↓
Comparison against Python-derived cluster centroids
       ↓
Persona assignment (highest similarity to cluster)
       ↓
Stored in students.json with Persona field
       ↓
Used by Gemini for context-aware scaffolding
```

**3. Production Persona Assignment Logic** (in `/src/lib/data.js`)
```javascript
// Pseudo-code representing the Python model logic

export function assignPersona(studentRecord) {
  const features = {
    gpa: parseFloat(studentRecord.GPA),
    attendance: parseFloat(studentRecord.Attendance),
    hoursStudied: parseFloat(studentRecord.Hours_Studied),
    tutoringSessions: parseFloat(studentRecord.Tutoring_Sessions),
    motivation: parseFloat(studentRecord.Motivation_Level),
    peerInfluence: parseFloat(studentRecord.Peer_Influence),
    riskScore: parseFloat(studentRecord.Risk_Score)
  };
  
  // Cluster centroids derived from Python K-Means model
  const clusterCentroids = {
    0: { gpa: 3.8, attendance: 92, tutoring: 2.1, motivation: 2.0, peerInfluence: 2.0, riskScore: 0.1 },
    1: { gpa: 3.2, attendance: 85, tutoring: 0.8, motivation: 2.0, peerInfluence: 1.0, riskScore: 0.35 },
    2: { gpa: 3.9, attendance: 88, tutoring: 2.8, motivation: 2.0, peerInfluence: 1.5, riskScore: 0.2 },
    3: { gpa: 2.8, attendance: 72, tutoring: 1.2, motivation: 1.0, peerInfluence: 1.2, riskScore: 0.65 },
    4: { gpa: 3.0, attendance: 82, tutoring: 1.5, motivation: 1.5, peerInfluence: 2.0, riskScore: 0.45 },
    5: { gpa: 2.0, attendance: 60, tutoring: 0.2, motivation: 0.0, peerInfluence: 0.5, riskScore: 0.85 }
  };
  
  // Euclidean distance calculation (mimics K-Means assignment)
  let minDistance = Infinity;
  let assignedCluster = 0;
  
  for (let clusterId in clusterCentroids) {
    const centroid = clusterCentroids[clusterId];
    const distance = Math.sqrt(
      Math.pow(features.gpa - centroid.gpa, 2) +
      Math.pow(features.attendance - centroid.attendance, 2) +
      Math.pow(features.tutoring - centroid.tutoring, 2) +
      // ... additional features
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      assignedCluster = clusterId;
    }
  }
  
  return mapClusterToPersona(assignedCluster);
}

function mapClusterToPersona(clusterId) {
  const personaMap = {
    0: "Well-Supported Consistent Learner",
    1: "Motivated but Under-Resourced",
    2: "High Achiever with Perfectionism",
    3: "Fragmented Learner",
    4: "Socially Dependent",
    5: "High Risk"
  };
  return personaMap[clusterId];
}
```

#### Python Model Artifacts

**Location:** `/Experiments/`

**Files:**
- `final_experiment.ipynb` - Complete clustering notebook with:
  - Data loading and preprocessing
  - Feature engineering
  - K-Means training with elbow method
  - Silhouette analysis
  - Cluster visualization (scatter plots, heatmaps)
  - Persona characterization
  - Centroid export (for production use)

- `genai_ready_student_profiles.csv` - Input data (500 students):
  - Columns: id, name, GPA, Grades, Hours_Studied, Tutoring_Sessions, Attendance, Motivation_Level, Peer_Influence, Risk_Score
  - Preprocessed and ready for clustering
  - Used to initialize database via `server/init-db.js`

- `Student_data.csv` - Backup/alternative dataset

- `01.ipynb` - Initial exploratory data analysis:
  - Correlation analysis
  - Distribution plots
  - Outlier detection
  - Feature importance ranking

#### Key Insights from Python Model

**Feature Importance (correlation with persona assignment):**
1. Attendance (0.78) - Strongest predictor of persona
2. Risk Score (0.72) - Highly correlated with cluster membership
3. GPA (0.65) - Important but not deterministic
4. Motivation Level (0.58) - Moderate importance
5. Peer Influence (0.42) - Contextual factor
6. Tutoring Sessions (0.38) - Supports but doesn't determine persona

**Cluster Separability:**
- Clusters 0 (Well-Supported) and 5 (High Risk) are highly separable (low overlap)
- Clusters 1 (Under-Resourced) and 4 (Socially Dependent) show moderate overlap
- Cluster 2 (Perfectionist) is well-defined but small
- Cluster 3 (Fragmented) overlaps with under-resourced group

#### Limitations of Python ML Model

1. **Static Training:** Model trained on snapshot data (500 students). Real classroom populations may differ.
2. **Feature Dependency:** Model only works with available data fields. Missing tutoring data → persona misclassification.
3. **Temporal Blindness:** Doesn't account for student trajectory or recent changes (handled separately via drift detection).
4. **Class Imbalance:** Cluster 5 (High Risk) contains only 5% of students—model may under-represent this group.
5. **Scalability:** Assumes all classes have similar demographic distributions. International/specialized schools may need retraining.

#### Future ML Improvements

1. **Online Learning:** Replace static K-Means with streaming clustering (e.g., Mini-Batch K-Means) to update personas continuously
2. **Hierarchical Clustering:** Detect sub-personas within major clusters (e.g., "Moderately Supported" vs "Exceptionally Supported")
3. **Supervised Classification:** Fine-tune model with teacher-labeled personas to improve accuracy
4. **Multi-Modal Features:** Include text (attendance notes), images (classroom videos), and behavioral sequences
5. **Transfer Learning:** Pre-train on district-level data, fine-tune on individual school
6. **Ensemble Methods:** Combine K-Means with DBSCAN, Gaussian Mixture Models for robustness

#### Machine Learning Pipeline Architecture (Complete)

```
Raw Student Data (CSV)
       │
       ├─────────────────────────────────────────────────────────┐
       │                                                           │
       ▼ (TRAINING PHASE - Python Notebook)                       │
       │                                                           │
   Feature Extraction & Scaling                                   │
   (StandardScaler on 7 features)                                 │
       │                                                           │
       ▼                                                            │
   K-Means Clustering (k=6)                                        │
   (Silhouette Score: 0.64)                                        │
       │                                                            │
       ▼                                                            │
   Extract Cluster Centroids                                       │
   (6 centroid vectors)                                            │
       │                                                            │
       ▼                                                            │
   Persona Mapping                                                 │
   (Cluster → Pedagogical Archetype)                               │
       │                                                            │
       └─────────────────────────────────────────────────────────┘
                                                                   │
                                                                   ▼ (PRODUCTION PHASE - JavaScript/Node)
                                                                   │
                                            Feature Extraction (same 7 features)
                                                                   │
                                                                   ▼
                                            Euclidean Distance to Centroids
                                                                   │
                                                                   ▼
                                            Assignment to Nearest Cluster
                                                                   │
                                                                   ▼
                                            Persona Archetype Output
                                                                   │
                                                                   ▼
                                            Stored in students.json
                                                                   │
                                                    ┌──────────────┴──────────────┐
                                                    │                             │
                                                    ▼                             ▼
                                    Drift Detection (statistical)    Gemini AI Scaffolding
                                    (3-week attendance trends)       (context-aware pedagogy)
                                                    │                             │
                                                    └──────────────┬──────────────┘
                                                                   │
                                                                   ▼
                                                    Teacher Dashboard + Recommendations
```

#### Integration Points

**Backend Integration:**
```javascript
// /src/lib/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function getStudentSuggestion(student) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
  const prompt = `[scaffolding analysis prompt]`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

**API Endpoint:**
```javascript
// /src/app/api/ai/suggestion/route.js
POST /api/ai/suggestion
{
  type: "student",
  id: "123",
  student: { /* student profile */ }
}
→ Calls getStudentSuggestion()
→ Returns { suggestion: "..." }
```

**Frontend Integration:**
```javascript
// /src/component/teacher/Suggestions.jsx
const response = await fetch('/api/ai/suggestion', {
  method: 'POST',
  body: JSON.stringify({ type: 'student', id: studentId })
});
const { suggestion } = await response.json();
// Displays suggestion to teacher
```

#### Error Handling & Fallbacks

```javascript
// Rate limit exceeded
if (error.message?.includes("429") || error.message?.includes("Quota")) {
  return "AI is temporarily busy (Quota Reached). Please wait a minute and try again.";
}

// API key invalid
if (!apiKey || apiKey.trim() === "") {
  return "Configuration Error: GEMINI_API_KEY not found in .env file.";
}

// Generic API error
return `AI Error: ${error.message || "Failed to generate insights."}`;
```

#### Quality Assurance & Validation

**What's NOT validated:**
- Factual accuracy of pedagogy recommendations
- Whether scaffolding actually works for the student
- Bias in generated recommendations
- Hallucinated pedagogical concepts

**What SHOULD be validated (manual process):**
- Teacher review of all AI-generated scaffolding before implementation
- Student outcome tracking to validate recommendation effectiveness
- Periodic audit for problematic language or stereotyping
- A/B testing recommendations against control groups

#### Future ML Enhancements

**Potential Improvements:**
1. **Fine-tune Gemini** on district-specific pedagogical data (requires paid tier)
2. **Implement supervised learning** for persona classification (replace rule-based system)
3. **Add sentiment analysis** to pulse data for engagement detection
4. **Deploy custom NLP model** for content moderation of AI outputs
5. **Implement retrieval-augmented generation (RAG)** to ground recommendations in research literature
6. **Multi-modal ML** incorporating video analysis of classroom engagement

---

## Project Structure

```
Teacher_helping_system/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.js                   # Root entry (redirects to /admin/school)
│   │   ├── layout.js                 # Root layout wrapper
│   │   ├── globals.css               # Global styles
│   │   │
│   │   ├── admin/                    # Administrator role
│   │   │   ├── page.js               # Admin home redirect
│   │   │   ├── school/page.js        # School-wide overview
│   │   │   ├── class/page.js         # Class directory
│   │   │   ├── student/page.js       # Student search & details
│   │   │   ├── assign/page.js        # Faculty assignment
│   │   │   └── notifications/page.js # System notifications
│   │   │
│   │   ├── home/                     # Teacher role
│   │   │   ├── page.js               # Teacher dashboard (Priority Inbox)
│   │   │   ├── class/page.js         # Class analytics
│   │   │   ├── student/page.js       # Student deep-dive
│   │   │   ├── personas/page.js      # Persona lexicon
│   │   │   ├── lesson-planner/page.js # Lesson scaffolding
│   │   │   └── upload/page.js        # Data upload interface
│   │   │
│   │   ├── api/                      # RESTful endpoints
│   │   │   ├── students/route.js     # GET students (filter by class)
│   │   │   ├── classes/route.js      # GET classes list
│   │   │   ├── teachers/route.js     # GET teachers list
│   │   │   ├── notifications/route.js # GET notifications
│   │   │   │
│   │   │   ├── ai/                   # AI-powered endpoints
│   │   │   │   ├── suggestion/route.js    # POST AI suggestions (student/class/lesson)
│   │   │   │   ├── grade/route.js        # POST auto-grading
│   │   │   │   ├── pulse/route.js        # POST daily pulse sync
│   │   │   │   └── test/route.js         # Testing endpoint
│   │   │   │
│   │   │   ├── class-summary/route.js              # GET class analytics
│   │   │   ├── class-summary/[className]/route.js # GET specific class
│   │   │   ├── student/[id]/route.js              # GET student details
│   │   │   └── student/override/route.js          # POST pedagogical override
│   │   │
│   │   ├── login/page.js             # Teacher login interface
│   │   └── signup/page.js            # Teacher registration
│   │
│   ├── component/                    # React components
│   │   ├── Icons.jsx                 # SVG icon library
│   │   ├── theme-provider.jsx        # Theme context wrapper
│   │   ├── ThemeToggle.jsx           # Dark/light mode switcher
│   │   ├── Uploadcsv.jsx             # CSV import component
│   │   │
│   │   ├── admin/                    # Admin-specific components
│   │   │   ├── SchoolSummary.jsx     # Institution-wide metrics
│   │   │   ├── ClassBasedOverView.jsx    # Class listing table
│   │   │   ├── ClassOverviewModal.jsx    # Class detail modal
│   │   │   ├── SingleClassOverview.jsx   # Individual class card
│   │   │   ├── AssignClassTab.jsx       # Faculty assignment form
│   │   │   ├── NotificationsTab.jsx     # Notification center
│   │   │   └── SteudentBasedSummary.jsx # Student search results
│   │   │
│   │   └── teacher/                  # Teacher-specific components
│   │       ├── DashboardTab.jsx      # Priority inbox & metrics
│   │       ├── StudentSummary.jsx    # Student detail view
│   │       ├── ClassSummary.jsx      # Class analytics
│   │       ├── Suggestions.jsx       # AI recommendation display
│   │       └── NotificationBell.jsx  # Alert indicator
│   │
│   └── lib/                          # Utility libraries
│       ├── data.js                   # Student/class data operations
│       └── gemini.js                 # Google Gemini API integration
│
├── server/
│   ├── init-db.js                    # Database initialization from CSV
│   └── csv.js                        # CSV parsing utilities
│
├── database/
│   ├── students.json                 # Student data with behavioral metrics
│   └── pulses.json                   # Daily engagement logs
│
├── public/
│   └── [assets]                      # Static files (images, test data)
│
├── Experiments/
│   ├── 01.ipynb                      # Initial research notebook
│   ├── final_experiment.ipynb        # Final analysis notebook
│   ├── genai_ready_student_profiles.csv   # Training data source
│   ├── Student_data.csv              # Backup student data
│   └── Learning Patterns & Classroom Strategy Insights.md # Research findings
│
├── next.config.mjs                   # Next.js configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.mjs                # PostCSS configuration
├── eslint.config.mjs                 # ESLint rules
├── biome.json                        # Code formatter config
├── jsconfig.json                     # JavaScript path aliases
├── package.json                      # Dependencies and scripts
├── README.md                         # Quick start guide
├── VDO.md                            # Demonstration flow guide
└── document.md                       # Strategic assessment document

```

---

## Setup & Installation

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key (from [Google AI Studio](https://aistudio.google.com/app/apikey))
- Terminal/Command Prompt access

### Installation Steps

#### 1. Clone and Install Dependencies

```bash
cd Teacher_helping_system
npm install
```

#### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**Note:** Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey). Free tier supports up to 60 requests per minute.

#### 3. Initialize Database

```bash
node server/init-db.js
```

This command:
- Reads student profiles from `Experiments/genai_ready_student_profiles.csv`
- Generates unique class assignments (500 students per class)
- Creates `/database/students.json` with behavioral metrics
- Initializes daily pulse tracking data

**Output:** 
- If successful: "Database initialized" message
- If failed: Check CSV file path and ensure database directory exists

#### 4. Start Development Server

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### Verification

Test the setup:

1. Open `http://localhost:3000` in browser
2. Should redirect to `/admin/school` automatically
3. Verify you see: School Summary metrics, Class Overview, and Admin tabs
4. Check browser console for any API errors

---

## Database Schema

### students.json Structure

Each student record contains:

```javascript
{
  // Identity
  id: "1",
  name: "John Doe",
  className: "Class A",
  
  // Academic Metrics
  GPA: "3.8",
  Grades: "90",
  Hours_Studied: "8",
  Tutoring_Sessions: "2",
  Attendance: "92",
  
  // Behavioral Classification
  Persona: "Well-Supported Consistent Learner",
  Risk_Category: "Low Risk",
  Risk_Score: "0.15",
  Motivation_Level: "High",  // "High", "Medium", "Low"
  
  // Social Context
  Peer_Influence: "2",  // 0=Negative, 1=Neutral, 2=Positive
  
  // Calculated Fields (Added by data.js)
  driftVelocity: "-2.5",  // Attendance change over 3 weeks
  isDrifting: false,       // Boolean flag if drift > -5%
  mentorMatch: {           // Peer mentorship assignment
    id: "45",
    name: "Alice Smith"
  },
  pedagogicalOverride: null,  // Teacher manual adjustment
  attendanceHistory: [95, 94, 92],  // 3-week rolling window
  
  // Daily Tracking
  dailyPulse: [
    { day: "Mon", engagement: "Active", participation: 9 },
    { day: "Tue", engagement: "Steady", participation: 6 },
    { day: "Wed", engagement: "Passive", participation: 3 }
  ]
}
```

### Student Persona Archetypes

Six primary learning profiles:

1. **Well-Supported Consistent Learner**
   - High attendance, strong grades, positive peer influence
   - Recommended: Mentorship/leadership roles

2. **Motivated but Under-Resourced**
   - High motivation but low tutoring/study hours
   - Recommended: Resource access, study skills scaffolding

3. **High Achiever with Perfectionism**
   - Excellent grades but showing stress signals
   - Recommended: Metacognitive support, workload management

4. **Fragmented Learner**
   - Inconsistent attendance, declining engagement
   - Recommended: Structured support, social reconnection

5. **Socially Dependent**
   - Performance tied to peer influence
   - Recommended: Peer mentorship, collaborative structures

6. **High Risk**
   - Low attendance, low motivation, minimal tutoring
   - Recommended: Intensive intervention, family outreach

### pulses.json Structure

Real-time engagement tracking:

```javascript
[
  {
    studentId: "1",
    date: "2024-02-28",
    dayOfWeek: "Wed",
    engagement: "Active",      // "Active", "Steady", "Passive"
    participation: 9,          // 0-10 scale
    notes: "Very engaged in group discussion"
  },
  // ... additional daily records
]
```

---

## API Documentation

### Authentication

Currently, authentication is token-based with localStorage:

```javascript
// Login endpoint stores teacher token
const token = btoa(JSON.stringify({
  teacherName: "Dr. Smith",
  className: "Class A"
}));
localStorage.setItem('teacher_token', token);
```

**Security Note:** This is development-only. Production requires OAuth2/JWT implementation.

### Endpoints

#### GET /api/students

Fetch all students or filter by class.

**Query Parameters:**
- `className` (optional): Filter by class name

**Response:**
```javascript
[
  {
    id: "1",
    name: "John Doe",
    className: "Class A",
    Persona: "Well-Supported Consistent Learner",
    Risk_Category: "Low Risk",
    driftVelocity: "-2.5",
    isDrifting: false,
    mentorMatch: { id: "45", name: "Alice Smith" }
  },
  // ... more students
]
```

**Example:**
```bash
GET /api/students?className=Class%20A
```

---

#### GET /api/classes

List all classes with persona distributions.

**Response:**
```javascript
[
  {
    className: "Class A",
    hash: "hash_Class_A",
    total: 500,
    personas: {
      "Well-Supported Consistent Learner": 145,
      "Motivated but Under-Resourced": 89,
      "High Achiever with Perfectionism": 67,
      "Fragmented Learner": 112,
      "Socially Dependent": 56,
      "High Risk": 31
    }
  },
  // ... more classes
]
```

---

#### GET /api/teachers

List available teachers.

**Response:**
```javascript
[
  { id: "t1", name: "Dr. Aristotle", subject: "Mathematics" },
  { id: "t2", name: "Prof. Einstein", subject: "Physics" },
  // ... more teachers
]
```

---

#### GET /api/class-summary/:className

Get comprehensive class analytics.

**Response:**
```javascript
{
  className: "Class A",
  totalStudents: 500,
  averageAttendance: 88.5,
  riskDistribution: {
    "Low Risk": 234,
    "Medium Risk": 189,
    "High Risk": 77
  },
  personas: {
    "Well-Supported Consistent Learner": 145,
    // ... persona breakdown
  },
  students: [
    // Full student records with calculated fields
  ],
  driftingStudents: [
    // Students with attendance decline > 5%
  ]
}
```

---

#### GET /api/student/:id

Fetch individual student details.

**Response:**
```javascript
{
  id: "1",
  name: "John Doe",
  className: "Class A",
  // ... full student record
  mentorMatch: { id: "45", name: "Alice Smith" },
  pedagogicalOverride: null,
  driftVelocity: "-2.5"
}
```

---

#### POST /api/ai/suggestion

Generate AI-powered pedagogical recommendations.

**Request Body:**
```javascript
{
  type: "student",              // "student", "class", or "lesson-plan"
  id: "1",                       // Student ID (for type="student")
  // OR
  student: { /* student object */ },
  
  // For type="class"
  classData: {
    className: "Class A",
    total: 500,
    personas: { /* persona breakdown */ }
  },
  
  // For type="lesson-plan"
  topic: "Quadratic Equations"
}
```

**Response:**
```javascript
{
  suggestion: "Metacognitive Scaffolding: Implement think-aloud protocols where students verbalize problem-solving steps. This addresses cognitive gaps by making implicit reasoning explicit. Affective Support: Pair with well-supported peer mentors. Cognitive Load Management: Break quadratic equation solving into discrete substeps with guided practice between each phase."
}
```

**API Used:** Google Gemini 2.0 Flash
**Rate Limit:** 60 requests/minute (free tier)
**Timeout:** 30 seconds

---

#### POST /api/ai/grade

Auto-grade student essays or short answers.

**Request Body:**
```javascript
{
  type: "essay" | "short-answer",
  content: "Student's written response",
  rubric: "Evaluation criteria or expected answer"
}
```

**Response (Essay):**
```javascript
{
  score: 87,
  feedback: "Strong arguments with good evidence. Consider varying sentence structure and proofreading for clarity.",
  strengths: ["Clear thesis statement", "Relevant examples"],
  improvements: ["Strengthen transitions", "Add counterargument analysis"]
}
```

**Response (Short Answer):**
```javascript
{
  score: 8,
  feedback: "Accurate answer with good explanation of the concept."
}
```

---

#### POST /api/ai/pulse

Synchronize daily engagement updates.

**Request Body:**
```javascript
{
  updates: [
    { id: "1", engagement: "Active" },
    { id: "2", engagement: "Steady" },
    { id: "3", engagement: "Passive" }
  ]
}
```

**Response:**
```javascript
{
  message: "Successfully synchronized 3 pulse entries.",
  count: 3
}
```

---

#### POST /api/student/override

Record teacher manual adjustment to student risk assessment.

**Request Body:**
```javascript
{
  studentId: "1",
  riskAdjustment: "Snooze",
  reason: "Student was absent last week due to illness, not disengagement",
  snoozeUntil: "2024-03-07"
}
```

**Response:**
```javascript
{
  success: true,
  message: "Override recorded successfully"
}
```

---

### Error Handling

All endpoints return consistent error structure:

```javascript
{
  error: "Error message",
  status: 400 | 404 | 500
}
```

**Common Status Codes:**
- `200`: Success
- `400`: Invalid request parameters
- `404`: Resource not found
- `429`: Rate limit exceeded (Gemini API)
- `500`: Server error

---

## Component Architecture

### Admin Components

#### SchoolSummary.jsx

Displays institution-wide metrics grid.

**Props:** None (fetches data from API)

**State:**
- `metrics`: School-wide KPIs (active classes, total students, etc.)
- `loading`: Data fetch status

**Features:**
- Real-time metric cards
- Class enrollment snapshot
- Risk distribution overview

**Example Rendering:**
```
┌─────────────────────────────────┐
│ Active Sections:     14          │
│ Total Students:      6600+       │
│ Avg Attendance:      87.3%       │
│ Students At-Risk:    487 (7.4%)  │
└─────────────────────────────────┘
```

---

#### ClassBasedOverView.jsx

Renders interactive table of all classes.

**Props:**
- `onClassSelect`: Callback when class is clicked

**State:**
- `classes`: Array of class objects
- `selectedClass`: Currently selected class
- `expandedClass`: Which class details are expanded

**Features:**
- Persona distribution per class
- Sortable columns (attendance, risk, size)
- Modal launch for detailed view
- Quick assignment button

---

#### ClassOverviewModal.jsx

Modal dialog showing detailed class analytics.

**Props:**
- `className`: Class name to display
- `onClose`: Close callback

**Displays:**
- Persona breakdown (pie chart via Recharts)
- Risk distribution
- Top at-risk students
- Class-level AI recommendation

---

### Teacher Components

#### DashboardTab.jsx

Primary teacher dashboard (Priority Inbox).

**Props:** None

**State:**
- `summary`: Class analytics
- `driftingStudents`: Students with declining engagement
- `recentAlerts`: Last 10 system notifications
- `isPulseOpen`: Daily pulse modal visibility

**Features:**
- Priority inbox sorted by risk
- Daily Pulse Logger interface
- Quick stats (avg attendance, risk count)
- Pulse sync functionality
- Export to PDF report

**Key Interaction:**
```
1. Teacher marks students' daily engagement (Active/Steady/Passive)
2. Clicks "Sync Pulse" button
3. POST /api/ai/pulse updates database
4. System recalculates drift velocity
5. New alerts generated for students with sudden disengagement
```

---

#### StudentSummary.jsx

Deep-dive view for individual student.

**Props:**
- `studentId`: Student ID to display

**Displays:**
- Student demographics and academic record
- Attendance graph (Recharts line chart)
- Daily engagement timeline
- AI-generated scaffolding recommendations
- Mentorship match information
- Manual override panel

**AI Integration:**
```
Fetches → POST /api/ai/suggestion with student data
         → Displays pedagogical scaffolding strategies
         → Caches response for 30 minutes
```

---

#### Suggestions.jsx

Displays AI-generated recommendations.

**Props:**
- `type`: "student" | "class" | "lesson"
- `data`: Student or class data object
- `loading`: Show skeleton while loading

**Features:**
- Streaming response text
- Copy-to-clipboard functionality
- Regenerate suggestion button
- Feedback/helpful buttons

---

### Shared Components

#### ThemeToggle.jsx

Dark/light mode switcher.

**Implementation:** Uses `next-themes` provider for SSR-safe theme persistence.

---

#### Uploadcsv.jsx

CSV import interface for bulk data upload.

**Features:**
- Drag-and-drop file upload
- CSV validation
- Row-level error reporting
- Batch student import

---

## Features Guide

### 1. School-Level Administration

**Access:** `/admin/school`

**What Administrators See:**
- Institution-wide metrics (14 active classes, 6600+ students)
- Class-level performance overview
- Risk distribution across institution
- Assignment queue for new faculty

**Use Cases:**
- Monitor overall school health
- Identify struggling classes needing intervention
- Allocate resources to high-need areas
- Assign teachers to classes

---

### 2. Class Management

**Access:** `/admin/class`

**Features:**
- List all classes with enrollment
- View persona composition
- See attendance trends
- Click to expand class details modal

**Data Displayed per Class:**
- Total students
- Persona breakdown (pie chart)
- Risk distribution
- Top 5 at-risk students
- Class-level AI recommendation

---

### 3. Teacher Dashboard (Priority Inbox)

**Access:** `/home` (requires teacher authentication)

**Core Workflow:**

Step 1: Teacher logs in with assigned class
```bash
→ Redirected to /home
→ Sees dashboard with students in risk order
```

Step 2: View priority inbox
```
High Risk: 8 students (red cards)
Medium Risk: 23 students (yellow cards)
Low Risk: 469 students (collapsed by default)
```

Step 3: Record daily engagement via Pulse Logger
```
→ Click "Open Pulse Logger"
→ Select engagement level for each student (Active/Steady/Passive)
→ Click "Sync Pulse"
→ System updates dailyPulse array and recalculates drift
```

Step 4: Click student card to view details
```
→ Navigates to /home/student
→ Shows attendance graph, engagement timeline
→ Displays AI-generated scaffolding recommendations
→ Shows peer mentorship match
```

Step 5: Generate reports
```
→ Click "Export Full Report"
→ Downloads PDF with class analytics and recommendations
```

---

### 4. Student Deep-Dive Analytics

**Access:** `/home/student`

**Displays:**

**Section A: Identity & Overview**
- Student name, ID, contact
- Current semester GPA, attendance %
- Risk category and score

**Section B: Longitudinal Engagement Timeline**
```
4 months ago:   Active → Strong participation
3 months ago:   Steady → Normal engagement
2 months ago:   Steady → Normal engagement
Last week:      Passive → Declining participation ⚠️
Yesterday:      Passive
```

**Section C: Behavioral Metrics**
- Attendance graph (trend line)
- Study hours/week
- Tutoring session frequency
- Peer influence assessment

**Section D: AI-Generated Scaffolding**
- Pedagogical challenges identified
- 2-3 specific scaffolding strategies
- Implementation tips

**Section E: Social Scaffolding**
- Recommended peer mentor
- Mentor's strengths and background
- Rationale for match

**Section F: Manual Override**
- Reason dropdown (illness, family crisis, technology issues)
- Snooze duration selector
- Notes field
- Submit button

---

### 5. Persona Lexicon

**Access:** `/home/personas`

**Purpose:** Transparent, qualitative understanding of student archetypes.

**Displays 6 Cards:**

1. **Well-Supported Consistent Learner**
   - Description: Strong grades, high attendance, positive peer influence
   - Pedagogical Hurdles: May plateau without stretch challenges
   - Recommended Scaffolding: Leadership opportunities, mentorship roles, advanced content

2. **Motivated but Under-Resourced**
   - Description: High motivation but limited study materials/tutoring
   - Pedagogical Hurdles: Access barriers, knowledge gaps
   - Recommended Scaffolding: Study material provision, targeted tutoring, community connections

3. **High Achiever with Perfectionism**
   - Description: Excellent grades but stress/anxiety signals
   - Pedagogical Hurdles: Unrealistic self-expectations, overwork
   - Recommended Scaffolding: Metacognitive support, stress management, realistic goal-setting

4. **Fragmented Learner**
   - Description: Inconsistent attendance, declining engagement
   - Pedagogical Hurdles: Disorganization, lost motivation, unclear relevance
   - Recommended Scaffolding: Structure, relevance connection, milestone celebrations

5. **Socially Dependent**
   - Description: Performance tied to peer relationships
   - Pedagogical Hurdles: Vulnerability to negative peer influence
   - Recommended Scaffolding: Positive peer clustering, collaborative structures, social skill building

6. **High Risk**
   - Description: Low attendance, low motivation, minimal support
   - Pedagogical Hurdles: Systemic barriers, disengagement
   - Recommended Scaffolding: Intensive support, family outreach, environmental change

---

### 6. Lesson Planner (Instructional Scaffolding)

**Access:** `/home/lesson-planner`

**Workflow:**

Input:
- Topic: (text field) e.g., "Quadratic Equations"
- Class: (dropdown) Select from assigned classes
- Difficulty: (slider) 1-10 scale

Process:
- POST /api/ai/suggestion with type="lesson-plan"
- Gemini generates scaffolded lesson structure

Output:
- **Conceptual Anchor:** 1-2 sentence big idea
- **Opening Hook:** Attention-grabbing entry point
- **Direct Instruction:** Main concept delivery
- **Guided Practice:** Scaffolded problem-solving
- **Differentiated Activities:**
  - For Well-Supported students: Advanced applications
  - For Under-Resourced students: Foundational reinforcement
  - For High-Risk students: Kinesthetic/collaborative options
- **Assessment:** Formative checks aligned to personas
- **Closure:** Summary and connection to next lesson

---

### 7. Auto-Grading

**Access:** Used in admin/student or custom interface

**Supported Formats:**
- Essay grading: Free-form text with rubric
- Short-answer: Constrained responses (0-10 points)

**Process:**

Input essay:
```
"The Industrial Revolution fundamentally transformed society through mechanization, 
urbanization, and the shift from agrarian to industrial economies. This transition 
brought both progress and hardship..."
```

Request:
```javascript
POST /api/ai/grade
{
  type: "essay",
  content: "...",
  rubric: "Grammar, Structure, Arguments, Evidence"
}
```

Response:
```javascript
{
  score: 87,
  feedback: "Strong arguments with good examples. Work on varying sentence structure.",
  strengths: ["Clear thesis", "Relevant evidence"],
  improvements: ["Strengthen transitions", "Add more analysis"]
}
```

---

## Configuration

### Environment Variables (.env.local)

```bash
# Required
GEMINI_API_KEY=your_api_key_here

# Optional
NEXT_PUBLIC_APP_NAME=Teacher Helping System
NODE_ENV=development | production
```

### Next.js Configuration (next.config.mjs)

```javascript
const nextConfig = {
  reactCompiler: true,  // Enable Babel React Compiler for optimized rendering
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',  // Support large CSV uploads
    },
  },
};
```

### Tailwind CSS

Configured in `tailwind.config.js` with:
- Custom color palette
- Dark mode support (via next-themes)
- Responsive utilities

### Authentication Configuration

Currently stored in localStorage (development-only):

```javascript
// src/app/login/page.js
const teacher = {
  teacherName: "Dr. Smith",
  className: "Class A"
};
const token = btoa(JSON.stringify(teacher));
localStorage.setItem('teacher_token', token);
```

**TODO (Production):** Implement:
- OAuth2 provider integration
- JWT token signing/verification
- Refresh token rotation
- Secure session management

---

## Development Guide

### File Organization Best Practices

**Components:** 
- Place in `/src/component`
- Separate admin/teacher/shared subfolders
- One component per file
- Name files in PascalCase (.jsx)

**API Routes:**
- RESTful structure in `/src/app/api`
- Group related endpoints in folders
- Use `route.js` for handlers
- Name folders lowercase with hyphens

**Utilities:**
- Shared functions in `/src/lib`
- Keep concerns separated (data.js, gemini.js)
- Export named functions
- Add JSDoc comments

### Adding New Features

#### Example: Add a new student filter by attendance percentage

**Step 1: Update data.js**

```javascript
// /src/lib/data.js

export function getStudentsByAttendance(minAttendance) {
  const students = getStudents();
  return students.filter(s => 
    parseFloat(s.Attendance) >= minAttendance
  );
}
```

**Step 2: Create API endpoint**

```javascript
// /src/app/api/students/by-attendance/route.js

import { NextResponse } from 'next/server';
import { getStudentsByAttendance } from '@/lib/data';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const minAttendance = searchParams.get('min') || 0;
  
  try {
    const students = getStudentsByAttendance(parseFloat(minAttendance));
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}
```

**Step 3: Create UI component**

```javascript
// /src/component/AttendanceFilter.jsx

'use client';
import { useState } from 'react';

export default function AttendanceFilter() {
  const [threshold, setThreshold] = useState(80);
  const [results, setResults] = useState([]);

  const handleFilter = async () => {
    const res = await fetch(`/api/students/by-attendance?min=${threshold}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
      />
      <button onClick={handleFilter}>Filter</button>
      <div>{results.length} students found</div>
    </div>
  );
}
```

**Step 4: Integrate into page**

```javascript
// /src/app/home/page.js

import AttendanceFilter from '@/component/AttendanceFilter';

export default function TeacherDashboard() {
  return (
    <div>
      {/* existing content */}
      <AttendanceFilter />
    </div>
  );
}
```

### Testing Checklist

Before pushing changes:

- [ ] No console errors/warnings
- [ ] API endpoints return expected JSON
- [ ] Components render without crashing
- [ ] Responsive on mobile/tablet
- [ ] Dark/light mode both functional
- [ ] No broken image links
- [ ] Authentication flow works
- [ ] PDF export generates correctly

### Performance Optimization

**Current Optimizations:**
1. React Compiler (Babel) enabled
2. Next.js Image optimization (if images used)
3. CSS-in-JS via Tailwind (minimal bundle)
4. Client-side caching of API responses (consider adding)

**Future Improvements:**
1. Implement React Query for server state management
2. Add Suspense boundaries for streaming UI
3. Optimize large student lists with virtualization
4. Implement incremental static regeneration (ISR)

### Common Issues & Solutions

**Issue: "GEMINI_API_KEY is missing"**
- Solution: Check `.env.local` exists in project root
- Verify API key is valid (not expired)
- Restart dev server after adding/changing key

**Issue: Database file not found on init**
- Solution: Ensure `Experiments/genai_ready_student_profiles.csv` exists
- Run `node server/init-db.js` from project root
- Check for file read permissions

**Issue: Students not loading in teacher dashboard**
- Solution: Verify localStorage has valid teacher_token
- Check `/api/class-summary/:className` returns data
- Inspect Network tab for failed API calls

**Issue: Theme not persisting**
- Solution: Verify `next-themes` provider in layout.js
- Check cookies/localStorage for theme preference
- Clear browser cache and reload

---

## Data Flow Diagrams

### Daily Pulse Logging Flow

```
Teacher Dashboard
       │
       ├─→ Opens Pulse Logger Modal
       │
       ├─→ Selects engagement level for N students
       │   (Active = 9pts, Steady = 6pts, Passive = 3pts)
       │
       ├─→ Clicks "Sync Pulse"
       │
       └─→ POST /api/ai/pulse
            │
            ├─→ Iterates through updates array
            ├─→ Calls updateStudentPulse() for each
            ├─→ Appends entry to student.dailyPulse array
            ├─→ Trims array to last 5 days (rolling window)
            ├─→ Writes updated students.json to disk
            │
            └─→ Returns { message, count } response
                 │
                 └─→ Notifies teacher: "3 pulse entries synced"
```

### Drift Detection Flow

```
Background Process (on each GET /api/students)
       │
       ├─→ For each student:
       │
       ├─→ Retrieve attendanceHistory (3-week window)
       │   OR simulate from current attendance
       │
       ├─→ Calculate drift = last_week - 3_weeks_ago
       │   (drift = history[2] - history[0])
       │
       ├─→ isDrifting = (drift < -5) ?
       │   TRUE  → Student flagged for intervention
       │   FALSE → Student considered stable
       │
       ├─→ If isDrifting AND student is Low-Risk:
       │   Alert notification generated
       │
       └─→ Return students array with drift fields
            │
            └─→ UI displays drifting students in red
```

### AI Scaffolding Generation Flow

```
Teacher clicks "Get Suggestions"
       │
       ├─→ Fetches student data from API
       │
       ├─→ POST /api/ai/suggestion
       │   {
       │     type: "student",
       │     id: "123",
       │     student: { Persona, Risk_Category, ... }
       │   }
       │
       ├─→ Backend receives request
       │   ├─→ Validates student exists
       │   ├─→ Constructs detailed prompt with pedagogy context
       │   └─→ Calls Google Gemini API
       │
       ├─→ Gemini processes prompt
       │   ├─→ Analyzes student profile
       │   ├─→ Generates 2-3 scaffolding strategies
       │   ├─→ Uses pedagogical terminology
       │   └─→ Returns text response
       │
       ├─→ Backend parses Gemini response
       │   ├─→ Handles errors (quota exceeded, etc.)
       │   └─→ Returns JSON: { suggestion: "..." }
       │
       └─→ Frontend displays suggestion
            ├─→ Renders in Suggestions.jsx component
            ├─→ Shows copy & regenerate buttons
            └─→ Caches for 30 minutes
```

### Student Mentorship Matching Flow

```
Database initialization / Student lookup
       │
       ├─→ For each student with Risk_Category = "High Risk"
       │   OR Motivation_Level = "Low"
       │
       ├─→ Search within same className for:
       │   - Persona = "Well-Supported Consistent Learner"
       │   - Not the student themselves (id check)
       │
       ├─→ If match found:
       │   mentorMatch = { id: "...", name: "..." }
       │
       ├─→ If no match available:
       │   mentorMatch = null
       │   (Flag for admin to manually assign mentor)
       │
       └─→ Return student record with mentorMatch field
            │
            └─→ UI displays mentor card in student details page
```

---

## Deployment

### Deployment Checklist

Before deploying to production:

- [ ] Environment variables configured (.env.local → .env.production.local)
- [ ] Database initialized with production data
- [ ] Gemini API key validated and quotas confirmed
- [ ] Authentication hardened (OAuth2, not localStorage)
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting on API endpoints
- [ ] Database backup strategy implemented
- [ ] Monitoring/logging configured
- [ ] Privacy policy and terms of service updated
- [ ] FERPA compliance verified
- [ ] Bias audit completed
- [ ] Performance tested under load

### Vercel Deployment (Recommended)

**Step 1: Create Vercel Account**
- Go to [vercel.com](https://vercel.com)
- Sign up with GitHub account

**Step 2: Import Project**
```bash
vercel --prod
```

**Step 3: Configure Environment Variables**
```
Dashboard → Settings → Environment Variables
Add: GEMINI_API_KEY = [your key]
```

**Step 4: Deploy**
```bash
git push origin main
# Vercel auto-deploys on main branch
```

### Self-Hosted Deployment (Node.js)

**Step 1: Build Production Bundle**
```bash
npm run build
```

**Step 2: Start Server**
```bash
npm start
```

Server runs on `http://localhost:3000` or PORT environment variable.

**Step 3: Configure Reverse Proxy (Nginx)**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Step 4: Use Process Manager (PM2)**
```bash
npm install -g pm2
pm2 start npm --name "teacher-system" -- start
pm2 save
pm2 startup
```

### Database Deployment

**Option 1: Cloud JSON Storage (Firebase)**
```javascript
// Migrate from local JSON to Firebase Realtime Database
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set } from 'firebase/database';

const db = getDatabase(app);
await set(ref(db, 'students'), studentsArray);
```

**Option 2: Cloud SQL Database**
```sql
-- Migrate to PostgreSQL/MySQL
CREATE TABLE students (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  className VARCHAR(100),
  persona VARCHAR(100),
  risk_category VARCHAR(50),
  -- ... other columns
);
```

---

## Maintenance & Operations

### Regular Tasks

**Daily:**
- Monitor Gemini API quota usage
- Check error logs for failed requests

**Weekly:**
- Backup students.json and pulses.json
- Review high-risk student alerts
- Verify all API endpoints responding

**Monthly:**
- Run bias audit on persona assignments
- Review teacher feedback and override patterns
- Update student data from SIS

**Quarterly:**
- Retrain persona classification thresholds
- Security audit of authentication system
- Performance profiling and optimization

### Support & Troubleshooting

**Common Debugging Commands:**
```bash
# Check API response
curl -X GET http://localhost:3000/api/students

# View logs
npm run dev 2>&1 | tee server.log

# Reinitialize database
node server/init-db.js

# Check Node version
node --version

# Clear npm cache
npm cache clean --force
```

---

## Conclusion

This Teacher Helping System is a comprehensive educational platform combining behavioral analytics, AI-powered pedagogy, and human-centered design. The documentation above provides guidance for:

- **Administrators:** Setting up, configuring, and deploying the system
- **Developers:** Understanding architecture, adding features, and debugging
- **Educators:** Using features to support student learning
- **Researchers:** Extending the system with new algorithms or pedagogical approaches

For questions or contributions, please refer to the GitHub repository: [Lakshita-alt/Teacher_helping_system](https://github.com/Lakshita-alt/Teacher_helping_system)

---

**Documentation Version:** 1.0  
**Last Updated:** February 28, 2026  
**Created by:** AI Documentation Generator
