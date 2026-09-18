document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroNetworkCanvas();
  initSignalCanvas();
  initProductCarousel();
  initModals();
  initTelemetryTicker();
});

/* --------------------------------------------------------------------------
   Hero Dynamic Data Network Canvas
   -------------------------------------------------------------------------- */
function initHeroNetworkCanvas() {
  const canvas = document.getElementById('heroNetworkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationId;
  let mouse = { x: null, y: null, radius: 140 };

  function resize() {
    const parent = canvas.parentElement;
    width = canvas.width = parent.offsetWidth;
    height = canvas.height = parent.offsetHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const nodeCount = Math.min(Math.floor((width * height) / 18000), 55);
  const nodes = [];
  const packets = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1.5,
      baseAlpha: Math.random() * 0.5 + 0.3
    });
  }

  // Create periodic data packets pulsing between nodes
  function createPacket(fromNode, toNode) {
    packets.push({
      from: fromNode,
      to: toNode,
      progress: 0,
      speed: 0.008 + Math.random() * 0.012,
      color: Math.random() > 0.4 ? '#00f0ff' : '#a78bfa'
    });
  }

  let packetTimer = 0;

  function render() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Mouse influence
      if (mouse.x !== null) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 1.5;
          n.y -= (dy / dist) * force * 1.5;
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124, 77, 255, ${n.baseAlpha})`;
      ctx.shadowColor = '#7c4dff';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const alpha = (1 - dist / 150) * 0.22;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(124, 77, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Chance to trigger packet transfer along this edge
          if (packetTimer % 40 === 0 && Math.random() < 0.05 && packets.length < 15) {
            createPacket(n, n2);
          }
        }
      }
    }

    // Update and draw packets
    for (let k = packets.length - 1; k >= 0; k--) {
      const p = packets[k];
      p.progress += p.speed;

      if (p.progress >= 1) {
        packets.splice(k, 1);
        continue;
      }

      const px = p.from.x + (p.to.x - p.from.x) * p.progress;
      const py = p.from.y + (p.to.y - p.from.y) * p.progress;

      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    packetTimer++;
    animationId = requestAnimationFrame(render);
  }

  render();
}

/* --------------------------------------------------------------------------
   Product Carousel Controls
   -------------------------------------------------------------------------- */
function initProductCarousel() {
  const track = document.getElementById('productsTrack');
  const prevBtn = document.getElementById('productScrollPrev');
  const nextBtn = document.getElementById('productScrollNext');

  if (!track || !prevBtn || !nextBtn) return;

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -380, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: 380, behavior: 'smooth' });
  });
}

/* --------------------------------------------------------------------------
   1. Navbar & Mobile Menu
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      document.body.classList.toggle('mobile-menu-open');
      const isExpanded = document.body.classList.contains('mobile-menu-open');
      navToggle.setAttribute('aria-expanded', isExpanded);
    });
  }

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      document.body.classList.remove('mobile-menu-open');
    });
  });

  // Highlight active section on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   2. Live Radar & Signal Waveform Canvas
   -------------------------------------------------------------------------- */
function initSignalCanvas() {
  const canvas = document.getElementById('signalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = canvas.width = rect.width * (window.devicePixelRatio || 1);
    height = canvas.height = rect.height * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  window.addEventListener('resize', resize);
  resize();

  let phase = 0;
  const particles = [];
  const particleCount = 28;

  // Initialize signal particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * (canvas.getBoundingClientRect().width || 350),
      y: Math.random() * (canvas.getBoundingClientRect().height || 220),
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.6 + 0.2
    });
  }

  function draw() {
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Draw Primary Signal Waveform
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#a78bfa';
    ctx.shadowColor = '#7c4dff';
    ctx.shadowBlur = 14;

    for (let x = 0; x < w; x++) {
      const y = h / 2 + 
        Math.sin((x * 0.02) + phase) * 28 * Math.sin(phase * 0.5) +
        Math.cos((x * 0.04) - phase * 1.5) * 12;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Draw Secondary Echo Waveform
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
    for (let x = 0; x < w; x++) {
      const y = h / 2 + Math.sin((x * 0.015) - phase * 0.8) * 36;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw & Update Particles
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${p.alpha})`;
      ctx.fill();
    });

    phase += 0.035;
    animationFrameId = requestAnimationFrame(draw);
  }

  draw();
}

