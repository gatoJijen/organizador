/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/
import { db } from '@/firebase/config';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { IoIosSearch } from 'react-icons/io'
const SearchAvisos = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [uid, setUid] = useState('');
    const [resultados, setResultados] = useState<any[]>([]);
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user?.uid) setUid(user.uid);
      });
      return () => unsubscribe();
    }, []);
  
    const handleBuscar = () => {
        if (!uid || !searchTerm) return;
      
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', uid));
      
        // Importante: no uses `await` con onSnapshot (es reactivo, no promesa)
        const unsubscribe = onSnapshot(q, (snapshot) => {
          if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            const data = userDoc.data();
      
            const resources = data.resources || [];
      
            // Filtrar los recursos que contienen el término de búsqueda en "news"
            const filtrados = resources.filter((item: any) =>
                item.news?.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
      
            setResultados(filtrados);
          } else {
            setResultados([]); // Si no hay documentos, limpiar resultados
          }
        }, (error) => {
          console.error('Error buscando avisos:', error);
        });
    }
  
    return (
      <section className='w-full mt-[12px] gap-4 flex items-center justify-end px-[36px]'>
        <input
          className='w-[282px] h-[28px] px-[30px] py-[16px] focus:outline-none text-lg rounded-lg bg-search secondary-text'
          type='text'
          placeholder='Buscar'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
        />
        <button
          onClick={handleBuscar}
          className='p-2 transition-all flex items-center justify-center rounded-full bg-background-2 h-bg-stroke2 text-stroke cursor-pointer'
        >
          <IoIosSearch size={32} />
        </button>
  
        {/* Mostrar resultados si hay */}
        {resultados.length > 0 ? (
          <div className="absolute top-[60px] right-[36px] w-[300px] bg-white rounded-lg shadow-lg max-h-[300px] overflow-y-auto p-4 z-50">
            <h3 className='font-semibold text-md mb-2'>Resultados:</h3>
            <ul className='flex flex-col gap-2'>
              {resultados.map((item, idx) => (
                <li key={idx} className='border-b border-gray-200 pb-2'>
                  <p className='font-medium'>{item.news?.title}</p>
                  <p className='text-sm text-gray-600'>{item.news?.content}</p>
                  <p>{item.news?.date}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="absolute top-[60px] right-[36px] w-[300px] bg-white rounded-lg shadow-lg max-h-[300px] overflow-y-auto p-4 z-50">
            <h3 className='font-semibold text-md mb-2'>Resultados:</h3>
            <ul className='flex flex-col gap-2'>
              {resultados.map((item, idx) => (
                <li key={idx} className='border-b border-gray-200 pb-2'>
                  <p className='font-medium'>{item.news?.title}</p>
                  <p className='text-sm text-gray-600'>{item.news?.content}</p>
                  <p>{item.news?.date}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    );
  };

export default SearchAvisos
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars*/