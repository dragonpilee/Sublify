from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from pathlib import Path
import os
from app.core import SublifyCore

router = APIRouter()
core = SublifyCore()

class ScanRequest(BaseModel):
    path: str
    recursive: bool = False

class DownloadRequest(BaseModel):
    file_path: str
    languages: List[str] = ["en"]
    providers: List[str] = ["opensubtitles", "podnapisi"]
    hearing_impaired: bool = False
    force: bool = False

class ConfigRequest(BaseModel):
    opensubtitles_username: Optional[str] = None
    opensubtitles_password: Optional[str] = None

@router.get("/stats")
def get_stats():
    return core.get_stats()

@router.get("/scan")
def scan_directory(path: str = Query(..., description="Absolute path to scan")):
    """
    Scans a directory for video files.
    """
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Path not found")
    
    videos = core.scan_path(path)
    return {"path": path, "videos": videos}

@router.post("/download")
def download_subtitle(req: DownloadRequest):
    """
    Downloads subtitle for a specific video file.
    """
    if not os.path.exists(req.file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    result = core.download_subtitles(
        msg_path=req.file_path,
        languages=req.languages,
        providers=req.providers,
        hi=req.hearing_impaired,
        force=req.force
    )
    return result

@router.post("/config")
def update_configuration(config: ConfigRequest):
    new_conf = {
        "opensubtitles": {
            "username": config.opensubtitles_username,
            "password": config.opensubtitles_password
        }
    }
    core.update_config(new_conf)
    return {"status": "updated", "config": new_conf}

class SmartDownloadRequest(BaseModel):
    filename: str
    languages: List[str] = ["en"]

@router.post("/smart-download")
def smart_download(req: SmartDownloadRequest):
    """
    Accepts a filename (e.g. 'Matrix.mkv'), searches for it in the volume,
    and downloads subtitles.
    """
    results = core.search_and_download(
        filename=req.filename,
        languages=req.languages,
        providers=["opensubtitles", "podnapisi"],
        hi=False,
        force=False
    )
    
    if not results:
        return {"found": False, "message": "File not found in mounted directories."}
        
    # Summarize results
    success_count = sum(1 for r in results if r.get("success"))
    paths = [r.get("path") for r in results]
    
    return {
        "found": True, 
        "matches": len(results),
        "success_count": success_count,
        "results": results,
        "message": f"Found {len(results)} copies. Downloaded {success_count} subtitles."
    }

@router.post("/smart-search")
def smart_search(req: SmartDownloadRequest):
    """
    Search for a file by name but do NOT download.
    Returns list of matching paths.
    """
    matches = core.search_by_name(req.filename)
    return {
        "found": len(matches) > 0,
        "count": len(matches),
        "matches": [{"path": str(m), "dir": str(m.parent)} for m in matches]
    }
