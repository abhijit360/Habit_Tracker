import "./App.css";
import React from "react";
import { TaskDisplay } from "../../containers/components/task-display/task-display"
import { TaskHistory } from "../../containers/components/task-history/task-history";
import { TaskTracker } from "../../containers/components/task-time-tracker/task-tracker";
import { TaskEditor } from "../../containers/components/task-editor/task-editor";
import { LogIn} from "../../containers/components/auth/login"
import type { TaskType } from "../../../types";

function App() {
  const dummyTask: TaskType = {
    id: window.crypto.randomUUID(),
    title: "Task One",
    body: "Task one test body",
    state: "completed",
    times: [
      {
        startTime: new Date(Date.now()),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    ],
  };

  return (
    <div className="App">
      <header className="App-header">
        <LogIn />
        {/* <TaskHistory />
        <TaskDisplay /> */}
        {/* <TaskTracker /> */}
        {/* <TaskEditor TaskData={dummyTask} /> */}
      </header>
    </div>
  );
}

export default App;
