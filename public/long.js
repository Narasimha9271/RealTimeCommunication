const longBox = document.getElementById("long-box");
let lastSeenIdLong = 0;

function longPoll() {
  fetch(`/long?lastId=${lastSeenIdLong}`)
    .then((res) => res.json())
    .then((data) => {
      data.messages.forEach((msg) => {
        if (msg.id > lastSeenIdLong) {
          longBox.innerHTML += `<p>${msg.text}</p>`;
          lastSeenIdLong = msg.id;
        }
      });
      longPoll(); // immediately poll again
    })
    .catch(() => setTimeout(longPoll, 2000)); // retry on error
}

longPoll();
