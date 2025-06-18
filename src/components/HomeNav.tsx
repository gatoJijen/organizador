"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import Image from 'next/image'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
import { IoMoon, IoMoonOutline, IoSunny, IoSunnyOutline } from "react-icons/io5";
import { FiLogOut } from 'react-icons/fi';
import { useTheme } from '@/hooks/useTheme';

interface PropsHomeNav {
  image: string;
  user: string;
  email: string;
}

const HomeNav: React.FC<PropsHomeNav> = ({ image, user, email }) => {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter()

  


  const handleLogout = async () => {
    try {
      // Cerrar sesión en Firebase
      await signOut(auth);

      // Limpiar los datos de autenticación en localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");

      // Redirigir a la página de inicio ("/")
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const [abrir, setAbrir] = useState(false)
  const [hover1, setHover1] = useState(false)
  const [hover2, setHover2] = useState(false)
  const togglehover1 = () => setHover1(!hover1)
  const togglehover2 = () => setHover2(!hover2)
  const toggleModal = () => setAbrir(!abrir)

  return (
    <nav className='flex w-dvw justify-between px-24 relative items-center bg-nav h-[70px] z-[999]'>
      <picture>
        <Image className='w-[80.66px] h-[40px]' src={'https://cdn-rstr.stn-neds.com/Logo%20EDU%20H_240px.png'} alt='Logo' width={100} height={100} />
      </picture>
      <span className='relative'>
        <button onClick={toggleModal} className='w-[42px] h-[42px] focus:outline-0 cursor-pointer rounded-full mr-[16.4px]'>
          <Image className='rounded-full' src={image} alt='user foto' width={100} height={100} />

        </button>
        {abrir ? (
          <ul className='text-decoration-none bg-toolbar min-w-[15rem] rounded-lg list-none flex flex-col absolute top-[10.5svh] py-[1rem] right-[-12px] gap-2 justify-center  '>
            <li className=' text-white  flex flex-col items-center '>
              <p className='text-lg font-bold'>{user}</p>
              <p className='text-base text-white/60'>{email}</p>
            </li>
            <li onClick={toggleTheme} onMouseEnter={togglehover1} onMouseLeave={togglehover1} className={`flex items-center gap-[1rem] ${hover1 ? 'bg-white/90 htoolbar-text text-black' : 'text-white toolbar-text'}transition-all  cursor-pointer  px-5 h-10`}>{theme === 'light' ? (hover1? <IoSunny size={30}  color='black'/> : <IoSunnyOutline  size={30} color='white' />):(hover1? <IoMoon className='mb-1 ml-1' size={24} color='black' />: <IoMoonOutline className='mb-1 ml-1' size={28} color='white' />)}
            {theme === 'light' ? ' Modo Claro' : ' Modo Oscuro'}</li>
            <li onClick={handleLogout} onMouseEnter={togglehover2} onMouseLeave={togglehover2} className={`h-10 cursor-pointer  px-5 flex items-center gap-[1rem] ${hover2 ? ' bg-white/90 htoolbar-text text-black' : 'text-white toolbar-text'}transition-all `}>{hover2? <FiLogOut size={30} color='black'/> : <FiLogOut size={30} color='white'/> }Salir</li>
          </ul>
        ) : <div className='absolute hidden opacity-0'></div>

        }

      </span>

    </nav >
  )
}

export default HomeNav
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
