import { create } from 'zustand';

interface ErrorState{
 error: string | null,
 setError: (error: string) => void,
 removeError: () => void
}

export const useErrorStore = create<ErrorState>((set) => ({
    error: null,
    setError: (error) => set({ error }),
    removeError: () => set({ error: null })
  }));
