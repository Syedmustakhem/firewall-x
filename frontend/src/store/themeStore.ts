import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      isDark: true,
      toggle: () => {
        const next = !get().isDark;
        document.documentElement.classList.toggle("dark", next);
        set({ isDark: next });
      },
    }),
    { name: "firewallx-theme" }
  )
);

export const initTheme = () => {
  const stored = localStorage.getItem("firewallx-theme");
  const isDark = stored ? JSON.parse(stored).state.isDark : true;
  document.documentElement.classList.toggle("dark", isDark);
};