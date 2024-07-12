import React from "react";
import "./date.css"
export function DateAndTime() {
    function getFormattedDate(date: Date) {
        var year = date.getFullYear();
      
        var month = (1 + date.getMonth()).toString();
        month = month.length > 1 ? month : '0' + month;
      
        var day = date.getDate().toString();
        day = day.length > 1 ? day : '0' + day;
        
        return month + '/' + day + '/' + year;
      }
  return (
    <>
      <span className="time-container">
        <p className="time-title">Daily Tasks</p>
        <p className="time-date">{getFormattedDate(new Date(Date.now()))}</p>
      </span>
    </>
  );
}
