import { React, useState } from 'react';
import {
  GoogleCalendarEvent,
  GoogleCalendarEventListing,
  GoogleCalendarListing,
} from '../../../../types';

interface DisplayCalendarProps {
  CalendarList: GoogleCalendarListing[];
}

function handleCalendarSelect(e: React){
    const target = e.target as HTMLInputElement
    target.disabled = true // this should be reset by using the calendar.id
}

export function DisplayCalendar({ CalendarList }: DisplayCalendarProps) {
  const [calendarListings, setCalendarListings] =
    useState<GoogleCalendarListing[]>(CalendarList);
  return (
    <div className="calendar-container">
      {calendarListings.map((calendar) => (
        <>
          <input type="radio" value={calendar.id} multiple={true} onSelect={handleCalendarSelect}>
            {calendar.summary}
          </input>
        </>
      ))}
    </div>
  );
}
