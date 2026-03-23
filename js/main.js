const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const slides = document.querySelectorAll(".hero-main");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
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

if (isProtectedPage) {
  fetch("/session")
    .then((response) => response.json())
    .then((data) => {
      if (!data.loggedIn) {
        window.location.href = "/admin.html";
      }
    })
    .catch(() => {
      window.location.href = "/admin.html";
    });
}
