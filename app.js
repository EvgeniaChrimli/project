const burger = document.querySelector(".burger");
const menu = document.querySelector(".mobile");
const closed = document.querySelector(".mobile_close");

burger.addEventListener("click", () => {
  menu.classList.toggle("mob-active");
});

closed.addEventListener("click", () => {
  menu.classList.remove("mob-active");
});

document.addEventListener("DOMContentLoaded", () => {
  const cursorImages = document.querySelectorAll(".cursor_img");

  const isDesktop = window.innerWidth > 1194;

  if (isDesktop) {
    const cursorSection = document.querySelector(".cursor_title");

    const coords = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const positions = [];
    let isInside = false;

    cursorImages.forEach((img, i) => {
      positions[i] = { x: coords.x, y: coords.y };
      gsap.set(img, {
        x: coords.x,
        y: coords.y,
        opacity: 0,
        scale: 1,
      });
    });

    cursorSection.addEventListener("mouseenter", () => {
      isInside = true;
      cursorImages.forEach((img, i) => {
        gsap.to(img, {
          opacity: 1,
          scale: 1,
          y: "-=10",
          delay: i * 0.07,
          duration: 0.9,
          ease: "power2.out",
        });
      });
    });

    cursorSection.addEventListener("mouseleave", () => {
      isInside = false;
      cursorImages.forEach((img, i) => {
        gsap.to(img, {
          y: "+=100",
          opacity: 0,
          scale: 0.95,
          delay: i * 0.15,
          duration: 0.9,
          ease: "power2.in",
        });
      });
    });

    cursorSection.addEventListener("mousemove", (e) => {
      if (!isInside) return;
      const rect = cursorSection.getBoundingClientRect();
      const padding = 50;
      coords.x = Math.min(
        rect.right - padding,
        Math.max(rect.left + padding, e.clientX)
      );
      coords.y = Math.min(
        rect.bottom - padding,
        Math.max(rect.top + padding, e.clientY)
      );
    });

    gsap.ticker.add(() => {
      if (!isInside) return;
      const spacing = 10;
      cursorImages.forEach((img, i) => {
        const target = i === 0 ? coords : positions[i - 1];
        positions[i].x += (target.x - positions[i].x) * 0.03;
        positions[i].y += (target.y - positions[i].y) * 0.03;

        const offsetX = (positions[i].x - target.x) * (i * spacing * 0.2);
        const offsetY = (positions[i].y - target.y) * (i * spacing * 0.2);

        gsap.set(img, {
          x: positions[i].x + offsetX,
          y: positions[i].y + offsetY,
        });
      });
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".image-sequence");
  const images = container.querySelectorAll(".img");

  let isAnimating = false;

  function resetState() {
    images.forEach((img) => {
      img.classList.remove("visible");
      img.style.opacity = "1";
    });
    container.classList.remove("fade-out");
  }

  function runSequence() {
    if (isAnimating) return;
    isAnimating = true;

    images.forEach((img) => img.classList.remove("visible"));
    container.classList.remove("fade-out");

    images.forEach((img, i) => {
      setTimeout(() => {
        img.classList.add("visible");
      }, i * 1500);
    });

    const totalTime = images.length * 2500;

    setTimeout(() => {
      container.classList.add("fade-out");
    }, totalTime);

    setTimeout(() => {
      isAnimating = false;
      runSequence();
    }, totalTime + 2000);
  }

  function updateBehavior() {
    const width = window.innerWidth;

    if (width <= 380) {
      images.forEach((img) => (img.style.opacity = ""));
      runSequence();
    } else if (width <= 1195) {
      isAnimating = false;
      images.forEach((img) => {
        img.classList.remove("visible");
        img.style.opacity = "1";
      });
      container.classList.remove("fade-out");
    } else {
      isAnimating = false;
      images.forEach((img) => {
        img.classList.remove("visible");
        img.style.opacity = "0";
      });
      container.classList.remove("fade-out");
    }
  }

  updateBehavior();

  window.addEventListener("resize", () => {
    resetState();
    updateBehavior();
  });
});

const swiper = new Swiper(".swiper", {
  slidesPerView: 1,
  centeredSlides: true,
  loop: false,
  spaceBetween: 32,
  navigation: {
    nextEl: ".button-next",
    prevEl: ".button-prev",
  },
  pagination: {
    el: ".pagination",
    clickable: true,
  },
});

const audio = document.getElementById("my-audio");
const playButton = document.getElementById("play-toggle");

function updateIcon(isPlaying) {
  playButton.src = isPlaying
    ? "./assets/images/play.svg"
    : "./assets/images/stop.svg";
}

function togglePlay() {
  if (audio.paused) {
    audio
      .play()
      .then(() => updateIcon(true))
      .catch((err) => console.error("Ошибка воспроизведения:", err));
  } else {
    audio.pause();
    updateIcon(false);
  }
}

playButton.addEventListener("click", togglePlay);
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
  }
);

document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

const paragraphs = document.querySelectorAll(".anim-text");
let hasTyped = false;

function typeText(el, text, speed = 10) {
  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i === text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

async function startTyping() {
  for (const p of paragraphs) {
    const text = p.dataset.text;
    await typeText(p, text, 25);
    await new Promise((r) => setTimeout(r, 100));
  }
}

const observer2 = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasTyped) {
        hasTyped = true;
        startTyping();
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
  }
);
const target = document.getElementById("who");
observer2.observe(target);

const videos = document.querySelectorAll("video");
videos.forEach((video) => {
  video.muted = true; // программно
  video.play().catch((err) => {
    console.warn("Autoplay failed:", err);
  });
});
