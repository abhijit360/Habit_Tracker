import React from "react";
import "./task-tracker.css";
import { Timer } from "./timer";
import { TaskDescription } from "./task-description";
import { HeaderBar } from "../header-bar/header-bar";
export function TaskTracker() {
  return (
    <>
      <div className="time-tracker-container">
        <HeaderBar />
        <div style={{display: "flex", flexDirection:"row", justifyContent:"space-evenly", width:"90%", alignSelf:"center"}}>
          <TaskDescription
            title="Task one"
            body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse aliquam nec urna ut eleifend."
          />
          <Timer hours={0} minutes={0} seconds={0} started={false} />
        </div>
      </div>
    </>
  );
}
