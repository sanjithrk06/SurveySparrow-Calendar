// src/stores/localStorage.js

export function getEventsFromStorage() {
  const data = localStorage.getItem("events");
  try {
    const events = JSON.parse(data);
    return Array.isArray(events) ? events : [];
  } catch {
    return [];
  }
}

export function addEventToStorage(event) {
  const events = getEventsFromStorage();
  events.push(event);
  localStorage.setItem("events", JSON.stringify(events));
}