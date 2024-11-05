const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskList = document.getElementById("task-list");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value, taskDate.value);
  taskInput.value = "";
  taskDate.value = "";
});

function addTask(description, dateTime) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("task-item");

  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");

  const descriptionSpan = document.createElement("span");
  descriptionSpan.classList.add("description");
  descriptionSpan.textContent = description;

  const dateTimeSpan = document.createElement("span");
  dateTimeSpan.classList.add("date-time");

  if (dateTime) {
    const formattedDateTime = formatDateTime(dateTime);
    dateTimeSpan.textContent = formattedDateTime;
  } else {
    dateTimeSpan.textContent = "No Due Date";
  }

  taskContent.appendChild(descriptionSpan);
  taskContent.appendChild(dateTimeSpan);

  const taskActions = document.createElement("div");
  taskActions.classList.add("task-actions");

  const completeButton = document.createElement("button");
  completeButton.classList.add("icon-btn", "complete-btn");
  completeButton.innerHTML = '<i class="fas fa-check"></i>';
  completeButton.addEventListener("click", () => {
    completeButton.classList.toggle("completed");
  });

  const editButton = document.createElement("button");
  editButton.classList.add("icon-btn");
  editButton.innerHTML = '<i class="fas fa-edit"></i>';
  editButton.addEventListener("click", () => enterEditMode(taskItem, taskContent, editButton, description, dateTime));

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("icon-btn");
  deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  deleteButton.addEventListener("click", () => {
    taskList.removeChild(taskItem);
  });

  taskActions.appendChild(completeButton);
  taskActions.appendChild(editButton);
  taskActions.appendChild(deleteButton);

  taskItem.appendChild(taskContent);
  taskItem.appendChild(taskActions);
  taskList.appendChild(taskItem);
  sortTasks();
}

function formatDateTime(dateTime) {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  const time = dateTime.split("T")[1];

  return `${day}-${month}-${year} ${time || ""}`;
}

function enterEditMode(taskItem, taskContent, editButton, description, dateTime) {
  const [date, time] = dateTime.split("T");

  taskContent.innerHTML = `
    <input type="text" class="edit-input" value="${description}">
    <input type="date" class="edit-date" value="${date}">
    <input type="time" class="edit-time" value="${time}">
  `;

  const saveButton = document.createElement("button");
  saveButton.classList.add("icon-btn");
  saveButton.innerHTML = '<i class="fas fa-save"></i>';

  saveButton.addEventListener("click", () => {
    const newDescription = taskContent.querySelector(".edit-input").value;
    const newDate = taskContent.querySelector(".edit-date").value;
    const newTime = taskContent.querySelector(".edit-time").value;
    const formattedDate = newDate ? formatDateTime(`${newDate}T${newTime}`) : "No Due Date";

    taskContent.innerHTML = `
      <span class="description">${newDescription}</span>
      <span class="date-time">${formattedDate}</span>
    `;
    taskItem.querySelector(".task-actions").replaceChild(editButton, saveButton);
    sortTasks();
  });

  taskItem.querySelector(".task-actions").replaceChild(saveButton, editButton);
}

function sortTasks() {
  const tasks = Array.from(taskList.children);
  tasks.sort((a, b) => {
    const aDateText = a.querySelector(".date-time").textContent.trim();
    const bDateText = b.querySelector(".date-time").textContent.trim();
    const aDate = new Date(aDateText.split(" ")[0]) || 0;
    const bDate = new Date(bDateText.split(" ")[0]) || 0;
    return aDate - bDate;
  });
  taskList.innerHTML = "";
  tasks.forEach((task) => taskList.appendChild(task));
}
