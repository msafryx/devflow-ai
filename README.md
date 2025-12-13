# DevFlow AI  
### A Secure Multi-API Web Platform for Real-Time Developer Ecosystem Intelligence

DevFlow AI is a **full-stack, service-oriented web application** designed to monitor, aggregate, and analyze the **global developer ecosystem** in real time.  
The platform integrates multiple **public APIs** (GitHub, Crypto markets, Tech News, Developer Communities, Weather, and Geolocation) and presents unified insights through a modern dashboard.

The system follows **client–server architecture**, uses **OAuth 2.0 authentication**, **JWT-based authorization**, **API key validation**, and persists aggregated data in **MongoDB**.

---

## 📌 Features

### 🔹 Core Functionality
- 🔐 **Google OAuth 2.0 Login**
- 📊 **Real-time multi-API data aggregation**
- 🧠 **AI-based ecosystem score computation**
- 🗂 **Historical snapshot storage & retrieval**
- 🌍 **IP-based weather & location intelligence**
- 📈 **Crypto market monitoring**
- 📰 **Tech news sentiment analysis**
- 👥 **Developer community activity tracking**

### 🔹 Security
- OAuth 2.0 (Google Identity)
- JSON Web Tokens (JWT)
- API Key authorization
- Protected backend endpoints

### 🔹 Architecture
- Client–server model
- RESTful API design
- NoSQL document-based storage
- Dockerized MongoDB

---

## 🏗 System Architecture (High-Level)
```

Frontend (React)
├── Aggregates Public APIs
├── Computes AI Score
├── Sends JSON Snapshot
↓
Backend (Node.js + Express)
├── OAuth 2.0 Authentication
├── JWT Verification
├── API Key Validation
├── MongoDB Persistence
↓
MongoDB (NoSQL)
└── Snapshot Documents
```

---

## 🌐 Public APIs Used

| API | Purpose |
|----|--------|
| GitHub Search API | Trending repositories & dev activity |
| CoinGecko API | Crypto market prices & trends |
| NewsAPI | Tech news sentiment |
| StackOverflow API | Developer community activity |
| OpenWeather API | Weather & stability data |
| IPAPI | User geolocation |
| Google OAuth | Secure authentication |

---

## 🛠 Technology Stack

### Frontend
- React (Vite)
- Axios
- HTML / CSS
- AJAX

### Backend
- Node.js
- Express.js
- JWT
- OAuth 2.0
- Mongoose

### Database
- MongoDB (Dockerized)

### DevOps / Tools
- Docker
- Postman
- MongoDB Compass
- GitHub

---

## 📂 Project Structure
```

devflow-ai/
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
├── backend/
│ ├── src/
│ │ ├── routes/
│ │ ├── middleware/
│ │ ├── models/
│ │ └── server.js
│ └── package.json
│
├── docker/
│ └── mongodb/
│
├── README.md
└── .env.example
```

---

## 🔐 Environment Variables

Create `.env` files in both frontend and backend.

### Backend `.env`
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/devflow
JWT_SECRET=your_jwt_secret
FRONTEND_API_KEY=your_frontend_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend .env
```
VITE_BACKEND_URL=http://localhost:4000
VITE_FRONTEND_API_KEY=your_frontend_api_key
VITE_NEWS_API_KEY=your_newsapi_key
VITE_OPENWEATHER_API_KEY=your_openweather_key
```

🚀 Getting Started

1️⃣ Clone the Repository
```
git clone https://github.com/your-username/devflow-ai.git
cd devflow-ai
```

2️⃣ Start MongoDB using Docker
```
docker run -d --name devflow-mongo -p 27017:27017 mongo:6
```

3️⃣ Run Backend
```
cd backend
npm install
npm run dev
```

Backend runs at:
```
http://localhost:4000
```

4️⃣ Run Frontend
```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```
🔑 Authentication Flow

1. User clicks Login with Google
2. Google OAuth authenticates user
3. Backend generates JWT
4. JWT stored in browser localStorage
5.JWT + API Key used for secured API calls


🧪 API Testing (Postman)
Save Snapshot
```
POST http://localhost:4000/api/records
```

Headers:
```
Authorization: Bearer <JWT>
x-api-key: <FRONTEND_API_KEY>
Content-Type: application/json
```
Fetch History
```
GET http://localhost:4000/api/records
```

Headers:
```
Authorization: Bearer <JWT>
```
🗄 MongoDB Sample Document
```
{
  "user": "google-oauth-id",
  "timestamp": "2025-12-11T08:22:00Z",
  "github": {...},
  "crypto": {...},
  "news": {...},
  "community": {...},
  "weather": {...},
  "aiScore": 75
}
```

📊 Evaluation Criteria Coverage

✔ Public API Integration
✔ AJAX Communication
✔ Data Aggregation Logic
✔ OAuth 2.0 + API Key
✔ MongoDB Storage
✔ Clean UI & Code Quality


📚 References
```
GitHub REST API – https://docs.github.com/en/rest
CoinGecko API – https://www.coingecko.com/en/api/documentation
NewsAPI – https://newsapi.org
StackOverflow API – https://api.stackexchange.com/docs
OpenWeather API – https://openweathermap.org/api
IPAPI – https://ipapi.co
Google OAuth – https://developers.google.com/identity
MongoDB – https://www.mongodb.com/docs
```



