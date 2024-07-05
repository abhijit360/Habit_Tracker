import React from "react";
import "./progress-bar.css";
interface ProgressBarProps {
  finished: number;
  total: number;
}

export function ProgressBar({ finished, total }: ProgressBarProps) {
  return (
    <>
      <p className="progress-bar">
        {finished}/{total} tasks completed
      </p>
    </>
  );
}
