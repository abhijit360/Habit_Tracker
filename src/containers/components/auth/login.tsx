import React from "react";
export function LogIn() {
    function loginHandler(e :React.MouseEvent){
        
    }
  return (
    <>
      <div className="Login-form-container">
        <p className="login-form-description"></p>
        <button className="login-form-button" onClick={loginHandler}>Login</button>

      </div>
    </>
  );
}
