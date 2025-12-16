# Sublify - Cinema-Grade Subtitle Searcher 🎬

> **Automated. Beautiful. Cross-Platform.**
> *Developed with ❤️ by CineGeek*
>
> [**View on GitHub**](https://github.com/dragonpilee/Sublify)

Sublify is a modern, containerized web application that finds and downloads perfect subtitles for your local video library. It replaces clunky CLI tools with a stunning "Smart Drop Zone" interface.

> [!NOTE]
> **Why not Netlify?** Sublify is designed to run locally via Docker because it requires direct access to your physical file system (the D: drive) to clean up and subtitle your media. A cloud deployment (like Netlify) cannot interact with your local hard drive.

## 🚀 Features

*   **Smart Drag & Drop**: Just drop your movie file. We find it in your library and download the sub.
*   **Conflict Resolution**: Intelligent matching system asks you for confirmation if multiple file copies exist.
*   **Dynamic Stats**: Tracks your total downloads and bandwidth saved.
*   **Universal Support**: Works with 50+ video formats (`.mkv`, `.mp4`, `.avi`, `.webm`...).
*   **Cross-Platform**: Run on Windows, Mac, Linux, or a NAS. Control it from your Phone (Android/iOS).

## 🛠️ Installation & Usage

### 1. Requirements
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

### 2. Quick Start (Windows)
1.  Clone this repo.
2.  Open `docker-compose.yml` and check the volume `D:/` is mounted to `/data`. Change this if your movies are elsewhere.
3.  Run:
    ```powershell
    docker-compose up -d --build
    ```
4.  Open **[http://localhost:4321](http://localhost:4321)**.
5.  Drag and drop your files!

### 3. Cross-Platform Setup (Linux / Mac)
To run Sublify on macOS or Linux, simply update the volume mapping in `docker-compose.yml`:

```yaml
services:
  backend:
    volumes:
      - /path/to/your/movies:/data  # <--- Update this line
```

### 4. Remote Control (Android / iOS)
Since Sublify runs in Docker, you can access it from any device on your Wi-Fi:
1.  Find your PC's local IP (e.g., `192.168.1.50`).
2.  Open `http://192.168.1.50:4321` on your phone.
3.  **Note**: The app controls the *server's* files. Dropping a file name triggers a download on the *server*, not your phone.

## 🤝 Contributing
Built with Astro, React, Python FastAPI, and TailwindCSS.
Pull requests welcome!

---
*© 2024 CineGeek*
