import React, { useEffect, useState } from 'react';
import './task-tracker.css';
import { Timer } from './timer';
import { TaskDescription } from './task-description';
import { HeaderBar } from '../header-bar/header-bar';
import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { TaskType } from '../../../../types';

export function TaskTracker() {
  const { tasks, updateTaskTime } = useTasksStore();
  const { current_task_id } = useNavigationStore();
  const [currentTask, setCurrentTask] = useState<TaskType>({} as TaskType);
  useEffect(() => {
    setCurrentTask(tasks.filter((task) => task.id !== current_task_id)[0]);
  }, [current_task_id, tasks]);

  function updateTime(time: { h: number; m: number; s: number }) {
    updateTaskTime(currentTask.id, time);
  }


  return (
    <>
      {
        current_task_id != null ?
        <div className="time-tracker-container">
          <HeaderBar />
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '90%',
              alignSelf: 'center',
            }}
          >
            <TaskDescription
              title={currentTask.title}
              body={currentTask.body}
            />
            <Timer
              hours={0}
              minutes={0}
              seconds={0}
              started={false}
              updateTaskTime={updateTaskTime}
            />
          </div>
        </div>
        : 
        <>
          <p> No tasks to track. Create or import tasks.</p>
        </>
      }
    </>
  );
}
