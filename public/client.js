const socket = io();
const chat = document.getElementById("chat");

function join() {
  const name = document.getElementById("name").value.trim();
  const room = document.getElementById("room").value.trim();
  if (!name || !room) return alert("Name und Raum eingeben!");

  socket.emit("join", { name, room });
}

function send() {
  const input = document.getElementById("msg");
  const text = input.value.trim();
  if (!text) return;

  socket.emit("message", text);
  input.value = "";
}

socket.on("message", (data) => {
  const div = document.createElement("div");
  div.innerText = `${data.time} | ${data.name}: ${data.text}`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

socket.on("system", (msg) => {
  const div = document.createElement("div");
  div.innerText = "⚡ " + msg;
  div.style.opacity = 0.7;
  chat.appendChild(div);
});
