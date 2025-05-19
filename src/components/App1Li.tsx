import React from 'react'
import Image from 'next/image'
import Link from 'next/link';
import { auth } from '@/firebase/config';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
interface PropsApp1Li {
    name: string;
    active: boolean;
    icon: string;
}
const App1Li = ({ name, icon, active }: PropsApp1Li) => {
    const router = useRouter()
    const handleLogout = async () => {
        try {
          // Cerrar sesión en Firebase
          await signOut(auth);
    
          // Limpiar los datos de autenticación en localStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("userEmail");
    
          // Redirigir a la página de inicio ("/")
          router.push("/");
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
      };
  return (
    <Link onClick={name=== "Salir" ? () => {handleLogout()} : undefined} href={name === "Inicio" ? "/dashboard/Clic-Up" : name === "Noticias" ? "/dashboard/Clic-Up/Noticias": name === "Chats" ? "/dashboard/Clic-Up/Chats": name === "Avisos" ? "/dashboard/Clic-Up/Avisos":  name === "Tareas" ? "/dashboard/Clic-Up/Tareas": name === "Calendario" ? "/dashboard/Clic-Up/Calendario" : name === "Asistencia" ? "/dashboard/Clic-Up/Asistencia": name === "Recursos" ? "/dashboard/Clic-Up/Recursos": name === "Clases" ? "/dashboard/Clic-Up/Clases": name === "Pagos" ? "/dashboard/Clic-Up/Pagos": name === "Configuración" ? "/dashboard/Clic-Up/Configuración" : name === "Mis Roles" ? "/dashboard/Clic-Up/Mis-Roles": name === "Acerca de" ? "/dashboard/Clic-Up/Acerca-de": ""} className={`flex items-center gap-8 py-2 px-[4px] hover-bg-foreground App1Li cursor-pointer border-b-1 border-secondary-color-60 pb-2 `}>
        <Image className='w-[24px] h-[24px] opacity-60' src={icon} alt="home" width={24} height={24} />
        <p className={`text-lg  w-full ${active ? 'text-cyan-600 font-semibold ' : 'secondary-text'}`}>{name}</p>
    </Link>
  )
}

export default App1Li