import React from "react";
import { HeaderBar } from "../header-bar/header-bar";
import { Task } from "./task";
import "./task-display.css";
import { useTasksStore } from "../../store";
export function TaskDisplay() {
  const { tasks } = useTasksStore();
  const d1 = new Date(2024, 0, 1, 6, 45);
  const d2 = new Date(2024, 0, 1, 7, 45);

  const d3 = new Date(2024, 0, 1, 14, 45);
  const d4 = new Date(2024, 0, 1, 16, 45);
  return (
    <>
      <div className="task-display-container">
        <HeaderBar />
        <div className="task-display-body">
          {tasks.map((task) => (
            <Task
              id={task.id}
              key={task.id}
              times={task.times}
              state={task.state}
              title={task.title
              
              }
            />
          ))}
        </div>
      </div>
    </>
  );
}
