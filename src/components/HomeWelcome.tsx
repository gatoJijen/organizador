import React from 'react'

interface PropsHomeWelcome {
    user:string,
    año: string,
    calendario:string,
    colegio: string,
    grado:string
}


const HomeWelcome:React.FC<PropsHomeWelcome> = ({user, año, calendario, colegio, grado}) => {
    return (
        <article className='z-10 relative items-start flex flex-col gap-[16px] '>
            <p className=' text-P primary-text'>Hola, <strong>{user}</strong></p>
            <span className='text-[11px] bg-span primary-text-40 py-[4px] px-4 rounded-lg'>{año} Calendario {calendario} | {colegio} | {grado}</span>
        </article>
    )
}

export default HomeWelcome