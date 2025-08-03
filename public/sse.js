const sseBox = document.getElementById("sse-box");

// ✅ Connect to SSE endpoint
const sse = new EventSource("/sse");

sse.onopen = () => {
  sseBox.innerHTML += `<p style="color:green;">✅ Connected to SSE</p>`;
  console.log("🔗 [SSE] Connected to server");
};

sse.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  sseBox.innerHTML += `<p>${msg.text}</p>`;
  console.log("🌐 [SSE] Message received:", msg.text);
};

sse.onerror = () => {
  console.log("❌ [SSE] Connection error or closed");
};
