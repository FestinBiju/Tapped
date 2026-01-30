# Tapped

A modern, collaborative bill-splitting and payment web app for groups, built with React, Tailwind, Firebase, and Material3 UI.

---

## 🌟 Features

- **Real-time bill sharing**: Instantly split and assign items to users in a group order.
- **Drag & drop assignment**: Easily assign items to users with a smooth drag-and-drop interface.
- **User management**: Add, remove, and switch users with a beautiful sidebar.
- **Live updates**: All changes sync instantly for everyone using Firebase.
- **Dark/Light mode**: Toggle between professional dark and light themes.
- **GPay integration**: Pay your share directly with Google Pay.
- **Hotel/restaurant branding**: Custom hotel badge and order ID for each bill.
- **Responsive design**: Works seamlessly on desktop and mobile.

---

## 📝 Problem Statement

Splitting bills in groups is often confusing, slow, and error-prone. People struggle to track who ordered what, how much each person owes, and how to pay quickly—especially in restaurants or hotels.

---

## 💡 Solution

Tapped makes group bill splitting effortless:
- Assign items to users visually
- See your share, service charges, and taxes instantly
- Pay securely with GPay
- Manage users and orders in real time

---

## 🛠️ Tools & Technologies

- **React** + **Tailwind CSS**: Fast, modern UI
- **Firebase** (Firestore): Real-time data and authentication
- **Material3 UI**: Professional, accessible components
- **Google Stitch**: Seamless backend integration
- **Firebase Studio**: Easy database management
- **GPay API**: Secure, instant payments

---

## 🎬 Video Demo

[![Watch the demo](https://img.youtube.com/vi/your-demo-id/maxresdefault.jpg)](https://www.youtube.com/watch?v=your-demo-id)

---

## ⚡ Requirements

- Node.js (v18+ recommended)
- npm or yarn
- Firebase project (with Firestore enabled)
- GPay API credentials

---

## 🚀 How to Run

1. **Clone the repo**
   ```sh
   git clone https://github.com/your-org/tapped.git
   cd tapped
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```
3. **Configure Firebase**
   - Copy your Firebase config to `src/firebase/config.js`
   - Enable Firestore in your Firebase project
4. **Start the dev server**
   ```sh
   npm run dev
   ```
5. **Open in browser**
   - Visit [http://localhost:5173](http://localhost:5173)

---

## 📦 Project Structure

```
src/
  components/      # UI components (OrderGrid, Sidebar, UserBubble, etc.)
  context/         # React context for order and theme
  firebase/        # Firebase config and integration
  hooks/           # Custom React hooks
  index.css        # Tailwind base styles
  App.jsx          # Main app entry
```

---

## 🤝 Contributing

Pull requests and feedback are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT

---

**Tapped** — Split, assign, and pay. Effortless group billing for everyone.
