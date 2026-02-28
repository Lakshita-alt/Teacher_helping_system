"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Icon } from "@/component/Icons";

export default function TeacherDashboard() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState({ name: "Teacher", className: null });
  const [isPulseOpen, setIsPulseOpen] = useState(false);
  const [pulseSearch, setPulseSearch] = useState("");
  const [engagementUpdates, setEngagementUpdates] = useState({}); // { studentId: level }

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
        <div className="w-24 h-24 bg-card rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm border border-card-border"><Icon name="lock" className="w-12 h-12 text-accent" /></div>
        <h2 className="text-2xl font-black uppercase italic mb-4">Class Access Pending</h2>
        <p className="text-muted font-bold text-xs uppercase tracking-[0.2em] max-w-md leading-relaxed">
          Your account is verified, but no student batch has been assigned yet. 
          Please contact the <span className="text-accent">School Administrator</span> to link your profile to a class.
        </p>
        <button 
            onClick={resetAssignment}
            className="mt-10 px-8 py-4 bg-foreground text-background rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent transition-all active:scale-95 shadow-xl dark:shadow-none"
        >
            Re-Authenticate
        </button>
      </div>
    );
  }

  const quickActions = [
    { title: "Record Pulse", desc: "Log this week's classroom energy", icon: "sparkles", href: "#pulse", color: "bg-amber-500/10 text-amber-500" },
    { title: "Lesson Plan", desc: "Generate curriculum-aligned plans", icon: "class", href: "/home/lesson-planner", color: "bg-emerald-500/10 text-emerald-500" },
    { title: "Student Analysis", desc: "Deep dive into performance", icon: "student", href: "/home/student", color: "bg-accent/10 text-accent" },
    { title: "Bulk Upload", icon: "upload", desc: "Process new CSV datasets", icon: "upload", href: "/home/upload", color: "bg-rose-500/10 text-rose-500" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-mono">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none text-foreground">Welcome Back, {teacherInfo.teacherName || "Teacher"}</h1>
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
                className="px-6 py-2 bg-foreground text-background rounded-2xl shadow-xl dark:shadow-none text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all active:scale-95"
            >
                Download Master Report
            </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", val: summary?.totalStudents || 0, icon: "student", color: "text-foreground" },
          { label: "Avg Attendance", val: `${summary?.averageAttendance || 0}%`, icon: "calendar", color: "text-emerald-500" },
          { label: "High Risk", val: summary?.riskDistribution?.["High Risk"] || 0, icon: "warning", color: "text-rose-500" },
          { label: "Avg Study", val: `${summary?.averageHoursStudied || 0}h`, icon: "calendar", color: "text-accent" },
        ].map((stat, i) => (
          <div key={i} className="bg-card p-6 rounded-[2.5rem] border border-card-border shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 bg-card-muted rounded-2xl flex items-center justify-center text-xl border border-card-border group-hover:scale-110 transition-transform text-foreground">
              <Icon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-[9px] font-black text-muted uppercase tracking-widest leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-black text-foreground tracking-tighter">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Alerts Section */}
      {students.filter(s => s.performanceAlert || s.Risk_Category === 'High Risk' || s.isDrifting).length > 0 && (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Icon name="warning" className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-black uppercase italic tracking-tight text-rose-500">Priority Inbox</h3>
            <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Action Required</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.filter(s => s.performanceAlert || s.Risk_Category === 'High Risk' || s.isDrifting).slice(0, 3).map((student) => (
              <Link href="/home/student" key={student.id}>
                <div className="bg-rose-500/5 p-6 rounded-[2rem] border border-rose-500/20 shadow-sm hover:shadow-md hover:bg-rose-500/10 transition-all group cursor-pointer h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-black text-foreground uppercase tracking-tight">{student.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                          student.isDrifting ? 'bg-amber-500/20 text-amber-600' : 'bg-rose-500/20 text-rose-600'
                        }`}>
                          {student.isDrifting ? 'Velocity Alert' : student.Risk_Category === 'High Risk' ? 'Intensive Support' : 'Monitoring Required'}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="trend" className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-rose-500/10">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Qualitative Status:</p>
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400 leading-tight italic">
                      {student.isDrifting 
                        ? `Detecting a 'Downward Drift' in participation (${student.driftVelocity}% velocity); acting now prevents critical disengagement.`
                        : student.performanceAlert 
                          ? `Critical 'Instructional Friction' detected; student is exhibiting rapid cognitive disengagement from current objectives.` 
                          : `Exhibiting 'Relational Fragility'; attendance gaps suggest external environmental barriers are outpacing classroom scaffolding.`}
                    </p>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <span className="text-[8px] font-black uppercase text-rose-500/60 tracking-tighter">Strategic Priority: High</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="w-full space-y-6">
        {/* Quick Actions */}
        <h3 className="text-lg font-black uppercase italic tracking-tight px-2 text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <div 
              key={i} 
              onClick={() => action.href === '#pulse' ? setIsPulseOpen(true) : router.push(action.href)}
            >
              <div className="bg-card p-8 rounded-[3rem] border border-card-border shadow-sm hover:shadow-xl dark:hover:shadow-none transition-all duration-300 group cursor-pointer h-full text-foreground">
                <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg dark:shadow-none group-hover:rotate-6 transition-transform`}>
                  <Icon name={action.icon} className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black uppercase italic tracking-tight mb-1 text-foreground">{action.title}</h4>
                <p className="text-xs font-medium text-muted leading-relaxed">{action.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-sidebar p-10 rounded-[3rem] border border-card-border relative overflow-hidden group shadow-lg dark:shadow-none">
        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform">
          <Icon name="trend" className="w-32 h-32" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h3 className="text-accent font-black uppercase tracking-[0.2em] text-[10px] mb-4">Class Performance Glance</h3>
          <h4 className="text-2xl font-black mb-4 tracking-tight">85% of students are on track for final exams.</h4>
          <p className="text-muted font-medium leading-relaxed">
            The overall class engagement has increased by 12% compared to last month. Persona 2 (Motivated Learners) are showing the highest growth rate.
          </p>
          <Link href="/home/class">
            <button className="mt-8 bg-foreground text-background font-black py-4 px-8 rounded-2xl hover:bg-accent transition-colors uppercase tracking-widest text-xs shadow-xl dark:shadow-none">
              Open Full Analytics
            </button>
          </Link>
        </div>
      </div>

      {/* Pulse Entry Modal */}
      {isPulseOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-2xl rounded-[3rem] border border-card-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-card-border flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black uppercase italic tracking-tight">Weekly Pulse Logger</h2>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">Recording energy for this week</p>
              </div>
              <button onClick={() => setIsPulseOpen(false)} className="w-10 h-10 rounded-full bg-card-muted flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                <Icon name="close" className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 bg-card-muted/30">
              <div className="relative">
                <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text" 
                  placeholder="Filter students..." 
                  className="w-full bg-card border border-card-border rounded-2xl py-3 pl-12 pr-6 text-sm outline-none focus:ring-4 focus:ring-accent/5 transition-all"
                  value={pulseSearch}
                  onChange={(e) => setPulseSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {students
                .filter(s => s.name.toLowerCase().includes(pulseSearch.toLowerCase()))
                .map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-card-border group hover:border-accent/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-card-muted flex items-center justify-center text-[10px] font-black">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-bold">{student.name}</span>
                  </div>
                  <div className="flex bg-card-muted p-1 rounded-xl gap-1">
                    {['Passive', 'Steady', 'Active'].map((level) => (
                      <button 
                        key={level}
                        onClick={() => setEngagementUpdates(prev => ({...prev, [student.id]: level}))}
                        className={`px-3 py-1.5 rounded-lg text-[8px] font-black uppercase transition-all ${
                          (engagementUpdates[student.id] === level) ? 'bg-accent text-foreground shadow-sm' : 'text-muted hover:text-foreground'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-card-border">
              <button 
                onClick={async () => {
                  const updates = Object.entries(engagementUpdates).map(([id, engagement]) => ({ id, engagement }));
                  if (updates.length === 0) {
                    alert("No changes to submit.");
                    return;
                  }
                  
                  try {
                    const res = await fetch('/api/ai/pulse', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ updates })
                    });
                    const data = await res.json();
                    alert(data.message);
                    setIsPulseOpen(false);
                    setEngagementUpdates({});
                  } catch (e) {
                    alert("Failed to sync pulse data.");
                  }
                }}
                className="w-full bg-foreground text-background py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent transition-all active:scale-95"
              >
                Sync This Week&apos;s Pedagogical Pulse
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
