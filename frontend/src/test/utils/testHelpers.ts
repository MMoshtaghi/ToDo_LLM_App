import { TaskCreate, TaskUpdate, TaskResponseWithTags } from '@/types/task';
import { TagCreate, TagResponseWithTasks, TagUpdate } from '@/types/tag';
import { expect } from 'vitest';

// Test data factories
export const createMockTask = (
  overrides: Partial<TaskCreate> = {}
): TaskCreate => ({
  title: 'Test Task',
  description: 'Test Description',
  is_done: false,
  scheduled_for: null,
  ...overrides,
});

export const createMockTaskUpdate = (
  overrides: Partial<TaskUpdate> = {}
): TaskUpdate => ({
  title: 'Updated Title',
  description: 'Updated Description',
  is_done: true,
  scheduled_for: null,
  ...overrides,
});

export const createMockTag = (
  overrides: Partial<TagCreate> = {}
): TagCreate => ({
  tag: 'test-tag',
  ...overrides,
});

export const createMockTagUpdate = (
  overrides: Partial<TagUpdate> = {}
): TagUpdate => ({
  tag: 'Updated-tag',
  ...overrides,
});

// Helper to wait for async operations
export const waitFor = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// API response validators
export const validateTaskResponse = (task: TaskResponseWithTags): void => {
  expect(task).toBeDefined();
  expect(task.id).toBeTypeOf('number');
  expect(task.title).toBeTypeOf('string');
  expect(task.is_done).toBeTypeOf('boolean');
  expect(task.created_at).toBeTypeOf('string');
  expect(Array.isArray(task.tags)).toBe(true);
};

export const validateTagResponse = (tag: TagResponseWithTasks): void => {
  expect(tag).toBeDefined();
  expect(tag.id).toBeTypeOf('number');
  expect(tag.tag).toBeTypeOf('string');
  expect(Array.isArray(tag.tasks)).toBe(true);
};

// Test cleanup helpers
export const cleanupTestData = {
  tasks: [] as number[],
  tags: [] as number[],

  addTask: (id: number) => cleanupTestData.tasks.push(id),
  addTag: (id: number) => cleanupTestData.tags.push(id),

  async cleanup() {
    // This would be used to clean up test data after tests
    // For now, just reset the arrays
    cleanupTestData.tasks.length = 0;
    cleanupTestData.tags.length = 0;
  },
};
