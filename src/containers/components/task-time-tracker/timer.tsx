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
  const [firstCounter, setFirstCounter] = useState<number>(0);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if (request) {
        setCurrentTime(request)
      }
    });
  }, []);

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
    console.log("first counter:",firstCounter);
    setToggleIcon((prev) => !prev);
    if (firstCounter === 0){
      setFirstCounter(1);
      console.log("adding one to first_counter", firstCounter)
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
          <p className="timer-time">{currentTime.h.toString().length > 1 ? currentTime.h.toString() : "0".concat(currentTime.h.toString())}</p>
          <p className="timer-separator">:</p>
          <p className="timer-time">{currentTime.m.toString().length > 1 ? currentTime.m.toString() : "0".concat(currentTime.m.toString())}</p>
          <p className="timer-separator">:</p>
          <p className="timer-time">{currentTime.s.toString().length > 1 ? currentTime.s.toString() : "0".concat(currentTime.s.toString())}</p>
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
