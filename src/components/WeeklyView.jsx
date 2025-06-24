"use client";

import { isToday } from "../utils/dateUtils";
import Event from "./Event";

export default function WeeklyView({
  currentDate,
  getEventsForDate,
  getEventConflicts,
  onDateClick,
  onViewEvents,
  onEditEvent,
  onDeleteEvent,
}) {
  const startOfWeek = currentDate.startOf("week").add(1, "day");
  const weekDays = Array.from({ length: 7 }, (_, i) =>
    startOfWeek.add(i, "day")
  );
  const dayNames = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  const renderDayHeader = (dayName, date, index) => {
    const isTodayDate = isToday(date);

    return (
      <div
        key={dayName}
        className={`p-3 lg:p-6 text-center border-r border-gray-100 last:border-r-0 ${
          isTodayDate ? "bg-red-50 hover:bg-red-50/90" : ""
        }`}
      >
        <div
          className={`text-xs lg:text-sm font-medium mb-2 ${
            isTodayDate ? "text-red-500" : "text-gray-500"
          }`}
        >
          {dayName}
        </div>
        <div className="relative">
          {isTodayDate && (
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 lg:w-8 h-0.5 bg-red-500" />
          )}
          <div
            className={`text-2xl lg:text-4xl font-light cursor-pointer hover:bg-gray-50 rounded-lg p-1 lg:p-2 transition-colors ${
              isTodayDate
                ? "bg-red-50 text-red-600 hover:bg-red-100/60"
                : "text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => onDateClick(date)}
          >
            {date.format("DD")}
          </div>
        </div>
      </div>
    );
  };

  const renderDayEvents = (date) => {
    const dayEvents = getEventsForDate(date);
    const conflicts = getEventConflicts(date);
    const isTodayDate = isToday(date);

    return (
      <div key={date.format("YYYY-MM-DD")}>
        {/* Mobile View */}
        <div className="lg:hidden mb-4 last:mb-0">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div
                className={`text-lg font-medium ${
                  isTodayDate ? "text-orange-700" : "text-gray-900"
                }`}
              >
                {date.format("ddd, MMM D")}
              </div>
              {isTodayDate && (
                <span className="bg-orange-100/80 text-orange-600 text-xs px-2 py-1 rounded-lg">
                  Today
                </span>
              )}
            </div>
            <button
              onClick={() => onDateClick(date)}
              className="text-gray-600 text-sm font-medium hover:text-gray-700"
            >
              Add Event
            </button>
          </div>
          <div className="p-4 bg-white rounded-b-lg border border-gray-100 space-y-3">
            {dayEvents.length > 0 ? (
              dayEvents.map((event) => {
                const isConflicted = conflicts.some((conflict) =>
                  conflict.includes(event)
                );
                return (
                  <Event
                    key={event.id}
                    event={event}
                    onDelete={onDeleteEvent}
                    onEdit={onEditEvent}
                    isConflicted={isConflicted}
                    showActions={true}
                  />
                );
              })
            ) : (
              <p className="text-gray-400 text-sm">No events</p>
            )}
          </div>
        </div>

        {/* Desktop View */}
        <div
          className={`hidden lg:block p-6 min-h-[300px] cursor-pointer hover:bg-gray-100/50 transition-colors ${
            isTodayDate ? "bg-red-50 hover:bg-red-100/60" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onViewEvents(date, dayEvents);
          }}
        >
          <div className="space-y-2">
            {dayEvents.slice(0, 3).map((event) => {
              const isConflicted = conflicts.some((conflict) =>
                conflict.includes(event)
              );
              return (
                <Event
                  key={event.id}
                  event={event}
                  onDelete={onDeleteEvent}
                  onEdit={onEditEvent}
                  isConflicted={isConflicted}
                  isCompact={true}
                />
              );
            })}
            {dayEvents.length > 3 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewEvents(date, dayEvents);
                }}
                className="text-xs font-medium text-gray-600 hover:text-gray-700 hover:underline underline-offset-2 cursor-pointer w-full text-left px-1 py-0.5 transition-colors uppercase"
              >
                And {dayEvents.length - 3} more
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-gray-100">
        {dayNames.map((dayName, index) =>
          renderDayHeader(dayName, weekDays[index], index)
        )}
      </div>

      {/* Events */}
      <div className="lg:grid lg:grid-cols-7 lg:divide-x lg:divide-gray-100">
        {weekDays.map(renderDayEvents)}
      </div>
    </div>
  );
}
