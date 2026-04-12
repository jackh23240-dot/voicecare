/**
 * VoiceCare Elder App - Common JavaScript
 * 老人端通用逻辑
 */

// 导航函数
function navigateTo(page) {
  if (page === 'home') {
    window.location.href = 'index.html';
  } else if (page === 'learning') {
    window.location.href = 'learning.html';
  } else if (page === 'feedback') {
    window.location.href = 'feedback.html';
  } else if (page === 'freestyle') {
    window.location.href = 'freestyle.html';
  }
}

// 时间问候语
function updateTimeGreeting() {
  const hour = new Date().getHours();
  const greetingElement = document.getElementById('timeGreeting');
  
  if (!greetingElement) return;
  
  let greeting;
  if (hour >= 5 && hour < 12) {
    greeting = '早上好！☀️';
  } else if (hour >= 12 && hour < 18) {
    greeting = '下午好！🌤️';
  } else {
    greeting = '晚上好！🌙';
  }
  
  greetingElement.textContent = greeting;
}

// 加载学习状态
function loadLearningStatus() {
  const lastLearnedElement = document.getElementById('lastLearned');
  
  if (!lastLearnedElement) return;
  
  // TODO: 从后端获取真实数据
  const hoursAgo = 2;
  const consecutiveDays = 5;
  
  lastLearnedElement.textContent = `上次学习：${hoursAgo}小时前 · 已连续学习 ${consecutiveDays}天 🔥`;
}

// 音频预加载优化
class AudioPreloader {
  constructor() {
    this.audioCache = new Map();
  }
  
  preload(url) {
    if (this.audioCache.has(url)) return;
    
    const audio = new Audio();
    audio.src = url;
    audio.preload = 'auto';
    this.audioCache.set(url, audio);
  }
  
  play(url) {
    if (!this.audioCache.has(url)) {
      this.preload(url);
    }
    
    const audio = this.audioCache.get(url);
    audio.currentTime = 0;
    audio.play().catch(err => console.error('Audio playback failed:', err));
  }
  
  pause(url) {
    if (this.audioCache.has(url)) {
      this.audioCache.get(url).pause();
    }
  }
}

// 全局音频预加载器
window.audioPreloader = new AudioPreloader();

// 本地存储统计
const StatsManager = {
  load() {
    const saved = localStorage.getItem('voicecare_stats');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      sessions: 0,
      minutes: 0,
      phrases: 0,
      consecutiveDays: 0,
      lastLearned: null
    };
  },
  
  save(stats) {
    localStorage.setItem('voicecare_stats', JSON.stringify(stats));
  },
  
  updateSession() {
    const stats = this.load();
    stats.sessions++;
    stats.lastLearned = Date.now();
    this.save(stats);
    return stats;
  },
  
  updateMinutes(minutes) {
    const stats = this.load();
    stats.minutes += minutes;
    this.save(stats);
    return stats;
  },
  
  updatePhrases(count) {
    const stats = this.load();
    stats.phrases += count;
    this.save(stats);
    return stats;
  }
};

// 撒花动画生成器
function createConfetti(containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const emojis = options.emojis || ['🌸', '🌺', '🌹', '💐', '✨', '❤️', '🎉'];
  const count = options.count || 80;
  
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
      confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
      container.appendChild(confetti);
      
      setTimeout(() => confetti.remove(), 4000);
    }, i * 30);
  }
}

// 反馈弹窗
function showFeedbackModal(message, duration = 3000) {
  const modal = document.getElementById('feedbackModal');
  if (!modal) {
    alert(message);
    return;
  }
  
  const modalContent = modal.querySelector('.feedback-modal-content p');
  if (modalContent) {
    modalContent.textContent = message;
  }
  
  modal.classList.add('show');
  
  setTimeout(() => {
    modal.classList.remove('show');
  }, duration);
}

// 字母动画
function animateLetters(lettersSelector, isPlaying) {
  const letters = document.querySelectorAll(lettersSelector);
  if (letters.length === 0) return;
  
  let currentIndex = 0;
  let animationTimeout;
  
  function animateNextLetter() {
    if (!isPlaying || currentIndex >= letters.length) {
      if (isPlaying && currentIndex >= letters.length) {
        currentIndex = 0;
        setTimeout(animateNextLetter, 500);
      }
      return;
    }
    
    const letter = letters[currentIndex];
    letter.classList.add('letter-animate');
    
    animationTimeout = setTimeout(() => {
      letter.classList.remove('letter-animate');
      currentIndex++;
      animateNextLetter();
    }, 500);
  }
  
  animateNextLetter();
  
  return () => clearTimeout(animationTimeout);
}

// 波形动画
function animateWaveform(barsSelector, isPlaying) {
  const bars = document.querySelectorAll(barsSelector);
  if (bars.length === 0) return null;
  
  if (!isPlaying) {
    bars.forEach(bar => bar.classList.remove('active'));
    return null;
  }
  
  return setInterval(() => {
    bars.forEach(bar => {
      bar.classList.toggle('active');
      bar.style.height = Math.random() * 80 + 20 + '%';
    });
  }, 300);
}
