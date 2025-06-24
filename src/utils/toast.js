import toast from "react-hot-toast";

export const showSuccess = (message) => {
  toast.success(message, {
    duration: 4000,
    position: "top-right",
    style: {
      background: "#10B981",
      color: "#fff",
    },
  });
};

export const showError = (message) => {
  toast.error(message, {
    duration: 5000,
    position: "top-right",
    style: {
      background: "#EF4444",
      color: "#fff",
    },
  });
};

export const showInfo = (message) => {
  toast(message, {
    duration: 3000,
    position: "top-right",
    style: {
      background: "#3B82F6",
      color: "#fff",
    },
  });
};
