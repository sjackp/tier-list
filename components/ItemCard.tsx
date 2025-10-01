
import React, { forwardRef } from 'react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  isDragging?: boolean;
  [key: string]: any;
}

const ItemCard = forwardRef<HTMLDivElement, ItemCardProps>(({ item, isDragging, ...props }, ref) => {
  const style = `
    p-2.5 
    bg-neutral-700 
    text-white 
    rounded-md 
    shadow-sm 
    cursor-grab 
    hover:bg-neutral-600 
    transition-colors 
    duration-150 
    touch-none
    select-none
    min-w-[150px]
    text-center
    font-medium
    ${isDragging ? 'ring-2 ring-neutral-500 shadow-xl opacity-80 rotate-3' : 'shadow-md'}
  `;

  return (
    <div ref={ref} {...props} className={style}>
      {item.content}
    </div>
  );
});

export default ItemCard;
