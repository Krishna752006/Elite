async function login(type) {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const BASE_URL = "http://localhost:3000";

  let payload;

  // Allow JSON injection input
  try {
    payload = {
      username: JSON.parse(username),
      password: JSON.parse(password)
    };
  } catch {
    payload = { username, password };
  }

  const res = await fetch(`${BASE_URL}/auth/${type}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const text = await res.text();
  document.getElementById("result").innerText = text;
}
