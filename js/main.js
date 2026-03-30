const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
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
const settingsForm = document.getElementById("settingsForm");
const settingsMessage = document.getElementById("settingsMessage");
const telegramField = document.getElementById("telegramField");
const youtubeField = document.getElementById("youtubeField");
const googleVerificationField = document.getElementById("googleVerificationField");
const telegramPromo = document.getElementById("telegramPromo");
const youtubePromo = document.getElementById("youtubePromo");
const heroSliderLive = document.getElementById("heroSliderLive");
const footballPosts = document.getElementById("footballPosts");
const bettingPosts = document.getElementById("bettingPosts");
const playersPosts = document.getElementById("playersPosts");
const trendingPosts = document.getElementById("trendingPosts");
const editPostForm = document.getElementById("editPostForm");
const editPostId = document.getElementById("editPostId");
const editTitle = document.getElementById("editTitle");
const editCategory = document.getElementById("editCategory");
const editImage = document.getElementById("editImage");
const editDescription = document.getElementById("editDescription");
const editContent = document.getElementById("editContent");
const editMessage = document.getElementById("editMessage");
const analyticsBoxes = document.getElementById("analyticsBoxes");
const topPostsList = document.getElementById("topPostsList");
const dashboardTotalPosts = document.getElementById("dashboardTotalPosts");
const isProtectedPage = document.body.dataset.protected === "true";

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => navMenu.classList.toggle("show"));
}

async function trackView(slug = "") {
  try {
    const formData = new FormData();
    formData.append("path", window.location.pathname);
    if (slug) formData.append("slug", slug);

    await fetch("/track-view", {
      method: "POST",
      body: formData
    });
  } catch {}
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

if (settingsForm) {
  fetch("/get-settings")
    .then(res => res.json())
    .then(data => {
      if (data.success && data.settings) {
        telegramField.value = data.settings.telegram || "";
        youtubeField.value = data.settings.youtube || "";
        googleVerificationField.value = data.settings.googleVerification || "";
      }
    });

  settingsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(settingsForm);
    const response = await fetch("/save-settings", { method: "POST", body: formData });
    const data = await response.json();

    if (data.success) {
      settingsMessage.textContent = "Settings saved successfully";
      settingsMessage.style.color = "#22c55e";
    } else {
      settingsMessage.textContent = data.message || "Failed to save settings";
      settingsMessage.style.color = "#ef4444";
    }
  });
}

async function applyPublicSettings() {
  try {
    const response = await fetch("/get-settings");
    const data = await response.json();

    if (data.success && data.settings) {
      if (telegramPromo && data.settings.telegram) telegramPromo.href = data.settings.telegram;
      if (youtubePromo && data.settings.youtube) youtubePromo.href = data.settings.youtube;
    }
  } catch {}
}

async function getAllPosts() {
  const response = await fetch("/public-posts");
  const data = await response.json();
  return data.success ? data.posts : [];
}

