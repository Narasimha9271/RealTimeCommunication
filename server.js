const express = require("express");
const { WebSocketServer } = require("ws"); // ✅ WebSocket support
const http = require("http");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json());

let messages = [];
let waitingClients = [];
let id = 0;

// ✅ Create HTTP server so we can attach WebSocket server
const server = http.createServer(app);

// ✅ Short Polling Endpoint
app.get("/short", (req, res) => {
  res.json({ messages, time: new Date().toLocaleTimeString() });
});

// ✅ Long Polling Endpoint
app.get("/long", (req, res) => {
  const lastId = parseInt(req.query.lastId || 0);
  const newMessages = messages.filter((msg) => msg.id > lastId);

  if (newMessages.length > 0) {
    res.json({ messages: newMessages, time: new Date().toLocaleTimeString() });
  } else {
    waitingClients.push({ res, lastId });
  }
});

// ✅ Manual Message Send Endpoint
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

  // ✅ Notify all WebSocket clients instantly
  wss.clients.forEach((ws) => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  });

  console.log("Message sent:", msg.text);
  res.json({ success: true, message: msg });
});

// ✅ Setup WebSocket Server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("🔗 WebSocket client connected");
  ws.send(JSON.stringify({ text: "✅ Connected to WebSocket server" }));
});

server.listen(PORT, () =>
  console.log(`🚀 Server & WebSocket running at http://localhost:${PORT}`)
);
