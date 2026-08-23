# YouTube Cortador — Backend

Backend em FastAPI para o site hospedado no GitHub Pages.

## O que ele faz

- recebe `POST /cut` com `{ "url": "...", "minutes": 1|3|5|10 }`;
- valida links do YouTube, incluindo `/watch`, `/shorts/`, `/live/` e `youtu.be`;
- usa `yt-dlp` para obter o vídeo;
- usa FFmpeg para dividir em partes;
- devolve os cortes em um arquivo ZIP;
- possui `GET /health` para teste.

Use somente vídeos que você possui ou para os quais tem autorização para baixar/processar.

## Rodar com Docker

```bash
docker build -t youtube-cortador-backend .
docker run --rm -p 8000:8000 -e ALLOWED_ORIGINS="*" youtube-cortador-backend
```

Teste:

```text
http://localhost:8000/health
```

O site deve usar como URL do backend:

```text
http://localhost:8000
```

## Deploy

O projeto foi preparado para um serviço que execute Docker. Depois do deploy, coloque a URL pública do serviço no campo **Configuração do servidor** do site.

Para produção, defina `ALLOWED_ORIGINS` com a origem exata do seu GitHub Pages em vez de `*`.
