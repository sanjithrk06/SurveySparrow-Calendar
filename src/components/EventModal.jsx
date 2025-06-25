import { useState, useEffect } from "react";
import { X, Calendar } from "lucide-react";
import { formatDate } from "../utils/dateUtils";
import { eventTypes } from "../data/events";
import dayjs from "dayjs";

const INITIAL_FORM_STATE = {
  title: "",
  time: "09:00",
  duration: 60,
  type: "timed",
  category: "other",
  description: "",
};

export default function EventModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
  editingEvent = null,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [currentSelectedDate, setCurrentSelectedDate] = useState(selectedDate);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentSelectedDate(selectedDate);
      if (editingEvent) {
        setFormData({
          title: editingEvent.title || "",
          time:
            editingEvent.time === "all-day"
              ? "09:00"
              : editingEvent.time || "09:00",
          duration: editingEvent.duration || 60,
          type:
            editingEvent.type ||
            (editingEvent.time === "all-day" ? "all-day" : "timed"),
          category: editingEvent.category || "other",
          description: editingEvent.description || "",
        });
      } else {
        setFormData(INITIAL_FORM_STATE);
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [editingEvent, isOpen, selectedDate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Event title is required";
    }

    if (formData.type === "timed" && !formData.time) {
      newErrors.time = "Start time is required for timed events";
    }

    if (formData.type === "timed" && formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }

    if (!currentSelectedDate) {
      newErrors.date = "Event date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const eventData = {
        ...formData,
        date: formatDate(currentSelectedDate),
        title: formData.title.trim(),
        time: formData.type === "all-day" ? "all-day" : formData.time,
        description: formData.description.trim(),
      };

      if (editingEvent) {
        onSave({ ...editingEvent, ...eventData });
      } else {
        onSave(eventData);
      }

      handleClose();
    } catch (error) {
      console.error("Error saving event:", error);
      setErrors({ submit: "Failed to save event. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number.parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (e) => {
    const newDate = dayjs(e.target.value);
    if (newDate.isValid()) {
      setCurrentSelectedDate(newDate);
      if (errors.date) {
        setErrors((prev) => ({ ...prev, date: "" }));
      }
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setFormData(INITIAL_FORM_STATE);
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[9999] p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform transition-all border border-gray-200 max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-4 sticky top-0 bg-white rounded-t-3xl border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {editingEvent ? "Edit Event" : "Add Event"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {currentSelectedDate
                ? currentSelectedDate.format("MMMM DD, YYYY")
                : "Select a date"}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6">
          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {/* Event Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date *
            </label>
            <div className="relative">
              <input
                type="date"
                value={
                  currentSelectedDate
                    ? currentSelectedDate.format("YYYY-MM-DD")
                    : ""
                }
                onChange={handleDateChange}
                className={`w-full px-4 py-3 pl-10 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${
                  errors.date
                    ? "border-red-300 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                }`}
                required
              />
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            )}
          </div>

          {/* Event Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 placeholder-gray-400 ${
                errors.title
                  ? "border-red-300 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
              }`}
              placeholder="Enter event title"
              autoFocus
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Event Category */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-gray-900 cursor-pointer"
              disabled={isSubmitting}
            >
              {Object.entries(eventTypes).map(([key, type]) => (
                <option key={key} value={key}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Event Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="timed"
                  checked={formData.type === "timed"}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={isSubmitting}
                />
                <div
                  className={`
                  text-center py-3 px-4 rounded-lg cursor-pointer transition-all text-sm font-medium
                  ${
                    formData.type === "timed"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
                >
                  Timed Event
                </div>
              </label>
              <label className="flex-1">
                <input
                  type="radio"
                  name="type"
                  value="all-day"
                  checked={formData.type === "all-day"}
                  onChange={handleChange}
                  className="sr-only"
                  disabled={isSubmitting}
                />
                <div
                  className={`
                  text-center py-3 px-4 rounded-lg cursor-pointer transition-all text-sm font-medium
                  ${
                    formData.type === "all-day"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                  }
                  ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
                `}
                >
                  All Day
                </div>
              </label>
            </div>
          </div>

          {/* Time and Duration (only for timed events) */}
          {formData.type === "timed" && (
            <div className="space-y-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${
                    errors.time
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 cursor-pointer ${
                    errors.duration
                      ? "border-red-300 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                  <option value={180}>3 hours</option>
                </select>
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all text-gray-900 placeholder-gray-400 resize-none"
              placeholder="Add event description..."
              disabled={isSubmitting}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 text-gray-600 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim()}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <span>{editingEvent ? "Update Event" : "Add Event"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
