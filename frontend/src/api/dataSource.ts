// src/api/dataSource.ts

export interface MedItem {
  id: number;
  name: string;

  start_date: string;  // ISO
  end_date: string;    // ISO

  dosage_count: number;
  dosage_times: string[]; // ISO strings ["2025-01-05T08:00", "2025-01-05T20:00"]

  food_instruction: "before" | "after";

  notes?: string;
}

const KEY = "jarvis_meds";

// Load list
function load(): MedItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

// Save list
function save(list: MedItem[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export const LocalMedStore = {
  getAll(): MedItem[] {
    return load();
  },

  add(data: Omit<MedItem, "id">): MedItem {
    const list = load();
    const newItem: MedItem = { id: Date.now(), ...data };
    list.push(newItem);
    save(list);
    return newItem;
  },

  update(id: number, changes: Partial<MedItem>) {
    const list = load().map((m) => (m.id === id ? { ...m, ...changes } : m));
    save(list);
  },

  delete(id: number) {
    const list = load().filter((m) => m.id !== id);
    save(list);
  },
};


