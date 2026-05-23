import { supabaseBrowserClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";

type AuthStateContextType = {
  user: User | null;
  setAuth: (authUser: User | null) => void;
};

const initialAuthState: AuthStateContextType = {
  user: null,
  setAuth: () => {},
};

export const AuthStateContext =
  createContext<AuthStateContextType>(initialAuthState);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const setAuth = (authUser: User | null) => {
    setUser(authUser);
  };

  return (
    <AuthStateContext.Provider value={{ user, setAuth }}>
      {children}
    </AuthStateContext.Provider>
  );
};

// Custom hook for accessing the AuthContext
export const useAuth = () => useContext(AuthStateContext);
export default AuthProvider;
