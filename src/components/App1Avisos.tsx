/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/


import { db } from '@/firebase/config';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { arrayRemove, arrayUnion, collection, doc, getDocs, onSnapshot, query, serverTimestamp, Timestamp, updateDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa';
import { IoIosSearch, IoMdAdd } from 'react-icons/io'

interface Aviso {
    title: string;
    content?: string;
    date?: string;
    // otros campos...
}

interface props {
    plan?: string;
    categoria?: string;
}

const App1Avisos = ({ plan, categoria }: props) => {

    const [uid, setUid] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUid(currentUser?.uid || '');
        });
        return () => unsubscribe();
    }, []);

    const [avisos, setAvisos] = useState<Aviso[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [resultados, setResultados] = useState<Aviso[]>([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');

    // 2) Suscribirse UNA VEZ al array `news` en Firestore
    const [rawAvisos, setRawAvisos] = useState<any[]>([]);
    const [rawNewNews, setRawNewNews] = useState<any[]>([]);

useEffect(() => {
  if (!uid) return;
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('uid', '==', uid));
  const unsub = onSnapshot(q, (snap) => {
    if (snap.empty) {
      setRawAvisos([]);
      setAvisos([]);
      setResultados([]);
      return;
    }
    const data = snap.docs[0].data();
    
    // 2) Guardá el array crudo (con Timestamps) para borrar después
    const rawNews: any[] = Array.isArray(data.news) ? data.news : [];
    setRawAvisos(rawNews);
    const rawNewNews: any[] = Array.isArray(data.newNews) ? data.newNews : [];
    setRawNewNews(rawNewNews);

    // 3) Transformá para mostrar en UI
    const arr: Aviso[] = rawNews.map(av => {
      let dateStr: string | undefined;
      if (av.date instanceof Timestamp) {
        dateStr = av.date.toDate().toLocaleDateString();
      } else if (typeof av.date === 'string') {
        dateStr = av.date;
      }
      return { title: av.title, content: av.content, date: dateStr };
    });
    // 4) Procesar newNews: remover elementos que ya existen en news y actualizar UI
    const overlaps = rawNewNews.filter(avNew =>
        rawNews.some(av => av.title === avNew.title)
      );

    if (overlaps.length > 0) {
      // Limpiar newNews removiendo cada elemento duplicado
      const userDocRef = doc(db, 'users', snap.docs[0].id);
      const updates: any = { newNews: arrayRemove(...overlaps) };
      updateDoc(userDocRef, updates);
    }

    // 5) Transformar newNews para mostrar en UI
    const newNewsArr: Aviso[] = rawNewNews.map(av => {
      let dateStr: string | undefined;
      if (av.date instanceof Timestamp) {
        dateStr = av.date.toDate().toLocaleDateString();
      } else if (typeof av.date === 'string') {
        dateStr = av.date;
      }
      return { title: av.title, content: av.content, date: dateStr };
    });

    // 6) Combinar news y newNews para mostrar en UI
    const combinedArr = [...arr, ...newNewsArr];
    setAvisos(combinedArr);
    setResultados(combinedArr);
    setAvisos(arr);
    setResultados(arr);
  }, console.error);
  return () => unsub();
}, [uid]);

    const handleSearch = () => {
        // 3) Filtrar en memoria cuando cambie searchTerm o avisos
        if (!searchTerm) {
            setResultados(avisos);
            return;
        }
        const term = searchTerm.toLowerCase().trim();
        const filtrados = avisos.filter((item) =>
            item.title.toLowerCase().includes(term)
        );
        setResultados(filtrados);
    };
    const handleDeleteNewsToAll = async (itemToDelete: Aviso) => {
        try {
          const usersCol = collection(db, 'users');
          const allUsers = await getDocs(usersCol);
      
          await Promise.all(
            allUsers.docs.map(async (userDoc) => {
              const userRef = doc(db, 'users', userDoc.id);
              const data = userDoc.data() as any;
      
              // 2) Filtrar ambos arrays por title (u otro identificador único)
              const currentNews: any[] = Array.isArray(data.news) ? data.news : [];
              const currentNewNews: any[] = Array.isArray(data.newNews) ? data.newNews : [];
      
              const filteredNews = currentNews.filter(av => av.title !== itemToDelete.title);
              const filteredNewNews = currentNewNews.filter(av => av.title !== itemToDelete.title);
      
              // 3) Reescribir los arrays sin el elemento
              await updateDoc(userRef, {
                news: filteredNews,
                newNews: filteredNewNews
              });
            })
          );
        } catch (err) {
          console.error('Error eliminando la noticia para todos:', err);
        }
      };
    const handleAddAvisoToAll = async () => {
        if (!newTitle) return;
        try {
            const usersCol = collection(db, 'users');
            const allUsers = await getDocs(usersCol);
            const batchPromises = allUsers.docs.map(async (userDoc) => {
                const userRef = doc(db, 'users', userDoc.id);
                await updateDoc(userRef, {
                    news: arrayUnion({
                        title: newTitle,
                        content: newContent || '',
                        date: Timestamp.now(),
                    }),
                    newNews: arrayUnion({
                        title: newTitle,
                        content: newContent || '',
                        date: Timestamp.now(),
                    })
                });
            });
            await Promise.all(batchPromises);
            // reset y cerramos modal
            setNewTitle('');
            setNewContent('');
            setModalOpen(false);
        } catch (err) {
            console.error('Error añadiendo aviso a todos:', err);
        }
    };
    return (
        <section className='flex flex-col mt-[12px] gap-4'>
            <header className='w-full gap-4 flex items-center justify-end px-[36px]'>
                <input
                    className='w-[282px] h-[28px] px-[30px] py-[16px] focus:outline-none text-lg rounded-lg bg-search secondary-text'
                    type='text'
                    placeholder='Buscar'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    onClick={() => handleSearch()}
                    className='p-2 transition-all flex items-center justify-center rounded-full bg-background-2 h-bg-stroke2 text-stroke cursor-pointer'
                >
                    <IoIosSearch size={32} />
                </button>
                {plan === "developer" ? (
                    <>
                        <button
                            onClick={() => setModalOpen(true)}
                            className='p-2 transition-all flex items-center justify-center rounded-full bg-background-2 h-bg-stroke2 text-stroke cursor-pointer'
                        >
                            <IoMdAdd size={32} />
                        </button>
                        {modalOpen ? (
                            <section className="fixed inset-0 bg-black/10 flex items-center justify-center z-[999] ">
                                <article className="bg-background-2 w-[60dvw] h-[62dvh] overflow-y-auto overflow-x-hidden p-6 rounded-xl">
                                    <h2 className="text-xl font-bold mb-4 secondary-text">
                                        Añadir una nueva Noticia
                                    </h2>
                                    <article className="flex flex-col gap-4 secondary-text">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Titulo
                                            </label>
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                placeholder="Titulo de la noticia"
                                                className="mt-1 focus:outline-none px-4 py-2 block w-full rounded-md border-gray-300 shadow-lg"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700">
                                                Content
                                            </label>
                                            <input
                                                type="text"
                                                value={newContent}
                                                onChange={(e) => setNewContent(e.target.value)}
                                                placeholder="Contenido"
                                                onKeyDown={(e) => newContent === "" || newTitle === "" ? null : e.key === 'Enter' && handleAddAvisoToAll()}
                                                
                                                className="mt-1 focus:outline-none px-4 py-2 block w-full rounded-md border-gray-300 shadow-lg"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setModalOpen(false);
                                                    setNewTitle('');
                                                    setNewContent('');
                                                }}
                                                className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded border border-gray-400"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={handleAddAvisoToAll}
                                                className={`ml-4 bg-stroke text-white font-semibold py-2 px-4 rounded border border-stroke ${newTitle === "" ||
                                                    newContent === ""
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer h-bg-stroke"
                                                    }`}
                                                disabled={
                                                    newTitle === "" ||
                                                    newContent === ""
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
                ) : (
                    <div
                        className='absolute hidden opacity-0'
                    >
                    </div>
                )

                }
            </header>
            <main className='secondary-text'>
                {resultados.length > 0 ? (
                    <div className="p-4 z-50">
                        <ul className='flex flex-col gap-2'>
                            {resultados.map((item, idx) => (
                                <li key={idx} className='border-b border-gray-200 pb-2 flex justify-between'>
                                    <div>
                                        <p className='font-medium'>{item.title || "error"}</p>
                                        <p className='text-sm text-gray-600'>{item.content}</p>
                                        <p>{item.date}</p>
                                    </div>
                                    {plan === "developer" && (
                                        <button onClick={() => handleDeleteNewsToAll(item)} className={`w-10 h-10 transition-all cursor-pointer bg-red-500 hover:bg-red-500/70 rounded-lg flex items-center justify-center text-white`}> <FaTrashAlt size={18} /></button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No se encontraron resultados</p>
                )}
            </main>
        </section>
    );
};

export default App1Avisos/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
