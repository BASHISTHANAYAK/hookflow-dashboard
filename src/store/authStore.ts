import { create } from "zustand";
import { User } from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
}

const getStoredToken = (): string | null => {
  return localStorage.getItem("token");
};

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => {
  const initialToken = getStoredToken();
  const initialUser = getStoredUser();

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: Boolean(initialToken && initialUser),
    isAdmin: initialUser?.role === "ADMIN",

    setAuth: (user: User, token: string) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({
        user,
        token,
        isAuthenticated: true,
        isAdmin: user.role === "ADMIN",
      });
    },

    updateUser: (updates: Partial<User>) => {
      set((state) => {
        if (!state.user) return state;
        const updatedUser = { ...state.user, ...updates };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        return {
          user: updatedUser,
          isAdmin: updatedUser.role === "ADMIN",
        };
      });
    },

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isAdmin: false,
      });
    },
  };
});
