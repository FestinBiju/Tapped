import { collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const seedDummyBill = async () => {
  try {
    const billId = "AS3-26"; // Consistent ID for your QR code
    const billRef = doc(db, "bills", billId);

    const dummyData = {
      hotelName: "hotel A",
      serviceCharge: 50,
      gst: 30,
      createdAt: Timestamp.now(),
      status: "active",
      items: [
        { id: "item1", name: "Margherita Pizza", qty: 1, price: 450, assignedTo: [] },
        { id: "item2", name: "Truffle Fries", qty: 2, price: 280, assignedTo: [] },
        { id: "item3", name: "Shawarma", qty: 1, price: 120, assignedTo: [] },
        { id: "item4", name: "Loaded Fries", qty: 1, price: 150, assignedTo: [] },
        { id: "item5", name: "Sharing Platter", qty: 1, price: 950, assignedTo: [] },
        { id: "item6", name: "Coca Cola L", qty: 1, price: 90, assignedTo: [] },
        { id: "item7", name: "Chicken Biriyani", qty: 1, price: 140, assignedTo: [] }
      ],
      participants: [
        { uid: "userA", initials: "FB", color: "#E53935", name: "First User" },
        { uid: "userB", initials: "DN", color: "#7CB342", name: "Second User" },
        { uid: "userC", initials: "AB", color: "#1E88E5", name: "Third User" }
      ]
    };

    // Use setDoc so it overwrites/resets the specific ID every time
    await setDoc(billRef, dummyData);
    console.log(`✅ Successfully seeded Bill ID: ${billId}`);
    process.exit(0);
  } catch (e) {
    console.error("❌ Error seeding document: ", e);
    process.exit(1);
  }
};

seedDummyBill();
