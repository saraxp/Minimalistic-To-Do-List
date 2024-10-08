function showTick(button) {
    var tick = button.querySelector('.tickMark_png');
    var taskLine = button.parentElement;
    var inputField = taskLine.querySelector('.js-input');

    console.log('Initial tick visibility:', window.getComputedStyle(tick).visibility);
    console.log('Tick element:', tick);

    if (window.getComputedStyle(tick).visibility === "hidden") {
        tick.style.visibility = "visible";
        inputField.classList.add('strikethrough');
        saveCompletedTask(inputField.value);
        setTimeout(function () {
            taskLine.style.display = "none";
        }, 500);
    } else {
        tick.style.visibility = "hidden";
        inputField.classList.remove('strikethrough');
        taskLine.style.display = "block";
    }

    console.log('Updated tick visibility:', window.getComputedStyle(tick).visibility);
}

function addLine() {
    document.getElementById('js-newLine').outerHTML = `
    <div class="checkline js-checkline">
        <button onclick="showTick(this);" class="checkbox js-checkbox">
            <?xml version="1.0" encoding="UTF-8"?><svg class="tickMark_png" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M5 13L9 17L19 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <input type= "text" class="task-bar js-input" placeholder= "Enter Task">
        <button class="trash_button" onclick="deleteTask(this)"><?xml version="1.0" encoding="UTF-8"?><svg class= "trash"  viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
        </div>
    `
    document.getElementById('js-empty').outerHTML = `
    <div class= "newLine" id = "js-newLine">
        <button onclick = "addLine();"
        class= "add-line" id ="js-addLine"
        ><span class="material-symbols-rounded plus-sign">add</span></button>
    </div>
    <div id= "js-empty"></div>
    `
}

function resetList() {
    document.querySelector(".js-title").innerHTML = `
        <div class="title js-title"><input class= "title-tagline" type="text" placeholder="Title"></div>
    `
    document.querySelector(".js-container").innerHTML = `
        <div class= "newLine" id = "js-newLine">
            <button onclick = "addLine();
            "
            class= "add-line" id ="js-addLine"
            ><span class="material-symbols-rounded" "plus-sign" style="color:rgb(197, 28, 28); opacity: 0.8;">add</span></button>
        </div>
        <div id= "js-empty"></div>  
    `
}

function openPanel() {
    document.querySelector('.js-miniSP').classList.remove('panel-open'); 
    document.querySelector('.js-sidePanel').classList.add('panel-open');
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
}

function closePanel() {
    document.querySelector('.js-sidePanel').classList.remove('panel-open'); 
    document.querySelector('.js-miniSP').classList.add('panel-open'); 
    document.body.style.backgroundColor = "#f1f7ed";
}

function viewSubPanel(button) {
    var grandparentDiv = button.closest('.js-line1, .js-line2');

    // Toggle arrow direction
    var arrowIcon = button.querySelector('.DD-icon');
    arrowIcon.classList.toggle('rotated');

    if (grandparentDiv.classList.contains('js-line1')) {
        var completedTasksDiv = grandparentDiv.querySelector('.js-list1');

        if (!completedTasksDiv.innerHTML) {
            completedTasksDiv.innerHTML = `
                <ul id="completedTasksList"></ul>
            `;

            var completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
            var completedTasksList = document.getElementById('completedTasksList');
            completedTasksList.innerHTML = ''; 
            completedTasks.forEach(task => {
                if (task && typeof task === 'string') { 
                    var listItem = document.createElement('li');
                    listItem.innerHTML = `
                        ${task}
                        <div class="popup-menu">
                            <div class= "pp-div">
                                <button class="popup-button" onclick="deleteTaskPermanently('${task}')">Delete Permanently</button>
                                </div>
                        </div>
                    `;
                    completedTasksList.appendChild(listItem);
                }
            });
            arrowIcon.classList.add('rotated'); 
        } else {
            completedTasksDiv.innerHTML = ''; 
            arrowIcon.classList.remove('rotated'); // Reset arrow direction
        }
    } else if (grandparentDiv.classList.contains('js-line2')) {
        var deletedTasksDiv = grandparentDiv.querySelector('.js-list2');

        if (!deletedTasksDiv.innerHTML) {
            deletedTasksDiv.innerHTML = `
                <ul id="deletedTasksList"></ul>
            `;

            var deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
            var deletedTasksList = document.getElementById('deletedTasksList');
            deletedTasksList.innerHTML = ''; 
            deletedTasks.forEach(task => {
                if (task && typeof task === 'string') { 
                    var listItem = document.createElement('li');
                    listItem.innerHTML = `
                        ${task}
                        <div class="popup-menu">
                            <div class= "pp-div">
                                <button class="popup-button" onclick="restoreTask('${task}')">Restore</button>
                                </div>
                            <div class= "pp-div">
                                <button class="popup-button" onclick="deleteTaskPermanently('${task}')">Delete Permanently</button>
                                </div>
                        </div>
                    `;
                    deletedTasksList.appendChild(listItem);
                }
            });
            arrowIcon.classList.add('rotated'); 
        } else {
            deletedTasksDiv.innerHTML = ''; 
            arrowIcon.classList.remove('rotated'); // Reset arrow direction
        }
    }
}

