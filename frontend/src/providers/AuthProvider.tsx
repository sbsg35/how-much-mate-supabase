import { supabaseBrowserClient } from "@/supabase/client";
import { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

type AuthStateContextType = {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const initialAuthState: AuthStateContextType = {
  user: null,
  isLoading: true,
  logout: async () => {},
};

export const AuthStateContext =
  createContext<AuthStateContextType>(initialAuthState);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = async () => {
    await supabaseBrowserClient().auth.signOut();
  };

  useEffect(() => {
    const client = supabaseBrowserClient();

    client.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthStateContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthStateContext.Provider>
  );
};

// Custom hook for accessing the AuthContext
export const useAuth = () => useContext(AuthStateContext);
export default AuthProvider;
