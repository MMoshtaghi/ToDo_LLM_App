import React, { useState } from 'react';
import { TagResponseWithTasks, TagUpdate } from '../../types/tag';
import TagForm from './TagForm';
import Button from '../common/Button';
import Modal from '../common/Modal';

// TypeScript Interface
// Definition of the expected props for the component.
interface TagCardProps {
  tag: TagResponseWithTasks;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, update: TagUpdate) => Promise<void>;
}

// Functional Component
// Receives props as defined above.
// The type `React.FC<TagListProps>` ensures type safety and good editor support.
const TagCard: React.FC<TagCardProps> = ({ tag, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Delete Handler with Modal
  const handleDelete = async () => {
    setDeleting(true);
    await onDelete(tag.id);
    setDeleting(false);
    setShowDeleteModal(false);
  };

  // If editing: Show the TagForm for editing the tag.
  // onSubmit: Calls onEdit with new data, then exits edit mode.
  // onCancel: Exits edit mode without saving.
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <TagForm
          initialData={{ tag: tag.tag }}
          onSubmit={async (data) => {
            await onEdit(tag.id, data);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  // Display Mode
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      {/* Tag Display: Shows the tag name and two buttons:
            Edit: Switches to edit mode.
            Delete: Calls handleDelete. */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-900 text-lg">#{tag.tag}</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            title="Edit tag"
            onClick={() => setIsEditing(true)}
            aria-label="Edit tag"
            className="!p-1"
          >
            ✏️
          </Button>
          <Button
            variant="ghost"
            size="sm"
            title="Delete tag"
            onClick={() => setShowDeleteModal(true)}
            aria-label="Delete tag"
            className="!p-1 hover:text-red-600"
          >
            🗑️
          </Button>
        </div>
      </div>

      {/* Task Count and Recent Tasks
        - Task Count: Shows how many tasks are linked to the tag.
        - Recent Tasks: Lists up to 3 recent tasks. If there are more, shows a message like "... and 2 more".
        - Best practice: Avoids overwhelming the user with too much info.*/}
      <div className="text-sm text-gray-600">
        <p className="mb-2">
          {tag.tasks?.length || 0} task{tag.tasks?.length !== 1 ? 's' : ''}
        </p>

        {tag.tasks && tag.tasks.length > 0 && (
          <div className="space-y-1">
            <p className="font-medium">Recent tasks:</p>
            <ul className="space-y-1">
              {tag.tasks.slice(0, 3).map((task) => (
                <li key={task.id} className="text-xs text-gray-500 truncate">
                  • {task.title}
                </li>
              ))}
              {tag.tasks.length > 3 && (
                <li className="text-xs text-gray-400">
                  ... and {tag.tasks.length - 3} more
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Tag"
        size="sm"
      >
        <div className="space-y-4">
          <p>
            Are you sure you want to delete the tag{' '}
            <span className="font-semibold">"{tag.tag}"</span>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TagCard;
