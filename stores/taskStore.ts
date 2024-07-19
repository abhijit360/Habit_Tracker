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
}));
