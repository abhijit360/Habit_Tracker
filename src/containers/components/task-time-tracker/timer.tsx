import React, { useState, useEffect } from 'react';
import './timer.css';
import pauseIcon from '../../../assets/img/pause.svg';
import playIcon from '../../../assets/img/play.svg';

interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
}

export function Timer({ hours, minutes, seconds, started }: TimerProps) {
  const [toggleIcon, setToggleIcon] = useState<boolean>(started);
  const [currentTime, setCurrentTime] = useState<{h:number,m:number,s:number}>({h:0,m:0,s:0})
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request) {
        setCurrentTime(request.time)
      }
    });
  }, []);

  let first_counter = 0;
  const h =
    hours.toString().length === 1 ? `0${hours.toString()}` : hours.toString();
  const m =
    minutes.toString().length === 1
      ? `0${minutes.toString()}`
      : minutes.toString();
  const s =
    seconds.toString().length === 1
      ? `0${seconds.toString()}`
      : seconds.toString();

  async function playHandler() {
    console.log('test');
    setToggleIcon((prev) => !prev);
    if (first_counter === 0) {
      first_counter += 1;
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
  }

  async function pauseHandler() {
    console.log('test2');
    setToggleIcon((prev) => !prev);
    const response = await chrome.runtime.sendMessage({ type: 'pause-timer' });
    console.log('pause response', response);
  }

  return (
    <>
      <div className="timer-container">
        <div className="timer-clock-container">
          <p className="timer-time">{currentTime.h}</p>
          <p className="timer-separator">:</p>
          <p className="timer-time">{currentTime.m}</p>
          <p className="timer-separator">:</p>
          <p className="timer-time">{currentTime.s}</p>
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
        </div>
      </div>
    </>
  );
}
