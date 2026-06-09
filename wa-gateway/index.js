/**
 * Toni & Guy WhatsApp Gateway — powered by Baileys
 * Uses WhatsApp's multi-device protocol directly. No browser, no Puppeteer.
 *
 * Run:  node wa-gateway/index.js
 * Open: http://localhost:8002  → scan QR with salon WhatsApp once
 */

const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
} = require("@whiskeysockets/baileys");
const QRCode = require("qrcode");
const http = require("http");
const { execSync } = require("child_process");
const path = require("path");
const pino = require("pino");

const PORT = process.env.WA_PORT || 8002;
const API_KEY = process.env.OPENWA_API_KEY || "";
const AUTH_DIR = path.join(__dirname, ".baileys_auth");

let latestQRDataUrl = null;
let isReady = false;
let sock = null;
let browserOpened = false;

async function startSocket() {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

  sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
    },
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    browser: ["Toni & Guy Hopefarm", "Chrome", "1.0"],
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("connection.update", async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      latestQRDataUrl = await QRCode.toDataURL(qr, { width: 400, margin: 2 });
      console.log("\n📱 QR ready — open http://localhost:" + PORT + " to scan\n");
      if (!browserOpened) {
        browserOpened = true;
        setTimeout(() => { try { execSync("open http://localhost:" + PORT); } catch {} }, 400);
      }
    }

    if (connection === "open") {
      isReady = true;
      latestQRDataUrl = null;
      console.log("\n✅ WhatsApp connected! Gateway ready on http://localhost:" + PORT + "\n");
    }

    if (connection === "close") {
      isReady = false;
      const code = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = code !== DisconnectReason.loggedOut;
      console.warn("⚠️  Disconnected (code", code, ") — reconnecting:", shouldReconnect);
      if (shouldReconnect) setTimeout(startSocket, 3000);
    }
  });
}

startSocket().catch(console.error);

// ── HTTP server ──────────────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {

  // Live QR scan page
  if (req.method === "GET" && req.url === "/") {
    res.setHeader("Content-Type", "text/html");
    if (isReady) {
      return res.end(`<!DOCTYPE html><html><body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px">
        <h2 style="color:#c9a84c;font-size:28px">✅ WhatsApp Connected!</h2>
        <p style="color:#aaa">The salon WhatsApp is linked. Booking confirmations will be sent automatically.</p>
      </body></html>`);
    }
    const qrHtml = latestQRDataUrl
      ? `<img id="qr" src="${latestQRDataUrl}" style="border-radius:12px;width:300px;height:300px;display:block" />`
      : `<p style="color:#aaa">⏳ Starting up... QR will appear shortly.</p>`;
    return res.end(`<!DOCTYPE html><html><head><title>Link WhatsApp — Toni & Guy</title></head>
      <body style="background:#0a0a0a;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:20px;margin:0;padding:20px;box-sizing:border-box">
        <div style="text-align:center">
          <h2 style="color:#c9a84c;margin:0 0 4px">Toni & Guy Hopefarm</h2>
          <p style="color:#666;margin:0;font-size:13px">WhatsApp Gateway</p>
        </div>
        <p style="color:#aaa;margin:0;font-size:14px;text-align:center">
          Open WhatsApp → <b>Linked Devices</b> → <b>Link a Device</b> → scan below
        </p>
        ${qrHtml}
        <p style="color:#444;font-size:12px;margin:0">QR auto-refreshes every 5 seconds</p>
        <script>
          setInterval(async () => {
            try {
              const r = await fetch('/qr');
              const d = await r.json();
              if (d.connected) { document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;flex-direction:column;gap:16px;background:#0a0a0a"><h2 style=\\"color:#c9a84c\\">✅ Connected!</h2><p style=\\"color:#aaa\\">WhatsApp is linked. You can close this tab.</p></div>'; return; }
              if (d.qr) { const el = document.getElementById('qr'); if (el) el.src = d.qr; else location.reload(); }
            } catch(e) {}
          }, 5000);
        </script>
      </body></html>`);
  }

  // QR data endpoint polled by page
  if (req.method === "GET" && req.url === "/qr") {
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ qr: latestQRDataUrl, connected: isReady }));
  }

  res.setHeader("Content-Type", "application/json");

  // API key check for sendText
  if (API_KEY) {
    const auth = req.headers["authorization"] ?? "";
    if (auth !== `Bearer ${API_KEY}`) {
      res.writeHead(401);
      return res.end(JSON.stringify({ error: "Unauthorized" }));
    }
  }

  if (req.method === "GET" && req.url === "/health") {
    return res.end(JSON.stringify({ ready: isReady }));
  }

  if (req.method === "POST" && req.url === "/sendText") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", async () => {
      try {
        const { chatId, text } = JSON.parse(body);
        if (!chatId || !text) { res.writeHead(400); return res.end(JSON.stringify({ error: "chatId and text required" })); }
        if (!isReady || !sock) { res.writeHead(503); return res.end(JSON.stringify({ error: "WhatsApp not connected" })); }

        // chatId format: 919XXXXXXXXX@s.whatsapp.net (Baileys uses @s.whatsapp.net, not @c.us)
        const jid = chatId.replace("@c.us", "@s.whatsapp.net");
        const msg = await sock.sendMessage(jid, { text });
        res.end(JSON.stringify({ id: msg.key.id, ok: true }));
      } catch (e) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(PORT, () => {
  console.log(`\n🟡 Gateway starting on http://localhost:${PORT} ...\n`);
});
