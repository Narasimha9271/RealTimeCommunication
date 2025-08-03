const wsBox = document.getElementById("ws-box");

// ✅ Connect to WebSocket server
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
