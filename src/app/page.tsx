"use client";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

const Page: React.FC = () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars*/
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>(""); // Ahora es el nombre de usuario
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const saveUserToSupabase = async (uid: string, displayName: string) => {
    try {
      // Primero verificamos si ya existe un usuario con la uid
      const { data: existingUsers, error: selectError } = await supabase
        .from("users")
        .select("uid")
        .eq("uid", uid);
        
      if (selectError) {
        console.error("Error al buscar el usuario en Supabase:", selectError.message);
        return false;
      }
      
      // Si se encontró alguna coincidencia, el usuario ya existe
      if (existingUsers && existingUsers.length > 0) {
        console.log("El usuario ya existe en Supabase (por uid), se procederá a iniciar sesión.");
        return true;
      }
  
      // (Opcional) También puedes verificar por displayName si lo consideras necesario:
      const { data: existingByDisplay, error: selectDisplayError } = await supabase
        .from("users")
        .select("displayName")
        .eq("displayName", displayName);
  
      if (selectDisplayError) {
        console.error("Error al buscar usuario por displayName:", selectDisplayError.message);
        return false;
      }
      
      if (existingByDisplay && existingByDisplay.length > 0) {
        console.log("Ya existe un usuario con ese displayName, se procederá a iniciar sesión.");
        return true;
      }
  
      // Si no existe el usuario, procedemos a insertarlo
      const { data, error } = await supabase
        .from("users")
        .insert([{ uid, displayName }]); // Se usa un array para evitar problemas en la inserción
  
      if (error) {
        console.error("Error al guardar el usuario en Supabase:", error.message);
        return false;
      } else {
        console.log("Usuario guardado en Supabase", data);
        return true;
      }
    } catch (error) {
      console.error("Error inesperado:", error);
      return false;
    }
  };
  
  
  // Función para manejar el registro o inicio de sesión
  const handleRegisterOrLogin = async () => {
    setLoading(true);
    try {
      // Se genera un email ficticio basado en el displayName
      const pseudoEmail = `${displayName}@gmail.com`;
      let user: any;
  
      // Intentamos iniciar sesión
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: pseudoEmail,
        password,
      });
  
      if (signInError) {
        // Si el error indica que el usuario no existe o credenciales inválidas, procedemos al registro
        if (
          signInError.message.toLowerCase().includes("user not found") ||
          signInError.message.toLowerCase().includes("invalid login credentials")
        ) {
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: pseudoEmail,
            password,
          });
          if (signUpError) throw signUpError;
          if (!signUpData.user) throw new Error("No se pudo obtener el usuario después del registro.");
          user = signUpData.user;
  
          // Iniciar sesión luego del registro
          const { error: signInAfterError } = await supabase.auth.signInWithPassword({
            email: pseudoEmail,
            password,
          });
          if (signInAfterError) throw signInAfterError;
        } else {
          // Si el error no es por usuario inexistente, se detiene el flujo
          throw signInError;
        }
      } else {
        user = signInData.user;
      }
  
      // Una vez autenticado, se verifica/inserta el usuario en la tabla "users"
      const inserted = await saveUserToSupabase(user.id, displayName);
      if (!inserted) {
        console.log("El usuario ya existía en la tabla 'users' o hubo error en la inserción.");
      }
  
      router.push("/home");
    } catch (err: any) {
      setError(err.message || "Error en la autenticación");
    } finally {
      setLoading(false);
    }
  };
  
  
  // Manejo del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    await handleRegisterOrLogin();
  };
  

  // Efecto para manejar el estado de autenticación
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        router.push("/home");
      }
      else {
        router.push("/")
      }
    };

    getUser();
  }, [user]);
  /* eslint-disable @typescript-eslint/no-explicit-any */
    /* eslint-disable @typescript-eslint/no-unused-vars*/
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
            onChange={(e) => setDisplayName(e.target.value)}
            className='px-4 w-[370px] py-4 placeholder:text-white placeholder:text-opacity-40 rounded-[12px] background-4 fs-1 border border-white border-opacity-0 focus:border-opacity-15 focus:outline-none'
            placeholder='Nombre de usuario'
            type="text"
            value={displayName}
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
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            className={`bg-white px-4 w-[370px] py-4 text-black text-base font-bold rounded-[12px] ${loading || !displayName || !password ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={loading || !displayName || !password}
          >
            <p>{loading ? "Cargando..." : "Inicia sesión"}</p>
          </button>
        </section>
        <footer className='flex flex-col mt-3 w-full h-20 justify-between items-center gap-5 z-[999]'>
          <Link href={"/"}>
            <p className='opacity-40 fs-1'>¿Has olvidado la contraseña?</p>
          </Link>

          
        </footer>
      </article>
    </section>
  );
};

export default Page;
