import SchoolSummary from "@/component/admin/SchoolSummary";
import ClassBasedAdminSummary from "@/component/admin/ClassBasedOverView";
import StudentBasedAdminSummary from "@/component/admin/SteudentBasedSummary";

export default function AdminLayout({children}) {
  return (
    <div className="flex h-screen bg-background text-foreground w-full overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="w-full md:w-[22vw] lg:w-[18vw] xl:w-[15vw] min-w-[260px] p-6 bg-sidebar border-r border-sidebar-border flex flex-col gap-2 h-full overflow-y-auto shrink-0">
        <div className="mb-10 px-2 mt-4">
          <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase italic leading-none">Admin Panel</h2>
          <p className="text-[10px] font-bold opacity-50 uppercase tracking-widest mt-2">Management Suite</p>
        </div>
        <div className="flex flex-col gap-1">
          <SchoolSummary />
          <ClassBasedAdminSummary />
          <StudentBasedAdminSummary />  
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
