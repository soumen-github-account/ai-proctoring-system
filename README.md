# 🚀 AI-Powered Online Proctoring System

An intelligent AI-based online examination monitoring system developed using modern full-stack and computer vision technologies.  
This project enables secure remote examinations through real-time candidate monitoring, AI-driven violation detection, and centralized exam management.

---

# 📌 Features

## 👨‍💼 Admin Panel
- Dashboard with complete exam analytics
- Live candidate video monitoring
- Candidate management system
- View violation records with screenshots
- Terminate suspicious candidates
- Add/manage candidates
- Conduct and manage exams

## 👨‍🎓 Candidate Panel
- Secure login using credentials provided by admin
- Camera & screen permission verification
- Full-screen exam environment
- Real-time monitoring during examination

## 🤖 AI-Based Violation Detection
- 📱 Phone Detection
- 👥 Multiple Face Detection
- 👀 Eye Gaze Tracking
- ↔️ Head Movement Detection
- 🔄 Tab Switching Detection
- 📸 Automatic Violation Screenshot Capture

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS

## Backend
- Django
- Django REST Framework

## AI & Computer Vision
- YOLO
- MediaPipe
- NumPy
- OpenCV

## Real-Time Communication
- WebRTC
- Webcam Streaming

## Database
- SQLite / PostgreSQL *(update according to your DB)*

---

# 🏗️ System Architecture

```text
Candidate Device
       │
       ▼
Frontend (React + Tailwind)
       │
       ▼
Backend API (Django)
       │
 ┌───────────────┐
 │ AI Detection  │
 │  YOLO + CV    │
 └───────────────┘
       │
       ▼
Database Storage
       │
       ▼
Admin Dashboard Monitoring
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

# 🚀 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# 🚀 Backend Setup

```bash
cd backend

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

---

# 🔐 Environment Variables

Create `.env` files in frontend and backend.

Example:

```env
SECRET_KEY=your_secret_key
DEBUG=True
```

---

# 📊 Modules

| Module | Description |
|--------|-------------|
| Admin Dashboard | Monitor candidates & exams |
| Candidate Panel | Attend online examination |
| AI Detection System | Detect suspicious activities |
| Violation Storage | Save screenshots & logs |
| Live Monitoring | Stream candidate video |

---

# 📚 What We Learned

- Real-time AI monitoring systems
- WebRTC live streaming
- Computer Vision integration
- Full-stack application development
- Team collaboration workflow
- Database schema planning
- Debugging & performance optimization

---

# 🔮 Future Improvements

- 📱 Secondary Mobile Camera Monitoring
- 🎤 Voice Detection
- 😊 Emotion Detection
- ☁️ Cloud Deployment
- 📈 Advanced Analytics Dashboard

---

# 👨‍💻 Team Contributions

| Team Member | Contribution |
|-------------|--------------|
| Soumen | Backend Django & React Frontend |
| Atanu & Mainak | AI Detection Logic |
| Kunal, Ripon & Subhadip | UI/UX Design in Figma |
| Manodeep & Sutirtha | Database Schema Design |
| Sayan & Argha | System Architecture & Workflow |
--------------------------------------------------

# 🙏 Mentor

Special thanks to our mentor faculty:

### **Prof. Ayushman Bilas Thakur**

for continuous guidance, support, and mentorship throughout the project development.

---

<!-- # 📸 Screenshots

## Admin Dashboard
_Add Screenshot Here_

## Candidate Exam Interface
_Add Screenshot Here_

## AI Violation Detection
_Add Screenshot Here_
 -->

---

# 📄 License

This project is developed for educational and research purposes.

---

# ⭐ Support

If you like this project, consider giving it a ⭐ on GitHub.