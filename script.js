let current = 0;
const pages = document.querySelectorAll('.page');
const progressSteps = document.querySelectorAll('.progress-step');

const quizIntro = document.getElementById('quiz-intro');
const quizApp = document.getElementById('quiz-app');
const quizScreens = document.querySelectorAll('.quiz-screen');
const startQuizBtn = document.getElementById('start-quiz-btn');
const wordCells = document.querySelectorAll('.word-cell');
const wordSelectionEl = document.getElementById('word-selection');
const wordStatus = document.getElementById('word-status');
const continueWordBtn = document.getElementById('word-continue-btn');
const quiz2Options = document.querySelectorAll('.quiz-option');
const quiz2Feedback = document.getElementById('quiz2-feedback');
const quiz2Next = document.getElementById('quiz2-next');
const rankPool = document.getElementById('rank-pool');
const rankSlots = document.querySelectorAll('.rank-slot');
const quiz3Feedback = document.getElementById('quiz3-feedback');
const quiz3Next = document.getElementById('quiz3-next');
const spinBtn = document.getElementById('spin-btn');
const rouletteResult = document.getElementById('roulette-result');
const finishBtn = document.getElementById('finish-btn');
const finalStep1 = document.getElementById('final-step-1');
const finalStep2 = document.getElementById('final-step-2');
const finalStep3 = document.getElementById('final-step-3');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeBtn = document.querySelector('.lightbox-close');
const celebrationMsg = document.getElementById('celebration-msg');

const targetWords = ['SORRISO', 'OLHAR', 'CHEIRO'];
const prizes = [
  'Vale um beijo onde você quiser',
  'Jantinha no DEMA JOE',
  'Cineminha + Pipoca',
  'Um abraço',
  'Um "oi"',
  'Todos os prêmios',
  'Uma noite de amô',
  'Uma noite selvagem'
];
let selectedIndexes = [];
let foundWords = new Set();
let quizState = { currentStep: 1, quiz4Spun: false };


function resetProgress() {
  progressSteps.forEach(step => {
    const fill = step.querySelector('.progress-fill');
    fill.style.transition = 'none';
    fill.style.width = '0%';
  });
}

function updateProgress(index) {
  progressSteps.forEach((step, i) => {
    const fill = step.querySelector('.progress-fill');
    step.classList.toggle('completed', i < index);
    step.classList.toggle('current', i === index);
    step.classList.toggle('upcoming', i > index);
    if (i < index) {
      fill.style.transition = 'width 1.6s ease';
      fill.style.width = '100%';
    } else if (i === index) {
      fill.style.transition = 'width 3s ease';
      fill.style.width = '100%';
    } else {
      fill.style.transition = 'none';
      fill.style.width = '0%';
    }
  });
}

function showPage(index, immediate = false) {
  if (index < 0 || index >= pages.length) return;
  if (index === current && pages[index].style.display === 'flex') return;
  const fromPage = pages[current];
  const toPage = pages[index];

  if (immediate) {
    if (fromPage !== toPage) {
      fromPage.style.display = 'none';
    }
    toPage.style.display = 'flex';
    updateProgress(index);
    current = index;
    if (index === 1) {
      animateCounter();
    }
    return;
  }

  fromPage.style.opacity = 0;
  fromPage.style.transition = 'opacity .6s ease, transform .6s ease';
  fromPage.style.transform = 'translateY(24px)';
  setTimeout(() => {
    fromPage.style.display = 'none';
    fromPage.style.removeProperty('opacity');
    fromPage.style.removeProperty('transform');
    toPage.style.display = 'flex';
    toPage.style.opacity = 0;
    toPage.style.transform = 'translateY(20px)';
    updateProgress(index);
    current = index;
    if (index === 1) {
      animateCounter();
    }
    requestAnimationFrame(() => {
      toPage.style.transition = 'opacity .8s ease, transform .8s ease';
      toPage.style.opacity = 1;
      toPage.style.transform = 'translateY(0)';
    });
  }, 260);
}

function nextPage() {
  showPage(Math.min(current + 1, pages.length - 1));
}

progressSteps.forEach(step => {
  step.addEventListener('click', () => {
    const pageIndex = Number(step.dataset.page);
    if (!Number.isNaN(pageIndex)) showPage(pageIndex);
  });
});

