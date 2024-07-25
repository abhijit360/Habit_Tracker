import React, { useState, useEffect } from 'react';
import type {
  GoogleUserObj,
  GoogleCalendarListing,
  GoogleCalendarEventListing,
  GoogleCalendarEvent,
  TaskType,
} from '../../../../types';
import { useTasksStore } from '../../../../stores/taskStore';
import { DisplayCalendar } from '../google-calendar/display-calendars';
import './login.css';

export function LogIn() {
  const [tokenAvailability, setTokenAvailability] = useState<boolean>(false);
  const [calendarListings, setCalendarListings] = useState<
    GoogleCalendarListing[]
  >([] as GoogleCalendarListing[]);
  const [userProfile, setUserProfile] = useState<GoogleUserObj>(
    {} as GoogleUserObj
  );
  const {clearTaskState} = useTasksStore()

  async function checkExistingToken() {
    const response = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    if (response['lockIn-curr-google-token']) {
      console.log(response['lockIn-curr-google-token']);
      const profile_data = await (
        await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response['lockIn-curr-google-token']}`
        )
      ).json();
      setUserProfile(profile_data);
      setTokenAvailability(true);
      getCalendars();
    }
  }
  useEffect(() => {
    checkExistingToken();
  }, [tokenAvailability]);

  async function loginHandler(e: React.MouseEvent) {
    if (chrome.identity) {
      chrome.identity.getAuthToken(
        { interactive: true },
        async function (token) {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
          } else {
            await chrome.storage.session.set({
              'lockIn-curr-google-token': token,
            });
            const profile_data = await (
              await fetch(
                `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
              )
            ).json();
            setUserProfile(profile_data);
            setTokenAvailability(true);
          }
        }
      );
    } else {
      console.error('chrome.identity is not available.');
    }
  }

  async function getCalendars() {
    const tokenObj = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/users/me/calendarList',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenObj['lockIn-curr-google-token']}`,
        },
      }
    );
    console.log('response?', response.ok);
    if (!response.ok) {
      setTokenAvailability(false);
      await chrome.storage.session.set({ 'lockIn-curr-google-token': null });
      return;
    }
    const data: any = await response.json();
    const calendars: GoogleCalendarListing[] = data['items'];
    setCalendarListings(calendars);
  }

  async function logoutHandler() {
    console.log("logging out ?")
    await chrome.storage.session.set({ 'lockIn-curr-google-token': null });
    setCalendarListings([] as GoogleCalendarListing[])
    setUserProfile({} as GoogleUserObj);
    clearTaskState()
    setTokenAvailability(false);
    console.log("successfully logged out")
  }

  console.log(calendarListings);
  return (
    <>
      <div className="login-form-container">
        <p className="login-form-description"></p>
        {!tokenAvailability ? (
          <>
            <button className="user-auth-button" onClick={(e) => loginHandler(e)}>
              Login
            </button>
          </>
        ) : (
          <>
            <div className="user-container">
              <span>
                <p className="user-name">Welcome {userProfile.given_name.charAt(0).toUpperCase()}{userProfile.given_name.slice(1)}</p>
              </span>
              <button className="user-auth-button" onClick={() => logoutHandler()}>
                LogOut
              </button>
            </div>
          </>
        )}
      </div>
      <DisplayCalendar CalendarList={calendarListings} />
    </>
  );
}
