import React, { useState, useEffect } from 'react';
import type { GoogleUserObj } from '../../../../types';

export function LogIn() {
  const [tokenAvailability, setTokenAvailability] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<GoogleUserObj>({} as GoogleUserObj)
  async function checkExistingToken() {
    const response = await chrome.storage.session.get(
      'lockIn-curr-google-token'
    );
    if (response['lockIn-curr-google-token']) {
      console.log(response);
      setTokenAvailability(true);
      const profile_data = await (await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response['lockIn-curr-google-token']}`)).json()
      setUserProfile(profile_data)
    }
  }
  useEffect(() => {
    checkExistingToken();
  },[]);
  function loginHandler(e: React.MouseEvent) {
    if (chrome.identity) {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          chrome.storage.session.set({ 'lockIn-curr-google-token': token });
        }
      });
    } else {
      console.error('chrome.identity is not available.');
    }
  }
  console.log(tokenAvailability)
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
          </>
        )}
      </div>
    </>
  );
}
