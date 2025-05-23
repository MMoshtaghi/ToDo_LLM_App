import { useState, useEffect } from 'react';
import { tasksApi } from '../api/tasksApi';
import { aiApi } from '../api/aiApi';
import { TaskResponseWithTags, TaskCreate, TaskUpdate } from '../types/task';

export const useTasks = () => {
  const [tasks, setTasks] = useState<TaskResponseWithTags[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (offset = 0, limit = 10) => {
    setLoading(true);
    try {
      const data = await tasksApi.getTaskPage(offset, limit);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
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
        setError('Failed to create task');
    }
  };

  const editTask = async (id: number, update: TaskUpdate) => {
    try {
      const updatedTask = await tasksApi.editTask(id, update);
      setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
    } catch (err) {
        console.error('Error editing task:', err);
        setError('Failed to edit task');
    }
  };

  const deleteTask = async (id: number) => {
  try {
    await tasksApi.deleteTask(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  } catch (err) {
    console.error('Error deleting task:', err);
    setError('Failed to delete task');
  }
  };

  const tagTask = async (taskId: number, tagId: number) => {
  try {
    const updatedTask = await tasksApi.tagTask(taskId, tagId);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
  } catch (err) {
    console.error('Error tagging task:', err);
    setError('Failed to tag task');
  }
  };

  const untagTask = async (taskId: number, tagId: number) => {
  try {
    const updatedTask = await tasksApi.untagTask(taskId, tagId);
    setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
  } catch (err) {
    console.error('Error untagging task:', err);
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
    setError('Failed to smart tag task');
    throw err;
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, createTask, fetchTasks, deleteTask, editTask, tagTask, untagTask, smartTag};
};