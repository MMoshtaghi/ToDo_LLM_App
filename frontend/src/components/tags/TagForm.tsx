import React, { useState } from 'react';
import { TagCreate } from '../../types/tag';
import Input from '../common/Input';
import Button from '../common/Button';

interface TagFormProps {
  initialData?: Partial<TagCreate>;
  onSubmit: (tag: TagCreate) => Promise<void>;
  onCancel: () => void;
}

const TagForm: React.FC<TagFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const [tag, setTag] = useState(initialData?.tag || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tag.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({ tag: tag.trim() });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Tag Name"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        placeholder="Enter tag name"
        required
      />

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting} disabled={!tag.trim()}>
          Save Tag
        </Button>
      </div>
    </form>
  );
};

export default TagForm;
