import React from 'react';
import { TagResponseWithTasks, TagUpdate } from '../../types/tag';
import TagCard from './TagCard';

// TypeScript Interface
// Definition of the expected props for the component.
interface TagListProps {
  tags: TagResponseWithTasks[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, update: TagUpdate) => Promise<void>;
}

// Functional Component
// Receives props as defined above.
// The type `React.FC<TagListProps>` ensures type safety and good editor support.
const TagList: React.FC<TagListProps> = ({ tags, onDelete, onEdit }) => {
  // Empty State Handling
  // - If there are no tags, show a friendly message.
  // - This is a best practice for user experience (UX).
    if (tags.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No tags found</p>
        <p className="text-gray-400 text-sm">Create your first tag to get started!</p>
      </div>
    );
  }
    
    // Rendering the Tag List
    // - If there are tags, render a list of `TagCard` components.
    //   - `.map()` iterates over each tag and renders a `TagCard` for it.
    // - `key={tag.id}` is a React best practice for lists to help React track items.
    // - All handler functions are passed down to each `TagCard` for interaction.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tags.map(tag => (
        <TagCard
          key={tag.id}
          tag={tag}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TagList;