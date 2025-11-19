"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  fullName: string | null;
  userId: string | null;
  admin: boolean;
  login: (id: string, name: string, isAdmin: boolean) => void;
  logout: () => void;
}

const defaultContext: AuthContextType = {
  userId: null,
  fullName: null,
  admin: false,
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// basically used to remember the user is logged checking session to
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [admin, setAdmin] = useState<boolean>(false);
  const router = useRouter();

  // checks session storage
  useEffect(() => {
    // prevents refreshing from logging them out
    const storedId = sessionStorage.getItem("userId");
    const storedName = sessionStorage.getItem("fullName");
    const storedAdmin = sessionStorage.getItem("admin");

    if (storedId) {
      setUserId(storedId);
      if (storedName) setFullName(storedName);
      setAdmin(storedAdmin === "true");
    }
  }, []);

  const login = (id: string, name: string, isAdmin: boolean) => {
    setUserId(id);
    setFullName(name);
    setAdmin(isAdmin);
    sessionStorage.setItem("userId", id); // used to check if user is still logged in during session
    sessionStorage.setItem("fullName", name);
    sessionStorage.setItem("admin", String(isAdmin));
    router.push("/"); // redirects user to dashboard
  };

  const logout = () => {
    //clear state
    setUserId(null);
    setFullName(null);
    setAdmin(false);
    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ userId, fullName, admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    if (typeof window === "undefined")
      return {
        userId: null,
        fullName: null,
        admin: false,
        login: () => {},
        logout: () => {},
      };
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
