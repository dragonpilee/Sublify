# Sublify 🎬
> **Containerized Subtitle Manager**

![Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge) ![Docker](https://img.shields.io/badge/Deployment-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) ![Astro](https://img.shields.io/badge/Framework-Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white) ![Python](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)

**Sublify** is a modern, fully dockerized subtitle manager featuring **Smart Drag & Drop** with intelligent conflict resolution. Built for simplicity and performance with zero-configuration deployment.

---

## ✨ Features

- **🎯 Smart Drag & Drop**: Drop your movie file - we find it in your library and download the subtitle
- **🔍 Intelligent Search**: Optimized file scanning with directory exclusions for lightning-fast searches
- **⚖️ Conflict Resolution**: Multiple file copies? Interactive modal lets you choose the exact path
- **📊 Dynamic Stats**: Real-time tracking of downloads and bandwidth saved
- **🎨 Cinema-Grade UI**: Premium dark theme with glassmorphism effects
- **📱 Cross-Platform**: Run on Windows, Mac, Linux, or NAS. Control from any device on your network
- **🌐 Universal Support**: Works with 50+ video formats (`.mkv`, `.mp4`, `.avi`, `.webm`, `.mov`...)
- **🚀 Auto-Download**: Single match? Instant subtitle download with visual feedback
- **📲 Mobile Optimized**: Fully responsive design with touch-friendly controls
- **🔒 Secure**: No cloud dependencies - runs entirely on your local network
- **⚡ Fast API**: Python FastAPI backend with async subtitle fetching
- **🐳 Docker-Only**: Pure containerized deployment - no local dependencies

---

## 🚀 Quick Start

### Prerequisites

1.  **Docker Desktop**: Ensure Docker is installed and running.
2.  **Git**: To clone the repository.
    * *Note: No Node.js, Python, or npm is required on your host machine.*

### Installation & Run

1.  Clone the repository and navigate to the root:
    ```bash
    git clone https://github.com/dragonpilee/Sublify.git
    cd Sublify
    ```

2.  **Configure Volume Mapping** (Important):
    Edit `docker-compose.yml` and update the volume path to match your media library:
    ```yaml
    services:
      backend:
        volumes:
          - D:/:/data  # Windows: Change D:/ to your drive
          # - /path/to/movies:/data  # Linux/Mac: Use absolute path
    ```

3.  Build and launch the containers:
    ```bash
    docker-compose up -d --build
    ```

4.  Open your browser and visit:
    **[http://localhost:4321](http://localhost:4321)**

### Docker Commands

```bash
# Restart containers
docker-compose restart

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build
```

---

## 🛠️ Technology Stack

| Component | Technology |
|----------|------------|
| **Frontend Framework** | Astro 5 (React Islands) |
| **Backend Framework** | FastAPI (Python 3.10+) |
| **Styling** | TailwindCSS |
| **Subtitle Engine** | Subliminal |
| **Infrastructure** | Docker, Docker Compose |

---

## 📱 Remote Access (Mobile/Tablet)

Since Sublify runs in Docker, you can access it from any device on your Wi-Fi:

1.  Find your PC's local IP address:
    ```bash
    # Windows
    ipconfig
    
    # Linux/Mac
    ifconfig
    ```

2.  Open `http://YOUR_PC_IP:4321` on your phone/tablet
    - Example: `http://192.168.1.50:4321`

3.  **Note**: The app controls the *server's* files. Dropping a file triggers subtitle download on the *server*, not your mobile device.

---

## 🎨 Design Philosophy

- **Cinema-Grade Aesthetics**: Deep blacks, cinema reds/purples, glassmorphism info cards
- **Smart Feedback**: Visual status indicators for success, error, and processing states
- **Minimal Clutter**: Clean interface - just the Drop Zone and Stats
- **Responsive First**: Optimized padding, text sizes, and touch targets for mobile
- **SEO Optimized**: Proper meta tags for social sharing and discoverability

---

## 🎯 How It Works

1.  **Drop a File**: Drag your movie file from Explorer/Finder into the Drop Zone
2.  **Smart Search**: Backend searches your entire library for matching files
3.  **Conflict Resolution**: 
    - **Single Match**: Instant download ✅
    - **Multiple Matches**: Modal appears - select the correct path
4.  **Download**: Subtitle (.srt) saved next to your video file
5.  **Stats Update**: Dashboard reflects your download count and bandwidth saved

---

## 🤝 Contributing

**Important:** This project enforces a strict Docker-only workflow.

1.  **Fork & Branch**: Create a new branch for your feature.
2.  **Develop**: Test all changes inside the container (`docker-compose up`).
3.  **Commit & Push**: Submit your changes via Pull Request.

---

## 📝 License

This project is open source and available under the MIT License.

---

<div align="center">
  <sub>Developed with ❤️ by CineGeek</sub><br>
  <sub>Cinema-Grade Subtitle Manager • Docker-Only Deployment</sub>
</div>
