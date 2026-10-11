/* ==========================================================
   A SECRET MESSAGE FOR YOU — INTERACTIVE LOGIC
   ========================================================== */

// --- Global DOM Elements ---
const secretSection = document.getElementById("secret");
const letterSection = document.getElementById("letterSection");
const finaleSection = document.getElementById("finaleSection");
const letterTextEl = document.getElementById("letterText");
const typingCursor = document.getElementById("typingCursor");
const letterSignature = document.getElementById("letterSignature");
const btnOneMore = document.getElementById("btnOneMore");
const secretModal = document.getElementById("secretModal");
const floatingReplayBar = document.getElementById("floatingReplayBar");

// Audio Elements
const bgAudio = document.getElementById("bgAudio");
const audioWidget = document.getElementById("audioWidget");
const audioLabel = document.getElementById("audioLabel");
const audioToggleBtn = document.getElementById("audioToggleBtn");

// --- Letter Content ---
const letterFullText = 
`I don't really know when it happened.

Maybe it was one conversation.
Maybe it was one smile.
Maybe it was simply the way you became
someone I started looking forward to.

Some people enter your life quietly...
and somehow become a favourite part of it.

So this isn't a big confession.
It's just a little piece of my heart,
wrapped up in a webpage,
because saying it directly is a little scary. 💗`;

let isTyping = false;
let typedComplete = false;
let typingTimeoutId = null;

/* ----------------------------------------------------------
   AUDIO SYSTEM
---------------------------------------------------------- */
let isAudioPlaying = false;

function initAudio() {
  bgAudio.volume = 0.6;

  // Global user interaction trigger for autoplay unlock
  const unlockAudio = () => {
    if (!isAudioPlaying) {
      playAudio();
    }
    window.removeEventListener("click", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
  };

  window.addEventListener("click", unlockAudio, { once: true });
  window.addEventListener("touchstart", unlockAudio, { once: true });
}

function playAudio() {
  bgAudio.play().then(() => {
    isAudioPlaying = true;
    audioWidget.classList.add("playing");
    audioLabel.textContent = "Music: On";
  }).catch((err) => {
    console.log("Audio play prevented by browser policy:", err);
  });
}

function pauseAudio() {
  bgAudio.pause();
  isAudioPlaying = false;
  audioWidget.classList.remove("playing");
  audioLabel.textContent = "Music: Off";
}

function toggleAudio(e) {
  if (e) e.stopPropagation();
  if (isAudioPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

if (audioWidget) {
  audioWidget.addEventListener("click", toggleAudio);
}

/* ----------------------------------------------------------
   STEP 1 -> STEP 2: OPEN LETTER
---------------------------------------------------------- */
function openLetter() {
  playAudio();
  spawnClickBurst(window.innerWidth / 2, window.innerHeight / 2, 25);

  secretSection.classList.remove("active");

  setTimeout(() => {
    secretSection.style.display = "none";
    letterSection.style.display = "flex";
    
    // Force reflow for smooth transition
    void letterSection.offsetWidth;
    letterSection.classList.add("active");

    window.scrollTo({
      top: letterSection.offsetTop,
      behavior: "smooth"
    });

    startTypingMessage();
  }, 400);
}

/* ----------------------------------------------------------
   STEP 2: TYPEWRITER EFFECT
---------------------------------------------------------- */
function startTypingMessage() {
  if (typedComplete) return;
  isTyping = true;
  letterTextEl.textContent = "";
  typingCursor.style.display = "inline-block";

  let charIndex = 0;

  function typeNextChar() {
    if (charIndex < letterFullText.length) {
      const char = letterFullText[charIndex];
      letterTextEl.textContent += char;
      charIndex++;

      // Natural cadence pauses
      let delay = 35;
      if (char === '.' || char === '!' || char === '?') {
        delay = 280;
      } else if (char === ',') {
        delay = 140;
      } else if (char === '\n') {
        delay = 220;
      }

      typingTimeoutId = setTimeout(typeNextChar, delay);
    } else {
      finishTyping();
    }
  }

  typeNextChar();
}

function finishTyping() {
  if (typingTimeoutId) clearTimeout(typingTimeoutId);
  isTyping = false;
  typedComplete = true;
  letterTextEl.textContent = letterFullText;
  typingCursor.style.display = "none";

  setTimeout(() => {
    letterSignature.classList.add("visible");
  }, 200);

  setTimeout(() => {
    btnOneMore.classList.add("visible");
    spawnClickBurst(btnOneMore.getBoundingClientRect().left + 50, btnOneMore.getBoundingClientRect().top + 20, 15);
  }, 700);
}

// Allow user to click anywhere on letter paper to fast-complete typing
letterSection.addEventListener("click", (e) => {
  if (isTyping && !typedComplete && e.target.id !== "btnOneMore") {
    finishTyping();
  }
});

/* ----------------------------------------------------------
   STEP 2 -> STEP 3: FINALE
---------------------------------------------------------- */
function showFinale() {
  spawnClickBurst(window.innerWidth / 2, window.innerHeight / 2, 30);

  letterSection.classList.remove("active");

  setTimeout(() => {
    letterSection.style.display = "none";
    finaleSection.style.display = "flex";

    void finaleSection.offsetWidth;
    finaleSection.classList.add("active");

    window.scrollTo({
      top: finaleSection.offsetTop,
      behavior: "smooth"
    });
  }, 400);
}

/* ----------------------------------------------------------
   STEP 3: KEEP SECRET & CELEBRATION
---------------------------------------------------------- */
function keepSecret() {
  spawnClickBurst(window.innerWidth / 2, window.innerHeight * 0.7, 35);
  secretModal.classList.add("active");
}

function closeSecretModal() {
  secretModal.classList.remove("active");

  // Grand Romantic Celebration Explosion!
  celebrateMassiveHearts();

  // Reveal floating replay button
  setTimeout(() => {
    floatingReplayBar.classList.add("visible");
  }, 1000);
}

/* ----------------------------------------------------------
   RESTART EXPERIENCE
---------------------------------------------------------- */
function restartExperience() {
  floatingReplayBar.classList.remove("visible");
  finaleSection.classList.remove("active");
  secretModal.classList.remove("active");

  setTimeout(() => {
    finaleSection.style.display = "none";
    letterSection.style.display = "none";
    secretSection.style.display = "flex";

    typedComplete = false;
    isTyping = false;
    letterTextEl.textContent = "";
    letterSignature.classList.remove("visible");
    btnOneMore.classList.remove("visible");

    void secretSection.offsetWidth;
    secretSection.classList.add("active");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, 400);
}

/* ----------------------------------------------------------
   CANVAS AMBIENT ENGINE & CELEBRATION
   Stars, Floating Hearts, Shooting Stars & Explosions
---------------------------------------------------------- */
const canvas = document.getElementById("ambientCanvas");
const ctx = canvas.getContext("2d");

let stars = [];
let ambientHearts = [];
let burstParticles = [];
let shootingStars = [];

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.scale(dpr, dpr);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initStars();
});

// Initialize Ambient Stars
function initStars() {
  stars = [];
  const count = Math.floor((window.innerWidth * window.innerHeight) / 7500);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.4 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.03 + 0.01,
      phase: Math.random() * Math.PI * 2
    });
  }
}

