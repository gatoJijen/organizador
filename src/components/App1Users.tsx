'use client';

import React, { useEffect, useState } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  documentId,
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
  const [rawUsers, setRawUsers] = useState<User[]>([]);
  const [pending, setPending] = useState<User[]>([]);
  const [sent, setSent] = useState<User[]>([]);
  const [friendsList, setFriendsList] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);
  const [pageStack, setPageStack] = useState<(any | null)[]>([null]);
  const [lastVisible, setLastVisible] = useState<any | null>(null);
  const [unsubRaw, setUnsubRaw] = useState<() => void>(() => () => {});
  const [unsubUserDoc, setUnsubUserDoc] = useState<() => void>(() => () => {});
  const [unsubSent, setUnsubSent] = useState<() => void>(() => () => {});
  const pageSize = 10;

  // Subscribe to current user doc for solicitudes and friends
  const subscribeUserDoc = (uid: string) => {
    unsubUserDoc();
    const userRef = doc(db, 'users', uid);
    const unsub = onSnapshot(userRef, snap => {
      const data = snap.data() as any;
      setFriendsList(data.friends || []);
      const solicitudes: string[] = data.solicitudes || [];
      // pending
      if (solicitudes.length) {
        const q = query(collection(db, 'users'), where(documentId(), 'in', solicitudes));
        onSnapshot(q, snap2 => {
          setPending(snap2.docs.map(d => ({ id: d.id, ...(d.data() as any) } as User)));
        });
      } else setPending([]);
    });
    setUnsubUserDoc(() => unsub);
  };

  // Subscribe to sent requests
  const subscribeSent = (uid: string) => {
    unsubSent();
    const q = query(collection(db, 'users'), where('solicitudes', 'array-contains', uid));
    const unsub = onSnapshot(q, snap => {
      setSent(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as User)));
    });
    setUnsubSent(() => unsub);
  };

  // Subscribe raw users pages
  const subscribeRaw = (uid: string, cursor: any = null) => {
    unsubRaw();
    setLoading(true);
    let q = query(collection(db, 'users'), orderBy('displayName'), limit(pageSize));
    if (cursor) q = query(q, startAfter(cursor));
    const unsub = onSnapshot(q, snap => {
      setRawUsers(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) } as User)));
      setLastVisible(snap.docs[snap.docs.length - 1] || null);
      setLoading(false);
    });
    setUnsubRaw(() => unsub);
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (user) {
        const uid = user.uid;
        setCurrentUid(uid);
        setPageStack([null]);
        subscribeUserDoc(uid);
        subscribeSent(uid);
        subscribeRaw(uid, null);
      } else setLoading(false);
    });
    return () => {
      unsubAuth();
      unsubUserDoc();
      unsubSent();
      unsubRaw();
    };
  }, []);

  const changePage = (dir: 'next' | 'prev') => {
    if (!currentUid) return;
    if (dir === 'next' && lastVisible) {
      setPageStack(s => [...s, lastVisible]);
      subscribeRaw(currentUid, lastVisible);
    }
    if (dir === 'prev' && pageStack.length > 1) {
      const s = [...pageStack]; s.pop();
      subscribeRaw(currentUid, s[s.length - 1]);
      setPageStack(s);
    }
  };

  const sendOrCancel = async (uid: string, cancel: boolean) => {
    const ref = doc(db, 'users', uid);
    await updateDoc(ref, { solicitudes: cancel ? arrayRemove(currentUid) : arrayUnion(currentUid) });
  };

  const accept = async (sender: string) => {
    if (!currentUid) return;
    const curr = doc(db, 'users', currentUid);
    const snd = doc(db, 'users', sender);
    const b = writeBatch(db);
    b.update(curr, { friends: arrayUnion(sender), solicitudes: arrayRemove(sender) });
    b.update(snd, { friends: arrayUnion(currentUid), solicitudes: arrayRemove(currentUid) });
    await b.commit();
  };

  const deleteFriend = async (fid: string) => {
    if (!currentUid) return;
    const curr = doc(db, 'users', currentUid);
    const f = doc(db, 'users', fid);
    const b = writeBatch(db);
    b.update(curr, { friends: arrayRemove(fid) });
    b.update(f, { friends: arrayRemove(currentUid) });
    await b.commit();
  };

  if (loading) return <p>Cargando usuarios...</p>;

  // derive displayed users
  const displayOthers = rawUsers
    .filter(u =>
      u.id !== currentUid &&
      !friendsList.includes(u.id) &&
      !pending.some(p => p.id === u.id) &&
      !sent.some(s => s.id === u.id)
    );

  return (
    <div className="p-4 secondary-text">
      <h2 className="text-xl font-bold mb-4">Usuarios</h2>

      {pending.length > 0 && (<section className="mb-6">
        <h3 className="font-semibold mb-2">Solicitudes recibidas</h3>
        <ul className="space-y-2">
          {pending.map(u => (
            <li key={u.id} className="p-2 border rounded flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src={u.photoURL} alt={u.displayName} width={40} height={40} className="rounded-full" />
                <span>{u.displayName}</span>
              </div>
              <button onClick={() => accept(u.id)} className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">Agregar</button>
            </li>
          ))}
        </ul>
      </section>)}

      {sent.length > 0 && (<section className="mb-6">
        <h3 className="font-semibold mb-2">Solicitudes enviadas</h3>
        <ul className="space-y-2">
          {sent.map(u => (
            <li key={u.id} className="p-2 border rounded flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src={u.photoURL} alt={u.displayName} width={40} height={40} className="rounded-full" />
                <span>{u.displayName}</span>
              </div>
              <button onClick={() => sendOrCancel(u.id, true)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Cancelar solicitud</button>
            </li>
          ))}
        </ul>
      </section>)}

      <section>
        <h3 className="font-semibold mb-2">Todos los usuarios</h3>
        <ul className="space-y-2">
          {displayOthers.map(u => (
            <li key={u.id} className="p-2 border rounded flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Image src={u.photoURL} alt={u.displayName} width={50} height={50} className="rounded-full" />
                <div>
                  <p><strong>{u.displayName}</strong></p>
                  <p className={`${u.plan === 'developer' ? 'text-green-500' : ''}`}>Plan: {u.plan}</p>
                </div>
              </div>
              <button onClick={() => sendOrCancel(u.id, false)} className="mt-2 px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700">Enviar solicitud</button>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-4 flex justify-between">
        <button onClick={() => changePage('prev')} disabled={pageStack.length <= 1} className={`${pageStack.length <= 1 ? 'opacity-50' : ''} px-3 py-1 bg-gray-300 rounded`}>Anterior</button>
        <button onClick={() => changePage('next')} disabled={!lastVisible} className={`${!lastVisible ? 'opacity-50' : ''} px-3 py-1 bg-gray-300 rounded`}>Siguiente</button>
      </div>
    </div>
  );
};

export default App1Users;
