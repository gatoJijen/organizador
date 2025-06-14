'use client';

import React, { useEffect, useState } from 'react';
import {
  collection,
  updateDoc,
  doc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';

interface User {
  id: string;
  plan: string;
  displayName: string;
  photoURL: string;
  solicitudes?: string[];
  friends?: string[];
}

const App1Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUid(user.uid);

        const usersRef = collection(db, 'users');

        const unsubscribeSnapshot = onSnapshot(
          usersRef,
          (querySnapshot) => {
            const usersData: User[] = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as User[];

            const filteredUsers = usersData.filter((u) => u.id !== user.uid);
            setUsers(filteredUsers);
            setLoading(false);
          },
          (error) => {
            console.error('Error al escuchar usuarios:', error);
            setLoading(false);
          }
        );

        // IMPORTANTE: retornamos unsubscribeSnapshot correctamente
        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleSolicitud = async (receiverUid: string, yaSolicitado: boolean) => {
    if (!currentUid) return;
    try {
      const receiverRef = doc(db, 'users', receiverUid);
      await updateDoc(receiverRef, {
        solicitudes: yaSolicitado
          ? arrayRemove(currentUid)
          : arrayUnion(currentUid),
      });
    } catch (error) {
      console.error('Error al modificar solicitud:', error);
    }
  };

  const removeFriend = async (receiverUid: string) => {
    if (!currentUid) return;
    try {
      const receiverRef = doc(db, 'users', receiverUid);
      await updateDoc(receiverRef, {
        friends: arrayRemove(currentUid),
      });
    } catch (error) {
      console.error('Error al eliminar amigo:', error);
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div className="p-4 secondary-text">
      <h2 className="text-xl font-bold mb-2">Lista de Usuarios</h2>
      <ul className="space-y-2">
        {users.map((user) => {
          const yaSolicitado = user.solicitudes?.includes(currentUid || '') ?? false;
          const yaEsAmigo = user.friends?.includes(currentUid || '') ?? false;

          return (
            <li key={user.id} className="p-2 border rounded">
              <div className="flex items-center gap-4">
                <Image
                  src={user.photoURL}
                  alt={user.displayName}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p>
                    <strong>Nombre:</strong> {user.displayName}
                  </p>
                  <p className={`${user.plan === 'developer' ? 'text-green-500' : ''}`}>
                    <strong>Plan:</strong> {user.plan}
                  </p>
                </div>
              </div>

              {yaEsAmigo ? (
                <div className="mt-2 text-green-600 font-semibold">
                  ✅ Ya son amigos
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => removeFriend(user.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar de amigos
                    </button>
                    <button className="text-sm text-blue-600 underline">Ver perfil</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => toggleSolicitud(user.id, yaSolicitado)}
                  className={`mt-2 px-4 py-1 rounded text-white ${
                    yaSolicitado ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {yaSolicitado ? 'Cancelar solicitud' : 'Enviar solicitud'}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default App1Users;
