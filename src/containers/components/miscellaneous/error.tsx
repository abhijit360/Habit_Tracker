import React from 'react';
import errorIcon from '../../../assets/img/error.svg';
import './error.css';

export function Error({ error }: { error: string }) {
  return (
    <>
      <div className="error-container">
        <img src={errorIcon} alt="error icon" className="error-icon" />
        <p className="error-text">{error}</p>
      </div>
    </>
  );
}
