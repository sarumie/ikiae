// Advanced Video Player JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Video carousel functionality
  let currentSlide = 0;
  let isPlaying = false;
  let isMuted = false;
  let cursorTimeout;
  let isDragging = false;

  // Video data structure (dynamic)
  let videos = [
    {
      url: "#",
      title: "Modern Living Collection",
      description:
        "Discover our contemporary furniture pieces designed for modern lifestyles",
    },
    {
      url: "#",
      title: "Classic Elegance Series",
      description: "Timeless designs that bring sophistication to any space",
    },
    {
      url: "#",
      title: "Outdoor Comfort Range",
      description: "Premium outdoor furniture for your perfect exterior spaces",
    },
  ];

  // DOM elements
  const slides = document.querySelectorAll(".video-slide");
  const indicators = document.querySelectorAll(".indicator");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const centerPlayBtn = document.getElementById("centerPlayBtn");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const backwardBtn = document.getElementById("backwardBtn");
  const forwardBtn = document.getElementById("forwardBtn");
  const muteBtn = document.getElementById("muteBtn");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const progressHandle = document.getElementById("progressHandle");
  const currentTimeDisplay = document.getElementById("currentTime");
  const totalTimeDisplay = document.getElementById("totalTime");
  const videoTitle = document.getElementById("videoTitle");
  const videoDescription = document.getElementById("videoDescription");
  const videoControlsOverlay = document.getElementById("videoControlsOverlay");
  const videoPlayerWrapper = document.querySelector(".video-player-wrapper");

  // Initialize the carousel
  function initCarousel() {
    // Check if we're on the videos page
    if (!videoPlayerWrapper || slides.length === 0) {
      console.log(
        "Video player elements not found - skipping video initialization"
      );
      return;
    }

    showSlide(0);
    setupEventListeners();
    updateVideoInfo();
  }

  // Show specific slide
  function showSlide(n) {
    // Hide all slides
    slides.forEach((slide) => {
      slide.classList.remove("active");
    });

    // Remove active class from all indicators
    indicators.forEach((indicator) => {
      indicator.classList.remove("active");
    });

    // Show current slide with fade animation
    slides[n].classList.add("active");
    indicators[n].classList.add("active");

    currentSlide = n;

    // Update video playback
    updateVideoPlayback();
    updateVideoInfo();
  }

  // Next slide
  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // Previous slide
  function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  // Update video info display
  function updateVideoInfo() {
    const currentVideo = videos[currentSlide];
    if (videoTitle && videoDescription) {
      videoTitle.textContent = currentVideo.title;
      videoDescription.textContent = currentVideo.description;
    }
  }

  // Get current video element
  function getCurrentVideo() {
    return slides[currentSlide].querySelector("video");
  }

  // Update video playback state
  function updateVideoPlayback() {
    const currentVideo = getCurrentVideo();

    // Pause all videos first
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });

    // Update play button icons
    updatePlayButtonIcons();

    // Apply mute state to current video
    if (currentVideo) {
      currentVideo.muted = isMuted;
      updateMuteButtonIcon();
    }

    // Handle current video if playing
    if (currentVideo && isPlaying) {
      currentVideo.play().catch((e) => {
        console.log("Video play failed:", e);
        isPlaying = false;
        updatePlayButtonIcons();
      });
    }
  }

  // Update play button icons
  function updatePlayButtonIcons() {
    if (!centerPlayBtn || !playPauseBtn) return;

    const centerIcon = centerPlayBtn.querySelector("i");
    const controlIcon = playPauseBtn.querySelector("i");

    if (!centerIcon || !controlIcon) return;

    if (isPlaying) {
      centerIcon.classList.remove("fa-play");
      centerIcon.classList.add("fa-pause");
      controlIcon.classList.remove("fa-play");
      controlIcon.classList.add("fa-pause");
    } else {
      centerIcon.classList.remove("fa-pause");
      centerIcon.classList.add("fa-play");
      controlIcon.classList.remove("fa-pause");
      controlIcon.classList.add("fa-play");
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    const currentVideo = getCurrentVideo();
    if (!currentVideo) return;

    if (isPlaying) {
      currentVideo.pause();
      isPlaying = false;
    } else {
      currentVideo
        .play()
        .then(() => {
          isPlaying = true;
        })
        .catch((e) => {
          console.log("Video play failed:", e);
          isPlaying = false;
        });
    }

    updatePlayButtonIcons();
    showControlsTemporarily();
  }

  // Skip backward 5 seconds
  function skipBackward() {
    const currentVideo = getCurrentVideo();
    if (currentVideo) {
      currentVideo.currentTime = Math.max(0, currentVideo.currentTime - 5);
    }
    showControlsTemporarily();
  }

  // Skip forward 5 seconds
  function skipForward() {
    const currentVideo = getCurrentVideo();
    if (currentVideo) {
      currentVideo.currentTime = Math.min(
        currentVideo.duration,
        currentVideo.currentTime + 5
      );
    }
    showControlsTemporarily();
  }

  // Toggle mute/unmute
  function toggleMute() {
    const currentVideo = getCurrentVideo();
    if (!currentVideo) return;

    if (isMuted) {
      currentVideo.muted = false;
      isMuted = false;
    } else {
      currentVideo.muted = true;
      isMuted = true;
    }

    updateMuteButtonIcon();
    showControlsTemporarily();
  }

  // Update mute button icon
  function updateMuteButtonIcon() {
    if (!muteBtn) return;

    const muteIcon = muteBtn.querySelector("i");
    if (!muteIcon) return;

    if (isMuted) {
      muteIcon.classList.remove("fa-volume-up");
      muteIcon.classList.add("fa-volume-mute");
    } else {
      muteIcon.classList.remove("fa-volume-mute");
      muteIcon.classList.add("fa-volume-up");
    }
  }

  // Format time display
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  }

  // Update progress bar
  function updateProgress() {
    const currentVideo = getCurrentVideo();
    if (!currentVideo || !currentVideo.duration) return;

    const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
    progressFill.style.width = `${progress}%`;

    if (currentTimeDisplay) {
      currentTimeDisplay.textContent = formatTime(currentVideo.currentTime);
    }
    if (totalTimeDisplay) {
      totalTimeDisplay.textContent = formatTime(currentVideo.duration);
    }
  }

  // Handle progress bar click
  function handleProgressClick(e) {
    const currentVideo = getCurrentVideo();
    if (!currentVideo || !currentVideo.duration) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * currentVideo.duration;

    currentVideo.currentTime = newTime;
    showControlsTemporarily();
  }

  // Handle progress bar drag
  function handleProgressDrag(e) {
    if (!isDragging) return;

    const currentVideo = getCurrentVideo();
    if (!currentVideo || !currentVideo.duration) return;

    const rect = progressBar.getBoundingClientRect();
    const dragX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = dragX / rect.width;
    const newTime = percentage * currentVideo.duration;

    currentVideo.currentTime = newTime;
    e.preventDefault();
  }

  // Show controls temporarily
  function showControlsTemporarily() {
    if (!videoControlsOverlay || !videoPlayerWrapper) return;

    videoControlsOverlay.classList.add("show");
    videoPlayerWrapper.classList.add("show-cursor");

    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(() => {
      if (!videoPlayerWrapper.matches(":hover") && !isDragging) {
        videoControlsOverlay.classList.remove("show");
        videoPlayerWrapper.classList.remove("show-cursor");
      }
    }, 3000);
  }

  // Auto slide functionality removed - now manual navigation only

  // Setup event listeners
  function setupEventListeners() {
    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        nextSlide();
      });
    }

    // Play/pause buttons
    if (centerPlayBtn) {
      centerPlayBtn.addEventListener("click", togglePlayPause);
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", togglePlayPause);
    }

    // Control buttons
    if (backwardBtn) {
      backwardBtn.addEventListener("click", skipBackward);
    }

    if (forwardBtn) {
      forwardBtn.addEventListener("click", skipForward);
    }

    // Mute button
    if (muteBtn) {
      muteBtn.addEventListener("click", toggleMute);
    }

    // Progress bar interactions
    if (progressBar) {
      progressBar.addEventListener("click", handleProgressClick);
    }

    if (progressHandle) {
      progressHandle.addEventListener("mousedown", (e) => {
        isDragging = true;
        progressHandle.classList.add("dragging");
        document.addEventListener("mousemove", handleProgressDrag);
        document.addEventListener("mouseup", () => {
          isDragging = false;
          progressHandle.classList.remove("dragging");
          document.removeEventListener("mousemove", handleProgressDrag);
        });
        e.preventDefault();
      });
    }

    // Video click to play/pause
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (video) {
        video.addEventListener("click", togglePlayPause);

        // Video events
        video.addEventListener("timeupdate", updateProgress);

        video.addEventListener("loadedmetadata", () => {
          updateProgress();
        });

        video.addEventListener("play", () => {
          isPlaying = true;
          updatePlayButtonIcons();
        });

        video.addEventListener("pause", () => {
          isPlaying = false;
          updatePlayButtonIcons();
        });

        video.addEventListener("ended", () => {
          isPlaying = false;
          updatePlayButtonIcons();
          // Video will stay on current slide when ended
        });

        video.addEventListener("error", (e) => {
          console.log("Video error:", e);
        });
      }
    });

    // Video player wrapper click to play/pause (for when overlay is visible)
    if (videoPlayerWrapper) {
      videoPlayerWrapper.addEventListener("click", (e) => {
        // Check if the click is not on a control button or the progress bar
        const isControlButton = e.target.closest(
          ".control-btn, .center-play-btn, .nav-btn, .indicator, .progress-bar, .progress-handle"
        );

        if (!isControlButton) {
          togglePlayPause();
        }
      });
    }

    // Video controls overlay click to play/pause (anywhere except on controls)
    if (videoControlsOverlay) {
      videoControlsOverlay.addEventListener("click", (e) => {
        // Check if the click is not on a control button or the progress bar
        const isControlButton = e.target.closest(
          ".control-btn, .center-play-btn, .progress-bar, .progress-handle"
        );

        if (!isControlButton) {
          togglePlayPause();
        }
      });
    }

    // Indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        showSlide(index);
      });
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowLeft":
          prevSlide();
          break;
        case "ArrowRight":
          nextSlide();
          break;
        case " ":
        case "k":
          e.preventDefault();
          togglePlayPause();
          break;
        case "ArrowUp":
          e.preventDefault();
          skipForward();
          break;
        case "ArrowDown":
          e.preventDefault();
          skipBackward();
          break;
        case "j":
          e.preventDefault();
          skipBackward();
          break;
        case "l":
          e.preventDefault();
          skipForward();
          break;
      }
    });

    // Touch/swipe support for mobile
    let startX = 0;
    let endX = 0;

    videoPlayerWrapper.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    videoPlayerWrapper.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = startX - endX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Cursor hide/show functionality
    let mouseMoveTimeout;

    videoPlayerWrapper.addEventListener("mouseenter", () => {
      showControlsTemporarily();
    });

    videoPlayerWrapper.addEventListener("mousemove", () => {
      showControlsTemporarily();
    });

    videoPlayerWrapper.addEventListener("mouseleave", () => {
      clearTimeout(cursorTimeout);
      if (!isDragging) {
        videoControlsOverlay.classList.remove("show");
        videoPlayerWrapper.classList.remove("show-cursor");
      }
    });

    // Auto-slide removed - no hover controls needed

    // Handle visibility change (pause video when tab is not active)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (isPlaying) {
          const currentVideo = getCurrentVideo();
          if (currentVideo) {
            currentVideo.pause();
          }
        }
      } else {
        if (isPlaying) {
          const currentVideo = getCurrentVideo();
          if (currentVideo) {
            currentVideo.play().catch((e) => {
              console.log("Video play failed after visibility change:", e);
            });
          }
        }
      }
    });
  }

  // Public function to update video sources dynamically
  window.updateVideoSources = function (newVideos) {
    if (!newVideos || !Array.isArray(newVideos)) {
      console.error("Invalid video data provided");
      return;
    }

    // Update videos array
    videos = newVideos;

    // Update video elements
    slides.forEach((slide, index) => {
      const video = slide.querySelector("video");
      const source = video.querySelector("source");

      if (source && newVideos[index] && newVideos[index].url) {
        source.src = newVideos[index].url;
        video.load();
      } else if (source) {
        // Clear the src if no valid URL is provided
        source.src = "";
      }
    });

    // Update indicators if needed
    const indicatorsContainer = document.querySelector(".video-indicators");
    if (indicatorsContainer && newVideos.length !== indicators.length) {
      // Rebuild indicators
      indicatorsContainer.innerHTML = "";
      newVideos.forEach((_, index) => {
        const indicator = document.createElement("button");
        indicator.className = `indicator ${index === 0 ? "active" : ""}`;
        indicator.setAttribute("data-slide", index);
        indicator.addEventListener("click", () => {
          showSlide(index);
        });
        indicatorsContainer.appendChild(indicator);
      });
    }

    // Reset to first slide and update info
    currentSlide = 0;
    showSlide(0);
  };

  // Public function to add a single video
  window.addVideo = function (videoData) {
    if (!videoData || !videoData.url) {
      console.error("Invalid video data provided");
      return;
    }

    videos.push({
      url: videoData.url,
      title: videoData.title || "Untitled Video",
      description: videoData.description || "No description available",
    });

    // You might want to rebuild the player here or call updateVideoSources
    console.log(
      "Video added. Call updateVideoSources() to refresh the player."
    );
  };

  // Initialize video sources first
  updateVideoSources([
    {
      url: "https://cdn-1.files.vc/files/vc2/7d28a69a9a80b79107ee810bba3ed687.mp4",
      title: "Modern Living Collection",
      description:
        "Discover our contemporary furniture pieces designed for modern lifestyles",
    },
    {
      url: "https://cdn-1.files.vc/files/whj/4afee2bef2b1f83df737278d7637170f.mp4",
      title: "Classic Elegance Series",
      description: "Timeless designs that bring sophistication to any space",
    },
    {
      url: "https://cdn-1.files.vc/files/k78/72422fe7d71f291bfd2241c42a463415.mp4",
      title: "Outdoor Comfort Range",
      description: "Premium outdoor furniture for your perfect exterior spaces",
    },
  ]);

  // Initialize the carousel
  initCarousel();

  // Smooth scroll to top functionality
  const topBtn = document.querySelector(".top");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        topBtn.style.opacity = "1";
        topBtn.style.visibility = "visible";
      } else {
        topBtn.style.opacity = "0";
        topBtn.style.visibility = "hidden";
      }
    });
  }
});

// Theme toggle functionality
document.addEventListener("DOMContentLoaded", function () {
  const themeToggle = document.getElementById("theme-toggle");
  const body = document.body;

  // Check for saved theme preference or default to light mode
  const savedTheme = localStorage.getItem("theme") || "light";
  body.setAttribute("data-theme", savedTheme);

  if (savedTheme === "dark") {
    themeToggle.checked = true;
  }

  // Theme toggle event listener
  if (themeToggle) {
    themeToggle.addEventListener("change", function () {
      if (this.checked) {
        body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
      } else {
        body.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      }
    });
  }
});
