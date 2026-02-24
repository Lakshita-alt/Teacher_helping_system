"use client"
export default function SchoolSummary(){
    function ClickRedirect(e){
        window.location.href= "http://localhost:3000/admin/school"
        return true;
    }
    return(
        <div className="w-full mb-3">
            <button type="button" className="w-full py-4 px-6 bg-button-bg hover:bg-button-hover text-button-text border border-sidebar-border font-bold text-sm uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer text-left" onClick={(e)=>ClickRedirect(e)}>
                <span className="mr-2">🏫</span> Overview
            </button>
        </div>
    )
}