const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const slides = document.querySelectorAll(".hero-main");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const adminPostsList = document.getElementById("adminPostsList");
const isProtectedPage = document.body.dataset.protected === "true";

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");
  });
}

let currentSlide = 0;

if (slides.length > 0) {
  setInterval(() => {
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add("active");
  }, 4000);
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);

    const response = await fetch("/login", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      loginMessage.textContent = "Login successful. Redirecting...";
      loginMessage.style.color = "#22c55e";
      setTimeout(() => {
        window.location.href = "/dashboard.html";
      }, 1000);
    } else {
      loginMessage.textContent = data.message || "Login failed";
      loginMessage.style.color = "#ef4444";
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    await fetch("/logout");
    window.location.href = "/admin.html";
  });
}

if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(postForm);

    const response = await fetch("/save-post", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      postMessage.textContent = "Post published successfully";
      postMessage.style.color = "#22c55e";
      postForm.reset();
    } else {
      postMessage.textContent = data.message || "Failed to save post";
      postMessage.style.color = "#ef4444";
    }
  });
}

async function loadAdminPosts() {
  if (!adminPostsList) return;

  try {
    const response = await fetch("/posts");
    const data = await response.json();

    if (!data.success || !data.posts.length) {
      adminPostsList.innerHTML = `
        <article class="card">
          <div class="card-content">
            <h3>No posts yet</h3>
            <p>Your saved posts will appear here.</p>
          </div>
        </article>
      `;
      return;
    }

    adminPostsList.innerHTML = data.posts.map(post => `
      <article class="card">
        <div class="card-content">
          <span class="tag">${post.category}</span>
          <h3>${post.title}</h3>
          <p>${post.description}</p>
        </div>
      </article>
    `).join("");
  } catch (error) {
    adminPostsList.innerHTML = `
      <article class="card">
        <div class="card-content">
          <h3>Failed to load posts</h3>
          <p>Please try again later.</p>
        </div>
      </article>
    `;
  }
}

if (isProtectedPage) {
  fetch("/session")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        window.location.href = "/admin.html";
      } else {
        loadAdminPosts();
      }
    })
    .catch(() => {
      window.location.href = "/admin.html";
    });
}
