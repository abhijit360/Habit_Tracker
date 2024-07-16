import React, { useState, useEffect } from 'react';
import type { GoogleUserObj } from '../../../../types';

// // @ts-ignore
// import secrets from 'secrets';
export function LogIn() {
  const [tokenAvailability, setTokenAvailability] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<GoogleUserObj>(
    {} as GoogleUserObj
  );

  // useEffect(() => {
  //   function initClient() {
  //     window.gapi.client
  //       .init({
  //         apiKey: 'YOUR_API_KEY',
  //         clientId: 'YOUR_CLIENT_ID',
  //         discoveryDocs: [
  //           'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
  //         ],
  //         scope: 'https://www.googleapis.com/auth/calendar.readonly',
  //       })
  //       .then(
  //         function () {
  //           // Handle successful initialization
  //           gapi.auth2
  //             .getAuthInstance()
  //             .signIn()
  //             .then(function () {
  //               listCalendars();
  //             });
  //         },
  //         function (error) {
  //           // Handle initialization error
  //           console.error(error);
  //         }
  //       );
  //   }

  //   function listCalendars() {
  //     window.gapi.client.calendar.calendarList.list().then(function (response) {
  //       var calendars = response.result.items;
  //       if (calendars.length > 0) {
  //         for (var i = 0; i < calendars.length; i++) {
  //           var calendar = calendars[i];
  //           console.log(calendar.summary);
  //         }
  //       } else {
  //         console.log('No calendars found.');
  //       }
  //     });
  //   }

  //   window.gapi.load('client:auth2', initClient);
  // });

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
    }
  }
  useEffect(() => {
    checkExistingToken();
  }, [tokenAvailability]);

  async function loginHandler(e: React.MouseEvent) {
    if (chrome.identity) {
      chrome.identity.getAuthToken(
        { interactive: true,},
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

  function logoutHandler() {
    chrome.storage.session.set({ 'lockIn-curr-google-token': null });
    setUserProfile({} as GoogleUserObj);
    setTokenAvailability(false);
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
          </>
        )}
      </div>
    </>
  );
}
