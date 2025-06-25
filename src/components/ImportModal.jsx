"use client";

import { useState } from "react";
import { X, Download, AlertTriangle, CheckCircle } from "lucide-react";
import {
  processImportedEvents,
  generateSampleJson,
} from "../utils/importUtils";

export default function ImportModal({ isOpen, onClose, onImport }) {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState(null);

  const handleClose = () => {
    setInputText("");
    setImportResult(null);
    setIsProcessing(false);
    onClose();
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setImportResult(null);

    try {
      const rawEvents = JSON.parse(inputText);
      const { validEvents, errors } = processImportedEvents(rawEvents);

      setImportResult({
        totalEvents: rawEvents.length,
        validEvents: validEvents.length,
        errors: errors.length,
        errorMessages: errors,
        events: validEvents,
      });
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
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white text-black rounded-xl w-full max-w-2xl shadow-lg p-6 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Import Events (JSON)</h2>
          <button onClick={handleClose}>
            <X className="w-6 h-6 text-black" />
          </button>
        </div>

        {!importResult ? (
          <>
            {/* Textarea Input */}
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste JSON here..."
              rows={12}
              className="w-full p-4 border-dashed border-gray-800 focus:border-gray-800 rounded-lg font-mono bg-gray-100 text-black"
            />

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                onClick={downloadSample}
                className="flex items-center space-x-2 text-sm text-black underline cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download Sample</span>
              </button>

              <button
                onClick={handleProcess}
                className="bg-black text-white px-5 py-2 rounded-lg hover:bg-black/80 transition cursor-pointer"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Validate JSON"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Summary */}
            <div>
              <h3 className="text-lg font-bold mb-2">Import Summary</h3>
              <div className="grid grid-cols-3 text-center border border-black rounded-lg overflow-hidden">
                <div className="p-4 border-r border-black">
                  <div className="text-2xl font-bold">
                    {importResult.totalEvents}
                  </div>
                  <div className="text-sm">Total</div>
                </div>
                <div className="p-4 border-r border-black">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.validEvents}
                  </div>
                  <div className="text-sm">Valid</div>
                </div>
                <div className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.errors}
                  </div>
                  <div className="text-sm">Errors</div>
                </div>
              </div>
            </div>

            {/* Valid Events */}
            {importResult.validEvents > 0 && (
              <div className="flex items-start space-x-2 p-3 bg-green-100 rounded-md">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                <div>
                  <p>
                    <strong>{importResult.validEvents}</strong> event
                    {importResult.validEvents !== 1 ? "s" : ""} ready to import.
                  </p>
                </div>
              </div>
            )}

            {/* Errors */}
            {importResult.errors > 0 && (
              <div className="space-y-2">
                <div className="flex items-start space-x-2 p-3 bg-red-100 rounded-md">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p>
                      <strong>{importResult.errors}</strong> error
                      {importResult.errors !== 1 ? "s" : ""} found in input.
                    </p>
                  </div>
                </div>

                <ul className="text-sm text-red-800 space-y-1 max-h-40 overflow-y-auto pl-4 list-disc">
                  {importResult.errorMessages.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleClose}
                className="flex-1 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              {importResult.validEvents > 0 && (
                <button
                  onClick={handleImportConfirm}
                  className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
                >
                  Import
                </button>
              )}
              <button
                onClick={() => {
                  setImportResult(null);
                  setInputText("");
                }}
                className="px-6 py-2 bg-white text-black border border-black rounded-lg hover:bg-gray-100"
              >
                Try Again
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
