import React, { useState } from 'react';
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
  // function
  const [toggleIcon, setToggleIcon] = useState<boolean>(started);
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

  function playHandler() {
    console.log('test');
    setToggleIcon((prev) => !prev);
    if (first_counter === 0) {
      first_counter += 1;
      chrome.runtime.sendMessage({ type: 'start-timer' }, (response) => {
        console.log('Response:', response);
      });
    } else {
      chrome.runtime.sendMessage({ type: 'resume-timer' }, (response) => {
        console.log('Response:', response);
      });
    }
  }

  function pauseHandler() {
    console.log('test2');
    setToggleIcon((prev) => !prev);
    chrome.runtime.sendMessage({ type: 'pause-timer' }, (response) => {
      console.log('Response:', response);
    });
  }

  return (
    <>
      <div className="timer-container">
        <div className="timer-clock-container">
          <p className="timer-time">{h}</p>
          <p className="timer-separator">:</p>
          <p className="timer-time">{m}</p>
          <p className="timer-separator">:</p>
          <p className="timer-time">{s}</p>
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
