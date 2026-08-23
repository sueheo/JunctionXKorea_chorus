#!/usr/bin/env python3
import argparse
import subprocess
import sys
import unicodedata
from collections import deque
from pathlib import Path


ROLE_NAMES = {
    "검사자": "reviewer",
    "기준작성자": "criteria",
    "진행관리자": "orchestrator",
    "최종판정자": "judge",
    "코드작성자": "coder",
}

STATE_NAMES = {
    "기본": "default",
    "대기": "idle",
    "보류": "ready",
    "진행중": "working",
    "완료": "completed",
    "성공": "completed",
    "실패": "error",
}


def normalized_name(path: Path) -> str:
    return unicodedata.normalize("NFC", path.stem if path.is_file() else path.name).replace(" ", "")


def edge_connected_background(dark_mask):
    import numpy as np

    height, width = dark_mask.shape
    background = np.zeros_like(dark_mask, dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    def push(y: int, x: int) -> None:
        if dark_mask[y, x] and not background[y, x]:
            background[y, x] = True
            queue.append((y, x))

    for x in range(width):
        push(0, x)
        push(height - 1, x)
    for y in range(height):
        push(y, 0)
        push(y, width - 1)

    while queue:
        y, x = queue.popleft()
        if y > 0:
            push(y - 1, x)
        if y + 1 < height:
            push(y + 1, x)
        if x > 0:
            push(y, x - 1)
        if x + 1 < width:
            push(y, x + 1)

    return background


def process_frame(frame: bytes, width: int, height: int, threshold: int) -> bytes:
    import numpy as np

    rgb = np.frombuffer(frame, dtype=np.uint8).reshape((height, width, 3)).copy()
    dark_mask = np.all(rgb <= threshold, axis=2)
    background = edge_connected_background(dark_mask)

    alpha = np.full((height, width), 255, dtype=np.uint8)
    alpha[background] = 0

    rgba = np.dstack((rgb, alpha))
    return rgba.tobytes()


def convert_video(source: Path, destination: Path, size: int, fps: int, threshold: int, crf: int) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    if source_has_alpha(source):
        convert_video_with_alpha(source, destination, size, fps, crf)
        return

    frame_size = size * size * 3

    decoder = subprocess.Popen(
        [
            "ffmpeg",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-an",
            "-vf",
            f"fps={fps},scale={size}:{size}:flags=lanczos,format=rgb24",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "pipe:1",
        ],
        stdout=subprocess.PIPE,
    )

    encoder = subprocess.Popen(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgba",
            "-s",
            f"{size}x{size}",
            "-r",
            str(fps),
            "-i",
            "pipe:0",
            "-an",
            "-c:v",
            "libvpx-vp9",
            "-pix_fmt",
            "yuva420p",
            "-b:v",
            "0",
            "-crf",
            str(crf),
            "-row-mt",
            "1",
            "-auto-alt-ref",
            "0",
            str(destination),
        ],
        stdin=subprocess.PIPE,
    )

    assert decoder.stdout is not None
    assert encoder.stdin is not None

    try:
        while True:
            frame = decoder.stdout.read(frame_size)
            if not frame:
                break
            if len(frame) != frame_size:
                raise RuntimeError(f"Incomplete frame from {source}")
            encoder.stdin.write(process_frame(frame, size, size, threshold))
    finally:
        decoder.stdout.close()
        encoder.stdin.close()

    decoder_code = decoder.wait()
    encoder_code = encoder.wait()
    if decoder_code != 0 or encoder_code != 0:
        raise RuntimeError(f"ffmpeg failed for {source} -> {destination}")


def source_has_alpha(source: Path) -> bool:
    result = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-select_streams",
            "v:0",
            "-show_entries",
            "stream=pix_fmt",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(source),
        ],
        capture_output=True,
        check=True,
        text=True,
    )
    pix_fmt = result.stdout.strip().lower()
    return pix_fmt.startswith(("yuva", "rgba", "bgra", "argb", "abgr", "gbrap", "ya"))


def convert_video_with_alpha(source: Path, destination: Path, size: int, fps: int, crf: int) -> None:
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(source),
            "-an",
            "-vf",
            f"fps={fps},scale={size}:{size}:flags=lanczos,format=yuva420p",
            "-c:v",
            "libvpx-vp9",
            "-pix_fmt",
            "yuva420p",
            "-b:v",
            "0",
            "-crf",
            str(crf),
            "-row-mt",
            "1",
            "-auto-alt-ref",
            "0",
            str(destination),
        ],
        check=True,
    )


def iter_sources(source_root: Path) -> list[tuple[Path, str, str]]:
    sources: list[tuple[Path, str, str]] = []
    for role_dir in sorted(source_root.iterdir()):
        if not role_dir.is_dir():
            continue
        role = ROLE_NAMES.get(normalized_name(role_dir))
        if not role:
            continue
        for video in sorted([*role_dir.glob("*.mov"), *role_dir.glob("*.mp4")]):
            state = STATE_NAMES.get(normalized_name(video))
            if not state:
                continue
            sources.append((video, role, state))
    return sources


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", required=True, type=Path)
    parser.add_argument("--dest", required=True, type=Path)
    parser.add_argument("--size", default=360, type=int)
    parser.add_argument("--fps", default=24, type=int)
    parser.add_argument("--threshold", default=42, type=int)
    parser.add_argument("--crf", default=34, type=int)
    args = parser.parse_args()

    sources = iter_sources(args.source)
    if not sources:
        print("No source videos found.", file=sys.stderr)
        return 1

    for source, role, state in sources:
        destination = args.dest / role / f"{state}.webm"
        print(f"{source} -> {destination}")
        convert_video(source, destination, args.size, args.fps, args.threshold, args.crf)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
