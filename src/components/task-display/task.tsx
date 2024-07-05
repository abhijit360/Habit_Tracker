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
      <div>
        <p>{taskName}</p>
        {attempted ? (
          <p>{formatTime(new Date(endTime.getTime() - startTime.getTime()))}</p>
        ) : (
          <p>
            `${formatTime(startTime)} - ${formatTime(endTime)}`
          </p>
        )}
        <img src="./check.svg" style={{ width:"24px", height:"24px"}} />
        <img src="./delete.svg" style={{ width:"24px", height:"24px"}}/>
        <img src="edit.svg"style={{ width:"24px", height:"24px"}} />
      </div>
      
    </>
  );
}
