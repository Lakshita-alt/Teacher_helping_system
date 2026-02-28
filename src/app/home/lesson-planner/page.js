"use client"
import { useState, useEffect } from "react";
import { Icon } from "@/component/Icons";

export default function LessonPlanner() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [className, setClassName] = useState("");
  const [personaData, setPersonaData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('teacher_auth');
    if (stored) {
      const auth = JSON.parse(stored);
      setClassName(auth.className);
      
      // Fetch class persona data
      if (auth.className) {
        fetch(`/api/class-summary/${encodeURIComponent(auth.className)}`)
          .then(res => res.json())
          .then(data => setPersonaData(data.personaDistribution));
      }
    }
  }, []);

  const generatePlan = async () => {
    if (!topic || !className) return;
    setLoading(true);
    setPlan("");
    try {
      const res = await fetch('/api/ai/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'lesson-plan', 
          topic, 
          classData: { className, personas: personaData } 
        })
      });
      const data = await res.json();
      setPlan(data.suggestion);
    } catch (e) {
      setPlan("Failed to generate plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-mono text-foreground pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">Instructional Scaffolding</h1>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-2 italic">Differentiated Lesson Architect for {className}</p>
        </div>
        <div className="px-4 py-2 bg-card rounded-2xl shadow-sm border border-card-border text-[10px] font-black text-muted uppercase tracking-widest">
          AI Pedagogy Engine
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card p-8 rounded-[3rem] border border-card-border shadow-sm space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-black uppercase italic tracking-tight">Design Parameters</h3>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Input your next curriculum objective</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">Lesson Topic</label>
                <input 
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Intro to Quadratic Equations"
                  className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
                />
              </div>

              <div className="p-5 bg-foreground/5 rounded-2xl border border-card-border">
                <p className="text-[8px] font-black text-muted uppercase mb-2">Class Context Active</p>
                <p className="text-xs font-bold">{className} Distribution Loaded</p>
              </div>

              <button 
                onClick={generatePlan}
                disabled={loading || !topic}
                className="w-full bg-foreground text-background py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-accent transition-all active:scale-[0.98] disabled:opacity-30 flex items-center justify-center gap-3"
              >
                {loading ? "Architecting..." : "Generate Scaffolding"}
                <Icon name="bolt" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Output Card */}
        <div className="lg:col-span-8">
          <div className="bg-card rounded-[3rem] border border-card-border shadow-sm min-h-[500px] flex flex-col relative overflow-hidden group">
            <div className="p-8 border-b border-card-border flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest opacity-60">Scaffolding Output</h3>
              <Icon name="grading" className="w-5 h-5 text-muted" />
            </div>

            <div className="flex-1 p-10">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center gap-4 opacity-40">
                  <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black uppercase tracking-widest animate-pulse">Consulting Pedagogical Models...</p>
                </div>
              ) : plan ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-medium text-foreground/90 leading-relaxed text-sm">
                      {plan}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20 grayscale">
                  <Icon name="newspaper" className="w-20 h-20 mb-6" />
                  <p className="text-sm font-black uppercase tracking-widest max-w-xs">Enter a topic to generate a differentiated lesson plan tailored to your class archetypes.</p>
                </div>
              )}
            </div>

            {plan && (
              <div className="p-8 bg-card-muted/30 border-t border-card-border">
                <button 
                  onClick={() => window.print()}
                  className="px-6 py-2 bg-card border border-card-border text-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-card-muted transition-all"
                >
                  Export Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
