/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/


import React from 'react'
import Image from 'next/image'
import { FaRegHeart } from 'react-icons/fa6';
import Link from 'next/link'
const App = () => {
  return (
    <Link href='/dashboard/Clic-Up' className='w-[156.47px] overflow-hidden flex flex-col gap-2 flex-shrink-0 z-[9999] cursor-pointer relative'>
      <header className='overflow-hidden rounded-xl relative'>
        <button className='absolute w-[28px] h-[29px] rounded-full flex items-center justify-center bg-heart z-[999] top-4 right-3'>
          <FaRegHeart size={14} className='' />
        </button>
        <Image src='https://cdn-rstr.stn-neds.com/EDUCA-background_300x600px.png' alt='Norma click up' className='w-[160px] h-[250px] z-[99] rounded-xl' width={156.47} height={250} />
        <div className='absolute top-0 z-[99] bg-gradientHeart  w-[156.47px] h-[250px]'></div>
        <div className='bg-white z-[999] w-[140%] absolute bottom-[0px] object-cover left-[0] rounded-t-[120%] h-[30%] translate-x-[-14%] overflow-hidden'>
          <Image src='https://cdn-rstr.stn-neds.com/normaclic_edu_co.png' alt='Norma click up' className='w-[126px] h-[90px] absolute bottom-[-6px] left-[40px] z-[99] rounded-xl' width={126} height={90} />
        </div>
      </header>
      <footer className='relative bottom-0 z-[999] w-full'>
        <p className='primary-text font-bold text-[16px]'>Norma Clic Up</p>
      </footer>
    </Link>
  )
}

export default App/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
