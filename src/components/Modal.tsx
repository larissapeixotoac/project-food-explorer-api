
export const Modal = ({message} : { message: string | undefined }) => {  
    return (        
        <div className=" bg-DARK_700 rounded-lg py-10 px-5 flex flex-col items-center max-w-full flex-wrap text-center shadow-md">
            <h1 className="font-medium text-[2rem] leading-[140%] text-LIGHT_300 ">Aviso</h1>
            <p className=" pt-8 border-t border-t-DARK_MIL">
                {message} 
            </p>
            
        </div>
            
        
    )
}