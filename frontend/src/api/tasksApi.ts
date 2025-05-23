import { apiClient } from './client';
import { TaskCreate, TaskUpdate, TaskResponseWithTags } from '../types/task';

export const tasksApi = {
  createTask: (task: TaskCreate): Promise<TaskResponseWithTags> =>
    apiClient.post('/tasks/', task),
    
  getTaskPage: (offset = 0, limit = 10): Promise<TaskResponseWithTags[]> =>
    apiClient.get(`/tasks/task_page?offset=${offset}&limit=${limit}`),
    
  getTask: (taskId: number): Promise<TaskResponseWithTags> =>
    apiClient.get(`/tasks/${taskId}`),
    
  deleteTask: (taskId: number): Promise<void> =>
    apiClient.delete(`/tasks/${taskId}`),
    
  editTask: (taskId: number, update: TaskUpdate): Promise<TaskResponseWithTags> =>
    apiClient.patch(`/tasks/${taskId}/edit`, update),
    
  tagTask: (taskId: number, tagId: number): Promise<TaskResponseWithTags> =>
    apiClient.patch(`/tasks/${taskId}/tag?tag_id=${tagId}`, {}),

  untagTask: (taskId: number, tagId: number): Promise<TaskResponseWithTags> =>
    apiClient.patch(`/tasks/${taskId}/untag?tag_id=${tagId}`, {}),
};