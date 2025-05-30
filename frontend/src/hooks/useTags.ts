import { useState, useEffect } from 'react';
import { tagsApi } from '../api/tagsApi';
import { TagResponseWithTasks, TagCreate, TagUpdate } from '../types/tag';

export const useTags = () => {
  const [tags, setTags] = useState<TagResponseWithTasks[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorContext, setErrorContext] = useState<
    'fetch' | 'create' | 'edit' | 'delete' | null
  >(null);

  const fetchTags = async (offset = 0, limit = 100) => {
    setLoading(true);
    try {
      const data = await tagsApi.getTagPage(offset, limit);
      setTags(data);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setErrorContext('fetch');
      setError('Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (tag: TagCreate) => {
    try {
      const newTag = await tagsApi.createTag(tag);
      setTags((prev) => [newTag, ...prev]);
    } catch (err) {
      console.error('Error creating tag:', err);
      setErrorContext('create');
      setError('Failed to create tag');
    }
  };

  const editTag = async (id: number, update: TagUpdate) => {
    try {
      const updatedTag = await tagsApi.editTag(id, update);
      setTags((prev) => prev.map((t) => (t.id === id ? updatedTag : t)));
    } catch (err) {
      console.error('Error editing tag:', err);
      setErrorContext('edit');
      setError('Failed to edit tag');
    }
  };

  const deleteTag = async (id: number) => {
    try {
      await tagsApi.deleteTag(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting tag:', err);
      setErrorContext('delete');
      setError('Failed to delete tag');
    }
  };

  const clearError = () => {
    setError(null);
    setErrorContext(null);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  return {
    tags,
    loading,
    error,
    errorContext,
    clearError,
    createTag,
    deleteTag,
    editTag,
    fetchTags,
  };
};
