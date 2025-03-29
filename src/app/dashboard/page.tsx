"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars*/
import HomeHeader from '@/components/HomeHeader'
import HomeNav from '@/components/HomeNav'
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'

const Home = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  const [user, setUser] = useState<any>(null);
  const [uid, setUid] = useState("")
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          setUid(currentUser?.uid || "");
      });

      return () => unsubscribe();
  }, []);
  
  const [userData, setUserData] = useState<{ año: string; calendario: string; grado: string; colegio: string; displayName: string } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    setUserData({
                        año: docData.año || "",
                        calendario: docData.calendario || "",
                        grado: docData.grado || "",
                        colegio: docData.colegio || "",
                        displayName: docData.displayName || ""
                    });
                }
            } catch (error) {
                console.error("Error obteniendo datos del usuario:", error);
            }
        };

        if (uid) {
            fetchUserData();
        }
    }, [uid]);

  return (
    <section className='relative z-[999]'>
        <HomeNav/>
        {userData ? (
                    <HomeHeader user={userData.displayName}año={userData.año} calendario={userData.calendario} colegio={userData.colegio} grado={userData.grado}/>
                    
            ) : (
                    <HomeHeader user="Cargando ..." año="..." calendario="..." colegio="..." grado="..."/>
            )}
        
    </section>
    
  )
}

export default Home

/* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars*/