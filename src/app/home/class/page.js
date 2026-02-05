export default function Class(){
    return(
        <div className="m-10 ml-20 h-fit w-fit">
            <div className="flex justify-start gap-12 ">
                <div className="w-40 h-30 bg-pink-300 rounded-2xl p-1 text-center">
                    <h2>Class Size</h2>
                </div>
                <div className="w-40 h-30 bg-pink-300 rounded-2xl p-1 text-center">
                    <h2>High Risk Students</h2>
                </div>
                <div className="w-40 h-30 bg-pink-300 p-1 text-center rounded-2xl">
                    <h2>Medium Risk Students</h2>
                </div>
                <div className="w-40 h-30 bg-pink-300 rounded-2xl p-1 text-center">
                    <h2>Low Risk Students</h2>
                </div>
            </div>
            <div className = "w-200 mt-15 bg-pink-300 h-40 rounded-l-2xl p-2">
                Risk Distribution 
            </div>
            <div className = "w-200 mt-15 bg-pink-300 h-40 rounded-l-2xl p-2">
                Class Learning Personas  
            </div>
        </div>
    )
}