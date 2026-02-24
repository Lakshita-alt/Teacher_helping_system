"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    redirect("/admin/school");
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-sidebar-border border-t-amber-500 rounded-full animate-spin"></div>
        <p className="text-xs font-black opacity-50 uppercase tracking-widest text-foreground">Loading Teacher System...</p>
      </div>
    </div>
  );
}
