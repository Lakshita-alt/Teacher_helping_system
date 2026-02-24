"use server";

import fs from "node:fs/promises"
import path from "path";
import { randomUUID } from "node:crypto";


export async function uploadCsvFile(formData){
    const uniqueName = randomUUID();
    const file  = formData.get("file");
    // console.log(file.name==="undefined")
    if(file.name==="undefined"){
        return{
            err: "file not selected"
        }
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(process.cwd(),"public",String(file.name+String(uniqueName)));
    try{
        // <TODO> -> write the file to db
        await fs.writeFile(filePath,buffer);
        return {
            success:true,
            filePath
        }
    }catch(err){
        console.error(err);
        return {
            err : "Failed to upload"
        }
    }
}