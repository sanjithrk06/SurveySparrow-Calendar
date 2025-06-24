"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { getDaysInMonth, getFirstDayOfMonth } from "../utils/dateUtils";
import CalendarDay from "./CalendarDay";

export default function MonthlyView({
  currentDate,
  getEventsForDate,
  getEventConflicts,
  onDateClick,
  onViewEvents,
  onEditEvent,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const currentMonth = currentDate.month();
  const currentYear = currentDate.year();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);

  const renderCalendarDays = () => {
    const days = [];
    const totalCells = 42; // 6 rows × 7 days
    const maxEventsToShow = isMobile ? 2 : 2;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      const prevMonthDate = dayjs()
        .year(currentYear)
        .month(currentMonth)
        .startOf("month")
        .subtract(firstDayOfMonth - i, "day");

      const events = getEventsForDate(prevMonthDate);
      const conflicts = getEventConflicts(prevMonthDate);

      days.push(
        <CalendarDay
          key={`prev-${i}`}
          date={prevMonthDate}
          events={events}
          conflicts={conflicts}
          onDateClick={onDateClick}
          onViewEvents={onViewEvents}
          onEditEvent={onEditEvent}
          isCurrentMonth={false}
          maxEventsToShow={maxEventsToShow}
        />
      );
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = dayjs().year(currentYear).month(currentMonth).date(day);
      const events = getEventsForDate(date);
      const conflicts = getEventConflicts(date);

      days.push(
        <CalendarDay
          key={day}
          date={date}
          events={events}
          conflicts={conflicts}
          onDateClick={onDateClick}
          onViewEvents={onViewEvents}
          onEditEvent={onEditEvent}
          isCurrentMonth={true}
          maxEventsToShow={maxEventsToShow}
        />
      );
    }

    // Fill remaining cells with next month dates
    const remainingCells = totalCells - firstDayOfMonth - daysInMonth;
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDate = dayjs()
        .year(currentYear)
        .month(currentMonth)
        .endOf("month")
        .add(i, "day");
      const events = getEventsForDate(nextMonthDate);
      const conflicts = getEventConflicts(nextMonthDate);

      days.push(
        <CalendarDay
          key={`next-${i}`}
          date={nextMonthDate}
          events={events}
          conflicts={conflicts}
          onDateClick={onDateClick}
          onViewEvents={onViewEvents}
          onEditEvent={onEditEvent}
          isCurrentMonth={false}
          maxEventsToShow={maxEventsToShow}
        />
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden">
      {/* Days of week header */}
      <div className="grid grid-cols-7 ">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 py-4 lg:p-4 text-center lg:text-left font-medium text-gray-700 text-xs lg:text-sm uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7">{renderCalendarDays()}</div>
    </div>
  );
}
