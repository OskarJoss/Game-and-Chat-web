import openSocket from "socket.io-client";
const API =
  process.env.NODE_ENV === "production"
    ? process.env.API_PRODUCTION
    : process.env.API_DEV;

console.log(API);

export const socket = openSocket(API);
