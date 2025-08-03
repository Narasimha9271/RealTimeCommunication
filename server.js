const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(express.json()); // ✅ allow JSON body for POST requests

let messages = [];
let waitingClients = [];
let id = 0;

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

// ✅ NEW: Manual Message Send Endpoint
app.post("/send", (req, res) => {
  const { text } = req.body;
  const msg = { id: ++id, text: text || "📢 Default message" };
  messages.push(msg);

  if (messages.length > 5) messages.shift(); // keep last 5 messages only

  // ✅ notify long-poll clients instantly
  waitingClients.forEach((client) => {
    client.res.json({ messages: [msg], time: new Date().toLocaleTimeString() });
  });
  waitingClients = []; // clear waiting clients

  console.log("Message sent:", msg.text);
  res.json({ success: true, message: msg });
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
