module.exports = (io, socket) => {

  console.log("User connected:", socket.user.userId);

  socket.on("sendMessage", (data) => {
    console.log("Message from:", socket.user.userId);

    io.emit("receiveMessage", {
      message: data.message,
      userId: socket.user.userId,
      time: new Date()
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user.userId);
  });

};