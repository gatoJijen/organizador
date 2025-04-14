"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
// Importa tu cliente de Supabase y la función de obtener el usuario si es necesario


const Page: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();


  const saveUserToFirestore = async (uid: string, displayName: string, photoURL: string, categoria: string, plan: string, año:string, calendario:string, colegio:string, grado:string, image: string) => {
    try {
      const userRef = doc(db, "users", uid); // Crea un documento con el UID del usuario
      await setDoc(userRef, {
        displayName,
        photoURL,
        uid,
        email,
        categoria,
        plan,
        año,
        calendario,
        colegio,
        grado,
        image
      });
      console.log("Usuario guardado en Firestore");
    } catch (err) {
      console.error("Error al guardar el usuario en Firestore:", err);
    }
  };

  const handleRegisterWithEmail = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Actualiza el perfil del usuario en Firebase Authentication
      const defaultDisplayName = email.split("@")[0].replace(' ', '');
      const defaultPhotoURL = "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png";
      const photoURL = user.photoURL || defaultPhotoURL;
      const defaultCategory = "user"
      const defaultColage = "SAN ANTONIO"
      const defaultGrade = "Bachillerato"
      const defaultCalendary = "A"
      const defaultPlan = "test"
      const defaultYear = "2025"

      await updateProfile(user, {
        displayName: defaultDisplayName,
        photoURL: defaultPhotoURL,
      });

      // Guarda el usuario en Firestore
      await saveUserToFirestore(user.uid, defaultDisplayName, defaultPhotoURL, defaultCategory, defaultPlan, defaultYear, defaultCalendary,defaultColage, defaultGrade, photoURL);

      router.push("/dashboard");
    } catch (err: any) {
      // Si el error es que la cuenta ya existe, intenta iniciar sesión
      if (err.code === "auth/email-already-in-use") {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;

          // Redirige al usuario después de iniciar sesión
          router.push("/dashboard");
        } catch (loginErr: any) {
          setError(loginErr.message || "Error al iniciar sesión con el usuario existente");
        }
      } else {
        setError(err.message || "Error al registrar el usuario");
      }
    } finally {
      setLoading(false);
    }
  }

  const googleRegister = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user) throw new Error("No se pudo obtener el usuario.");
      // Usa los datos del usuario proporcionados por Google
      const displayName = user.displayName || "UsuarioG";
      const defaultPhotoURL = "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png"
      const photoURL = user.photoURL || defaultPhotoURL;
      const defaultCategory = "user"
      const defaultColage = "SAN ANTONIO"
      const defaultGrade = "Bachillerato"
      const defaultCalendary = "A"
      const defaultPlan = "test"
      const defaultYear = "2025"

      // Guarda el usuario en Firestore
      await saveUserToFirestore(user.uid, displayName, photoURL, defaultCategory, defaultPlan,defaultYear, defaultCalendary, defaultColage, defaultGrade, photoURL);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error al registrar con Google");
    } finally {
      setLoading(false);
    }
  };

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        //setDisplayName(user.displayName || "");
        //setUrl(user.photoURL || "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png");
        //handlePostRequest2(); // Llamamos a la función cada vez que se actualiza el usuario
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    });

    return () => unsubscribe(); // Limpia el listener cuando el componente se desmonta
  }, [router]);
  /* eslint-disable @typescript-eslint/no-unused-vars*/
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return (
    <section className='flex flex-col items-center justify-center'>
      <header className='absolute h-full w-full z-[99]'>
        <nav className='w-full relative h-full overflow-hidden cursor-default'>
          <picture className='absolute w-[100vw] h-[100svh] pointer-events-none'>
            <Image priority src="https://conpros3fili01.s3.amazonaws.com/uploads/background/default-background-norma.jpg" alt='' width={2000} height={100} />
          </picture>
        </nav>
      </header>
      <article className='flex flex-col justify-center h-[100svh] pb-[60px] pt-[70px] px-[160px] w-[60svw]  items-center z-[999] '>
        <header className='m-0 bg-logoLogin w-full h-full flex items-center justify-center z-[999] rounded-t-4xl'>
          <Image className="w-[200px]  " src={"https://conpros3fili01.s3.amazonaws.com/uploads/logo/default-logo-norma.png"} alt="Norma logo" width={1000} height={100} />
        </header>
        <section className='flex flex-col items-center bg-white w-full h-full gap-2 pt-10 z-[999]'>
          <input
            onChange={(e) => setEmail(e.target.value)}
            className='px-4 w-[370px] py-4 placeholder:text-black/40 rounded-[12px] fs-1 border border-black/40 focus:border-opacity-15 focus:outline-none'
            placeholder='Correo electrónico'
            type="email"
            value={email}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className='px-4 w-[370px] py-4 placeholder:text-black/40 rounded-[12px] fs-1 border border-black/40 focus:border-opacity-15 focus:outline-none'
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
            className={` px-4 w-[370px] py-4 text-white text-base font-bold rounded-[12px] ${loading || !email || !password ? 'cursor-not-allowed opacity-60 bg-gray-500' : 'cursor-pointer bg-blue-500'}`}
            disabled={loading || !email || !password}  // Deshabilitar el botón si está cargando o si los campos están vacíos
          >
            <p>{loading ? "Cargando..." : "Inicia sesión"}</p>
          </button>
        </section>
        <footer className='flex flex-col bg-white w-full pb-12 h-full pt-[20px] justify-between items-center gap-5 z-[999]'>
          <div className='flex justify-center items-center gap-4 text-black/60 fs-1'>
            <div className='w-6 h-[1px] border-t opacity-25'></div>o<div className='w-6 h-[1px] border-t opacity-25'></div>
          </div>
          <button
            onClick={googleRegister}
            className='background-1 flex gap-4 items-center justify-center border border-black/40 px-4 w-[370px] py-6 rounded-[12px] fs-1 cursor-pointer'
            disabled={loading}
          >
            <h2 className='text-base text-black font-bold'>Continuar con Google</h2>
            <article className='rotate-180'>
            </article>
          </button>
        </footer>
      </article>
    </section>
  );
};

export default Page;
