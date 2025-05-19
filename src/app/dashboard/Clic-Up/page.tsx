"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Loading from '@/components/Loading';
import App1Sidebar from '@/components/App1Sidebar';

const page = () => {
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

    const [userData, setUserData] = useState<{ año: string; plan: string; calendario: string; grado: string; colegio: string; displayName: string, image: string, email: string } | null>(null);

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
            {userData ? (
                <div className='w-full h-full'>
                    <App1Sidebar />
                </div>

            ) : (
                <Loading />
            )}


        </section>
    )
}

export default page
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/