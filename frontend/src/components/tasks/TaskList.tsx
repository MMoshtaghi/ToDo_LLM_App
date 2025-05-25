import React from 'react';
import { TaskResponseWithTags, TaskUpdate } from '../../types/task';
import TaskCard from './TaskCard';

// TypeScript Interface
// Definition of the expected props for the component.
interface TaskListProps {
  tasks: TaskResponseWithTags[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, update: TaskUpdate) => Promise<void>;
  onTag: (taskId: number, tagId: number) => Promise<void>;
  onUntag: (taskId: number, tagId: number) => Promise<void>;
  onSmartTag: (taskId: number) => Promise<TaskResponseWithTags>;
}

// Functional Component
// Receives props as defined above.
// The type `React.FC<TaskListProps>` ensures type safety and good editor support.
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onDelete,
  onEdit,
  onTag,
  onUntag,
  onSmartTag,
}) => {
  // Empty State Handling
  // - If there are no tasks, show a friendly message.
  // - This is a best practice for user experience (UX).
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tasks found</p>
        <p className="text-gray-400 text-sm">
          Create your first task to get started!
        </p>
      </div>
    );
  }

  // Rendering the Task List
  // - If there are tasks, render a list of `TaskCard` components.
  //   - `.map()` iterates over each task and renders a `TaskCard` for it.
  // - `key={task.id}` is a React best practice for lists to help React track items.
  // - All handler functions are passed down to each `TaskCard` for interaction.
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
          onEdit={onEdit}
          onTag={onTag}
          onUntag={onUntag}
          onSmartTag={onSmartTag}
        />
      ))}
    </div>
  );
};

export default TaskList;
