import "./App.css";
import { TaskDisplay } from "./src/components/task-display/task-display";
import { TaskHistory } from "./src/components/task-history/task-history";
import { TaskTracker } from "./src/components/task-time-tracker/task-tracker";
import { TaskEditor } from "./src/components/task-editor/task-editor";
import type { TaskType } from "./types";

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
        {/* <TaskHistory />
        <TaskDisplay />
        <TaskTracker /> */}
        <TaskEditor TaskData={dummyTask} />
      </header>
    </div>
  );
}

export default App;
