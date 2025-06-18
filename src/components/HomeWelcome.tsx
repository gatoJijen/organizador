/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React from 'react'
import { Mulish } from 'next/font/google'

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['200','300', '400', '700', '800'], // según lo que necesites
  variable: '--font-mulish',
})

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
            <p className={`${mulish.className}  font-extralight text-P primary-text`}>Hola, <strong className={`${mulish.className} font-extrabold`}>{user}</strong></p>
            <span className='text-[11px] bg-span primary-text-40 py-[4px] px-4 rounded-lg'>{año} Calendario {calendario} | COLEGIO {colegio} | {grado}</span>
        </article>
    )
}

export default HomeWelcome
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
