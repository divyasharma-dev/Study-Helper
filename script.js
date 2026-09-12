

/* ================= NAVIGATION ================= */

const sectionTitles = {
    dashboard: "Dashboard",
    subjects: "Subjects",
    syllabus: "Syllabus",
    resources: "Resources",
    timer: "Study Timer",
    todo: "To-Do List",
    streak: "Study Streak",
    voice: "Voice Assistant"
};


function showSection(sectionId, button) {

    // Hide all sections
    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active-section");
    });


    // Show selected section
    const selectedSection = document.getElementById(sectionId);

    if (selectedSection) {
        selectedSection.classList.add("active-section");
    }


    // Update navigation
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });


    if (button) {
        button.classList.add("active");
    }


    // Change page title
    document.getElementById("pageTitle").textContent =
        sectionTitles[sectionId] || "Study Manager";
}


function showSectionByName(sectionId) {

    const navButtons = document.querySelectorAll(".nav-item");

    let matchingButton = null;

    navButtons.forEach(button => {

        if (button.textContent.toLowerCase().includes(sectionId)) {
            matchingButton = button;
        }

    });

    showSection(sectionId, matchingButton);
}


/* ================= TO-DO LIST ================= */

let tasks = JSON.parse(localStorage.getItem("studyTasks")) || [];


function saveTasks() {
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
}


function addTask() {

    const input = document.getElementById("taskInput");

    const taskText = input.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }


    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };


    tasks.push(task);

    saveTasks();

    input.value = "";

    renderTasks();

    updateDashboard();

    updateProgress();
}


function handleTaskEnter(event) {

    if (event.key === "Enter") {
        addTask();
    }
}


function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;

    });


    saveTasks();

    renderTasks();

    updateDashboard();

    updateProgress();
}


function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();

    renderTasks();

    updateDashboard();

    updateProgress();
}


function createTaskHTML(task) {

    return `
        <div class="task-item">

            <button
                class="task-check ${task.completed ? "checked" : ""}"
                onclick="toggleTask(${task.id})">
            </button>

            <span class="task-name ${task.completed ? "completed" : ""}">
                ${escapeHTML(task.text)}
            </span>

            <button
                class="delete-task"
                onclick="deleteTask(${task.id})">
                ×
            </button>

        </div>
    `;
}


