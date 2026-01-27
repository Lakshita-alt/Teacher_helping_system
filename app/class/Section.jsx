export function Section({name}){
    return(
        <div className="h-20 w-22  p-2 bg-blue-300 flex justify-center rounded-4xl">
            <button className='bg-none cursor-pointer'
            >{name}</button>
        </div>
    )
}