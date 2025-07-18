﻿# MERN Chat App Echo chat 


A **full-stack real-time chat application** built using **React.js**, **Node.js**, **Express.js**, and **MongoDB**. This project supports **user authentication**, **one-to-one messaging**, **group chats**, **chat history**, and a modern responsive UI.

---

## 🚀 Features

### 🔐 Authentication
- Secure user **signup** and **login**
- JWT-based **authentication** and **authorization**
- Passwords hashed using **bcrypt.js**

### 💬 Chat Functionality
- **One-to-one chats**
- **Group chat creation**, renaming, and member management
- **Real-time messaging** using **Socket.io**
- Display of **typing indicators**
- **Scroll-friendly** and auto-updating chat area

### 👥 User Management
- **Search users** to start a new chat
- View list of **existing chats**
- Group admin privileges

### 🖥️ Frontend (React + Vite)
- Built using **React.js** + **Vite**
- **Chakra UI** for responsive design
- Custom components like:
  - `Login`, `Signup`, `ChatPage`
  - `MyChats`, `Chatbox`, `SingleChat`, `GroupChatModal`

### 🛠️ Backend (Node.js + Express)
- **RESTful APIs** built with **Express.js**
- MongoDB for persistent storage (via **Mongoose**)
- Custom middlewares for:
  - Authentication (`authMiddleware.js`)
  - Error handling (`errorMiddleware.js`)
