import { CONFIG } from "../config/constants.js";

export class StorageService {
  static save(reservations) {
    try {
      const data = reservations.map((r) => (r.toJSON ? r.toJSON() : r));
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Storage save error:", error);
      return false;
    }
  }

  static load() {
    try {
      const data = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      console.error("Storage load error:", error);
      return [];
    }
  }

  static clear() {
    try {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Storage clear error:", error);
      return false;
    }
  }
}
