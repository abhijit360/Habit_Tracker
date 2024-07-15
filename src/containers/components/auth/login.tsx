import React, { useState, useEffect } from 'react';
import type { GoogleUserObj } from '../../../../types';

export function LogIn() {
  const [tokenAvailability, setTokenAvailability] = useState<boolean>(false);
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
