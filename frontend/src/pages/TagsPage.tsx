import React, { useState } from 'react';
import { useTags } from '../hooks/useTags';
import TagForm from '../components/tags/TagForm';
import TagList from '../components/tags/TagList';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Modal from '../components/common/Modal';

// Functional Component
const TagsPage: React.FC = () => {
  // Uses the useTags hook to get all task data and actions.
  const { tags, loading, error, createTag, deleteTag, editTag } = useTags();
  // showForm controls whether the tag creation form is visible.
  const [showForm, setShowForm] = useState(false);

  // Error Handling:
  // If there’s an error (e.g., failed to fetch tags), display a user-friendly error message.
  // Early return pattern keeps the main render logic clean.
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Add Button:
          - Displays the page title.
          - Shows an "Add Tag" button. Clicking toggles the form visibility (showForm).
          - Button text changes to "Cancel" if the form is open. */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Tags</h1>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Tag'}
        </Button>
      </div>
        {/* Tag Creation Form:
        - If showForm is true, display the TagForm inside a styled container.
        - onSubmit: When the form is submitted, call createTag (from the hook) and then hide the form.
        - onCancel: Hides the form if the user cancels. */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="Add Tag"
        size="sm"
      >
        <TagForm
          onSubmit={async (tagData) => {
            await createTag(tagData);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      {/* Tag List or Loading State:
      - If loading is true, show a loading message.
      - Otherwise, render the TagList component, passing the tags and handlers for deleting or editing tags. */}
      {loading ? (
        <Loading text="Loading tags..." />
      ) : (
        <TagList
          tags={tags}
          onDelete={deleteTag}
          onEdit={editTag}
        />
      )}
    </div>
  );
};

export default TagsPage;