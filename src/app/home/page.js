"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function TeacherDashboard() {
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({ name: "Teacher", className: null });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('teacher_token');
        let currentTeacher = { teacherName: "Teacher", className: null };
        
        if (token) {
            try {
                const payload = JSON.parse(atob(token));
                currentTeacher = {
                    teacherName: payload.teacherName,
                    className: payload.className
                };
                setTeacherInfo(currentTeacher);
            } catch (err) {
                console.error("Token decode failed", err);
            }
        }

        // REQUIRE a className to be assigned
        if (!currentTeacher.className) {
            setLoading(false);
            setSummary(null);
            return;
        }

        const sumUrl = `/api/class-summary/${encodeURIComponent(currentTeacher.className)}`;

        const sumRes = await fetch(sumUrl);
        const sumData = await sumRes.json();
        
        setSummary(sumData);
        setStudents(sumData.students || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const resetAssignment = () => {
    localStorage.removeItem('teacher_token');
    localStorage.removeItem('teacher_auth');
    localStorage.removeItem('current_teacher_class');
    window.location.reload();
  };

  const exportFullReport = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Class Analytics Master Report", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    doc.autoTable({
      startY: 40,
      head: [['Metric', 'Value']],
      body: [
        ['Total Students', summary?.totalStudents || 0],
        ['Avg Attendance', `${summary?.averageAttendance || 0}%`],
        ['Avg Study Hours', summary?.averageHoursStudied || 0],
        ['High Risk Count', summary?.riskDistribution?.["High Risk"] || 0],
      ],
    });

    const highRiskStudents = students.filter(s => s.Risk_Category === 'High Risk').slice(0, 20);
    if (highRiskStudents.length > 0) {
        doc.text("High Risk Students (Top 20)", 14, doc.lastAutoTable.finalY + 10);
        doc.autoTable({
            startY: doc.lastAutoTable.finalY + 15,
            head: [['ID', 'Name', 'Persona', 'Attendance', 'Risk Score']],
            body: highRiskStudents.map(s => [s.id, s.name, s.Persona, s.Attendance + "%", s.Risk_Score]),
        });
    }

    doc.save("class_master_report.pdf");
  };

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center font-mono">
        <div className="text-muted font-black uppercase tracking-[0.2em] animate-pulse">Initializing Dashboard...</div>
      </div>
    );
  }

  if (!teacherInfo.className || !summary) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center font-mono text-center p-12">
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm border border-card-border">🔒</div>
        <h2 className="text-2xl font-black uppercase italic mb-4">Class Access Pending</h2>
        <p className="text-muted font-bold text-xs uppercase tracking-[0.2em] max-w-md leading-relaxed">
          Your account is verified, but no student batch has been assigned yet. 
          Please contact the <span className="text-accent">School Administrator</span> to link your profile to a class.
        </p>
        <button 
            onClick={resetAssignment}
            className="mt-10 px-8 py-4 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all active:scale-95 shadow-xl shadow-accent/10"
        >
            Re-Authenticate
        </button>
      </div>
    );
  }

  const quickActions = [
    { title: "Auto-Grade", desc: "Grade essays & MCQs with AI", icon: "📝", href: "/home/grading", color: "bg-indigo-500" },
    { title: "Lesson Plan", desc: "Generate curriculum-aligned plans", icon: "📚", href: "/home/lesson-planner", color: "bg-emerald-500" },
    { title: "Student Analysis", desc: "Deep dive into performance", icon: "👤", href: "/home/student", color: "bg-amber-500" },
    { title: "Bulk Upload", desc: "Process new CSV datasets", icon: "📤", href: "/home/upload", color: "bg-rose-500" },
  ];

  // Dynamic alerts
  const lowAttendanceCount = students.filter(s => parseFloat(s.Attendance || 0) < 60).length;
  const highRiskCount = summary?.riskDistribution?.["High Risk"] || 0;
  
  const notifications = [
    ...(lowAttendanceCount > 0 ? [{ title: "Urgent: Low Attendance", desc: `${lowAttendanceCount} students dropped below 60%`, type: "warning", icon: "⚠️" }] : []),
    ...(highRiskCount > 0 ? [{ title: "Risk Alert", desc: `${highRiskCount} students identified as High Risk`, type: "danger", icon: "🚨" }] : []),
    { title: "System Ready", desc: "AI is ready to process assignments", type: "info", icon: "✅" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">Welcome Back, {teacherInfo.teacherName || "Teacher"}</h1>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-2">{teacherInfo.className ? `Assigned to ${teacherInfo.className}` : "Global Student Overview"}</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={resetAssignment}
                className="px-6 py-2 bg-card border border-card-border text-foreground rounded-2xl shadow-sm text-[10px] font-black uppercase tracking-widest hover:bg-card-muted transition-all active:scale-95"
            >
                Reset Assignment
            </button>
            <button 
                onClick={exportFullReport}
                className="px-6 py-2 bg-foreground text-background rounded-2xl shadow-xl shadow-accent/10 text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all active:scale-95"
            >
                Download Master Report
            </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", val: summary?.totalStudents || 0, icon: "👥", color: "text-blue-500" },
          { label: "Avg Attendance", val: `${summary?.averageAttendance || 0}%`, icon: "📅", color: "text-emerald-500" },
          { label: "High Risk", val: summary?.riskDistribution?.["High Risk"] || 0, icon: "🚨", color: "text-rose-500" },
          { label: "Avg Study", val: `${summary?.averageHoursStudied || 0}h`, icon: "⏳", color: "text-amber-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-[2.5rem] border border-card-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-card-muted rounded-2xl flex items-center justify-center text-xl border border-card-border group-hover:scale-110 transition-transform">
              {stat.icon}
            </div>
            <div>
              <p className="text-[9px] font-black text-muted uppercase tracking-widest">{stat.label}</p>
              <p className={`text-xl font-black ${stat.color}`}>{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-lg font-black uppercase italic tracking-tight px-2">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => (
              <Link href={action.href} key={i}>
                <div className="bg-card p-8 rounded-[3rem] border border-card-border shadow-sm hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 group cursor-pointer h-full">
                  <div className={`w-12 h-12 ${action.color} text-white rounded-2xl flex items-center justify-center text-xl mb-4 shadow-lg group-hover:rotate-6 transition-transform`}>
                    {action.icon}
                  </div>
                  <h4 className="text-lg font-black uppercase italic tracking-tight mb-1">{action.title}</h4>
                  <p className="text-xs font-medium text-muted leading-relaxed">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Notifications/Real-time Alerts */}
        <div className="lg:col-span-4 space-y-6">
          <h3 className="text-lg font-black uppercase italic tracking-tight px-2">Recent Alerts</h3>
          <div className="flex flex-col gap-4">
            {notifications.map((note, i) => (
              <div key={i} className="bg-card p-6 rounded-[2rem] border border-card-border shadow-sm flex gap-4 hover:bg-card-muted transition-colors group">
                <div className="text-xl shrink-0 group-hover:scale-110 transition-transform">{note.icon}</div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-tight">{note.title}</h4>
                  <p className="text-[10px] font-medium text-muted mt-1 leading-tight">{note.desc}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-4 text-[10px] font-black text-muted uppercase tracking-widest hover:text-foreground transition-colors">
              View All Notifications →
            </button>
          </div>
        </div>
      </div>

      {/* Progress Glance */}
      <div className="bg-sidebar p-10 rounded-[3rem] border border-card-border relative overflow-hidden group shadow-lg">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
          <span className="text-8xl">📊</span>
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-4">Class Performance Glance</h3>
          <h4 className="text-2xl font-black mb-4 tracking-tight">85% of students are on track for final exams.</h4>
          <p className="text-muted font-medium leading-relaxed">
            The overall class engagement has increased by 12% compared to last month. Persona 2 (Motivated Learners) are showing the highest growth rate.
          </p>
          <Link href="/home/class">
            <button className="mt-8 bg-foreground text-background font-black py-4 px-8 rounded-2xl hover:bg-accent transition-colors uppercase tracking-widest text-xs shadow-xl">
              Open Full Analytics
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
