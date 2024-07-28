import React, { useState, useEffect } from 'react';
import type {
  GoogleUserObj,
  GoogleCalendarListing,
  CalendarStore
} from '../../../../types';
import { useTasksStore } from '../../../../stores/taskStore';
import { DisplayCalendar } from '../google-calendar/display-calendars';
import './login.css';
import {useCalendarStore} from "../../../../stores/calendarStore"
import {useUserStore} from "../../../../stores/userStore"
import {Loading} from "../miscellaneous/loading"


export function LogIn() {
  const [tokenAvailability, setTokenAvailability] = useState<boolean>(false);

  const [calendarListings, setCalendarListings] = useState<
    GoogleCalendarListing[]
  >([] as GoogleCalendarListing[]);

  const [userProfile, setUserProfile] = useState<GoogleUserObj>(
    {} as GoogleUserObj
  );

  const {user, setUserState} = useUserStore()
  const [calendarDataObtained, setCalendarDataObtained] = useState<boolean>(false)
  const {clearTaskState} = useTasksStore()
  const {setCalendars} = useCalendarStore()

  async function checkExistingToken() {
    const response = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    if (response['lockIn-curr-google-token']) {
      const token = response['lockIn-curr-google-token'];
      const profile_data = await (
        await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
        )
      ).json();
      setUserProfile(profile_data);
      setTokenAvailability(true);
      getCalendars();
      setUserState(profile_data, token)
      setCalendarDataObtained(true)

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
            setUserState(profile_data, token)
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
    setCalendars(calendars.map((calendar) => ({calendarId: calendar.id, calendarName: calendar.summary}) ) as CalendarStore[])
    setCalendarListings(calendars);
    setCalendarDataObtained(true)
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
              {!userProfile.given_name && <Loading />}
              {userProfile.given_name && <span>
                <p className="user-name">Welcome {userProfile.given_name.charAt(0).toUpperCase()}{userProfile.given_name.slice(1)}</p>
              </span>}
            </div>
          </>
        )}
      </div>
      {user && <DisplayCalendar CalendarList={calendarListings} calendarDataObtained={calendarDataObtained} />}
    </>
  );
}
