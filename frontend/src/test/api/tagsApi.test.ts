import { describe, it, expect, afterEach } from 'vitest';
import { tagsApi } from '@/api/tagsApi';
import { createMockTag, createMockTagUpdate, validateTagResponse, cleanupTestData } from '../utils/testHelpers';
import { TagResponseWithTasks } from '@/types/tag';

describe('Tags API', () => {
  let createdTag: TagResponseWithTasks | null = null;

  afterEach(async () => {
    if (createdTag?.id) {
      try {
        await tagsApi.deleteTag(createdTag.id);
      } catch (error) {
        console.warn('Failed to cleanup tag:', error);
      }
      createdTag = null;
    }
    await cleanupTestData.cleanup();
  });

  describe('POST /tags/', () => {
    it('should create a new tag', async () => {
      const tagData = createMockTag({ tag: 'api-test-tag' });
      
      createdTag = await tagsApi.createTag(tagData);
      
      validateTagResponse(createdTag);
      expect(createdTag.tag).toBe(tagData.tag);
    });
  });

  describe('GET /tags/tag_page', () => {
    it('should fetch tag page', async () => {
      const tags = await tagsApi.getTagPage();
      
      expect(Array.isArray(tags)).toBe(true);
      expect(tags.length).toBeLessThanOrEqual(10);
      
      if (tags.length > 0) {
        validateTagResponse(tags[0]);
      }
    });
  });

  describe('GET /tags/{tag_id}', () => {
    it('should fetch a specific tag', async () => {
      const tagData = createMockTag({ tag: 'fetch-test-tag' });
      createdTag = await tagsApi.createTag(tagData);
      
      const fetchedTag = await tagsApi.getTag(createdTag.id);
      
      validateTagResponse(fetchedTag);
      expect(fetchedTag.id).toBe(createdTag.id);
    });
  });

  describe('PATCH /tags/{tag_id}/edit', () => {
    it('should update tag name', async () => {
      const tagData = createMockTag({ tag: 'original-tag' });
      createdTag = await tagsApi.createTag(tagData);
      
      const updatedData = createMockTagUpdate( {tag: 'updated-tag'} )
      const updatedTag = await tagsApi.editTag(createdTag.id, updatedData);
      
      validateTagResponse(updatedTag);
      expect(updatedTag.tag).toBe('updated-tag');
    });
  });

  describe('DELETE /tags/{tag_id}', () => {
    it('should delete a tag', async () => {
      const tagData = createMockTag({ tag: 'delete-test-tag' });
      createdTag = await tagsApi.createTag(tagData);
      
      await tagsApi.deleteTag(createdTag.id);
      
      await expect(tagsApi.getTag(createdTag.id)).rejects.toThrow();
      createdTag = null;
    });
  });
});