/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/


import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useEffect, useState } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { IoMdAdd } from "react-icons/io";

interface Recurso {
  grupo: string;
  image: string;
  link: string;
  name: string;
}

interface Props {
  grupoDefault?: string;
  imageDefault?: string;
  linkDefault?: string;
  nameDefault?: string;
  background?: string;
}

export default function AñadirRecursos({
  grupoDefault,
  imageDefault,
  linkDefault,
  nameDefault,
  background,
}: Props) {
  const [grupo, setGrupo] = useState<string>(grupoDefault || "");
  const [image, setImage] = useState<string>(imageDefault || "");
  const [link, setLink] = useState<string>(linkDefault || "");
  const [name, setName] = useState<string>(nameDefault || "");

  const nuevoGrupo: Recurso[] = [
    { grupo, image, link, name },
  ];

  const [uid, setUid] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUid(currentUser?.uid || "");
    });
    return () => unsubscribe();
  }, []);

  const addRecursosGrupo = async (uid: string, nuevoGrupo: Recurso[]) => {
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

        const recursosActualizados = [...recursosActuales, ...nuevoGrupo];
        await updateDoc(userDocRef, {
          resources: recursosActualizados,
        });

        console.log("Recurso añadido correctamente");
      } else {
        console.error("Documento del usuario no encontrado");
      }
    } catch (error) {
      console.error("Error al añadir recurso:", error);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);

  const limpiarFormulario = () => {
    setGrupo(grupoDefault || "");
    setImage(imageDefault || "");
    setLink(linkDefault || "");
    setName(nameDefault || "");
  };

  const handleAddClick = () => {
    addRecursosGrupo(uid, nuevoGrupo);
    setModalOpen(false);
    limpiarFormulario();
  };

  return (
    <>
      <button
        className={`w-10 h-10 h-bg-stroke cursor-pointer transition-all z-50 ${background?background:'bg-stroke'} rounded-lg flex items-center justify-center`}
        onClick={() => setModalOpen(true)}
      >
        <IoMdAdd color="white" size={28} />
      </button>
      {modalOpen ? (
        <section className="fixed inset-0 bg-black/10 flex items-center justify-center z-[999] ">
          <article className="bg-background-2 w-[60dvw] h-[62dvh] overflow-y-auto overflow-x-hidden p-6 rounded-xl">
            <h2 className="text-xl font-bold mb-4 secondary-text">
              Añadir Recurso
            </h2>
            <article className="flex flex-col gap-4 secondary-text">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Grupo
                </label>
                <input
                  type="text"
                  value={grupo}
                  onChange={(e) =>
                    grupoDefault ? null : setGrupo(e.target.value)
                  }
                  placeholder="Nombre del grupo"
                  className="mt-1 focus:outline-none px-4 py-2 block w-full rounded-md border-gray-300 shadow-lg"
                  disabled={!!grupoDefault}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Imagen
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) =>
                    imageDefault ? null : setImage(e.target.value)
                  }
                  placeholder="URL de la imagen"
                  className="mt-1 focus:outline-none px-4 py-2 block w-full rounded-md border-gray-300 shadow-lg"
                  disabled={!!imageDefault}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Enlace
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) =>
                    linkDefault ? null : setLink(e.target.value)
                  }
                  placeholder="Enlace del recurso"
                  className="mt-1 focus:outline-none px-4 py-2 block w-full rounded-md border-gray-300 shadow-lg"
                  disabled={!!linkDefault}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    nameDefault ? null : setName(e.target.value)
                  }
                  placeholder="Nombre del recurso"
                  className="mt-1 focus:outline-none px-4 py-2 block w-full rounded-md border-gray-300 shadow-lg"
                  disabled={!!nameDefault}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    limpiarFormulario();
                  }}
                  className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded border border-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddClick}
                  className={`ml-4 bg-stroke text-white font-semibold py-2 px-4 rounded border border-stroke ${
                    grupo === "" ||
                    image === "" ||
                    link === "" ||
                    name === ""
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer h-bg-stroke"
                  }`}
                  disabled={
                    grupo === "" ||
                    image === "" ||
                    link === "" ||
                    name === ""
                  }
                >
                  Añadir
                </button>
              </div>
            </article>
          </article>
        </section>
      ) : (
        <div className="absolute hidden opacity-0"></div>
      )}
    </>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
