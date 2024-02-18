import { Server } from "socket.io";

const user = {};
export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.use((socket, next) => {
    console.log(socket);
  });

  io.on("connection", (socket) => {
    // As soon as the connect is established, the user id is sent to the server.
    socket.on("connect", (userId: string) => {
      user[userId] = socket.id;
      console.log(`User ${userId} connected`);
    });

    socket.on("message", ({ recipientId, message }) => {
      const recipientSocketId = user[recipientId];
      if (recipientSocketId) {
        // Need to send the sender id too.
        io.to(recipientSocketId).emit("message", {
          message,
        });
        console.log(`Message sent to user ${recipientId}`);
      } else {
        console.log(`User ${recipientId} not found`);
        // Handle case where recipient is not found
      }
    });
  });
};
