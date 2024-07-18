import { create } from 'zustand';
import type { Pages } from '../types';

interface NavigationState {
  prev_navigation_states: Pages[];
  current_navigation_state: Pages;
  updateNavigation: (page: Pages) => void;
  revertToPreviousState: () => void;
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
  revertToPreviousState: () => {
    set((state) => {
      if (state.prev_navigation_states.length === 0) {
        return state; // No previous state to revert to
      }
      return {
        current_navigation_state: state.prev_navigation_states[0],
        prev_navigation_states: state.prev_navigation_states.slice(1),
      };
    });
  },
}));
