import React, { useEffect, useState } from 'react';
import {
  GoogleCalendarEvent,
  GoogleCalendarEventListing,
  GoogleCalendarListing,
  TaskType,
} from '../../../../types';
import './display-calendar.css';
import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore';
interface DisplayCalendarProps {
  CalendarList: GoogleCalendarListing[];
}

export function DisplayCalendar({ CalendarList }: DisplayCalendarProps) {
  const { updateNavigation } = useNavigationStore();
  const { tasks, append, remove } = useTasksStore();

  async function handleCalendarSelect(e: React.MouseEvent) {
    const target = e.target as HTMLInputElement;
    const calendarId = target.value;

    const tokenObj = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );

    const now = new Date();
    const timeMin = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const timeMax = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1
    );
    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMax=${timeMax.toISOString()}&timeMin=${timeMin.toISOString()}&eventTypes=default`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenObj['lockIn-curr-google-token']}`,
        },
      }
    );

    const data: GoogleCalendarEventListing = await response.json();
    const events: GoogleCalendarEvent[] = data.items;
    events.forEach((event) => {
      const newTask = {} as TaskType;
      newTask.title = event.summary;
      newTask.id = event.id;
      newTask.body = event.description;
      newTask.calendarId = calendarId;
      newTask.state = 'new';
      newTask.time = {
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end.dateTime),
      };
      append(newTask);
    });
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
  async function handleTaskStateCreation() {
    await chrome.storage.session.set({
      current_task_state: JSON.stringify(tasks),
    });
    updateNavigation('TaskDisplay');
  }

  async function checkExistingTaskState() {
    const response = await chrome.storage.session.get('current_task_state');
    if (response['current_task_state']) {
      console.log('stored tasks:', response['current_task_state']);
      const val: TaskType[] = JSON.parse(response['current_task_state']);
      val.forEach((task: TaskType) => append(task));
      val.forEach((task) => console.log('individual task', task.time.endTime));
    }
  }

  useEffect(() => {
    checkExistingTaskState();
  }, []);

  console.log('tasks', tasks);
  return (
    <div className="calendar-container">
      <p>Select which calendar and tasks to import</p>
      <div className="calendar-listing">
        {CalendarList.length > 0 ? (
          CalendarList.map((calendar, index) => (
            <>
              <label className="calendar-title">
                <input
                  key={index}
                  type="radio"
                  name="calendar"
                  value={calendar.id}
                  onChange={handleCalendarSelect}
                />
                {calendar.summary}
              </label>
            </>
          ))
        ) : (
          <p>No Calendars to Import</p>
        )}
      </div>
      <div className="calendar-events-container">
        {tasks.map((task) => (
          <>
            <div className="preliminary-task-display">
              <p style={{ color: 'black' }} className="task-tite">
                {task.title}
              </p>
              <p style={{ color: 'black' }} className="task-date">
                {formatDateString(new Date(task.time.startTime))} -
                {formatDateString(new Date(task.time.endTime))}
              </p>
              <button onClick={() => remove(task.id)}>remove</button>
            </div>
          </>
        ))}
      </div>
      <button onClick={() => handleTaskStateCreation()}>
        Continue to track
      </button>
    </div>
  );
}
