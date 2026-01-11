# 💪 FitGenie - AI-Powered Personal Fitness Trainer

A full-stack MERN application that uses Google Gemini AI to generate personalized workout plans and nutrition tips through a chat interface.

![FitGenie Dashboard](./screenshots/dashboard.png)

## ✨ Features

- **🔐 Authentication**: Secure email/password login with JWT
- **📝 Onboarding**: Multi-step profile setup (goals, diet, fitness level)
- **🤖 AI Chat Coach**: Chat with Gemini AI for personalized workout and nutrition plans
- **📊 Dashboard**: Progress tracking with combo charts (weight, workouts, calories)
- **🏋️ Workout Logging**: Track exercises with sets, reps, and weights
- **👤 Profile Management**: Update your fitness profile anytime
- **⚡ Rate Limiting**: 60 requests/hour on chat API

## 🛠️ Tech Stack

| Frontend | Backend | Database | AI |
|----------|---------|----------|-----|
| React 18 | Node.js | MongoDB | Google Gemini |
| Vite | Express.js | Mongoose | |
| Recharts | JWT Auth | | |
| React Router | bcrypt | | |

## 📁 Project Structure

```
Fitness_APP_MERN/
├── client/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React Context (Auth)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
├── server/                 # Backend (Express)
│   ├── config/             # Database config
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & rate limiting
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── services/           # Gemini & validation
│   ├── server.js
│   └── package.json
└── package.json            # Root scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone and install dependencies**
   ```bash
   npm run install-all
   ```

2. **Configure environment variables**
   ```bash
   # In server/.env
   PORT=4000
   MONGO_URI=mongodb://localhost:27017/fitness_trainer
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   
   Or run separately:
   ```bash
   # Terminal 1 - Backend
   cd server && npm run dev
   
   # Terminal 2 - Frontend
   cd client && npm run dev
   ```

4. **Open the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update profile |

### Chat & Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI |
| GET | `/api/chat/history` | Get chat history |
| GET | `/api/chat/plans` | Get all plans |
| GET | `/api/chat/plans/:id` | Get specific plan |

### Workouts & Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workouts` | Log workout |
| GET | `/api/workouts` | Get workouts |
| DELETE | `/api/workouts/:id` | Delete workout |
| POST | `/api/progress` | Log progress |
| GET | `/api/progress` | Get progress |
| GET | `/api/progress/chart` | Get chart data |

## 🎯 Demo Flow

1. **Register** a new account
2. **Complete onboarding** (age, weight, goals, etc.)
3. **Ask the AI Coach**: "Create a 4-week beginner strength plan"
4. **View the generated plan** with workouts and nutrition
5. **Log workouts** as you follow the plan
6. **Track progress** on the dashboard chart

## 📸 Screenshots

<details>
<summary>Click to view screenshots</summary>

### Login
![Login](./screenshots/login.png)

### Onboarding
![Onboarding](./screenshots/onboarding.png)

### AI Chat
![Chat](./screenshots/chat.png)

### Dashboard
![Dashboard](./screenshots/dashboard.png)

</details>

## 🔒 Security

- Password hashing with bcrypt (10+ salt rounds)
- JWT authentication for protected routes
- Rate limiting on AI chat endpoint (60 req/hour)
- CORS configured for client origin
- Gemini API key kept server-side only

## 📄 License

MIT License - feel free to use this project for your portfolio!

---

Built with ❤️ using the MERN stack and Google Gemini AI
