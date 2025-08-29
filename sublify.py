#!/usr/bin/env python3
"""
Sublify - Python-based subtitle downloader (single-file, cross-platform).

Features
- Works on files or folders (recursively, if you want)
- Picks the best matching subtitle using `subliminal`
- Supports multiple languages (ISO 639-1 like "en", "fr" or BCP-47 like "pt-BR")
- Optional OpenSubtitles login via env vars (OPENSUBTITLES_USERNAME / OPENSUBTITLES_PASSWORD)
- Respects existing subtitles unless --force is set
- Dry-run mode to preview what would be downloaded

Install (recommended in a fresh environment):
    pip install subliminal babelfish click dogpile.cache pysrt

On Windows with conda, you can do:
    conda create -n subs python=3.11 -y
    conda activate subs
    pip install subliminal babelfish click dogpile.cache pysrt

Examples
    # Download English subs for a single file
    python sublify.py "D:/Movies/Inception (2010).mkv"

    # Download English + Hindi subs for a whole folder, recursively
    python sublify.py "D:/Shows/" -r -l en -l hi

    # Prefer hearing-impaired and overwrite existing subtitles
    python sublify.py "D:/Movies" -r --hi --force

    # Use OpenSubtitles login (set once in your shell)
    set OPENSUBTITLES_USERNAME=myuser
    set OPENSUBTITLES_PASSWORD=mysupersecret
    python sublify.py "D:/Movies" -r

Notes
- Providers used by default: OpenSubtitles, Podnapisi, TVSubtitles.
- You can customize providers with --provider multiple times.
- Some providers require accounts; OpenSubtitles works better when logged in.
"""
from __future__ import annotations

import os
import sys
import time
from pathlib import Path
from typing import Iterable, List, Set, Dict

import click
from babelfish import Language
from subliminal import (
    scan_video,
    download_best_subtitles,
    save_subtitles,
    region,
)

# Configure subliminal caching to speed up repeated runs
region.configure("dogpile.cache.memory")

