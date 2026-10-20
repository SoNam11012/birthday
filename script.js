// ====== EDIT THESE ======
const CONFIG = {
  name: "Karma Motay",
  firstName: "Motay",
  date: "March 3",
  from: "Boss Jor",
  // seconds each screen stays before the next one pops up
  // hello -> birthday -> make a wish -> yay -> memories
  durations: [3, 4, 3, 4],
  // photos shown one after another on the last screen (add as many as you like)
  photos: ["images/photo1.jpeg", "images/Photo2.jpeg", "images/Photo3.jpeg", "images/Photo4.jpeg"],
  slideSeconds: 4,
  scrollSpeed: 40 // wish scroll speed in pixels per second
};
// ========================

const screens = [...document.querySelectorAll(".screen")];
let current = -1, timer;

const hn = document.getElementById("helloName");
if (hn) hn.textContent = CONFIG.firstName + "!";
const sign = document.getElementById("signName");
if (sign) sign.textContent = CONFIG.from;
document.querySelectorAll(".who").forEach(el => (el.textContent = CONFIG.name));
const bd = document.getElementById("bdayDate");
if (bd) bd.textContent = CONFIG.date;
const fl = document.getElementById("fromLine");
if (fl) fl.textContent = `A little surprise from ${CONFIG.from} 💝`;

function show(i) {
  clearTimeout(timer);
  if (i >= screens.length) return;
  screens.forEach((s, n) => s.classList.toggle("active", n === i));
  current = i;
  if (i === 1 || i === 3) burst(30);
  if (i === 4) { startSlideshow(); setTimeout(startCredits, 900); }
  if (i === 0) startCountdown(CONFIG.durations[0]);
  if (i < CONFIG.durations.length) {
    timer = setTimeout(() => show(i + 1), CONFIG.durations[i] * 1000);
  }
}

function startSlideshow() {
  const frame = document.getElementById("frame"), dots = document.getElementById("dots"), bar = document.getElementById("barFill");
  if (frame.children.length) return;
  document.querySelector(".memories").style.setProperty("--slide", CONFIG.slideSeconds + "s");
  CONFIG.photos.forEach(src => {
    const img = new Image(); img.src = src; img.alt = "Memory"; frame.appendChild(img);
    dots.appendChild(document.createElement("b"));
  });
  const imgs = [...frame.children], dot = [...dots.children];
  let k = 0;
  const go = () => {
    imgs.forEach((im, n) => im.classList.toggle("on", n === k));
    dot.forEach((d, n) => d.classList.toggle("on", n === k));
    bar.classList.remove("run"); void bar.offsetWidth; bar.classList.add("run");
    k = (k + 1) % imgs.length;
  };
  go(); setInterval(go, CONFIG.slideSeconds * 1000);
}

function startCredits() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const side = document.querySelector(".side"), box = document.getElementById("credits");
  const start = side.clientHeight;
  const end = Math.min(start, side.clientHeight * 0.6 - box.offsetHeight); // stops with the sign-off in view
  let y = start, last = performance.now(), paused = false;
  side.onmouseenter = () => (paused = true);
  side.onmouseleave = () => (paused = false);
  side.ontouchstart = () => (paused = true);
  side.ontouchend = () => (paused = false);
  (function step(now) {
    if (!paused) y -= ((now - last) / 1000) * CONFIG.scrollSpeed;
    last = now;
    if (y <= end) { box.style.transform = `translateY(${end}px)`; return; }
    box.style.transform = `translateY(${y}px)`;
    requestAnimationFrame(step);
  })(last);
}

function startCountdown(sec) {
  const el = document.getElementById("countdown");
  const draw = n => { el.textContent = n; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); };
  let n = sec; draw(n);
  const iv = setInterval(() => { n--; if (n <= 0) clearInterval(iv); else draw(n); }, 1000);
}

function burst(n) {
  const box = document.getElementById("confetti");
  const colors = ["#ec407a", "#f8bbd0", "#ffd54f", "#81d4fa", "#ce93d8"];
  for (let k = 0; k < n; k++) {
    const b = document.createElement("span");
    b.className = "bit";
    b.style.left = Math.random() * 100 + "vw";
    b.style.background = colors[k % colors.length];
    b.style.animationDuration = 2.5 + Math.random() * 2.5 + "s";
    b.style.animationDelay = Math.random() * 0.6 + "s";
    box.appendChild(b);
    setTimeout(() => b.remove(), 6000);
  }
}

// Only the "See your memories" button can skip ahead early
const mb = document.getElementById("memBtn");
if (mb) mb.onclick = () => show(4);

// Tap the cake to light the candle
document.getElementById("cake").onclick = () => {
  document.getElementById("flame").classList.add("lit");
  const wh = document.getElementById("wishHint");
  if (wh) wh.textContent = "Wish made ✨";
  burst(25);
};

show(0);