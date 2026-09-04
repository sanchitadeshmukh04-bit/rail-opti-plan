import type { Asset, Resource, Task, Train } from "./types";

export const MAINTENANCE_WINDOWS = [
  { id: "MW1", label: "Morning Window", start: "10:00", end: "13:00" },
  { id: "MW2", label: "Afternoon Window", start: "13:30", end: "16:30" },
  { id: "MW3", label: "Night Window", start: "23:30", end: "03:30" },
];

export const seedTrains: Train[] = [
  { id: "t1", trainId: "12345", name: "Panchavati Express", route: "Nashik → Mumbai CSMT", location: "KM 120", km: 120, arrival: "11:15", departure: "11:17", type: "Express", priority: "High", status: "On Time" },
  { id: "t2", trainId: "12617", name: "Mangala Lakshadweep Exp", route: "Nizamuddin → Ernakulam", location: "KM 121", km: 121, arrival: "09:40", departure: "09:42", type: "Superfast", priority: "Critical", status: "On Time" },
  { id: "t3", trainId: "11009", name: "Sinhagad Express", route: "Pune → Mumbai CSMT", location: "KM 118", km: 118, arrival: "10:05", departure: "10:07", type: "Express", priority: "High", status: "Delayed" },
  { id: "t4", trainId: "51153", name: "Bhusaval Passenger", route: "Bhusaval → Igatpuri", location: "KM 132", km: 132, arrival: "13:50", departure: "13:56", type: "Passenger", priority: "Low", status: "On Time" },
  { id: "t5", trainId: "22221", name: "Rajdhani Special", route: "Mumbai → Hazrat Nizamuddin", location: "KM 145", km: 145, arrival: "16:10", departure: "16:12", type: "Superfast", priority: "Critical", status: "On Time" },
  { id: "t6", trainId: "GDS9021", name: "BOXN Rake Freight", route: "Wardha → JNPT", location: "KM 121", km: 121, arrival: "14:20", departure: "14:35", type: "Freight", priority: "Medium", status: "On Time" },
  { id: "t7", trainId: "97015", name: "Kalyan MEMU", route: "Kalyan → Kasara", location: "KM 128", km: 128, arrival: "10:45", departure: "10:47", type: "MEMU", priority: "Medium", status: "On Time" },
  { id: "t8", trainId: "12111", name: "Amravati Express", route: "Mumbai → Amravati", location: "KM 138", km: 138, arrival: "12:25", departure: "12:27", type: "Express", priority: "High", status: "On Time" },
  { id: "t9", trainId: "11007", name: "Deccan Express", route: "Pune → Mumbai CSMT", location: "KM 152", km: 152, arrival: "11:55", departure: "11:57", type: "Express", priority: "High", status: "On Time" },
  { id: "t10", trainId: "12071", name: "Jan Shatabdi", route: "Mumbai → Jalna", location: "KM 160", km: 160, arrival: "15:05", departure: "15:07", type: "Superfast", priority: "High", status: "On Time" },
  { id: "t11", trainId: "GDS9044", name: "Container Freight", route: "JNPT → Nagpur", location: "KM 132", km: 132, arrival: "23:50", departure: "00:05", type: "Freight", priority: "Low", status: "On Time" },
  { id: "t12", trainId: "17057", name: "Devagiri Express", route: "Secunderabad → Mumbai", location: "KM 145", km: 145, arrival: "01:20", departure: "01:22", type: "Express", priority: "Medium", status: "On Time" },
  { id: "t13", trainId: "12option", name: "Godavari Express", route: "Nanded → Mumbai", location: "KM 118", km: 118, arrival: "14:05", departure: "14:07", type: "Express", priority: "Medium", status: "On Time" },
];

