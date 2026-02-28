const tickSound = document.getElementById("tick-sound");
const nohuSound = document.getElementById("nohu-sound");
const correctSound = document.getElementById("correct-sound");
const fireworksSound = document.getElementById("fireworks-sound");

// Hàm chuẩn hóa (bỏ dấu)
function normalize(str) {
  if (!str) return "";
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim();
}

const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

// Âm thanh
const beepSound = document.getElementById("beep-sound");
const failSound = document.getElementById("fail-sound");

// 10 cụm từ cho Hangman 
const secrets = [
  { original: "Lao động trừu tượng", normalized: normalize("Lao động trừu tượng"), explain: "Lao động của con người xét ở mặt tạo ra giá trị, không phụ thuộc vào nghề cụ thể." },
  { original: "Bản vị vàng", normalized: normalize("Bản vị vàng"), explain: "Hệ thống tiền tệ trong đó tiền giấy có thể quy đổi ra vàng theo tỷ lệ cố định." },
  { original: "Kỷ luật thép", normalized: normalize("Kỷ luật thép"), explain: "Sự ràng buộc chặt chẽ của bản vị vàng khiến chính phủ không thể tùy tiện in tiền." },
  { original: "Bản vị dầu", normalized: normalize("Bản vị dầu"), explain: "Hệ thống trong đó dầu mỏ được định giá bằng một đồng tiền chủ chốt, tạo nhu cầu toàn cầu cho đồng tiền đó." },
  { original: "Vật ngang giá", normalized: normalize("Vật ngang giá"), explain: "Hàng hóa được dùng để biểu hiện giá trị của các hàng hóa khác và trở thành cơ sở của tiền tệ." },
  { original: "Tái sản xuất mở rộng", normalized: normalize("Tái sản xuất mở rộng"), explain: "Quá trình sản xuất không chỉ lặp lại mà còn mở rộng quy mô để tạo ra nhiều giá trị hơn." },
  { original: "Giá trị thặng dư", normalized: normalize("Giá trị thặng dư"), explain: "Phần giá trị người lao động tạo ra vượt quá tiền lương họ nhận được." },
  { original: "Tiền tệ thế giới", normalized: normalize("Tiền tệ thế giới"), explain: "Tiền dùng trong thanh toán và giao dịch quốc tế giữa các quốc gia." },
  { original: "Hình thái tiền tệ", normalized: normalize("Hình thái tiền tệ"), explain: "Giai đoạn phát triển cao nhất khi một hàng hóa được cố định làm vật ngang giá chung." },
  { original: "Khủng hoảng chu kỳ", normalized: normalize("Khủng hoảng chu kỳ"), explain: "Hiện tượng suy thoái kinh tế lặp lại theo chu kỳ trong chủ nghĩa tư bản." }
];

// Từ đặc biệt cho Hangman đặc biệt
const specialSecret = {
  original: "Đồng tiền liền khúc ruột",
  normalized: normalize("Đồng tiền liền khúc ruột")
};

// Modal
const explainModal = document.getElementById("explain-modal");
const explainText = document.getElementById("explain-text");
const nohuModal = document.getElementById("nohu-modal");
const giamaModal = document.getElementById("giai-ma-modal");
const hangmanWord = document.getElementById("hangman-word");
const guessInput = document.getElementById("guess-letter");
const hangmanError = document.getElementById("hangman-error");
const wrongLettersList = document.getElementById("wrong-list");

// Pháo hoa canvas
const fireworksCanvas = document.getElementById("fireworks-canvas");
const ctx = fireworksCanvas.getContext("2d");
fireworksCanvas.width = window.innerWidth;
fireworksCanvas.height = window.innerHeight;

// Hangman state
let currentIndex = null;
let secretWordOriginal = "";
let secretWordNormalized = "";
let revealed = [];
let guessedLetters = new Set();
let wrongLetters = new Set();
let openedCount = 0;
let fireworksStarted = false;
let completed = new Set(); // Track các index đã hoàn thành
let isSpecial = false;

