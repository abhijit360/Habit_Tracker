import React from "react";
import "./task.css";
import { TaskType } from "../../../types";
import { useTasksStore } from "../../store";

export function Task({ id, title, times, state }: TaskType) {
  function formatTime(date: Date) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return { h: hours, m: minutes, s: seconds };
  }

  const {remove} = useTasksStore()

  function timeToString( data: {h: number, m:number, s:number}){
    const hours = data.h.toString().length == 1 ? `0${data.h}` : data.h.toString()
    const minutes = data.m.toString().length == 1 ? `0${data.m}` : data.m.toString()
    const seconds = data.s.toString().length == 1 ? `0${data.s}` : data.s.toString()
    return `${hours}:${minutes}:${seconds}`
  }
  const time_passed = times
    .map((time) =>
      formatTime(new Date(time.endTime.getTime() - time.startTime.getTime()))
    )
    .reduce(
      (acc, time) => {
        acc.h += time.h;
        acc.m += time.m;
        acc.s += time.s;
        return acc;
      },
      { h: 0, m: 0, s: 0 }
    );

  return (
    <>
      <div className="task-container">
        <p className="task-name">{title}</p>
        {state === "new" ? (
          <p className="task-date">
            {/* {formatTime(new Date(endTime.getTime() - startTime.getTime()))} */}
            SCHEDULED-TIME-HERE
          </p>
        ) : (
          <p className="task-date">
            {timeToString(time_passed)}
          </p>
        )}
        <div className="task-utilities">
          {state !== "new" ? (
            <>
              <img src="edit.svg" alt="continue or edit time entry" />
            </>
          ) : (
            <>
              <img src="play.svg" alt="start time entry" />
            </>
          )}
          <img src="./delete.svg" onClick={() => remove(id)} alt="delete time entry" />
        </div>
      </div>
    </>
  );
}
