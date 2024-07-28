import './App.css';
import React, { useCallback, useEffect } from 'react';
import { TaskDisplay } from '../../containers/components/task-display/task-display';
import { TaskTracker } from '../../containers/components/task-time-tracker/task-tracker';
import { TaskEditor } from '../../containers/components/task-editor/task-editor';
import { LogIn } from '../../containers/components/auth/login';
import { Error } from '../../containers/components/miscellaneous/error';
import { useNavigationStore } from '../../../stores/navigationStore';
import { useErrorStore } from '../../../stores/errorStore';
import type { TaskType, Page } from '../../../types';
import { useTasksStore } from '../../../stores/taskStore';
import githubIcon from '../../assets/img/github-mark-white.svg';

function App() {
  const {
    current_navigation_state,
    current_edit_task_id,
    current_task_id,
    updateNavigation,
    updateCurrentTask,
  } = useNavigationStore();
  const { error, removeError } = useErrorStore();
  const { tasks, clearTaskState } = useTasksStore();

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
    const authToken = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    if (!authToken['lockIn-curr-google-token']) {
      return;
    }
    const task_id_obj = await chrome.storage.session.get('current-task-id');
    if (task_id_obj['current-task-id']) {
      updateCurrentTask(task_id_obj['current-task-id']);
    }
  }, [updateCurrentTask]);

  async function handleLogOut() {
    await chrome.storage.session.set({ 'lockIn-curr-google-token': null });
    clearTaskState();
    updateNavigation('Login');
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  }

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
            onClick={() =>
              current_navigation_state === 'Login'
                ? handleLogOut()
                : updateNavigation('Login')
            }
          >
            {current_navigation_state !== 'Login' ? 'Home' : 'Logout'}
          </button>
          <button
            className="nav-button"
            value={'TaskDisplay'}
            onClick={incrementNavigation}
          >
            Task Display
          </button>
          {current_task_id && (
            <button
              className="nav-button"
              value={'TaskTimer'}
              onClick={incrementNavigation}
            >
              Time Tracker
            </button>
          )}
        </div>
        {/* <TaskHistory /> */}
        {current_navigation_state === 'Login' ? (
          <LogIn />
        ) : current_navigation_state === 'TaskDisplay' ? (
          <TaskDisplay />
        ) : current_navigation_state === 'TaskEdit' ? (
          <TaskEditor
            TaskData={
              current_edit_task_id
                ? tasks.filter((task) => task.id === current_edit_task_id)[0]
                : null
            }
            state={'edit'}
          />
        ) : current_navigation_state === 'TaskAdd' ? (
          <TaskEditor TaskData={{} as TaskType} state={'add'} />
        ) : (
          <TaskTracker />
        )}
        <div className="credentials-container">
          <p>Built by Abhijit Kamath</p>
          <a href="https://github.com/abhijit360">
            <img
              src={githubIcon}
              style={{ width: '16px', height: '16px' }}
              alt="My Github"
            />
          </a>
        </div>
      </header>
    </div>
  );
}

export default App;
