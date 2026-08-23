import os
import re
import shutil
import subprocess
import tempfile
import zipfile
import math
from pathlib import Path
from urllib.parse import urlparse, parse_qs

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

app = FastAPI(title="YouTube Cortador Backend", version="1.1.0")

# GitHub Pages precisa conseguir chamar o backend.
# Em produção, troque * pela origem exata do seu GitHub Pages para maior segurança.
allowed_origins = [x.strip() for x in os.getenv("ALLOWED_ORIGINS", "*").split(",") if x.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"]
)

# CORRIGIDO: Termux não tem /tmp, então usa TMPDIR do sistema
TMPDIR = os.environ.get("TMPDIR", "/data/data/com.termux/files/usr/tmp")
WORK_ROOT = Path(os.getenv("WORK_ROOT", TMPDIR)) / "youtube-cortador"
WORK_ROOT.mkdir(parents=True, exist_ok=True)

ALLOWED_MINUTES = {1, 3, 5, 10}
YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"}

class CutRequest(BaseModel):
    url: str = Field(min_length=10, max_length=2048)
    minutes: int

class LiveCutRequest(BaseModel):
    url: str = Field(min_length=10, max_length=2048)
    chunk_minutes: int = Field(default=10, ge=1, le=60)

def validate_youtube_url(url: str) -> str:
    try:
        parsed = urlparse(url)
    except Exception:
        raise HTTPException(status_code=400, detail="URL inválida.")

    if parsed.scheme not in {"http", "https"} or parsed.hostname not in YOUTUBE_HOSTS:
        raise HTTPException(status_code=400, detail="Use somente um link válido do YouTube.")

    # Evita parâmetros que possam alterar comportamento de forma inesperada.
    # O yt-dlp recebe a URL original, mas somente depois desta validação.
    if parsed.hostname in {"youtube.com", "www.youtube.com", "m.youtube.com"}:
        if parsed.path == "/watch":
            video_id = parse_qs(parsed.query).get("v", [""])[0]
            if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
                raise HTTPException(status_code=400, detail="Link do YouTube inválido.")
        elif not (parsed.path.startswith("/shorts/") or parsed.path.startswith("/live/")):
            raise HTTPException(status_code=400, detail="Formato de link do YouTube não suportado.")
    elif parsed.hostname in {"youtu.be", "www.youtu.be"}:
        video_id = parsed.path.strip("/").split("/")[0]
        if not re.fullmatch(r"[A-Za-z0-9_-]{11}", video_id):
            raise HTTPException(status_code=400, detail="Link do YouTube inválido.")

    return url

def run_command(cmd: list[str], timeout: int = 3600) -> subprocess.CompletedProcess:
    try:
        return subprocess.run(
            cmd,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            timeout=timeout,
            check=False,
        )
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="O processamento demorou demais e foi interrompido.")

def safe_title(text: str) -> str:
    text = re.sub(r"[^\w\-.()]+", "_", text, flags=re.UNICODE).strip()
    return text[:80] or "video"

def get_video_title(url: str) -> str:
    result = run_command([
        "yt-dlp", "--no-playlist", "--print", "%(title)s", url
    ], timeout=120)
    if result.returncode!= 0:
        detail = result.stderr[-1200:] or "Não foi possível obter os dados do vídeo."
        raise HTTPException(status_code=502, detail=detail)
    return result.stdout.strip().splitlines()[0] if result.stdout.strip() else "video"

def download_video(url: str, output: Path) -> None:
    # MP4 final para facilitar o processamento com FFmpeg.
    result = run_command([
        "yt-dlp",
        "--no-playlist",
        "--restrict-filenames",
        "--merge-output-format", "mp4",
        "-f", "bv*+ba/b",
        "-o", str(output),
        url,
    ], timeout=3600)
    if result.returncode!= 0 or not output.exists():
        detail = result.stderr[-1600:] or "Não foi possível baixar o vídeo."
        raise HTTPException(status_code=502, detail=detail)

def make_cuts(source: Path, out_dir: Path, minutes: int) -> list[Path]:
    segment_seconds = minutes * 60
    pattern = out_dir / "corte_%03d.mp4"

    # -c copy evita recodificar o vídeo inteiro; cortes podem começar no keyframe mais próximo.
    result = run_command([
        "ffmpeg", "-hide_banner", "-loglevel", "error",
        "-i", str(source),
        "-map", "0:v:0?", "-map", "0:a:0?",
        "-c", "copy",
        "-f", "segment",
        "-segment_time", str(segment_seconds),
        "-reset_timestamps", "1",
        str(pattern),
    ], timeout=3600)

    if result.returncode!= 0:
        # Fallback: recodifica para obter cortes mais precisos.
        result = run_command([
            "ffmpeg", "-hide_banner", "-loglevel", "error",
            "-i", str(source),
            "-map", "0:v:0?", "-map", "0:a:0?",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "23",
            "-c:a", "aac", "-b:a", "128k",
            "-f", "segment",
            "-segment_time", str(segment_seconds),
            "-reset_timestamps", "1",
            str(pattern),
        ], timeout=3600)

    if result.returncode!= 0:
        detail = result.stderr[-1600:] or "O FFmpeg não conseguiu criar os cortes."
        raise HTTPException(status_code=500, detail=detail)

    files = sorted(out_dir.glob("corte_*.mp4"))
    if not files:
        raise HTTPException(status_code=500, detail="Nenhum corte foi gerado.")
    return files

