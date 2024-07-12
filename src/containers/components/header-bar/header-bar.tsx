import React from "react";
import { DateAndTime } from "./date-and-time";
import { ProgressBar } from "./progress-bar";
import "./header-bar.css"
import addIcon from "../../../assets/img/add.svg";
export function HeaderBar() {
  return (
    <>
      <div className="header-bar-container">
        <DateAndTime />
        <ProgressBar finished={1} total={3} />
        <img
          src={addIcon}
          style={{
            // backgroundColor: "grey",
            "cursor" : "pointer",
            "borderRadius": "50%",
            "width": "24px",
            "height": "24px",
          }}
          alt="add task"
        />
      </div>
    </>
  );
}
