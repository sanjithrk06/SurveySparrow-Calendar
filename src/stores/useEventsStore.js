import { create } from "zustand";
import { staticEvents } from "../data/events";
import {
  getEventsFromStorage,
  addEventToStorage,
  removeEventFromStorage,
  updateEventInStorage,
  saveEventsToStorage,
} from "../utils/localStorage";
import { getEventsForDate, checkEventConflicts } from "../utils/dateUtils";

export const useEventsStore = create((set, get) => ({
  // State
  events: [],
  isLoading: false,

  // Actions
  loadEvents: () => {
    set({ isLoading: true });
    const storedEvents = getEventsFromStorage() || [];
    set({
      events: [
        ...staticEvents,
        ...(Array.isArray(storedEvents) ? storedEvents : []),
      ],
      isLoading: false,
    });
  },

  addEvent: (eventData) => {
    const newEvent = addEventToStorage(eventData);
    set((state) => ({
      events: [...state.events, newEvent],
    }));
    return newEvent;
  },

  updateEvent: (eventId, eventData) => {
    const updatedEvent = updateEventInStorage(eventId, eventData);
    if (updatedEvent) {
      set((state) => ({
        events: state.events.map((e) => (e.id === eventId ? updatedEvent : e)),
      }));
    }
    return updatedEvent;
  },

  deleteEvent: (eventId) => {
    const isStaticEvent = staticEvents.some((e) => e.id === eventId);
    if (isStaticEvent) return false;

    removeEventFromStorage(eventId);
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    }));
    return true;
  },

  importEvents: (importedEvents) => {
    const eventsWithIds = importedEvents.map((event) => ({
      ...event,
      id: Date.now() + Math.random(),
    }));

    const currentStored = Array.isArray(getEventsFromStorage())
      ? getEventsFromStorage()
      : [];
    saveEventsToStorage([...currentStored, ...eventsWithIds]);

    set((state) => ({
      events: [...state.events, ...eventsWithIds],
    }));

    return eventsWithIds;
  },

  // Selectors
  getEventsForDate: (date) => {
    const { events } = get();
    const dayEvents = getEventsForDate(events, date);

    // Sort events by time
    return [...dayEvents].sort((a, b) => {
      if (a.time === "all-day" && b.time !== "all-day") return -1;
      if (a.time !== "all-day" && b.time === "all-day") return 1;
      if (a.time === "all-day" && b.time === "all-day") return 0;
      return a.time.localeCompare(b.time);
    });
  },

  getConflicts: (date) => {
    const { events } = get();
    return checkEventConflicts(events, date);
  },
}));
