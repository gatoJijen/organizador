"use client"
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          //setDisplayName(user.displayName || "");
          //setUrl(user.photoURL || "https://www.instagram.com/static/images/text_app/profile_picture/profile_pic.png/72f3228a91ee.png");
          //handlePostRequest2(); // Llamamos a la función cada vez que se actualiza el usuario
          
        } else {
          redirect("/");
        }
      });
  
      return () => unsubscribe(); // Limpia el listener cuando el componente se desmonta
    }, []);

  return <div>{children}</div>;
}