function closeModal() {
  explainModal.classList.add("hidden");
  explainModal.style.display = "none";
  correctSound.pause();
  correctSound.currentTime = 0;
  if (openedCount === 10 && !fireworksStarted) {
    fireworksStarted = true;
    startFireworks();
  }
}

// Tạo list 10 button cho hangman selection
const hangmanSelection = document.getElementById("hangman-selection");
secrets.forEach((_, i) => {
  const btn = document.createElement("button");
  btn.textContent = `${emojis[i]} Cụm từ ${i + 1}`;
  btn.dataset.index = i;
  btn.classList.add("hangman-btn");
  btn.addEventListener("click", () => {
    if (!completed.has(i)) {
      startHangman(i);
    }
  });
  hangmanSelection.appendChild(btn);
});

function startHangman(index, special = false) {
  currentIndex = index;
  isSpecial = special;
  if (special) {
    secretWordOriginal = specialSecret.original;
    secretWordNormalized = specialSecret.normalized;
    document.querySelector("#giai-ma-modal h2").textContent = "🔑 Giải mã cụm từ đặc biệt";
  } else {
    secretWordOriginal = secrets[index].original;
    secretWordNormalized = secrets[index].normalized;
    document.querySelector("#giai-ma-modal h2").textContent = "🔍 Giải mã cụm từ";
  }
  revealed = Array(secretWordOriginal.length).fill('_');

  // Tự động reveal khoảng trắng
  for (let i = 0; i < secretWordOriginal.length; i++) {
    if (secretWordOriginal[i] === ' ') {
      revealed[i] = ' ';
    }
  }

  guessedLetters.clear();
  wrongLetters.clear();
  updateHangmanDisplay();
  wrongLettersList.textContent = "";
  giamaModal.classList.remove("hidden");
  giamaModal.style.display = "flex";
  guessInput.value = "";
  guessInput.focus();
}

function updateHangmanDisplay() {
  hangmanWord.textContent = revealed.join('');  // Thay join(' ') thành join('') để space tự nhiên, không double
}

function guessLetter() {
  const letter = normalize(guessInput.value).toUpperCase();
  if (!letter || guessedLetters.has(letter)) {
    guessInput.value = "";
    return;
  }

  guessedLetters.add(letter);
  let correct = false;

  for (let i = 0; i < secretWordOriginal.length; i++) {
    if (normalize(secretWordOriginal[i]).toUpperCase() === letter) {
      revealed[i] = secretWordOriginal[i];
      correct = true;
    }
  }

  updateHangmanDisplay();
  guessInput.value = "";
  guessInput.focus();

  if (!correct) {
    wrongLetters.add(letter);
    wrongLettersList.textContent = Array.from(wrongLetters).join("  ");
    hangmanError.textContent = "Không có chữ này!";
    failSound.play();
    setTimeout(() => {
      hangmanError.textContent = "";
    }, 2000);
  } else if (revealed.join('') === secretWordOriginal) {
    if (isSpecial) {
      // Đặc biệt: Tự mở Nổ hũ ngay khi đoán đúng
      setTimeout(() => {
        giamaModal.classList.add("hidden");
        giamaModal.style.display = "none";
        nohuModal.classList.remove("hidden");
        nohuModal.style.display = "flex";
        playNoHuSound();
      }, 500);
    } else {
      completed.add(currentIndex);
      document.querySelector(`button[data-index="${currentIndex}"]`).disabled = true;
      document.querySelector(`button[data-index="${currentIndex}"]`).textContent = `${emojis[currentIndex]} Đã giải mã: ${secretWordOriginal}`;
      setTimeout(() => {
        giamaModal.classList.add("hidden");
        giamaModal.style.display = "none";
        explainText.innerHTML = `${emojis[currentIndex]} <strong>${secretWordOriginal}</strong><br><br>→ ${secrets[currentIndex].explain}`;
        explainModal.classList.remove("hidden");
        explainModal.style.display = "flex";
        playCorrectSound();
        openedCount++;
      }, 500);
    }
  }
}

