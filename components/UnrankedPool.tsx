
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { Item } from '../types';
import SortableItemCard from './SortableItemCard';

interface UnrankedPoolProps {
  id: string;
  items: Item[];
  years: number[];
  selectedYear: number | 'all';
  onYearChange: (year: number | 'all') => void;
}

const UnrankedPool: React.FC<UnrankedPoolProps> = ({ id, items, years, selectedYear, onYearChange }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div className="mt-8">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-300 border-b-2 border-gray-700 pb-2">Unranked Tracks</h2>
        <div className="flex justify-center mb-4">
          <label className="text-gray-300 mr-3 self-center">Year:</label>
          <select 
            value={selectedYear as any} 
            onChange={e => onYearChange(e.target.value === 'all' ? 'all' : Number(e.target.value))} 
            className="bg-gray-800 text-white p-2 rounded border border-gray-600"
          >
            <option value="all">All</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
            <div
            ref={setNodeRef}
            className="bg-neutral-800 rounded-lg p-4 min-h-[120px] shadow-inner"
            >
                <div className="flex flex-wrap gap-3 justify-center">
                    {items.length > 0 ? (
                    items.map(item => <SortableItemCard key={item.id} item={item} />)
                    ) : (
                    <div className="flex items-center justify-center h-24 text-gray-500 italic">
                        All tracks have been ranked!
                    </div>
                    )}
                </div>
            </div>
      </SortableContext>
    </div>
  );
};

export default UnrankedPool;
