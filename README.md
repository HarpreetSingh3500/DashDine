# 🍔 DashDine 🍕

A modern, full-stack food delivery and restaurant management platform. DashDine provides a seamless experience for customers to order food, and for restaurant owners to manage their business. This repository contains the complete source code for both the frontend and backend of the application.

## 🚀 Live Demo

Check out the live demo of the application here: [https://dashdine-app.onrender.com](https://dashdine-app.onrender.com)

## ✨ Features

  * **User Authentication:** Secure user registration and login.
  * **Real-time Order Tracking:** 📍 Track your food order from the restaurant to your doorstep.
  * **Restaurant Management:** 👨‍🍳 Owners can add, update, and manage their restaurant's menu and details.
  * **Interactive Menu:** 🍲 Beautifully displayed menus with images and descriptions.
  * **Seamless Checkout:** 💳 Integrated with Razorpay for smooth and secure payments.
  * **Real-time Updates:** 🚀 Socket.io for instant communication between the client and server.
  * **And much more...**

## 🚀 Tech Stack

### Frontend

  * **[React](https://reactjs.org/)**: A JavaScript library for building user interfaces.
  * **[Redux Toolkit](https://redux-toolkit.js.org/)**: The official, opinionated, batteries-included toolset for efficient Redux development.
  * **[React Router](https://reactrouter.com/)**: Declarative routing for React.js.
  * **[Tailwind CSS](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
  * **[Axios](https://axios-http.com/)**: Promise-based HTTP client for the browser and Node.js.
  * **[Socket.io-client](https://socket.io/docs/v4/client-initialization/)**: Real-time, bidirectional and event-based communication.
  * **[Leaflet](https://leafletjs.com/)**: An open-source JavaScript library for mobile-friendly interactive maps.
  * **[Firebase](https://firebase.google.com/)**: Used for authentication and real-time database functionalities.

### Backend

  * **[Node.js](https://nodejs.org/)**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
  * **[Express.js](https://expressjs.com/)**: A minimal and flexible Node.js web application framework.
  * **[MongoDB](https://www.mongodb.com/)**: A cross-platform document-oriented database program.
  * **[Mongoose](https://mongoosejs.com/)**: An Object Data Modeling (ODM) library for MongoDB and Node.js.
  * **[JWT (JSON Web Token)](https://jwt.io/)**: A compact, URL-safe means of representing claims to be transferred between two parties.
  * **[Socket.io](https://socket.io/)**: Enables real-time, bidirectional and event-based communication.
  * **[Cloudinary](https://cloudinary.com/)**: Cloud-based image and video management.
  * **[Razorpay](https://razorpay.com/)**: A payment gateway for online payments.
  * **[Nodemailer](https://nodemailer.com/)**: A module for Node.js applications to allow easy as cake email sending.

## 🏁 Getting Started

### Prerequisites

  * Node.js and npm installed on your machine.
  * A MongoDB database.
  * API keys from Cloudinary and Razorpay.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/harpreetsingh3500/dashdine.git
    ```
2.  **Navigate to the backend directory and install dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Create a `.env` file in the `backend` directory and add the following environment variables:**
    ```
    PORT=...
    MONGO_URI=...
    JWT_SECRET=...
    CLOUDINARY_CLOUD_NAME=...
    CLOUDINARY_API_KEY=...
    CLOUDINARY_API_SECRET=...
    RAZORPAY_KEY_ID=...
    RAZORPAY_KEY_SECRET=...
    SMTP_HOST=...
    SMTP_PORT=...
    SMTP_USER=...
    SMTP_PASS=...
    ```
4.  **Navigate to the frontend directory and install dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```
5.  **Create a `.env` file in the `frontend` directory and add your Firebase configuration:**
    ```
    VITE_FIREBASE_API_KEY=...
    VITE_FIREBASE_AUTH_DOMAIN=...
    VITE_FIREBASE_PROJECT_ID=...
    VITE_FIREBASE_STORAGE_BUCKET=...
    VITE_FIREBASE_MESSAGING_SENDER_ID=...
    VITE_FIREBASE_APP_ID=...
    ```

## 🏃‍♂️ Usage

1.  **Start the backend server:**
    ```bash
    cd backend
    npm run dev
    ```
2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```
3.  Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## 🤝 Author

  * **Harpreet Singh**
