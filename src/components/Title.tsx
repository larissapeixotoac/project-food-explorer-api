import Polygon from '../assets/polygon.svg'

export function Title() {
    return (
        <div className='flex items-center gap-[0.69rem] md:gap-5  '>
            <img 
                src={Polygon} 
                alt=""
            />
            <h1
                className={` font-ff-secundary font-bold text-4xl leading-[2.815rem] md:text-[2.815rem] md:leading-[3.065rem]`}
            >
                food explorer
            </h1>
        </div>
    )
}