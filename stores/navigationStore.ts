import { create } from 'zustand';
import type { Pages } from '../types';

interface NavigationState {
  prev_navigation_states: Pages[];
  current_navigation_state: Pages;
  updateNavigation: (page: Pages) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  prev_navigation_states: [] as Pages[],
  current_navigation_state: 'Login',
  updateNavigation: (page) => {
    set((state) => ({
      ...state,
      current_navigation_state: page,
      prev_navigation_states:
        state.prev_navigation_states.length >= 5
          ? [page, ...state.prev_navigation_states.slice(0, 4)]
          : [page, ...state.prev_navigation_states],
    }));
  },
}));
