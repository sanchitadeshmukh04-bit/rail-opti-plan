import type {
  Asset,
  PlannedBlock,
  Resource,
  Task,
  Train,
} from "./types";

const API_BASE_URL = "http://127.0.0.1:8000";

interface OptimizationResponse {
  blocks: PlannedBlock[];
  unassigned: {
    taskId: string;
    reason: string;
  }[];
  metrics: {
    blocks: number;
    durationHours: number;
    coordinated: number;
    tasks: number;
    conflicts: number;
    averageScore: number;
  };
}

export async function generateOptimizedPlan(
  trains: Train[],
  assets: Asset[],
  tasks: Task[],
  resources: Resource[],
): Promise<OptimizationResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/optimize`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trains,
        assets,
        tasks,
        resources,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Optimization API failed (${response.status}): ${errorText}`,
    );
  }

  return response.json();
}