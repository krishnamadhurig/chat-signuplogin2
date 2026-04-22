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

function sendMessage() {
  const input = document.getElementById("messageInput");
  const message = input.value.trim();

  if (!message) return;

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

  setTimeout(() => {
    const replies = [
  "Hi",
  "How are you?",
  "Nice message ",
  "Got it!",
  "Okay",
  "Tell me more..."
];

const randomReply = replies[Math.floor(Math.random() * replies.length)];
receiveMessage(randomReply);
  }, 800);
}

function receiveMessage(text) {
  const chatBox = document.getElementById("chatBox");

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", "received");

  msgDiv.innerHTML = `
    <p>${text}</p>
    <span>${getTime()}</span>
  `;

  chatBox.appendChild(msgDiv);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

document.addEventListener("keydown", function(e) {
  if (e.key === "Enter") sendMessage();
});