function saveCompletedTask(taskText) {
    var completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    
    completedTasks.push(taskText);
    
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    var completedTasksList = document.getElementById('completedTasksList');
    if (completedTasksList) {
        var listItem = document.createElement('li');
        listItem.textContent = taskText;
        completedTasksList.appendChild(listItem);
    }
}

function saveDeletedTask(taskText) {
    var deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
    
    deletedTasks.push(taskText);
    
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));

    var deletedTasksList = document.getElementById('deletedTasksList');
    if (deletedTasksList) {
        var listItem = document.createElement('li');
        listItem.textContent = taskText;
        deletedTasksList.appendChild(listItem);
    }
}

function deleteTask(button) {
    var deleteLine = button.parentElement;
    var inputField = deleteLine.querySelector('.js-input');
    saveDeletedTask(inputField.value);
    deleteLine.outerHTML = '';
}

function restoreTask(task) {
    var deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
    deletedTasks = deletedTasks.filter(t => t !== task);
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));

    
    var taskList = document.querySelector('.js-container');
    var taskLine = document.createElement('div');
    taskLine.classList.add('checkline', 'js-checkline');
    taskLine.innerHTML = `
        <button onclick="showTick(this);" class="checkbox js-checkbox">
            <img class="tickMark_png" src="tick.png" style="display: none;">
        </button>
        <input type="text" class="task-bar js-input" value="${task}">
        <button class="trash_button" onclick="deleteTask(this)"><?xml version="1.0" encoding="UTF-8"?><svg class="trash"  viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M20 9L18.005 20.3463C17.8369 21.3026 17.0062 22 16.0353 22H7.96474C6.99379 22 6.1631 21.3026 5.99496 20.3463L4 9" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M21 6L15.375 6M3 6L8.625 6M8.625 6V4C8.625 2.89543 9.52043 2 10.625 2H13.375C14.4796 2 15.375 2.89543 15.375 4V6M8.625 6L15.375 6" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>
    `;
    taskList.insertBefore(taskLine, taskList.firstChild);

    
    var deletedTasksList = document.getElementById('deletedTasksList');
    var listItems = deletedTasksList.getElementsByTagName('li');
    for (var i = 0; i < listItems.length; i++) {
        if (listItems[i].textContent.includes(task)) {
            listItems[i].remove();
            break;
        }
    }
}

function deleteTaskPermanently(task) {
    var deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];
    deletedTasks = deletedTasks.filter(t => t!== task);
    localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));

    var completedTasks = JSON.parse(localStorage.getItem('completedTasks')) || [];
    completedTasks = completedTasks.filter(t => t!== task);
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

    var deletedTasksList = document.getElementById('deletedTasksList');
    if (deletedTasksList) {
        var listItems = deletedTasksList.getElementsByTagName('li');
        var i = 0;
        while (i < listItems.length) {
            if (listItems[i].textContent.includes(task)) {
                listItems[i].remove();
            } else {
                i++;
            }
        }
    }
   
    var completedTasksList = document.getElementById('completedTasksList');
    if (completedTasksList) {
        var listItems = completedTasksList.getElementsByTagName('li');
        var i = 0;
        while (i < listItems.length) {
            if (listItems[i].textContent.includes(task)) {
                listItems[i].remove();
            } else {
                i++;
            }
        }
    }
}