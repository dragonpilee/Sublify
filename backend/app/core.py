import os
from pathlib import Path
from typing import List, Set, Dict, Any
from babelfish import Language
from subliminal import (
    scan_video,
    download_best_subtitles,
    save_subtitles,
    region,
)

# Configure caching
region.configure("dogpile.cache.memory")

VIDEO_EXTS = {
    ".3g2", ".3gp", ".3gp2", ".3gpp", ".amv", ".asf", ".avi", ".divx", ".drc", ".dv", 
    ".f4v", ".flv", ".gvi", ".gxf", ".iso", ".m1v", ".m2t", ".m2ts", ".m2v", ".m4v", 
    ".mkv", ".mov", ".mp2", ".mp2v", ".mp4", ".mp4v", ".mpe", ".mpeg", ".mpeg1", 
    ".mpeg2", ".mpeg4", ".mpg", ".mpv", ".mpv2", ".mts", ".mtv", ".mxf", ".nsv", 
    ".nuv", ".ogg", ".ogm", ".ogv", ".ogx", ".ps", ".rec", ".rm", ".rmvb", ".tod", 
    ".ts", ".tts", ".vob", ".vro", ".webm", ".wm", ".wmv", ".wtv", ".xesc"
}

class SublifyCore:
    def __init__(self):
        self.config = {
            "opensubtitles": {
                "username": os.getenv("OPENSUBTITLES_USERNAME", ""),
                "password": os.getenv("OPENSUBTITLES_PASSWORD", "")
            }
        }
        self.stats_file = Path("stats.json")
        self._init_stats()
        
    def _init_stats(self):
        if not self.stats_file.exists():
            self._save_stats({"downloads": 0, "bandwidth_bytes": 0})

    def _load_stats(self) -> Dict[str, int]:
        try:
            import json
            if self.stats_file.exists():
                return json.loads(self.stats_file.read_text())
        except:
            pass
        return {"downloads": 0, "bandwidth_bytes": 0}

    def _save_stats(self, stats: Dict[str, int]):
        import json
        self.stats_file.write_text(json.dumps(stats))

    def get_stats(self):
        return self._load_stats()

    def _increment_stats(self, video: Any):
        stats = self._load_stats()
        stats["downloads"] += 1
        # Add video size to 'bandwidth' metric (simulating data processed)
        stats["bandwidth_bytes"] += video.size
        self._save_stats(stats)   

    def update_config(self, new_config: Dict[str, Any]):
        self.config.update(new_config)

    def scan_path(self, path_str: str) -> List[Dict[str, Any]]:
        target = Path(path_str)
        items = []
        
        if target.is_dir():
            try:
                for p in target.iterdir():
                    if p.is_dir():
                        items.append({
                            "name": p.name,
                            "path": str(p.absolute()),
                            "type": "dir",
                            "size": 0,
                            "has_subtitle": False
                        })
                    elif p.is_file() and p.suffix.lower() in VIDEO_EXTS:
                        data = self._serialize_video(p)
                        data["type"] = "file"
                        items.append(data)
            except PermissionError:
                pass # Skip unreadable
        
        # Sort: Directories first, then files (case-insensitive)
        items.sort(key=lambda x: (x["type"] != "dir", x["name"].lower()))     
        return items

    def _serialize_video(self, path: Path) -> Dict[str, Any]:
        return {
            "name": path.name,
            "path": str(path.absolute()),
            "size": path.stat().st_size,
            "has_subtitle": self._has_existing_subtitles(path)
        }

    def _has_existing_subtitles(self, video_path: Path) -> bool:
        # Simple check for any .srt with same base name
        base = video_path.with_suffix("")
        # Check standard .srt and lang specific like .en.srt
        # This is a basic check, can be improved
        if base.with_suffix(".srt").exists():
            return True
        # Check common logic for any language
        parent = video_path.parent
        for f in parent.glob(f"{base.name}*.srt"):
            return True
        return False

    def download_subtitles(self, msg_path: str, languages: List[str], providers: List[str], hi: bool, force: bool) -> Dict[str, Any]:
        vid_path = Path(msg_path)
        langset = self._lang_list_to_babelfish(languages)
        
        # OpenSubtitles Auth (Config > Env)
        provider_configs = {}
        # Deep merge or check config first
        os_conf = self.config.get("opensubtitles", {})
        ou = os_conf.get("username") or os.getenv("OPENSUBTITLES_USERNAME")
        op = os_conf.get("password") or os.getenv("OPENSUBTITLES_PASSWORD")
        
        if ou and op and 'opensubtitles' in providers:
            provider_configs["opensubtitles"] = {"username": ou, "password": op}

        video = scan_video(str(vid_path))
        if not video:
            return {"success": False, "error": "Could not parse video metadata"}

        subs_map = download_best_subtitles(
            {video},
            langset,
            providers=providers,
            provider_configs=provider_configs,
            hearing_impaired=hi,
        )
        
        subs = subs_map.get(video, [])
        print(f"[Sublify] Matches for {video.name}: {len(subs)}")
        
        if not subs:
            print(f"[Sublify] No subtitles found for {video.name}")
            return {"success": False, "message": "No subtitles found (try logged-in providers)"}
            
        print(f"[Sublify] Saving {len(subs)} subtitles for {video.name}...")
        try:
            # Explicitly checking target directory
            target_dir = Path(msg_path).parent
            print(f"[Sublify] Target Directory: {target_dir} (Exists: {target_dir.exists()})")
            
            save_subtitles(video, subs)
            print(f"[Sublify] Save successful. Check {target_dir}")
            
            # Verify file creation
            expected_srt = target_dir / (Path(video.name).stem + ".en.srt")
            if expected_srt.exists():
                print(f"[Sublify] Verified .srt exists at: {expected_srt}")
            else:
                 print(f"[Sublify] WARNING: .srt not found at expected check: {expected_srt}")

            self._increment_stats(video)
        except Exception as e:
            print(f"[Sublify] Save failed: {e}")
            import traceback
            traceback.print_exc()
            return {"success": False, "message": f"Write error: {str(e)}"}
        
        # Get best sub info
        best = subs[0] # They are usually sorted by score
        return {
            "success": True,
            "language": str(best.language),
            "provider": getattr(best, 'provider_name', 'unknown'),
            "score": getattr(best, 'score', 0)
        }

    def search_by_name(self, filename: str) -> List[Path]:
        """
        Efficiently searches for a file by name in /data, skipping system dirs.
        """
        print(f"[Sublify] Searching for: {filename}")
        matches = []
        try:
            # Optimized search: os.walk with exclusions
            ignored_dirs = {'.git', 'node_modules', '$RECYCLE.BIN', 'System Volume Information', 'venv', '__pycache__'}
            
            for root, dirs, files in os.walk("/data"):
                # Modify dirs in-place to skip ignored
                dirs[:] = [d for d in dirs if d not in ignored_dirs and not d.startswith('.')]
                
                if filename in files:
                    p = Path(root) / filename
                    if p.suffix.lower() in VIDEO_EXTS:
                        matches.append(p)
        except Exception as e:
            print(f"[Sublify] Search error: {e}")
            
        print(f"[Sublify] Found matches: {matches}")
        return matches

    def search_and_download(self, filename: str, languages: List[str], providers: List[str], hi: bool, force: bool) -> List[Dict[str, Any]]:
        matches = self.search_by_name(filename)

        results = []
        if matches:
            for match in matches:
                if match.is_file():
                    res = self.download_subtitles(str(match), languages, providers, hi, force)
                    # Append result structure expected by the API
                    results.append({
                        "file": match.name,
                        "path": str(match),
                        "success": res.get("success", False),
                        "result": res
                    })
        else:
             print(f"[Sublify] No matches found for {filename}")
             
        return results

    def _lang_list_to_babelfish(self, langs: List[str]) -> Set[Language]:
        out = set()
        for l in langs:
            try:
                out.add(Language.fromietf(l))
            except:
                try:
                    out.add(Language(l))
                except:
                    pass
        return out
