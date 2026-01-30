import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  arrayUnion, 
  arrayRemove 
} from 'firebase/firestore';

export function useFirestoreOrder(orderId) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const orderRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(
      orderRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setOrder({ id: snapshot.id, ...snapshot.data() });
        } else {
          setOrder(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching order:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  // Assign item to user
  const assignItemToUser = useCallback(async (itemId, userId) => {
    if (!orderId) return;

    try {
      const orderRef = doc(db, 'orders', orderId);
      
      // Check if item already assigned to this user
      const item = order?.items?.find(i => i.id === itemId);
      const isAssigned = item?.assignedTo?.includes(userId);

      if (isAssigned) {
        // Remove assignment
        await updateDoc(orderRef, {
          [`items.${itemId}.assignedTo`]: arrayRemove(userId)
        });
      } else {
        // Add assignment
        await updateDoc(orderRef, {
          [`items.${itemId}.assignedTo`]: arrayUnion(userId)
        });
      }
    } catch (err) {
      console.error('Error assigning item:', err);
      setError(err);
    }
  }, [orderId, order]);

  // Add new user
  const addUser = useCallback(async (userData) => {
    if (!orderId) return;

    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        users: arrayUnion(userData)
      });
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err);
    }
  }, [orderId]);

  return {
    order,
    loading,
    error,
    assignItemToUser,
    addUser,
  };
}
