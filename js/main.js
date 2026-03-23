const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const slides = document.querySelectorAll(".hero-main");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const postForm = document.getElementById("postForm");
const postMessage = document.getElementById("postMessage");
const adminPostsList = document.getElementById("adminPostsList");
const publicHomePosts = document.getElementById("publicHomePosts");
const publicPostsList = document.getElementById("publicPostsList");
const singlePostContainer = document.getElementById("singlePostContainer");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
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
    const response = await fetch("/login", { method: "POST", body: formData });
    const data = await response.json();

    if (data.success) {
      loginMessage.textContent = "Login successful. Redirecting...";
      loginMessage.style.color = "#22c55e";
      setTimeout(() => window.location.href = "/dashboard.html", 1000);
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
    const response = await fetch("/save-post", { method: "POST", body: formData });
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
      adminPostsList.innerHTML = `<article class="card"><div class="card-content"><h3>No posts yet</h3><p>Your saved posts will appear here.</p></div></article>`;
      return;
    }

    adminPostsList.innerHTML = data.posts.map(post => `
      <article class="card">
        <div class="card-content">
          <span class="tag">${post.category}</span>
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <form class="delete-form" data-id="${post.id}">
            <button type="submit" class="delete-btn">Delete</button>
          </form>
        </div>
      </article>
    `).join("");

    document.querySelectorAll(".delete-form").forEach(form => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("id", form.dataset.id);

        const response = await fetch("/delete-post", {
          method: "POST",
          body: formData
        });

        const data = await response.json();
        if (data.success) loadAdminPosts();
      });
    });
  } catch {
    adminPostsList.innerHTML = `<article class="card"><div class="card-content"><h3>Failed to load posts</h3><p>Please try again later.</p></div></article>`;
  }
}

async function loadPublicPosts(target, limit = null) {
  if (!target) return;

  try {
    const response = await fetch("/public-posts");
    const data = await response.json();

    if (!data.success || !data.posts.length) {
      target.innerHTML = `<article class="card"><div class="card-content"><h3>No posts yet</h3><p>Published stories will appear here soon.</p></div></article>`;
      return;
    }

    const posts = limit ? data.posts.slice(0, limit) : data.posts;

    target.innerHTML = posts.map(post => `
      <article class="card">
        <div class="card-content">
          <span class="tag">${post.category}</span>
          <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
          <p>${post.description}</p>
        </div>
      </article>
    `).join("");
  } catch {
    target.innerHTML = `<article class="card"><div class="card-content"><h3>Failed to load posts</h3><p>Please try again later.</p></div></article>`;
  }
}

async function loadSinglePost() {
  if (!singlePostContainer) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    singlePostContainer.innerHTML = `<h1>Post not found</h1><p class="post-meta">Missing post link.</p>`;
    return;
  }

  try {
    const response = await fetch(`/public-post?slug=${encodeURIComponent(slug)}`);
    const data = await response.json();

    if (!data.success) {
      singlePostContainer.innerHTML = `<h1>Post not found</h1><p class="post-meta">This post does not exist.</p>`;
      return;
    }

    const post = data.post;

    singlePostContainer.innerHTML = `
      <span class="tag">${post.category}</span>
      <h1>${post.title}</h1>
      <p class="post-meta">${new Date(post.createdAt).toDateString()}</p>
      <div class="single-post-image"></div>
      <div class="single-post-content">
        <p>${post.description}</p>
        <p>${post.content.replace(/\n/g, "</p><p>")}</p>
      </div>
    `;
  } catch {
    singlePostContainer.innerHTML = `<h1>Error</h1><p class="post-meta">Failed to load post.</p>`;
  }
}

async function handleSearch(query) {
  if (!searchResults) return;

  try {
    const response = await fetch("/public-posts");
    const data = await response.json();

    if (!data.success || !data.posts.length) {
      searchResults.innerHTML = `<article class="card"><div class="card-content"><h3>No posts found</h3></div></article>`;
      return;
    }

    const q = query.toLowerCase().trim();
    const filtered = data.posts.filter(post =>
      post.title.toLowerCase().includes(q) ||
      post.description.toLowerCase().includes(q) ||
      post.content.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q)
    );

    if (!filtered.length) {
      searchResults.innerHTML = `<article class="card"><div class="card-content"><h3>No matching result</h3></div></article>`;
      return;
    }

    searchResults.innerHTML = filtered.map(post => `
      <article class="card">
        <div class="card-content">
          <span class="tag">${post.category}</span>
          <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
          <p>${post.description}</p>
        </div>
      </article>
    `).join("");
  } catch {
    searchResults.innerHTML = `<article class="card"><div class="card-content"><h3>Search failed</h3></div></article>`;
  }
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch(searchInput.value);
  });
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

loadPublicPosts(publicHomePosts, 6);
loadPublicPosts(publicPostsList);
loadSinglePost();
