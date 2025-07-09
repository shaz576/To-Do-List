document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const addTaskBtn = document.getElementById("task-input-btn");
    const taskList = document.getElementById("task-list");
    const emptyImg = document.querySelector(".empty-img");
    const todosContainer = document.querySelector(".to-dos-container");
    const progressBar = document.querySelector("#progress");
    const progressNumbers = document.querySelector("#numbers");
    const taskForm = document.getElementById("task-form");
    let confettiTriggered = false;

    const toggleEmptyState = () => {
        emptyImg.style.display = taskList.children.length === 0 ? "block" : "none";
        todosContainer.style.width = taskList.children.length > 0 ? "100%" : "50%";
    };

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length;
        const completedTask = taskList.querySelectorAll(".checkbox:checked").length;
        progressBar.style.width = totalTasks ? `${(completedTask / totalTasks) * 100}%` : "0%";
        progressNumbers.textContent = `${completedTask} / ${totalTasks}`;
        if (checkCompletion && totalTasks > 0 && completedTask === totalTasks && !confettiTriggered) {
            confetti();
            confettiTriggered = true;
        } else if (completedTask < totalTasks) {
            confettiTriggered = false;
        }
    };

const addTask = (text, completed = false) => {
    const taskText = text || taskInput.value.trim();
    if (!taskText) {
        return;
    }
    const li = document.createElement("li");
    li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}/>
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn" aria-label="Edit task"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn" aria-label="Delete task"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;

    const checkbox = li.querySelector(".checkbox");
    const editBtn = li.querySelector(".edit-btn");

    if (completed) {
        li.classList.add("completed");
        editBtn.disabled = true;
        editBtn.style.opacity = "0.5";
        editBtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener("change", () => {
        const isChecked = checkbox.checked;
        li.classList.toggle("completed", isChecked);
        editBtn.disabled = isChecked;
        editBtn.style.opacity = isChecked ? "0.5" : "1";
        editBtn.style.pointerEvents = isChecked ? "none" : "auto";
        updateProgress();
        updateLocalStorage();
    });

    editBtn.addEventListener("click", () => {
        if (!checkbox.checked) {
            taskInput.value = li.querySelector("span").textContent;
            li.remove();
            toggleEmptyState();
            updateProgress(false);
            updateLocalStorage();
        }
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        toggleEmptyState();
        updateProgress();
        updateLocalStorage();
    });

    taskList.appendChild(li);
    taskInput.value = "";
    toggleEmptyState();
    updateProgress();
    updateLocalStorage();
};

// Load tasks from local storage
const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
savedTasks.forEach(task => addTask(task.text, task.completed));

taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addTask();
});

addTaskBtn.addEventListener("click", () => addTask());

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTask();
    }
});

function updateLocalStorage() {
    const tasks = [];
    taskList.querySelectorAll("li").forEach(li => {
        const text = li.querySelector("span").textContent;
        const completed = li.querySelector(".checkbox").checked;
        tasks.push({ text, completed });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
});