export const seedAssets: Asset[] = [
  { id: "a1", assetId: "TRACK-120", type: "Track", location: "KM 120", km: 120, condition: "Poor", criticality: "High", failureRisk: 89, availability: 91, lastMaintenance: "2026-06-14", nextDue: "2026-09-06" },
  { id: "a2", assetId: "OHE-121", type: "OHE", location: "KM 121", km: 121, condition: "Fair", criticality: "High", failureRisk: 64, availability: 94, lastMaintenance: "2026-07-02", nextDue: "2026-09-08" },
  { id: "a3", assetId: "SIG-120", type: "Signal", location: "KM 120", km: 120, condition: "Fair", criticality: "Critical", failureRisk: 71, availability: 93, lastMaintenance: "2026-07-20", nextDue: "2026-09-05" },
  { id: "a4", assetId: "PM-118", type: "Point Machine", location: "KM 118", km: 118, condition: "Critical", criticality: "Critical", failureRisk: 94, availability: 84, lastMaintenance: "2026-05-11", nextDue: "2026-09-04" },
  { id: "a5", assetId: "TRACK-132", type: "Track", location: "KM 132", km: 132, condition: "Good", criticality: "Medium", failureRisk: 22, availability: 98, lastMaintenance: "2026-08-12", nextDue: "2026-11-10" },
  { id: "a6", assetId: "OHE-133", type: "OHE", location: "KM 133", km: 133, condition: "Fair", criticality: "Medium", failureRisk: 48, availability: 96, lastMaintenance: "2026-07-28", nextDue: "2026-09-20" },
  { id: "a7", assetId: "LC-138", type: "Level Crossing", location: "KM 138", km: 138, condition: "Poor", criticality: "High", failureRisk: 77, availability: 90, lastMaintenance: "2026-06-30", nextDue: "2026-09-07" },
  { id: "a8", assetId: "BR-145", type: "Bridge", location: "KM 145", km: 145, condition: "Fair", criticality: "Critical", failureRisk: 58, availability: 95, lastMaintenance: "2026-04-18", nextDue: "2026-09-12" },
  { id: "a9", assetId: "SIG-145", type: "Signal", location: "KM 145", km: 145, condition: "Good", criticality: "High", failureRisk: 31, availability: 97, lastMaintenance: "2026-08-05", nextDue: "2026-10-05" },
  { id: "a10", assetId: "TRACK-152", type: "Track", location: "KM 152", km: 152, condition: "Poor", criticality: "High", failureRisk: 81, availability: 89, lastMaintenance: "2026-06-01", nextDue: "2026-09-06" },
  { id: "a11", assetId: "OHE-152", type: "OHE", location: "KM 152", km: 152, condition: "Fair", criticality: "High", failureRisk: 55, availability: 93, lastMaintenance: "2026-07-15", nextDue: "2026-09-15" },
  { id: "a12", assetId: "PM-160", type: "Point Machine", location: "KM 160", km: 160, condition: "Good", criticality: "Medium", failureRisk: 18, availability: 99, lastMaintenance: "2026-08-20", nextDue: "2026-11-20" },
];

export const seedResources: Resource[] = [
  { id: "r1", name: "Tamping Machine", type: "Equipment", department: "Track", availableUnits: 1, totalUnits: 2 },
  { id: "r2", name: "Rail Grinding Unit", type: "Equipment", department: "Track", availableUnits: 1, totalUnits: 1 },
  { id: "r3", name: "Tower Wagon", type: "Vehicle", department: "Electrical/OHE", availableUnits: 1, totalUnits: 2 },
  { id: "r4", name: "OHE Gang (8 men)", type: "Manpower", department: "Electrical/OHE", availableUnits: 2, totalUnits: 3 },
  { id: "r5", name: "Track Gang (12 men)", type: "Manpower", department: "Track", availableUnits: 3, totalUnits: 4 },
  { id: "r6", name: "S&T Test Van", type: "Vehicle", department: "Signal & Telecom", availableUnits: 1, totalUnits: 1 },
  { id: "r7", name: "S&T Technicians", type: "Manpower", department: "Signal & Telecom", availableUnits: 3, totalUnits: 4 },
  { id: "r8", name: "Road-Rail Vehicle", type: "Vehicle", department: "Mechanical", availableUnits: 1, totalUnits: 1 },
  { id: "r9", name: "Ultrasonic Flaw Detector", type: "Equipment", department: "Track", availableUnits: 2, totalUnits: 2 },
];