function renderTasks() {

    const taskList = document.getElementById("taskList");

    if (!taskList) return;


    if (tasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-text">
                No tasks yet. Add your first task.
            </p>
        `;

        return;
    }


    taskList.innerHTML = tasks
        .map(task => createTaskHTML(task))
        .join("");
}


function updateDashboard() {

    const taskCount = document.getElementById("taskCount");

    if (taskCount) {
        const remaining = tasks.filter(task => !task.completed).length;
        taskCount.textContent = remaining;
    }


    const dashboardTasks =
        document.getElementById("dashboardTasks");

    if (!dashboardTasks) return;


    if (tasks.length === 0) {

        dashboardTasks.innerHTML = `
            <p class="empty-text">
                No tasks added yet.
            </p>
        `;

        return;
    }


    const latestTasks = tasks.slice(0, 4);

    dashboardTasks.innerHTML =
        latestTasks.map(task => createTaskHTML(task)).join("");
}


/* ================= PROGRESS ================= */

function updateProgress() {

    const percentElement =
        document.getElementById("progressPercent");

    const fillElement =
        document.getElementById("progressFill");

    const progressText =
        document.getElementById("progressText");


    if (tasks.length === 0) {

        if (percentElement) {
            percentElement.textContent = "0%";
        }

        if (fillElement) {
            fillElement.style.width = "0%";
        }

        return;
    }


    const completedTasks =
        tasks.filter(task => task.completed).length;


    const percentage =
        Math.round((completedTasks / tasks.length) * 100);


    if (percentElement) {
        percentElement.textContent = percentage + "%";
    }


    if (fillElement) {
        fillElement.style.width = percentage + "%";
    }


    if (progressText) {

        if (percentage === 100) {
            progressText.textContent =
                "Excellent! You completed all your tasks.";
        }

        else if (percentage >= 50) {
            progressText.textContent =
                "Good progress! Keep going.";
        }

        else {
            progressText.textContent =
                "Complete your tasks to improve your progress.";
        }
    }
}


/* ================= TIMER ================= */

let timerSeconds = 25 * 60;

let timerInterval = null;

let timerRunning = false;


function updateTimerDisplay() {

    const minutes =
        Math.floor(timerSeconds / 60);

    const seconds =
        timerSeconds % 60;


    const display =
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0");


    const timerDisplay =
        document.getElementById("timerDisplay");


    if (timerDisplay) {
        timerDisplay.textContent = display;
    }
}


function startTimer() {

    if (timerRunning) return;

    timerRunning = true;


    timerInterval = setInterval(() => {

        if (timerSeconds > 0) {

            timerSeconds--;

            updateTimerDisplay();

        }

        else {

            clearInterval(timerInterval);

            timerRunning = false;

            alert("Focus session completed!");

            addFocusTime();

        }

    }, 1000);
}


function pauseTimer() {

    clearInterval(timerInterval);

    timerRunning = false;
}


function resetTimer() {

    clearInterval(timerInterval);

    timerRunning = false;

    timerSeconds = 25 * 60;

    updateTimerDisplay();
}


function setTimer(minutes) {

    clearInterval(timerInterval);

    timerRunning = false;

    timerSeconds = minutes * 60;

    updateTimerDisplay();
}


function addFocusTime() {

    let focusTime =
        Number(localStorage.getItem("focusTime")) || 0;

    focusTime += 25;

    localStorage.setItem("focusTime", focusTime);

    updateFocusTime();
}


function updateFocusTime() {

    const focusTime =
        Number(localStorage.getItem("focusTime")) || 0;

    const element =
        document.getElementById("focusTime");

    if (element) {
        element.textContent = focusTime + " min";
    }
}


/* ================= STUDY STREAK ================= */

let streak =
    Number(localStorage.getItem("studyStreak")) || 0;


function updateStreakDisplay() {

    const streakNumber =
        document.getElementById("streakNumber");

    const dashboardStreak =
        document.getElementById("dashboardStreak");


    if (streakNumber) {
        streakNumber.textContent = streak;
    }

    if (dashboardStreak) {
        dashboardStreak.textContent = streak;
    }
}


function completeStudyDay() {

    const today =
        new Date().toDateString();

    const lastStudyDate =
        localStorage.getItem("lastStudyDate");


    if (lastStudyDate === today) {

        alert("You have already completed today's study session!");

        return;
    }


    streak++;

    localStorage.setItem("studyStreak", streak);

    localStorage.setItem("lastStudyDate", today);

    updateStreakDisplay();

    markTodayComplete();

    alert("Great job! Your study streak is now " + streak + " days.");
}


function markTodayComplete() {

    const days =
        document.querySelectorAll(".day");

    if (days.length > 0) {

        const today =
            new Date().getDay();

        let index = today === 0 ? 6 : today - 1;

        if (days[index]) {
            days[index].classList.add("completed");
        }
    }
}


/* ================= SUBJECT ================= */

function addSubject() {

    const subjectName =
        prompt("Enter subject name:");

    if (!subjectName) return;


    const subjectGrid =
        document.getElementById("subjectGrid");


    const count =
        subjectGrid.children.length + 1;


    const newSubject =
        document.createElement("div");

    newSubject.className = "subject-card";


    newSubject.innerHTML = `
        <div class="subject-number">
            ${String(count).padStart(2, "0")}
        </div>

        <h3>${escapeHTML(subjectName)}</h3>

        <p>New Subject</p>

        <div class="subject-progress">
            <div style="width:0%"></div>
        </div>

        <small>0% completed</small>
    `;


    subjectGrid.appendChild(newSubject);
}


function addResource() {

    const resourceName =
        prompt("Enter resource name:");

    if (!resourceName) return;


    const resourceGrid =
        document.getElementById("resourceGrid");


    const resource =
        document.createElement("div");

    resource.className = "resource-card";


    resource.innerHTML = `
        <div class="resource-icon">NEW</div>

        <h3>${escapeHTML(resourceName)}</h3>

        <p>Added study resource.</p>

        <button onclick="openResource()">
            Open Resource →
        </button>
    `;


    resourceGrid.appendChild(resource);
}


function openResource() {

    alert(
        "This resource can be connected to a PDF, website or study material later."
    );
}


/* ================= VOICE ASSISTANT ================= */

function startVoiceAssistant() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice recognition is not supported in this browser. Try Google Chrome."
        );

        return;
    }


    const recognition =
        new SpeechRecognition();


    recognition.lang = "en-IN";

    recognition.interimResults = false;

    recognition.continuous = false;


    const status =
        document.getElementById("voiceStatus");

    const mic =
        document.getElementById("micCircle");

    const result =
        document.getElementById("voiceResult");


    status.textContent = "Listening...";

    mic.classList.add("listening");


    recognition.start();


    recognition.onresult = function(event) {

        const speech =
            event.results[0][0].transcript;


        result.textContent =
            "You said: " + speech;


        status.textContent =
            "Command received";


        handleVoiceCommand(speech);
    };


    recognition.onerror = function() {

        status.textContent =
            "Couldn't understand. Try again.";

        mic.classList.remove("listening");
    };


    recognition.onend = function() {

        mic.classList.remove("listening");
    };
}


function handleVoiceCommand(command) {

    command = command.toLowerCase();


    if (
        command.includes("start") &&
        (
            command.includes("timer") ||
            command.includes("study")
        )
    ) {

        showSectionByName("timer");

        setTimeout(() => {
            startTimer();
        }, 500);

    }

    else if (
        command.includes("todo") ||
        command.includes("task")
    ) {

        showSectionByName("todo");

    }

    else if (
        command.includes("subject")
    ) {

        showSectionByName("subjects");

    }

    else if (
        command.includes("resource")
    ) {

        showSectionByName("resources");

    }

    else {

        console.log(
            "Voice command:",
            command
        );
    }
}


/* ================= SECURITY ================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

/* ================= GLOBAL SEARCH ================= */

function handleGlobalSearch(event) {

    if (event.key !== "Enter") return;

    const query = event.target.value.trim().toLowerCase();

    if (!query) return;

    if (
        query.includes("subject") ||
        query.includes("ada") ||
        query.includes("algorithm") ||
        query.includes("computer graphics") ||
        query.includes("database") ||
        query.includes("operating system")
    ) {
        showSectionByName("subjects");
    }

    else if (
        query.includes("syllabus") ||
        query.includes("unit")
    ) {
        showSectionByName("syllabus");
    }

    else if (
        query.includes("resource") ||
        query.includes("notes") ||
        query.includes("pdf")
    ) {
        showSectionByName("resources");
    }

    else if (
        query.includes("timer") ||
        query.includes("study")
    ) {
        showSectionByName("timer");
    }

    else if (
        query.includes("task") ||
        query.includes("todo")
    ) {
        showSectionByName("todo");
    }

    else if (
        query.includes("streak")
    ) {
        showSectionByName("streak");
    }

    else {
        alert("No matching section found for: " + query);
    }
}


/* Ctrl + K → focus search */

document.addEventListener("keydown", function(event) {

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {

        event.preventDefault();

        const search = document.getElementById("globalSearch");

        if (search) {
            search.focus();
        }
    }
});

/* ================= INITIALIZE ================= */

document.addEventListener("DOMContentLoaded", () => {

    renderTasks();

    updateDashboard();

    updateProgress();

    updateTimerDisplay();

    updateFocusTime();

    updateStreakDisplay();

});