// ✅ CHANGE THIS if your backend runs on a different port
const BASE_URL = "http://localhost:5000/api/auth";


// 🔹 SIGNUP
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


// 🔹 LOGIN
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

      // ✅ Store JWT token
      localStorage.setItem("token", result.token);

      console.log("Saved Token:", result.token);

      // 👉 Optional redirect
      // window.location.href = "dashboard.html";

    } else {
      alert(result.message || "Login failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error. Is backend running?");
  }
}