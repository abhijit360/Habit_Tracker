import "./App.css";
import { TaskDisplay } from "./components/task-display/task-display";
import { TaskHistory } from "./components/task-history/task-history";
import { TaskTracker } from "./components/task-time-tracker/task-tracker";
import { TaskEditor } from "./components/task-editor/task-editor";
import type { TaskType } from "../types";

function App() {
  const dummyTask : TaskType = {
    title: "Task One", 
    body:"Task one test body", 
    state:"completed", 
    times: [{startTime: new Date(Date.now()) , endTime: new Date(Date.now() + 2* 60 * 60 * 1000)}]
  }

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
