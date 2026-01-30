import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useFirestoreOrder } from '../hooks/useFirestoreOrder';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

const COLORS = ['#E53935', '#7CB342', '#1E88E5', '#FB8C00', '#5E35B1', '#00897B', '#C62828', '#F57C00'];

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
  users: [],
  serviceCharge: 50,
  gst: 30,
};

export function OrderProvider({ children }) {
  // Get authenticated user
  const { user, getUserInfo } = useAuth();
  
  // Try to use Firestore, fallback to local state
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('bill') || 'AS3-26'; // Could be dynamic based on URL params
  const { 
    order: firestoreOrder, 
    loading, 
    error,
    assignItemToUser: firestoreAssign,
    addUser: firestoreAddUser,
    removeUser: firestoreRemoveUser,
  } = useFirestoreOrder(orderId);

  // Local state fallback
  const [localOrder, setLocalOrder] = useState(fallbackOrder);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [view, setView] = useState('order'); // 'order', 'checkout', or 'users'
  
  // Track if we've added the auth user already
  const hasAddedAuthUser = useRef(false);

  // Use Firestore order if available, otherwise use local
  const order = firestoreOrder || localOrder;
  const useFirestore = !!firestoreOrder && !error;

  // Auto-add authenticated user to the bill
  useEffect(() => {
    // Wait until we have user info and order is loaded (not loading)
    if (!user || loading) {
      console.log('Waiting for user/order - user:', !!user, 'loading:', loading);
      return;
    }
    
    const userInfo = getUserInfo();
    if (!userInfo) {
      console.log('No userInfo available');
      return;
    }

    // Need order to be available
    if (!order) {
      console.log('Order not available yet');
      return;
    }

    // Check if user already exists in the order
    const users = order.users || [];
    const existingUser = users.find(u => u.id === userInfo.uid);
    
    console.log('Checking user in order:', {
      uid: userInfo.uid,
      existingUser: !!existingUser,
      hasAddedAuthUser: hasAddedAuthUser.current,
      useFirestore,
      usersCount: users.length,
    });
    
    if (!existingUser && !hasAddedAuthUser.current) {
      // Add the authenticated user to the bill
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
      const newUser = {
        id: userInfo.uid,
        initials: userInfo.initials,
        color: randomColor,
        name: userInfo.name,
        photoURL: userInfo.photoURL || null,
      };
      
      console.log('Adding authenticated user to bill:', newUser);
      hasAddedAuthUser.current = true; // Set immediately to prevent double-add
      
      if (useFirestore && firestoreOrder) {
        console.log('Adding via Firestore');
        firestoreAddUser(newUser);
      } else {
        console.log('Adding to local order');
        setLocalOrder(prev => ({
          ...prev,
          users: [...prev.users, newUser],
        }));
      }
      setCurrentUserId(userInfo.uid);
    } else if (existingUser && !currentUserId) {
      // User already exists, just set as current
      console.log('User already exists, setting as current:', existingUser.id);
      setCurrentUserId(existingUser.id);
      hasAddedAuthUser.current = true;
    }
  }, [user, loading, order, firestoreOrder, useFirestore, firestoreAddUser, getUserInfo, currentUserId]);

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

  // Delete a user
  const deleteUser = useCallback((userId) => {
    if (useFirestore) {
      firestoreRemoveUser(userId);
    } else {
      setLocalOrder(prev => {
        const newUsers = prev.users.filter(user => user.id !== userId);
        const newLocalOrder = {
          ...prev,
          users: newUsers,
          items: prev.items.map(item => ({
            ...item,
            assignedTo: item.assignedTo.filter(id => id !== userId)
          }))
        };
        // If deleted user is current, switch to first remaining user
        if (currentUserId === userId && newUsers.length > 0) {
          setCurrentUserId(newUsers[0].id);
        }
        return newLocalOrder;
      });
    }
  }, [useFirestore, firestoreRemoveUser, currentUserId]);

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
      deleteUser,
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
