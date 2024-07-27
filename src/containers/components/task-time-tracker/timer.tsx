import React, { useState, useEffect } from 'react';
import './timer.css';
import pauseIcon from '../../../assets/img/pause.svg';
import playIcon from '../../../assets/img/play.svg';
import deleteIcon from '../../../assets/img/delete.svg';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { useTasksStore } from '../../../../stores/taskStore';
import { TaskType } from '../../../../types';

interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
  currentTask: TaskType;
}

export function Timer({
  hours,
  minutes,
  seconds,
  started,
  currentTask,
}: TimerProps) {
  const [toggleIcon, setToggleIcon] = useState<boolean>(started);
  const { current_task_id, updateCurrentTask, updateNavigation } =
    useNavigationStore();
  const [currentTime, setCurrentTime] = useState<{
    h: number;
    m: number;
    s: number;
  }>({ h: 0, m: 0, s: 0 });
  const [firstCounter, setFirstCounter] = useState<number>(0);
  const { updateTask } = useTasksStore();

  async function checkForExistingCounter() {
    console.log('checking if val exists');
    const val = await chrome.storage.session.get('timer-active-key');
    const time = await chrome.storage.session.get('current-time');
    const state = await chrome.storage.session.get('timer-state');
    console.log('values received', val);
    console.log('time received', time);
    console.log('state received', state);
    if (val['timer-active-key']) {
      setFirstCounter(1);
    }
    if (time['current-time']) {
      setCurrentTime(time['current-time']);
    }
    if (state['timer-state']) {
      if (state['timer-state'] === 'paused') {
        setToggleIcon(false);
      } else {
        setToggleIcon(true);
      }
    }
  }

  useEffect(() => {
    checkForExistingCounter();
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request) {
        setCurrentTime(request);
      }
    });
    
  }, []);

  async function playHandler() {
    console.log('first counter:', firstCounter);
    setToggleIcon((prev) => !prev);
    if (firstCounter === 0) {
      setFirstCounter(1);
      console.log('adding one to first_counter', firstCounter);
      const response = await chrome.runtime.sendMessage({
        type: 'start-timer',
      });
      console.log('first time starting response', response);
    } else {
      const response = await chrome.runtime.sendMessage({
        type: 'resume-timer',
      });
      console.log('resume response', response);
    }
    await chrome.storage.session.set({ 'current-task-id': current_task_id });
  }

  async function deleteTimerHandler() {
    setCurrentTime({ h: 0, m: 0, s: 0 });
    console.log('deleting timer');
    const response = await chrome.runtime.sendMessage({
      type: 'end-timer',
    });
    console.log('deleting timer storage', response);
    await chrome.storage.session.set({ 'current-task-id': null });
    updateCurrentTask('');
    updateNavigation('TaskDisplay');
  }

  async function pauseHandler() {
    setToggleIcon((prev) => !prev);
    const response = await chrome.runtime.sendMessage({ type: 'pause-timer' });
    console.log('pause response', response);
    //  update the time here
    updateTask(
      {
        ...currentTask,
        time: {
          startTime: currentTask.time.startTime,
          endTime: new Date(
            new Date(currentTask.time.startTime).getTime() +
              (60 * 60 * currentTime.h +
              60 * currentTime.m +
              currentTime.s) * 1000
          ),
        },
      } as TaskType,
      currentTask.id
    );
  }

  return (
    <>
      <div className="timer-container">
        <div className="timer-clock-container">
          <p className="timer-time">
            {currentTime.h.toString().length > 1
              ? currentTime.h.toString()
              : '0'.concat(currentTime.h.toString())}
          </p>
          <p className="timer-separator">:</p>
          <p className="timer-time">
            {currentTime.m.toString().length > 1
              ? currentTime.m.toString()
              : '0'.concat(currentTime.m.toString())}
          </p>
          <p className="timer-separator">:</p>
          <p className="timer-time">
            {currentTime.s.toString().length > 1
              ? currentTime.s.toString()
              : '0'.concat(currentTime.s.toString())}
          </p>
        </div>
        <div className="timer-utilities-container">
          {toggleIcon ? (
            <>
              <img
                className="timer-utilities"
                src={pauseIcon}
                alt="stop timer"
                onClick={pauseHandler}
              />
            </>
          ) : (
            <>
              <img
                className="timer-utilities"
                src={playIcon}
                alt="start timer"
                onClick={playHandler}
              />
            </>
          )}
          <img
            className="timer-utilities"
            src={deleteIcon}
            alt="delete storage"
            onClick={deleteTimerHandler}
          />
        </div>
      </div>
    </>
  );
}
