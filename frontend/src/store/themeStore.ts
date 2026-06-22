import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: false, // Default = Light Mode

      toggle: () => {
        const next = !get().isDark;
        document.documentElement.classList.toggle("dark", next);
        set({ isDark: next });
      },
    }),
    {
      name: "firewallx-theme",
    }
  )
);

export const initTheme = () => {
  const stored = localStorage.getItem("firewallx-theme");

  const isDark = stored
    ? JSON.parse(stored).state.isDark
    : false; // Default = Light Mode

  document.documentElement.classList.toggle("dark", isDark);
};