import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthStore = {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        accessToken: null,
        user: null,
        setAccessToken: (token: string) => set({ accessToken: token }),
        setUser: (user: User) => set({ user }),
        clearAuth: () => set({ accessToken: null, user: null }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
        }),
      }
    ),
    {
      name: "AuthStore",
      enabled: import.meta.env.DEV,
    }
  )
);
