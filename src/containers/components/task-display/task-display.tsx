import React, {HTMLInputTypeAttribute, useState} from 'react';
import { Task } from './task';
import './task-display.css';
import addIcon from '../../../assets/img/add.svg';
import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { Input } from '../../shadcn components/input';
import type { TaskType } from '../../../../types';

export function TaskDisplay() {
  const { tasks } = useTasksStore();
  const { updateNavigation } = useNavigationStore();
  const [filteredTask, setFilteredTasks] = useState<TaskType[]>(tasks)

  function getFormattedDate(date: Date) {
    var year = date.getFullYear();

    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }

  function handleSearch(e: React.ChangeEvent){
    const input = e.target as HTMLInputElement
    const searchTerm = input.value
    setFilteredTasks(tasks.filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase())))
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
          <input className="task-display-searchbar" placeholder='search' onChange={handleSearch}/>
          
          <img
            src={addIcon}
            className="task-display-add-icon"
            alt="add task"
            onClick={() => updateNavigation('TaskAdd')}
          />
        </div>
        <div className="task-display-body">
          {filteredTask.map((task) => (
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
