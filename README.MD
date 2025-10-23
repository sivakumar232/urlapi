# Glance: URL Preview API

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/sivakumar232/glancebackend.svg?style=flat-square)](https://github.com/sivakumar232/glancebackend/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sivakumar232/glancebackend.svg?style=flat-square)](https://github.com/sivakumar232/glancebackend/network)

**Glance** is a powerful, self-hostable API service designed to instantly fetch and return metadata—such as title, description, and preview image—from any URL.

This repository contains the **backend API service**. The corresponding frontend dashboard for user registration, API key management, and usage statistics can be found here:

* **Frontend Repository:** [github.com/sivakumar232/glancefrontend](https://github.com/sivakumar232/glancefrontend)

## 🚀 Features

* **Metadata Fetching:** The core service. Provide a URL and get back structured JSON data with its title, description, and primary image.
* **User Authentication:** Secure JWT-based system for user registration, login, and profile management.
* **API Key Management:** Every user is automatically assigned an API key, with an endpoint to regenerate it at any time.
* **Usage Tracking:** Built-in rate limiting (per user) and endpoints to check usage stats, remaining quota, and request history.
* **Full Account Control:** Users can update their profile information or delete their account entirely.

## 🔧 Tech Stack

*(You can update this section with your specific technologies)*

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (inferred)
* **Authentication:** JSON Web Tokens (JWT)
* **Scraping:** [e.g., Cheerio, node-html-parser]

---

## 🏁 Getting Started (Local Setup)

To get a local copy up and running, follow these steps.

### Prerequisites

* Node.js (v18 or later recommended)
* npm / yarn
* MongoDB (local instance or a cloud URI)

### Backend Installation (`glancebackend`)

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/sivakumar232/glancebackend.git](https://github.com/sivakumar232/glancebackend.git)
    cd glancebackend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the `glancebackend` directory and add the following variables:

    ```env
    # Server Configuration
    PORT=3000
    
    # MongoDB Connection
    MONGO_URI=your_mongodb_connection_string
    
    # JWT Authentication
    JWT_SECRET=your_super_secret_jwt_key
    
    # API Configuration
    DEFAULT_REQUEST_LIMIT=100
    ```

4.  **Run the server:**
    ```sh
    npm start
    # or for development (if you have nodemon)
    npm run dev
    ```
    The API will be running at `http://localhost:3000`.

### Frontend Installation (`glancefrontend`)

For instructions on setting up the frontend, please refer to the [glancefrontend README](https://github.com/sivakumar232/glancefrontend/blob/main/README.md). You will likely need to set a `.env` variable there pointing to the backend API:

# API Documentation

## Base URL

All endpoints are prefixed with `/api/user`.

**Base URL:** `http://localhost:3000/api/user`

---

## 💚 Health Check

### 1. Health Check
Checks the API's status. No authentication is required.

* **Endpoint:** `GET /health`
* **Response (200):**
    ```json
    {
      "status": "ok",
      "uptime": 128.45
    }
    ```

---

## 🔑 Authentication Endpoints

### 2. Register User
Registers a new user with username, email, and password. Auto-generates an API key.

* **Endpoint:** `POST /register`
* **Request Body:**
    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "password": "mysecretpassword"
    }
    ```
* **Responses:**
    | Status | Description | Body |
    | :--- | :--- | :--- |
    | `200` | User registered successfully | `{"message": "User registered successfully"}` |
    | `400` | User already exists | |
    | `500` | Internal server error | |

### 3. Login User
Authenticates a user and returns a JWT token.

* **Endpoint:** `POST /login`
* **Request Body:**
    ```json
    {
      "email": "john@example.com",
      "password": "mysecretpassword"
    }
    ```
* **Responses:**
    | Status | Description | Body |
    | :--- | :--- | :--- |
    | `200` | Login successful | `{"message": "Login successful", "token": "<JWT_TOKEN>"}` |
    | `400` | User not found / Invalid credentials | |
    | `500` | Internal server error | |

### 4. Logout
Logs out the user (frontend just discards JWT).

* **Endpoint:** `POST /logout`
* **Response (200):**
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

---

## 👤 User & Profile Endpoints

*(Authentication Required: Most endpoints require a JWT `Bearer` token.)*

### 5. Get Profile
Fetches user profile info.
*Authentication: JWT or API key.*

* **Endpoint:** `GET /profile`
* **Response (200):**
    ```json
    {
      "username": "john_doe",
      "email": "john@example.com",
      "apikey": "qup08fu19n",
      "requestMade": 12,
      "requestLimit": 100
    }
    ```

### 6. Update Profile
Update user info.
*Authentication: JWT required.*

* **Endpoint:** `PUT /updateprofile`
* **Request Headers:**
    ```
    Authorization: Bearer <JWT_TOKEN>
    ```
* **Request Body:**
    ```json
    {
      "username": "John Updated",
      "email": "john_updated@example.com"
    }
    ```
* **Response (200):**
    ```json
    {
      "message": "Profile updated",
      "updatedUser": {
        "_id": "652cdd4...",
        "username": "John Updated",
        "email": "john_updated@example.com",
        "apiKey": "qup08fu19n"
      }
    }
    ```

### 7. Regenerate API Key
Generates a new API key.
*Authentication: JWT or API key.*

* **Endpoint:** `POST /regenerate-apikey`
* **Response (200):**
    ```json
    {
      "message": "API key regenerated successfully",
      "apiKey": "newapikey123"
    }
    ```

### 8. Delete Account
Deletes the user account.
*Authentication: JWT or API key.*

* **Endpoint:** `DELETE /delete`
* **Response (200):**
    ```json
    {
      "message": "Account deleted successfully"
    }
    ```

---

## 🔗 Core Service Endpoints

*(Authentication Required: JWT or API key.)*

### 9. Preview URL Metadata
Fetches URL title, description, and image. Rate limited.

* **Endpoint:** `GET /previewurl`
* **Query Parameters:**
    | Parameter | Required | Description |
    | :--- | :--- | :--- |
    | `url` | **Yes** | The URL to preview. |
    | `api_key`| **(Optional)** | Your API key (required if not using JWT). |
* **Example Request:**
    `GET /api/user/previewurl?url=https://example.com&api_key=qup08fu19n`
* **Responses:**
    | Status | Description | Body |
    | :--- | :--- | :--- |
    | `200` | Success | `{"title": "My Link Preview", "description": "...", "image": "...", "url": "..."}` |
    | `400` | Missing URL | |
    | `429` | Request limit exceeded | |
    | `500` | Could not fetch URL data | |


### 10. Request History
Fetch previously previewed URLs for the authenticated user.

* **Endpoint:** `GET /history`
* **Response (200):**
    ```json
    [
      {
        "_id": "abc123",
        "url": "[https://openai.com](https://openai.com)",
        "title": "OpenAI",
        "description": "AI research lab",
        "image": "[https://openai.com/logo.png](https://openai.com/logo.png)",
        "fetchedAt": "2025-10-06T15:30:22.451Z"
      }
    ]
    ```

### 11. User Stats
Fetch total requests, remaining quota, and last request time.

* **Endpoint:** `GET /stats`
* **Response (200):**
    ```json
    {
      "username": "john_doe",
      "totalRequests": 35,
      "remainingRequests": 65,
      "lastRequestAt": "2025-10-06T17:42:15.225Z"
    }
    ```

---

## ⚠️ Common Errors

| Status Code | Error | Description |
| :--- | :--- | :--- |
| `400` | Bad Request | Missing required parameters (like `url`). |
| `401` | Unauthorized | Invalid or missing JWT token or API key. |
| `404` | Not Found | User or endpoint not found. |
| `429` | Too Many Requests | Request limit exceeded. |
| `500` | Internal Server Error | A general server error occurred. |

```env
# Example for a React app
REACT_APP_API_BASE_URL=http://localhost:3000/api/user
