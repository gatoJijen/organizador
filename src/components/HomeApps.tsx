$ESLINT_COMMENTS


import React from 'react'
import App from './App1'

interface PropsHomeApps {
    categoria: string
}

const HomeApps: React.FC<PropsHomeApps> = ({ categoria }) => {
  return (
    <article className='relative  z-10'>
        <h1 className='primary-text font-bold text-[23px]'>Todas las aplicaciones</h1>
        <div className='w-[90dvw] h-[full] flex pb-4 justify-start py-4 px-2 gap-4 overflow-x-auto overflow-y-hidden items-center'>
          {categoria === "user" ? (
            <>
            <App />
            </>
        ) : (
            <div className='bg-secondary rounded-full text-white text-lg px-3 py-1'>
                <p>gratis</p>
            </div>
        )}
        </div>
        
    </article>
  )
}

export default HomeApps/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
