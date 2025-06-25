export const validateEventData = (event) => {
  const requiredFields = ["title", "date"];
  const validCategories = [
    "work",
    "personal",
    "meeting",
    "social",
    "health",
    "travel",
    "entertainment",
    "other",
  ];

  // Check required fields
  for (const field of requiredFields) {
    if (!event[field] || typeof event[field] !== "string") {
      return false;
    }
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(event.date)) {
    return false;
  }

  // Validate time format if provided (HH:MM or "all-day")
  if (event.time && event.time !== "all-day") {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(event.time)) {
      return false;
    }
  }

  // Validate duration if provided
  if (
    event.duration &&
    (typeof event.duration !== "number" || event.duration < 0)
  ) {
    return false;
  }

  // Validate category if provided
  if (event.category && !validCategories.includes(event.category)) {
    return false;
  }

  return true;
};

export const normalizeEventData = (event) => {
  return {
    title: event.title.trim(),
    date: event.date,
    time: event.time || "09:00",
    duration: event.duration || 60,
    type: event.type || (event.time === "all-day" ? "all-day" : "timed"),
    category: event.category || "other",
    description: event.description?.trim() || "",
    note: event.note?.trim() || "",
  };
};

export const readJsonFile = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      reject(new Error("Please select a valid JSON file"));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      reject(
        new Error("File size too large. Please select a file smaller than 5MB")
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);

        // Ensure data is an array
        const eventsArray = Array.isArray(jsonData) ? jsonData : [jsonData];

        resolve(eventsArray);
      } catch (error) {
        reject(
          new Error(
            "Invalid JSON format. Please check your file and try again."
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file. Please try again."));
    };

    reader.readAsText(file);
  });
};

export const processImportedEvents = (rawEvents) => {
  const validEvents = [];
  const errors = [];

  rawEvents.forEach((event, index) => {
    try {
      if (validateEventData(event)) {
        const normalizedEvent = normalizeEventData(event);
        validEvents.push(normalizedEvent);
      } else {
        errors.push(`Event ${index + 1}: Invalid event data structure`);
      }
    } catch (error) {
      errors.push(`Event ${index + 1}: ${error.message}`);
    }
  });

  return { validEvents, errors };
};

export const generateSampleJson = () => {
  const sampleEvents = [
    {
      title: "Team Meeting",
      date: "2025-01-15",
      time: "10:00",
      duration: 60,
      type: "timed",
      category: "meeting",
      description: "Weekly team sync meeting",
    },
    {
      title: "Doctor Appointment",
      date: "2025-01-16",
      time: "14:30",
      duration: 30,
      type: "timed",
      category: "health",
      description: "Annual checkup",
    },
    {
      title: "Holiday",
      date: "2025-01-20",
      time: "all-day",
      duration: 0,
      type: "all-day",
      category: "personal",
      description: "National holiday",
    },
  ];

  return JSON.stringify(sampleEvents, null, 2);
};
