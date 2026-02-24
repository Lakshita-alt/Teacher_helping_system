"use client"
 
export default function SingleClassOverview({ClsInfo}){ // you have to wrap the prop in {}
    return(
        <div className="w-30vw h-10vh flex ">
            <div>
                {ClsInfo.className}
                Graph
            </div>
            {/* // bargraph */}
            <div>
                {ClsInfo.one}
                {ClsInfo.two}
                {ClsInfo.three}
                {ClsInfo.four}
            </div>
        </div>
    )
}