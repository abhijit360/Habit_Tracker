import React from "react";
import "./task-history.css"
import {Tile} from "./tile";
export function TaskHistory(){
    return (
        <>
            <div className="tile-container">
                <Tile totalTasks={10} completedTasks={0} day=""/>
                <Tile totalTasks={10} completedTasks={3} day="M"/>
                <Tile totalTasks={10} completedTasks={5} day=""/>
                <Tile totalTasks={10} completedTasks={6} day="W"/>
                <Tile totalTasks={10} completedTasks={8} day=""/>
                <Tile totalTasks={10} completedTasks={9} day="F"/>
                <Tile totalTasks={10} completedTasks={10} day=""/>
            </div>
        </>
    )
}