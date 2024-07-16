import React, { useState, useEffect } from 'react';
import type { GoogleUserObj, GoogleCalendarListing } from '../../../../types';
import {cal} from "gapi";
// // @ts-ignore
// import secrets from 'secrets';
export function LogIn() {
  const [tokenAvailability, setTokenAvailability] = useState<boolean>(false);
  const [calendarListings, setCalendarListings] = useState<
    GoogleCalendarListing[]
  >([] as GoogleCalendarListing[]);
  const [userProfile, setUserProfile] = useState<GoogleUserObj>(
    {} as GoogleUserObj
  );
  async function checkExistingToken() {
    const response = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    if (response['lockIn-curr-google-token']) {
      console.log(response['lockIn-curr-google-token']);
      setTokenAvailability(true);
      const profile_data = await (
        await fetch(
          `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response['lockIn-curr-google-token']}`
        )
      ).json();
      setUserProfile(profile_data);
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
    const data: any = await response.json();
    const calendars: GoogleCalendarListing[] = data['items'];
    setCalendarListings(calendars);
  }

  function logoutHandler() {
    chrome.storage.session.set({ 'lockIn-curr-google-token': null });
    setUserProfile({} as GoogleUserObj);
    setTokenAvailability(false);
  }

  async function handleSelectionClick(e: React.MouseEvent){
    console.log(e.target.value)
  }

  return (
    <>
      <div className="Login-form-container">
        <p className="login-form-description"></p>
        {!tokenAvailability ? (
          <>
            <button className="login-form-button" onClick={loginHandler}>
              Login
            </button>
          </>
        ) : (
          <>
            <p>welcome {userProfile.given_name}</p>
            <p>Do you want to import today's google calendar events?</p>
            <button>Import</button>
            <button>Skip</button>
            <button onClick={logoutHandler}>LogOut</button>
            <p>Select which calendar's to import</p>
            <form>
              <select multiple={true}>
                {calendarListings.map((listing) => (
                  <option value={listing.id} onClick={handleSelectionClick}>{listing.summary}</option>
                ))}
              </select>
              <button type='submit'>submit</button>
            </form>
            
          </>
        )}
      </div>
    </>
  );
}
