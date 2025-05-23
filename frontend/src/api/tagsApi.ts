import { apiClient } from './client';
import { TagCreate, TagUpdate, TagResponseWithTasks } from '../types/tag';

export const tagsApi = {
  createTag: (tag: TagCreate): Promise<TagResponseWithTasks> =>
    apiClient.post('/tags/', tag),
    
  getTagPage: (offset = 0, limit = 10): Promise<TagResponseWithTasks[]> =>
    apiClient.get(`/tags/tag_page?offset=${offset}&limit=${limit}`),
    
  editTag: (tagId: number, update: TagUpdate): Promise<TagResponseWithTasks> =>
    apiClient.patch(`/tags/${tagId}/edit`, update),
};