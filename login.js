// Theme Switcher
function setupThemeSwitcher() {
  const themeToggle = document.getElementById("theme-toggle");

  // Check for saved theme preference, otherwise use system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Set initial theme
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.checked = true;
  }

  // Handle theme toggle
  themeToggle.addEventListener("change", function (e) {
    if (e.target.checked) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  });
}

// Password Visibility Toggle
function setupPasswordToggle() {
  const passwordInput = document.querySelector('input[type="password"]');
  const passwordToggle = document.querySelector(".password-toggle");

  passwordToggle.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type");
    const icon = this.querySelector("i");

    if (type === "password") {
      passwordInput.setAttribute("type", "text");
      icon.classList.remove("fa-eye");
      icon.classList.add("fa-eye-slash");
    } else {
      passwordInput.setAttribute("type", "password");
      icon.classList.remove("fa-eye-slash");
      icon.classList.add("fa-eye");
    }
  });
}

// Form Submission
function setupFormSubmission() {
  const loginForm = document.querySelector(".login-form");

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = this.querySelector('input[type="email"]').value;
    const password = this.querySelector('input[type="password"]').value;

    if (!email || !password) {
      showToast("Please fill in all fields");
      return;
    }

    // Add loading state to button
    const submitButton = this.querySelector(".login-btn");
    submitButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitButton.disabled = true;

    // Here you would typically validate credentials with your server
    // For now, we'll simulate a successful login
    showToast("Signing in...");

    // Redirect to index.html after a brief delay
    setTimeout(() => {
      window.location.href = "/index.html";
    }, 1500);
  });
}

// Social Login Buttons
function setupSocialLogin() {
  const socialButtons = document.querySelectorAll(".social-btn");

  socialButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const platform = this.classList[1]; // google, facebook, or apple
      console.log(`${platform} login clicked`);
      // Implement social login logic here
      showToast(`${platform} login coming soon...`);
    });
  });
}

// Toast Notification
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "var(--card-bg)";
  toast.style.color = "var(--text-color)";
  toast.style.padding = "12px 24px";
  toast.style.borderRadius = "25px";
  toast.style.backdropFilter = "blur(10px)";
  toast.style.border = "1px solid var(--border-color)";
  toast.style.zIndex = "9999";
  toast.style.opacity = "0";
  toast.style.transition = "opacity 0.3s ease";

  setTimeout(() => (toast.style.opacity = "1"), 100);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Initialize all functions when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupThemeSwitcher();
  setupPasswordToggle();
  setupFormSubmission();
  setupSocialLogin();
});
