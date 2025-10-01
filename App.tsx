
import React, { useEffect, useState } from 'react';
// FIX: Add UniqueIdentifier for better type safety with dnd-kit
import { DndContext, DragEndEvent, DragOverlay, PointerSensor, useSensor, useSensors, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TIERS, INITIAL_ITEMS } from './constants';
import { TierId, TiersData } from './types';
import Tier from './components/Tier';
import ItemCard from './components/ItemCard';
import UnrankedPool from './components/UnrankedPool';

function App() {
  const [tiersData, setTiersData] = useState<TiersData>(() => {
    // FIX: Initializing with only 'unranked' was causing a type error because 'S', 'A', 'B', 'C', 'D' were missing.
    // This approach correctly initializes all tiers (now includes F).
    const initialData = {} as TiersData;
    Object.keys(TIERS).forEach(tierId => {
      initialData[tierId as TierId] = [];
    });
    initialData.unranked = INITIAL_ITEMS;
    return initialData;
  });
  
  const [activeId, setActiveId] = useState<string | null>(null);
  const [years, setYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

  // Fetch available years on mount
  useEffect(() => {
    fetch('https://guyj-tier-backend.onrender.com/years')
      .then(res => res.json())
      .then(data => setYears(data))
      .catch(() => setYears([]));
  }, []);

  // Fetch tracks when selectedYear changes
  useEffect(() => {
    const q = selectedYear === 'all' ? '' : `?year=${selectedYear}`;
    fetch(`https://guyj-tier-backend.onrender.com/tracks${q}`)
      .then(res => res.json())
    .then((rows: any[]) => {
      setTiersData(prev => {
        const newData = { ...prev };
        const fetchedItems = rows.map(r => ({ id: String(r.id), content: r.content, link: r.link || null, notes: r.notes || null, year: r.year || null }));
        const fetchedIds = new Set(fetchedItems.map(i => i.id));

        // Ensure ranked tiers only contain items that exist in the DB and remove duplicates across tiers.
        const seen = new Set<string>();
        Object.keys(TIERS).forEach(tid => {
          const tierKey = tid as TierId;
          const prevItems = newData[tierKey] || [];
          const filtered: typeof prevItems = [];
          prevItems.forEach(it => {
            if (fetchedIds.has(it.id) && !seen.has(it.id)) {
              filtered.push(it);
              seen.add(it.id);
            }
          });
          newData[tierKey] = filtered;
        });

        // Any fetched item not already placed becomes unranked
        newData.unranked = fetchedItems.filter(i => !seen.has(i.id));
        return newData;
      });
    })
      .catch(() => {
        // leave unranked empty on error
      });
  }, [selectedYear]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // FIX: Changed 'id' parameter type to UniqueIdentifier for compatibility with dnd-kit IDs.
  const findContainer = (id: UniqueIdentifier) => {
    const stringId = String(id);
    if (stringId in tiersData) {
      return stringId;
    }
    return Object.keys(tiersData).find(key => tiersData[key as TierId].some(item => item.id === stringId));
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;
    if (active.id === over.id) return;

    // FIX: Pass UniqueIdentifier from 'active' and 'over' objects directly to findContainer.
    // This resolves the error "Property 'id' does not exist on type 'unknown'".
    const originalContainerId = findContainer(active.id) as TierId;
    const destinationContainerId = findContainer(over.id) as TierId;

    if (!originalContainerId || !destinationContainerId) return;

    const activeItem = tiersData[originalContainerId].find(item => item.id === String(active.id));
    if (!activeItem) return;

    setTiersData(prev => {
        const newTiersData = { ...prev };
        const originalItems = [...newTiersData[originalContainerId]];
        const destinationItems = [...newTiersData[destinationContainerId]];

        const activeIndex = originalItems.findIndex(item => item.id === String(active.id));
        const overIndex = destinationItems.findIndex(item => item.id === String(over.id));

        if (originalContainerId === destinationContainerId) {
            // Reordering within the same container
            if (activeIndex !== -1 && overIndex !== -1) {
                newTiersData[originalContainerId] = arrayMove(originalItems, activeIndex, overIndex);
            }
        } else {
            // Moving to a different container
            newTiersData[originalContainerId] = originalItems.filter(item => item.id !== String(active.id));

            // If dropping on another item, insert before it. Otherwise, add to the end.
            if (overIndex !== -1) {
                 destinationItems.splice(overIndex, 0, activeItem);
                 newTiersData[destinationContainerId] = destinationItems;
            } else {
                 newTiersData[destinationContainerId] = [...destinationItems, activeItem];
            }
        }
        return newTiersData;
    });
  };

  const activeItem = activeId ? Object.values(tiersData).flat().find(item => item.id === activeId) : null;

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-4 sm:p-8 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">Guy J ID Tier List</h1>
        <p className="text-gray-400 mt-2">Drag and drop to rank your favorite tracks.</p>
      </header>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <main className="max-w-7xl mx-auto flex flex-col gap-4">
          {Object.entries(TIERS).map(([tierId, tierInfo]) => (
            <Tier
              key={tierId}
              id={tierId}
              name={tierInfo.name}
              color={tierInfo.color}
              items={tiersData[tierId as TierId]}
            />
          ))}
          <UnrankedPool 
            id="unranked" 
            items={tiersData.unranked}
            years={years}
            selectedYear={selectedYear}
            onYearChange={setSelectedYear}
          />
        </main>
        <DragOverlay>
            {activeItem ? <ItemCard item={activeItem} isDragging /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

export default App;
