import React from "react";
import { HeaderBar } from "../header-bar/header-bar";
import { Task } from "./task";
import "./task-display.css";
import { useTasksStore } from "../../../store";
export function TaskDisplay() {
  const { tasks } = useTasksStore();
 
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
              title={task.title}
              body={task.body}
            />
          ))}
        </div>
      </div>
    </>
  );
}
