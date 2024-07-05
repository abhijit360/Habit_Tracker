import React from "react";
import { DateAndTime } from "./date-and-time";
import { ProgressBar } from "./progress-bar";
import { Task } from "./task";
import "./task-display.css"
export function TaskDisplay() {
  return (
    <>
      <div className="task-display-container">
        <div className="task-display-header">
            <DateAndTime/>
            <ProgressBar finished={1} total={3}/>
            {/* utility tools like drop down etc */}
        </div>
        <div className="task-display-body">
          <Task />
        </div>
      </div>
    </>
  );
}
