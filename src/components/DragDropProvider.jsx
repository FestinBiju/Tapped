import { createContext, useContext, useState, useRef, useCallback } from 'react';

const DragDropContext = createContext();

export function DragDropProvider({ children }) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const dropZonesRef = useRef(new Map());

  const registerDropZone = useCallback((id, element, onDrop) => {
    dropZonesRef.current.set(id, { element, onDrop });
    return () => {
      dropZonesRef.current.delete(id);
    };
  }, []);

  const handleDragStart = useCallback((item) => {
    setDraggedItem(item);
  }, []);

  const handleDrag = useCallback((point) => {
    if (!draggedItem) return;

    // Check if drag position is over any drop zone
    let foundTarget = null;
    dropZonesRef.current.forEach((zone, id) => {
      if (zone.element) {
        const rect = zone.element.getBoundingClientRect();
        if (
          point.x >= rect.left &&
          point.x <= rect.right &&
          point.y >= rect.top &&
          point.y <= rect.bottom
        ) {
          foundTarget = id;
        }
      }
    });

    setDropTarget(foundTarget);
  }, [draggedItem]);

  const handleDragEnd = useCallback(() => {
    if (draggedItem && dropTarget) {
      const zone = dropZonesRef.current.get(dropTarget);
      if (zone && zone.onDrop) {
        zone.onDrop(draggedItem);
      }
    }
    setDraggedItem(null);
    setDropTarget(null);
  }, [draggedItem, dropTarget]);

  return (
    <DragDropContext.Provider value={{
      draggedItem,
      dropTarget,
      registerDropZone,
      handleDragStart,
      handleDrag,
      handleDragEnd,
    }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}