// Ambient Floating Hearts
function spawnAmbientHeart() {
  if (ambientHearts.length >= 35) return;
  const size = Math.random() * 14 + 10;
  ambientHearts.push({
    x: Math.random() * window.innerWidth,
    y: window.innerHeight + 30,
    size: size,
    speedY: Math.random() * 0.8 + 0.4,
    speedX: (Math.random() - 0.5) * 0.5,
    swaySpeed: Math.random() * 0.02 + 0.01,
    swayAmp: Math.random() * 20 + 10,
    swayPhase: Math.random() * Math.PI * 2,
    alpha: Math.random() * 0.45 + 0.2,
    rot: (Math.random() - 0.5) * 0.4,
    rotSpeed: (Math.random() - 0.5) * 0.01
  });
}

// Shooting Star
function spawnShootingStar() {
  if (Math.random() < 0.015 && shootingStars.length < 3) {
    const startX = Math.random() * window.innerWidth * 0.8;
    const startY = Math.random() * window.innerHeight * 0.4;
    shootingStars.push({
      x: startX,
      y: startY,
      len: Math.random() * 90 + 70,
      speed: Math.random() * 7 + 8,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
      alpha: 1,
      life: 0
    });
  }
}

// Click Burst Hearts
function spawnClickBurst(x, y, count = 18) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 1.5;
    burstParticles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.2,
      size: Math.random() * 16 + 10,
      alpha: 1,
      decay: Math.random() * 0.025 + 0.015,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.15,
      type: Math.random() > 0.4 ? 'heart' : 'sparkle'
    });
  }
}

// Massive Celebration Explosion
function celebrateMassiveHearts() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  for (let i = 0; i < 180; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 11 + 2.5;
    burstParticles.push({
      x: cx + (Math.random() - 0.5) * 60,
      y: cy + (Math.random() - 0.5) * 60,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3.5,
      size: Math.random() * 22 + 10,
      alpha: 1,
      decay: Math.random() * 0.012 + 0.008,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
      type: Math.random() > 0.3 ? 'heart' : 'sparkle',
      color: ['#ff4071', '#ff7597', '#ffb6c1', '#ffffff', '#ffd700'][Math.floor(Math.random() * 5)]
    });
  }
}