async function loadHeroSlider() {
  if (!heroSliderLive) return;
  const posts = await getAllPosts();

  if (!posts.length) {
    heroSliderLive.innerHTML = `<article class="hero-live-card"><div class="card-content"><h2>No top stories yet</h2><p>Your latest posts will show here.</p></div></article>`;
    return;
  }

  const topPosts = posts.slice(0, 3);

  heroSliderLive.innerHTML = topPosts.map((post, index) => `
    <article class="hero-live-card ${index === 0 ? 'active-slide' : ''}">
      ${post.image ? `<img src="${post.image}" alt="${post.title}" class="card-image real-card-image">` : ""}
      <div class="card-content">
        <span class="tag">${post.category}</span>
        <h2><a href="post.html?slug=${post.slug}">${post.title}</a></h2>
        <p>${post.description}</p>
      </div>
    </article>
  `).join("");

  const slides = document.querySelectorAll(".hero-live-card");
  let current = 0;

  if (slides.length > 1) {
    setInterval(() => {
      slides[current].classList.remove("active-slide");
      current = (current + 1) % slides.length;
      slides[current].classList.add("active-slide");
    }, 4000);
  }
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
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="card-image real-card-image">` : ""}
        <div class="card-content">
          <span class="tag">${post.category}</span>
          <h3>${post.title}</h3>
          <p>${post.description}</p>
          <p style="color:#94a3b8;font-size:14px;">${post.image || "No image URL"}</p>
          <a href="edit-post.html?id=${encodeURIComponent(post.id)}" class="edit-link">Edit</a>
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
        const response = await fetch("/delete-post", { method: "POST", body: formData });
        const data = await response.json();
        if (data.success) loadAdminPosts();
      });
    });
  } catch {
    adminPostsList.innerHTML = `<article class="card"><div class="card-content"><h3>Failed to load posts</h3></div></article>`;
  }
}

async function loadEditPost() {
  if (!editPostForm) return;
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) {
    editMessage.textContent = "Missing post ID";
    editMessage.style.color = "#ef4444";
    return;
  }

  try {
    const response = await fetch(`/get-post?id=${encodeURIComponent(id)}`);
    const data = await response.json();

    if (!data.success) {
      editMessage.textContent = "Post not found";
      editMessage.style.color = "#ef4444";
      return;
    }

    const post = data.post;
    editPostId.value = post.id;
    editTitle.value = post.title;
    editCategory.value = post.category;
    editImage.value = post.image || "";
    editDescription.value = post.description;
    editContent.value = post.content;
  } catch {
    editMessage.textContent = "Failed to load post";
    editMessage.style.color = "#ef4444";
  }

  editPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(editPostForm);
    const response = await fetch("/update-post", { method: "POST", body: formData });
    const data = await response.json();

    if (data.success) {
      editMessage.textContent = "Post updated successfully";
      editMessage.style.color = "#22c55e";
    } else {
      editMessage.textContent = data.message || "Update failed";
      editMessage.style.color = "#ef4444";
    }
  });
}

function renderPosts(target, posts) {
  if (!target) return;

  if (!posts.length) {
    target.innerHTML = `<article class="card"><div class="card-content"><h3>No posts yet</h3></div></article>`;
    return;
  }

  target.innerHTML = posts.map(post => `
    <article class="card">
      ${post.image ? `<img src="${post.image}" alt="${post.title}" class="card-image real-card-image">` : ""}
      <div class="card-content">
        <span class="tag">${post.category}</span>
        <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
        <p>${post.description}</p>
      </div>
    </article>
  `).join("");
}

async function loadPublicPosts(target, limit = null) {
  if (!target) return;
  const posts = await getAllPosts();
  renderPosts(target, limit ? posts.slice(0, limit) : posts);
}

async function loadCategoryPosts() {
  const posts = await getAllPosts();
  renderPosts(footballPosts, posts.filter(p => p.category.toLowerCase() === "football"));
  renderPosts(bettingPosts, posts.filter(p => p.category.toLowerCase() === "betting"));
  renderPosts(playersPosts, posts.filter(p => p.category.toLowerCase() === "players"));
  renderPosts(trendingPosts, posts.filter(p => p.category.toLowerCase() === "trending"));
}

async function loadComments(slug) {
  const container = document.getElementById("commentsList");
  if (!container) return;

  try {
    const response = await fetch(`/get-comments?slug=${encodeURIComponent(slug)}`);
    const data = await response.json();

    if (!data.success || !data.comments.length) {
      container.innerHTML = `<p>No comments yet.</p>`;
      return;
    }

    container.innerHTML = data.comments.map(c => `
      <div class="comment-box">
        <strong>${c.name}</strong>
        <p>${c.comment}</p>
      </div>
    `).join("");
  } catch {
    container.innerHTML = `<p>Failed to load comments.</p>`;
  }
}

async function loadLikes(slug) {
  const likesCount = document.getElementById("likesCount");
  const likeBtn = document.getElementById("likeBtn");
  if (!likesCount) return;

  try {
    const response = await fetch(`/get-likes?slug=${encodeURIComponent(slug)}`);
    const data = await response.json();
    likesCount.textContent = data.likes || 0;

    const likedKey = `liked_${slug}`;
    if (localStorage.getItem(likedKey) && likeBtn) {
      likeBtn.disabled = true;
      likeBtn.textContent = `👍 Liked (${data.likes || 0})`;
    }
  } catch {
    likesCount.textContent = 0;
  }
}

async function loadAnalytics() {
  if (!analyticsBoxes || !topPostsList) return;

  try {
    const response = await fetch("/analytics");
    const data = await response.json();

    if (!data.success) return;

    analyticsBoxes.innerHTML = `
      <div class="dashboard-box analytics-red"><h3>Total Views</h3><p>${data.totalViews}</p></div>
      <div class="dashboard-box analytics-green"><h3>Today's Views</h3><p>${data.dailyViews}</p></div>
      <div class="dashboard-box analytics-red"><h3>Last Activity</h3><p>${data.lastActivity}</p></div>
    `;

    if (!data.topPosts.length) {
      topPostsList.innerHTML = `<p>No viewed posts yet.</p>`;
      return;
    }

    topPostsList.innerHTML = data.topPosts.map(post => `
      <div class="comment-box">
        <strong>${post.title}</strong>
        <p>${post.views} views</p>
      </div>
    `).join("");
  } catch {}
}

async function loadDashboardPostCount() {
  if (!dashboardTotalPosts) return;
  const posts = await getAllPosts();
  dashboardTotalPosts.textContent = posts.length;
}

async function loadSinglePost() {
  if (!singlePostContainer) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    singlePostContainer.innerHTML = `<h1>Post not found</h1>`;
    return;
  }

  try {
    await trackView(slug);

    const response = await fetch(`/public-post?slug=${encodeURIComponent(slug)}`);
    const data = await response.json();

    if (!data.success) {
      singlePostContainer.innerHTML = `<h1>Post not found</h1>`;
      return;
    }

    const post = data.post;
    const shareUrl = `${window.location.origin}/post.html?slug=${post.slug}`;
    const imageBlock = post.image
      ? `<img src="${post.image}" alt="${post.title}" class="real-post-image">`
      : `<div class="single-post-image"></div>`;

    singlePostContainer.innerHTML = `
      <span class="tag">${post.category}</span>
      <h1>${post.title}</h1>
      <p class="post-meta">${new Date(post.createdAt).toDateString()}</p>
      ${imageBlock}
      <div class="single-post-content">
        <p>${post.description}</p>
        <p>${post.content.replace(/\n/g, "</p><p>")}</p>
      </div>

      <div class="post-actions">
        <button id="likeBtn">👍 Like (<span id="likesCount">0</span>)</button>
        <button id="shareBtn" class="share-btn">Share</button>
      </div>

      <section class="comments-section">
        <h3>Comments</h3>
        <form id="commentForm" class="post-form">
          <input type="text" name="name" id="commentName" placeholder="Your name" required />
          <textarea name="comment" id="commentText" rows="4" placeholder="Write a comment" required></textarea>
          <button type="submit">Post Comment</button>
        </form>
        <div id="commentsList"></div>
      </section>
    `;

    await loadLikes(slug);
    await loadComments(slug);

    const likeBtn = document.getElementById("likeBtn");
    if (likeBtn) {
      likeBtn.addEventListener("click", async () => {
        const likedKey = `liked_${slug}`;
        if (localStorage.getItem(likedKey)) return;

        const formData = new FormData();
        formData.append("slug", slug);
        const response = await fetch("/like-post", { method: "POST", body: formData });
        const data = await response.json();

        if (data.success) {
          localStorage.setItem(likedKey, "true");
          document.getElementById("likesCount").textContent = data.likes;
          likeBtn.disabled = true;
          likeBtn.textContent = `👍 Liked (${data.likes})`;
        }
      });
    }

    const shareBtn = document.getElementById("shareBtn");
    if (shareBtn) {
      shareBtn.addEventListener("click", async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: post.title,
              text: post.description,
              url: shareUrl
            });
          } catch {}
        } else {
          navigator.clipboard.writeText(shareUrl);
          shareBtn.textContent = "Link Copied";
        }
      });
    }

    const commentForm = document.getElementById("commentForm");
    if (commentForm) {
      commentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("slug", slug);
        formData.append("name", document.getElementById("commentName").value.trim());
        formData.append("comment", document.getElementById("commentText").value.trim());

        const response = await fetch("/save-comment", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          commentForm.reset();
          loadComments(slug);
        } else {
          alert(data.message || "Comment failed");
        }
      });
    }
  } catch {
    singlePostContainer.innerHTML = `<h1>Error loading post</h1>`;
  }
}

async function handleSearch(query) {
  if (!searchResults) return;
  const posts = await getAllPosts();
  const q = query.toLowerCase().trim();
  const filtered = posts.filter(post =>
    post.title.toLowerCase().includes(q) ||
    post.description.toLowerCase().includes(q) ||
    post.content.toLowerCase().includes(q) ||
    post.category.toLowerCase().includes(q)
  );
  renderPosts(searchResults, filtered);
}

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleSearch(searchInput.value);
  });
}

if (!isProtectedPage) {
  trackView();
}

if (isProtectedPage) {
  fetch("/session")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        window.location.href = "/admin.html";
      } else {
        loadAdminPosts();
        loadEditPost();
        loadAnalytics();
        loadDashboardPostCount();
      }
    })
    .catch(() => {
      window.location.href = "/admin.html";
    });
}

applyPublicSettings();
loadHeroSlider();
loadPublicPosts(publicHomePosts, 6);
loadPublicPosts(publicPostsList);
loadCategoryPosts();
loadSinglePost();
