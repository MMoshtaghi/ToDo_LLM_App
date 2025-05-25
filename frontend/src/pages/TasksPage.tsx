import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { usePagination } from '../hooks/usePagination';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import TaskFilters from '../components/tasks/TaskFilters';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';

// Functional Component
const TasksPage: React.FC = () => {
  // Uses the useTasks hook to get all task data and actions.
  const {
    tasks,
    loading,
    error,
    errorContext,
    clearError,
    createTask,
    deleteTask,
    editTask,
    tagTask,
    untagTask,
    smartTag,
  } = useTasks();

  // showForm controls whether the task creation form is visible.
  const [showForm, setShowForm] = useState(false);

  // filter manages which tasks are shown (all, pending, or completed).
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'pending') return !task.is_done;
    if (filter === 'completed') return task.is_done;
    return true;
  });

  // Pagination Hook
  const {
    page,
    limit,
    // setPage,
    setLimit,
    nextPage,
    prevPage,
    maxPage,
    offset,
    // resetPage,
  } = usePagination(0, 10, filteredTasks.length);

  // CLient-side Paginated tasks for current page
  const paginatedTasks = filteredTasks.slice(offset, offset + limit);

  // Reset page when filter changes
  // useEffect(() => {
  //   resetPage();
  // }, [filter, resetPage]);

  // Error Handling:
  // If there’s an error (e.g., failed to fetch tasks), display a user-friendly error message.
  // Early return pattern keeps the main render logic clean.
  if (error && errorContext === 'fetch') {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Modal for non-fetch errors */}
      <Modal
        isOpen={!!error && errorContext !== 'fetch'}
        onClose={clearError}
        title="Error"
      >
        <p className="text-red-600">{error}</p>
      </Modal>

      {/* Header and Add Task Button:
        Displays the page title.
        Button toggles the visibility of the task creation form.
        Button text changes based on showForm state. */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <Button
          variant={showForm ? 'secondary' : 'primary'}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </Button>
      </div>

      {/* Task Creation Form:
        Conditionally renders the TaskForm component if showForm is true.
        On submit, calls createTask and hides the form.
        On cancel, simply hides the form. */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <TaskForm
            onSubmit={async (taskData) => {
              await createTask(taskData);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Task Filters:
      Renders filter controls.
      currentFilter and onFilterChange manage the filter state. */}
      <TaskFilters currentFilter={filter} onFilterChange={setFilter} />

      {/* Loading State and Task List:
      If loading, show a loading message.
      Otherwise, render the TaskList component with all necessary handlers and the filtered tasks. */}
      {loading ? (
        <Loading text="Loading tasks..." />
      ) : (
        <>
          <TaskList
            tasks={paginatedTasks}
            onDelete={deleteTask}
            onEdit={editTask}
            onTag={tagTask}
            onUntag={untagTask}
            onSmartTag={smartTag}
          />

          {/* Pagination Controls */}
          {filteredTasks.length > limit && (
            <div className="flex justify-center items-center mt-4 space-x-4">
              <Button
                variant="secondary"
                disabled={page === 0}
                onClick={prevPage}
              >
                Previous
              </Button>
              <span>
                Page {page + 1} of {maxPage + 1}
              </span>
              <Button
                variant="secondary"
                disabled={page === maxPage}
                onClick={nextPage}
              >
                Next
              </Button>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="ml-4 border rounded px-2 py-1"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size} per page
                  </option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TasksPage;