// Helper: Draw smooth vector heart
function drawHeart(context, x, y, size, color, alpha, rot = 0) {
  context.save();
  context.translate(x, y);
  context.rotate(rot);
  context.globalAlpha = Math.max(0, Math.min(1, alpha));
  context.fillStyle = color;

  context.beginPath();
  const topCurveHeight = size * 0.3;
  context.moveTo(0, topCurveHeight);
  // top left curve
  context.bezierCurveTo(
    -size / 2, -size / 2,
    -size, size / 3,
    0, size
  );
  // top right curve
  context.bezierCurveTo(
    size, size / 3,
    size / 2, -size / 2,
    0, topCurveHeight
  );
  context.closePath();
  context.fill();

  context.restore();
}

// Helper: Draw 4-point sparkle star
function drawSparkle(context, x, y, size, color, alpha, rot = 0) {
  context.save();
  context.translate(x, y);
  context.rotate(rot);
  context.globalAlpha = Math.max(0, Math.min(1, alpha));
  context.fillStyle = color;

  context.beginPath();
  for (let i = 0; i < 4; i++) {
    context.lineTo(Math.cos((i * Math.PI) / 2) * size, Math.sin((i * Math.PI) / 2) * size);
    context.lineTo(Math.cos((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25), Math.sin((i * Math.PI) / 2 + Math.PI / 4) * (size * 0.25));
  }
  context.closePath();
  context.fill();

  context.restore();
}

// Main Animation Loop
let animFrameTime = 0;
function animate(timestamp) {
  animFrameTime += 0.02;
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // 1. Draw Twinkling Stars
  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    const twinkle = Math.sin(animFrameTime * s.speed * 80 + s.phase);
    const alpha = s.alpha * (0.6 + 0.4 * twinkle);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.shadowBlur = 4;
    ctx.shadowColor = "#ffb6c1";
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Spawn and Draw Shooting Stars
  spawnShootingStar();
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const ss = shootingStars[i];
    ss.x += Math.cos(ss.angle) * ss.speed;
    ss.y += Math.sin(ss.angle) * ss.speed;
    ss.life += 1;
    ss.alpha = Math.max(0, 1 - ss.life / 35);

    const tailX = ss.x - Math.cos(ss.angle) * ss.len;
    const tailY = ss.y - Math.sin(ss.angle) * ss.len;

    const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
    grad.addColorStop(0, "rgba(255, 182, 193, 0)");
    grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(ss.x, ss.y);
    ctx.stroke();
    ctx.restore();

    if (ss.alpha <= 0) {
      shootingStars.splice(i, 1);
    }
  }

  // 3. Ambient Floating Hearts
  if (Math.random() < 0.05) spawnAmbientHeart();
  for (let i = ambientHearts.length - 1; i >= 0; i--) {
    const h = ambientHearts[i];
    h.y -= h.speedY;
    h.x += Math.sin(h.swayPhase + animFrameTime) * (h.swayAmp * 0.03) + h.speedX;
    h.rot += h.rotSpeed;

    drawHeart(ctx, h.x, h.y, h.size, "rgba(255, 105, 150, 0.75)", h.alpha, h.rot);

    if (h.y < -40) {
      ambientHearts.splice(i, 1);
    }
  }

  // 4. Burst Particles & Confetti
  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const p = burstParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12; // gentle gravity
    p.vx *= 0.985; // air drag
    p.rot += p.rotSpeed;
    p.alpha -= p.decay;

    const color = p.color || "#ff4071";

    if (p.type === 'heart') {
      drawHeart(ctx, p.x, p.y, p.size, color, p.alpha, p.rot);
    } else {
      drawSparkle(ctx, p.x, p.y, p.size * 0.6, color, p.alpha, p.rot);
    }

    if (p.alpha <= 0) {
      burstParticles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

// Interactive cursor fairy dust trail
let lastTrailTime = 0;
function handlePointerTrail(e) {
  const now = Date.now();
  if (now - lastTrailTime < 55) return;
  lastTrailTime = now;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  burstParticles.push({
    x: clientX,
    y: clientY,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -(Math.random() * 1.8 + 0.8),
    size: Math.random() * 9 + 6,
    alpha: 0.8,
    decay: 0.025,
    rot: Math.random() * Math.PI,
    rotSpeed: (Math.random() - 0.5) * 0.1,
    type: Math.random() > 0.4 ? 'heart' : 'sparkle',
    color: '#ff8cb7'
  });
}

window.addEventListener("mousemove", handlePointerTrail, { passive: true });
window.addEventListener("touchmove", handlePointerTrail, { passive: true });

// Tap screen to spawn small mini-sparkles
window.addEventListener("click", (e) => {
  // don't interfere with button clicks
  if (e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
    spawnClickBurst(e.clientX, e.clientY, 8);
  }
});

// --- Bootstrapping ---
window.addEventListener("DOMContentLoaded", () => {
  resizeCanvas();
  initStars();
  initAudio();
  requestAnimationFrame(animate);
});
