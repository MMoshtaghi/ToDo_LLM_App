import { useState, useEffect } from 'react';
import { tasksApi } from '../api/tasksApi';
import { aiApi } from '../api/aiApi';
import { TaskResponseWithTags, TaskCreate, TaskUpdate } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskResponseWithTags[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorContext, setErrorContext] = useState<'fetch' | 'create' | 'edit' | 'delete' | 'tag' | 'untag' | 'smartTag' | null>(null);

  // ! Warning : Now we are using client-side pagination
  // ! with hard-coded limit size to 100 (the max) for the backend
  // ! we should get the total count of rows from the backend for server-side pagination
  const fetchTasks = async (offset = 0, limit = 100) => {
    setLoading(true);
    try {
      const data = await tasksApi.getTaskPage(offset, limit);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setErrorContext('fetch');
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: TaskCreate) => {
    try {
      const newTask = await tasksApi.createTask(task);
      setTasks(prev => [newTask, ...prev]);
    } catch (err) {
        console.error('Error creating task:', err);
        setErrorContext('create');
        setError('Failed to create task');
    }
  };

  const editTask = async (id: number, update: TaskUpdate) => {
    try {
      const updatedTask = await tasksApi.editTask(id, update);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
        console.error('Error editing task:', err);
        setErrorContext('edit');
        setError('Failed to edit task');
    }
  };

  const deleteTask = async (id: number) => {
  try {
    await tasksApi.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  } catch (err) {
    console.error('Error deleting task:', err);
    setErrorContext('delete');
    setError('Failed to delete task');
  }
  };

  const tagTask = async (taskId: number, tagId: number) => {
  try {
    const updatedTask = await tasksApi.tagTask(taskId, tagId);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
  } catch (err) {
    console.error('Error tagging task:', err);
    setErrorContext('tag');
    setError('Failed to tag task');
  }
  };

  const untagTask = async (taskId: number, tagId: number) => {
  try {
    const updatedTask = await tasksApi.untagTask(taskId, tagId);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
  } catch (err) {
    console.error('Error untagging task:', err);
    setErrorContext('untag');
    setError('Failed to untag task');
  }
  };

  const smartTag = async (taskId: number) => {
  setLoading(true);
  try {
    const updatedTask = await aiApi.smartTag(taskId);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
    return updatedTask;
  } catch (err) {
    console.error('Error smart-tagging task:', err);
    setErrorContext('smartTag');
    setError('Failed to smart tag task. AI service temporarily unavailable. Please try again later.');
    throw err;
  } finally {
    setLoading(false);
  }
  };

  const clearError = () => {
    setError(null);
    setErrorContext(null);
  };


  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, errorContext, clearError, createTask, fetchTasks, deleteTask, editTask, tagTask, untagTask, smartTag};
};