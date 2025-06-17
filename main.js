document.addEventListener("DOMContentLoaded", () => {
  function setupHeaderScrollAnimation() {
    let lastScrollTop = 0;
    const header = document.getElementById("header");
    const logo = document.querySelector(".company-logo");
    const headerControls = document.querySelector(".header-controls");
    const scrollThreshold = 10;

    window.addEventListener("scroll", function () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

      if (Math.abs(scrollTop - lastScrollTop) <= scrollThreshold) {
        return;
      }

      if (scrollTop > 100) {
        logo.classList.add("scrolled");
        headerControls.classList.add("scrolled");
      } else {
        logo.classList.remove("scrolled");
        headerControls.classList.remove("scrolled");
      }

      if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
        header.classList.add("header-hidden");
        logo.classList.add("header-hidden");
        headerControls.classList.add("header-hidden");
      } else {
        header.classList.remove("header-hidden");
        logo.classList.remove("header-hidden");
        headerControls.classList.remove("header-hidden");
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  function setupProductCards() {
    const productSections = document.querySelectorAll(".text-inside");

    if (productSections.length === 0) {
      return; // Elements don't exist on this page
    }

    productSections.forEach((section) => {
      const plus = section.querySelector(".plus");
      const textBox = section.querySelector(".text-box");

      if (!plus || !textBox) {
        return; // Required elements not found in this section
      }

      plus.onclick = () => {
        document.querySelectorAll(".text-box.active").forEach((box) => {
          if (box !== textBox) {
            box.classList.remove("active");
            box
              .closest(".text-inside")
              .querySelector(".plus")
              .classList.remove("img_active");
          }
        });

        textBox.classList.toggle("active");
        plus.classList.toggle("img_active");
      };
    });
  }

  function setupScrollToTop() {
    const top = document.querySelector(".top");

    if (!top) {
      return; // Element doesn't exist on this page
    }

    window.addEventListener("scroll", () => {
      top.style.display = window.scrollY > 100 ? "block" : "none";
    });

    top.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  function setupVideo() {
    const videoLink = document.querySelector(".bg-show .link");
    const videoOverlay = document.querySelector(".bg-show .overlay");
    const videoCancel = document.querySelector(".bg-show .cancel");
    const video = document.querySelector("#video");
    const videoPlayer = document.querySelector(".bg-player");

    // Only setup video functionality if elements exist (for index.html)
    if (!videoLink || !videoOverlay || !videoCancel || !video || !videoPlayer) {
      return; // Elements don't exist on this page
    }

    videoLink.addEventListener("click", (e) => {
      e.preventDefault();
      videoOverlay.style.display = "block";
    });

    videoCancel.addEventListener("click", () => {
      videoOverlay.style.display = "none";
      video.pause();
      updatePlayIcon(true);
    });

    videoPlayer.addEventListener("click", () => {
      const isPaused = video.paused;
      isPaused ? video.play() : video.pause();
      updatePlayIcon(isPaused);
    });

    videoOverlay.addEventListener("click", (e) => {
      if (e.target === videoOverlay) {
        videoOverlay.style.display = "none";
        video.pause();
        updatePlayIcon(true);
      }
    });

    function updatePlayIcon(isPaused) {
      const icon = videoPlayer.querySelector("i");
      icon.classList.remove(isPaused ? "fa-play" : "fa-pause");
      icon.classList.add(isPaused ? "fa-pause" : "fa-play");
    }
  }

  function setupThemeSwitcher() {
    const themeToggle = document.getElementById("theme-toggle");

    if (!themeToggle) {
      return; // Theme toggle doesn't exist on this page
    }

    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute("data-theme", "dark");
      themeToggle.checked = true;
    }

    themeToggle.addEventListener("change", function () {
      const isDark = this.checked;
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  }

  function setupSearch() {
    const searchBtn = document.querySelector(".search-btn");
    const searchBox = document.querySelector(".search-box");
    const searchClose = document.querySelector(".search-close");
    const searchInput = document.querySelector(".search-box input");
    const header = document.querySelector("#header");

    if (!searchBtn || !searchBox || !searchClose || !searchInput || !header) {
      return; // Search elements don't exist on this page
    }

    searchBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openSearch();
    });

    searchClose.addEventListener("click", closeSearch);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchBox.classList.contains("active")) {
        closeSearch();
      }
    });

    document.addEventListener("click", (e) => {
      if (
        !searchBox.contains(e.target) &&
        !searchBtn.contains(e.target) &&
        searchBox.classList.contains("active")
      ) {
        closeSearch();
      }
    });

    function openSearch() {
      header.classList.add("search-active");
      searchBox.classList.add("active");
      // Small delay to ensure the search box is visible before focusing
      setTimeout(() => {
        searchInput.focus();
      }, 100);
    }

    function closeSearch() {
      header.classList.remove("search-active");
      searchBox.classList.remove("active");
      searchInput.value = "";
    }
  }

  function setupSmoothScroll() {
    const bgLink = document.querySelector(".bg-link a");

    // Only setup smooth scroll if element exists (for index.html)
    if (!bgLink) {
      return; // Element doesn't exist on this page
    }

    bgLink.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);
      const headerHeight = document.querySelector("#header").offsetHeight;
      const offset = 50;

      window.scrollTo({
        top: targetSection.offsetTop - headerHeight - offset,
        behavior: "smooth",
      });
    });
  }

  // Mobile Menu Functionality
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const mobileNavOverlay = document.querySelector(".mobile-nav-overlay");
  const mobileNavClose = document.querySelector(".mobile-nav-close");
  const mobileNavLinks = document.querySelectorAll(".mobile-navigation a");

  // Open mobile menu
  mobileMenuBtn.addEventListener("click", () => {
    mobileNavOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  // Close mobile menu
  mobileNavClose.addEventListener("click", () => {
    mobileNavOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Close mobile menu when clicking a link
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileNavOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  // Close mobile menu when clicking outside
  mobileNavOverlay.addEventListener("click", (e) => {
    if (e.target === mobileNavOverlay) {
      mobileNavOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  setupHeaderScrollAnimation();
  setupThemeSwitcher();
  setupProductCards();
  setupScrollToTop();
  setupVideo();
  setupSearch();
  setupSmoothScroll();
});
