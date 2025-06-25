import {
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  CalendarIcon as CalendarViewIcon,
  Upload,
  Download,
} from "lucide-react";

export default function CalendarHeader({
  currentDate,
  viewMode,
  onNavigate,
  onViewModeChange,
  onAddEvent,
  onImportEvents,
  onExportEvents,
}) {
  const ViewButton = ({ mode, icon: Icon, label, isActive }) => (
    <button
      onClick={() => onViewModeChange(mode)}
      className={`flex items-center space-x-1 lg:space-x-2 px-2 lg:px-4 py-2 rounded-lg transition-all text-xs lg:text-sm font-medium ${
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      <Icon className="w-3 h-3 lg:w-4 lg:h-4 max-lg:m-0" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
      <div className="flex items-center space-x-4 lg:space-x-6 mt-12 lg:mt-0">
        <h1 className="text-2xl lg:text-4xl font-light text-gray-900">
          {currentDate.format("MMM'")} {currentDate.format("YYYY")}
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate("prev")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Previous period"
          >
            <ChevronLeft className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Next period"
          >
            <ChevronRight className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between lg:justify-end space-x-4">
        <div className="flex bg-gray-100 rounded-xl p-1">
          <ViewButton
            mode="weekly"
            icon={CalendarViewIcon}
            label="Week"
            isActive={viewMode === "weekly"}
          />
          <ViewButton
            mode="monthly"
            icon={Grid3X3}
            label="Month"
            isActive={viewMode === "monthly"}
          />
        </div>

        <button
          onClick={onImportEvents}
          className="hidden lg:flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          <Upload className="w-4 h-4" />
          <span>Import</span>
        </button>

        <button
          onClick={onExportEvents}
          className="hidden lg:flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>

        <button
          onClick={onAddEvent}
          className="bg-black text-white px-3 lg:px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-xs lg:text-sm"
        >
          <span className="hidden sm:inline">Add event</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </div>
  );
}
