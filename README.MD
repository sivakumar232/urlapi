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

```env
# Example for a React app
REACT_APP_API_BASE_URL=http://localhost:3000/api/user
