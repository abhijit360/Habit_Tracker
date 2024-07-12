import React from "react";
import "./task-description.css"
interface TaskDescriptionProps {
  title: string;
  body: string;
}

export function TaskDescription({ title, body }: TaskDescriptionProps) {
  return (
    <>
      <div className="task-description-container">
        <p className="task-description-title">{title}</p>
        <p className="task-description-body">{body}</p>
      </div>
    </>
  );
}
