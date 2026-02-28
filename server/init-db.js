const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const CSV_PATH = path.join(process.cwd(), 'Experiments', 'genai_ready_student_profiles.csv');
const JSON_DB_PATH = path.join(process.cwd(), 'database', 'students.json');
const PULSE_DB_PATH = path.join(process.cwd(), 'database', 'pulses.json');

function init() {
  console.log("Initializing database from CSV...");
  
  if (!fs.existsSync(CSV_PATH)) {
    console.error("CSV source not found!");
    return;
  }

  const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  const students = records.map((record, index) => {
    // Generate a consistent class name (500 students per class)
    const studentsPerClass = 500;
    const classIndex = Math.floor(index / studentsPerClass);
    const className = `Class ${String.fromCharCode(65 + (classIndex % 26))}${classIndex >= 26 ? Math.floor(classIndex/26) : ''}`;
    
    return {
      id: String(index + 1),
      name: record.name || `Student ${index + 1}`,
      className,
      ...record,
      dailyPulse: [
        { day: 'Mon', engagement: 'Steady', participation: 5 },
        { day: 'Tue', engagement: 'Steady', participation: 5 },
        { day: 'Wed', engagement: 'Steady', participation: 5 },
        { day: 'Thu', engagement: 'Steady', participation: 5 },
        { day: 'Fri', engagement: 'Steady', participation: 5 },
      ],
      weeklyScores: [
        { week: 'Week 1', score: 70 },
        { week: 'Week 2', score: 75 },
        { week: 'Week 3', score: 68 },
        { week: 'Week 4', score: 72 },
      ],
      trends: [
        { month: 'Sept', score: 65 },
        { month: 'Oct', score: 70 },
        { month: 'Nov', score: 68 },
        { month: 'Dec', score: 75 },
        { month: 'Jan', score: 72 },
        { month: 'Feb', score: 74 },
      ],
      behavioralEvolution: [
        { month: 'Nov', state: 'Steady', desc: 'Consistent baseline participation.' },
        { month: 'Dec', state: 'Active', desc: 'Peak engagement during practicals.' },
        { month: 'Jan', state: record.Motivation_Level === 'Low' ? 'Passive' : 'Steady', desc: record.Motivation_Level === 'Low' ? 'Shift to cognitive detachment detected.' : 'Maintained conceptual rhythm.' },
        { month: 'Feb', state: record.Risk_Category === 'High Risk' ? 'Passive' : 'Active', desc: record.Risk_Category === 'High Risk' ? 'Current: Fragmented presence.' : 'Current: Deep-work stamina.' },
      ]
    };
  });

  fs.writeFileSync(JSON_DB_PATH, JSON.stringify(students, null, 2));
  
  if (!fs.existsSync(PULSE_DB_PATH)) {
    fs.writeFileSync(PULSE_DB_PATH, JSON.stringify([], null, 2));
  }

  console.log(`Database initialized with ${students.length} students.`);
}

init();
