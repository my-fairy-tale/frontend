import { UserProfileData } from '@/types/api';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: UserProfileData | null;
  setUser: (user: UserProfileData) => void;
  updateUserName: (name: string) => void;
  updateUserPhoneNumber: (phoneNumber: string) => void;
  updateVoiceModel: (voiceModel: string) => void;
  updateTtsSpeed: (ttsSpeed: number) => void;
  clearUser: () => void;
}

const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      updateUserName: (name) =>
        set((state) => ({
          user: state.user ? { ...state.user, name } : null,
        })),
      updateUserPhoneNumber: (phoneNumber) =>
        set((state) => ({
          user: state.user ? { ...state.user, phoneNumber } : null,
        })),
      updateVoiceModel: (voiceModel) =>
        set((state) => ({
          user: state.user ? { ...state.user, voiceModel } : null,
        })),
      updateTtsSpeed: (ttsSpeed) =>
        set((state) => ({
          user: state.user ? { ...state.user, ttsSpeed } : null,
        })),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage',
    }
  )
);

export default useUserStore;
