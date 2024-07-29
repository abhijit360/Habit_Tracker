import React, { useEffect, useMemo, useState } from 'react';
import {
  GoogleCalendarEvent,
  GoogleCalendarEventListing,
  GoogleCalendarListing,
  TaskType,
} from '../../../../types';
import './display-calendar.css';
import { useTasksStore } from '../../../../stores/taskStore';
import { useNavigationStore } from '../../../../stores/navigationStore';
import { useCalendarStore } from '../../../../stores/calendarStore';
import { useErrorStore } from '../../../../stores/errorStore';
import { Loading } from '../miscellaneous/loading';
interface DisplayCalendarProps {
  CalendarList: GoogleCalendarListing[];
  calendarDataObtained: boolean;
}

export function DisplayCalendar({
  CalendarList,
  calendarDataObtained,
}: DisplayCalendarProps) {
  const { updateNavigation } = useNavigationStore();
  const { tasks, append } = useTasksStore();
  const { setError } = useErrorStore();
  const { calendars } = useCalendarStore();
  const [selectedCalendars, setSelectedCalendars] = useState<Set<string>>(
    new Set<string>()
  );

  async function handleCalendarSelect(e: React.MouseEvent) {
    const target = e.target as HTMLInputElement;
    const calendarId = target.value;
    const currentCalendar = calendars.filter(
      (c) => c.calendarId === calendarId
    )[0];
    if (selectedCalendars.has(currentCalendar.calendarName)) {
      setError(
        `Task from ${currentCalendar.calendarName} have already been imported`
      );
      return;
    }
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
      newTask.calendarName = currentCalendar
        ? currentCalendar.calendarName
        : '';
      newTask.state = 'new';
      newTask.time = {
        startTime: new Date(event.start.dateTime),
        endTime: new Date(event.end.dateTime),
      };
      append(newTask);
    });
    setSelectedCalendars(
      (prev) => new Set(prev.add(currentCalendar.calendarName))
    );
    setError(`Getting tasks from ${currentCalendar.calendarName}`);
  }

  async function handleTaskStateCreation() {
    await chrome.storage.session.set({
      current_task_state: JSON.stringify(tasks),
    });
    await chrome.storage.session.set({
      current_calendars_imported: JSON.stringify(Array.from(selectedCalendars)),
    });
    updateNavigation('TaskDisplay');
  }

  async function checkExistingTaskState() {
    const response = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    if (response['lockIn-curr-google-token']) {
      const response = await chrome.storage.session.get('current_task_state');
      if (response['current_task_state']) {
        const val: TaskType[] = JSON.parse(response['current_task_state']);
        val.forEach((task: TaskType) => append(task));
      }
      const calendarsStorageObject = await chrome.storage.session.get(
        'current_calendars_imported'
      );
      if (calendarsStorageObject) {
        setSelectedCalendars(
          new Set(
            JSON.parse(calendarsStorageObject['current_calendars_imported'])
          )
        );
      }
    }
  }

  useEffect(() => {
    checkExistingTaskState();
  }, []);

  const selectedCalendarList = useMemo(() => {
    return Array.from(selectedCalendars).map((calendarName) => (
      <li key={calendarName} className="calendar-selected-name">
        {calendarName}
      </li>
    ));
  }, [selectedCalendars]);

  return (
    <div className="calendar-container">
      {!calendarDataObtained && (
        <span style={{ alignSelf: 'center' }}>
          <Loading />
        </span>
      )}
      {calendarDataObtained && <p>Select which calendar and tasks to import</p>}
      <div className="calendar-listing">
        {calendarDataObtained &&
          CalendarList.length > 0 &&
          CalendarList.map((calendar, index) => (
            <>
              <button value={calendar.id} onClick={handleCalendarSelect} className='calendar-listing-button'>
                {calendar.summary}
              </button>
            </>
          ))}
        {calendarDataObtained && CalendarList.length === 0 && (
          <p>No Calendars to Import</p>
        )}
      </div>
      {calendarDataObtained && (
        <>
          <p>Tasks imported from:</p>
          <div className="calendar-selected-container">{selectedCalendarList}</div>
          <button onClick={() => handleTaskStateCreation()}>
            Continue to track
          </button>
        </>
      )}
    </div>
  );
}
