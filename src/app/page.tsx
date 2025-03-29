"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Importa tu cliente de Supabase y la función de obtener el usuario si es necesario
import { supabase } from "@/lib/supabaseClient";
import { getUserWithRole } from "@/lib/auth";

const Page: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Función para crear un usuario (opcional, si deseas crearlo antes de iniciar sesión)
  const createUser = async () => {
    try {
      const res = await fetch("/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Asegúrate de tener la variable definida en tu .env.local
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_JWT_SECRET}`,
        },
        body: JSON.stringify({
          username: "gatojijenDev", // Nota: En la BD la columna es "userName"
          password: "G3@v!t8X#qY9zM$2",
          role: "developer", // O el rol que corresponda
        }),
      });
      return res;
    } catch (err) {
      console.error("Error creando usuario:", err);
    }
  };

  // Función para manejar el login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    console.log("Enviando:", { username, password });

    // Puedes llamar a createUser() si deseas que se cree el usuario antes de iniciar sesión.
    await createUser();

    // Asegúrate de enviar los datos con el mismo nombre que espera la API.
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("token", token);
      setLoading(false);
      router.push("/dashboard");
    } else {
      setError("Usuario o Contraseña incorrecta");
      setLoading(false);
    }
  };

  return (
    <section className="z-[99] background-1 absolute w-full h-full">
      <header className="absolute h-full w-full z-[99]">
        <nav className="w-full relative h-full overflow-hidden cursor-default">
          <picture className="absolute top-[-145px] w-[100vw] mediaImageLogin scale-[130%] pointer-events-none">
            <Image
              priority
              src="https://static.cdninstagram.com/rsrc.php/yD/r/eIJhnL1FtGH.webp"
              alt=""
              width={2000}
              height={2000}
            />
          </picture>
        </nav>
      </header>
      <article className="flex flex-col gap-1 justify-center h-full w-full pb-[44px] items-center z-[999]">
        <header className="mb-2 z-[999]">
          <h1 className="text-white text-base font-bold">
            Inicia sesión con tu cuenta de Instagram
          </h1>
        </header>
        <section className="flex flex-col items-center w-full gap-2 z-[999]">
          <input
            onChange={(e) => setUsername(e.target.value)}
            className="px-4 w-[370px] py-4 placeholder:text-white placeholder:text-opacity-40 rounded-[12px] background-4 fs-1 border border-white border-opacity-0 focus:border-opacity-15 focus:outline-none"
            placeholder="Nombre de usuario"
            type="text"
            value={username}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            className="px-4 w-[370px] py-4 placeholder:text-white placeholder:text-opacity-40 rounded-[12px] background-4 fs-1 border border-white border-opacity-0 focus:border-opacity-15 focus:outline-none"
            placeholder="Contraseña"
            type="password"
            value={password}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSubmit}
            className={`bg-white px-4 w-[370px] py-4 text-black text-base font-bold rounded-[12px] ${
              loading || !username || !password
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer"
            }`}
            disabled={loading || !username || !password}
          >
            <p>{loading ? "Cargando..." : "Inicia sesión"}</p>
          </button>
        </section>
      </article>
    </section>
  );
};

export default Page;
