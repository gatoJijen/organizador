
/* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars*/
import HomeHeader from '@/components/HomeHeader'
import HomeNav from '@/components/HomeNav'
import { redirect } from "next/navigation";
import { getUserWithRole } from "@/lib/auth";
import React from 'react'

const Home = async () => {
  const user =  await getUserWithRole();
  if (!user) redirect("/");

  // Si el usuario no es "user", "teacher", "admin" o "developer", lo redirige.
  const allowedRoles = ["user", "teacher", "admin", "developer"];
  if (!allowedRoles.includes(user.role)) redirect("/");
  return (
    <section className='relative z-[999]'>
        <HomeNav/>
        <HomeHeader user='admin'año='2025' calendario='A' colegio='COLEGIO SAN ANTONIO' grado='Bachillerato'/>
    </section>
    
  )
}

export default Home

/* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars*/