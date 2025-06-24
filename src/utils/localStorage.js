export const getEventsFromStorage = () => {
  try {
    const events = localStorage.getItem("calendar-events");
    const parsed = events ? JSON.parse(events) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return [];
  }
};

export const saveEventsToStorage = (events) => {
  try {
    // Ensure events is an array before saving
    if (!Array.isArray(events)) {
      console.error(
        "Attempted to save non-array events to localStorage:",
        events
      );
      localStorage.setItem("calendar-events", JSON.stringify([])); // Reset to empty array
      return;
    }
    localStorage.setItem("calendar-events", JSON.stringify(events));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const addEventToStorage = (event) => {
  const events = getEventsFromStorage();
  const newEvent = {
    ...event,
    id: Date.now(),
    category: event.category || "other",
  };
  events.push(newEvent);
  saveEventsToStorage(events);
  return newEvent;
};

export const updateEventInStorage = (eventId, updatedEvent) => {
  const events = getEventsFromStorage();
  const eventIndex = events.findIndex((event) => event.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex] = { ...events[eventIndex], ...updatedEvent };
    saveEventsToStorage(events);
    return events[eventIndex];
  }
  return null;
};

export const removeEventFromStorage = (eventId) => {
  const events = getEventsFromStorage();
  const filteredEvents = events.filter((event) => event.id !== eventId);
  saveEventsToStorage(filteredEvents);
};
