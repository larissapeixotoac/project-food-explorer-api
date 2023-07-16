import tinePolygon from '../assets/tinyPolygon.svg'

export function Footer({ onMenu }: { onMenu: boolean})  {
    return (
        <div className={` flex items-center justify-between px-7 gap-[2.15rem] bg-DARK_600 w-full py-[1.9rem] md:px-16 xl:px-32 
            ${onMenu && 'absolute bottom-0'}           
        `}>
            <div className='flex gap-[0.37rem] items-center'>
                <img src={tinePolygon} alt="tinePolygon" className=' lg:w-[1.9rem] lg:h-[1.9rem]'/>
                <h1 className=' font-ff-secundary font-bold text-base leading-[1.13rem] text-LIGHT_700 lg:text-2xl'>
                    food explorer
                </h1>
            </div>
            <p className=' font-ff-secundary text-xs text-LIGHT_200 lg:text-sm'>
                © 2023 - Todos os direitos reservados.
            </p>
        </div>
    )
}