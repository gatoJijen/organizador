import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase/config';

const auth = getAuth();



const App1DashboardH = () => {
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
    
                const newsCount = Array.isArray(userData.newNews) ? userData.newNews.length : 0;
                const eventsCount = Array.isArray(userData.newEvents) ? userData.newEvents.length : 0;
                const chatsCount = Array.isArray(userData.newChats) ? userData.newChats.length : 0;
    
                setNewNewsCount(newsCount);
                setNewEventsCount(eventsCount);
                setNewChatsCount(chatsCount);
            } else {
                console.log("Documento no encontrado");
                setNewNewsCount(null);
                setNewEventsCount(null);
                setNewChatsCount(null);
            }
        }, (error) => {
            console.error("Error en onSnapshot:", error);
        });
    
        return () => unsubscribe();
    }, [uid]);
    
    const [newNewsCount, setNewNewsCount] = useState<number | null>(null);
    const [newEventsCount, setNewEventsCount] = useState<number | null>(null);
    const [newChatsCount, setNewChatsCount] = useState<number | null>(null);
   

    return (
        <header className="secondary-text flex-wrap bg-lighter py-4 flex gap-4 px-4 rounded-xl shadow-xl items-center">
            <button className='w-[345px]  h-[55px] cursor-pointer bg-background-2 shadow-lg rounded-lg flex flex-row gap-2 items-center px-4'>
                <Link className='flex justify-between items-center w-full' href="/dashboard">
                    <section className='flex gap-8'>
                        <picture className='color-stroke'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-color w-[26px] h-[26px]" viewBox="0 0 512 512">
                                <path d="M48 176v.66a17.38 17.38 0 01-4.2 11.23v.05C38.4 194.32 32 205.74 32 224c0 16.55 5.3 28.23 11.68 35.91A19 19 0 0148 272a32 32 0 0032 32h8a8 8 0 008-8V152a8 8 0 00-8-8h-8a32 32 0 00-32 32zM452.18 186.55l-.93-.17a4 4 0 01-3.25-3.93V62c0-12.64-8.39-24-20.89-28.32-11.92-4.11-24.34-.76-31.68 8.53a431.18 431.18 0 01-51.31 51.69c-23.63 20-46.24 34.25-67 42.31a8 8 0 00-5.15 7.47V299a16 16 0 009.69 14.69c19.34 8.29 40.24 21.83 62 40.28a433.74 433.74 0 0151.68 52.16 26.22 26.22 0 0021.1 9.87 33.07 33.07 0 0010.44-1.74C439.71 410 448 399.05 448 386.4V265.53a4 4 0 013.33-3.94l.85-.14C461.8 258.84 480 247.67 480 224s-18.2-34.84-27.82-37.45zM240 320V152a8 8 0 00-8-8h-96a8 8 0 00-8 8v304a24 24 0 0024 24h52.45a32.66 32.66 0 0025.93-12.45 31.65 31.65 0 005.21-29.05c-1.62-5.18-3.63-11-5.77-17.19-7.91-22.9-18.34-37.07-21.12-69.32A32 32 0 00240 320z">
                                </path>
                            </svg>
                        </picture>
                        <p className='secondary-text font-bold text-lg'>Avisos</p>
                    </section>
                    <section className='flex'>
                        <h1 className='text-2xl font-medium'>{newNewsCount}</h1>
                    </section>

                </Link>
            </button>
            <button className='w-[345px] h-[55px] cursor-pointer bg-background-2 shadow-lg rounded-lg flex gap-2 items-center px-4'>
                <Link className="flex justify-between items-center w-full" href="/dashboard">
                    <section className='flex gap-8'>
                        <picture className='color-stroke'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-color w-[26px] h-[26px]" viewBox="0 0 512 512">
                                <path d="M480 128a64 64 0 00-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4zM32 416a64 64 0 0064 64h320a64 64 0 0064-64V180a4 4 0 00-4-4H36a4 4 0 00-4 4z">
                                </path>
                            </svg>
                        </picture>
                        <p className='secondary-text font-bold text-lg'>Eventos</p>
                    </section>
                    <section className='flex'>
                        <h1 className='text-2xl font-medium'>{newEventsCount}</h1>
                    </section>
                </Link>
            </button>
            <button className='w-[345px] h-[55px] cursor-pointer bg-background-2 shadow-lg rounded-lg flex gap-2 items-center px-4'>
                <Link className="flex justify-between items-center w-full" href="/dashboard">
                    <section className='flex gap-8'>
                        <picture className='color-stroke'>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-color w-[26px] h-[26px]" viewBox="0 0 512 512">
                                <path d="M60.44 389.17c0 .07 0 .2-.08.38.03-.12.05-.25.08-.38zM439.9 405.6a26.77 26.77 0 01-9.59-2l-56.78-20.13-.42-.17a9.88 9.88 0 00-3.91-.76 10.32 10.32 0 00-3.62.66c-1.38.52-13.81 5.19-26.85 8.77-7.07 1.94-31.68 8.27-51.43 8.27-50.48 0-97.68-19.4-132.89-54.63A183.38 183.38 0 01100.3 215.1a175.9 175.9 0 014.06-37.58c8.79-40.62 32.07-77.57 65.55-104A194.76 194.76 0 01290.3 32c52.21 0 100.86 20 137 56.18 34.16 34.27 52.88 79.33 52.73 126.87a177.86 177.86 0 01-30.3 99.15l-.19.28-.74 1c-.17.23-.34.45-.5.68l-.15.27a21.63 21.63 0 00-1.08 2.09l15.74 55.94a26.42 26.42 0 011.12 7.11 24 24 0 01-24.03 24.03z">
                                </path>
                                <path d="M299.87 425.39a15.74 15.74 0 00-10.29-8.1c-5.78-1.53-12.52-1.27-17.67-1.65a201.78 201.78 0 01-128.82-58.75A199.21 199.21 0 0186.4 244.16C85 234.42 85 232 85 232a16 16 0 00-28-10.58s-7.88 8.58-11.6 17.19a162.09 162.09 0 0011 150.06C59 393 59 395 58.42 399.5c-2.73 14.11-7.51 39-10 51.91a24 24 0 008 22.92l.46.39A24.34 24.34 0 0072 480a23.42 23.42 0 009-1.79l53.51-20.65a8.05 8.05 0 015.72 0c21.07 7.84 43 12 63.78 12a176 176 0 0074.91-16.66c5.46-2.56 14-5.34 19-11.12a15 15 0 001.95-16.39z">
                                </path>
                            </svg>
                        </picture>
                        <p className='secondary-text font-bold text-lg'>Chats</p>
                    </section>
                    <section className='flex'>
                        <h1 className='text-2xl font-medium'>{newChatsCount}</h1>
                    </section>
                </Link>
            </button>
        </header>
    )
}

export default App1DashboardH