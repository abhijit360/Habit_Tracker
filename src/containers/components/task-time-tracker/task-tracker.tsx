import React, { useEffect, useState } from 'react';
import './task-tracker.css';
import { Timer } from './timer';
import { TaskDescription } from './task-description';
import { HeaderBar } from '../header-bar/header-bar';
import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { TaskType } from '../../../../types';

export function TaskTracker() {
  const { tasks} = useTasksStore();
  const { current_task_id, updateCurrentTask } = useNavigationStore();
  const [currentTask, setCurrentTask] = useState<TaskType>({} as TaskType);
  useEffect(() => {
    setCurrentTask(tasks.filter((task) => task.id === current_task_id)[0]);
  }, [current_task_id, tasks]);

  async function checkForPeristingTask() {
    const task_id_obj = await chrome.storage.session.get('current-task-id');
    console.log('task_id_obj', task_id_obj);
    console.log('tasks', tasks);
    if (task_id_obj['current-task-id']) {
      setCurrentTask(
        tasks.filter((task) => task.id === task_id_obj['current-task-id'])[0]
      );
      updateCurrentTask(task_id_obj['current-task-id']);
    }
  }

  useEffect(() => {
    checkForPeristingTask();
  }, []);

  console.log('current task', currentTask);
  return (
    <>
      {current_task_id != null ? (
        <div className="time-tracker-container">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <div className="task-description-container">
              <p className="task-description-title">{currentTask.title}</p>
              <p className="task-description-body">{currentTask.body}</p>
            </div>
            <Timer
              hours={0}
              minutes={0}
              seconds={0}
              started={false}
              currentTask = {currentTask}
            />
          </div>
        </div>
      ) : (
        <>
          <p> No tasks to track. Create or import tasks.</p>
        </>
      )}
    </>
  );
}
