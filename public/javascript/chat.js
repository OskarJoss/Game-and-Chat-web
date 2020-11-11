const messagesWrapper = document.querySelector(".messagesWrapper");
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
  const p = document.createElement("p");
  let from;
  if (sender === socket.id) {
    from = "You: ";
    p.classList.add("you");
  } else {
    from = "Opponent: ";
    p.classList.add("opponent");
    if (chatContainer.classList.contains("hidden")) {
      unreadMessages.classList.remove("hidden");
    }
  }
  p.textContent = from + message;
  messagesContainer.appendChild(p);
  messagesWrapper.scrollTop = messagesContainer.scrollHeight;
};

socket.on("chat", (data) => {
  if (data.action === "incoming message") {
    appendMessage(data.message, data.sender);
  }
});

form.addEventListener("submit", sendMessage);
