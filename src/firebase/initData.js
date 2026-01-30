// Script to initialize Firestore with sample data
// Run this once to set up your database

import { db } from './config.js';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const sampleOrder = {
  id: 'AS3-26',
  hotelName: 'hotel A',
  serviceCharge: 50,
  gst: 30,
  createdAt: serverTimestamp(),
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
};

export async function initializeFirestore() {
  try {
    const orderRef = doc(db, 'orders', 'AS3-26');
    await setDoc(orderRef, sampleOrder);
    console.log('✅ Sample order created successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error creating sample order:', error);
    return false;
  }
}

// Export sample data for reference
export { sampleOrder };
