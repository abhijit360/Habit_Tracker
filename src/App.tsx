import React from 'react';
import logo from './logo.svg';
import './App.css';
import {TaskDisplay} from './components/task-display/task-display'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <TaskDisplay />
      </header>
    </div>
  );
}

export default App;
