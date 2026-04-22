const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");


const { sendMessage } = require("../controllers/messageController");
router.post("/send", auth,sendMessage);

const { getMessages } = require("../controllers/messageController");

router.get("/", auth, getMessages);

module.exports = router;