function animateCounter() {
  const el = document.getElementById('counter');
  if (!el) return;
  el.classList.remove('pulse');
  const startValue = 0;
  const endValue = 3216;
  const duration = 2000;
  const startTime = performance.now();

  function step(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    const currentValue = Math.round(startValue + (endValue - startValue) * eased);
    el.textContent = currentValue.toLocaleString('pt-BR');
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = endValue.toLocaleString('pt-BR');
      el.classList.add('pulse');
    }
  }
  requestAnimationFrame(step);
}

function activateScreen(step) {
  console.log('activateScreen: ativando step', step);
  quizScreens.forEach(screen => {
    const isActive = Number(screen.dataset.step) === step;
    if (isActive) {
      screen.classList.add('active');
      screen.style.display = 'flex';
      console.log('activateScreen: screen', step, 'ativada');
    } else {
      screen.classList.remove('active');
      screen.style.display = 'none';
    }
  });
  quizState.currentStep = step;
}

function showQuizIntro() {
  if (!quizIntro) return;
  quizIntro.classList.remove('hidden');
  quizIntro.setAttribute('aria-hidden', 'false');
  quizIntro.style.display = 'flex';
  quizIntro.style.pointerEvents = 'auto';
  quizIntro.style.opacity = 0;
  requestAnimationFrame(() => {
    quizIntro.style.transition = 'opacity .8s ease';
    quizIntro.style.opacity = 1;
  });
}

function hideQuizIntro(callback) {
  if (!quizIntro) return;
  quizIntro.style.transition = 'opacity .5s ease';
  quizIntro.style.opacity = 0;
  setTimeout(() => {
    quizIntro.classList.add('hidden');
    quizIntro.setAttribute('aria-hidden', 'true');
    quizIntro.style.pointerEvents = 'none';
    quizIntro.style.display = 'none';
    quizIntro.style.opacity = '';
    if (callback) callback();
  }, 500);
}

function showQuizApp() {
  if (!quizApp) return;
  console.log('showQuizApp: iniciando...');
  quizApp.classList.remove('hidden');
  quizApp.setAttribute('aria-hidden', 'false');
  quizApp.style.pointerEvents = 'auto';
  quizApp.style.display = 'flex';
  quizApp.style.opacity = 0;
  quizApp.style.visibility = 'visible';
  requestAnimationFrame(() => {
    quizApp.style.transition = 'opacity .6s ease';
    quizApp.style.opacity = 1;
    console.log('showQuizApp: fade-in animado');
  });
}

window.startQuizFlow = function() {
  console.log('startQuizFlow: iniciando...');
  
  // Fade out da página atual
  if (current < pages.length) {
    pages[current].style.opacity = 0;
    pages[current].style.transition = 'opacity .4s ease';
  }
  
  setTimeout(() => {
    if (quizIntro && !quizIntro.classList.contains('hidden')) {
      console.log('startQuizFlow: ocultando intro...');
      hideQuizIntro(() => {
        console.log('startQuizFlow: intro oculta, mostrando app...');
        showQuizApp();
        activateScreen(1);
        window.scrollTo(0, 0);
      });
    } else {
      console.log('startQuizFlow: mostrando app direto...');
      showQuizApp();
      activateScreen(1);
      window.scrollTo(0, 0);
    }
  }, 200);
};

function hideQuizApp() {
  if (!quizApp) return;
  quizApp.style.transition = 'opacity .4s ease';
  quizApp.style.opacity = 0;
  setTimeout(() => {
    quizApp.classList.add('hidden');
    quizApp.setAttribute('aria-hidden', 'true');
    quizApp.style.display = 'none';
    quizApp.style.opacity = '';
    quizApp.style.visibility = 'hidden';
  }, 400);
}

function openLightbox(src, alt, isVideo = false) {
  if (!lightbox) return;
  if (isVideo && lightboxVideo) {
    lightboxImg.style.display = 'none';
    lightboxVideo.style.display = 'block';
    lightboxVideo.src = src;
    lightboxVideo.load();
    lightboxVideo.play().catch(() => {});
    lightboxVideo.onended = () => {
      closeLightbox();
      setTimeout(() => showQuizIntro(), 320);
    };
  } else {
    if (lightboxVideo) {
      lightboxVideo.pause();
      lightboxVideo.src = '';
      lightboxVideo.style.display = 'none';
    }
    lightboxImg.style.display = 'block';
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
  }
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('show');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  if (lightboxVideo) {
    lightboxVideo.pause();
    lightboxVideo.src = '';
    lightboxVideo.style.display = 'none';
    lightboxVideo.onended = null;
  }
  lightboxImg.style.display = 'block';
  document.body.style.overflow = '';
}

