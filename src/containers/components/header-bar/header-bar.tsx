import React from "react";
import { DateAndTime } from "./date-and-time";
import { ProgressBar } from "./progress-bar";
import "./header-bar.css"
export function HeaderBar() {
  return (
    <>
      <div className="header-bar-container">
        <DateAndTime />
        <ProgressBar finished={1} total={3} />
        <img
          src="./add.svg"
          style={{
            backgroundColor: "grey",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
          }}
          alt="add task"
        />
      </div>
    </>
  );
}
