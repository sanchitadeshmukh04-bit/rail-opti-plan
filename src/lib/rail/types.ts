export type Department = "Track" | "Electrical/OHE" | "Signal & Telecom" | "Mechanical" | "Other";
export type Priority = "Critical" | "High" | "Medium" | "Low";
export type Condition = "Good" | "Fair" | "Poor" | "Critical";
export type BlockStatus = "Recommended" | "Approved" | "Rejected" | "Conflict";

export interface Train {
  id: string;
  trainId: string;
  name: string;
  route: string;
  location: string; // e.g. "KM 120"
  km: number;
  arrival: string; // "HH:MM"
  departure: string;
  type: "Express" | "Superfast" | "Passenger" | "Freight" | "MEMU";
  priority: Priority;
  status: "On Time" | "Delayed" | "Cancelled";
}

export interface Asset {
  id: string;
  assetId: string;
  type: "Track" | "OHE" | "Signal" | "Point Machine" | "Level Crossing" | "Bridge";
  location: string;
  km: number;
  condition: Condition;
  criticality: Priority;
  failureRisk: number; // 0-100
  availability: number; // %
  lastMaintenance: string;
  nextDue: string;
}

export interface Task {
  id: string;
  taskId: string;
  assetId: string;
  location: string;
  km: number;
  department: Department;
  maintenanceType: string;
  duration: number; // hours
  priority: Priority;
  requiredDate: string;
  resources: string[];
  safetyClass: "Power Block" | "Traffic Block" | "Non-Intrusive";
  status: "Pending" | "Planned" | "Completed";
}

export interface Resource {
  id: string;
  name: string;
  type: "Manpower" | "Equipment" | "Vehicle";
  department: Department;
  availableUnits: number;
  totalUnits: number;
}

export interface PlannedBlock {
  id: string;
  blockId: string;
  location: string;
  kmFrom: number;
  kmTo: number;
  date: string;
  start: string;
  end: string;
  duration: number;
  departments: Department[];
  taskIds: string[];
  status: BlockStatus;
  score: number;
  reasons: string[];
  conflicts: Conflict[];
  suggestedStart?: string;
  suggestedEnd?: string;
  availabilityGain: number;
}

export interface Conflict {
  type:
    | "Train movement"
    | "Resource"
    | "Manpower"
    | "Location"
    | "Time"
    | "Safety"
    | "Department dependency";
  detail: string;
  severity: "High" | "Medium" | "Low";
}
