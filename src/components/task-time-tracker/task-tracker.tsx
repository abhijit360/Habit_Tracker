import React from "react";
import "./task-tracker.css"
import { Timer } from "./timer";
import { TaskDescription } from "./task-description";
export function TaskTracker() {
  return (
    <>
      <div className="time-tracker-container">
        <TaskDescription title="Task one" body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse aliquam nec urna ut eleifend."/>
        <Timer hours={0} minutes={0} seconds={0} started={false} />
      </div>
    </>
  );
}
