from typing import List, Literal, Optional
from pydantic import BaseModel, Field


Priority = Literal["Critical", "High", "Medium", "Low"]

Department = Literal[
    "Track",
    "Electrical/OHE",
    "Signal & Telecom",
    "Mechanical",
    "Other",
]

Condition = Literal[
    "Good",
    "Fair",
    "Poor",
    "Critical",
]


class Train(BaseModel):
    id: str
    trainId: str
    name: str
    route: str
    location: str
    km: float
    arrival: str
    departure: str
    type: str
    priority: Priority
    status: Literal["On Time", "Delayed", "Cancelled"]


class Asset(BaseModel):
    id: str
    assetId: str
    type: str
    location: str
    km: float
    condition: Condition
    criticality: Priority
    failureRisk: float = Field(default=40, ge=0, le=100)
    availability: float = Field(default=100, ge=0, le=100)
    lastMaintenance: str
    nextDue: str


class Task(BaseModel):
    id: str
    taskId: str
    assetId: str
    location: str
    km: float
    department: Department
    maintenanceType: str
    duration: float = Field(gt=0)
    priority: Priority
    requiredDate: str
    resources: List[str]
    safetyClass: Literal[
        "Power Block",
        "Traffic Block",
        "Non-Intrusive",
    ]
    status: Literal["Pending", "Planned", "Completed"]


class Resource(BaseModel):
    id: str
    name: str
    type: Literal["Manpower", "Equipment", "Vehicle"]
    department: Department
    availableUnits: int = Field(ge=0)
    totalUnits: int = Field(ge=0)


class OptimizationRequest(BaseModel):
    trains: List[Train]
    assets: List[Asset]
    tasks: List[Task]
    resources: List[Resource]


class PredictionRequest(BaseModel):
    assets: List[Asset]


class RiskPrediction(BaseModel):
    assetId: str
    failureProbability: float
    predictedRisk: float
    riskLevel: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]


class PredictionResponse(BaseModel):
    predictions: List[RiskPrediction]


class Conflict(BaseModel):
    type: str
    detail: str
    severity: Literal["High", "Medium", "Low"]


class PlannedBlock(BaseModel):
    id: str
    blockId: str
    location: str
    kmFrom: float
    kmTo: float
    date: str
    start: str
    end: str
    duration: float
    departments: List[str]
    taskIds: List[str]
    status: Literal["Recommended", "Approved", "Rejected", "Conflict"]
    score: float
    reasons: List[str]
    conflicts: List[Conflict]
    suggestedStart: Optional[str] = None
    suggestedEnd: Optional[str] = None
    availabilityGain: float


class UnassignedTask(BaseModel):
    taskId: str
    reason: str


class OptimizationMetrics(BaseModel):
    blocks: int
    durationHours: float
    coordinated: int
    tasks: int
    conflicts: int
    averageScore: float


class OptimizationResponse(BaseModel):
    blocks: List[PlannedBlock]
    unassigned: List[UnassignedTask]
    metrics: OptimizationMetrics