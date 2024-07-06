import React from "react";
import "./task.css"
interface TaskProps {
  taskName: String;
  startTime: Date;
  endTime: Date;
  attempted: Boolean;
}

export function Task({ taskName, startTime, endTime, attempted }: TaskProps) {
  function formatTime(date: Date) {
    const hours = date.getUTCHours().toString();
    const h = hours.length == 1 ? "0" + hours : hours
    const minutes = date.getUTCMinutes().toString();
    const m = minutes.length == 1 ? "0" + minutes : minutes;
    const seconds = date.getUTCSeconds().toString();
    const s = seconds.length == 1 ? "0" + seconds : seconds;

    return `${h}:${m}:${s}`;
  }
  return (
    <>
      <div className="task-container">
        <p className="task-name">{taskName}</p>
        {attempted ? (
          <p className="task-date">
            {formatTime(new Date(endTime.getTime() - startTime.getTime()))}
          </p>
        ) : (
          <p className="task-date">
            {formatTime(startTime)} - {formatTime(endTime)}
          </p>
        )}
        <div className="task-utilities">
          {attempted ? (
            <>
              <img src="edit.svg" alt="continue or edit time entry" />
            </>
          ) : (
            <>
              <img src="play.svg" alt="start time entry"  />
            </>
          )}
            <img src="./delete.svg" alt="delete time entry" />
        </div>
      </div>
    </>
  );
}
