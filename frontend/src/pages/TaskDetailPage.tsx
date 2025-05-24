import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { TaskResponseWithTags } from '../types/task';
import TaskForm from '../components/tasks/TaskForm';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks, editTask, deleteTask } = useTasks();
  const [task, setTask] = useState<TaskResponseWithTags | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    if (id) {
      const foundTask = tasks.find(t => t.id === parseInt(id));
      setTask(foundTask || null);
    }
  }, [id, tasks]);

  if (!task) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Task not found</p>
        <Button
          variant="primary"
          onClick={() => navigate('/tasks')}
          className="mt-4"
        >
          Back to Tasks
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    setLoadingDelete(true);
    await deleteTask(task.id);
    setLoadingDelete(false);
    setShowDeleteModal(false);
    navigate('/tasks');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tasks')}
          >
            ← Back to Tasks
          </Button>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Task"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={loadingDelete}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                loading={loadingDelete}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>

        {isEditing ? (
          <TaskForm
            initialData={{
              title: task.title,
              description: task.description,
              is_done: task.is_done,
              scheduled_for: task.scheduled_for
            }}
            onSubmit={async (data) => {
              await editTask(task.id, data);
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <span className={`inline-block w-3 h-3 rounded-full ${task.is_done ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            </div>

            {task.description && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
              </div>
            )}

            {task.scheduled_for && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Scheduled For</h3>
                <p className="text-gray-600">{new Date(task.scheduled_for).toLocaleDateString()}</p>
              </div>
            )}

            {task.tags && task.tags.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {task.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag.tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-500">
                Created: {new Date(task.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;