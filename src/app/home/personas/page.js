"use client"
import { Icon } from "@/component/Icons";

const ARCHETYPES = [
  {
    id: "avg-low",
    name: "Average but Low-Engagement Learner",
    dynamic: "Passive Resilience",
    description: "Students who maintain a baseline passing grade but exhibit high cognitive detachment during active instruction.",
    strengths: ["Task completion consistency", "Quiet social presence", "Adherence to rules"],
    hurdles: ["Conceptual depth gaps", "Low participation in peer activities", "Fragile motivation spikes"],
    strategy: "Requires 'Micro-Incentivization' and frequent check-ins to bridge the gap between passive listening and active synthesis.",
    icon: "search",
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  {
    id: "well-supported",
    name: "Well-Supported Consistent Learner",
    dynamic: "High Scaffolding Equilibrium",
    description: "Highly stable students who benefit from robust external resources and tutoring, leading to consistent performance.",
    strengths: ["Strong foundational knowledge", "High support-seeking behavior", "Resilient exam performance"],
    hurdles: ["Potential over-reliance on external help", "Risk of burnout during high-complexity phases"],
    strategy: "Transition from 'Instructional Scaffolding' to 'Independent Inquiry' to build long-term metacognitive autonomy.",
    icon: "shield",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10"
  },
  {
    id: "motivated-under",
    name: "Motivated but Under-Resourced Learner",
    dynamic: "Fragile Momentum",
    description: "Students with high intrinsic drive but limited access to external study resources or tutoring support.",
    strengths: ["High intrinsic motivation", "Adaptive problem solving", "Determination"],
    hurdles: ["Resource-access fatigue", "Higher risk during rapid curriculum acceleration", "Limited peer-mentorship network"],
    strategy: "Prioritize 'Equity-Based Resource Allocation'—provide school-funded tutoring or open-access digital libraries.",
    icon: "bolt",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10"
  }
];

export default function PersonaDirectory() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 font-mono text-foreground pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">Persona Lexicon</h1>
          <p className="text-muted font-bold text-xs uppercase tracking-widest mt-2 italic">A Directory of Learning Archetypes & Pedagogical Strategies</p>
        </div>
        <div className="px-4 py-2 bg-card rounded-2xl shadow-sm border border-card-border text-[10px] font-black text-muted uppercase tracking-widest">
          Interpretability Standard v1.0
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {ARCHETYPES.map((type) => (
          <div key={type.id} className="bg-card rounded-[3rem] border border-card-border p-10 flex flex-col hover:shadow-xl dark:shadow-none transition-all duration-500 group">
            <div className={`w-16 h-16 ${type.bg} ${type.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              <Icon name={type.icon} className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-black tracking-tight mb-2 leading-none">{type.name}</h2>
            <div className="flex items-center gap-2 mb-6">
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${type.bg} ${type.color}`}>
                Dynamic: {type.dynamic}
              </span>
            </div>

            <p className="text-sm font-medium text-muted leading-relaxed mb-8">
              {type.description}
            </p>

            <div className="space-y-6 mt-auto">
              <div>
                <h3 className="text-[10px] font-black uppercase text-foreground mb-3 tracking-widest border-b border-card-border pb-1">Core Strengths</h3>
                <ul className="space-y-2">
                  {type.strengths.map((s, i) => (
                    <li key={i} className="text-xs font-bold text-foreground/70 flex gap-2">
                      <span className={type.color}>•</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-[10px] font-black uppercase text-rose-500 mb-3 tracking-widest border-b border-rose-500/10 pb-1">Pedagogical Hurdles</h3>
                <ul className="space-y-2">
                  {type.hurdles.map((h, i) => (
                    <li key={i} className="text-xs font-bold text-foreground/70 flex gap-2">
                      <span className="text-rose-500">•</span> {h}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 bg-foreground/5 rounded-2xl border border-card-border">
                <h3 className="text-[10px] font-black uppercase text-accent mb-2 tracking-widest">Recommended Scaffolding</h3>
                <p className="text-xs font-bold leading-relaxed italic">
                  &quot;{type.strategy}&quot;
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
