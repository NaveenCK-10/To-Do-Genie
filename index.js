function updateFuturisticClock() {
    const clockElement = document.getElementById('futuristic-clock');
    setInterval(() => {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString(); 
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    updateFuturisticClock();

    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoSchedule = document.getElementById('todo-schedule');
    const todoList = document.getElementById('todo-list');

    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => addTaskToDOM(task));

    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskText = todoInput.value.trim();
        const taskTime = todoSchedule.value;

        if (!taskText || !taskTime) {
            alert("Please enter a task and schedule a valid time.");
            return;
        }

        const taskTimeDate = new Date(taskTime);
        const now = new Date();

        if (isNaN(taskTimeDate) || taskTimeDate <= now) {
            alert("Please schedule a valid future date and time.");
            return;
        }

        const task = { text: taskText, time: taskTime, completed: false };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));

        addTaskToDOM(task);
        scheduleReminder(task);

        todoInput.value = '';
        todoSchedule.value = '';
    });

    function addTaskToDOM(task) {
        const li = document.createElement('li');

        const taskText = document.createElement('span');
        taskText.textContent = `${task.text} (Due: ${new Date(task.time).toLocaleString()})`;
        if (task.completed) taskText.classList.add('completed-task');

        const completeButton = document.createElement('button');
        completeButton.textContent = '✅';
        completeButton.addEventListener('click', () => {
            task.completed = !task.completed;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskText.classList.toggle('completed-task');
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '🗑️';
        deleteButton.addEventListener('click', () => {
            tasks.splice(tasks.indexOf(task), 1);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            li.remove();
        });

        li.appendChild(taskText);
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    }

    function scheduleReminder(task) {
        const now = new Date();
        const taskTime = new Date(task.time);
        const delay = taskTime - now;

        if (delay > 0) {
            if (delay > 15 * 60 * 1000) {
                setTimeout(() => {
                    alert(`⏰ Reminder: Your task is due in 15 minutes!`);
                }, delay - 15 * 60 * 1000);
            }

            if (delay > 10 * 60 * 1000) {
                setTimeout(() => {
                    alert(`⏰ Reminder: Your task is due in 10 minutes!`);
                }, delay - 10 * 60 * 1000);
            }

            if (delay > 5 * 60 * 1000) {
                setTimeout(() => {
                    alert(`⏰ Reminder: Your task is due in 5 minutes!`);
                }, delay - 5 * 60 * 1000);
            }

            setTimeout(() => {
                const audio = new Audio('tring_tring.mp3');
                audio.play();

                alert(`⏰ Reminder: ${task.text}`);
            }, delay);
        }
    }
});
