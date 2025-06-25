import { useEventsStore } from "../stores/useEventsStore";
import { useCalendarStore } from "../stores/useCalendarStore";
import { useModalStore } from "../stores/useModalStore";

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

export { useEventsStore, useCalendarStore, useModalStore };
