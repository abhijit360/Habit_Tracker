import "./App.css";
import { TaskDisplay } from "./components/task-display/task-display";
import { TaskHistory } from "./components/task-history/task-history";
import { TaskTracker } from "./components/task-time-tracker/task-tracker";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p style={{ alignSelf: "start" }}>Weekly Tracker</p>
        <TaskHistory />
        <TaskDisplay />
        <TaskTracker />
      </header>
    </div>
  );
}

export default App;
