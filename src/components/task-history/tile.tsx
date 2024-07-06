import React from "react";
import { useState } from "react";
import "./tile.css";
interface TileProps {
  completedTasks: number,
  totalTasks : number;
  day: string;
}

export function Tile({ completedTasks, totalTasks, day }: TileProps) {
  const [visibility, setVisibility] = useState<boolean>(false);
  const tasksCompletedRatio = completedTasks / totalTasks;

  return (
    <>
      <span
        className={`tile `+` ${tasksCompletedRatio === 0 ? "" : tasksCompletedRatio > 0.9 ? `green4` : tasksCompletedRatio > 0.7 ? 'green3' : tasksCompletedRatio > 0.4 ? 'green2' : 'green1'}`}
        onMouseEnter={() => setVisibility(true)}
        onMouseLeave={() => setVisibility(false)}
      >{day}</span>
      {visibility && (
        <span className="tile-tooltip">{totalTasks} tasks completed</span>
      )}
    </>
  );
}
