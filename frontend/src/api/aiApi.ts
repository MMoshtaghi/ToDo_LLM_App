import { apiClient } from './client';
import { TaskResponseWithTags } from '../types/task';

export const aiApi = {
  smartTag: (taskId: number): Promise<TaskResponseWithTags> =>
    apiClient.post(`/ai/${taskId}`, {}),
};
