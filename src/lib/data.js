import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'csv-parse/sync';

const CSV_PATH = path.join(process.cwd(), 'Experiments', 'genai_ready_student_profiles.csv');

const STUDENT_DATA_PATH = path.join(process.cwd(), 'Experiments', 'Student_data.csv');

const FIRST_NAMES = ["James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Christopher", "Karen", "Charles", "Lisa", "Christopher", "Nancy", "Daniel", "Sandra", "Matthew", "Ashley", "Anthony", "Kimberly", "Mark", "Donna", "Donald", "Emily", "Steven", "Michelle", "Andrew", "Carol", "Paul", "Amanda", "Joshua", "Melissa", "Kenneth", "Deborah", "Kevin", "Stephanie", "Brian", "Rebecca", "George", "Sharon"];
const LAST_NAMES = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell", "Carter", "Roberts"];

export function getStudents() {
  try {
    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });
    
    // Also read Student_data.csv to get Exam_Score and Previous_Scores
    let fullDataRecords = [];
    try {
      const fullDataContent = fs.readFileSync(STUDENT_DATA_PATH, 'utf-8');
      fullDataRecords = parse(fullDataContent, {
        columns: true,
        skip_empty_lines: true,
      });
    } catch (e) {
      console.error("Could not read full student data CSV", e);
    }

    // Add an ID and className to each record for easier access
    const studentsPerClass = 500;
    return records.map((record, index) => {
      const fullData = fullDataRecords[index] || {};
      const classIndex = Math.floor(index / studentsPerClass);
      const className = `Class ${String.fromCharCode(65 + (classIndex % 26))}${classIndex >= 26 ? Math.floor(classIndex/26) : ''}`;
      
      // Generate a semi-unique name based on index
      const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
      const lastName = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];
      const name = `${firstName} ${lastName}`;

      return {
        id: String(index + 1),
        name,
        className,
        ...record,
        Exam_Score: fullData.Exam_Score,
        Previous_Scores: fullData.Previous_Scores,
        // Simulate monthly trend data
        trends: [
            { month: 'Oct', score: Math.round(fullData.Previous_Scores * 0.9) || 60 },
            { month: 'Nov', score: Math.round(fullData.Previous_Scores * 0.95) || 65 },
            { month: 'Dec', score: parseInt(fullData.Previous_Scores) || 70 },
            { month: 'Jan', score: Math.round((parseInt(fullData.Previous_Scores) + parseInt(fullData.Exam_Score || fullData.Previous_Scores))/2) || 75 },
            { month: 'Feb', score: parseInt(fullData.Exam_Score) || 80 },
        ]
      };
    });
  } catch (error) {
    console.error('Error reading students CSV:', error);
    return [];
  }
}

export function getStudentById(id) {
  const students = getStudents();
  return students.find((s) => s.id === id);
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
  const classes = [];
  const studentsPerClass = 500;
  
  for (let i = 0; i < students.length; i += studentsPerClass) {
    const classIndex = Math.floor(i / studentsPerClass);
    const classStudents = students.slice(i, i + studentsPerClass);
    const className = `Class ${String.fromCharCode(65 + (classIndex % 26))}${classIndex >= 26 ? Math.floor(classIndex/26) : ''}`;
    
    const personaCounts = {};
    classStudents.forEach(s => {
      personaCounts[s.Persona] = (personaCounts[s.Persona] || 0) + 1;
    });

    classes.push({
      className,
      hash: `hash_${classIndex}`,
      total: classStudents.length,
      personas: personaCounts,
      // For legacy component compatibility if needed
      one: Object.values(personaCounts)[0] || 0,
      two: Object.values(personaCounts)[1] || 0,
      three: Object.values(personaCounts)[2] || 0,
      four: Object.values(personaCounts)[3] || 0,
    });
  }
  return classes;
}

export function getClassByHash(hash) {
  return getClasses().find(c => c.hash === hash);
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
  // Ensure the className match is trimmed and case-insensitive
  const targetClass = className?.trim().toLowerCase();
  const students = allStudents.filter(s => s.className?.trim().toLowerCase() === targetClass);
  
  if (students.length === 0) {
    console.warn(`No students found for class: ${className}`);
    // Return a structured empty summary instead of global one
    return {
      className,
      totalStudents: 0,
      averageAttendance: "0.00",
      averageHoursStudied: "0.00",
      riskDistribution: {},
      personaDistribution: {},
      students: []
    };
  }

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
    className,
    totalStudents,
    averageAttendance: (totalAttendance / totalStudents).toFixed(2),
    averageHoursStudied: (totalHoursStudied / totalStudents).toFixed(2),
    riskDistribution: riskCategories,
    personaDistribution: personas,
    students: students
  };
}
