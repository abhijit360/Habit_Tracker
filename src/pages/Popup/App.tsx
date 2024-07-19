import './App.css';
import React from 'react';
import { TaskDisplay } from '../../containers/components/task-display/task-display';
import { TaskHistory } from '../../containers/components/task-history/task-history';
import { TaskTracker } from '../../containers/components/task-time-tracker/task-tracker';
import { TaskEditor } from '../../containers/components/task-editor/task-editor';
import { LogIn } from '../../containers/components/auth/login';
import { useNavigationStore } from '../../../stores/navigationStore';
import type { TaskType, Page } from '../../../types';

function App() {
  const {
    prev_navigation_states,
    current_navigation_state,
    updateNavigation,
    revertToPreviousState,
  } = useNavigationStore();
  const dummyTask: TaskType = {
    id: window.crypto.randomUUID(),
    title: 'Task One',
    body: 'Task one test body',
    state: 'completed',
    times: [
      {
        startTime: new Date(Date.now()),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    ],
  };

  function incrementNavigation(e: React.MouseEvent) {
    const target = e.target as HTMLButtonElement;
    updateNavigation(target.value as Page);
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>current navigation: {current_navigation_state}</p>
        <div className="nav-container">
          <button
            className="nav-button"
            value={'Login'}
            onClick={incrementNavigation}
          >
            Login
          </button>
          <button
            className="nav-button"
            value={'TaskDisplay'}
            onClick={incrementNavigation}
          >
            Task Display
          </button>
          <button
            className="nav-button"
            value={'TaskEdit'}
            onClick={incrementNavigation}
          >
            Task Edit
          </button>
          <button
            className="nav-button"
            value={'TaskAdd'}
            onClick={incrementNavigation}
          >
            Task Add
          </button>
          <button
            className="nav-button"
            value={'TaskTimer'}
            onClick={incrementNavigation}
          >
            Task Timer
          </button>
          <button
            className="nav-button"
            onClick={() => revertToPreviousState()}
          >
            back
          </button>
        </div>
        <TaskHistory />
        {current_navigation_state === 'Login' ? (
          <LogIn />
        ) : current_navigation_state === 'TaskDisplay' ? (
          <TaskDisplay />
        ) : current_navigation_state === 'TaskEdit' ? (
          <TaskEditor TaskData={dummyTask} />
        ) : current_navigation_state === 'TaskAdd' ? (
          <p>coming soon</p>
        ) : (
          <TaskTracker />
        )}
      </header>
    </div>
  );
}

export default App;
