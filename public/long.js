const longBox = document.getElementById("long-box");
let lastSeenIdLong = 0;

function longPoll() {
  console.log(
    "📡 [Long Polling] Sending request to server with lastId:",
    lastSeenIdLong
  );

  fetch(`/long?lastId=${lastSeenIdLong}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.messages.length > 0) {
        data.messages.forEach((msg) => {
          longBox.innerHTML += `<p>${msg.text}</p>`;
          lastSeenIdLong = msg.id;
          console.log("✅ [Long Polling] Message received:", msg.text);
        });
      } else {
        console.log("⏳ [Long Polling] No message this time, waiting again...");
      }

      console.log("🔄 [Long Polling] Reconnecting...");
      longPoll(); // keep long polling alive
    })
    .catch((err) => {
      console.error("❌ [Long Polling] Error:", err);
      setTimeout(longPoll, 2000); // retry after 2 sec if something goes wrong
    });
}

longPoll(); // ✅ start immediately
