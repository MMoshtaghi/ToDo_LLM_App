import type { TaskResponse } from './task';

export interface TagBase {
  tag: string;
}

export type TagCreate = TagBase;

export interface TagResponse extends TagBase {
  id: number;
}

export interface TagResponseWithTasks extends TagResponse {
  tasks: TaskResponse[];
}

export type TagUpdate = TagBase;