export const seedTasks: Task[] = [
  { id: "k1", taskId: "T101", assetId: "TRACK-120", location: "KM 120", km: 120, department: "Track", maintenanceType: "Rail renewal & packing", duration: 2, priority: "Critical", requiredDate: "2026-09-04", resources: ["Tamping Machine", "Track Gang (12 men)"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k2", taskId: "T102", assetId: "OHE-121", location: "KM 121", km: 121, department: "Electrical/OHE", maintenanceType: "OHE contact wire inspection", duration: 1, priority: "High", requiredDate: "2026-09-04", resources: ["Tower Wagon", "OHE Gang (8 men)"], safetyClass: "Power Block", status: "Pending" },
  { id: "k3", taskId: "T103", assetId: "SIG-120", location: "KM 120", km: 120, department: "Signal & Telecom", maintenanceType: "Signal relay maintenance", duration: 1, priority: "High", requiredDate: "2026-09-04", resources: ["S&T Technicians"], safetyClass: "Non-Intrusive", status: "Pending" },
  { id: "k4", taskId: "T104", assetId: "PM-118", location: "KM 118", km: 118, department: "Signal & Telecom", maintenanceType: "Emergency point machine replacement", duration: 2, priority: "Critical", requiredDate: "2026-09-04", resources: ["S&T Test Van", "S&T Technicians"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k5", taskId: "T105", assetId: "TRACK-132", location: "KM 132", km: 132, department: "Track", maintenanceType: "Ultrasonic rail flaw testing", duration: 1.5, priority: "Medium", requiredDate: "2026-09-05", resources: ["Ultrasonic Flaw Detector", "Track Gang (12 men)"], safetyClass: "Non-Intrusive", status: "Pending" },
  { id: "k6", taskId: "T106", assetId: "OHE-133", location: "KM 133", km: 133, department: "Electrical/OHE", maintenanceType: "Insulator cleaning", duration: 1, priority: "Medium", requiredDate: "2026-09-05", resources: ["Tower Wagon", "OHE Gang (8 men)"], safetyClass: "Power Block", status: "Pending" },
  { id: "k7", taskId: "T107", assetId: "LC-138", location: "KM 138", km: 138, department: "Mechanical", maintenanceType: "Level crossing gear overhaul", duration: 2, priority: "High", requiredDate: "2026-09-05", resources: ["Road-Rail Vehicle"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k8", taskId: "T108", assetId: "BR-145", location: "KM 145", km: 145, department: "Track", maintenanceType: "Girder bearing inspection", duration: 2, priority: "High", requiredDate: "2026-09-05", resources: ["Track Gang (12 men)"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k9", taskId: "T109", assetId: "SIG-145", location: "KM 145", km: 145, department: "Signal & Telecom", maintenanceType: "Axle counter calibration", duration: 1, priority: "Medium", requiredDate: "2026-09-05", resources: ["S&T Technicians"], safetyClass: "Non-Intrusive", status: "Pending" },
  { id: "k10", taskId: "T110", assetId: "TRACK-152", location: "KM 152", km: 152, department: "Track", maintenanceType: "Deep screening of ballast", duration: 3, priority: "High", requiredDate: "2026-09-06", resources: ["Tamping Machine", "Track Gang (12 men)"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k11", taskId: "T111", assetId: "OHE-152", location: "KM 152", km: 152, department: "Electrical/OHE", maintenanceType: "OHE mast earthing check", duration: 1, priority: "High", requiredDate: "2026-09-06", resources: ["OHE Gang (8 men)"], safetyClass: "Power Block", status: "Pending" },
  { id: "k12", taskId: "T112", assetId: "PM-160", location: "KM 160", km: 160, department: "Signal & Telecom", maintenanceType: "Point machine lubrication", duration: 0.5, priority: "Low", requiredDate: "2026-09-06", resources: ["S&T Technicians"], safetyClass: "Non-Intrusive", status: "Pending" },
  { id: "k13", taskId: "T113", assetId: "TRACK-120", location: "KM 120", km: 120, department: "Track", maintenanceType: "Weld defect rectification", duration: 1.5, priority: "High", requiredDate: "2026-09-04", resources: ["Rail Grinding Unit", "Track Gang (12 men)"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k14", taskId: "T114", assetId: "OHE-121", location: "KM 121", km: 121, department: "Electrical/OHE", maintenanceType: "Overlap span adjustment", duration: 1.5, priority: "Medium", requiredDate: "2026-09-06", resources: ["Tower Wagon"], safetyClass: "Power Block", status: "Pending" },
  { id: "k15", taskId: "T115", assetId: "TRACK-132", location: "KM 132", km: 132, department: "Track", maintenanceType: "Fittings replacement", duration: 1, priority: "Low", requiredDate: "2026-09-07", resources: ["Track Gang (12 men)"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k16", taskId: "T116", assetId: "SIG-120", location: "KM 120", km: 120, department: "Signal & Telecom", maintenanceType: "Cable insulation testing", duration: 1, priority: "Medium", requiredDate: "2026-09-07", resources: ["S&T Test Van"], safetyClass: "Non-Intrusive", status: "Pending" },
  { id: "k17", taskId: "T117", assetId: "BR-145", location: "KM 145", km: 145, department: "Mechanical", maintenanceType: "Expansion joint greasing", duration: 1, priority: "Low", requiredDate: "2026-09-07", resources: ["Road-Rail Vehicle"], safetyClass: "Non-Intrusive", status: "Pending" },
  { id: "k18", taskId: "T118", assetId: "LC-138", location: "KM 138", km: 138, department: "Electrical/OHE", maintenanceType: "LC lighting circuit repair", duration: 1, priority: "Medium", requiredDate: "2026-09-05", resources: ["OHE Gang (8 men)"], safetyClass: "Power Block", status: "Pending" },
  { id: "k19", taskId: "T119", assetId: "TRACK-152", location: "KM 152", km: 152, department: "Track", maintenanceType: "Curve realignment", duration: 2, priority: "Medium", requiredDate: "2026-09-06", resources: ["Tamping Machine"], safetyClass: "Traffic Block", status: "Pending" },
  { id: "k20", taskId: "T120", assetId: "PM-118", location: "KM 118", km: 118, department: "Track", maintenanceType: "Turnout sleeper renewal", duration: 2, priority: "High", requiredDate: "2026-09-04", resources: ["Track Gang (12 men)"], safetyClass: "Traffic Block", status: "Pending" },
];

export const BASELINE = {
  blocks: 13,
  durationHours: 26,
  separateActivities: 18,
  conflicts: 5,
  availability: 89.8,
};
