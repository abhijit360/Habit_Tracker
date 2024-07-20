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
    return `${hours} h:${minutes} m:${seconds} s`;
  }
  const time_passed = formatTime(
    new Date(new Date(time.endTime).getTime() - new Date(time.startTime).getTime())
  );

  function handleStartTask(){
    updateCurrentTask(id)
    updateNavigation("TaskTimer")
  }

  function formatDateString(date: Date): string{
     const hours =
     date.getHours().toString().length === 1 ? `0${date.getHours().toString()}` : date.getHours().toString();
    const minutes =
    date.getMinutes().toString().length === 1 ? `0${date.getMinutes().toString()}` : date.getMinutes().toString();
    const seconds =
    date.getSeconds().toString().length === 1 ? `0${date.getSeconds().toString()}` : date.getSeconds().toString();
    return `${hours}:${minutes}:${seconds}`
  }

  return (
    <>
      <div className="task-container">
        <p className="task-name">{title}</p>
        {state === 'new' ? (
          <p className="task-date">
            {/* testing */}
            {formatDateString(new Date(time.startTime))} - {formatDateString(new Date(time.endTime))}
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
