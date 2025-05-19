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
}

const App1Nav = ({ title, user, año, calendario, colegio, grado, plan, image, email }: PropsApp1Nav) => {
    const { theme, toggleTheme } = useTheme();
    const [abrir, setAbrir] = useState(false)
    const [hover1, setHover1] = useState(false)
    const [hover2, setHover2] = useState(false)
    const togglehover1 = () => setHover1(!hover1)
    const togglehover2 = () => setHover2(!hover2)
    const toggleModal = () => setAbrir(!abrir)
    return (
        <nav>
            <section>
                <h1 className='text-2xl font-semibold secondary-text'>{title}</h1>
            </section>
            <section>
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
                            
                        </ul>
                    ) : <div className='absolute hidden opacity-0'></div>

                    }

                </span>

            </section>
        </nav>
    )
}

export default App1Nav