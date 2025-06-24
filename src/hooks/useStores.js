import { useEventsStore } from "../stores/useEventsStore";
import { useCalendarStore } from "../stores/useCalendarStore";
import { useModalStore } from "../stores/useModalStore";

// Optional: Convenience hook to access all stores
export const useStores = () => {
  const eventsStore = useEventsStore();
  const calendarStore = useCalendarStore();
  const modalStore = useModalStore();

  return {
    events: eventsStore,
    calendar: calendarStore,
    modals: modalStore,
  };
};

// Individual store hooks for better tree-shaking
export { useEventsStore, useCalendarStore, useModalStore };
