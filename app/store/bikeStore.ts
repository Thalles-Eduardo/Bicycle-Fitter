import { create } from "zustand";
import { persist } from "zustand/middleware";

type BikeStore = {
  selectedWheel: number | null;
  selectedFrame: number | null;
  setSelectedWheel: (id: number) => void;
  setSelectedFrame: (id: number) => void;
};

export const useBikeStore = create<BikeStore>()(
  persist(
    (set) => ({
      selectedWheel: null,
      selectedFrame: null,
      setSelectedWheel: (id) => set({ selectedWheel: id }),
      setSelectedFrame: (id) => set({ selectedFrame: id }),
    }),
    { name: "bike-config" }
  )
);