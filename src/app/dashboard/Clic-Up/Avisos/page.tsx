"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/


import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import App1Sidebar from '@/components/App1Sidebar';
import App1Nav from '@/components/App1Nav';
import App1Dashboard from '@/components/App1Dashboard';
import Loading from '@/components/Loading';
import App1Avisos from '@/components/App1Avisos';
const Page = () => {
    const [user, setUser] = useState<any | null>(null);
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
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [redirect]); // redirect is needed for auth state changes

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
    }, [uid]); // uid is the only dependency for fetching user data
    return (
        <section className='relative z-[999] bg-background-2'>
            {userData ? (
                <div className='w-[100svw] flex h-[100svh] overflow-x-hidden overflow-y-auto'>
                    <App1Sidebar Avisos={true} />
                    <section className="flex flex-col w-[100%] ">
                        <App1Nav title="Avisos" user={userData.displayName} año={userData.año} calendario={userData.calendario} colegio={userData.colegio} grado={userData.grado} plan={userData.plan} image={userData.image} email={userData.email} categoria={userData.categoria} />
                        <App1Avisos plan={userData.plan} categoria={userData.categoria}/>
                    </section>

                </div>

            ) : (
                <Loading />
            )}


        </section>
    )
}

export default Page
