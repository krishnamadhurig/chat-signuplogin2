const BASE_URL = "http://localhost:5000/api/auth";


//  SIGNUP
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
    const res = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
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
    console.error(err);
    alert("Server error. Is backend running?");
  }
}


// LOGIN
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
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();

    if (res.ok) {
      alert(result.message || "Login successful");

      // Store JWT token
      localStorage.setItem("token", result.token);
      window.location.href = "chat.html";

      console.log("Saved Token:", result.token);

      //  Optional redirect
      // window.location.href = "dashboard.html";

    } else {
      alert(result.message || "Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error. Is backend running?");
  }
}


//
// Time helper
function getTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
async function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message) return;

  const token = localStorage.getItem("token");

  try {
    // 1. SEND TO BACKEND
    const res = await fetch("http://localhost:5000/api/messages/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      body: JSON.stringify({
        message: message
      })
      
    });
    console.log("STATUS:", res.status);

    const data = await res.json();
    console.log("Saved to DB:", data);

    // 2. UPDATE UI (sent message)
    const chatBox = document.getElementById("chatBox");

    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "sent");

    msgDiv.innerHTML = `
      <p>${message}</p>
      <span>${getTime()}</span>
    `;

    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    input.value = "";

    // 3. FAKE REPLY (UI ONLY)
    setTimeout(() => {
      const replies = [
        "Hi",
        "How are you?",
        "Nice message",
        "Got it!",
        "Okay",
        "Tell me more..."
      ];

      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      receiveMessage(randomReply);
    }, 800);

  } catch (err) {
    console.log("Error sending message:", err);
    alert("Failed to send message");
  }
}