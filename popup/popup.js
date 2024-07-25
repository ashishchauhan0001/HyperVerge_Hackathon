let tasks = []


function playSound() {
    const audio = new Audio('music.wav') 
    audio.play()
}

const audio = new Audio('clock.wav');
function playSound2(){
setInterval(() => {
    audio.play();
}, 1000);
}


function updateTime() {
    chrome.storage.local.get(["timer", "timeOption", "isRunning"], (res) => {
        const time = document.getElementById("time")
        const minutes = `${res.timeOption - Math.ceil(res.timer / 60)}`.padStart(2, "0")
        let seconds = "00"
        if (res.timer % 60 != 0) {
            seconds = `${60 - res.timer % 60}`.padStart(2, "0")
        }
        time.textContent = `${minutes}:${seconds}`
        startTimerBtn.textContent = res.isRunning ? "Pause Timer" : "Start Timer"
        
        if (minutes === "01" && seconds === "00") {
            playSound2();
        }
    })
}


updateTime()
setInterval(updateTime, 1000)

const startTimerBtn = document.getElementById("start-timer-btn")
startTimerBtn.addEventListener("click", () => {
    playSound2();
    chrome.storage.local.get(["isRunning"], (res) => {
        chrome.storage.local.set({
            isRunning: !res.isRunning,
        }, () => {
            startTimerBtn.textContent = !res.isRunning ? "Pause Timer" : "Start Timer"
        })
    })
})

const resetTimerBtn = document.getElementById("reset-timer-btn")
resetTimerBtn.addEventListener("click", () => {
    playSound();
    audio.pause();
    chrome.storage.local.set({
        timer: 0,
        isRunning: false,
    }, () => {
        startTimerBtn.textContent = "Start Timer"
    })
})

const addTaskBtn = document.getElementById("add-task-btn")
addTaskBtn.addEventListener("click", () => addTask())
audio.pause();
chrome.storage.sync.get(["tasks"], (res) => {
    tasks = res.tasks ? res.tasks : []
    renderTasks()
})

function saveTasks() {
    chrome.storage.sync.set({
        tasks,
    })
}

function renderTask(taskNum) {
    const taskRow = document.createElement("div")
    taskRow.className = "task-row"

    const checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.className = "task-checkbox"
    checkbox.checked = tasks[taskNum].completed
    checkbox.addEventListener("change", () => {
        tasks[taskNum].completed = checkbox.checked
        saveTasks()
    })

    const text = document.createElement("input")
    text.type = "text"
    text.placeholder = "Enter a task..."
    text.value = tasks[taskNum].text
    text.className = "task-input"
    text.addEventListener("change", () => {
        tasks[taskNum].text = text.value
        saveTasks()
    })

    const deleteBtn = document.createElement("input")
    deleteBtn.type = "button"
    deleteBtn.value = "X"
    deleteBtn.className = "task-delete"
    deleteBtn.addEventListener("click", () => {
        deleteTask(taskNum)
    })

    taskRow.appendChild(checkbox)
    taskRow.appendChild(text)
    taskRow.appendChild(deleteBtn)

    const taskContainer = document.getElementById("task-container")
    taskContainer.appendChild(taskRow)
}

function addTask() {
    playSound();
    const taskNum = tasks.length
    tasks.push({ text: "", completed: false })
    renderTask(taskNum)
    saveTasks()
}

function deleteTask(taskNum) {
    tasks.splice(taskNum, 1)
    renderTasks()
    saveTasks()
}

function renderTasks() {
    const taskContainer = document.getElementById("task-container")
    taskContainer.textContent = ""
    tasks.forEach((task, taskNum) => {
        renderTask(taskNum)
    })
}
