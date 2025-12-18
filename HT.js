const habitInput = document.getElementById('habitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');

let habits = JSON.parse(localStorage.getItem('habits')) || [];
   
if (habits.length === 0) {
    const defaultHabits = [
        "Overnight mag ml",
        "Inom 20 gallons per day",
        "Matulog",
        "Mag-Relapse",
        "Kaon"
    ];

    defaultHabits.forEach(name => {
        habits.push({
            name: name,
            days: [false, false, false, false, false, false, false]
        });
    });
    saveHabits();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}
/*adding*/
function addHabit() {
    const name = habitInput.value.trim();
    if (name) {
        habits.push({
            name: name,
            days: [false, false, false, false, false, false, false] // Sun-Sat
        });
        habitInput.value = '';
        saveHabits();
        renderHabits();
    }
}
/*deleting*/
function deleteHabit(index) {
    habits.splice(index, 1);
    saveHabits();
    renderHabits();
}
/*click the day*/
function toggleDay(habitIndex, dayIndex) {
    habits[habitIndex].days[dayIndex] = !habits[habitIndex].days[dayIndex];
    saveHabits();
    renderHabits();
}

function calculateStreak(daysArray) {
    let maxStreak = 0;
    let currentStreak = 0;

    for (let completed of daysArray) {
        if (completed) {
            currentStreak++;
 /*saver sa streak*/
            maxStreak = Math.max(maxStreak, currentStreak);
        } else {
            currentStreak = 0;
        }
    }
    return maxStreak;
}

function renderHabits() {
    habitList.innerHTML = '';

    habits.forEach((habit, index) => {
        const completedCount = habit.days.filter(d => d).length;
        const progressPercent = Math.round((completedCount / 7) * 100);
        const streak = calculateStreak(habit.days);

        const habitDiv = document.createElement('div');
        habitDiv.classList.add('habit');

        const headerDiv = document.createElement('div');
        headerDiv.classList.add('habit-header');

        const infoDiv = document.createElement('div');
        infoDiv.classList.add('habit-info');

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('habit-name');
        nameSpan.textContent = habit.name;

        const streakSpan = document.createElement('span');
        streakSpan.classList.add('streak-count');
        streakSpan.innerHTML = `🔥 ${streak}`; 
        
        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(streakSpan);

        const deleteBtn = document.createElement('button');
        
    
        //If all 7 days are done, show 'Done' pero still delete ra japon ang function niya
        if (completedCount === 7) {
            deleteBtn.className = 'done-btn'; 
            deleteBtn.textContent = 'Done ✔';
        } else {
            deleteBtn.className = 'delete-btn'; 
            deleteBtn.textContent = 'Delete';
        }
        
        // mo allow to delete 
        deleteBtn.onclick = () => deleteHabit(index);

        headerDiv.appendChild(infoDiv);
        headerDiv.appendChild(deleteBtn);

        const daysDiv = document.createElement('div');
        daysDiv.classList.add('days');
        const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        habit.days.forEach((completed, dayIndex) => {
            const dayCircle = document.createElement('div');
            dayCircle.classList.add('day');
            if (completed) dayCircle.classList.add('completed');
            dayCircle.textContent = dayLabels[dayIndex][0];
            
            dayCircle.onclick = () => toggleDay(index, dayIndex);
            
            daysDiv.appendChild(dayCircle);
        });

        const progressContainer = document.createElement('div');
        progressContainer.classList.add('progress-container');
        
        const progressText = document.createElement('span');
        progressText.classList.add('progress-text');
        progressText.textContent = `${progressPercent}%`;

        const progressBarBg = document.createElement('div');
        progressBarBg.classList.add('progress-bar-bg');

        const progressBarFill = document.createElement('div');
        progressBarFill.classList.add('progress-bar-fill');
        progressBarFill.style.width = `${progressPercent}%`;

        progressBarBg.appendChild(progressBarFill);
        progressContainer.appendChild(progressText);
        progressContainer.appendChild(progressBarBg);

        habitDiv.appendChild(headerDiv);
        habitDiv.appendChild(daysDiv);
        habitDiv.appendChild(progressContainer);
        
        habitList.appendChild(habitDiv);
    });
}
/*makes the app interactive*/
addHabitBtn.addEventListener('click', addHabit);
habitInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addHabit();
    }
});

renderHabits();