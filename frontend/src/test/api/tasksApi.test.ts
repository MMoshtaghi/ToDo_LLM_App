import { describe, it, expect, afterEach } from 'vitest';
import { tasksApi } from '@/api/tasksApi';
import {
  createMockTask,
  createMockTaskUpdate,
  createMockTag,
  validateTaskResponse,
  cleanupTestData,
} from '../utils/testHelpers';
import { TaskResponseWithTags } from '@/types/task';
import { tagsApi } from '@/api/tagsApi';

describe('Tasks API', () => {
  let createdTask: TaskResponseWithTags | null = null;

  afterEach(async () => {
    // Cleanup created tasks
    if (createdTask?.id) {
      try {
        await tasksApi.deleteTask(createdTask.id);
      } catch (error) {
        console.warn('Failed to cleanup task:', error);
      }
      createdTask = null;
    }
    await cleanupTestData.cleanup();
  });

  describe('POST /tasks/', () => {
    it('should create a new task', async () => {
      const taskData = createMockTask({
        title: 'API Test Task',
        description: 'Created via API test',
      });

      createdTask = await tasksApi.createTask(taskData);

      validateTaskResponse(createdTask);
      expect(createdTask.title).toBe(taskData.title);
      expect(createdTask.description).toBe(taskData.description);
      expect(createdTask.is_done).toBe(false);
    });

    it('should create task with minimal data', async () => {
      const taskData = createMockTask({
        title: 'Minimal Task',
      });

      createdTask = await tasksApi.createTask(taskData);

      validateTaskResponse(createdTask);
      expect(createdTask.title).toBe('Minimal Task');
    });
  });

  describe('GET /tasks/task_page', () => {
    it('should fetch task page with default pagination', async () => {
      const tasks = await tasksApi.getTaskPage();

      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeLessThanOrEqual(10); // Default limit

      if (tasks.length > 0) {
        validateTaskResponse(tasks[0]);
      }
    });

    it('should fetch task page with custom pagination', async () => {
      const tasks = await tasksApi.getTaskPage(0, 5);

      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeLessThanOrEqual(5);
    });
  });

  describe('GET /tasks/{task_id}', () => {
    it('should fetch a specific task', async () => {
      // First create a task
      const taskData = createMockTask({ title: 'Task to Fetch' });
      createdTask = await tasksApi.createTask(taskData);

      // Then fetch it
      const fetchedTask = await tasksApi.getTask(createdTask.id);

      validateTaskResponse(fetchedTask);
      expect(fetchedTask.id).toBe(createdTask.id);
      expect(fetchedTask.title).toBe(taskData.title);
    });

    it('should throw error for non-existent task', async () => {
      await expect(tasksApi.getTask(99999)).rejects.toThrow();
    });
  });

  describe('PATCH /tasks/{task_id}/edit', () => {
    it('should update task title', async () => {
      // Create task
      const taskData = createMockTask({ title: 'Original Title' });
      createdTask = await tasksApi.createTask(taskData);

      // Update task
      const updateData = createMockTaskUpdate({ title: 'Updated Title' });
      const updatedTask = await tasksApi.editTask(createdTask.id, updateData);

      validateTaskResponse(updatedTask);
      expect(updatedTask.title).toBe('Updated Title');
      expect(updatedTask.id).toBe(createdTask.id);
    });

    it('should mark task as done', async () => {
      // Create task
      const taskData = createMockTask({ title: 'Task to Complete' });
      createdTask = await tasksApi.createTask(taskData);

      // Mark as done
      const updateData = createMockTaskUpdate({ is_done: true });
      const updatedTask = await tasksApi.editTask(createdTask.id, updateData);

      validateTaskResponse(updatedTask);
      expect(updatedTask.is_done).toBe(true);
    });
  });

  describe('DELETE /tasks/{task_id}', () => {
    it('should delete a task', async () => {
      // Create task
      const taskData = createMockTask({ title: 'Task to Delete' });
      createdTask = await tasksApi.createTask(taskData);

      // Delete task
      await tasksApi.deleteTask(createdTask.id);

      // Verify it's deleted
      await expect(tasksApi.getTask(createdTask.id)).rejects.toThrow();

      createdTask = null; // Prevent cleanup attempt
    });
  });

  describe('PATCH /tasks/{task_id}/tag', () => {
    it('should tag and untag a task', async () => {
      // Create task
      const taskData = createMockTask({ title: 'Task to Tag' });
      createdTask = await tasksApi.createTask(taskData);

      // Create tag
      const tagData = createMockTag({ tag: 'api-test-tag' });
      const createdTag = await tagsApi.createTag(tagData);

      // Tag the task
      const taggedTask = await tasksApi.tagTask(createdTask.id, createdTag.id);

      validateTaskResponse(taggedTask);
      expect(taggedTask.tags.some((tag) => tag.id === createdTag.id)).toBe(
        true
      );

      // Untag the task
      const untaggedTask = await tasksApi.untagTask(
        createdTask.id,
        createdTag.id
      );
      validateTaskResponse(untaggedTask);
      expect(untaggedTask.tags.some((tag) => tag.id === createdTag.id)).toBe(
        false
      );
    });
  });
});
