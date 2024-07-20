import React from 'react';
import { HeaderBar } from '../header-bar/header-bar';
import { Task } from './task';
import './task-display.css';
import { useTasksStore } from '../../../../stores/taskStore';
export function TaskDisplay() {
  const { tasks } = useTasksStore();
  console.log("all task id's", tasks.map((task) => task.id))
  return (
    <>
      <div className="task-display-container">
        <HeaderBar />
        <div className="task-display-body">
          {tasks.map((task) => (
            <Task
              id={task.id}
              key={task.id}
              time={task.time}
              state={task.state}
              title={task.title}
              body={task.body}
            />
          ))}
        </div>
      </div>
    </>
  );
}
