let startTime;
let interval;
let paused = false;
let prev_time = 0

document.addEventListener('DOMContentLoaded', () => {
    let weekComponent = document.getElementById("week-date")
    const today = new Date(Date.now())
    weekComponent.textContent = today.toDateString()
    
    const hoverElements = document.getElementsByClassName("hover-effect")
    for( let i = 0; i < hoverElements.length; i++){
        hoverElements[i].addEventListener("mouseenter", (event) => {
            console.log("entering",event.target)
            const tooltip = document.getElementById("tooltip")
            const rect = event.target.getBoundingClientRect();
            tooltip.style.left = `${rect.left + window.scrollX }px`;
            tooltip.style.top = `${rect.top + window.scrollY - tooltip.offsetHeight - 20}px`;
            tooltip.style.display = 'inline-block';
            tooltip.innerText = "5 Tasks completed"
        })
    }

    for(let i = 0; i < hoverElements.length; i++){
        hoverElements[i].addEventListener("mouseleave", (event) => {
            console.log("leaving", event.target)
            setTimeout(() => document.getElementById("tooltip").style.display = 'none',200)
        })
    }
    

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
