import React, { useState, useEffect } from 'react';
import { useTags } from '../../hooks/useTags';
import { TagResponse } from '../../types/tag';
import Button from '../common/Button';
import Input from '../common/Input';

// TypeScript Interface
// Definition of the expected props for the component.
interface TagSelectorProps {
  taskId: number;
  currentTags: TagResponse[];
  onTag: (taskId: number, tagId: number) => Promise<void>;
  onClose: () => void;
}

// Functional Component
// Receives props as defined above.
// The type `React.FC<TagListProps>` ensures type safety and good editor support.
const TagSelector: React.FC<TagSelectorProps> = ({
  taskId,
  currentTags,
  onTag,
  onClose,
}) => {
  // tags: All available tags (from the custom hook).
  // searchTerm: The current search input value.
  // filteredTags: Tags that match the search and are not already assigned.
  const { tags } = useTags();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState<TagResponse[]>([]);

  //  Filtering Logic
  // - useEffect: Runs whenever tags, currentTags, or searchTerm changes.
  // - currentTagIds: Set of IDs for tags already assigned to the task.
  // - availableTags: Tags not already assigned and matching the search term.
  // - setFilteredTags: Updates the filtered list for display.
  useEffect(() => {
    const currentTagIds = new Set(currentTags.map((tag) => tag.id));
    const availableTags = tags
      .filter((tag) => !currentTagIds.has(tag.id))
      .filter((tag) =>
        tag.tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    setFilteredTags(availableTags);
  }, [tags, currentTags, searchTerm]);

  // Tag Selection Handler
  // When a tag is clicked, adds it to the task and closes the selector.
  const handleTagSelect = async (tagId: number) => {
    await onTag(taskId, tagId);
    onClose();
  };

  // Rendered UI
  return (
    <div className="bg-gray-50 rounded-lg p-3 border">
      {/* Header: Shows "Add Tag" and a close button. */}
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium text-gray-700">Add Tag</h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close tag selector"
          className="!p-1"
        >
          ×
        </Button>
      </div>

      {/* Search Input: Lets the user filter tags by typing. */}
      <Input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2"
        autoFocus
        aria-label="Search tags"
      />

      {/* Tag List:
        - If no tags match, shows a message.
        - Otherwise, shows a button for each tag. Clicking adds the tag to the task. */}
      <div className="max-h-32 overflow-y-auto">
        {filteredTags.length === 0 ? (
          <p className="text-gray-500 text-sm py-2">
            {searchTerm ? 'No matching tags found' : 'No available tags'}
          </p>
        ) : (
          <div className="space-y-1">
            {filteredTags.map((tag) => (
              <Button
                key={tag.id}
                variant="ghost"
                size="sm"
                className="w-full text-left px-2 py-1 hover:bg-blue-100 hover:text-blue-800"
                onClick={() => handleTagSelect(tag.id)}
              >
                #{tag.tag}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSelector;
