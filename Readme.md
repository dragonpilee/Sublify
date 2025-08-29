# ⚡ SUBLIFY - Effortless Subtitle Downloader v1.0

![Sublify Banner](https://img.shields.io/badge/Sublify-v1.0-magenta?style=flat-square)
![Engine](https://img.shields.io/badge/Engine-subliminal-blue?style=flat-square)
![Creator](https://img.shields.io/badge/Creator-Alan%20Cyril%20Sunny-green?style=flat-square)
![Python](https://img.shields.io/badge/Language-Python%203.10+-blue)
![Terminal](https://img.shields.io/badge/UI-Terminal%20(CLI)-purple)
![MIT License](https://img.shields.io/badge/License-MIT-blue)

> **Developed by ALAN CYRIL SUNNY**  
> If you like this project, please ⭐ [star the repository](https://github.com/dragonpilee/sublify)!

---

## 🧠 SUBLIFY - Effortless Subtitle Downloader

A fast, simple, and reliable terminal-based subtitle downloader powered by [subliminal](https://github.com/Diaoul/subliminal).

- 💬 Download subtitles for single files or entire folders  
- 🌍 Multi-language support (e.g., `en`, `hi`, `pt-BR`)  
- 🔑 OpenSubtitles login for better results  
- 🛡️ Respects existing subtitles unless forced  
- 🧪 Dry-run mode to preview downloads  
- 🖥️ Cross-platform (Windows, macOS, Linux)  
- ⚡ **Recursive scanning and provider selection for full control**

---

## ✨ Features

- **Single File or Folder**: Download for one file or scan entire directories.
- **Recursive Mode**: Search subfolders automatically.
- **Multi-language**: Fetch subtitles in multiple languages at once.
- **OpenSubtitles Login**: Use your credentials for higher quality and fewer limits.
- **Safe by Default**: Won’t overwrite existing subtitles unless you ask.
- **Dry-run**: Preview what would be downloaded.
- **Custom Providers**: Choose from opensubtitles, podnapisi, tvsubtitles, and more.
- **Cross-platform**: Works on Windows, macOS, and Linux.

---

## 🛠️ Tech Stack

- **Language**: Python 3.10+
- **Subtitle Engine**: [subliminal](https://github.com/Diaoul/subliminal)
- **Terminal UI**: Command-line interface (CLI)
- **Dependencies**: `subliminal`, `babelfish`, `click`, `dogpile.cache`, `pysrt`

---

## 💻 Requirements

- Python 3.10 or higher
- Required Python packages (see below)
- *(Optional)* OpenSubtitles account for best results

---

## 📦 Installation

We recommend using a dedicated conda or virtual environment.

### Using Conda (Windows)

```powershell
conda create -n subs python=3.10 -y
conda activate subs
pip install subliminal babelfish click dogpile.cache pysrt
```

### Manual Clone

Save `sublify.py` anywhere you like (e.g., `D:\sub\sublify.py`).

---

## 🚀 Quick Start

With your environment ready, launch Sublify:

```powershell
python D:\sub\sublify.py "D:\Movies\Inception (2010).mkv" -l en
```

You'll see download progress and results in your terminal.  
Type `--help` for all options.

---

## 📝 Usage Examples

Download English subtitle for a single movie:

```powershell
python D:\sub\sublify.py "D:\Movies\Inception (2010).mkv" -l en
```

Download English + Hindi subtitles for a whole folder, recursively:

```powershell
python D:\sub\sublify.py "D:\Shows" -r -l en -l hi
```

Force overwrite existing subs and prefer hearing-impaired versions:

```powershell
python D:\sub\sublify.py "D:\Movies" -r --force --hi
```

---

## 🔑 OpenSubtitles Login (Recommended)

For better results and fewer rate limits, set environment variables:

```powershell
setx OPENSUBTITLES_USERNAME "your_username"
setx OPENSUBTITLES_PASSWORD "your_password"
```

Restart PowerShell after setting.

---

## ⚙️ Options

| Option              | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| `-l`, `--language`  | Subtitle language(s) (can be used multiple times)                           |
| `-r`, `--recursive` | Scan folders recursively                                                    |
| `--hi`              | Prefer hearing-impaired subtitles                                           |
| `--force`           | Overwrite existing subtitles                                                |
| `--dry-run`         | Show actions without downloading                                            |
| `--provider`        | Specify subtitle providers (default: opensubtitles, podnapisi, tvsubtitles) |
| `--min-score`       | Minimum score for subtitles                                                 |
| `--delay`           | Delay between downloads to avoid rate limits                                |

---

## 📁 Project Structure

```
📦 Sublify/
 ┣ sublify.py                # Main script
 ┗ Readme.md                 # Project README
```

---

## 📝 License

MIT License — free to use, modify, and share. Attribution appreciated.

---

## 🙌 Credits

Built on top of the excellent [subliminal](https://github.com/Diaoul/subliminal) library.

Created by **Alan Cyril Sunny** as
