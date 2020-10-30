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

const appendMessage = (message) => {
  console.log(message);
  const p = document.createElement("p");
  p.textContent = message;
  messagesContainer.appendChild(p);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
};

socket.on("chat", (data) => {
  if (data.action === "incoming message") {
    appendMessage(data.message);
  }
});

form.addEventListener("submit", sendMessage);
