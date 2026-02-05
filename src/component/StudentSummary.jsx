"use client"
export default function StudentSummary(){
    function ClickRedirect(e){
        window.location.href= "http://localhost:3000/home/student"
        return true;
    }
    return(
        <div>
            <button className="bg-amber-300 m-1 p-2 rounded-2xl cursor-pointer" onClick={(e)=>ClickRedirect(e)}>Student</button>
        </div>
    )
}