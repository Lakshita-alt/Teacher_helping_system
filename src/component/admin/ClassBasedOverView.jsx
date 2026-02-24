"use client"
export default function ClassBasedAdminSummary(){
    function ClickRedirect(e){
        window.location.href= "http://localhost:3000/admin/class"
        return true;
    }
    return(
        <div className="w-full mb-3 px-2">
            <button type="submit" className="w-fit py-4 px-2 bg-[#FF9F00] hover:bg-[#E68F00] text-white font-black uppercase rounded-[15px] shadow-lg shadow-orange-100 
            active:scale-95 transition-all cursor-pointer" onClick={(e)=>ClickRedirect(e)}>Class</button>
        </div>
    )
}