import React from 'react';
import './task.css';
import { TaskType } from '../../../../types';
import { useTasksStore } from '../../../../stores/taskStore';
import editIcon from '../../../assets/img/edit.svg'
import deleteIcon from '../../../assets/img/delete.svg';
import playIcon from '../../../assets/img/play.svg';
import { useNavigationStore } from '../../../../stores/navigationStore';

export function Task({ id, title, body, time, state }: TaskType) {
  const {updateCurrentTask, updateNavigation} = useNavigationStore()
  function formatTime(date: Date) {
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    return { h: hours, m: minutes, s: seconds };
  }

  const { remove } = useTasksStore();

  function timeToString(data: { h: number; m: number; s: number }) {
    const hours =
      data.h.toString().length === 1 ? `0${data.h}` : data.h.toString();
    const minutes =
      data.m.toString().length === 1 ? `0${data.m}` : data.m.toString();
    const seconds =
      data.s.toString().length === 1 ? `0${data.s}` : data.s.toString();
    return `${hours}:${minutes}:${seconds}`;
  }
  const time_passed = formatTime(
    new Date(time.endTime.getTime() - time.startTime.getTime())
  );

  function handleStartTask(){
    updateCurrentTask(id)
    updateNavigation("TaskTimer")
  }

  return (
    <>
      <div className="task-container">
        <p className="task-name">{title}</p>
        {state === 'new' ? (
          <p className="task-date">
            {new Date(time.endTime.getTime()).toISOString()} - {new Date(time.startTime.getTime()).toISOString()}
          </p>
        ) : (
          <p className="task-date">{timeToString(time_passed)}</p>
        )}
        <div className="task-utilities">
          {state !== 'new' ? (
            <>
              <img src={editIcon} alt="continue or edit time entry" />
            </>
          ) : (
            <>
              <img src={playIcon} alt="start time entry" onClick={handleStartTask}/>
            </>
          )}
          <img
            src={deleteIcon}
            onClick={() => remove(id)}
            alt="delete time entry"
          />
        </div>
      </div>
    </>
  );
}
