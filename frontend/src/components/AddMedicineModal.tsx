import React from "react";
import { Calendar, Pill, StickyNote } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  name: string;
  dosage: string;
  time: string;
  notes: string;
  setName: (x: string) => void;
  setDosage: (x: string) => void;
  setTime: (x: string) => void;
  setNotes: (x: string) => void;
}

export default function AddMedicineModal(props: Props) {
  const {
    open, onClose, onSubmit,
    name, dosage, time, notes,
    setName, setDosage, setTime, setNotes
  } = props;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 w-[90%] max-w-md shadow-2xl animate-scaleIn">

        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <Pill className="text-blue-600" /> Add Medication
        </h2>

        <div className="space-y-4">

          <input
            placeholder="Medicine Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-xl shadow-inner"
          />

          <input
            placeholder="Dosage (e.g., 1 tablet)"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            className="w-full p-3 border rounded-xl shadow-inner"
          />

          <div className="flex items-center gap-3 p-3 border rounded-xl shadow-inner">
            <Calendar className="text-gray-600" />
            <input
              type="datetime-local"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          <div className="flex gap-3 p-3 border rounded-xl shadow-inner">
            <StickyNote className="text-gray-600" />
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full outline-none resize-none"
              rows={3}
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onSubmit}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition active:scale-95"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}

