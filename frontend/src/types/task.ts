import type { TagResponse } from './tag';

export interface TaskCreate {
  title: string;
  description?: string | null;
  is_done: boolean;
  scheduled_for?: string | null;
}

export interface TaskUpdate {
  title?: string | null;
  description?: string | null;
  is_done?: boolean | null;
  scheduled_for?: string | null;
}

export interface TaskResponse {
  id: number;
  title: string;
  description?: string | null;
  is_done: boolean;
  scheduled_for?: string | null;
  created_at: string;
}

export interface TaskResponseWithTags extends TaskResponse {
  tags: TagResponse[];
}
