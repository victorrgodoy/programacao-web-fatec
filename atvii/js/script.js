const taskModal = document.getElementById('task-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');

let taskId = 0;
let tasks = []; 

function openModalByBtn() {
    taskModal.style.display = "flex";
}

function closeModalByBtn(){
    taskModal.style.display = "none";
}

function closeModalByWindow(e){
    if (e.target === taskModal) {
        taskModal.style.display = "none";
    }
}

function createTaskItem(task){
    const taskItem = document.createElement('div');
    taskItem.classList.add("task-item");

    taskItem.innerHTML = `
        <p>${task.description}</p>
        <p>${task.category}</p>
        <p class="priority-cell">${task.priority}</p>
        <p>${task.limitDate}</p>
        <p><button class="delete-btn">Excluir</button></p>
    `;

    const priorityDiv = taskItem.querySelector(".priority-cell");

    if (task.priority === "Baixa") {
        priorityDiv.style.backgroundColor = "lightgreen";
        priorityDiv.style.padding = "0.5rem";
        priorityDiv.style.borderRadius =  "0.5rem";
    } else if (task.priority === "Média") {
        priorityDiv.style.backgroundColor = "khaki";
         priorityDiv.style.padding = "0.5rem";
        priorityDiv.style.borderRadius =  "0.5rem";
    } else if (task.priority === "Alta") {
        priorityDiv.style.backgroundColor = "lightcoral";
         priorityDiv.style.padding = "0.5rem";
        priorityDiv.style.borderRadius =  "0.5rem";
    }

    taskItem.querySelector(".delete-btn").addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks(); 
        taskItem.remove(); 
        checkNoTask();
    });

    return taskItem;    
}

function checkNoTask(){
    const noTask = document.getElementById("no-tasks");
    if(taskList.children.length === 0){
        noTask.style.display = "flex";
    } else {
        noTask.style.display = "none";
    }
}

function handleFormSubmit(e){
    e.preventDefault();
    taskId++;

    const { description, category, priority, limitDate } = taskForm;

    const newTask = {
        id: taskId,
        description: description.value,
        category: category.value,
        priority: priority.value,
        limitDate: limitDate.value
    };

    tasks.push(newTask);
    saveTasks();    
   
    const taskItem = createTaskItem(newTask);
    taskList.appendChild(taskItem);

    checkNoTask();
    taskForm.reset();
    closeModalByBtn();
}

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        tasks = JSON.parse(saved);

        taskId = tasks.length ? Math.max(...tasks.map(t => t.id)) : 0;

        tasks.forEach(task => {
            const taskItem = createTaskItem(task);
            taskList.appendChild(taskItem);
        });
    }
    checkNoTask();
}

// eventos
taskForm.addEventListener("submit", handleFormSubmit);
btnOpenModal.addEventListener("click", openModalByBtn);
btnCloseModal.addEventListener("click", closeModalByBtn);
window.addEventListener("click", closeModalByWindow);

// inicialização
loadTasks();