
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Item } from '../types';
import SortableItemCard from './SortableItemCard';

interface TierProps {
  id: string;
  name: string;
  color: string;
  items: Item[];
}

const Tier: React.FC<TierProps> = ({ id, name, color, items }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="flex flex-col sm:flex-row min-h-[100px] bg-neutral-800 rounded-lg shadow-md overflow-hidden">
    <div className={`flex-shrink-0 w-full sm:w-32 flex items-center justify-center p-4 text-white font-bold text-2xl ${color}`}>
        {name.split(' ')[0]}
      </div>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className="flex-grow p-4 bg-neutral-800/50 min-h-[80px]">
          <div className="flex flex-wrap gap-2">
            {items.length > 0 ? (
              items.map(item => <SortableItemCard key={item.id} item={item} />)
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 italic">
                Drop items here
              </div>
            )}
          </div>
        </div>
      </SortableContext>
    </div>
  );
};

export default Tier;
