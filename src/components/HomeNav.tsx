"use client"
import Image from 'next/image'
import React from 'react'

const HomeNav = () => {
  return (
    <nav className='flex w-dvw justify-between px-24 relative items-center bg-nav h-[70px] z-[999]'>
        <picture>
            <Image className='w-[80.66px] h-[40px]' src={'https://cdn-rstr.stn-neds.com/Logo%20EDU%20H_240px.png'} alt='Logo' width={100} height={100}/>
        </picture>
        <button className='w-[42px] h-[42px] focus:outline-0 cursor-pointer rounded-full mr-[16.4px]'>
            <Image className='rounded-full' src={'https://edu-norma-co.stn-neds.com/home/assets/profile-default.png'} alt='user foto' width={100} height={100}/>
        </button>
    </nav>
  )
}

export default HomeNav