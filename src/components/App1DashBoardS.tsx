/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */


import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const App1DashBoardS = () => {

    const [homeworksCount, setHomeworksCount] = useState<number | null>(null);

    const [uid, setUid] = useState("")


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {

            setUid(currentUser?.uid || "");
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!uid) return;

        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                const homeworksCount = Array.isArray(userData.homeworks) ? userData.homeworks.length : 0;

                setHomeworksCount(homeworksCount);
            } else {
                console.log("Documento no encontrado");
                setHomeworksCount(null);
            }
        }, (error) => {
            console.error("Error en onSnapshot:", error);
        });

        return () => unsubscribe();
    }, [uid]);

    return (
        <section className="secondary-text  flex-col bg-background-2 rounded-xl shadow-xl py-4 flex gap-4 px-4 justify-center">
            <Link href="/app1" className='flex gap-[30px] items-center'>
                <Image className='opacity-70' src='/Homeworks1.svg' alt='' width={26} height={26} />
                <h2 className='secondary-text font-bold text-lg'>Tareas</h2>
            </Link>
            <Link href="/app1" className='flex items-center justify-center'>
                <section className='border-r-black/20 border-r-[1px] border-l-black/20 border-l-[1px] px-5 flex flex-col items-center'>
                    <p className='text-stroke font-semibold'>Por hacer</p>
                    <h3 className='text-2xl font-medium'>{homeworksCount}</h3>
                </section>
            </Link>
        </section>
    )
}

export default App1DashBoardS
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

