# 📚 AI Student Daily Planner Chatbot

> **Your Smart Study Companion powered by AI** 🤖

An intelligent MERN stack chatbot that generates personalized study roadmaps and preparation plans for school exams, competitive exams, company interviews, certifications, and technical skills.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)

---

## 🌟 Features

### 🎯 **Intelligent Roadmap Generation**
- **School Board Exams**: 10th/12th ICSE, CBSE preparation plans
- **Competitive Exams**: JEE Main/Advanced, NEET, GATE, UPSC, CAT, SSC, Banking
- **Tech Companies**: FAANG (Google, Amazon, Microsoft, Meta, Apple), Indian IT (TCS, Infosys, Wipro)
- **Finance Companies**: Goldman Sachs, JP Morgan, Morgan Stanley
- **Certifications**: CCNA, AWS, Azure, GCP, CompTIA, CEH, CISSP
- **Technical Skills**: Python, Java, JavaScript, DSA, Machine Learning, Web Development

### 💬 **Interactive Chat Interface**
- Real-time AI-powered responses
- Conversation history tracking
- Smart roadmap detection from natural language
- Study tips and success strategies

### 🗺️ **Structured Roadmap View**
- Week-by-week study plans
- Topic breakdown with subtopics
- Progress tracking with checkboxes
- Created date tracking
- Visual progress indicators (0% - 100%)

### 🎨 **Modern UI/UX**
- Beautiful gradient design
- Smooth animations (slide-up, bounce, shake)
- Responsive mobile-friendly layout
- Interactive hover effects
- Enhanced form inputs with focus states

---

## 🏗️ Tech Stack

### **Frontend**
- ⚛️ **React 18+** with TypeScript
- 🎨 **Custom CSS** with inline styles
- 🛣️ **React Router** for navigation
- 📡 **Axios** for API calls

### **Backend**
- 🟢 **Node.js** with Express.js
- 📘 **TypeScript** for type safety
- 🔐 **JWT Authentication**
- 🤖 **Mock AI Service** (OpenAI-ready architecture)

### **Database**
- 🍃 **MongoDB** with Mongoose ODM
- 💾 Models: User, Chat, Roadmap

### **Architecture**
- 🏛️ **MVC Pattern**
- 🔄 **RESTful APIs**
- 🎯 **Service-based architecture**
- 🧩 **Modular component structure**

---

## 📸 Screenshots

### 🔐 **Login & Register Pages**
Beautiful gradient authentication with smooth animations

### 💬 **Chat Interface**
Interactive AI chatbot for personalized guidance

### 🗺️ **Roadmap View**
Structured week-by-week study plans with progress tracking

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16+)
- MongoDB (v5+)
- npm or yarn

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/AI-Student-Daily-Planner-Chatbot.git
cd AI-Student-Daily-Planner-Chatbot
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../ai-student-planner
npm install
```

4. **Environment Setup**

Create `.env` file in `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-student-planner
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here # Optional
```

5. **Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

6. **Run Backend Server**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

7. **Run Frontend**
```bash
cd ai-student-planner
npm start
# App opens on http://localhost:3000
```

---

## 📋 API Endpoints

### **Authentication**
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/auth/me          - Get current user
```

### **Chat**
```
POST   /api/chat/message     - Send message to AI
GET    /api/chat/history     - Get chat history
DELETE /api/chat/:id         - Delete chat
```

### **Roadmap**
```
POST   /api/roadmap/generate - Generate roadmap
GET    /api/roadmap          - Get all roadmaps
GET    /api/roadmap/:id      - Get specific roadmap
PATCH  /api/roadmap/:id      - Update roadmap progress
DELETE /api/roadmap/:id      - Delete roadmap
```

---

## 🎓 Example Prompts

### **School Exams**
```
✅ "10th ICSE board exam preparation"
✅ "12th CBSE roadmap"
✅ "Class 10 CBSE study plan"
```

### **Competitive Exams**
```
✅ "JEE Main preparation roadmap"
✅ "NEET complete study plan"
✅ "UPSC Civil Services roadmap"
✅ "CAT MBA entrance preparation"
✅ "GATE CSE roadmap"
```

### **Tech Companies**
```
✅ "Google interview preparation"
✅ "Amazon coding interview roadmap"
✅ "Microsoft placement preparation"
✅ "TCS interview preparation"
```

### **Certifications**
```
✅ "CCNA certification roadmap"
✅ "AWS certification preparation"
✅ "Azure certification roadmap"
```

### **Technical Skills**
```
✅ "Python programming roadmap"
✅ "DSA complete learning path"
✅ "Machine Learning roadmap"
✅ "DevOps learning path"
```

---

## 📁 Project Structure

