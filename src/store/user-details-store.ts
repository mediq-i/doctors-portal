import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface UserState {
  firstName?: string;
  lastName?: string;
  email?: string;
  setData: (data: UserData) => void;
}

export const useUserDetailsStore = create<UserState>()(
  persist(
    (set) => ({
      setData: (data) =>
        set((state) => {
          const { firstName, lastName, email } = data;
          return {
            firstName: firstName ?? state.firstName,
            lastName: lastName ?? state.lastName,
            email: email ?? state.email,
          };
        }),
    }),
    {
      name: "user-details-store",
    }
  )
);
