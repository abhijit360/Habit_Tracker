import React, { useState } from 'react';
import './task.css';
import { TaskType } from '../../../../types';
import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { useErrorStore } from '../../../../stores/errorStore';

export function Task({ id, title, body, time, state, calendarId }: TaskType) {
  const { updateCurrentTask, updateNavigation, updateCurrentEditTask, current_edit_task_id, current_task_id } =
    useNavigationStore();
  const { setError } = useErrorStore();
  const [checkedState, setCheckedState] = useState<boolean>(
    state === 'new' ? false : true
  );

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
    new Date(
      new Date(time.endTime).getTime() - new Date(time.startTime).getTime()
    )
  );

  async function handleStartTask() {
    const key = await chrome.storage.session.get('current-task-id');
    if (key['current-task-id']) {
      if (id === key['current-task-id']) {
        updateNavigation('TaskTimer');
        return;
      }
      setError('A task is currently in process');
    } else {
      updateCurrentTask(id);
      updateNavigation('TaskTimer');
    }
  }

  async function handleEditTask() {
    if(current_task_id && id === current_task_id){
      setError("This task is currently being tracked")
      return
    }
    updateCurrentEditTask(id);
    updateNavigation('TaskEdit');
  }

  function formatDateString(date: Date): string {
    const hours =
      date.getHours().toString().length === 1
        ? `0${date.getHours().toString()}`
        : date.getHours().toString();
    const minutes =
      date.getMinutes().toString().length === 1
        ? `0${date.getMinutes().toString()}`
        : date.getMinutes().toString();
    const seconds =
      date.getSeconds().toString().length === 1
        ? `0${date.getSeconds().toString()}`
        : date.getSeconds().toString();
    return `${hours}:${minutes}:${seconds}`;
  }

  return (
    <>
      <div className="task-container">
        <Checkbox
          checked={checkedState}
          onCheckedChange={() => setCheckedState((prev) => !prev)}
        />
        <p className="task-name">{title}</p>
        {state === 'new' ? (
          <p className="task-date">
            {formatDateString(new Date(time.startTime))} -{' '}
            {formatDateString(new Date(time.endTime))}
          </p>
        ) : (
          <p className="task-date">{timeToString(time_passed)}</p>
        )}
        <span className=' justify-center align-middle self-center'>
          <Popover>
            <PopoverTrigger asChild>
              <span className='text-[12px] font-bold'>...</span>
            </PopoverTrigger>
            <PopoverContent className="w-8">
              <div className="bg-white pl-2 pr-2">
                <button className="bg-red-500" onClick={() => handleEditTask()}>Edit</button>
                <button onClick={() => handleStartTask()}>Start</button>
                <button onClick={() => remove(id)}>Delete</button>
              </div>
            </PopoverContent>
          </Popover>
        </span>
      </div>
    </>
  );
}
