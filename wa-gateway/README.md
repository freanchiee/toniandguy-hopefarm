# WhatsApp Gateway — Deployment Guide

The `wa-gateway` is a persistent Node.js service. Vercel/Netlify are **serverless** — they can't run it. Deploy it separately.

## Option 1: Railway (Recommended, free tier)

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Set root directory to `wa-gateway/`
3. Add env var: `PORT=8002`
4. After deploy, copy the public URL (e.g. `https://tg-wa-gateway.up.railway.app`)
5. Open that URL in browser → scan the QR with the salon WhatsApp
6. In Vercel, set env var: `OPENWA_URL=https://tg-wa-gateway.up.railway.app`

## Option 2: Render (free tier)

1. https://render.com → New Web Service → connect repo
2. Root: `wa-gateway/` · Build command: `npm install` · Start: `node index.mjs`
3. Same steps as Railway above

## Option 3: DigitalOcean Droplet ($6/mo, most stable)

```bash
ssh root@your-droplet
git clone your-repo
cd wa-gateway
npm install
npm install -g pm2
pm2 start index.mjs --name wa-gateway
pm2 save
```

## After deploy

Update `.env.local` (local) AND Vercel/Netlify environment variables:
```
OPENWA_URL=https://your-gateway-url.railway.app
```

## Important

- The WhatsApp session (`.baileys_auth/`) must persist. Railway/Render have ephemeral storage — you'll need to re-scan QR after each redeploy unless you mount a volume.
- For Render: enable a persistent disk on the service
- For Railway: use a Railway volume mounted at `/app/.baileys_auth`
- DigitalOcean: no issue, files persist naturally

## Local dev

```bash
npm run wa   # starts gateway on port 8002
# Open http://localhost:8002 to scan QR
```

## Troubleshooting

- **Logs show `Disconnected (code 428)` repeatedly** — WhatsApp is closing the connection. Most common causes:
  1. The saved session was lost (no persistent volume) or is stale → open the gateway URL; if a QR shows, scan it again. Mount a Railway volume and set `AUTH_DIR=/data/.baileys_auth` so it survives redeploys.
  2. Outdated WhatsApp protocol version → the gateway now fetches the latest version on every start; redeploy to pick up a newer `@whiskeysockets/baileys` too.
  3. The same WhatsApp number is linked and running somewhere else (e.g. a local `npm run wa`) → stop the other instance.
- `GET /health` returns `{ ready, lastDisconnectCode, reconnectAttempts }`.
- Reconnects back off 5s → 10s → 20s … up to 60s and reset once connected.
