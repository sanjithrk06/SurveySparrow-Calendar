import { useState } from "react";
import {
  X,
  FileText,
  Calendar,
  OctagonAlert,
  Edit2,
  Trash2,
} from "lucide-react";
import { formatDisplayTime } from "../utils/dateUtils";
import { eventTypes } from "../data/events";
import ConfirmDialog from "./ConfirmDialog";

export default function EventDetailsModal({
  isOpen,
  onClose,
  events,
  date,
  onEdit,
  onDelete,
  conflicts = [],
}) {
  const [eventToDelete, setEventToDelete] = useState(null);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDeleteClick = (event) => {
    setEventToDelete(event);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDelete(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setEventToDelete(null);
  };

  // Helper function to check if an event is conflicted
  const isEventConflicted = (event) => {
    return conflicts.some((conflictPair) =>
      conflictPair.some((conflictedEvent) => conflictedEvent.id === event.id)
    );
  };

  // Get conflicted events for an event
  const getConflictedEvents = (event) => {
    const conflictPair = conflicts.find((pair) =>
      pair.some((conflictedEvent) => conflictedEvent.id === event.id)
    );
    return conflictPair ? conflictPair.filter((e) => e.id !== event.id) : [];
  };

  // Show empty state if no events
  if (!events || events.length === 0) {
    return (
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[9998] p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all border border-gray-200">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {date ? date.format("MMMM DD, YYYY") : "Events"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">No events found</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Empty State */}
          <div className="p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events scheduled
            </h3>
            <p className="text-gray-500 mb-6">
              There are no events for this date.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[9998] p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl transform transition-all border border-gray-200 max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Events for {date ? date.format("MMMM DD, YYYY") : ""}
              </h2>
              <div className="flex items-center space-x-4 mt-1">
                <p className="text-sm text-gray-500">
                  {events.length} event{events.length !== 1 ? "s" : ""}
                </p>
                {conflicts.length > 0 && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <OctagonAlert className="w-4 h-4" />
                    <span>
                      {conflicts.length} conflict
                      {conflicts.length !== 1 ? "s" : ""} detected
                    </span>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Events List */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-4">
              {events.map((event) => {
                const eventType =
                  eventTypes[event.category] || eventTypes.other;
                const isAllDay =
                  event.type === "all-day" || event.time === "all-day";
                const isConflicted = isEventConflicted(event);
                const conflictedEvents = getConflictedEvents(event);

                return (
                  <div
                    className={` ${
                      !isConflicted
                        ? " border-b last:border-0 border-gray-300 mx-2 pb-2 "
                        : ""
                    }`}
                  >
                    <div
                      key={event.id}
                      className={`
                      relative  rounded-xl transition-all group cursor-pointer
        ${
          isConflicted
            ? "ring-2 ring-orange-200 bg-orange-50/50 p-3 "
            : " py-3 "
        }
                    `}
                    >
                      {isConflicted && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <OctagonAlert className="w-4 h-4 text-orange-300" />
                        </div>
                      )}

                      <span
                        className={`text-sm rounded-full ${eventType.textColor} font-medium mb-1`}
                      >
                        {eventType.label}
                      </span>

                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <div
                            className={`font-semibold text-lg text-gray-700 leading-tight mb-1`}
                          >
                            {event.title}
                          </div>

                          {event.description && (
                            <div className="flex items-start space-x-2 text-sm text-gray-600 mb-2">
                              <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <p className="leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                          )}

                          {!isAllDay && (
                            <div className="flex items-center space-x-1 text-sm font-normal text-gray-600 mb-2">
                              <span>
                                {formatDisplayTime(event.time)} -{" "}
                                {formatDisplayTime(
                                  new Date(
                                    new Date(
                                      `2000-01-01 ${event.time}`
                                    ).getTime() +
                                      event.duration * 60000
                                  )
                                    .toTimeString()
                                    .slice(0, 5)
                                )}
                              </span>
                            </div>
                          )}

                          {isAllDay && (
                            <div className="text-xs text-gray-600 mb-2 uppercase">
                              All day
                            </div>
                          )}

                          {/* Conflict Warning */}
                          {isConflicted && conflictedEvents.length > 0 && (
                            <div className="bg-gray-50/80 border border-red-200 rounded-lg p-3">
                              <div className="flex items-start space-x-2">
                                <OctagonAlert className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-orange-600 mb-1">
                                    Time Conflict Detected
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    This event overlaps with:{" "}
                                    {conflictedEvents.map((ce, index) => (
                                      <span
                                        key={ce.id}
                                        className="font-medium text-gray-700"
                                      >
                                        {ce.title}
                                        {index < conflictedEvents.length - 1
                                          ? ", "
                                          : ""}
                                      </span>
                                    ))}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <div
                          className={`flex space-x-1 transition-opacity group-hover:opacity-100"
                        `}
                        >
                          <button
                            onClick={() => onEdit(event)}
                            className="p-1 hover:bg-white/50 rounded transition-colors"
                            title="Edit event"
                          >
                            <Edit2 className="w-3 h-3 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(event)}
                            className="p-1 hover:bg-white/50 rounded transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-gray-100 bg-white">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!eventToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Event"
        cancelText="Cancel"
      />
    </>
  );
}
