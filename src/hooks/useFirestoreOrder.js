import { useState, useEffect, useCallback } from 'react';
import { db } from '../firebase';
import { 
  doc, 
  onSnapshot, 
  updateDoc,
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

    // Use 'bills' collection to match seedData.js
    const billRef = doc(db, 'bills', orderId);
    
    const unsubscribe = onSnapshot(
      billRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          // Transform Firestore data to match app structure
          setOrder({ 
            id: snapshot.id, 
            hotelName: data.hotelName,
            items: data.items || [],
            // Map 'participants' from Firestore to 'users' in app
            // Also map 'uid' to 'id' for compatibility
            users: (data.participants || []).map(p => ({
              id: p.uid,
              initials: p.initials,
              color: p.color,
              name: p.name,
            })),
            serviceCharge: data.serviceCharge || 0,
            gst: data.gst || 0,
            status: data.status,
          });
          setError(null);
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

  // Assign item to user (toggle assignment)
  const assignItemToUser = useCallback(async (itemId, userId) => {
    if (!orderId || !order) return;

    try {
      // Use 'bills' collection
      const billRef = doc(db, 'bills', orderId);
      
      // Find the item and toggle assignment
      const updatedItems = order.items.map(item => {
        if (item.id === itemId) {
          const currentAssigned = item.assignedTo || [];
          const isAssigned = currentAssigned.includes(userId);
          return {
            ...item,
            assignedTo: isAssigned
              ? currentAssigned.filter(id => id !== userId)
              : [...currentAssigned, userId]
          };
        }
        return item;
      });

      await updateDoc(billRef, { items: updatedItems });
    } catch (err) {
      console.error('Error assigning item:', err);
      setError(err);
    }
  }, [orderId, order]);

  // Add new user
  const addUser = useCallback(async (userData) => {
    if (!orderId || !order) return;

    try {
      const billRef = doc(db, 'bills', orderId);
      
      // Transform to Firestore format (uid instead of id)
      const newParticipant = {
        uid: userData.id,
        initials: userData.initials,
        color: userData.color,
        name: userData.name,
      };

      // Get current participants and add new one
      const currentParticipants = order.users.map(u => ({
        uid: u.id,
        initials: u.initials,
        color: u.color,
        name: u.name,
      }));

      await updateDoc(billRef, { 
        participants: [...currentParticipants, newParticipant] 
      });
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err);
    }
  }, [orderId, order]);

  // Remove user
  const removeUser = useCallback(async (userId) => {
    if (!orderId || !order) return;

    try {
      const billRef = doc(db, 'bills', orderId);
      
      // Remove user from participants array
      const updatedParticipants = order.users
        .filter(u => u.id !== userId)
        .map(u => ({
          uid: u.id,
          initials: u.initials,
          color: u.color,
          name: u.name,
        }));
      
      // Remove user from all item assignments
      const updatedItems = order.items.map(item => ({
        ...item,
        assignedTo: (item.assignedTo || []).filter(id => id !== userId)
      }));

      await updateDoc(billRef, { 
        participants: updatedParticipants,
        items: updatedItems 
      });
    } catch (err) {
      console.error('Error removing user:', err);
      setError(err);
    }
  }, [orderId, order]);

  return {
    order,
    loading,
    error,
    assignItemToUser,
    addUser,
    removeUser,
  };
}
