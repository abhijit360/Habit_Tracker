import React from 'react';
import { Task } from './task';
import './task-display.css';
import addIcon from '../../../assets/img/add.svg';
import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore'; 
import {Input} from "@"

export function TaskDisplay() {
  const { tasks } = useTasksStore();
  const {updateNavigation} = useNavigationStore()

  function getFormattedDate(date: Date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }
  return (
    <>
      <div className="task-display-container">
        <div className="header-bar-container">
          <span className="time-container">
            <p className="time-title">Daily Tasks</p>
            <p className="time-date">
              {getFormattedDate(new Date(Date.now()))}
            </p>
          </span>
          <img
            src={addIcon}
            style={{
              // backgroundColor: "grey",
              cursor: 'pointer',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
            }}
            alt="add task"
            onClick={() => updateNavigation('TaskAdd')}
          />
        </div>
        <div className="task-display-body">
          {tasks.map((task) => (
            <Task
              calendarId={task.calendarId}
              id={task.id}
              key={task.id}
              time={task.time}
              state={task.state}
              title={task.title}
              body={task.body}
            />
          ))}
        </div>
      </div>
    </>
  );
}
