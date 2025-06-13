/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { useTheme } from '@/hooks/useTheme';
import Image from 'next/image';
import React, { useState } from 'react'

interface PropsApp1Nav {
    title: string;
    user: string,
    año: string,
    calendario: string,
    colegio: string,
    grado: string,
    plan: string,
    image: string;
    email: string;
    categoria: string;
}

const App1Nav = ({ title, user, año, calendario, colegio, grado, plan, image, email, categoria }: PropsApp1Nav) => {
    const { theme, toggleTheme } = useTheme();
    const [abrir, setAbrir] = useState(false)
    const [hover1, setHover1] = useState(false)
    const [hover2, setHover2] = useState(false)
    const togglehover1 = () => setHover1(!hover1)
    const togglehover2 = () => setHover2(!hover2)
    const toggleModal = () => setAbrir(!abrir)
    return (
        <nav className='w-[100%] flex h-[56px] px-[20px] justify-between items-center bg-app1-nav'>
            <section>
                <h1 className='text-2xl font-medium secondary-text'>{title == "" ? "Hola" + ", " + user : title}</h1>
            </section>
            <section>
                <span className='relative'>
                    <button onClick={toggleModal} className='w-[42px] h-[42px] focus:outline-0 cursor-pointer rounded-full mr-[16.4px]'>
                        <Image className='rounded-full' src={image} alt='user foto' width={100} height={100} />

                    </button>
                    {abrir ? (
                        <>
                        <ul className='text-decoration-none bg-background-2 px-4 w-[24svw] min-w-[15rem] rounded-lg list-none flex flex-col absolute top-[3svh] py-[1rem] right-[-14px] gap-2 justify-center z-[9999] '>
                            <li className=' secondary-text flex gap-4 items-center border-b-1 py-1 border-secondary-color-60'>
                                <article>
                                    <Image className='rounded-full' src={image} alt='user foto' width={50} height={50} />
                                </article>
                                <article>
                                    <p className='text-xl font-bold'>{user}</p>
                                    <p className='text-lg font-medium secondary-text opacity-60'>{categoria}</p>
                                </article>
                            </li>
                            <li className=' secondary-text flex gap-4 items-center border-b-1 py-1 border-secondary-color-60'>
                                <article>
                                    <p className='text-base font-medium'>COLEGIO {colegio}</p>
                                </article>
                            </li>
                            
                        </ul>
                        <div onClick={toggleModal} className='bg-black/20 absolute  h-[100svh] w-[100svw] right-[-1.5svw] top-[-5svh] z-[999]'></div>
                        </>
                    ) : <div className='absolute hidden opacity-0'></div>

                    }

                </span>

            </section>
        </nav>
    )
}

export default App1Nav
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/