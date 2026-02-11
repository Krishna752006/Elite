async function vulnerableLogin() {
  await sendRequest("/login-vulnerable");
}

async function safeLogin() {
  await sendRequest("/login-secure");
}

async function sendRequest(url) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const output = document.getElementById("output");

  output.textContent = "Sending request...";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = "Error: " + err.message;
  }
}
