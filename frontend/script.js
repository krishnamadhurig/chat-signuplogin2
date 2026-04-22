const AUTH_URL = "http://localhost:5000/api/auth";
const MSG_URL = "http://localhost:5000/api/messages";


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

  if (!data.name || !data.email || !data.phone || !data.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${AUTH_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "Signup successful");
      window.location.href = "index.html";
    } else {
      alert(result.message || "Signup failed");
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
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

  if (!data.loginId || !data.password) {
    alert("Please fill all fields");
    return;
  }

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
      alert(result.message || "Login failed");
    }

  } catch (err) {
    console.log(err);
    alert("Server error");
  }
}


// =======================
// TIME
// =======================
function getTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}


// =======================
// GET USER ID FROM TOKEN
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
// SEND MESSAGE (FIXED)
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
    console.log("Saved:", data);

    if (!res.ok) {
      alert("Failed to send message");
      return;
    }

    // UI update only after success
    addMessageToUI(message, "sent");

    input.value = "";

    // fake reply
    setTimeout(() => {
      const replies = [
        "Hi",
        "How are you?",
        "Nice message",
        "Got it!",
        "Okay",
        "Tell me more..."
      ];

      const randomReply =
        replies[Math.floor(Math.random() * replies.length)];

      addMessageToUI(randomReply, "received");
    }, 800);

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

  if (!token) {
    window.location.href = "index.html";
    return;
  }

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

    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    console.log("Load error:", err);
  }
}


// =======================
// ADD MESSAGE TO UI
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
// ENTER KEY SUPPORT
// =======================
document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});


// =======================
// PAGE LOAD
// =======================
window.onload = function () {
  loadMessages();
};