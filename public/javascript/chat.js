const messagesContainer = document.querySelector(
  ".chatContainer .messagesContainer"
);
const form = document.querySelector(".chatContainer form");
const input = form.querySelector("input");

const sendMessage = (e) => {
  e.preventDefault();
  socket.emit("chat", {
    action: "send message",
    message: input.value,
  });
  input.value = "";
};

const appendMessage = (message, sender) => {
  let from;
  if (sender === socket.id) {
    from = "You: ";
  } else {
    from = "Opponent: ";
    if (chatContainer.classList.contains("hidden")) {
      unreadMessages.classList.remove("hidden");
    }
  }
  const p = document.createElement("p");
  p.textContent = from + message;
  messagesContainer.appendChild(p);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

socket.on("chat", (data) => {
  if (data.action === "incoming message") {
    appendMessage(data.message, data.sender);
  }
});

form.addEventListener("submit", sendMessage);
