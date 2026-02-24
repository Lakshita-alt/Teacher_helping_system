"use client"

import UploadForm from "@/component/Uploadcsv"

export default function Home(){
    return(
        <div className="flex items-center justify-center mx-auto my-auto w-[80vw] h-[90vh]">
             <UploadForm />
        </div>
    )
}