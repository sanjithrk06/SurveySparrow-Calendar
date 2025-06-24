"use client";

import { isToday } from "../utils/dateUtils";
import { eventTypes } from "../data/events";
import { Calendar, Eye, OctagonAlert } from "lucide-react";

export default function CalendarDay({
  date,
  events,
  conflicts,
  onDateClick,
  onViewEvents,
  onEditEvent,
  isCurrentMonth = true,
  maxEventsToShow = 2,
}) {
  const isTodayDate = isToday(date);
  const hasEvents = events.length > 0;
  const hasMoreEvents = events.length > maxEventsToShow;

  const isEventConflicted = (event) => {
    return conflicts.some((conflictPair) =>
      conflictPair.some((conflictedEvent) => conflictedEvent.id === event.id)
    );
  };

  const handleDateClick = () => {
    if (isCurrentMonth) onDateClick(date);
  };

  const handleViewEvents = (e) => {
    e.stopPropagation();
    onViewEvents(date, events);
  };

  const handleEditEvent = (e, event) => {
    e.stopPropagation();
    onEditEvent(event);
  };

  return (
    <>
      {/* Mobile View */}
      <div
        className={`lg:hidden relative m-1 overflow-hidden group transition-all duration-300 ease-out transform
          ${isCurrentMonth ? "cursor-pointer" : ""}
          p-4 min-h-[60px] flex flex-col justify-center items-center
        `}
        onClick={handleViewEvents}
      >
        {/* Date Number */}
        <div
          className={` text-lg font-semibold transition-all duration-200 flex items-center justify-center rounded-full p-2
            ${
              isTodayDate
                ? " bg-white border-2 border-orange-600 text-orange-600"
                : hasEvents && isCurrentMonth
                ? " bg-black/80 text-white"
                : isCurrentMonth
                ? " bg-white border-2 border-gray-400/70 text-gray-600"
                : " bg-gray-50/50 border border-gray-200/60 text-gray-400"
            }
          `}
        >
          {date.format("DD")}
        </div>
      </div>

      {/* Desktop View */}
      <div className=" hidden lg:block h-24 lg:h-full lg:min-h-32 my-2 m-5">
        <div
          className={`
         border-t-[3px] p-1 lg:p-2 transition-colors relative overflow-hidden group
        ${
          isTodayDate
            ? "bg-red-50 border-orange-500"
            : isCurrentMonth
            ? "bg-white hover:bg-gray-50 border-gray-700"
            : "bg-gray-50 border-black/40"
        }
        ${isCurrentMonth ? "cursor-pointer" : ""}
      `}
          onClick={handleDateClick}
        >
          {isTodayDate && (
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-6 lg:w-8 h-0.5 bg-orange-100" />
          )}

          <div className="flex justify-between items-start mb-1">
            <div
              className={`text-xs lg:text-3xl font-medium ${
                isTodayDate
                  ? "text-orange-600"
                  : isCurrentMonth
                  ? "text-gray-700"
                  : "text-gray-400"
              }`}
            >
              {date.format("DD")}
            </div>

            {hasEvents && isCurrentMonth && (
              <button
                onClick={handleViewEvents}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 m-1 mt-2 hover:bg-white/80 rounded text-gray-700 hover:text-orange-600 cursor-pointer"
                title="View all events"
              >
                <Eye className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="space-y-1 overflow-hidden">
            {events.slice(0, maxEventsToShow).map((event) => {
              const eventType = eventTypes[event.category] || eventTypes.other;
              const isAllDay =
                event.type === "all-day" || event.time === "all-day";
              const isConflicted = isEventConflicted(event);

              return (
                <div
                  key={event.id}
                  className={`
                  relative p-1 lg:py-1.5 rounded cursor-pointer truncate
                  text-gray-700 transition-all
                `}
                  title={`${event.title} ${
                    !isAllDay ? `(${event.time})` : "(All day)"
                  }${isConflicted ? " - Has conflicts!" : ""}`}
                  onClick={(e) => handleEditEvent(e, event)}
                >
                  {/* Conflict Icon */}
                  {isConflicted && (
                    <div className="absolute top-1 right-1">
                      <OctagonAlert className="w-4 h-4 text-orange-400" />
                    </div>
                  )}

                  {/* Title */}
                  <div className="pr-6 truncate font-semibold text-sm leading-tight pb-1">
                    {event.title}
                  </div>

                  {/* Time and Duration */}
                  <div className="flex items-center space-x-1 text-xs font-normal text-gray-600 ">
                    <span className="truncate uppercase">{event.time}</span>
                    <span className="text-base leading-none">•</span>
                    <span className="truncate">{event.duration} mins</span>
                  </div>
                </div>
              );
            })}

            {hasMoreEvents && (
              <button
                onClick={handleViewEvents}
                className="text-xs font-medium text-gray-600 hover:text-gray-700 hover:underline underline-offset-2 cursor-pointer w-full text-left px-1 py-0.5 transition-colors uppercase"
              >
                And {events.length - maxEventsToShow} more
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
