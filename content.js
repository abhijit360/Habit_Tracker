let startTime;
let interval;
let paused = false;
let prev_time = 0

document.addEventListener('DOMContentLoaded', () => {
    let weekComponent = document.getElementById("week-date")
    const today = new Date(Date.now())
    weekComponent.textContent = today.toDateString()
})

document.getElementById("start-timer").addEventListener('click', () =>{
    console.log(interval)
    if (! interval){
        startTimer()
    }
});

document.getElementById("end-timer").addEventListener('click', () => {
    if( interval){
        clearTimer()
        startTime = 0
        prev_time = 0
        document.getElementById('time-elapsed').textContent = `0:0:0`
    }
});

document.getElementById("pause-timer").addEventListener('click', () => {
    print("running", paused)
    if (! paused){
        prev_time += Math.floor(Date.now() - startTime);
        clearTimer();
        paused = true;
        document.getElementById("pause-timer").textContent = 'Resume';
    }else{    
        paused = false
        startTimer();
        document.getElementById("pause-timer").textContent = 'Pause';
    }
})

function updateTime(){
    const currentTime = Date.now()
    const elapsedTime = Math.floor((currentTime-startTime + prev_time) / 1000);
    const hours = Math.floor(elapsedTime /3600)
    const minutes = Math.floor(elapsedTime % 3600 / 60)
    const seconds = elapsedTime % 60 
    document.getElementById('time-elapsed').textContent = `${hours}:${minutes}:${seconds}`
}

function clearTimer(){
    clearInterval(interval)
    interval = null
}

function startTimer(){
    startTime = Date.now();
    interval = setInterval(updateTime, 1000);
}
