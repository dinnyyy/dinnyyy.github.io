# MDN AR Assistant

A Mobile Augmented Reality assistant powered by a React frontend and a Python Flask backend. The core objective is to create "smart glasses" with a "photographic memory" feature. It leverages Google Gemini 2.5 Flash for high-speed AI vision and embeddings, local vector databases for semantic memory, and OpenAI's API for conversational intelligence, voice transcription (Whisper), and Text-to-Speech (TTS).

This project allows a user to walk around with their phone's camera and microphone active. They can ask questions about their environment, have the AI describe scenes, and automatically save "memories" of what they look at, which can be recalled later just by asking.

---

## 🏗️ Architecture

- **Frontend:** React + Vite (`react_ui/`). Captures the phone's camera frames and microphone audio using browser APIs, and streams them to the backend.
- **Backend:** Python Flask (`src/service.py` & `src/ai_processing.py`). 
  - **Vision:** Uses Google Gemini 2.5 Flash for high-speed object and scene description (memory snapshots), and OpenAI's `gpt-4o-mini` Vision for complex visual QA.
  - **Memory:** Uses Google Gemini Embeddings to create vector embeddings of scenes, storing them locally with time-based filtering.
  - **Voice:** Uses OpenAI Whisper for Speech-to-Text and OpenAI TTS for speech generation. Uses Server-Sent Events (SSE) to stream audio back to the frontend with ultra-low latency.

---

## 🛠️ Prerequisites

* **OS:** Windows / macOS / Linux
* **Python 3.10+** and Conda (Miniconda/Anaconda)
* **Node.js** 18+ and `npm`
* An active **OpenAI API Key**
* An active **Google Gemini API Key** (for fast vision and embeddings)
---

## 🚀 Setup Instructions

### 1. API Keys
Create a `.env` file in the root of the repository and add your API keys:
```bash
OPENAI_API_KEY=your_openai_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Backend (Python) Setup
We recommend using Conda to manage dependencies.

```bash
# Create and activate the conda environment
conda env create -f environment.yml
conda activate mdn_ar
```

### 3. Frontend (React) Setup
Open a **new terminal window**, navigate to the `react_ui` folder, and install the Node packages.

```bash
cd react_ui
npm install
```

---

## 📱 Running the App (Showcase / Mobile Setup)

To use the app on your phone, you need to run the backend, run the frontend, and then expose the frontend to the internet securely using a tunnel like `ngrok` so your phone's browser can access the camera and microphone over HTTPS.

### Step 1: Start the Backend
Keep this running in your first terminal:
```bash
conda activate mdn_ar
cd src
python service.py
```
*(The backend runs on `http://127.0.0.1:5000`)*

### Step 2: Start the Frontend
Keep this running in a second terminal:
```bash
cd react_ui
npm run dev
```
*(The frontend development server runs on `http://localhost:5173`)*

### Step 3: Connect Your Phone (Ngrok)
Because mobile browsers block camera/microphone access on plain `http` connections, you **must** use a secure `https` tunnel. We recommend `ngrok` or `localtunnel`.

Open a **third terminal** and run:
```bash
# Option A: Using npx localtunnel (No account required, but sometimes slow)
npx localtunnel --port 5173

# Option B: Using Ngrok (Requires a free ngrok account & authtoken)
ngrok http 5173
```

**On your phone:**
1. Open the secure `https://...` link provided by ngrok/localtunnel.
2. Grant Camera and Microphone permissions when the browser asks.
3. Tap **Start Camera** and begin testing!

---

## ✨ Features & Usage

* **Describe Scene:** Takes a picture of the current camera feed and asks OpenAI Vision to describe it.
* **Describe & Speak:** Same as above, but reads the description aloud using OpenAI TTS.
* **Save Memory:** Uses Google Gemini 2.5 Flash to rapidly describe the current frame, converts that description into a Gemini vector embedding, and saves it to a local database.
* **Talk (Microphone):** Hold a conversation with the AI. You can ask it to recall memories you saved earlier (e.g., *"Where did I leave my keys?"* or *"What was on the desk?"*).
* **Talk w/ Scene:** Speaks to the AI while simultaneously sending it a picture of what your camera is currently looking at.

### 🧹 Clearing Memories
If you want to reset the AI's memory before a new demo or showcase:
1. Stop the backend (`Ctrl+C`).
2. Delete the `metadata.json` and `vector_index.bin` files located inside `src/embeddings_db/`.
3. Restart the backend. Fresh, empty memory files will be automatically generated.
