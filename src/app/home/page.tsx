"use client"
import HomeHeader from '@/components/HomeHeader'
import HomeNav from '@/components/HomeNav'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Home = () => {
    //const router = useRouter();
    //const [user, setUser] = useState<any>(null);
    //useEffect(() => {
    //        const getUser = async () => {
    //            const { data } = await supabase.auth.getUser();
    //            if (data?.user) {
    //                setUser(data.user);
    //            }
    //            else{
    //                router.push("/")
    //            }
    //        };
    //
    //        getUser();
    //    }, [router]);
  return (
    <section className='relative z-[999]'>
        <HomeNav/>
        <HomeHeader user='admin'año='2025' calendario='A' colegio='COLEGIO SAN ANTONIO' grado='Bachillerato'/>
    </section>
    
  )
}

export default Home