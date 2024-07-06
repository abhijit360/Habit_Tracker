import './App.css';
import {TaskDisplay} from './components/task-display/task-display'
import {TaskHistory} from "./components/task-history/task-history"

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TaskHistory />
        <TaskDisplay />
      </header>
    </div>
  );
}

export default App;
