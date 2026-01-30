import { doc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebaseConfig.js";

// Preset bills for different restaurants/scenarios
const presetBills = [
  {
    id: "AS3-26",
    hotelName: "Iceburg Kochi",
    serviceCharge: 50,
    gst: 30,
    items: [
      { id: "item1", name: "Kuzhi Mandhi", qty: 2, price: 230, assignedTo: [] },
      { id: "item2", name: "Truffle Fries", qty: 2, price: 280, assignedTo: [] },
      { id: "item3", name: "Shawarma", qty: 1, price: 120, assignedTo: [] },
      { id: "item4", name: "Loaded Fries", qty: 1, price: 150, assignedTo: [] },
      { id: "item5", name: "Sharing Platter", qty: 1, price: 950, assignedTo: [] },
      { id: "item6", name: "Coca Cola L", qty: 1, price: 90, assignedTo: [] },
      { id: "item7", name: "Chicken Biriyani", qty: 1, price: 140, assignedTo: [] }
    ],
    participants: []
  },
  {
    id: "PZ1-42",
    hotelName: "Pizza Hub",
    serviceCharge: 40,
    gst: 45,
    items: [
      { id: "item1", name: "Margherita Pizza", qty: 1, price: 450, assignedTo: [] },
      { id: "item2", name: "Pepperoni Pizza", qty: 1, price: 550, assignedTo: [] },
      { id: "item3", name: "Garlic Bread", qty: 2, price: 180, assignedTo: [] },
      { id: "item4", name: "Pasta Alfredo", qty: 1, price: 320, assignedTo: [] },
      { id: "item5", name: "Coke", qty: 3, price: 150, assignedTo: [] },
      { id: "item6", name: "Tiramisu", qty: 2, price: 280, assignedTo: [] }
    ],
    participants: []
  },
  {
    id: "CF2-18",
    hotelName: "Cafe Mocha",
    serviceCharge: 25,
    gst: 20,
    items: [
      { id: "item1", name: "Cappuccino", qty: 3, price: 270, assignedTo: [] },
      { id: "item2", name: "Latte", qty: 2, price: 200, assignedTo: [] },
      { id: "item3", name: "Chocolate Cake", qty: 1, price: 180, assignedTo: [] },
      { id: "item4", name: "Croissant", qty: 4, price: 240, assignedTo: [] },
      { id: "item5", name: "Club Sandwich", qty: 2, price: 360, assignedTo: [] },
      { id: "item6", name: "Iced Tea", qty: 2, price: 140, assignedTo: [] }
    ],
    participants: []
  },
  {
    id: "BB3-55",
    hotelName: "BBQ Nation",
    serviceCharge: 100,
    gst: 85,
    items: [
      { id: "item1", name: "Veg Platter", qty: 1, price: 650, assignedTo: [] },
      { id: "item2", name: "Chicken Wings", qty: 2, price: 480, assignedTo: [] },
      { id: "item3", name: "Mutton Seekh", qty: 1, price: 420, assignedTo: [] },
      { id: "item4", name: "Paneer Tikka", qty: 1, price: 320, assignedTo: [] },
      { id: "item5", name: "Kulfi", qty: 4, price: 200, assignedTo: [] },
      { id: "item6", name: "Butter Naan", qty: 6, price: 180, assignedTo: [] },
      { id: "item7", name: "Dal Makhani", qty: 1, price: 280, assignedTo: [] },
      { id: "item8", name: "Lassi", qty: 4, price: 240, assignedTo: [] }
    ],
    participants: []
  },
  {
    id: "SU4-77",
    hotelName: "Sushi Express",
    serviceCharge: 60,
    gst: 55,
    items: [
      { id: "item1", name: "California Roll", qty: 2, price: 380, assignedTo: [] },
      { id: "item2", name: "Salmon Nigiri", qty: 4, price: 520, assignedTo: [] },
      { id: "item3", name: "Miso Soup", qty: 3, price: 180, assignedTo: [] },
      { id: "item4", name: "Tempura Prawns", qty: 1, price: 450, assignedTo: [] },
      { id: "item5", name: "Edamame", qty: 2, price: 160, assignedTo: [] },
      { id: "item6", name: "Green Tea", qty: 3, price: 120, assignedTo: [] }
    ],
    participants: []
  }
];

const seedAllBills = async () => {
  try {
    console.log("🚀 Starting to seed preset bills...\n");

    for (const bill of presetBills) {
      const billRef = doc(db, "bills", bill.id);
      
      const billData = {
        hotelName: bill.hotelName,
        serviceCharge: bill.serviceCharge,
        gst: bill.gst,
        createdAt: Timestamp.now(),
        status: "active",
        items: bill.items,
        participants: bill.participants
      };

      await setDoc(billRef, billData);
      
      const total = bill.items.reduce((sum, item) => sum + item.price, 0) + bill.serviceCharge + bill.gst;
      
      console.log(`✅ ${bill.id} - ${bill.hotelName} (₹${total})`);
    }

    console.log("\n========================================");
    console.log("🎉 All bills seeded successfully!");
    console.log("========================================\n");
    console.log("QR Code URLs:");
    console.log("-------------");
    presetBills.forEach(bill => {
      console.log(`${bill.hotelName.padEnd(15)} → http://localhost:5173/?bill=${bill.id}`);
    });
    console.log("\n💡 Generate QR codes at: https://www.qr-code-generator.com/");
    
    process.exit(0);
  } catch (e) {
    console.error("❌ Error seeding documents: ", e);
    process.exit(1);
  }
};

seedAllBills();
