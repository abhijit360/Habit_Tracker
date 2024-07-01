let startTime;
let interval;

document.getElementById("start-timer").addEventListener('click', () =>{
    if (! interval){
        startTime = Date.now();
        interval = setInterval(updateTime, 5000);
    }
});

function updateTime(){
    const currentTime = Date.now()
    const elapsedTime = Math.floor((currentTime-startTime) / 1000);
    const hours = Math.floor(elapsedTime /3600)
    const minutes = Math.floor(elapsedTime % 3600 / 60)
    const seconds = elapsedTime % 60 
    document.getElementById('time-elapsed').textContent = `${hours}:${minutes}:${seconds}`
}