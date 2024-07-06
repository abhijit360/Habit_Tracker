import React from "react";

interface TaskProps {
  taskName: String;
  startTime: Date;
  endTime: Date;
  attempted: Boolean;
}

export function Task({ taskName, startTime, endTime, attempted }: TaskProps) {
  function formatTime(date: Date) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours}:${minutes}`;
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
            `${formatTime(startTime)} - ${formatTime(endTime)}`
          </p>
        )}
        <div className="task-utilities">
          {attempted ? (
            <>
              <img src="edit.svg" alt="continue or edit time entry" style={{ width: "24px", height: "24px", cursor: "pointer" }} />
            </>
          ) : (
            <>
              <img src="play.svg" alt="start time entry" style={{ width: "24px", height: "24px", cursor: "pointer"}} />
            </>
          )}
            <img src="./delete.svg" alt="delete time entry" style={{ width: "24px", height: "24px", cursor: "pointer" }} />
        </div>
      </div>
    </>
  );
}
