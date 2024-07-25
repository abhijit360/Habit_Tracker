import { create } from 'zustand';
import { CalendarStore } from '../types';

interface CalendarState{
  calendars: CalendarStore[];
  setCalendars: (calendars: CalendarStore[]) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  calendars: [] as CalendarStore[],
  setCalendars: (calendars) =>
    set((state) => ({ ...state, calendars: calendars })),
}));
