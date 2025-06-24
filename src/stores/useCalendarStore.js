import { create } from "zustand";
import dayjs from "dayjs";

export const useCalendarStore = create((set, get) => ({
  // State
  currentDate: dayjs(),
  viewMode: "monthly",

  // Actions
  navigate: (direction) => {
    const { currentDate, viewMode } = get();
    const unit = viewMode === "weekly" ? "week" : "month";
    const newDate =
      direction === "prev"
        ? currentDate.subtract(1, unit)
        : currentDate.add(1, unit);

    set({ currentDate: newDate });
  },

  goToToday: () => {
    set({ currentDate: dayjs() });
  },

  changeView: (mode) => {
    set({ viewMode: mode });
  },

  setDate: (date) => {
    set({ currentDate: dayjs(date) });
  },
}));
