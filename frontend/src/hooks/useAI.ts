import { useState } from 'react';
import { aiApi } from '../api/aiApi';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const smartTag = async (taskId: number) => {
    setLoading(true);
    try {
      const result = await aiApi.smartTag(taskId);
      return result;
    } catch (err) {
        console.error('Error smart-tagging task:', err);
        throw new Error('Failed to smart tag task');
    } finally {
      setLoading(false);
    }
  };

  return { smartTag, loading };
};