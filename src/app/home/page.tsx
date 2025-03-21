import HomeHeader from '@/components/HomeHeader'
import HomeNav from '@/components/HomeNav'
import React from 'react'

const Home = () => {
  return (
    <section className='relative z-[999]'>
        <HomeNav/>
        <HomeHeader user='admin'año='2025' calendario='A' colegio='COLEGIO SAN ANTONIO' grado='Bachillerato'/>
    </section>
    
  )
}

export default Home