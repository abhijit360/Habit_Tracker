import { create } from 'zustand';
import { GoogleUserObj } from '../types';

interface userAuthState {
  user: GoogleUserObj | null;
  authToken: string;
  clearUserState: () => void;
  setUserState: (user: GoogleUserObj, authToken: string) => void;
}

export const useUserStore = create<userAuthState>((set) => ({
  user: null,
  authToken: '',
  clearUserState: () =>
    set((state) => ({ ...state, user: null, authToken: '' })),
  setUserState: (user, authToken) =>
    set((state) => ({ ...state, user: user, authToken: authToken })),
}));
