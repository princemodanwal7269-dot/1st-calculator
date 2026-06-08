import { useState, useEffect, useRef } from "react";

// ─── DSA IMPLEMENTATIONS ────────────────────────────────────────────────────

// ✅ FIXED HASH TABLE
class HashTable {
  constructor(size = 17) {
    this.size = size;
    this.table = Array.from({ length: size }, () => []);
  }

  _hash(id) {
    return id % this.size;
  }

  set(id, data) {
    const idx = this._hash(id);
    const chain = this.table[idx];

    const existing = chain.find(e => e.id === id);

    if (existing) {
      existing.data = data;
    } else {
      chain.push({ id, data });
    }
  }

  get(id) {
    const chain = this.table[this._hash(id)];
    const found = chain.find(e => e.id === id);
    return found ? found.data : null;
  }

  getAll() {
    return this.table.flatMap(chain => chain.map(e => e.data));
  }
}

// Quick Sort
function quickSort(arr, key) {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)][key];
  const left = arr.filter(x => x[key] < pivot);
  const mid = arr.filter(x => x[key] === pivot);
  const right = arr.filter(x => x[key] > pivot);
  return [...quickSort(left, key), ...mid, ...quickSort(right, key)];
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const DOCTORS = [
  { id: 1, name: "Dr. Mehta", dept: "Cardiology", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"], max: 5 },
  { id: 2, name: "Dr. Singh", dept: "Neurology", slots: ["09:30", "11:30", "13:00", "15:30"], max: 4 },
  { id: 3, name: "Dr. Gupta", dept: "Orthopedics", slots: ["10:00", "12:00", "14:00", "16:00"], max: 4 },
  { id: 4, name: "Dr. Rao", dept: "Dermatology", slots: ["09:00", "10:30", "13:30", "15:00"], max: 4 },
];

const SEED_PATIENTS = [
  { id: 101, name: "Rahul Sharma", age: 34, gender: "Male", contact: "9876543210", history: "Hypertension" },
  { id: 102, name: "Anita Verma", age: 29, gender: "Female", contact: "9123456789", history: "Migraine" },
  { id: 103, name: "Ravi Kumar", age: 45, gender: "Male", contact: "9988776655", history: "Knee injury" },
  { id: 104, name: "Priya Patel", age: 38, gender: "Female", contact: "9011223344", history: "Chest pain" },
  { id: 105, name: "Suresh Nair", age: 52, gender: "Male", contact: "9765432100", history: "Back pain" },
];

const SEED_APPOINTMENTS = [
  { id: "A101", patientId: 101, doctorId: 1, date: "2026-03-12", time: "10:00", status: "Confirmed" },
  { id: "A102", patientId: 102, doctorId: 2, date: "2026-03-12", time: "11:30", status: "Confirmed" },
  { id: "A103", patientId: 103, doctorId: 3, date: "2026-03-12", time: "12:00", status: "Confirmed" },
  { id: "A104", patientId: 104, doctorId: 1, date: "2026-03-12", time: "14:00", status: "Waiting" },
  { id: "A105", patientId: 105, doctorId: 2, date: "2026-03-13", time: "09:30", status: "Scheduled" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const statusColor = s =>
  ({ Confirmed: "#22c55e", Scheduled: "#3b82f6", Waiting: "#f59e0b", Cancelled: "#ef4444" }[s] || "#94a3b8");

const tabs = ["Dashboard", "Register", "Book", "Appointments", "Search", "DSA Visualizer"];

// ─── APP ────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [toast, setToast] = useState(null);

  const htRef = useRef(new HashTable());

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [apptCounter, setApptCounter] = useState(106);

  useEffect(() => {
    const ht = htRef.current;
    SEED_PATIENTS.forEach(p => ht.set(p.id, p));
    setPatients(ht.getAll());
    setAppointments(SEED_APPOINTMENTS);
    setWaitingQueue([{ patientId: 104, doctorId: 1, requestTime: "2026-03-12 13:55" }]);
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addPatient = p => {
    htRef.current.set(p.id, p);
    setPatients(htRef.current.getAll());
  };

  const addAppointment = appt => {
    setAppointments(prev => [appt, ...prev]);
    setApptCounter(c => c + 1);
  };

  const cancelAppointment = id => {
    setAppointments(prev =>
      prev.map(a => (a.id === id ? { ...a, status: "Cancelled" } : a))
    );
    showToast("Appointment cancelled", "info");
  };

  const processQueue = () => {
    if (!waitingQueue.length) return showToast("Queue empty", "info");

    const [next, ...rest] = waitingQueue;
    setWaitingQueue(rest);

    const doc = DOCTORS.find(d => d.id === next.doctorId);
    const patient = htRef.current.get(next.patientId);

    const appt = {
      id: `A${apptCounter}`,
      patientId: next.patientId,
      doctorId: next.doctorId,
      date: "2026-03-12",
      time: doc.slots[0],
      status: "Confirmed",
    };

    addAppointment(appt);
    setApptCounter(c => c + 1);

    showToast(`${patient?.name} moved from queue`);
  };

  const sortedAppts = quickSort([...appointments], "time");

  return (
    <div style={s.root}>
      {toast && (
        <div style={{ ...s.toast, background: toast.type === "info" ? "#3b82f6" : "#22c55e" }}>
          {toast.msg}
        </div>
      )}

      <header style={s.header}>
        <h2>MediQueue</h2>
      </header>

      <nav style={s.nav}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={s.navBtn}>
            {t}
          </button>
        ))}
      </nav>

      <main style={s.main}>
        {activeTab === "Dashboard" && (
          <Dashboard
            appointments={sortedAppts}
            patients={patients}
            waitingQueue={waitingQueue}
            processQueue={processQueue}
            htRef={htRef}
            cancelAppointment={cancelAppointment}
          />
        )}

        {activeTab === "Register" && (
          <Register addPatient={addPatient} showToast={showToast} currentCount={patients.length} />
        )}

        {activeTab === "Book" && (
          <Book
            patients={patients}
            appointments={appointments}
            addAppointment={addAppointment}
            waitingQueue={waitingQueue}
            setWaitingQueue={setWaitingQueue}
            apptCounter={apptCounter}
            showToast={showToast}
          />
        )}

        {activeTab === "Appointments" && (
          <Appointments
            appointments={sortedAppts}
            patients={patients}
            cancelAppointment={cancelAppointment}
          />
        )}

        {activeTab === "Search" && (
          <Search htRef={htRef} appointments={appointments} />
        )}

        {activeTab === "DSA Visualizer" && (
          <DSAVisualizer
            appointments={sortedAppts}
            patients={patients}
            waitingQueue={waitingQueue}
            htRef={htRef}
          />
        )}
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   NOTE:
   Your remaining components (Dashboard, Register, Book, etc.)
   are already correct in your original code.
   Only HashTable + syntax was broken.
───────────────────────────────────────────────────────────── */