import React, { useState } from 'react';
import {
  GoogleCalendarEvent,
  GoogleCalendarEventListing,
  GoogleCalendarListing,
  TaskType
} from '../../../../types';

import { useTasksStore } from '../../../../stores/taskStore';
interface DisplayCalendarProps {
  CalendarList: GoogleCalendarListing[];
}

function handleCalendarSelect(e: React.SyntheticEvent) {
  const target = e.target as HTMLInputElement;
  target.disabled = true; // this should be reset by using the calendar.id
}

export function DisplayCalendar({ CalendarList }: DisplayCalendarProps) {
  const { tasks, append, remove } = useTasksStore();
  const [calendarListings, setCalendarListings] = useState<GoogleCalendarListing[]>(CalendarList);
  const [calendarEvents, setCalendarEvents] = useState<GoogleCalendarEvent[]>([] as GoogleCalendarEvent[]);

  async function handleSelectionClick(e: React.MouseEvent) {
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
          startTime: event.start.dateTime,
          endTime: event.end.dateTime,
        },
      ];
      append(newTask);
    });
  }

  return (
    <div className="calendar-container">
      {calendarListings.map((calendar) => (
        <>
          <input
            type="radio"
            value={calendar.id}
            multiple={true}
            onSelect={handleCalendarSelect}
          >
            {calendar.summary}
          </input>
          <div className="calendar-events-container">
            {tasks.map((task) => (
              <>
                <div className="preliminary-task-display">
                  <p>{task.title}</p>
                  <button onClick={() => remove(task.id)}>remove</button>
                </div>
              </>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}
