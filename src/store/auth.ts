import { User } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  isLoggedIn: boolean;
  user: Omit<User, 'password'> | null;
}

interface AuthActions {
  login: (user: Omit<User, 'password'>) => void;
  logout: () => void;
}

interface AuthStore extends AuthState, AuthActions {}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      login: (user) => set({ isLoggedIn: true, user }),
      logout: () => {
        localStorage.removeItem("userInfo");
        set({ isLoggedIn: false, user: null });
      },
    }),
    {
      name: "jebbs-auth-storage",
    }
  )
);

export default useAuthStore;