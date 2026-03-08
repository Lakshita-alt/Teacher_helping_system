"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/component/Icons";

export default function StudentSummary() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [searchId, setSearchId] = useState("");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [suggestion, setSuggestion] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  // cache so clicking the same student twice skips the API call
  const [aiSuggestions, setAiSuggestions] = useState({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentsRes, classesRes] = await Promise.all([
          fetch("/api/students"),
          fetch("/api/classes"),
        ]);

        const studentsData = await studentsRes.json();
        const classesData = await classesRes.json();

        setStudents(studentsData);
        setClasses(classesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const categories = Array.from(
    new Set(students.map((s) => s.Risk_Category)),
  ).filter(Boolean);

  const filteredStudents = students.filter(
    (student) =>
      (!selectedCategory || student.Risk_Category === selectedCategory) &&
      (!selectedClass || student.className === selectedClass) &&
      (!searchId ||
        student.id.toLowerCase().includes(searchId.toLowerCase()) ||
        student.name.toLowerCase().includes(searchId.toLowerCase()) ||
        student.Persona.toLowerCase().includes(searchId.toLowerCase())),
  );

  const studentsToRender = selectedClass
    ? filteredStudents
    : filteredStudents.slice(0, 100);

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);

    const cached = aiSuggestions[student.id];
    if (cached) {
      setSuggestion(cached);
      return;
    }

    setLoadingSuggestion(true);
    setSuggestion("");

    try {
      const res = await fetch("/api/ai/suggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "student", id: student.id }),
      });
      const data = await res.json();
      const text = data.suggestion || "No suggestion available.";
      setSuggestion(text);
      setAiSuggestions((prev) => ({ ...prev, [student.id]: text }));
    } catch {
      setSuggestion("Failed to load suggestion.");
    } finally {
      setLoadingSuggestion(false);
    }
  };

  function OnButtonClick() {
    // Handled by reactive state
  }

  return (
    <div className="space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700 text-foreground font-mono">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 bg-card p-8 md:p-12 rounded-[3rem] border border-card-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-card-muted rounded-full -mr-32 -mt-32 pointer-events-none opacity-20"></div>

        <div className="flex-1 space-y-3 relative z-10">
          <h1 className="text-4xl font-black tracking-tight leading-none italic uppercase">
            Student Search
          </h1>

          <p className="text-muted font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
            Analyze individual performance markers and archetypes
          </p>
        </div>

        {/* FILTERS */}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4 relative z-10">
          <div className="flex flex-col gap-2 min-w-[160px]">
            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">
              Select Class
            </label>

            <div className="relative">
              <select
                className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none"
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">All Classes</option>

                {classes.map((cls) => (
                  <option key={cls.className} value={cls.className}>
                    {cls.className}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 min-w-[160px]">
            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">
              Risk Category
            </label>

            <select
              className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>

              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 min-w-[200px]">
            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">
              Search Student
            </label>

            <input
              type="text"
              placeholder="Type name or ID..."
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground"
            />
          </div>
        </div>
      </div>

      {/* STUDENT GRID */}

      {loading ? (
        <div className="py-24 text-center">Loading students...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {studentsToRender.map((student) => (
            <div
              key={student.id}
              onClick={() => handleStudentClick(student)}
              className="bg-card p-8 rounded-[2.5rem] border border-card-border shadow-sm cursor-pointer"
            >
              <h3 className="font-black text-lg">{student.name}</h3>

              <p className="text-xs">
                {student.id} • {student.Risk_Category}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}

      {selectedStudent && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center">
          <div className="bg-card p-8 rounded-3xl max-w-xl">
            <h2 className="text-2xl font-black mb-4">{selectedStudent.name}</h2>

            <p className="text-sm">
              {loadingSuggestion ? "Analysing student profile..." : suggestion || "No insight available."}
            </p>

            <button
              className="mt-6 px-6 py-3 bg-card-muted rounded-xl"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
