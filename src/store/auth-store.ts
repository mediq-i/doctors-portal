import { create } from "zustand";

interface useAuthState {
  auth_id: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  userType: string | null;
  setAuthData: (data: {
    auth_id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
  }) => void;
}

export const useAuthStore = create<useAuthState>((set) => ({
  auth_id: null,
  email: null,
  firstName: null,
  lastName: null,
  userType: null,
  setAuthData: (data) => set(data),
}));
