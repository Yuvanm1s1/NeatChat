# NeatChat

**NeatChat** is a modern real-time chat application that leverages AI-powered text and image moderation to maintain a safe and engaging environment for users. The platform combines scalable web technologies, WebSocket communication, and deep learning models to automatically filter inappropriate content in messages and images.

---

## 🚀 Features

- Real-time messaging powered by **Socket.IO**
- User authentication with **JWT** (signup, login, profile updates)
- AI-based **text moderation** with `unitary/toxic-bert`
- AI-powered **image moderation** with OpenAI CLIP and ViT-based classifiers
- Online users tracking
- Responsive, modern UI built with **React** and **TailwindCSS**
- Modular architecture separating chat backend and ML moderation service
- Dockerized deployment ready for cloud hosting (Render, Hugging Face Spaces, Railway)

---

## 🛠️ Tech Stack

- **Frontend:** React, TailwindCSS, DaisyUI, Zustand  
- **Backend (Chat API):** Node.js, Express.js, Socket.IO  
- **Backend (ML Moderation API):** Python, FastAPI, Transformers, Torch, OpenCV  

### Machine Learning Models

- `unitary/toxic-bert` for text classification  
- `clip-vit-base-patch16` for NSFW detection  
- `jaranohaal/vit-base-violence-detection` for violence detection  

### Deployment & Infrastructure

- Docker  
- Hugging Face Spaces  
- Render  
- Railway  

---

## 📂 Project Structure

```bash
neatchat/
├── client/         # React frontend
├── server/         # Node.js backend (chat & auth)
├── ml_service/     # FastAPI ML moderation service
├── docker/         # Docker configurations
└── README.md
```

#⚡ Quick Start Guide
1️⃣ Launch the Frontend (React)
```bash
cd client
npm install
npm run dev
```

2️⃣ Launch the Chat Backend (Node.js + Express + Socket.IO)
```bash
cd server
npm install
npm run dev
```

3️⃣ Launch the ML Moderation Service (FastAPI)
```bash
cd ml_service
python -m venv venv
# For Linux/macOS:
source venv/bin/activate
# For Windows:
venv\Scripts\activate
pip install -r requirements.txt
```


🧠 Key Learnings & Highlights
- Seamless integration of deep learning models into real-time applications
- Efficient model downloading and caching in production
-Proper Socket.IO connection lifecycle management
- Scalable, modular project architecture



