/**
 * Manages a simple to-do list application using HTML, CSS, and JavaScript.
 * - Retrieves existing to-do list items from local storage or initializes an empty array.
 * - Creates necessary HTML elements and styles for the to-do list.
 * - Adds event listeners for adding, editing, deleting, and toggling tasks.
 * - Saves the to-do list to local storage after any modifications.
 * @returns None
 */
// Retrieve todo from local storage or initialize an empty array
let todo = JSON.parse(localStorage.getItem("todo")) || [];

// Get DOM elements for input, list, count, and buttons
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const todoCount = document.getElementById("todoCount");
const addButton = document.querySelector(".btn");
const deleteButton = document.getElementById("deleteButton");

// Adding extra CSS styles dynamically
const style = document.createElement("style");
style.textContent = `
  .todo-content {
    display: flex;
    align-items: center;
  }

  .delete-task-button {
    opacity: 0.2;
    transition: opacity 0.3s;
    background-color: #FFFFFF;
    background-image: linear-gradient(90deg, #FFFFFF 0%, #6284FF 50%, #FF0000 100%);
    color: white;
    border: none;
    cursor: pointer;
  }

  .todo-container:hover .delete-task-button {
    opacity: 1;
  } 
`;
document.head.appendChild(style);

// Initialize event listeners when DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add task on button click
  addButton.addEventListener("click", addTask);
  // Add task on pressing Enter key
  todoInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission
      addTask();
    }
  });
  // Delete all tasks on button click
  deleteButton.addEventListener("click", deleteAllTasks);
  // Display tasks when the page loads
  displayTasks();
});

// Function to add a new task
function addTask() {
  const newTask = todoInput.value.trim(); // Get trimmed input value
  if (newTask !== "") {
    // Ensure input is not empty
    todo.push({
      text: newTask,
      disabled: false, // New tasks are enabled by default
    });
    saveToLocalStorage(); // Save updated todo list to local storage
    todoInput.value = ""; // Clear input field
    displayTasks(); // Refresh displayed tasks
  }
}

// Function to display tasks in the UI
function displayTasks() {
  todoList.innerHTML = ""; // Clear existing list
  todo.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "todo-container";
    div.innerHTML = `
      <div class="todo-content">
        <input type="checkbox" class="todo-checkbox"
        id="input-${index}" ${item.disabled ? "checked" : ""}>  
        <p id="todo-${index}" class="${
      item.disabled ? "disabled" : ""
    }" onclick="editTask(${index})">${item.text}</p>  
      </div>
      <button class="delete-task-button" onclick="deleteTask(${index})">Delete</button>
    `;
    // Add change event to the checkbox to toggle task completion
    div
      .querySelector(".todo-checkbox")
      .addEventListener("change", () => toggleTask(index));
    todoList.appendChild(div); // Append the task to the list
  });
  todoCount.textContent = todo.length; // Update total task count
}

// Function to edit an existing task
function editTask(index) {
  const todoItem = document.getElementById(`todo-${index}`);
  const existingText = todo[index].text; // Get the current task text
  const inputElement = document.createElement("input");
  inputElement.value = existingText; // Set input value to current task text
  todoItem.replaceWith(inputElement); // Replace the task text with an input field
  inputElement.focus(); // Focus on the input for immediate editing

  // Save updated task on losing focus
  inputElement.addEventListener("blur", function () {
    const updatedText = inputElement.value.trim(); // Trim the input value
    if (updatedText) {
      // Only update if not empty
      todo[index].text = updatedText; // Update task text
      saveToLocalStorage(); // Save changes to local storage
    }
    displayTasks(); // Refresh the task list display
  });
}

// Function to toggle task completion status
function toggleTask(index) {
  todo[index].disabled = !todo[index].disabled; // Toggle disabled status
  saveToLocalStorage(); // Save changes to local storage
  displayTasks(); // Refresh the task list display
}

// Function to delete all tasks
function deleteAllTasks() {
  todo = []; // Clear the todo array
  saveToLocalStorage(); // Save changes to local storage
  displayTasks(); // Refresh the task list display
}

// Function to delete a specific task by index
function deleteTask(index) {
  todo.splice(index, 1); // Remove task from array
  saveToLocalStorage(); // Save changes to local storage
  displayTasks(); // Refresh the task list display
}

// Function to save the todo list to local storage
function saveToLocalStorage() {
  localStorage.setItem("todo", JSON.stringify(todo)); // Convert todo array to JSON and save
}
