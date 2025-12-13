/* =========================
   COUNT-UP ANIMATION
   ========================= */
const counters = document.querySelectorAll('.stat-number');

counters.forEach(counter => {
  const target = Number(counter.dataset.target);
  let current = 0;
  const duration = 800; // ms (tinh tế, không quá nhanh)
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    current = Math.floor(progress * target);
    counter.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  }

  requestAnimationFrame(update);
});


/* =========================
   FADE-IN ON SCROLL
   ========================= */
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15
  }
);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});


/* =========================
   REDUCE MOTION (ACCESSIBILITY)
   ========================= */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduce-motion');
}
