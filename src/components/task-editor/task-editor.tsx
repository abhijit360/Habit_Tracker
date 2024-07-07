
import "./task-editor.css"
import {useForm, Resolver} from "react-hook-form";

type FormValues = {
    "title": string
    "body": string
    "start-time": [Date],
    "end-time": [Date],
    "state": "completed" | "in-progress" | "started"
}


export function TaskEditor() {
  return (
    <>
      <div className="task-editor-container">
      </div>
    </>
  );
}