// Pháo hoa (giữ nguyên, nhưng thêm mở nohu sau fade)
function startFireworks() {
  fireworksCanvas.style.opacity = 1;
  playFireworksSound();
  let particles = [];
  let animationId = null;
  let startTime = Date.now();
  const duration = 12000;

  function createParticle() {
    return {
      x: Math.random() * fireworksCanvas.width,
      y: fireworksCanvas.height,
      vx: Math.random() * 6 - 3,
      vy: Math.random() * -12 - 8,
      color: `hsl(${Math.random() * 360},100%,50%)`,
      radius: Math.random() * 3 + 2,
      life: 100
    };
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    for (let i = 0; i < 6; i++) particles.push(createParticle());

    particles = particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.life -= 1.5;

      if (p.life > 0) {
        ctx.globalAlpha = p.life / 100;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      }
      return false;
    });

    if (Date.now() - startTime < duration) {
      animationId = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationId);
      let fadeOpacity = 1;
      const fadeInterval = setInterval(() => {
        fadeOpacity -= 0.05;
        fireworksCanvas.style.opacity = fadeOpacity;
        if (fadeOpacity <= 0) {
          clearInterval(fadeInterval);
          fireworksCanvas.style.opacity = 0;
          stopFireworksSound();
          particles = [];
        }
      }, 50);
    }
  }

  animate();
}

// Nổ hũ
document.getElementById("no-hu-btn").addEventListener("click", () => {
  nohuModal.classList.remove("hidden");
  nohuModal.style.display = "flex";
  playNoHuSound();
});

function closeNoHuModal() {
  nohuModal.classList.add("hidden");
  nohuModal.style.display = "none";
  nohuSound.pause();
  nohuSound.currentTime = 0;
}

function showNoHuFromGiaiMa() {
  giamaModal.classList.add("hidden");
  giamaModal.style.display = "none";
  nohuModal.classList.remove("hidden");
  nohuModal.style.display = "flex";
  playNoHuSound();
}

function playNoHuSound() {
  nohuSound.currentTime = 0;
  nohuSound.play();
}

function playCorrectSound() {
  correctSound.currentTime = 0;
  correctSound.play();
}

function playFireworksSound() {
  fireworksSound.currentTime = 0;
  fireworksSound.volume = 0.8;
  fireworksSound.play();
}

function stopFireworksSound() {
  fireworksSound.pause();
  fireworksSound.currentTime = 0;
}

// Nút Giải mã (mở modal, nhưng vì giờ là chính, có thể dùng để mở nếu đóng)
document.getElementById("giai-ma-btn").addEventListener("click", () => {
  if (currentIndex !== null) {
    startHangman(currentIndex, isSpecial); // Mở lại current nếu có
  } else {
    alert("Chọn một cụm từ từ list để giải mã!");
  }
});

// Nút Giải mã đặc biệt
document.getElementById("giai-ma-dac-biet-btn").addEventListener("click", () => {
  startHangman(null, true); // null index, special = true
});

// ==== INTRO LOGIC ====
document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("intro-screen");
  const mainLayout = document.getElementById("main-layout");
  const introVideo = document.getElementById("intro-video");
  const unmuteButton = document.getElementById("unmute-button");
  const skipButton = document.getElementById("skip-button");

  // ẨN TẤT CẢ MODAL
  const modals = [explainModal, nohuModal, giamaModal];
  modals.forEach(modal => {
    if (modal) {
      modal.classList.add("hidden");
      modal.style.display = "none";
    }
  });

  function startGame() {
    introScreen.style.display = "none";
    mainLayout.classList.remove("hidden");
    mainLayout.style.display = "flex";
    introVideo.pause();
    introVideo.currentTime = 0;
  }

  skipButton.addEventListener("click", startGame);

  unmuteButton.addEventListener("click", () => {
    introVideo.muted = false;
    introVideo.play();
    unmuteButton.textContent = "🔊 Nice";
    unmuteButton.disabled = true;
  });

  introVideo.addEventListener("ended", startGame);
});