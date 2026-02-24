"use client"
import { useRouter } from "next/navigation";

export default function StudentSummary(){

    const router = useRouter();
    function ClickRedirect(){
        router.push("/home/student")
        // window.location.href= "http://localhost:3000/home/student"
        // return true;
    }
    return(
        <div className="w-full mb-3">
            <button type="button" className="w-full py-4 px-6 bg-button-bg hover:bg-button-hover text-button-text border border-sidebar-border font-bold text-sm uppercase tracking-wider rounded-2xl shadow-sm hover:shadow-md active:scale-[0.98] transition-all cursor-pointer text-left" onClick={(e)=>ClickRedirect(e)}>
                <span className="mr-2">👤</span> Student
            </button>
        </div>
    )
}