const db = require("../models");
const Message = db.Message;

exports.sendMessage = async (req, res) => {
  try {
    const userId = req.userId; // from middleware
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Missing message" });
    }

    const newMessage = await Message.create({
      userId,
      message
    });

    return res.status(201).json({
      message: "Message stored successfully",
      data: newMessage
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [["createdAt", "ASC"]] // oldest → newest
    });

    return res.status(200).json(messages);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error fetching messages" });
  }
};