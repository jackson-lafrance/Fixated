import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import type { User } from "../types";

type FirebaseUser = Parameters<Parameters<typeof onAuthStateChanged>[1]>[0];

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;
      try {
        setCurrentUser(user);
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData({ id: userDoc.id, ...userDoc.data() } as User);
          }
        } else {
          setUserData(null);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const newUser: User = {
      id: userCredential.user.uid,
      email: userCredential.user.email || "",
      displayName,
      level: 1,
      experience: 0,
      overallRating: 50,
      createdAt: new Date()
    };
    await setDoc(doc(db, "users", userCredential.user.uid), {
      ...newUser,
      createdAt: new Date()
    });
    setUserData(newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const value = {
    currentUser,
    userData,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

