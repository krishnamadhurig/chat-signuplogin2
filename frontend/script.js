const AUTH_URL = "http://localhost:5000/api/auth";
const MSG_URL = "http://localhost:5000/api/messages";

let socket;

// =======================
// SOCKET INIT (AFTER LOGIN)
// =======================
window.onload = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  socket = io("http://localhost:5000", {
    auth: { token }
  });

  // Listen for real-time messages
  socket.on("receiveMessage", (data) => {
    const currentUserId = getUserIdFromToken();

    // prevent showing own message twice
    if (data.userId !== currentUserId) {
      addMessageToUI(data.message, "received", data.time);
    }
  });

  loadMessages();
};

// =======================
// SIGNUP
// =======================
async function signup() {
  const data = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    password: document.getElementById("password").value.trim()
  };

  try {
    const res = await fetch(`${AUTH_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert("Signup successful");
      window.location.href = "index.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.log(err);
  }
}

// =======================
// LOGIN
// =======================
async function login() {
  const data = {
    loginId: document.getElementById("loginId").value.trim(),
    password: document.getElementById("loginPassword").value.trim()
  };

  try {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      localStorage.setItem("token", result.token);
      window.location.href = "chat.html";
    } else {
      alert(result.message);
    }
  } catch (err) {
    console.log(err);
  }
}

// =======================
// SEND MESSAGE
// =======================
async function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message) return;

  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${MSG_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Failed to send message");
      return;
    }

    // show own message
    addMessageToUI(message, "sent");

    // emit socket event
    socket.emit("sendMessage", {
      message,
      userId: data.data.userId,
      time: new Date()
    });

    input.value = "";

  } catch (err) {
    console.log(err);
    alert("Failed to send message");
  }
}

// =======================
// LOAD MESSAGES
// =======================
async function loadMessages() {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(MSG_URL, {
      headers: {
        "Authorization": "Bearer " + token
      }
    });

    const messages = await res.json();

    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";

    const currentUserId = getUserIdFromToken();

    messages.forEach(msg => {
      const type =
        msg.userId === currentUserId ? "sent" : "received";

      addMessageToUI(msg.message, type, msg.createdAt);
    });

  } catch (err) {
    console.log("Load error:", err);
  }
}

// =======================
// UI FUNCTION
// =======================
function addMessageToUI(text, type, time = null) {
  const chatBox = document.getElementById("chatBox");

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type);

  msgDiv.innerHTML = `
    <p>${text}</p>
    <span>${time ? new Date(time).toLocaleTimeString() : getTime()}</span>
  `;

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// =======================
// GET TIME
// =======================
function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// =======================
// DECODE TOKEN
// =======================
function getUserIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch (err) {
    return null;
  }
}

// =======================
// ENTER KEY SUPPORT
// =======================
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && document.activeElement.id === "messageInput") {
    sendMessage();
  }
});