export const safeLocalStorage = {
  get(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // можно логировать или игнорировать
    }
  },

  remove(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // игнор
    }
  },

  clear(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.clear();
    } catch {
      // игнор
    }
  },
};
