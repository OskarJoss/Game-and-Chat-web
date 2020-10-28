import { socket } from "./socket.js";

socket.on("test", (data) => {
  console.log(data.message);
});

const test = () => {
  socket.emit("test", {
    message: "hello from front-end",
  });
};

test();
