"use client";
import { useState, useEffect } from "react";
import { Icon } from "@/component/Icons";

export default function LoginPage() {
  const [teacherId, setTeacherId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const res = await fetch('/api/teachers');
        const data = await res.json();
        setTeachers(data);
      } catch (err) {
        console.error("Failed to fetch teachers", err);
      }
    }
    fetchTeachers();
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Admin Access Check
    if (teacherId === "admin1") {
      const adminPayload = {
        role: "admin",
        name: "System Administrator",
        exp: Date.now() + 24 * 60 * 60 * 1000
      };
      localStorage.setItem('admin_token', btoa(JSON.stringify(adminPayload)));
      window.location.href = "/admin";
      return;
    }

    const teacher = teachers.find(t => t.id === teacherId);

    if (teacher) {
      // Find if this teacher has a class assigned in teacher_assignments
      const assignments = JSON.parse(localStorage.getItem('teacher_assignments') || '[]');
      const teacherAssignment = assignments.find(a => a.teacherId === teacher.id);
      
      if (!teacherAssignment) {
        setError("AUTHENTICATION FAILED: No Class Assigned. Contact your administrator to link your profile to a student batch before accessing the dashboard.");
        setLoading(false);
        return;
      }

      // Create a simulated JWT (Base64 encoded payload)
      const payload = {
        teacherId: teacher.id,
        teacherName: teacher.name,
        className: teacherAssignment.className,
        exp: Date.now() + 24 * 60 * 60 * 1000 // 24h expiry
      };
      
      const token = btoa(JSON.stringify(payload));
      localStorage.setItem('teacher_token', token);
      
      // Keep teacher_auth for legacy if needed, but the token is the source of truth
      localStorage.setItem('teacher_auth', JSON.stringify(payload));
      
      // Set current_teacher_class for the dashboard logic
      localStorage.setItem('current_teacher_class', JSON.stringify({
          teacherName: teacher.name,
          className: teacherAssignment.className
      }));

      window.location.href = "/home";
    } else {
      setError("Invalid Teacher ID. Please check with your administrator.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 text-foreground font-mono">
      <div className="bg-card shadow-2xl rounded-[2.5rem] p-10 w-full max-w-md border border-card-border flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto border border-accent/20">
            <Icon name="teacher" className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic leading-none">
            Teacher Access
          </h1>
          <p className="text-muted text-[10px] mt-2 font-bold uppercase tracking-[0.2em]">
            Secure Dashboard Entry
          </p>
        </div>

        {error && (
          <div className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center mb-6 animate-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form className="flex flex-col w-full gap-6" onSubmit={handleLogin}>
          <div className="flex flex-col gap-2">
            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest ml-1">
              Teacher ID
            </label>
            <input 
              type="text" 
              placeholder="e.g. t1"
              required
              className="bg-card-muted border border-card-border rounded-2xl p-5 outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all text-foreground font-black placeholder:text-muted/30 uppercase tracking-widest" 
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-foreground text-background hover:bg-accent hover:text-foreground font-black py-5 rounded-2xl mt-4 shadow-xl dark:shadow-none transition-all active:scale-95 text-center uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter Dashboard"}
          </button>
        </form>

        <p className="mt-8 text-[9px] font-bold text-muted uppercase tracking-widest text-center leading-relaxed">
          Contact administration if you have lost your <br/> Unique Teacher Identification Code
        </p>
      </div>
    </div>
  );
}
