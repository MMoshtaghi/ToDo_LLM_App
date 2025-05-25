import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskResponseWithTags, TaskUpdate } from '../../types/task';
import TagSelector from '../tags/TagSelector';
import Button from '../common/Button';
import Loading from '../common/Loading';
import Modal from '../common/Modal';

// TypeScript Interface
// Definition of the expected props for the component.
interface TaskCardProps {
  task: TaskResponseWithTags;
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, update: TaskUpdate) => Promise<void>;
  onTag: (taskId: number, tagId: number) => Promise<void>;
  onUntag: (taskId: number, tagId: number) => Promise<void>;
  onSmartTag: (taskId: number) => Promise<TaskResponseWithTags>;
}

// Functional Component
const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onEdit,
  onTag,
  onUntag,
  onSmartTag,
}) => {
  // Controls visibility of the tag selector UI.
  const [showTagSelector, setShowTagSelector] = useState(false);

  // Indicates if the smart tagging process is running (for loading state).
  const [isSmartTagging, setIsSmartTagging] = useState(false);

  // Controls visibility of the Delete UI.
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Toggle Complete Handler
  // Calls the onEdit prop with the updated is_done value.
  const handleToggleComplete = () => {
    onEdit(task.id, { is_done: !task.is_done });
  };

  // Smart Tag Handler
  // Sets loading state, calls the smart tagging function, then resets loading state.
  const handleSmartTag = async () => {
    setIsSmartTagging(true);
    try {
      await onSmartTag(task.id);
    } finally {
      setIsSmartTagging(false);
    }
  };

  // Delete Handler with Modal
  const handleDelete = async () => {
    setShowDeleteModal(false);
    await onDelete(task.id);
  };

  return (
    // Completion Button:
    // Toggles task completion.
    // Visual feedback: green if done, gray if not.
    // Shows a checkmark if completed.
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Button
            onClick={handleToggleComplete}
            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center p-0 ${
              task.is_done
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            aria-label={
              task.is_done ? 'Mark as incomplete' : 'Mark as complete'
            }
            variant="ghost"
            size="sm"
          >
            {task.is_done && <span className="text-xs">✓</span>}
          </Button>

          <div className="flex-1">
            {/* Task Title:
            Clickable, navigates to task detail page.
            Strikethrough and gray if completed, otherwise normal. */}
            <Link
              to={`/tasks/${task.id}`}
              className={`block font-medium hover:text-blue-600 ${
                task.is_done ? 'line-through text-gray-500' : 'text-gray-900'
              }`}
            >
              {task.title}
            </Link>

            {/* Task Description:
                Only shown if present.
                Truncated to two lines for neatness. */}
            {task.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Due Date:
              Only shown if present.
              Formatted as a readable date. */}
            {task.scheduled_for && (
              <p className="text-gray-500 text-xs mt-1">
                Due: {new Date(task.scheduled_for).toLocaleDateString()}
              </p>
            )}

            {/* Tags Display:
              Shows all tags as styled badges.
              Each tag has a remove ("×") button to untag it. */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                  >
                    {tag.tag}
                    <Button
                      onClick={() => onUntag(task.id, tag.id)}
                      className="ml-1 text-blue-600 hover:text-blue-800 p-0 h-auto w-auto"
                      aria-label={`Remove tag ${tag.tag}`}
                      variant="ghost"
                      size="sm"
                    >
                      ×
                    </Button>
                  </span>
                ))}
              </div>
            )}

            {/* Tag Selector:
              Conditionally renders the TagSelector component for adding tags.
              Passes necessary props and a close handler. */}
            {showTagSelector && (
              <div className="mt-3">
                <TagSelector
                  taskId={task.id}
                  currentTags={task.tags}
                  onTag={onTag}
                  onClose={() => setShowTagSelector(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons: */}
        <div className="flex items-center space-x-2">
          {/* Add Tag: Toggles the tag selector. */}
          <Button
            onClick={() => setShowTagSelector(!showTagSelector)}
            className="p-1"
            title="Add tag"
            aria-label="Add tag"
            variant="ghost"
            size="sm"
          >
            🏷️
          </Button>
          {/* Smart Tag: Triggers smart tagging, shows loading state. */}
          <Button
            onClick={handleSmartTag}
            disabled={isSmartTagging}
            className="p-1"
            title="Smart tag"
            aria-label="Smart tag"
            variant="ghost"
            size="sm"
          >
            {isSmartTagging ? (
              <span className="flex items-center">
                <Loading size="sm" text="" center={false} />
              </span>
            ) : (
              '🧠'
            )}
          </Button>
          {/* Delete: Deletes the task, with a red hover for warning. */}
          <Button
            onClick={() => setShowDeleteModal(true)}
            className="p-1 hover:text-red-600"
            title="Delete task"
            aria-label="Delete task"
            variant="ghost"
            size="sm"
          >
            🗑️
          </Button>
        </div>
      </div>
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Task"
        size="sm"
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete this task?</p>
          <div className="flex justify-end space-x-2">
            <Button
              onClick={() => setShowDeleteModal(false)}
              variant="secondary"
              size="sm"
            >
              Cancel
            </Button>
            <Button onClick={handleDelete} variant="danger" size="sm">
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskCard;