# Common video file extensions
VIDEO_EXTS = {".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".ts", ".m2ts"}


def resolve_videos(targets: Iterable[Path], recursive: bool) -> List[Path]:
    """Return a list of video file paths from targets.
    If a target is a directory, include files inside (optionally recursively).
    """
    files: List[Path] = []
    for t in targets:
        if t.is_file() and t.suffix.lower() in VIDEO_EXTS:
            files.append(t)
        elif t.is_dir():
            if recursive:
                for p in t.rglob("*"):
                    if p.is_file() and p.suffix.lower() in VIDEO_EXTS:
                        files.append(p)
            else:
                for p in t.glob("*"):
                    if p.is_file() and p.suffix.lower() in VIDEO_EXTS:
                        files.append(p)
    return sorted(files)


def has_existing_subtitles(video_path: Path, languages: Set[Language]) -> bool:
    base = video_path.with_suffix("")
    for lang in languages:
        # subliminal typically saves as <name>.<lang>.srt (e.g., movie.en.srt)
        srt_lang = base.with_suffix(f".{lang}.srt")
        srt_plain = base.with_suffix(".srt")
        if srt_lang.exists() or srt_plain.exists():
            return True
    return False


def _lang_list_to_babelfish(langs: List[str]) -> Set[Language]:
    out: Set[Language] = set()
    for l in langs:
        parsed = None
        for parser in (
            lambda x: Language(x),  # tries common forms like 'en'
            Language.fromalpha2,
            Language.fromalpha3b,
            Language.fromalpha3t,
            Language.fromietf,      # e.g., 'pt-BR'
        ):
            try:
                parsed = parser(l)
                break
            except Exception:
                continue
        if not parsed:
            raise click.BadParameter(f"Invalid language code: {l}")
        out.add(parsed)
    return out


@click.command(context_settings={"help_option_names": ["-h", "--help"]})
@click.argument("paths", nargs=-1, type=click.Path(path_type=Path, exists=True))
@click.option(
    "--language",
    "languages",
    "-l",
    multiple=True,
    default=["en"],
    show_default=True,
    help="Language(s) to download, e.g. en, fr, pt-BR. Can be used multiple times.",
)
@click.option("--recursive", "-r", is_flag=True, help="Recurse into folders.")
@click.option("--hi", is_flag=True, help="Prefer hearing-impaired subtitles.")
@click.option("--min-score", type=int, default=0, show_default=True, help="Minimum score to accept.")
@click.option(
    "--provider",
    "providers",
    multiple=True,
    default=["opensubtitles", "podnapisi", "tvsubtitles"],
    show_default=True,
    help="Subtitle providers to use. Can be specified multiple times.",
)
@click.option("--force", is_flag=True, help="Overwrite existing subtitles if present.")
@click.option("--dry-run", is_flag=True, help="Show what would be downloaded without saving.")
@click.option("--delay", type=float, default=0.0, show_default=True, help="Delay seconds between videos (helps avoid rate limits).")
def main(paths: List[Path], languages: List[str], recursive: bool, hi: bool, min_score: int,
         providers: List[str], force: bool, dry_run: bool, delay: float):
    """Download subtitles for files or folders.

    PATHS can be one or more files and/or directories.
    """
    if not paths:
        click.echo("No paths provided. See --help for usage.")
        sys.exit(1)

    # Auth via environment variables (optional but helps with rate limits/accuracy)
    provider_configs: Dict[str, dict] = {}
    ou = os.getenv("OPENSUBTITLES_USERNAME")
    op = os.getenv("OPENSUBTITLES_PASSWORD")
    if ou and op:
        provider_configs["opensubtitles"] = {"username": ou, "password": op}

    # Prepare languages
    langset = _lang_list_to_babelfish(list(languages))

    # Collect videos
    video_files = resolve_videos(paths, recursive)
    if not video_files:
        click.echo("No video files found.")
        sys.exit(2)

    click.echo(f"Found {len(video_files)} video(s). Providers: {', '.join(providers)}. Languages: {', '.join(str(l) for l in langset)}")

    # Process each video
    successes = 0
    failures = 0

    for vid_path in video_files:
        try:
            if not force and has_existing_subtitles(vid_path, langset):
                click.echo(f"[skip] {vid_path.name} — subtitles already exist. Use --force to overwrite.")
                continue

            video = scan_video(str(vid_path))
            if not video:
                click.echo(f"[warn] Could not parse video: {vid_path}")
                failures += 1
                continue

            click.echo(f"Searching: {vid_path.name}")
            subs_map = download_best_subtitles(
                {video},
                langset,
                providers=list(providers),
                provider_configs=provider_configs,
                hearing_impaired=hi,
                min_score=min_score,
            )

            subs = subs_map.get(video, set())
            if not subs:
                click.echo("  No suitable subtitles found.")
                failures += 1
            else:
                if dry_run:
                    for s in subs:
                        score = getattr(s, 'score', None)
                        score_txt = f" (score={score})" if score is not None else ""
                        prov = getattr(s, 'provider_name', getattr(s, 'provider', 'unknown'))
                        click.echo(f"  [dry-run] would save: {s.language} from {prov}{score_txt}")
                else:
                    save_subtitles(video, subs)
                    # Safely pick one for logging (no reliance on optional 'score')
                    def score_of(x):
                        return getattr(x, 'score', 0)
                    best = sorted(subs, key=score_of, reverse=True)[0]
                    prov = getattr(best, 'provider_name', getattr(best, 'provider', 'unknown'))
                    score = getattr(best, 'score', None)
                    score_txt = f" (score={score})" if score is not None else ""
                    click.echo(f"  Saved: {best.language} from {prov}{score_txt}")
                    successes += 1

            if delay > 0:
                time.sleep(delay)

        except KeyboardInterrupt:
            click.echo("Interrupted by user.")
            sys.exit(130)
        except Exception as e:
            failures += 1
            click.echo(f"[error] {vid_path.name}: {e}")

    click.echo(f"\nDone. Success: {successes}, Failures: {failures}")
    sys.exit(0 if successes > 0 and failures == 0 else (1 if successes == 0 else 0))


if __name__ == "__main__":
    main()
