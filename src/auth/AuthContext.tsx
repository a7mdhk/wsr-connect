import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth, authPersistence, db } from "../lib/firebase";

interface AuthContextValue {
  user: User | null;
  role: string | null;
  position: string | null;
  accessLevel: string | null;
  isSRC: boolean;
  isLeadership: boolean;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [role, setRole] =
    useState<string | null>(null);

  const [position, setPosition] =
    useState<string | null>(null);

  const [accessLevel, setAccessLevel] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          setLoading(true);
          setUser(currentUser);
          setRole(null);
          setPosition(null);
          setAccessLevel(null);

          if (!currentUser) {
            setLoading(false);
            return;
          }

          try {
            const userDocument = await getDoc(
              doc(db, "users", currentUser.uid),
            );

            if (userDocument.exists()) {
              const userData =
                userDocument.data();

              setRole(
                typeof userData.role === "string"
                  ? userData.role
                  : null,
              );

              setPosition(
                typeof userData.position === "string"
                  ? userData.position
                  : null,
              );

              setAccessLevel(
                typeof userData.accessLevel === "string"
                  ? userData.accessLevel
                  : null,
              );
            }
          } catch (error) {
            console.error(
              "Failed to load user authorization:",
              error,
            );

            setRole(null);
            setPosition(null);
            setAccessLevel(null);
          } finally {
            setLoading(false);
          }
        },
      );

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
  await authPersistence;

  await signInWithEmailAndPassword(
    auth,
    email.trim(),
    password,
  );
};

  const signOutUser = async () => {
    await signOut(auth);

    setRole(null);
    setPosition(null);
    setAccessLevel(null);
  };

  const isSRC = role === "src";

  const isLeadership =
    accessLevel === "leadership";

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        position,
        accessLevel,
        isSRC,
        isLeadership,
        loading,
        signIn,
        signOutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}