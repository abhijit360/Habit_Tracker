import React from 'react';
export function LogIn() {
  function loginHandler(e: React.MouseEvent) {
    if (chrome.identity) {
      chrome.identity.getAuthToken({ interactive: true }, function (token) {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
        } else {
          console.log(token);
        }
      });
    } else {
      console.error('chrome.identity is not available.');
    }
  }
  return (
    <>
      <div className="Login-form-container">
        <p className="login-form-description"></p>
        <button className="login-form-button" onClick={loginHandler}>
          Login
        </button>
      </div>
    </>
  );
}
