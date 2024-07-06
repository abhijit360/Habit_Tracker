import React from "react";
import "./task-history.css"
import Tile from "./tile";
export default function TaskHistory(){
    return (
        <>
            <div>
                <Tile totalTasks={5} completedTasks={0} day=""/>
                <Tile totalTasks={5} completedTasks={0} day="M"/>
                <Tile totalTasks={5} completedTasks={0} day=""/>
                <Tile totalTasks={5} completedTasks={0} day="W"/>
                <Tile totalTasks={5} completedTasks={0} day=""/>
                <Tile totalTasks={5} completedTasks={0} day="F"/>
                <Tile totalTasks={5} completedTasks={0} day=""/>
            </div>
        </>
    )
}