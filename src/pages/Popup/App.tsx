import './App.css';
import React, { useEffect } from 'react';
import { TaskDisplay } from '../../containers/components/task-display/task-display';
import { TaskHistory } from '../../containers/components/task-history/task-history';
import { TaskTracker } from '../../containers/components/task-time-tracker/task-tracker';
import { TaskEditor } from '../../containers/components/task-editor/task-editor';
import { LogIn } from '../../containers/components/auth/login';
import { Error } from '../../containers/components/miscellaneous/error';
import { useNavigationStore } from '../../../stores/navigationStore';
import {useErrorStore} from "../../../stores/errorStore"
import type { TaskType, Page } from '../../../types';

function App() {
  const {current_navigation_state,updateNavigation,revertToPreviousState,} = useNavigationStore();
  const {error,removeError} = useErrorStore()
  const dummyTask: TaskType = {
    id: window.crypto.randomUUID(),
    title: 'Task One',
    body: 'Task one test body',
    state: 'completed',
    time:{
        startTime: new Date(Date.now()),
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      },
    
  };

  function incrementNavigation(e: React.MouseEvent) {
    const target = e.target as HTMLButtonElement;
    updateNavigation(target.value as Page);
  }

  useEffect(() =>{
    if(error != null){
      setTimeout(removeError, 5000)
    }
  },[error,removeError])

  console.log("current error", error)

  return (
    <div className="App">
      <header className="App-header">
        {error && <Error error={error}/>
          }
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
