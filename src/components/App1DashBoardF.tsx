import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AñadirRecursos from './AñadirRecursos';
import Link from 'next/link';
import { FaTrashAlt } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { SlOptions } from 'react-icons/sl';

const App1DashBoardS = () => {
  const [uid, setUid] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUid(currentUser?.uid || '');
    });

    return () => unsubscribe();
  }, []);

  const [recursos, setRecursos] = useState<any[]>([]);

  useEffect(() => {
    if (!uid) return;

    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('uid', '==', uid));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();

        // Nota: Usa 'resources' si es el campo que guardaste en Firestore
        const recursosData = Array.isArray(userData.resources) ? userData.resources : [];
        setRecursos(recursosData);
      } else {
        setRecursos([]);
      }
    });

    return () => unsubscribe();
  }, [uid]);

  // Agrupar recursos por grupo
  const recursosPorGrupo: { [grupo: number]: any[] } = {};
  recursos.forEach((item) => {
    const grupo = item.grupo || 0;
    if (!recursosPorGrupo[grupo]) {
      recursosPorGrupo[grupo] = [];
    }
    recursosPorGrupo[grupo].push(item);
  });

  // Eliminar todos los recursos de un grupo
  const handleDeleteRecurso = async (recurso: any) => {
    if (!uid) return;
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);

          const nuevosRecursos = recursos.filter(
            (item) => !(item.name === recurso.name)
          );

          await updateDoc(userRef, { resources: nuevosRecursos });
          setRecursos(nuevosRecursos);
        }
        unsubscribe(); // Detiene el listener después de una ejecución
      });
    } catch (error) {
      console.error('Error eliminando recurso:', error);
    }
  };
  const handleDeleteGrupo = async (grupo: string) => {
    if (!uid) return;
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);

          const nuevosRecursos = recursos.filter((item) => item.grupo !== grupo);

          await updateDoc(userRef, { resources: nuevosRecursos });
          setRecursos(nuevosRecursos);
        }
        unsubscribe(); // Detiene el listener después de una ejecución
      });
    } catch (error) {
      console.error('Error eliminando grupo:', error);
    }
  };
  const [openMenu, setOpenMenu] = useState<{ grupo: string; index: number } | null>(null);


  return (
    <section className="secondary-text flex-col bg-background-2 rounded-xl shadow-xl py-4 flex gap-4 px-4 justify-center">
      <header className="flex items-center justify-between">
        <article className='flex gap-[30px]'>
          <Image className="opacity-70" src="/Resources1.svg" alt="" width={26} height={26} />
          <h2 className="secondary-text font-bold text-lg">Recursos</h2>
        </article>
        <article>
          <AñadirRecursos />
        </article>
      </header>
      <footer className="flex items-center ">
        <section className="flex flex-col gap-8 items-center w-full">
          {recursos.length > 0 ? (
            Object.entries(recursosPorGrupo).map(([grupo, items]) => (
              <div key={grupo} className="mb-4 flex overflow-y-hidden overflow-x-auto flex-col w-full px-5 py-4 border-b-[1px] border-black/20 min-h-[100px] gap-2">
                <header className="flex items-center justify-between w-full">
                  <h3 className="font-semibold mb-2">Grupo {grupo}</h3>
                  <section className="flex gap-2">
                    <button onClick={() => handleDeleteGrupo(grupo)} className="w-10 h-10 transition-all cursor-pointer bg-red-500 hover:bg-red-500/70 rounded-lg flex items-center justify-center text-white "><FaTrashAlt size={18} /></button>
                    <AñadirRecursos grupoDefault={grupo} background='bg-green-500 hover:bg-green-500/70' />
                  </section>
                </header>
                <article className="flex gap-2">
                  {items.map((item, index) => (
                    <section className="relative" key={index}>
                      <Link className={`${openMenu?.index === index && openMenu?.grupo === grupo ? 'bg-black/50 transition-all hover:bg-transparent' : ''} shadow-lg rounded-lg flex items-center justify-center cursor-pointer min-w-[100px] relative min-h-[100px] max-w-[100px] max-h-[100px]`} target='_blank' rel='noreferrer' href={` ${item.link}`} key={index}>
                        <Image className=' object-cover' src={item.image} alt="" width={100} height={100} />
                      </Link> 
                      <button onClick={() => setOpenMenu(openMenu?.grupo === grupo && openMenu?.index === index ? null : { grupo, index })} className={`${openMenu?.index === index && openMenu?.grupo === grupo ? 'opacity-0' : ''} absolute top-2 right-2 bg-black/10 w-6 h-6 flex items-center cursor-pointer justify-center text-lg text-center z-[99] text-white p-1 rounded-full`}><SlOptions size={18} /></button>
                      {openMenu?.index === index && openMenu?.grupo === grupo && (
                        <ul className="absolute transition-all top-[6px] shadow-xl left-[10px] w-[80px] flex items-center justify-evenly  bg-white/40  rounded-xl z-[100]">
                          <li>
                            <button

                              onClick={() => {
                                handleDeleteRecurso(item);
                                setOpenMenu(null);
                              }}
                              className="flex items-center gap-2 text-red-600 hover:bg-white/50 cursor-pointer rounded-full p-1 transition-all w-full h-full"
                            >
                              <FaTrashAlt size={18} />
                            </button>
                          </li>
                          <li>
                            <button

                              onClick={() => {
                                setOpenMenu(null);
                              }}
                              className="flex items-center gap-2 text-red-600 hover:bg-white/50 cursor-pointer rounded-full p-1 transition-all w-full h-full"
                            >
                              <IoCloseSharp size={18} />
                            </button>
                          </li>
                        </ul>
                      )}
                    </section>
                  ))}
                </article>
              </div>
            ))
          ) : (
            <p>Agrega nuevos recursos.</p>
          )}
        </section>
      </footer>
    </section>
  );
};

export default App1DashBoardS;