window.openSpoilerVideo = function() {
  openLightbox('assets/images/noivos.mp4', '', true);
};

function clearWordSelection() {
  selectedIndexes = [];
  wordCells.forEach(cell => cell.classList.remove('selected'));
  wordSelectionEl.textContent = '...';
}

function showCelebration() {
  if (!celebrationMsg) return;
  celebrationMsg.classList.remove('hidden');
  celebrationMsg.classList.add('show');
  setTimeout(() => {
    celebrationMsg.classList.remove('show');
    celebrationMsg.classList.add('hidden');
  }, 2000);
}

function markWordFound(foundWord) {
  showCelebration();
  foundWords.add(foundWord);
  document.querySelectorAll('.word-item').forEach(item => {
    if (item.dataset.word === foundWord) {
      item.classList.add('found');
    }
  });
  wordStatus.textContent = foundWords.size === targetWords.length
    ? 'Parabéns ❤️ Mas ainda tá fácil...'
    : `Palavras encontradas: ${foundWords.size}/${targetWords.length}`;
  if (foundWords.size === targetWords.length) {
    continueWordBtn.classList.remove('hidden');
  }
  clearWordSelection();
}

function updateWordSelection() {
  const text = selectedIndexes.map(index => wordCells[index].textContent).join('');
  wordSelectionEl.textContent = text || '...';
  if (targetWords.includes(text) && !foundWords.has(text)) {
    selectedIndexes.forEach(index => {
      wordCells[index].classList.add('found');
      wordCells[index].classList.remove('selected');
    });
    markWordFound(text);
  }
}

function initWordSearch() {
  if (!wordCells.length) return;
  wordCells.forEach((cell, index) => {
    cell.addEventListener('click', () => {
      if (cell.classList.contains('found')) return;
      const pos = selectedIndexes.indexOf(index);
      if (pos >= 0) {
        selectedIndexes.splice(pos, 1);
        cell.classList.remove('selected');
      } else {
        selectedIndexes.push(index);
        cell.classList.add('selected');
      }
      updateWordSelection();
    });
  });
  document.getElementById('reset-word-selection').addEventListener('click', () => {
    clearWordSelection();
    wordStatus.textContent = 'Selecione letras para formar as palavras.';
  });
  if (continueWordBtn) {
    continueWordBtn.addEventListener('click', () => {
      console.log('Continuando para próximo jogo...');
      transitionToStep(2);
    });
  }
}

function initQuiz2() {
  quiz2Options.forEach(option => {
    option.addEventListener('click', () => {
      quiz2Options.forEach(btn => btn.classList.remove('correct', 'wrong'));
      const isCorrect = option.dataset.correct === 'true';
      option.classList.add(isCorrect ? 'correct' : 'wrong');
      if (isCorrect) {
        quiz2Feedback.textContent = 'Acertou ❤️';
        quiz2Next.classList.remove('hidden');
      } else {
        quiz2Feedback.textContent = 'Tenta de novo 😏';
      }
    });
  });
  quiz2Next.addEventListener('click', () => {
    transitionToStep(3);
  });
}

