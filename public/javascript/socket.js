import io from "../../node_modules/socket.io-client/dist/socket.io";

// const API =
//   process.env.NODE_ENV === "production"
//     ? process.env.API_PRODUCTION
//     : process.env.API_DEV;

const socket = io("http://localhost:8080");

export default socket;
