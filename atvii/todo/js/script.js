const taskModal = document.getElementById('task-modal');
const btnOpenModal = document.getElementById('btn-open-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const taskList = document.getElementById('task-list');
const taskForm = document.getElementById('task-form');
const filterCategory = document.getElementById('filter-category');
const sortTasks = document.getElementById("sort-tasks");

let taskId = 0;
let tasks = []; 

// ----- Modal -----
function openModalByBtn() { taskModal.style.display = "flex"; }
function closeModalByBtn(){ taskModal.style.display = "none"; }
function closeModalByWindow(e){ if (e.target === taskModal) taskModal.style.display = "none"; }


function formatDate(dateString) {
    const date = new Date(dateString); 
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

// ----- Criar item -----
function createTaskItem(task){
    const taskItem = document.createElement('div');
    taskItem.classList.add("task-item");
    taskItem.dataset.id = task.id;
    
    const formattedDate = formatDate(task.limitDate);

    taskItem.innerHTML = `
        <p>${task.description}</p>
        <p>${task.category}</p>
        <p class="priority-cell">${task.priority}</p>
         <p>${formattedDate}</p>
        <div>
            <button class="complete-btn">Finalizar</button>
            <button class="delete-btn">Excluir</button>
        </div>
    `;

    const priorityDiv = taskItem.querySelector(".priority-cell");
    if (task.priority === "Baixa") priorityDiv.classList.add("priority-low");
    else if (task.priority === "Média") priorityDiv.classList.add("priority-medium");
    else if (task.priority === "Alta") priorityDiv.classList.add("priority-high");

    // Botão delete
    taskItem.querySelector(".delete-btn").addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks(); // atualiza DOM
    });

    // Botão finalizar
    taskItem.querySelector(".complete-btn").addEventListener("click", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks(); // atualiza DOM mantendo filtros e ordenação
    });

    return taskItem;    
}

// ----- Renderizar tasks (aplica filtro e ordenação) -----
function renderTasks() {
    while (taskList.firstChild) taskList.removeChild(taskList.firstChild);

    let displayedTasks = [...tasks];

    // Filtro por categoria
    const selectedCategory = filterCategory.value;
    if (selectedCategory !== "all") {
        displayedTasks = displayedTasks.filter(t => t.category === selectedCategory);
    }

    // Ordenação
    const criteria = sortTasks.value;
    if (criteria === "date") {
        displayedTasks.sort((a,b) => new Date(a.limitDate) - new Date(b.limitDate));
    } else if (criteria === "priority") {
        const priorityOrder = { "Alta": 1, "Média": 2, "Baixa": 3 };
        displayedTasks.sort((a,b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    }

    // Renderiza
    displayedTasks.forEach(task => {
        const taskItem = createTaskItem(task);
        if (task.completed) taskItem.classList.add("completed");
        taskList.appendChild(taskItem);
    });

    checkNoTask();
}

// ----- Verifica se não há tasks -----
function checkNoTask() {
    const noTask = document.getElementById("no-tasks");
    noTask.style.display = taskList.children.length === 0 ? "flex" : "none";
}

// ----- Formulário -----
function handleFormSubmit(e){
    e.preventDefault();
    taskId++;

    const { description, category, priority, limitDate } = taskForm;

    const newTask = {
        id: taskId,
        description: description.value,
        category: category.value,
        priority: priority.value,
        limitDate: limitDate.value,
        completed: false
    };

    tasks.push(newTask);
    saveTasks();    
    renderTasks();

    taskForm.reset();
    closeModalByBtn();
}

// ----- LocalStorage -----
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        tasks = JSON.parse(saved);
        taskId = tasks.length ? Math.max(...tasks.map(t => t.id)) : 0;
        renderTasks();
    }
}

// ----- Eventos -----
filterCategory.addEventListener("change", renderTasks);
sortTasks.addEventListener("change", renderTasks);
taskForm.addEventListener("submit", handleFormSubmit);
btnOpenModal.addEventListener("click", openModalByBtn);
btnCloseModal.addEventListener("click", closeModalByBtn);
window.addEventListener("click", closeModalByWindow);

// ----- Inicialização -----
loadTasks();