
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ItemCard from './ItemCard';
import { Item } from '../types';

interface SortableItemCardProps {
  item: Item;
}

const SortableItemCard: React.FC<SortableItemCardProps> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <ItemCard
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      item={item}
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableItemCard;
