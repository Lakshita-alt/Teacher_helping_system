"use client";
import { useEffect, useState } from "react";
import ClassSummary from "@/component/teacher/ClassSummary"
import StudentSummary from "@/component/teacher/StudentSummary"
import Suggestion from "@/component/teacher/Suggestions"
import DashboardTab from "@/component/teacher/DashboardTab";
import GradingTab from "@/component/teacher/GradingTab";

export default function HomeLayout({children}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = () => {
      const token = localStorage.getItem('teacher_token');
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // Decode the simulated JWT (Base64)
        const payload = JSON.parse(atob(token));
        
        // Check expiry
        if (Date.now() > payload.exp) {
          localStorage.removeItem('teacher_token');
          localStorage.removeItem('teacher_auth');
          localStorage.removeItem('current_teacher_class');
          window.location.href = "/login";
          return;
        }

        // Check if class context is present
        if (!payload.className) {
          window.location.href = "/login";
          return;
        }

        setAuthenticated(true);
        setLoading(false);
      } catch (err) {
        console.error("Token verification failed", err);
        localStorage.removeItem('teacher_token');
        window.location.href = "/login";
      }
    };

    verifyToken();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('teacher_token');
    localStorage.removeItem('teacher_auth');
    localStorage.removeItem('current_teacher_class');
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Authenticating Portal Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground w-full overflow-hidden font-mono">
      {/* Fixed Sidebar */}
      <div className="w-full md:w-[22vw] lg:w-[18vw] xl:w-[15vw] min-w-[260px] p-6 bg-sidebar border-r border-sidebar-border flex flex-col gap-2 h-full overflow-y-auto shrink-0 relative">
        <div className="mb-10 px-2 mt-4">
          <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Teacher App</h2>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-2">Analysis Hub</p>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <DashboardTab />
          <ClassSummary />
          <StudentSummary />
          <GradingTab />
          <Suggestion />
        </div>

        {/* Logout Button at bottom of sidebar */}
        <div className="mt-auto pt-6 px-2">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 border border-rose-500/10 transition-all group"
          >
            <span className="text-lg group-hover:rotate-12 transition-transform">🚪</span>
            <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 h-full overflow-y-auto">
        <div className="p-6 md:p-10 lg:p-16 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
