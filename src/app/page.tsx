"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/firebase/config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { doc, setDoc } from 'firebase/firestore';

const Page: React.FC = () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars*/
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const seguidores: string[] = [];

    // Función para guardar el usuario en la base de datos de Supabase
    const saveUserToSupabase = async (uid: string, displayName: string, photoURL: string, email: string, seguidores: string[]) => {
        try {
            const { error } = await supabase.from("users").upsert([
                {
                    id: uid, // Supabase usa 'id' por defecto como clave primaria
                    displayName,
                    photoURL,
                    email,
                    seguidores,
                },
            ]);

            if (error) throw error;
            console.log("Usuario guardado en Supabase");
        } catch (err) {
            console.error("Error al guardar el usuario en Supabase:", err);
        }
    };

    // Registro con email y contraseña
    const handleRegisterWithEmail = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            const user = data.user;
            if (!user) throw new Error("No se pudo obtener el usuario.");

            const defaultDisplayName = email.split("@")[0].replace(" ", "");
            const defaultPhotoURL = "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png";

            await saveUserToSupabase(user.id, defaultDisplayName, defaultPhotoURL, email, seguidores);

            router.push("/home");
        } catch (err: any) {
            setError(err.message || "Error al registrar el usuario");
        } finally {
            setLoading(false);
        }
    };

    // Iniciar sesión con Google
    const googleRegister = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: "google",
            });

            if (error) throw error;

            // Redirige a la URL de autenticación de Supabase
            router.push("/home");
        } catch (err: any) {
            setError(err.message || "Error al registrar con Google");
        } finally {
            setLoading(false);
        }
    };

    // Manejo del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }
        await handleRegisterWithEmail();
    };

    // Efecto para manejar el estado de autenticación
    useEffect(() => {
        const getUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) {
                setUser(data.user);
                router.push("/home");
            }
        };

        getUser();
    }, [router]);

    /* eslint-disable @typescript-eslint/no-unused-vars*/
    /* eslint-disable @typescript-eslint/no-explicit-any */
    return (
        <section className='z-[99] background-1 absolute w-full h-full'>
            <header className='absolute h-full w-full z-[99]'>
                <nav className='w-full relative h-full overflow-hidden cursor-default'>
                    <picture className='absolute top-[-145px] w-[100vw] mediaImageLogin scale-[130%] pointer-events-none'>
                        <Image priority src="https://static.cdninstagram.com/rsrc.php/yD/r/eIJhnL1FtGH.webp" alt='' width={2000} height={2000} />
                    </picture>
                </nav>
            </header>
            <article className='flex flex-col gap-1 justify-center h-full w-full pb-[44px] items-center z-[999]'>
                <header className='mb-2 z-[999]'>
                    <h1 className='text-white text-base font-bold'>Inicia sesión con tu cuenta de Instagram</h1>
                </header>
                <section className='flex flex-col items-center w-full gap-2 z-[999]'>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        className='px-4 w-[370px] py-4 placeholder:text-white placeholder:text-opacity-40 rounded-[12px] background-4 fs-1 border border-white border-opacity-0 focus:border-opacity-15 focus:outline-none'
                        placeholder='Nombre de usuario, teléfono o correo electrónico'
                        type="email"
                        value={email}
                    />
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        className='px-4 w-[370px] py-4 placeholder:text-white placeholder:text-opacity-40 rounded-[12px] background-4 fs-1 border border-white border-opacity-0 focus:border-opacity-15 focus:outline-none'
                        placeholder='Contraseña'
                        type="password"
                        value={password}
                    />
                    {error && (
                        <p className="text-red-500 text-sm">
                            {error === "Firebase: Error (auth/email-already-in-use)."
                                ? "Este correo ya está registrado"
                                : error}
                        </p>
                    )}

                    <button
                        onClick={handleSubmit}  // Llamada correcta a handleSubmit
                        className={`bg-white px-4 w-[370px] py-4 text-black text-base font-bold rounded-[12px] ${loading || !email || !password ? 'cursor-not-allowed opacity-50' : ''}`}
                        disabled={loading || !email || !password}  // Deshabilitar el botón si está cargando o si los campos están vacíos
                    >
                        <p>{loading ? "Cargando..." : "Inicia sesión"}</p>
                    </button>
                </section>
                <footer className='flex flex-col mt-3 w-full h-20 justify-between items-center gap-5 z-[999]'>
                    <Link href={"/"}>
                        <p className='opacity-40 fs-1'>¿Has olvidado la contraseña?</p>
                    </Link>

                    <div className='flex justify-center items-center gap-4 text-white text-opacity-30 fs-1'>
                        <div className='w-6 h-[1px] border-t opacity-25'></div>o<div className='w-6 h-[1px] border-t opacity-25'></div>
                    </div>
                    <button
                        onClick={googleRegister}
                        className='background-1 flex gap-4 items-center justify-between border border-white border-opacity-20 px-4 w-[370px] py-4 rounded-[12px] fs-1'
                        disabled={loading}
                    >
                        
                        
                    </button>
                    
                </footer>
            </article>
        </section>
    );
};

export default Page;

