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

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter= (e: React.MouseEvent) => {
      setPosition({
          x: e.clientX - 10,
          y: e.clientY - 20
      });
      setVisibility(true);
  };

  const handleMouseOut = () => {
      setVisibility(false);
  };
  return (
    <>
      <span
        className={`tile `+` ${tasksCompletedRatio === 0 ? "" : tasksCompletedRatio > 0.9 ? `green4` : tasksCompletedRatio > 0.7 ? 'green3' : tasksCompletedRatio > 0.4 ? 'green2' : 'green1'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseOut}
      >{day}</span>
      {visibility && (
        <span className="tile-tooltip" style={{left: position.x , top: position.y}}>{completedTasks} tasks completed</span>
      )}
    </>
  );
}
