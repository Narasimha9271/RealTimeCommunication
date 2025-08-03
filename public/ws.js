const wsBox = document.getElementById("ws-box");
const ws = new WebSocket(`ws://${window.location.host}`);

ws.onopen = () => {
  wsBox.innerHTML += `<p style="color:green;">✅ Connected to WebSocket</p>`;
  console.log("🔗 [WebSocket] Connected to server");
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log("⚡ [WebSocket] Message received instantly:", msg.text);
  wsBox.innerHTML += `<p>${msg.text}</p>`;
};

ws.onclose = () => {
  wsBox.innerHTML += `<p style="color:red;">❌ WebSocket disconnected</p>`;
  console.log("🔌 [WebSocket] Disconnected");
};

// ✅ New: Function to send messages to server via WebSocket
function sendViaWS() {
  const input = document.getElementById("wsInput");
  const text = input.value.trim();
  if (!text) return alert("Please type a WS message!");

  ws.send(JSON.stringify({ text })); // ✅ send message to server
  console.log("📤 [WebSocket] Sent message to server:", text);

  // Optional: show your own message in the box
  wsBox.innerHTML += `<p style="color:blue;">You: ${text}</p>`;
  input.value = "";
}
