import React, { useState } from 'react';
import {
  GoogleCalendarEvent,
  GoogleCalendarEventListing,
  GoogleCalendarListing,
  TaskType,
} from '../../../../types';

import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore';
interface DisplayCalendarProps {
  CalendarList: GoogleCalendarListing[];
}

// function handleCalendarSelect(e: React.ChangeEvent) {
//   const target = e.target as HTMLInputElement;
//   target.disabled = true; // this should be reset by using the calendar.id
// }

export function DisplayCalendar({ CalendarList }: DisplayCalendarProps) {
  const {updateNavigation} = useNavigationStore()
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
      newTask.id = window.crypto.randomUUID();
      newTask.state = 'new';
      newTask.times = [
        {
          startTime: new Date(event.start.dateTime),
          endTime: new Date(event.end.dateTime),
        },
      ];
      append(newTask);
    });
  }
  console.log('tasks', tasks);
  return (
    <div className="calendar-container">
      <p>Select which calendar and tasks to import</p>
      {CalendarList.length > 0 ? (
        CalendarList.map((calendar, index) => (
          <>
            <label>
              <input
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
      <div className="calendar-events-container">
        {tasks.map((task) => (
          <>
            <div style={{backgroundColor: "white"}} className="preliminary-task-display">
              <p style={{ color: 'black' }}>{task.title}</p>
              <p style={{ color: 'black' }}>
                {task.times[0].startTime.toISOString()} -{' '}
                {task.times[0].endTime.toISOString()}
              </p>
              <button onClick={() => remove(task.id)}>remove</button>
            </div>
          </>
        ))}
      </div>
      <button onClick={ () => updateNavigation("TaskDisplay")}>Continue to track</button>
    </div>
  );
}
