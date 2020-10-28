import { socket } from "./socket.js";

const test = () => {
  socket.emit("test", {
    message: "yooooo",
  });
};

test();
