# Sublify

Sublify is a simple Python-based subtitle downloader powered by [subliminal](https://github.com/Diaoul/subliminal). It can fetch the best matching subtitles for your movies and TV shows directly from the command line.

---

## ✨ Features

- Download subtitles for single files or whole folders
- Supports recursive scanning
- Multi-language support (e.g., `en`, `hi`, `pt-BR`)
- Supports OpenSubtitles login for better results
- Respects existing subtitles unless forced
- Dry-run mode to preview downloads
- Cross-platform (Windows, macOS, Linux)

---

## 📦 Installation

We recommend installing in a dedicated conda or virtual environment.

### Using Conda (Windows)

```powershell
conda create -n subs python=3.10 -y
conda activate subs
pip install subliminal babelfish click dogpile.cache pysrt
```

### Manual Clone

Save `sublify.py` anywhere you like (e.g., `D:\sub\sublify.py`).

---

## 🚀 Usage

### Basic examples

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

### OpenSubtitles Login (optional but recommended)

For better results and fewer rate limits, set environment variables:

```powershell
setx OPENSUBTITLES_USERNAME "your_username"
setx OPENSUBTITLES_PASSWORD "your_password"
```

Restart PowerShell after setting.

---

## ⚙️ Options

| Option              | Description                                                                 |
| ------------------- | --------------------------------------------------------------------------- |
| `-l`, `--language`  | Subtitle language(s) (can be used multiple times)                           |
| `-r`, `--recursive` | Scan folders recursively                                                    |
| `--hi`              | Prefer hearing-impaired subtitles                                           |
| `--force`           | Overwrite existing subtitles                                                |
| `--dry-run`         | Show actions without downloading                                            |
| `--provider`        | Specify subtitle providers (default: opensubtitles, podnapisi, tvsubtitles) |
| `--min-score`       | Minimum score for subtitles                                                 |
| `--delay`           | Delay between downloads to avoid rate limits                                |

---

## 📝 License

MIT License — do whatever you like, but attribution is appreciated.

---

## 🙌 Credits

Built on top of the excellent [subliminal](https://github.com/Diaoul/subliminal) library.

Created by **Alan Cyril Sunny** as *Sublify*.