function initQuiz3() {
  const rankItems = document.querySelectorAll('.rank-item');
  rankItems.forEach(item => {
    item.addEventListener('dragstart', e => {
      item.classList.add('dragging');
      e.dataTransfer.setData('text/plain', item.dataset.item);
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => item.classList.remove('dragging'));
  });

  rankSlots.forEach(slot => {
    slot.addEventListener('dragover', e => {
      e.preventDefault();
      slot.classList.add('dragover');
    });
    slot.addEventListener('dragleave', () => slot.classList.remove('dragover'));
    slot.addEventListener('drop', e => {
      e.preventDefault();
      slot.classList.remove('dragover');
      const value = e.dataTransfer.getData('text/plain');
      const dragged = document.querySelector(`[data-item="${value}"]`);
      if (!dragged) return;
      if (slot.firstElementChild) {
        rankPool.appendChild(slot.firstElementChild);
      }
      slot.appendChild(dragged);
      updateQuiz3State();
    });
  });

  rankPool.addEventListener('dragover', e => {
    e.preventDefault();
  });
  rankPool.addEventListener('drop', e => {
    e.preventDefault();
    const value = e.dataTransfer.getData('text/plain');
    const dragged = document.querySelector(`[data-item="${value}"]`);
    if (!dragged) return;
    rankPool.appendChild(dragged);
    updateQuiz3State();
  });

  quiz3Next.addEventListener('click', () => transitionToStep(4));
}

function updateQuiz3State() {
  const filled = Array.from(rankSlots).filter(slot => slot.children.length === 1).length;
  if (filled === rankSlots.length) {
    quiz3Feedback.textContent = 'Parabéns!! Você está perto de conseguir seu prêmio ❤️';
    quiz3Next.classList.remove('hidden');
  } else {
    quiz3Feedback.textContent = 'Preencha todas as posições com amor.';
  }
}

function initQuiz4() {
  const wheel = document.getElementById('roulette-wheel');
  const prizeList = document.querySelectorAll('.prize-item');
  let currentRotation = -22.5;
  
  spinBtn.addEventListener('click', () => {
    if (quizState.quiz4Spun) return;
    quizState.quiz4Spun = true;
    spinBtn.disabled = true;
    
    const prizeIndex = Math.floor(Math.random() * 8);
    const spins = Math.floor(Math.random() * 3) + 4;
    const finalAngle = currentRotation + spins * 360 + prizeIndex * 45;
    
    // Remove previous active highlight
    prizeList.forEach(item => item.classList.remove('active'));
    
    wheel.style.transition = 'transform 5.2s cubic-bezier(.33,.05,.28,.99)';
    wheel.style.transform = `rotate(${finalAngle}deg)`;
    
    wheel.addEventListener('transitionend', () => {
      const prizeText = prizes[prizeIndex];
      rouletteResult.textContent = `Você ganhou: ${prizeText}`;
      
      // Highlight the winning prize
      prizeList.forEach((item, idx) => {
        if (item.dataset.index == prizeIndex) {
          item.classList.add('active');
        }
      });
      
      finishBtn.classList.remove('hidden');
      currentRotation = finalAngle % 360;
    }, { once: true });
  });

  finishBtn.addEventListener('click', () => {
    transitionToStep(5);
    setTimeout(() => revealFinalSteps(), 200);
  });
}

function transitionToStep(step) {
  const active = document.querySelector('.quiz-screen.active');
  if (active) {
    active.style.opacity = 0;
    active.style.transition = 'opacity .6s ease';
    setTimeout(() => {
      active.classList.remove('active');
      activateScreen(step);
    }, 500);
  } else {
    activateScreen(step);
  }
}

function revealFinalSteps() {
  // First message: "Quero te dizer uma coisa..." - appears for 3s
  finalStep1.classList.remove('hidden');
  finalStep1.classList.add('visible');
  finalStep1.style.opacity = 1;
  finalStep1.style.transform = 'translateY(0)';
  
  // After 1s, second message appears: "Eu te amo meu amor" for 3s
  setTimeout(() => {
    finalStep2.classList.remove('hidden');
    finalStep2.classList.add('visible');
    finalStep2.style.opacity = 1;
    finalStep2.style.transform = 'translateY(0)';
  }, 1000);
  
  // After 4s total (1s + 3s for second message), show "Obrigada por chegar até aqui"
  setTimeout(() => {
    finalStep1.classList.add('hidden');
    finalStep2.classList.add('hidden');
    finalStep3.classList.remove('hidden');
    finalStep3.classList.add('visible');
    finalStep3.style.opacity = 1;
    finalStep3.style.transform = 'translateY(0)';
  }, 4000);
}

function initQuizFlow() {
  if (startQuizBtn) {
    startQuizBtn.addEventListener('click', window.startQuizFlow);
  }
  initWordSearch();
  initQuiz2();
  initQuiz3();
  initQuiz4();
}

// Initialize first view
resetProgress();
showPage(current, true);

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuizFlow);
} else {
  initQuizFlow();
}

