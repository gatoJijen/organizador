import React from 'react'
import HomeGradient from './HomeGradient'
import HomeWelcome from './HomeWelcome'
import HomeApps from './HomeApps'

interface PropsHomeHeader {
    user: string,
    año: string,
    calendario: string,
    colegio: string,
    grado: string
}

const HomeHeader: React.FC<PropsHomeHeader> = ({ user, año, calendario, colegio, grado }) => {
    return (
        <header>
            <HomeGradient />
            <section className='w-[80dvw] flex flex-col gap-8 items-start pt-[55px] px-20'>
                <HomeWelcome user={user} año={año} calendario={calendario} colegio={colegio} grado={grado} />
                <HomeApps />
            </section>

        </header>
    )
}

export default HomeHeader