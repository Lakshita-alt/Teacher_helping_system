"use client"

import { uploadCsvFile } from "../../server/csv"

export default function UploadForm(){
    return(
        <form action={uploadCsvFile}>
            <input type="file" name="file" accept=".csv" className="bg-gray-300 cursor-crosshair"/>
            <button type="submit" className="bg-amber-300 m-1 p-2 rounded-2xl cursor-progress">Upload CSV</button>
        </form>
    )
}