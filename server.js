const express = require("express");
const { WebSocketServer } = require("ws");
const http = require("http");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

let messages = [];
let waitingClients = [];
let sseClients = []; // ✅ list of SSE clients
let id = 0;

const server = http.createServer(app);

// ✅ Short Polling
app.get("/short", (req, res) => {
  res.json({ messages, time: new Date().toLocaleTimeString() });
});

// ✅ Long Polling
app.get("/long", (req, res) => {
  const lastId = parseInt(req.query.lastId || 0);
  const newMessages = messages.filter((msg) => msg.id > lastId);

  if (newMessages.length > 0) {
    res.json({ messages: newMessages, time: new Date().toLocaleTimeString() });
  } else {
    waitingClients.push({ res, lastId });
  }
});

// ✅ SSE endpoint
app.get("/sse", (req, res) => {
  console.log("📡 [SSE] Client connected");

  // ✅ Set headers to keep connection open
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // ✅ Send a welcome event
  res.write(
    `data: ${JSON.stringify({ text: "✅ Connected to SSE server" })}\n\n`
  );

  // ✅ Store client
  sseClients.push(res);

  // ✅ Remove client on disconnect
  req.on("close", () => {
    console.log("❌ [SSE] Client disconnected");
    sseClients = sseClients.filter((client) => client !== res);
  });
});

// ✅ Send Message
app.post("/send", (req, res) => {
  const { text } = req.body;
  const msg = { id: ++id, text: text || "📢 Default message" };
  messages.push(msg);
  if (messages.length > 5) messages.shift();

  // ✅ Notify long-polling clients
  waitingClients.forEach((client) => {
    client.res.json({ messages: [msg], time: new Date().toLocaleTimeString() });
  });
  waitingClients = [];

  // ✅ Notify WebSocket clients
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  });

  // ✅ Notify SSE clients
  sseClients.forEach((client) => {
    client.write(`data: ${JSON.stringify(msg)}\n\n`);
  });

  console.log("📨 Message sent:", msg.text);
  res.json({ success: true, message: msg });
});

// ✅ WebSocket setup
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 [WebSocket] Client connected");
  ws.send(JSON.stringify({ text: "✅ Connected to WebSocket server" }));

  // ✅ Listen for messages sent from browser
  ws.on("message", (data) => {
    const parsed = JSON.parse(data);
    console.log("📥 [WebSocket] Received from client:", parsed.text);

    // ✅ Broadcast to ALL WebSocket clients
    wss.clients.forEach((client) => {
      if (client.readyState === ws.OPEN) {
        client.send(JSON.stringify({ text: `💬 WS User: ${parsed.text}` }));
      }
    });
  });
});

server.listen(PORT, () =>
  console.log(
    `🚀 Server running with Short, Long, WS & SSE at http://localhost:${PORT}`
  )
);
