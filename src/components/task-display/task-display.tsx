import React from "react";
import { HeaderBar } from "../header-bar/header-bar";
import { Task } from "./task";
import "./task-display.css"
export function TaskDisplay() {
  
  const d1 = new Date(2024, 0, 1,6,45);
  const d2 = new Date(2024, 0, 1,7,45);
  
  const d3 = new Date(2024, 0, 1,14,45);
  const d4 = new Date(2024, 0, 1,16,45);
  return (
    <>
      <div className="task-display-container">
        <HeaderBar />
        <div className="task-display-body">
          <Task   taskName={"Task one"} startTime={d1} endTime={d2} attempted={true}/>
          <Task  taskName={"Task one"} startTime={d3} endTime={d4} attempted={false}/>
          <Task  taskName={"Task one"} startTime={d1} endTime={d2} attempted={true}/>
          <Task  taskName={"Task one"} startTime={d3} endTime={d4} attempted={false}/>
          <Task  taskName={"Task one"} startTime={d1} endTime={d2} attempted={true}/>
          <Task  taskName={"Task one"} startTime={d3} endTime={d4} attempted={false}/>
          <Task  taskName={"Task one"} startTime={d1} endTime={d2} attempted={true}/>
          <Task  taskName={"Task one"} startTime={d3} endTime={d4} attempted={false}/>
        </div>
      </div>
    </>
  );
}
