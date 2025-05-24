import React, { useState } from 'react';
import { TaskCreate } from '../../types/task';
import Input from '../common/Input';
import Textarea from '../common/Textarea';
import Button from '../common/Button';

// Props Interface:
// initialData: Optional. Used to pre-fill the form (for editing or defaults).
// onSubmit: Function called when the form is submitted, receives the task data.
// onCancel: Function called when the user cancels the form.
interface TaskFormProps {
  initialData?: Partial<TaskCreate>;
  onSubmit: (task: TaskCreate) => Promise<void>;
  onCancel: () => void;
}

// Functional Component
// Receives props as defined above.
// The type `React.FC<TaskFormProps>` ensures type safety and good editor support.
const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  // State Variables:
  // title, description, isDone, scheduledFor: Hold the current values of the form fields. Initialized from initialData if provided.
  // isSubmitting: Tracks if the form is currently submitting (to disable the button and show feedback).
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isDone, setIsDone] = useState(initialData?.is_done || false);
  const [scheduledFor, setScheduledFor] = useState(
    initialData?.scheduled_for ? initialData.scheduled_for.split('T')[0] : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Submission Handler:
  // Prevents the default form submission (page reload).
  // Ignores submission if the title is empty.
  // Sets isSubmitting to true to indicate loading.
  // Calls onSubmit with the form data (trimming whitespace, converting empty fields to null).
  // Always resets isSubmitting to false after submission (even if there’s an error).
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        is_done: isDone,
        scheduled_for: scheduledFor || null
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title Input:
        Controlled input (value comes from state).
        Updates title state on change.
        Marked as required. */}
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        required
      />
      
      {/* Description Input:
      Controlled textarea for optional description. */}
      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Enter task description"
        rows={3}
      />
      
      {/* Scheduled Date Input:
      - Controlled date input for scheduling the task.
      UI Element:
      - The browser renders a date picker input field.
      - On most modern browsers, this appears as a text box with a calendar icon.
      - When the user clicks the input or the calendar icon, a calendar popup appears.
      - The user can select a date from the calendar, or type a date in the format YYYY-MM-DD.*/}
      <Input
        type="date"
        label="Scheduled For"
        value={scheduledFor}
        onChange={(e) => setScheduledFor(e.target.value)}
      />  
      
      {/* Completed Checkbox:
      Lets the user mark the task as done. */}
      <div className="flex items-center">
        <Input
          type="checkbox"
          id="isDone"
          checked={isDone}
          onChange={(e) => setIsDone(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isDone" className="ml-2 block text-sm text-gray-700">
          Mark as completed
        </label>
      </div>
      
      {/* Action Buttons: */}
      <div className="flex justify-end space-x-3 pt-4">
        {/* Cancel: Calls onCancel when clicked. */}
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        {/* Save Task: Submits the form. Disabled if submitting or title is empty. Shows loading text if submitting. */}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={isSubmitting || !title.trim()}
        >
          Save Task
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;