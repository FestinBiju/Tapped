import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useFirestoreOrder } from '../hooks/useFirestoreOrder';

const OrderContext = createContext();

// Fallback sample data (used when Firestore is not available)
const fallbackOrder = {
  id: 'AS3-26',
  hotelName: 'hotel A',
  items: [
    { id: '1', name: 'Margharita Pizza', qty: 1, price: 450, assignedTo: [] },
    { id: '2', name: 'Truffle Fries', qty: 2, price: 280, assignedTo: [] },
    { id: '3', name: 'Shawarma', qty: 1, price: 120, assignedTo: [] },
    { id: '4', name: 'Loaded Fries', qty: 1, price: 150, assignedTo: [] },
    { id: '5', name: 'Sharing Platter', qty: 1, price: 950, assignedTo: [] },
    { id: '6', name: 'Coca cola L', qty: 1, price: 90, assignedTo: [] },
    { id: '7', name: 'Chicken Biriyani', qty: 1, price: 140, assignedTo: [] },
  ],
  users: [
    { id: 'user1', initials: 'FB', color: '#E53935', name: 'Festin' },
    { id: 'user2', initials: 'DN', color: '#7CB342', name: 'Dan' },
    { id: 'user3', initials: 'AB', color: '#1E88E5', name: 'Abe' },
  ],
  serviceCharge: 50,
  gst: 30,
};

export function OrderProvider({ children }) {
  // Try to use Firestore, fallback to local state
  const orderId = 'AS3-26'; // Could be dynamic based on URL params
  const { 
    order: firestoreOrder, 
    loading, 
    error,
    assignItemToUser: firestoreAssign,
    addUser: firestoreAddUser,
  } = useFirestoreOrder(orderId);

  // Local state fallback
  const [localOrder, setLocalOrder] = useState(fallbackOrder);
  const [currentUserId, setCurrentUserId] = useState('user1');
  const [view, setView] = useState('order'); // 'order' or 'checkout'

  // Use Firestore order if available, otherwise use local
  const order = firestoreOrder || localOrder;
  const useFirestore = !!firestoreOrder && !error;

  // Assign an item to a user
  const assignItemToUser = useCallback((itemId, userId) => {
    if (useFirestore) {
      firestoreAssign(itemId, userId);
    } else {
      // Local fallback
      setLocalOrder(prev => ({
        ...prev,
        items: prev.items.map(item => {
          if (item.id === itemId) {
            const isAssigned = item.assignedTo.includes(userId);
            return {
              ...item,
              assignedTo: isAssigned
                ? item.assignedTo.filter(id => id !== userId)
                : [...item.assignedTo, userId]
            };
          }
          return item;
        })
      }));
    }
  }, [useFirestore, firestoreAssign]);

  // Add a new user
  const addUser = useCallback((initials, color, name) => {
    const newUser = {
      id: `user${Date.now()}`,
      initials,
      color,
      name: name || initials,
    };
    
    if (useFirestore) {
      firestoreAddUser(newUser);
    } else {
      setLocalOrder(prev => ({
        ...prev,
        users: [...prev.users, newUser],
      }));
    }
  }, [useFirestore, firestoreAddUser]);

  // Calculate share for a specific user
  const calculateUserShare = useCallback((userId) => {
    if (!order) return { items: [], subtotal: 0, serviceCharge: 0, gst: 0, total: 0 };
    
    const userItems = order.items.filter(item => 
      item.assignedTo?.includes(userId)
    );
    
    const subtotal = userItems.reduce((sum, item) => {
      // Split price among all assigned users
      const shareCount = item.assignedTo?.length || 1;
      return sum + (item.price / shareCount);
    }, 0);

    // Calculate proportional charges
    const totalBill = order.items.reduce((sum, item) => sum + item.price, 0);
    const proportion = totalBill > 0 ? subtotal / totalBill : 0;
    const serviceShare = (order.serviceCharge || 0) * proportion;
    const gstShare = (order.gst || 0) * proportion;

    return {
      items: userItems.map(item => ({
        ...item,
        sharedPrice: item.price / (item.assignedTo?.length || 1)
      })),
      subtotal,
      serviceCharge: serviceShare,
      gst: gstShare,
      total: subtotal + serviceShare + gstShare,
    };
  }, [order]);

  // Get current user
  const currentUser = order?.users?.find(u => u.id === currentUserId);

  return (
    <OrderContext.Provider value={{
      order,
      loading,
      error,
      useFirestore,
      currentUserId,
      currentUser,
      setCurrentUserId,
      assignItemToUser,
      addUser,
      calculateUserShare,
      view,
      setView,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
