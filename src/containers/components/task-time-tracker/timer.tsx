import React from "react";
import "./timer.css";
import pauseIcon from "../../../assets/img/pause.svg"
import playIcon from "../../../assets/img/play.svg"

interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  started: boolean;
}

export function Timer({ hours, minutes, seconds, started }: TimerProps) {
  // function
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
          {!started ? (
            <>
              <img
                className="timer-utilities"
                src={pauseIcon}
                alt="stop timer"
              />
            </>
          ) : (
            <>
              <img
                className="timer-utilities"
                src={playIcon}
                alt="start timer"
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}
