"use client"

export default function ClassOverviewModal({prop}){
    return(
        <div>
            <div>Piechart</div>
            <div>
                <div>Persona 1:  {prop.one}</div>
                <div>Persona 2 : {prop.two}</div>
                <div>Persona 3 : {prop.three}</div>
                <div>Persona 4 : {prop.four}</div>
                <div>Total Students : {prop.one+prop.four+prop.two+prop.three}</div>
            </div>
            <div>
                AI Suggestion BOX here
            </div>
        </div>
    )
}