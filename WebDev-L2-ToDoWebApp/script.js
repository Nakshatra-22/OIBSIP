let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        text: text,
        completed: false,
        added: new Date().toLocaleString(),
        completedTime: ""
    });

    input.value = "";
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;

    if (tasks[index].completed) {
        tasks[index].completedTime = new Date().toLocaleString();
    } else {
        tasks[index].completedTime = "";
    }

    saveTasks();
    renderTasks();
}

function editTask(index) {
    const newText = prompt("Edit your task:", tasks[index].text);

    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {

    const pendingList = document.getElementById("pendingList");
    const completedList = document.getElementById("completedList");

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    let pending = 0;
    let completed = 0;

    tasks.forEach((task, index) => {

        const li = document.createElement("li");

        let completedText = "";

        if(task.completed){
            completedText = "<br><small>Completed: " + task.completedTime + "</small>";
        }

        li.innerHTML = `
            <div class="task-text">${task.text}</div>

            <div class="time">
                Added: ${task.added}
                ${completedText}
            </div>

            <div class="buttons">

                <button class="complete"
                    onclick="toggleTask(${index})">

                    ${task.completed ? "Move to Pending" : "Mark Complete"}

                </button>

                <button class="edit"
                    onclick="editTask(${index})">

                    Edit

                </button>

                <button class="delete"
                    onclick="deleteTask(${index})">

                    Delete

                </button>

            </div>
        `;

        if(task.completed){
            completedList.appendChild(li);
            completed++;
        }
        else{
            pendingList.appendChild(li);
            pending++;
        }

    });

    document.getElementById("pendingCount").textContent = pending;
    document.getElementById("completedCount").textContent = completed;

    document.getElementById("pendingEmpty").style.display =
        pending === 0 ? "block" : "none";

    document.getElementById("completedEmpty").style.display =
        completed === 0 ? "block" : "none";
}

document.getElementById("taskInput").addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        addTask();
    }
});

renderTasks();