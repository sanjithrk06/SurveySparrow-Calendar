import dayjs from "dayjs";

export const formatDate = (date) => dayjs(date).format("YYYY-MM-DD");

export const formatTime = (time) => dayjs(`2000-01-01 ${time}`).format("HH:mm");

export const formatDisplayTime = (time) =>
  dayjs(`2000-01-01 ${time}`).format("h:mm A");

export const isToday = (date) => dayjs(date).isSame(dayjs(), "day");

export const isSameMonth = (date, month, year) => {
  const d = dayjs(date);
  return d.month() === month && d.year() === year;
};

export const getDaysInMonth = (month, year) =>
  dayjs().year(year).month(month).daysInMonth();

export const getFirstDayOfMonth = (month, year) =>
  dayjs().year(year).month(month).startOf("month").day();

export const getEventsForDate = (events, date) => {
  const dateStr = formatDate(date);
  return events.filter((event) => event.date === dateStr);
};

export const checkEventConflicts = (events, date) => {
  const dayEvents = getEventsForDate(events, date).filter(
    (event) => event.time !== "all-day"
  );

  if (dayEvents.length <= 1) return [];

  const conflicts = [];

  for (let i = 0; i < dayEvents.length; i++) {
    for (let j = i + 1; j < dayEvents.length; j++) {
      const event1 = dayEvents[i];
      const event2 = dayEvents[j];

      const start1 = dayjs(`2000-01-01 ${event1.time}`);
      const end1 = start1.add(event1.duration, "minute");
      const start2 = dayjs(`2000-01-01 ${event2.time}`);
      const end2 = start2.add(event2.duration, "minute");

      if (start1.isBefore(end2) && start2.isBefore(end1)) {
        conflicts.push([event1, event2]);
      }
    }
  }

  return conflicts;
};
