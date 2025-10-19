Dash Dine - Food Delivery Platform

Dash Dine is a comprehensive, full-stack food delivery application designed to connect users, restaurant owners, and delivery personnel in a seamless, real-time ecosystem. The platform allows users to browse restaurants and order food, enables restaurant owners to manage their menu and incoming orders, and provides delivery boys with an interface to handle deliveries efficiently.

Key Features


For Users

User Authentication: Secure sign-up and sign-in with email/password and Google OAuth.
Geolocation: Automatically detects the user's city to display local restaurants and food items.
Search & Filter: Users can search for specific food items or filter by category.
Cart Management: Add, remove, and update item quantities in the shopping cart.
Secure Checkout: Supports both Cash on Delivery (COD) and online payments via Razorpay.
Real-Time Order Tracking: Users can track the status of their orders and see the delivery boy's location on a live map.
Order History: View a complete history of all past orders.
Rate Food Items: Users can rate items they have received.

For Restaurant Owners

Shop Management: Owners can create and update their restaurant's profile, including name, address, and image.
Menu Management: Easily add, edit, and delete food items from the menu.
Real-Time Order Notifications: Receive instant notifications for new orders via WebSockets.
Order Management: Update the status of an order (e.g., "Preparing," "Out for Delivery").
Delivery Assignment: The system automatically broadcasts delivery requests to nearby available delivery boys.

For Delivery Boys

Real-Time Delivery Assignments: Receive notifications for new delivery opportunities in their vicinity.
Accept Orders: View and accept available delivery assignments.
Live Location Tracking: The app tracks the delivery boy's location in real-time, which is updated for the user and restaurant owner.
OTP Verification: Securely confirm a delivery by verifying an OTP with the customer.
Earnings & Delivery History: View today's earnings and a history of completed deliveries.

Technology Stack


Backend

Framework: Node.js, Express.js
Database: MongoDB with Mongoose
Authentication: JWT (JSON Web Tokens) for session management, bcrypt.js for password hashing.
Real-Time Communication: Socket.IO
Image Storage: Cloudinary
Payment Gateway: Razorpay

Frontend

Library: React.js
State Management: Redux Toolkit
Routing: React Router
Styling: Tailwind CSS
Mapping: Leaflet & React-Leaflet for live tracking
API Communication: Axios

Setup and Installation


Prerequisites

Node.js (v14 or higher)
npm or yarn
MongoDB instance (local or cloud)

1. Backend Setup

Clone the repository:
Bash
git clone <repository-url>
cd <project-folder>/backend # Navigate to the backend directory


Install dependencies:
Bash
npm install


Create a .env file in the backend root and add the following environment variables:
Code snippet
PORT=8000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CORS_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUDINARY_API_KEY=<your_cloudinary_api_key>
CLOUDINARY_API_SECRET=<your_cloudinary_api_secret>
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
# Add any other variables for mail services


Start the server:
Bash
npm start



2. Frontend Setup

Navigate to the frontend directory:
Bash
cd ../frontend # From the backend directory


Install dependencies:
Bash
npm install


Create a .env file in the frontend root and add the following:
Code snippet
VITE_GEOAPIKEY=<your_geoapify_api_key>
VITE_RAZORPAY_KEY_ID=<your_razorpay_key_id>


Start the development server:
Bash
npm run dev


The application should now be running, with the frontend at http://localhost:5173 and the backend at http://localhost:8000.
