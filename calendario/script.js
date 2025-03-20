const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
    "Octubre", "Noviembre", "Diciembre"];
const datesContainer = document.getElementById("dates");
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function loadCalendar(month = currentMonth, year = currentYear) {
    datesContainer.innerHTML = "";
    document.getElementById("month").textContent = monthNames[month];
    document.getElementById("year").textContent = year;

    let firstDay = new Date(year, month, 1).getDay();
    let totalDays = new Date(year, month + 1, 0).getDate();

    for (let i = 1; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.classList.add("day", "empty");
        datesContainer.appendChild(emptyDiv);
    }

    for (let i = 1; i <= totalDays; i++) {
        const dayButton = document.createElement("button"); // Cambiado a botón
        dayButton.classList.add("day");
        dayButton.textContent = i;
        let today = new Date();
        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayButton.classList.add("today");
        }
        datesContainer.appendChild(dayButton);

        // Añadir event listener al botón
        dayButton.addEventListener("click", () => {
            const date = new Date(year, month, i);
            showEventsForDay(date); // Mostrar eventos del día
        });
    }

    loadEvents(year, month);
}

document.getElementById("prev-month").addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    loadCalendar(currentMonth, currentYear);
});

document.getElementById("next-month").addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    loadCalendar(currentMonth, currentYear);
});

// Eventos
const eventDateInput = document.getElementById("event-date");
const eventTitleInput = document.getElementById("event-title");

function saveEvent() {
    const date = eventDateInput.value;
    const title = eventTitleInput.value;

    if (date && title) {
        const events = JSON.parse(localStorage.getItem("calendarEvents")) || {};
        if (!events[date]) {
            events[date] = [];
        }
        events[date].push(title);
        localStorage.setItem("calendarEvents", JSON.stringify(events));

        const dateObj = new Date(date);
        loadCalendar(dateObj.getMonth(), dateObj.getFullYear());

        eventDateInput.value = "";
        eventTitleInput.value = "";
    }
}

function loadEvents(year, month) {
    const events = JSON.parse(localStorage.getItem("calendarEvents")) || {};
    const days = document.querySelectorAll(".day:not(.empty)");

    days.forEach(day => {
        const date = new Date(year, month, parseInt(day.textContent));
        const dateString = date.toISOString().split("T")[0];

        // Elimina la clase 'has-event' antes de volver a verificar los eventos.
        day.classList.remove('has-event');

        if (events[dateString]) {
            day.classList.add('has-event'); // Añade la clase si hay eventos
        }
    });
}

function deleteEvent(date, index) {
    const events = JSON.parse(localStorage.getItem("calendarEvents")) || {};
    if (events[date] && events[date][index]) {
        events[date].splice(index, 1);
        if (events[date].length === 0) {
            delete events[date];
        }
        localStorage.setItem("calendarEvents", JSON.stringify(events));
        const dateObj = new Date(date);
        loadCalendar(dateObj.getMonth(), dateObj.getFullYear());
    }
}

function showEventsForDay(date) {
    const dateString = date.toISOString().split("T")[0];
    const events = JSON.parse(localStorage.getItem("calendarEvents")) || {};
    const eventsForDay = events[dateString] || [];
    const dayEventsList = document.getElementById("day-events");
    dayEventsList.innerHTML = ""; // Limpiar la lista anterior

    if (eventsForDay.length > 0) {
        eventsForDay.forEach(event => {
            const eventItem = document.createElement("li");
            eventItem.textContent = event;
            dayEventsList.appendChild(eventItem);
        });
    } else {
        dayEventsList.innerHTML = "<li>No hay eventos para este día.</li>";
    }
}

document.getElementById("save-event").addEventListener("click", saveEvent);

loadCalendar();