def make_zip(files: list[Path], zip_path: Path) -> None:
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for file in files:
            zf.write(file, arcname=file.name)

def get_video_duration(url: str) -> int:
    result = run_command([
        "yt-dlp", "--no-playlist", "--print", "%(duration)s", url
    ], timeout=120)
    if result.returncode!= 0:
        raise HTTPException(status_code=502, detail="Não consegui pegar a duração do vídeo.")
    try:
        return int(float(result.stdout.strip()))
    except:
        raise HTTPException(status_code=502, detail="Duração inválida retornada.")

@app.get("/")
def root():
    return {"ok": True, "service": "YouTube Cortador Backend", "version": "1.1.0"}

@app.get("/health")
def health():
    return {
        "ok": True,
        "yt_dlp": shutil.which("yt-dlp") is not None,
        "ffmpeg": shutil.which("ffmpeg") is not None,
    }

@app.post("/cut")
def cut_video(request: CutRequest):
    if request.minutes not in ALLOWED_MINUTES:
        raise HTTPException(status_code=400, detail="Escolha 1, 3, 5 ou 10 minutos.")

    url = validate_youtube_url(request.url)

    job_dir = Path(tempfile.mkdtemp(prefix="job_", dir=WORK_ROOT))
    try:
        source = job_dir / "video.mp4"
        cuts_dir = job_dir / "cuts"
        cuts_dir.mkdir()

        title = safe_title(get_video_title(url))
        download_video(url, source)
        cuts = make_cuts(source, cuts_dir, request.minutes)

        zip_path = job_dir / f"{title}_cortes_{request.minutes}min.zip"
        make_zip(cuts, zip_path)

        return FileResponse(
            path=zip_path,
            media_type="application/zip",
            filename=zip_path.name,
            headers={"Cache-Control": "no-store"},
        )
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erro interno: {exc}")
    finally:
        # O FileResponse precisa que o arquivo ainda exista durante o envio.
        # A limpeza completa é feita pelo job de manutenção abaixo; neste MVP os arquivos ficam em /tmp.
        pass

@app.post("/cut_live")
async def cut_live(request: LiveCutRequest, background_tasks: BackgroundTasks):
    url = validate_youtube_url(request.url)
    
    job_dir = Path(tempfile.mkdtemp(prefix="live_", dir=WORK_ROOT))
    try:
        # Pega duração e título
        duration = get_video_duration(url)
        title = safe_title(get_video_title(url))
        
        if duration == 0:
            raise HTTPException(400, "Vídeo ao vivo ou duração indisponível. Só funciona com VOD.")
            
        # Baixa o vídeo completo
        source = job_dir / "live.mp4"
        download_video(url, source)
        
        # Calcula quantos pedaços
        chunk_seconds = request.chunk_minutes * 60
        num_chunks = math.ceil(duration / chunk_seconds)
        
        cuts_dir = job_dir / "cuts"
        cuts_dir.mkdir()
        
        output_files = []
        
        for i in range(num_chunks):
            start_time = i * chunk_seconds
            # Último pedaço pode ser menor
            actual_duration = min(chunk_seconds, duration - start_time)
            
            output_path = cuts_dir / f"{title}_parte_{i+1:03d}.mp4"
            
            # Corta com ffmpeg -c copy pra ser rápido
            cmd = [
                'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                '-ss', str(start_time),
                '-i', str(source),
                '-t', str(actual_duration),
                '-c', 'copy',
                '-avoid_negative_ts', 'make_zero',
                str(output_path)
            ]
            result = run_command(cmd, timeout=600)
            
            if result.returncode!= 0 or not output_path.exists():
                # Fallback com recodificação se copy falhar
                cmd = [
                    'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y',
                    '-ss', str(start_time),
                    '-i', str(source),
                    '-t', str(actual_duration),
                    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23',
                    '-c:a', 'aac', '-b:a', '128k',
                    str(output_path)
                ]
                run_command(cmd, timeout=1200)
            
            if output_path.exists():
                output_files.append(output_path)
        
        if not output_files:
            raise HTTPException(500, "Nenhum corte foi gerado.")
        
        # Zip todos os pedaços
        zip_path = job_dir / f"{title}_{request.chunk_minutes}min_partes.zip"
        make_zip(output_files, zip_path)
        
        background_tasks.add_task(shutil.rmtree, job_dir, ignore_errors=True)
        return FileResponse(
            path=zip_path,
            media_type="application/zip",
            filename=zip_path.name,
            headers={"Cache-Control": "no-store"},
        )
        
    except HTTPException:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise
    except Exception as e:
        shutil.rmtree(job_dir, ignore_errors=True)
        raise HTTPException(500, f"Erro interno: {str(e)}")