```
AI-Student-Daily-Planner-Chatbot/
│
├── server/                           # Backend (Node.js + Express)
│   ├── src/
│   │   ├── config/                   # Database configuration
│   │   │   └── db.ts
│   │   ├── controllers/              # Route controllers
│   │   │   ├── authController.ts
│   │   │   ├── chatController.ts
│   │   │   └── roadmapController.ts
│   │   ├── middleware/               # Auth middleware
│   │   │   └── authMiddleware.ts
│   │   ├── models/                   # MongoDB models
│   │   │   ├── Chat.ts
│   │   │   ├── Roadmap.ts
│   │   │   └── User.ts
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── chatRoutes.ts
│   │   │   └── roadmapRoutes.ts
│   │   ├── services/                 # Business logic
│   │   │   ├── chatgptService.ts     # AI roadmap generation
│   │   │   └── roadmapService.ts
│   │   └── index.ts                  # Server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── ai-student-planner/               # Frontend (React)
    ├── public/
    ├── src/
    │   ├── components/               # Reusable components
    │   │   ├── MessageInput.tsx
    │   │   ├── MessageList.tsx
    │   │   ├── Navbar.tsx
    │   │   └── RoadmapView.tsx
    │   ├── pages/                    # Page components
    │   │   ├── ChatPage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   └── RoadmapPage.tsx
    │   ├── services/                 # API services
    │   │   ├── api.ts
    │   │   └── auth.ts
    │   ├── utils/                    # Utility functions
    │   ├── App.tsx
    │   └── index.tsx
    ├── package.json
    └── tsconfig.json
```

---

## 🎯 Key Roadmap Categories

| Category | Count | Examples |
|----------|-------|----------|
| **School Exams** | 12+ | 10th/12th ICSE, CBSE |
| **Competitive Exams** | 15+ | JEE, NEET, GATE, UPSC, CAT, SSC, Banking |
| **Tech Companies** | 20+ | FAANG, TCS, Infosys, Wipro, Cognizant |
| **Finance Companies** | 5+ | Goldman Sachs, JP Morgan, Morgan Stanley |
| **Certifications** | 10+ | CCNA, AWS, Azure, GCP, CompTIA, CEH |
| **Technical Skills** | 15+ | Python, Java, DSA, ML, Web Dev, DevOps |

**Total: 75+ comprehensive roadmaps!** 🎉

---

## 🔥 Roadmap Features

Each generated roadmap includes:

### **📅 Week-by-Week Breakdown**
- Foundation (Week 1-2)
- Building Skills (Week 3-4)
- Advanced Concepts (Week 5-6)
- Specialization (Week 7-8)

### **📚 Learning Resources**
- Free resources (YouTube, documentation)
- Paid courses (Udemy, Coursera)
- Books and reference materials
- Practice platforms

### **💡 Success Tips**
- Study schedule (daily hours)
- Best practices
- Common mistakes to avoid
- Revision strategies

### **📊 Progress Tracking**
- Checkbox for each subtopic
- Overall progress percentage
- Created date tracking
- Visual progress bar

---

## 🎨 UI/UX Highlights

### **🌈 Modern Design**
- Purple gradient background (#667eea → #764ba2)
- Clean card-based layout
- Smooth animations (0.3s ease transitions)

### **✨ Animations**
- **Slide-up**: Page entrance animation
- **Bounce**: Emoji animations
- **Shake**: Error message animation
- **Hover effects**: Button lift on hover

### **📱 Responsive**
- Mobile-friendly design
- Flexible layouts
- Touch-optimized

### **♿ Accessibility**
- Semantic HTML
- Keyboard navigation
- ARIA labels (ready for enhancement)

---

## 🧪 Testing

### **Manual Testing**
```bash
# Test different roadmap prompts
"10th ICSE board exam"
"JEE Main preparation"
"Google interview roadmap"
"AWS certification"
```

### **Future Enhancements**
- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Cypress

---

## 🔒 Security Features

- ✅ JWT Authentication
- ✅ Password hashing (bcrypt)
- ✅ Protected routes
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment variables

---

## 🚀 Deployment

### **Frontend (Vercel/Netlify)**
```bash
cd ai-student-planner
npm run build
# Deploy build folder
```

### **Backend (Heroku/Railway)**
```bash
cd server
npm run build
# Deploy to platform
```

### **Database (MongoDB Atlas)**
- Create cluster on MongoDB Atlas
- Update `MONGODB_URI` in production

---

## 📈 Future Enhancements

### **Phase 1 - Core Features** ✅
- [x] Authentication system
- [x] Chat interface
- [x] Roadmap generation
- [x] Progress tracking
- [x] Beautiful UI

### **Phase 2 - Enhancements** 🚧
- [ ] Real OpenAI GPT integration
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Study reminders
- [ ] Social sharing

### **Phase 3 - Advanced** 🔮
- [ ] Study groups
- [ ] Video tutorials
- [ ] Gamification (badges, streaks)
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

## ⭐ Star History

If you find this project helpful, please consider giving it a ⭐!

---

## 🎯 Project Status

**Status**: 🟢 Active Development

**Current Version**: 1.0.0

**Last Updated**: November 2025

---

<div align="center">

### 🌟 Made with ❤️ for Students Worldwide 🌟

**Star ⭐ this repo if you found it helpful!**

</div>