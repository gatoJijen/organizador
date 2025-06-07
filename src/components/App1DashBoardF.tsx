import { auth, db } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

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

  return (
    <section className="secondary-text flex-col bg-background-2 rounded-xl shadow-xl py-4 flex gap-4 px-4 justify-center">
      <header className="flex gap-[30px] items-center">
        <Image className="opacity-70" src="/Resources1.svg" alt="" width={26} height={26} />
        <h2 className="secondary-text font-bold text-lg">Recursos</h2>
      </header>
      <footer className="flex items-center justify-center">
        <section className="  flex gap-8 items-center">
          {recursos.length > 0 ? (
            Object.entries(recursosPorGrupo).map(([grupo, items]) => (
              <div key={grupo} className="mb-4 flex flex-col px-5 border-l-[1px] border-l-black/20 border-r-[1px] min-h-[100px] border-r-black/20 gap-2">
                <h3 className="font-semibold mb-2">Grupo {grupo}</h3>
                <ul className="list-disc pl-4">
                  {items.map((item, index) => (
                    <li key={index}>
                      <strong>{item.nombre}</strong> —{' '}
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-500 underline">
                        Abrir enlace
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p>No hay recursos disponibles.</p>
          )}
        </section>
      </footer>
    </section>
  );
};

export default App1DashBoardS;
