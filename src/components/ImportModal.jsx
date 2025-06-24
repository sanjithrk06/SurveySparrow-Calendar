"use client";

import { useState, useRef } from "react";
import { X, Upload, Download, AlertTriangle, CheckCircle } from "lucide-react";
import {
  readJsonFile,
  processImportedEvents,
  generateSampleJson,
} from "../utils/importUtils";

export default function ImportModal({ isOpen, onClose, onImport }) {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [showSample, setShowSample] = useState(false);
  const fileInputRef = useRef(null);

  const handleClose = () => {
    setImportResult(null);
    setShowSample(false);
    setIsProcessing(false);
    onClose();
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    processFile(file);
  };

  const processFile = async (file) => {
    setIsProcessing(true);
    setImportResult(null);

    try {
      // Read and parse JSON file
      const rawEvents = await readJsonFile(file);

      // Process and validate events
      const { validEvents, errors } = processImportedEvents(rawEvents);

      const result = {
        totalEvents: rawEvents.length,
        validEvents: validEvents.length,
        errors: errors.length,
        errorMessages: errors,
        events: validEvents,
      };

      setImportResult(result);
    } catch (error) {
      setImportResult({
        totalEvents: 0,
        validEvents: 0,
        errors: 1,
        errorMessages: [error.message],
        events: [],
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportConfirm = () => {
    if (importResult && importResult.events.length > 0) {
      onImport(importResult.events);
      handleClose();
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const downloadSample = () => {
    const sampleJson = generateSampleJson();
    const blob = new Blob([sampleJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample-events.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl transform transition-all border border-gray-200 max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex z-50 justify-between items-center p-6 pb-4 sticky top-0 bg-white rounded-t-3xl border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Import Events
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Import events from a JSON file
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {!importResult ? (
            <>
              {/* File Upload Area */}
              <div
                className={`
                  relative border-2 border-dashed rounded-2xl p-8 text-center transition-all
                  ${
                    dragActive
                      ? "border-blue-400 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400"
                  }
                  ${isProcessing ? "opacity-50 pointer-events-none" : ""}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isProcessing}
                />

                <div className="flex flex-col items-center space-y-4">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      dragActive ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <Upload
                      className={`w-8 h-8 ${
                        dragActive ? "text-blue-600" : "text-gray-600"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {isProcessing
                        ? "Processing file..."
                        : "Drop your JSON file here"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {isProcessing
                        ? "Please wait while we process your events..."
                        : "or click to browse files"}
                    </p>

                    {isProcessing && (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-blue-600">
                          Processing...
                        </span>
                      </div>
                    )}
                  </div>

                  {!isProcessing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Select File
                    </button>
                  )}
                </div>
              </div>

              {/* Help Section */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">
                    Need help with the format?
                  </h4>
                  <button
                    onClick={() => setShowSample(!showSample)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {showSample ? "Hide" : "Show"} sample format
                  </button>
                </div>

                {showSample && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-700">
                        Sample JSON format:
                      </span>
                      <button
                        onClick={downloadSample}
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download sample</span>
                      </button>
                    </div>
                    <pre className="text-xs text-gray-600 bg-white p-3 rounded-lg overflow-x-auto">
                      {`[
  {
    "title": "Team Meeting",
    "date": "2025-01-15",
    "time": "10:00",
    "duration": 60,
    "type": "timed",
    "category": "meeting",
    "description": "Weekly team sync"
  },
  {
    "title": "Holiday",
    "date": "2025-01-20",
    "time": "all-day",
    "type": "all-day",
    "category": "personal"
  }
]`}
                    </pre>
                  </div>
                )}

                <div className="bg-blue-50 rounded-xl p-4">
                  <h5 className="font-medium text-blue-900 mb-2">
                    Required fields:
                  </h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • <strong>title</strong>: Event title (string)
                    </li>
                    <li>
                      • <strong>date</strong>: Event date in YYYY-MM-DD format
                    </li>
                  </ul>
                  <h5 className="font-medium text-blue-900 mt-3 mb-2">
                    Optional fields:
                  </h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                      • <strong>time</strong>: Start time in HH:MM format or
                      "all-day"
                    </li>
                    <li>
                      • <strong>duration</strong>: Duration in minutes (number)
                    </li>
                    <li>
                      • <strong>category</strong>: work, personal, meeting,
                      social, health, travel, entertainment, other
                    </li>
                    <li>
                      • <strong>description</strong>: Event description (string)
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            /* Import Results */
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Import Summary
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {importResult.totalEvents}
                    </div>
                    <div className="text-sm text-gray-600">Total Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {importResult.validEvents}
                    </div>
                    <div className="text-sm text-gray-600">Valid Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {importResult.errors}
                    </div>
                    <div className="text-sm text-gray-600">Errors</div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              {importResult.validEvents > 0 && (
                <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-900">
                      {importResult.validEvents} event
                      {importResult.validEvents !== 1 ? "s" : ""} ready to
                      import
                    </h4>
                    <p className="text-sm text-green-700 mt-1">
                      These events will be added to your calendar.
                    </p>
                  </div>
                </div>
              )}

              {/* Errors */}
              {importResult.errors > 0 && (
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-red-900">
                        {importResult.errors} error
                        {importResult.errors !== 1 ? "s" : ""} found
                      </h4>
                      <p className="text-sm text-red-700 mt-1">
                        The following events could not be imported:
                      </p>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-xl p-4 max-h-40 overflow-y-auto">
                    <ul className="space-y-2">
                      {importResult.errorMessages.map((error, index) => (
                        <li
                          key={index}
                          className="text-sm text-red-700 flex items-start space-x-2"
                        >
                          <span className="text-red-500 mt-1">•</span>
                          <span>{error}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 text-gray-600 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                {importResult.validEvents > 0 && (
                  <button
                    onClick={handleImportConfirm}
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                  >
                    Import {importResult.validEvents} Event
                    {importResult.validEvents !== 1 ? "s" : ""}
                  </button>
                )}
                <button
                  onClick={() => setImportResult(null)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
