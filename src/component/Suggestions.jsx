"use client"
export default function Suggestion(){

    function ClickRedirect(e){
        window.location.href = "http://localhost:3000/home/teacher"
        return true;
    }

    return(
        <div className="w-full mb-3 px-2">
            <button type="submit" className="w-full py-4 px-2 bg-[#FF9F00] hover:bg-[#E68F00] text-white font-black text-xs uppercase rounded-[15px] 
            shadow-lg shadow-orange-100 active:scale-95 transition-all cursor-pointer"
            onClick={(e)=>ClickRedirect(e)}
            >Suggestion</button>
        </div>
    )
}