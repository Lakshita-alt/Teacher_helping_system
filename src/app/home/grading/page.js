"use client"
import { useState } from "react";

export default function AutomatedGrading() {
  const [type, setType] = useState("essay");
  const [content, setContent] = useState("");
  const [rubric, setRubric] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGrade = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/ai/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, content, rubric })
      });
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Grading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic leading-none">Automated Grading</h1>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-2">AI-Powered Assessment & Feedback</p>
        </div>
        <div className="flex gap-2">
          {["essay", "short-answer"].map(t => (
            <button 
              key={t}
              onClick={() => { setType(t); setResult(null); }}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                type === t ? 'bg-foreground text-background border-foreground shadow-lg' : 'bg-card text-muted border-card-border hover:border-muted'
              }`}
            >
              {t.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Card */}
        <div className="bg-card p-10 rounded-[3rem] border border-card-border shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">
              {type === 'essay' ? 'Essay Rubric / Guidelines' : 'Correct Answer / Context'}
            </label>
            <input 
              type="text" 
              value={rubric}
              onChange={(e) => setRubric(e.target.value)}
              placeholder={type === 'essay' ? "Focus on: grammar, logic, evidence..." : "What was the question and correct answer?"}
              className="w-full bg-card-muted border border-card-border rounded-2xl py-4 px-6 text-sm font-bold text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="px-2 text-[10px] font-black text-muted uppercase tracking-widest">Student Submission</label>
            <textarea 
              rows={type === 'essay' ? 12 : 6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste student text here..."
              className="w-full bg-card-muted border border-card-border rounded-[2rem] py-6 px-8 text-sm font-medium text-foreground outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent transition-all resize-none leading-relaxed"
            />
          </div>

          <button 
            disabled={loading || !content.trim()}
            onClick={handleGrade}
            className="w-full bg-foreground text-background font-black py-5 rounded-2xl hover:bg-accent transition-all uppercase tracking-[0.2em] text-xs shadow-xl disabled:opacity-30 active:scale-[0.98]"
          >
            {loading ? "Processing AI Analysis..." : "Grade with Gemini AI"}
          </button>
        </div>

        {/* Results Card */}
        <div className="space-y-6 min-h-[400px]">
          {loading ? (
            <div className="h-full bg-card rounded-[3rem] border border-card-border flex flex-col items-center justify-center p-12 text-center animate-pulse">
                <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-6"></div>
                <h4 className="text-lg font-black uppercase italic">AI Grader is thinking...</h4>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-2">Analyzing grammar, structure and reasoning</p>
            </div>
          ) : result ? (
            <div className="bg-card p-10 rounded-[3rem] border border-card-border shadow-sm space-y-8 animate-in zoom-in-95 duration-500">
               <div className="flex items-center justify-between border-b border-card-border pb-8">
                  <div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight leading-none mb-1">Assessment Complete</h3>
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest">Feedback Generated Successfully</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-black text-foreground">{result.score}</span>
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest">Total Score</span>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-3">AI Constructive Feedback</h4>
                    <p className="text-sm font-medium text-muted leading-relaxed italic">{result.feedback}</p>
                  </div>

                  {result.strengths && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl">
                           <h5 className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-3">Core Strengths</h5>
                           <ul className="space-y-2">
                             {result.strengths.map((s, i) => <li key={i} className="text-xs font-bold text-muted flex gap-2"><span>✨</span> {s}</li>)}
                           </ul>
                        </div>
                        <div className="bg-rose-500/5 border border-rose-500/10 p-6 rounded-3xl">
                           <h5 className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-3">Growth Areas</h5>
                           <ul className="space-y-2">
                             {result.improvements.map((s, i) => <li key={i} className="text-xs font-bold text-muted flex gap-2"><span>🎯</span> {s}</li>)}
                           </ul>
                        </div>
                    </div>
                  )}
               </div>

               <button 
                  onClick={() => window.print()}
                  className="w-full py-4 bg-card-muted border border-card-border rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-card transition-colors flex items-center justify-center gap-2"
                >
                  📥 Export Report
                </button>
            </div>
          ) : (
            <div className="h-full bg-card-muted/30 rounded-[3rem] border-2 border-dashed border-card-border flex flex-col items-center justify-center p-12 text-center opacity-60">
                <span className="text-6xl mb-6 grayscale">📋</span>
                <h4 className="text-lg font-black uppercase italic">Ready for Assessment</h4>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-2">Input student content to begin auto-grading</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
