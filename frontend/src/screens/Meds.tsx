// src/screens/Meds.tsx

import React, { useState, useEffect, useRef } from "react";
import { LocalMedStore } from "../api/dataSource";
import type { MedItem } from "../api/dataSource";

export default function Meds() {
  const [meds, setMeds] = useState<MedItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // form fields
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [dosageCount, setDosageCount] = useState(1);
  const [dosageTimes, setDosageTimes] = useState<string[]>([""]);

  const [foodInstruction, setFoodInstruction] = useState<"before" | "after">(
    "before"
  );
  const [notes, setNotes] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMeds(LocalMedStore.getAll());
  }, []);

  // Close modal on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setDosageCount(1);
    setDosageTimes([""]);
    setFoodInstruction("before");
    setNotes("");
    setEditingId(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsOpen(true);
  };

  const updateDosageTime = (i: number, value: string) => {
    const arr = [...dosageTimes];
    arr[i] = value;
    setDosageTimes(arr);
  };

  const saveMed = () => {
    if (!name.trim() || !startDate || !endDate) return;

    const isoTimes = dosageTimes.map((t) => `${startDate}T${t}`);

    const payload: Omit<MedItem, "id"> = {
      name,
      start_date: startDate,
      end_date: endDate,
      dosage_count: dosageCount,
      dosage_times: isoTimes,
      food_instruction: foodInstruction,
      notes,
    };

    if (editingId) {
      LocalMedStore.update(editingId, payload);
    } else {
      LocalMedStore.add(payload);
    }

    resetForm();
    setIsOpen(false);
    setMeds(LocalMedStore.getAll());
  };

  // FIXED VERSION — safe ISO → HH:MM conversion
  const startEdit = (m: MedItem) => {
    setEditingId(m.id);
    setName(m.name);
    setStartDate(m.start_date);
    setEndDate(m.end_date);
    setDosageCount(m.dosage_count);

    setDosageTimes(
      m.dosage_times.map((iso) => {
        try {
          const d = new Date(iso);
          return d.toISOString().slice(11, 16); // HH:MM
        } catch {
          return iso;
        }
      })
    );

    setFoodInstruction(m.food_instruction);
    setNotes(m.notes ?? "");

    setIsOpen(true);
  };

  const deleteMed = (id: number) => {
    LocalMedStore.delete(id);
    setMeds(LocalMedStore.getAll());
  };

  const formatISO = (iso: string) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-extrabold mb-6">Medications</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* ADD MED CARD */}
        <div
          onClick={openAddModal}
          className="cursor-pointer bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center rounded-xl h-40 shadow hover:scale-105 hover:shadow-xl transition-all"
        >
          <div className="text-center">
            <div className="text-5xl font-bold">+</div>
            <p className="mt-1 text-sm">Add Medicine</p>
          </div>
        </div>

        {/* SAVED MED CARDS */}
        {meds.map((m) => (
          <div
            key={m.id}
            className="
              bg-gradient-to-br from-blue-600 to-blue-700
              text-white border border-blue-400
              shadow-md rounded-xl p-5
              hover:scale-[1.02] hover:shadow-xl transition-all
              flex flex-col justify-between
            "
          >
            <div className="text-center">
              <h3 className="text-2xl font-extrabold text-white mb-3">
                {m.name}
              </h3>

              <p className="text-blue-100 text-sm mt-1">
                {m.dosage_count} dosage(s) per day •{" "}
                {m.food_instruction === "before" ? "Before Food" : "After Food"}
              </p>

              <div className="mt-3">
                <p className="font-semibold text-blue-100 text-sm">Duration:</p>
                <p className="text-blue-200 text-sm">
                  {m.start_date} → {m.end_date}
                </p>
              </div>

              <div className="mt-3">
                <p className="font-semibold text-blue-100 text-sm">
                  Dosage Times:
                </p>
                {m.dosage_times.map((t, i) => (
                  <p key={i} className="text-blue-200 text-sm">
                    {formatISO(t)}
                  </p>
                ))}
              </div>

              {m.notes && (
                <p className="text-blue-100 mt-3 text-sm italic">{m.notes}</p>
              )}
            </div>

            <div className="flex justify-between mt-5">
              <button
                className="px-3 py-1 text-sm border border-blue-200 text-white rounded hover:bg-blue-500"
                onClick={() => startEdit(m)}
              >
                Edit
              </button>

              <button
                className="px-3 py-1 text-sm border border-red-300 text-red-200 rounded hover:bg-red-600 hover:text-white"
                onClick={() => deleteMed(m.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Medication" : "Add Medication"}
            </h2>

            <div className="space-y-4">
              <input
                className="border p-2 rounded w-full"
                placeholder="Medication Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              {/* Start & End Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Start Date</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600">End Date</label>
                  <input
                    type="date"
                    className="border p-2 rounded w-full"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Dosage Count */}
              <div>
                <label className="text-sm text-gray-600">
                  Dosage Count Per Day
                </label>
                <input
                  type="number"
                  min={1}
                  className="border p-2 rounded w-full"
                  value={dosageCount}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setDosageCount(val);
                    const newArr = Array(val)
                      .fill("")
                      .map((_, i) => dosageTimes[i] || "");
                    setDosageTimes(newArr);
                  }}
                />
              </div>

              {/* Dynamic dosage times */}
              <div>
                <label className="text-sm font-medium">Dosage Times</label>
                <div className="space-y-2 mt-2">
                  {dosageTimes.map((t, i) => (
                    <input
                      key={i}
                      type="time"
                      className="border p-2 rounded w-full"
                      value={t}
                      onChange={(e) => updateDosageTime(i, e.target.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Food Instruction */}
              <div>
                <label className="text-sm">Food Instruction</label>
                <select
                  className="border p-2 rounded w-full"
                  value={foodInstruction}
                  onChange={(e) =>
                    setFoodInstruction(e.target.value as "before" | "after")
                  }
                >
                  <option value="before">Before Food</option>
                  <option value="after">After Food</option>
                </select>
              </div>

              <textarea
                className="border p-2 rounded w-full"
                placeholder="Notes (optional)"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <div className="flex justify-between mt-4">
                <button
                  onClick={saveMed}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  {editingId ? "Save Changes" : "Add Medication"}
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="border px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}











