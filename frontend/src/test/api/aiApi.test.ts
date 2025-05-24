import { describe, it, expect, afterEach } from 'vitest';
import { tasksApi } from '@/api/tasksApi';
import { aiApi } from '@/api/aiApi';
import { createMockTask, validateTaskResponse } from '../utils/testHelpers';
import { TaskResponseWithTags } from '@/types/task';

describe('AI API', () => {
  let createdTask: TaskResponseWithTags | null = null;

  afterEach(async () => {
    if (createdTask?.id) {
      try {
        await tasksApi.deleteTask(createdTask.id);
      } catch (error) {
        console.warn('Failed to cleanup task:', error);
      }
      createdTask = null;
    }
  });

  describe('POST /ai/{task_id}', () => {
    it('should smart tag a task', async () => {
      // Create a task first
      const taskData = createMockTask({
        title: 'Buy groceries',
        description: 'Need to buy milk, bread, and eggs from the store'
      });
      createdTask = await tasksApi.createTask(taskData);
      
      // Apply smart tagging
      const taggedTask = await aiApi.smartTag(createdTask.id);
      
      validateTaskResponse(taggedTask);
      expect(taggedTask.id).toBe(createdTask.id);
      
      // The AI should have added tags based on the task content
      // Note: This test depends on your AI service working
      console.log('Smart tagged task:', taggedTask);
    }, 20000);

    it('should handle smart tagging for non-existent task', async () => {
      await expect(aiApi.smartTag(99999)).rejects.toThrow();
    });
  });
});