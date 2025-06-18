
"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import HomeHeader from '@/components/HomeHeader'
import HomeNav from '@/components/HomeNav'
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Loading from '@/components/Loading';


const Home = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    const [user, setUser] = useState<any>(null);
    const [uid, setUid] = useState("")
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const redirect = (url: string) => {
        router.push(url);
    };



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setUid(currentUser?.uid || "");
            if (!currentUser) {
                redirect("/")
            }
        });



        return () => unsubscribe();
    }, []);

    const [userData, setUserData] = useState<{ año: string; plan: string; calendario: string; grado: string; colegio: string; displayName: string, image: string, email: string, categoria: string } | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("uid", "==", uid));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    const docData = querySnapshot.docs[0].data();
                    setUserData({
                        email: docData.email,
                        año: docData.año || "",
                        calendario: docData.calendario || "",
                        grado: docData.grado || "",
                        colegio: docData.colegio || "",
                        displayName: docData.displayName || "",
                        image: docData.image || "",
                        plan: docData.plan || "test",
                        categoria: docData.categoria || "",
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
            <HomeNav user={userData?.displayName || "Cargando..."} email={userData?.email || userData?.displayName || "Cargando"} image={userData?.image || "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"} />
            {userData ? (
                <HomeHeader user={userData.displayName} año={userData.año} calendario={userData.calendario} colegio={userData.colegio} grado={userData.grado} categoria={userData.categoria} />

            ) : (
                <Loading/>
            )}
            

        </section>

    )
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

export default Home