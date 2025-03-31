import { create } from "zustand";

interface useAuthState {
  auth_id: string | null;
  setAuthData: (data: { auth_id: string }) => void;
}

export const useAuthStore = create<useAuthState>((set) => ({
  auth_id: null,
  setAuthData: (data) => set(data),
}));