/* --------------------------------------------------------------------------
   3. Interactive Ad ROI & Signal Impact Calculator
   -------------------------------------------------------------------------- */
function initRoiCalculator() {
  const spendSlider = document.getElementById('calcSpend');
  const roasSlider = document.getElementById('calcRoas');
  const creativeSlider = document.getElementById('calcCreative');

  const spendVal = document.getElementById('calcSpendVal');
  const roasVal = document.getElementById('calcRoasVal');
  const creativeVal = document.getElementById('calcCreativeVal');

  const resSavings = document.getElementById('resSavings');
  const resRevenue = document.getElementById('resRevenue');
  const resVelocity = document.getElementById('resVelocity');
  const resNewRoas = document.getElementById('resNewRoas');

  if (!spendSlider || !roasSlider || !creativeSlider) return;

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function updateCalculator() {
    const monthlySpend = parseFloat(spendSlider.value);
    const currentRoas = parseFloat(roasSlider.value);
    const weeklyCreatives = parseInt(creativeSlider.value, 10);

    // Update Slider Badges
    spendVal.textContent = formatCurrency(monthlySpend);
    roasVal.textContent = `${currentRoas.toFixed(1)}x`;
    creativeVal.textContent = `${weeklyCreatives} ads/wk`;

    // Calculation Model
    // 1. Wasted Spend Recovery: ~22% to 32% of ad budget saved from signal decay & fatigue
    const wastePercentage = 0.26;
    const monthlySavings = monthlySpend * wastePercentage;

    // 2. Creative Velocity Gain with Duot AI engines: 3.5x to 5.2x output
    const velocityGain = Math.round(weeklyCreatives * 4.2);

    // 3. ROAS Uplift: ~25% to 45% uplift from algorithmic targeting + high-converting hook testing
    const upliftMultiplier = 1.35;
    const projectedRoas = currentRoas * upliftMultiplier;

    // 4. Projected Annual Incremental Revenue
    const currentMonthlyRevenue = monthlySpend * currentRoas;
    const projectedMonthlyRevenue = monthlySpend * projectedRoas;
    const annualIncrementalRevenue = (projectedMonthlyRevenue - currentMonthlyRevenue + monthlySavings) * 12;

    // Update UI Results
    if (resSavings) resSavings.textContent = `${formatCurrency(monthlySavings)}/mo`;
    if (resRevenue) resRevenue.textContent = `+${formatCurrency(annualIncrementalRevenue)}/yr`;
    if (resVelocity) resVelocity.textContent = `${velocityGain} ads/wk (+320%)`;
    if (resNewRoas) resNewRoas.textContent = `${projectedRoas.toFixed(2)}x (from ${currentRoas.toFixed(1)}x)`;
  }

  spendSlider.addEventListener('input', updateCalculator);
  roasSlider.addEventListener('input', updateCalculator);
  creativeSlider.addEventListener('input', updateCalculator);

  // Initial calculation
  updateCalculator();
}

/* --------------------------------------------------------------------------
   4. Modals & Strategy Call Booker
   -------------------------------------------------------------------------- */
function initModals() {
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const closeModalBtns = document.querySelectorAll('[data-close-modal]');
  const modals = document.querySelectorAll('.modal-overlay');
  const inquiryForm = document.getElementById('inquiryForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = btn.getAttribute('data-open-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modals.forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    });
  });

  // Close when clicking overlay background
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Handle Inquiry Form Submission
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = inquiryForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = 'Submitting Signal...';
      submitBtn.disabled = true;

      setTimeout(() => {
        showToast('Inquiry received. The Duot team will review your brief within 24 hours.');
        inquiryForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        modals.forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }, 700);
    });
  }
}

/* --------------------------------------------------------------------------
   5. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('siteToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'siteToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="status-dot"></span>
    <span>${message}</span>
  `;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

/* --------------------------------------------------------------------------
   6. Live Telemetry Ticker Simulation
   -------------------------------------------------------------------------- */
function initTelemetryTicker() {
  const telemetryVal1 = document.getElementById('telemetrySpend');
  const telemetryVal2 = document.getElementById('telemetryLatency');

  if (telemetryVal1 && telemetryVal2) {
    setInterval(() => {
      const randLatency = Math.floor(Math.random() * 12) + 14;
      telemetryVal2.textContent = `${randLatency}ms`;
    }, 3200);
  }
}
