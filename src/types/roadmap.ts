export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';
export type TaskPriority = 'Urgent' | 'High' | 'Medium' | 'Low';

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  phaseId: number;
  phaseName: string;
  status: TaskStatus;
  priority: TaskPriority;
  targetTimeline: string;
  estimatedWeeks: number;
  nistMilestone: string;
  affectedComponents: string[];
  deliverable: string;
  isCustom?: boolean;
}

export interface RoadmapPhase {
  id: number;
  name: string;
  badge: string;
  description: string;
  color: string;
  timeframe: string;
}
