# EtuServices - User Connection Management with Redis

**EtuServices** is a platform designed to help students buy and sell articles (such as DVDs, books, etc.). The project focuses on implementing an efficient user connection management system, using **Redis** to limit the number of connections per user within a 10-minute window. This solution helps reduce the number of requests hitting the backend while maintaining a smooth user experience.

## Project Overview

EtuServices provides an online platform where students can list articles for sale or purchase. As the service grows, limiting the number of concurrent user connections becomes essential for ensuring performance and fairness. In this project, **Redis** is used to track and manage user connections, limiting each user to a maximum of 10 connections in a 10-minute window.

### Features

- **User Registration and Authentication**: Users can register, log in, and manage their account information.
- **Redis-based Connection Management**: Limits the number of connections a user can have in a given 10-minute window.
- **Real-Time Updates**: Users are instantly informed when they exceed the connection limit.
- **Modular Architecture**: The project is organized into frontend (Node.js), backend (Express.js), and a Flask API for managing Redis connections.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Architecture](#project-architecture)
- [API Endpoints](#api-endpoints)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Prerequisites

Before running this project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Version 14 or above)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [Redis](https://redis.io/) (For managing user connection limits)
- [SQLite](https://www.sqlite.org/) (For storing user data)

### 1. Clone the Repository

```bash
git clone https://github.com/WalidHASNAOUI/EtuServices.git
cd EtuServices
```

### 2. Clone the Repository

Install the necessary dependencies for both the frontend (Node.js) and backend (Flask).

```bash
# Install Node.js dependencies
npm install

# Install Python dependencies (for Flask)
pip install -r requirements.txt
```

### 3. Configure Redis

Make sure Redis is running locally on your machine:

```bash
# Start Redis server
redis-server
```

### 4. Set Up SQLite Database

Run the provided populateDb.js script to populate the SQLite database with mock data.

```bash
node populateDb.js
```

## Usage

To run the application, you need to start both the Node.js server and the Flask API.

### 1. Start the Flask API (Redis Manager)

```bash 
# Navigate to the Flask directory
cd flask_api

# Run the Flask API
python redis_manager.py
```

### 2. Start the Node.js Server

```bash 
# Navigate to the Node.js directory
cd node_server

# Start the Node.js server
npm start
```

## Project Architecture

### Architecture Overview

The architecture of the EtuServices platform consists of the following components:

- Frontend (Node.js): Handles the user interface and interactions with the backend API.

- Backend (Express.js): Serves API requests, handles business logic, and interacts with the database and Redis.

- Redis API (Flask): Manages user connection tracking and limits using Redis. This API is responsible for checking whether a user is allowed to connect based on the number of recent connections.

- Database (SQLite): Stores user information such as name, email, and password.

### Diagram of the System

The following diagram provides an overview of how the system components interact with each other:

+---------------+        +-----------------+        +------------+
| User (Frontend) | <--> | Express.js API  | <--> | Redis (Flask) |
+---------------+        +-----------------+        +------------+
                          |                   |
                      +---------------+   +---------------+
                      |  SQLite DB    |   |   Redis DB    |
                      +---------------+   +---------------+

### Workflow

1. **Frontend** (Node.js) makes requests to the **Express.js API** (Backend).
2. **Express.js API** communicates with **SQLite** to retrieve or store user data.
3. **Express.js API** interacts with the **Redis API (Flask)** to check and update the connection limits for the user.
4. The **Redis API** (Flask) uses **Redis** to manage the connection timestamps and validate if a user can connect.

This modular design ensures a clear separation of concerns and allows for easy scalability as the project grows.


## Summary of Technologies

| Technology      | Purpose                                      |
|-----------------|----------------------------------------------|
| **Node.js**     | Backend server and routing logic.           |
| **Express.js**  | Web framework for API and server management. |
| **SQLite**      | Relational database for storing user data.  |
| **Redis**       | In-memory store for managing connections.   |
| **Flask**       | API for Redis integration and connection management. |
| **Git**         | Version control for collaboration and code management. |
| **GitHub**      | Platform for hosting the repository.        |
