import { createContext, useContext, useState, type ReactNode } from "react";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  user: { id: string; name: string; email: string } | null;
  setUser: (user: AuthContextType["user"]) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthContextType["user"] | null>(null);

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("UseAuth must be used inside provider");
  return context;
};
