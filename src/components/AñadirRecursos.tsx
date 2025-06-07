import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { IoMdAdd } from "react-icons/io";

interface Recurso {
    grupo: number;
    image: string;
    link: string;
}

export default function AñadirRecursos() {
  // Nuevo grupo de recursos que quieres añadir
  

  const [grupo, setGrupo] = useState<number>(0);
  const [image, setImage] = useState<string>("");
  const [link, setLink] = useState<string>("");

  const nuevoGrupo: Recurso[] = [  
    { grupo: grupo, image: image, link: link },
  ];

  const [uid, setUid] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUid(currentUser?.uid || "");
    });

    return () => unsubscribe();
  }, []);

  const addRecursosGrupo = async (uid: string, nuevoGrupo: any[]) => {
    if (!uid) {
      console.error("UID no disponible");
      return;
    }

    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const recursosActuales = Array.isArray(userData.resources)
          ? userData.resources
          : [];

        // Aplanar el grupo para evitar arrays anidados
        const recursosActualizados = [...recursosActuales, ...nuevoGrupo];

        // Actualizamos solo el campo resources
        await updateDoc(userDocRef, {
          resources: recursosActualizados
        });

        console.log("Grupo de recursos añadido correctamente");
      } else {
        console.error("Documento del usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al añadir grupo de recursos:", error);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        className="w-10 h-10 cursor-pointer bg-stroke rounded-lg flex items-center justify-center"
        onClick={() => setModalOpen(true)}
      >
        <IoMdAdd color="white" size={28} />
      </button>
    </>
  );
}
