import ClassSummary from "@/component/teacher/ClassSummary"
import StudentSummary from "@/component/teacher/StudentSummary"
import Suggestion from "@/component/teacher/Suggestions"

export default function HomeLayout({children}) {
  return (
    <div className="flex h-screen bg-[#f5f2ed] w-full overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-full md:w-[22vw] lg:w-[18vw] xl:w-[15vw] min-w-[260px] p-6 bg-white border-r border-slate-200/50 flex flex-col gap-2 h-full overflow-y-auto shrink-0">
        <div className="mb-10 px-2 mt-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Teacher App</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Analysis Hub</p>
        </div>
        <div className="flex flex-col gap-1">
          <ClassSummary />
          <StudentSummary />
          <Suggestion />
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
