"use client";

import { useEffect } from "react";
import dayjs from "dayjs";
import toast, { Toaster } from "react-hot-toast";
import CalendarHeader from "./CalendarHeader";
import WeeklyView from "./WeeklyView";
import MonthlyView from "./MonthlyView";
import EventModal from "./EventModal";
import EventDetailsModal from "./EventDetailsModal";
import ImportModal from "./ImportModal";
import { useEventsStore } from "../stores/useEventsStore";
import { useCalendarStore } from "../stores/useCalendarStore";
import { useModalStore } from "../stores/useModalStore";

export default function Calendar() {
  // Events store
  const {
    loadEvents,
    addEvent,
    updateEvent,
    deleteEvent,
    importEvents,
    getEventsForDate,
    getConflicts,
  } = useEventsStore();

  // Calendar store
  const { currentDate, viewMode, navigate, changeView } = useCalendarStore();

  // Modal store
  const {
    eventModal,
    detailsModal,
    importModal,
    openEventModal,
    closeEventModal,
    openDetailsModal,
    closeDetailsModal,
    openImportModal,
    closeImportModal,
  } = useModalStore();

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Event handlers
  const handleSaveEvent = (eventData) => {
    const { event } = eventModal.data || {};

    if (event) {
      updateEvent(event.id, eventData);
      toast.success("Event updated successfully!");
    } else {
      addEvent(eventData);
      toast.success("Event created successfully!");
    }

    // Refresh details modal if open for same date
    if (
      detailsModal.isOpen &&
      detailsModal.data?.date?.isSame(dayjs(eventData.date), "day")
    ) {
      const updatedEvents = getEventsForDate(detailsModal.data.date);
      openDetailsModal({ date: detailsModal.data.date, events: updatedEvents });
    }
  };

  const handleDeleteEvent = (eventId) => {
    const success = deleteEvent(eventId);

    if (success) {
      toast.success("Event deleted successfully!");

      // Update details modal if open
      if (detailsModal.isOpen) {
        const remainingEvents = detailsModal.data.events.filter(
          (e) => e.id !== eventId
        );
        if (remainingEvents.length === 0) {
          closeDetailsModal();
        } else {
          openDetailsModal({ ...detailsModal.data, events: remainingEvents });
        }
      }
    } else {
      toast.error("Cannot delete this event");
    }
  };

  const handleImportEvents = (importedEvents) => {
    try {
      const newEvents = importEvents(importedEvents);
      toast.success(
        `Successfully imported ${newEvents.length} event${
          newEvents.length !== 1 ? "s" : ""
        }!`
      );

      if (detailsModal.isOpen && detailsModal.data?.date) {
        const updatedEvents = getEventsForDate(detailsModal.data.date);
        openDetailsModal({
          date: detailsModal.data.date,
          events: updatedEvents,
        });
      }
    } catch (error) {
      toast.error("Failed to import events");
    }
  };

  // Modal handlers
  const handleOpenEventModal = (date, event = null) => {
    openEventModal({ date, event });
  };

  const handleOpenDetailsModal = (date, events) => {
    const freshEvents = getEventsForDate(date);
    openDetailsModal({ date, events: freshEvents });
  };

  const handleEditEvent = (event) => {
    openEventModal({ date: dayjs(event.date), event });
  };

  // Common props for views
  const viewProps = {
    currentDate,
    getEventsForDate,
    getEventConflicts: getConflicts,
    onDateClick: (date) => handleOpenEventModal(date),
    onViewEvents: handleOpenDetailsModal,
    onEditEvent: handleEditEvent,
  };

  return (
    <div className="p-4 lg:p-8">
      <Toaster />

      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onNavigate={navigate}
        onViewModeChange={changeView}
        onAddEvent={() => handleOpenEventModal(dayjs())}
        onImportEvents={() => openImportModal()}
      />

      <p className="text-gray-500 mb-8 lg:mb-12 max-w-md text-sm lg:text-base">
        Here all your planned events. You will find information for each event
        as well you can plan new ones.
      </p>

      {viewMode === "weekly" ? (
        <WeeklyView {...viewProps} onDeleteEvent={handleDeleteEvent} />
      ) : (
        <MonthlyView {...viewProps} onEditEvent={handleEditEvent} />
      )}

      <EventModal
        isOpen={eventModal.isOpen}
        onClose={closeEventModal}
        onSave={handleSaveEvent}
        selectedDate={eventModal.data?.date}
        editingEvent={eventModal.data?.event}
      />

      <EventDetailsModal
        isOpen={detailsModal.isOpen}
        onClose={closeDetailsModal}
        events={detailsModal.data?.events || []}
        date={detailsModal.data?.date}
        conflicts={
          detailsModal.data?.date ? getConflicts(detailsModal.data.date) : []
        }
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      <ImportModal
        isOpen={importModal.isOpen}
        onClose={closeImportModal}
        onImport={handleImportEvents}
      />
    </div>
  );
}
