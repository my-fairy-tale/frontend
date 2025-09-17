import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface useAuthStoreProps {
  accessToken: string | null;
  setAccessToken: (t: string | null) => void;
}

const useAuthStore = create(
  persist<useAuthStoreProps>(
    (set) => ({
      accessToken: null,
      setAccessToken: (newToken) => set({ accessToken: newToken }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
