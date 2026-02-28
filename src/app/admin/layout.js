"use client";
import { useEffect, useState } from "react";
import SchoolSummary from "@/component/admin/SchoolSummary";
import ClassBasedAdminSummary from "@/component/admin/ClassBasedOverView";
import StudentBasedAdminSummary from "@/component/admin/SteudentBasedSummary";
import AssignClassTab from "@/component/admin/AssignClassTab";
import NotificationsTab from "@/component/admin/NotificationsTab";

import { Icon } from "@/component/Icons";

export default function AdminLayout({children}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const verifyAdmin = () => {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const payload = JSON.parse(atob(token));
        
        // Check expiry and role
        if (Date.now() > payload.exp || payload.role !== "admin") {
          localStorage.removeItem('admin_token');
          window.location.href = "/login";
          return;
        }

        setAuthenticated(true);
        setLoading(false);
      } catch (err) {
        console.error("Admin verification failed", err);
        localStorage.removeItem('admin_token');
        window.location.href = "/login";
      }
    };

    verifyAdmin();
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-foreground font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Verifying Admin Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground w-full overflow-hidden font-mono text-xs">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-sidebar-border flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 hover:bg-card-muted rounded-xl transition-colors"
          >
            <Icon name="menu" className="w-6 h-6 text-foreground" />
          </button>
          <h2 className="text-lg font-black uppercase italic tracking-tighter leading-none">Admin Panel</h2>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Fixed Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-[70] 
        w-[280px] lg:w-[22vw] xl:w-[15vw] lg:min-w-[260px] 
        p-6 bg-sidebar border-r border-sidebar-border 
        flex flex-col gap-2 h-full overflow-y-auto shrink-0
        transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-10 px-2 mt-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Admin Panel</h2>
            <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-2">Management Suite</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-card-muted rounded-xl transition-colors"
          >
            <Icon name="close" className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <SchoolSummary />
          <AssignClassTab />
          <ClassBasedAdminSummary />
          <StudentBasedAdminSummary />  
          <NotificationsTab />
        </div>

        {/* Logout Button at bottom of sidebar */}
        <div className="mt-auto pt-6 px-2">
          <button 
            onClick={handleAdminLogout}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-foreground text-background hover:bg-accent hover:text-foreground border border-transparent transition-all group shadow-xl dark:shadow-none cursor-pointer"
          >
            <Icon name="lock" className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Exit Secure Area</span>
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0">
        <div className="p-6 md:p-10 lg:p-16 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
