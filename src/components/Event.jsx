"use client";

import { formatDisplayTime } from "../utils/dateUtils";
import { eventTypes } from "../data/events";
import {
  Edit2,
  Trash2,
  Clock,
  AlertTriangle,
  OctagonAlert,
} from "lucide-react";

export default function Event({
  event,
  onDelete,
  onEdit,
  isConflicted = false,
  isCompact = false,
  showActions = false,
}) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(event.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(event);
  };

  const isAllDay = event.time === "all-day";
  const eventType = eventTypes[event.category] || eventTypes.other;

  if (isCompact) {
    return (
      <div
        className={`
          relative px-2 py-1 text-sm font-medium truncate cursor-pointer group
          text-gray-700 transition-all
        `}
        title={`${event.title} ${
          !isAllDay ? `(${formatDisplayTime(event.time)})` : "(All day)"
        }${isConflicted ? " - Has conflicts!" : ""}`}
        onClick={handleEdit}
      >
        {isConflicted && (
          <div className="absolute right-0 pt-1">
            <OctagonAlert className="w-4 h-4 text-orange-600" />
          </div>
        )}
        <div className="flex flex-col items-start justify-start">
          <div className="pr-2 text-wrap font-semibold text-sm leading-tight pb-1">
            {event.title}
          </div>

          <div className="flex items-center space-x-1 text-xs font-normal text-gray-600">
            <span className="truncate uppercase">{event.time}</span>
            <span className="text-base leading-none">•</span>
            <span className="truncate">{event.duration} mins</span>
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(e);
              }}
              className="p-0.5 hover:bg-white/50 rounded cursor-pointer"
              title="Edit"
            >
              <Edit2 className="w-2.5 h-2.5 text-gray-500" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(e);
              }}
              className="p-0.5 hover:bg-white/50 rounded cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-2.5 h-2.5 text-red-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        relative p-3 rounded-xl transition-all group cursor-pointer
        ${isConflicted ? "ring-2 ring-red-200 bg-red-50/50" : ""}
      `}
      onClick={handleEdit}
    >
      {isConflicted && (
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
          <OctagonAlert className="w-4 h-4 text-orange-600" />
        </div>
      )}

      <span
        className={`text-xs rounded-full ${eventType.textColor} font-medium`}
      >
        {eventType.label}
      </span>

      <div className="flex justify-between items-start mb-1">
        <div
          className={`font-semibold text-sm text-gray-700 leading-tight`}
        >
          {event.title}
        </div>
        <div
          className={`flex space-x-1 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <button
            onClick={handleEdit}
            className="p-1 hover:bg-white/50 rounded transition-colors"
            title="Edit event"
          >
            <Edit2 className="w-3 h-3 text-gray-500" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-white/50 rounded transition-colors"
            title="Delete event"
          >
            <Trash2 className="w-3 h-3 text-red-500" />
          </button>
        </div>
      </div>

      {!isAllDay && (
        <div className="flex items-center space-x-1 text-xs font-normal text-gray-600 ">
          <span>
            {formatDisplayTime(event.time)} -{" "}
            {formatDisplayTime(
              new Date(
                new Date(`2000-01-01 ${event.time}`).getTime() +
                  event.duration * 60000
              )
                .toTimeString()
                .slice(0, 5)
            )}
          </span>
        </div>
      )}

      {isAllDay && (
        <div className="text-xs text-gray-600 mb-1 uppercase">All day</div>
      )}

      {event.description && (
        <div className="text-xs text-gray-500 mb-1 line-clamp-2">
          {event.description}
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        {isConflicted && (
          <div className="flex items-center space-x-1 text-xs text-red-600 font-medium">
            <OctagonAlert className="w-3 h-3" />
            <span>Conflict!</span>
          </div>
        )}
      </div>
    </div>
  );
}
