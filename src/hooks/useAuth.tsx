import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUid(currentUser?.uid || "");
      if (!currentUser) {
        router.push("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user, uid, loading };
};
