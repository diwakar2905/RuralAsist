// Use API URL from config (fallback to localhost for development)
const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || "http://localhost:8000";

const chatBox = document.getElementById("chat-box");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");

if (chatInput) {
  chatInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") sendMessage();
  });
}
if (sendBtn) {
  sendBtn.addEventListener("click", sendMessage);
}

function addMessage(text, sender) {
  if (!chatBox) return;
  const msg = document.createElement("div");
  msg.className = sender === "user" ? "msg user-msg" : "msg bot-msg";
  msg.innerHTML = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  if (!chatInput) return;
  const text = chatInput.value.trim();
  if (text.length === 0) return;

  addMessage(text, "user");
  chatInput.value = "";

  // Typing bubble
  const typing = document.createElement("div");
  typing.className = "msg bot-msg typing";
  typing.innerHTML = "Typing...";
  if (chatBox) {
    chatBox.appendChild(typing);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/chatbot/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text })
    });

    const data = await res.json();

    typing.remove();
    addMessage(data.reply, "bot");

  } catch (err) {
    typing.remove();
    addMessage("❌ Error connecting to chatbot.", "bot");
    console.error(err);
  }
}