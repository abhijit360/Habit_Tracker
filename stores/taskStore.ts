import { create } from 'zustand';
import { TaskType } from '../types';

interface TasksState {
  tasks: TaskType[];
  append: (task: TaskType) => void;
  remove: (id: string) => void;
  toggleCompletedState: (
    id: string,
    state: 'completed' | 'in-progress' | 'new'
  ) => void;
  updateTaskTime: (taskId : string, timeObj: {h: number, m:number, s:number}) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  append: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  remove: (id) => {
    set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
  },
  toggleCompletedState: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id
          ? ({
              id: task.id,
              body: task.body,
              time: task.time,
              state: status,
            } as TaskType)
          : task
      ),
    })),
    updateTaskTime: (taskId,timeObj) => set((state) => ({ ...state,
      tasks: state.tasks.map((task) => task.id === taskId ? {...task, time: {startTime: task.time.startTime, endTime: new Date(new Date(task.time.startTime).getTime() + 
        timeObj.h * 3600000 + 
        timeObj.m * 60000 + 
        timeObj.s * 1000)}}: task)
    }))
}));
