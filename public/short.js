const shortBox = document.getElementById("short-box");
let lastSeenId = 0;

function shortPoll() {
  fetch("/short")
    .then((res) => res.json())
    .then((data) => {
      let newData = false;
      data.messages.forEach((msg) => {
        if (msg.id > lastSeenId) {
          shortBox.innerHTML += `<p>${msg.text}</p>`;
          lastSeenId = msg.id;
          newData = true;
        }
      });

      // ✅ If no new messages, explicitly show “No new data”
      if (!newData) {
        shortBox.innerHTML += `<p style="color:gray;">No new messages at ${data.time}</p>`;
      }
    });
}

setInterval(shortPoll, 5000);
