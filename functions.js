const API_URL = "http://localhost:3000/comments";

document.addEventListener("DOMContentLoaded", loadComments);


async function loadComments() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();

    renderComments(data);

  } catch (error) {
    console.error(error);
  }
}

function renderComments(comments) {

  const container = document.getElementById("commentsList");
  const empty = document.getElementById("emptyMessage");

  container.innerHTML = "";

  if (comments.length === 0) {
    empty.textContent = "No hay comentarios aún";
    return;
  }

  empty.textContent = "";

  comments.forEach(c => {

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <strong>${c.username}</strong>
      <p>${c.message}</p>
      <small>${formatDate(c.date)}</small>
      <button class="delete" onclick="deleteComment(${c.id})">Eliminar</button>
    `;

    container.appendChild(div);
  });
}


async function addComment() {

  const username = document.getElementById("username").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!username) {
    alert("Nombre requerido");
    return;
  }

  if (message.length < 5) {
    alert("El mensaje debe tener mínimo 5 caracteres");
    return;
  }

  const date = new Date().toISOString();

  try {
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, message, date })
    });

    document.getElementById("message").value = "";

    loadComments();

  } catch (error) {
    console.error(error);
  }
}


async function deleteComment(id) {

  if (!confirm("¿Eliminar comentario?")) return;

  try {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    loadComments();

  } catch (error) {
    console.error(error);
  }
}

function formatDate(date) {
  const diff = Math.floor((new Date() - new Date(date)) / 1000);

  if (diff < 60) return "Hace unos segundos";
  if (diff < 3600) return `Hace ${Math.floor(diff/60)} min`;
  if (diff < 86400) return `Hace ${Math.floor(diff/3600)} hrs`;

  return new Date(date).toLocaleDateString();
}
