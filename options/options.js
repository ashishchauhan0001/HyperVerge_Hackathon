const timeOption = document.getElementById("time-option")
const saveBtn = document.getElementById("save-btn")
const confirmationMessage = document.getElementById("confirmation-message")
const errorMessage = document.getElementById("error-message")

timeOption.addEventListener("change", (event) => {
    const val = event.target.value
    if (val < 1 || val > 60) {
        timeOption.classList.add("error")
        errorMessage.classList.remove("hidden")
    } else {
        timeOption.classList.remove("error")
        errorMessage.classList.add("hidden")
    }
})

saveBtn.addEventListener("click", () => {
    const val = timeOption.value
    if (val >= 1 && val <= 60) {
        chrome.storage.local.set({
            timer: 0,
            timeOption: val,
            isRunning: false,
        }, () => {
            confirmationMessage.classList.remove("hidden")
            setTimeout(() => {
                confirmationMessage.classList.add("hidden")
            }, 2000)
        })
    } else {
        timeOption.classList.add("error")
        errorMessage.classList.remove("hidden")
    }
})

chrome.storage.local.get(["timeOption"], (res) => {
    timeOption.value = res.timeOption
})
