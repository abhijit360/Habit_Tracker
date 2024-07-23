import './App.css';
import React, { useCallback, useEffect } from 'react';
import { TaskDisplay } from '../../containers/components/task-display/task-display';
import { TaskHistory } from '../../containers/components/task-history/task-history';
import { TaskTracker } from '../../containers/components/task-time-tracker/task-tracker';
import { TaskEditor } from '../../containers/components/task-editor/task-editor';
import { LogIn } from '../../containers/components/auth/login';
import { Error } from '../../containers/components/miscellaneous/error';
import { useNavigationStore } from '../../../stores/navigationStore';
import { useErrorStore } from '../../../stores/errorStore';
import type { TaskType, Page } from '../../../types';
import { useTasksStore } from '../../../stores/taskStore';

function App() {
  const {
    current_navigation_state,
    current_task_id,
    current_edit_task_id,
    updateNavigation,
    revertToPreviousState,
    updateCurrentTask,
  } = useNavigationStore();
  const { error, removeError } = useErrorStore();
  const {tasks} = useTasksStore()

  function incrementNavigation(e: React.MouseEvent) {
    const target = e.target as HTMLButtonElement;
    updateNavigation(target.value as Page);
  }

  useEffect(() => {
    if (error != null) {
      setTimeout(removeError, 5000);
    }
  }, [error, removeError]);

  const checkForPeristingTaskState = useCallback(async () => {
    const task_id_obj = await chrome.storage.session.get('current-task-id');
    if (task_id_obj['current-task-id']) {
      updateCurrentTask(task_id_obj['current-task-id']);
    }
  },[updateCurrentTask]);

  useEffect(() => {
    checkForPeristingTaskState();
  }, [checkForPeristingTaskState]);

  console.log('current error', error);

  return (
    <div className="App">
      <header className="App-header">
        {error && <Error error={error} />}
        <div className="nav-container">
          <button
            className="nav-button"
            value={'Login'}
            onClick={incrementNavigation}
          >
            Home
          </button>
          <button
            className="nav-button"
            value={'TaskDisplay'}
            onClick={incrementNavigation}
          >
            Task Display
          </button>
        </div>
        {/* <TaskHistory /> */}
        {current_navigation_state === 'Login' ? (
          <LogIn />
        ) : current_navigation_state === 'TaskDisplay' ? (
          <TaskDisplay />
        ) : current_navigation_state === 'TaskEdit' ? (
          <TaskEditor TaskData={current_edit_task_id ? tasks.filter((task) => task.id === current_edit_task_id )[0] : null} state={"edit"}/>
        ) : current_navigation_state === 'TaskAdd' ? (
          <TaskEditor TaskData={{} as TaskType} state={"add"}/>
        ) : (
          <TaskTracker />
        )}
      </header>
    </div>
  );
}

export default App;
