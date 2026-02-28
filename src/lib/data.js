import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'database', 'students.json');
const PULSE_PATH = path.join(process.cwd(), 'database', 'pulses.json');

// Memory cache for performance - Disabled to ensure fresh reads from JSON DB
// let cachedStudents = null;

export function getStudents() {
  // if (cachedStudents) return cachedStudents;
  
  try {
    if (!fs.existsSync(DB_PATH)) {
        console.error("Database file missing! Run server/init-db.js first.");
        return [];
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    const students = JSON.parse(data);
    
    // Calculate Drift & Social Scaffolding
    return students.map(s => {
        // 1. Calculate Attendance Velocity (Drift)
        // Simulate a 3-week attendance history for calculation
        const history = s.attendanceHistory || [
            parseFloat(s.Attendance) + 5, 
            parseFloat(s.Attendance) + 2, 
            parseFloat(s.Attendance)
        ];
        const drift = history[history.length - 1] - history[0];
        const isDrifting = drift < -5; // Dropped more than 5% over the period

        // 2. Peer Mentorship Matching Logic (Social Scaffolding)
        // Match 'High Risk' or 'Passive' students with 'Well-Supported Consistent Learner' mentors
        let mentorMatch = null;
        if (s.Risk_Category === 'High Risk' || s.Motivation_Level === 'Low') {
            const potentialMentor = students.find(p => 
                p.className === s.className && 
                p.Persona === 'Well-Supported Consistent Learner' && 
                p.id !== s.id
            );
            if (potentialMentor) {
                mentorMatch = { id: potentialMentor.id, name: potentialMentor.name };
            }
        }

        return {
            ...s,
            driftVelocity: drift.toFixed(1),
            isDrifting,
            mentorMatch,
            pedagogicalOverride: s.pedagogicalOverride || null
        };
    });
  } catch (error) {
    console.error("Database read error:", error);
    return [];
  }
}

export function getStudentById(id) {
  const students = getStudents();
  return students.find(s => s.id === id);
}

export function updateStudentPulse(studentId, newEngagement) {
  try {
    const students = getStudents();
    const index = students.findIndex(s => s.id === studentId);
    if (index === -1) return false;

    // Simulate day-of-week tracking
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const currentDay = days[new Date().getDay() - 1] || 'Mon';

    const newPulseEntry = {
        day: currentDay,
        engagement: newEngagement,
        participation: newEngagement === 'Active' ? 9 : newEngagement === 'Steady' ? 6 : 3
    };

    // Update the pulse array (rotate effectively)
    const currentPulse = students[index].dailyPulse || [];
    // If this day exists, replace it, else push and slice
    const existingIndex = currentPulse.findIndex(p => p.day === currentDay);
    
    if (existingIndex > -1) {
        currentPulse[existingIndex] = { ...currentPulse[existingIndex], ...newPulseEntry };
    } else {
        currentPulse.push(newPulseEntry);
    }
    
    students[index].dailyPulse = currentPulse.slice(-5);
    
    fs.writeFileSync(DB_PATH, JSON.stringify(students, null, 2));
    // No cachedStudents to update since caching was removed
    return true;
  } catch (error) {
    console.error("Failed to update student pulse:", error);
    return false;
  }
}

export function updateStudentOverride(studentId, overrideData) {
  try {
    const students = getStudents();
    const index = students.findIndex(s => s.id === studentId);
    if (index === -1) return false;

    students[index].pedagogicalOverride = {
        ...overrideData,
        timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(DB_PATH, JSON.stringify(students, null, 2));
    cachedStudents = students;
    return true;
  } catch (error) {
    console.error("Failed to update pedagogical override:", error);
    return false;
  }
}

export function getTeachers() {
  return [
    { id: 't1', name: 'Dr. Aristhostle', subject: 'Mathematics' },
    { id: 't2', name: 'Prof. Einstein', subject: 'Physics' },
    { id: 't3', name: 'Ms. Curie', subject: 'Chemistry' },
    { id: 't4', name: 'Mr. Darwin', subject: 'Biology' },
    { id: 't5', name: 'Dr. Turing', subject: 'Computer Science' },
  ];
}

export function getClasses() {
  const students = getStudents();
  const classesMap = {};
  
  students.forEach(s => {
    if (!classesMap[s.className]) {
        classesMap[s.className] = {
            className: s.className,
            hash: `hash_${s.className.replace(' ', '_')}`,
            total: 0,
            personas: {}
        };
    }
    const cls = classesMap[s.className];
    cls.total += 1;
    cls.personas[s.Persona] = (cls.personas[s.Persona] || 0) + 1;
  });

  return Object.values(classesMap);
}

export function getClassSummary() {
  const students = getStudents();
  if (students.length === 0) return null;

  const totalStudents = students.length;
  const riskCategories = {};
  const personas = {};
  
  let totalAttendance = 0;
  let totalHoursStudied = 0;

  students.forEach((s) => {
    riskCategories[s.Risk_Category] = (riskCategories[s.Risk_Category] || 0) + 1;
    personas[s.Persona] = (personas[s.Persona] || 0) + 1;
    totalAttendance += parseFloat(s.Attendance || 0);
    totalHoursStudied += parseFloat(s.Hours_Studied || 0);
  });

  return {
    totalStudents,
    averageAttendance: (totalAttendance / totalStudents).toFixed(2),
    averageHoursStudied: (totalHoursStudied / totalStudents).toFixed(2),
    riskDistribution: riskCategories,
    personaDistribution: personas,
  };
}

export function getClassSummaryByName(className) {
  const allStudents = getStudents();
  const targetClass = className?.trim();
  const students = allStudents.filter(s => s.className === targetClass);
  
  if (students.length === 0) return null;

  const totalStudents = students.length;
  const riskCategories = {};
  const personas = {};
  
  let totalAttendance = 0;
  let totalHoursStudied = 0;

  // Aggregate class-wide risk factors
  const highRiskStudents = students.filter(s => s.Risk_Category === 'High Risk');
  const catalystCounts = {
    attendance: 0,
    motivation: 0,
    resources: 0,
    peers: 0
  };

  highRiskStudents.forEach(s => {
    if (parseFloat(s.Attendance) < 75) catalystCounts.attendance++;
    if (s.Motivation_Level === 'Low') catalystCounts.motivation++;
    if (parseFloat(s.Access_to_Resources) < 1) catalystCounts.resources++;
    if (s.Peer_Influence === 'Negative') catalystCounts.peers++;
  });

  // Determine primary catalyst
  const sortedCatalysts = Object.entries(catalystCounts).sort((a, b) => b[1] - a[1]);
  const primaryCatalyst = sortedCatalysts[0][0];
  const catalystLabels = {
    attendance: "Structural Drift (Attendance Volatility)",
    motivation: "Affective Barrier (Low Intrinsic Drive)",
    resources: "Equity Gap (Limited Digital/Print Access)",
    peers: "Social Friction (Negative Peer Influence)"
  };

  students.forEach((s) => {
    riskCategories[s.Risk_Category] = (riskCategories[s.Risk_Category] || 0) + 1;
    personas[s.Persona] = (personas[s.Persona] || 0) + 1;
    totalAttendance += parseFloat(s.Attendance || 0);
    totalHoursStudied += parseFloat(s.Hours_Studied || 0);
  });

  return {
    className,
    totalStudents,
    averageAttendance: (totalAttendance / totalStudents).toFixed(2),
    averageHoursStudied: (totalHoursStudied / totalStudents).toFixed(2),
    riskDistribution: riskCategories,
    personaDistribution: personas,
    students: students,
    riskCatalyst: {
        label: catalystLabels[primaryCatalyst],
        count: catalystCounts[primaryCatalyst],
        percentage: highRiskStudents.length > 0 ? Math.round((catalystCounts[primaryCatalyst] / highRiskStudents.length) * 100) : 0
    }
  };
}
