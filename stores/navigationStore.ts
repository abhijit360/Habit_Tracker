import { create } from 'zustand';
import type { Page } from '../types';

interface NavigationState {
  prev_navigation_states: Page[];
  current_navigation_state: Page;
  current_task_id : string | null;
  updateNavigation: (page: Page) => void;
  updateCurrentTask: (taskId : string) => void;
  revertToPreviousState: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  prev_navigation_states: [] as Page[],
  current_task_id: null,
  current_navigation_state: 'Login',
  updateNavigation: (page) => {
    set((state) => ({
      ...state,
      current_navigation_state: page,
      prev_navigation_states: state.prev_navigation_states.length >= 5 ? [page, ...state.prev_navigation_states.slice(0, 4)] : [page, ...state.prev_navigation_states]
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
  updateCurrentTask: (taskId) => {set((state) => ({
    ...state,
    current_task_id: taskId
  }))}
}));
