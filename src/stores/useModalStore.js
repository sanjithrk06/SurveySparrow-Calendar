import { create } from "zustand";

export const useModalStore = create((set) => ({
  // Event Modal
  eventModal: {
    isOpen: false,
    data: null,
  },

  // Details Modal
  detailsModal: {
    isOpen: false,
    data: null,
  },

  // Import Modal
  importModal: {
    isOpen: false,
    data: null,
  },

  // Event Modal Actions
  openEventModal: (data = null) => {
    set((state) => ({
      eventModal: {
        isOpen: true,
        data,
      },
    }));
  },

  closeEventModal: () => {
    set((state) => ({
      eventModal: {
        isOpen: false,
        data: null,
      },
    }));
  },

  // Details Modal Actions
  openDetailsModal: (data = null) => {
    set((state) => ({
      detailsModal: {
        isOpen: true,
        data,
      },
    }));
  },

  closeDetailsModal: () => {
    set((state) => ({
      detailsModal: {
        isOpen: false,
        data: null,
      },
    }));
  },

  // Import Modal Actions
  openImportModal: (data = null) => {
    set((state) => ({
      importModal: {
        isOpen: true,
        data,
      },
    }));
  },

  closeImportModal: () => {
    set((state) => ({
      importModal: {
        isOpen: false,
        data: null,
      },
    }));
  },
}));
