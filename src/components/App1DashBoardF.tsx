/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */


import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import AñadirRecursos from './AñadirRecursos';
import Link from 'next/link';
import { FaCheck, FaRegEdit, FaTrashAlt } from 'react-icons/fa';
import { IoCloseSharp } from 'react-icons/io5';
import { SlOptions } from 'react-icons/sl';
import { MdModeEdit } from 'react-icons/md';

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

  const [mostrarTodosLosGrupos, setMostrarTodosLosGrupos] = useState(false);

  const grupos = Object.entries(recursosPorGrupo);
  const gruposVisibles = mostrarTodosLosGrupos ? grupos : grupos.slice(0, 3);
  const [editando, setEditando] = useState<{ grupo: string; index: number } | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const handleEditarNombre = async (grupo: string | any, index: number) => {
    if (!uid || !nuevoNombre) return;
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));
      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);

          const recursosActualizados = [...recursos];
          const recursoEditado = recursosPorGrupo[grupo][index];
          const recursoIndexGlobal = recursos.findIndex(
            (r) => r.name === recursoEditado.name && r.link === recursoEditado.link
          );

          if (recursoIndexGlobal !== -1) {
            recursosActualizados[recursoIndexGlobal].name = nuevoNombre;
            await updateDoc(userRef, { resources: recursosActualizados });
            setRecursos(recursosActualizados);
            setEditando(null);
            setNuevoNombre('');
          }
        }
        unsubscribe();
      });
    } catch (error) {
      console.error('Error editando nombre:', error);
    }
  };

  const [grupoEditando, setGrupoEditando] = useState<string | null>(null);
  const [nuevoNombreGrupo, setNuevoNombreGrupo] = useState('');
  const handleRenombrarGrupo = async () => {
    if (!uid || !grupoEditando) return;

    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', uid));

      const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userRef = doc(db, 'users', userDoc.id);

          // Renombrar el grupo en cada recurso
          const nuevosRecursos = recursos.map((item) =>
            item.grupo === grupoEditando ? { ...item, grupo: nuevoNombreGrupo } : item
          );

          await updateDoc(userRef, { resources: nuevosRecursos });
          setRecursos(nuevosRecursos);
          setGrupoEditando(null);
          setNuevoNombreGrupo('');
        }
        unsubscribe();
      });
    } catch (error) {
      console.error('Error renombrando grupo:', error);
    }
  };




  return (
    <section className="secondary-text flex-col bg-background-2 rounded-xl shadow-xl py-4 flex gap-4 px-4 justify-center">
      <article className="flex items-center justify-between">
        <Link href="/app1" className='flex gap-[30px]'>
          <Image className="opacity-70" src="/Resources1.svg" alt="" width={26} height={26} />
          <h2 className="secondary-text font-bold text-lg">Recursos</h2>
        </Link>
        <article>
          <AñadirRecursos />
        </article>
      </article>
      <footer className="flex items-center justify-center flex-col">
        <section className="flex flex-col gap-8 items-center  w-full">
          {recursos.length > 0 ? (
            Object.entries(recursosPorGrupo).slice(0, 3).map(([grupo, items]) => (
              <div key={grupo} className="mb-4 transition-all flex overflow-y-hidden overflow-x-auto flex-col w-full px-5 py-4 border-b-[1px] border-black/20 min-h-[100px] gap-2">
                <header className="flex items-center justify-between w-full">
                  <h3 className="font-semibold mb-2">Grupo {grupo}</h3>
                  <section className={`flex gap-2 items-center transition-all ${grupoEditando === grupo ? 'flex-row-reverse' : ''}`}>
                    
                    

                    <button
                      onClick={() => {
                        
                        grupoEditando === grupo ? handleRenombrarGrupo() : setGrupoEditando(grupo);
                        setNuevoNombreGrupo(grupo);
                      }}
                      className={` w-10 h-10 transition-all cursor-pointer bg-blue-500 hover:bg-blue-500/70 rounded-lg flex items-center justify-center text-white`}
                    >
                      <MdModeEdit size={18} />
                    </button>
                    <button onClick={() =>  grupoEditando === grupo ? setGrupoEditando(null) :handleDeleteGrupo(grupo)} className={`w-10 h-10 transition-all cursor-pointer bg-red-500 hover:bg-red-500/70 rounded-lg flex items-center justify-center text-white`}> {grupoEditando === grupo ? <IoCloseSharp size={18} /> : <FaTrashAlt size={18} />}</button>
                    <AñadirRecursos grupoDefault={grupo} background={grupoEditando === grupo ? 'hidden' : 'bg-green-500 hover:bg-green-500/70'} />
                    {grupoEditando === grupo ? (
                      <div className="flex items-center shadow-xl p-1 transition-all rounded-xl gap-2 ">
                        <input
                          value={nuevoNombreGrupo}
                          onChange={(e) => setNuevoNombreGrupo(e.target.value)}
                          className="border-b m-1 focus:outline-none px-2 py-1 text-sm"
                        />
                      </div>
                    ) : null}
                  </section>
                </header>
                <article className="flex gap-2">
                  {items.map((item, index) => (
                    <section className="relative" key={index}>
                      <Link className={`${openMenu?.index === index && openMenu?.grupo === grupo ? 'bg-black/50 transition-all hover:bg-transparent' : ''} shadow-lg rounded-lg flex items-center justify-center cursor-pointer min-w-[150px] relative min-h-[100px] max-w-[150px] max-h-[150px]`} target='_blank' rel='noreferrer' href={` ${item.link}`} key={index}>
                        <Image className=' object-cover' src={item.image} alt="" width={100} height={100} />
                      </Link>
                      <button onClick={() => setOpenMenu(openMenu?.grupo === grupo && openMenu?.index === index ? null : { grupo, index })} className={`${openMenu?.index === index && openMenu?.grupo === grupo ? 'opacity-0' : ''} absolute top-2 right-2 bg-black/10 w-6 h-6 flex items-center cursor-pointer justify-center text-lg text-center z-[99] text-white p-1 rounded-full`}><SlOptions size={18} /></button>
                      {openMenu?.index === index && openMenu?.grupo === grupo && (
                        <>
                          <ul className="absolute transition-all top-[6px] shadow-xl left-[10px] w-[85%] flex items-center justify-evenly  bg-white/40  rounded-xl z-[100]">
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
                          <ul className='absolute bottom-[6px] left-[10px] w-[85%] flex items-center justify-evenly bg-white/40 rounded-xl z-[100] transition-all'>
                            {editando?.grupo === grupo && editando?.index === index ? (
                              <>
                                <input
                                  className="w-[70px] overflow-x-clip focus:outline-none rounded px-1 py-1 text-sm"
                                  value={nuevoNombre}
                                  onChange={(e) => setNuevoNombre(e.target.value)}
                                />
                                <button
                                  onClick={() => handleEditarNombre(grupo, index)}
                                  className="text-green-600 cursor-pointer hover:bg-white/50 rounded-full py-1 px-1"
                                >
                                  <FaCheck size={16} />
                                </button>
                                <button
                                  onClick={() => setEditando(null)}
                                  className="text-red-600 cursor-pointer hover:bg-white/50 rounded-full py-1 px-1"
                                >
                                  <IoCloseSharp size={18} />
                                </button>
                              </>
                            ) : (
                              <>
                                <h2 className='overflow-x-clip w-[70px] text-sm truncate'>{item.name}</h2>
                                <button
                                  onClick={() => {
                                    setEditando({ grupo, index });
                                    setNuevoNombre(item.name);
                                  }}
                                  className="hover:bg-white/50 cursor-pointer text-stroke rounded-full p-1 transition-all"
                                >
                                  <MdModeEdit size={18} />
                                </button>
                              </>
                            )}

                          </ul>
                        </>
                      )}
                    </section>
                  ))}
                </article>

              </div>
            ))
          ) : (
            <p className="text-center">Agrega nuevos recursos.</p>
          )}
        </section>
        <article className='flex items-center justify-end w-full'>
          {grupos.length > 3 && (
            <Link
              href="/app1"
              className="primary-text font-semibold py-2 px-4 rounded-lg bg-stroke h-bg-stroke mt-4"
            >
              Ver todos los recursos
            </Link>
          )}
        </article>
      </footer>
    </section>
  );
};

export default App1DashBoardS;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
