"use client"
export default function Suggestion(){

    function ClickRedirect(e){
        window.location.href = "http://localhost:3000/home/teacher"
        return true;
    }

    return(
        <div className="w-full mb-3">
            <button type="button" className="w-full py-4 px-6 bg-white hover:bg-slate-50 text-slate-700 border border-slate-100 font-bold text-sm uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer text-left"
            onClick={(e)=>ClickRedirect(e)}
            ><span className="mr-2">💡</span> Suggestion</button>
        </div>
    )
}