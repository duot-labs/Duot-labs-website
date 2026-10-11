document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroThreeCore();
  initCard3DTilt();
  initSignalCanvas();
  initProductCarousel();
  initModals();
  initTelemetryTicker();
});

/* --------------------------------------------------------------------------
   Three.js 3D Silicon & Systems Architecture Engine (WebGL)
   Visualizes: GPU Compute Matrix (CUDA/Triton), HBM Memory & KV-Cache Bus
   -------------------------------------------------------------------------- */
function initHeroThreeCore() {
  const canvas = document.getElementById('heroThreeCanvas');
  const fallbackCanvas = document.getElementById('heroNetworkCanvas');
  const viewport = document.getElementById('consoleViewport') || (canvas ? canvas.parentElement : null);

  if (!canvas || typeof THREE === 'undefined') {
    if (fallbackCanvas) fallbackCanvas.style.display = 'block';
    initHeroNetworkCanvas();
    return;
  }

  // Verify WebGL support
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    console.warn('WebGL initialization failed, falling back to 2D network canvas:', err);
    if (fallbackCanvas) fallbackCanvas.style.display = 'block';
    canvas.style.display = 'none';
    initHeroNetworkCanvas();
    return;
  }

  const parent = viewport || canvas.parentElement;
  let width = parent.offsetWidth || 500;
  let height = parent.offsetHeight || 380;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0e0b1c, 0.038);

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(0, 4.2, 7.6);
  camera.lookAt(0, 0, 0);

  // Lighting Rig
  const ambientLight = new THREE.AmbientLight(0x281e50, 1.5);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0x7c4dff, 2.8);
  dirLight.position.set(5, 9, 6);
  scene.add(dirLight);

  const cyanLight = new THREE.PointLight(0x38bdf8, 3.8, 20);
  cyanLight.position.set(-6, 3, 4);
  scene.add(cyanLight);

  const limeLight = new THREE.PointLight(0x00f5a0, 2.0, 16);
  limeLight.position.set(4, 2, -4);
  scene.add(limeLight);

  // Main Systems Group (Isometric Tilt)
  const systemsCore = new THREE.Group();
  systemsCore.rotation.x = 0.52;
  systemsCore.rotation.y = -0.42;
  scene.add(systemsCore);

  // 1. Silicon Die Substrate (The Processor Base)
  const dieGeom = new THREE.BoxGeometry(6.6, 0.14, 6.2);
  const dieMat = new THREE.MeshPhongMaterial({
    color: 0x120f28,
    emissive: 0x1a1538,
    specular: 0x7c4dff,
    shininess: 90
  });
  const dieMesh = new THREE.Mesh(dieGeom, dieMat);
  dieMesh.position.y = -0.07;
  systemsCore.add(dieMesh);

  // Silicon Edge Wireframe
  const dieWireGeom = new THREE.EdgesGeometry(dieGeom);
  const dieWireMat = new THREE.LineBasicMaterial({ color: 0x7c4dff, transparent: true, opacity: 0.45 });
  const dieWire = new THREE.LineSegments(dieWireGeom, dieWireMat);
  dieWire.position.copy(dieMesh.position);
  systemsCore.add(dieWire);

  // Circuit Bus Lines on Substrate
  const tracePositions = [];
  const traceColors = [];
  const colV = new THREE.Color(0x7c4dff);
  const colC = new THREE.Color(0x38bdf8);

  for (let i = -2.8; i <= 2.8; i += 0.7) {
    tracePositions.push(i, 0.01, -2.7, i, 0.01, 2.7);
    traceColors.push(colV.r, colV.g, colV.b, colV.r, colV.g, colV.b);
    tracePositions.push(-2.9, 0.01, i, 2.9, 0.01, i);
    traceColors.push(colC.r, colC.g, colC.b, colC.r, colC.g, colC.b);
  }
  const traceGeom = new THREE.BufferGeometry();
  traceGeom.setAttribute('position', new THREE.Float32BufferAttribute(tracePositions, 3));
  traceGeom.setAttribute('color', new THREE.Float32BufferAttribute(traceColors, 3));
  const traceMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.25 });
  const traces = new THREE.LineSegments(traceGeom, traceMat);
  systemsCore.add(traces);

  // 2. Compute Matrix: 4x4 Parallel Tensor / GPU Streaming Cores (CUDA/Triton)
  const coreTiles = [];
  const tileBaseGeom = new THREE.BoxGeometry(0.72, 0.18, 0.72);
  const capGeom = new THREE.BoxGeometry(0.68, 0.04, 0.68);

  const tileBaseMat = new THREE.MeshPhongMaterial({
    color: 0x181335,
    emissive: 0x1c1742,
    specular: 0x38bdf8,
    shininess: 80
  });

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tileGroup = new THREE.Group();
      const posX = (c - 1.5) * 0.98;
      const posZ = (r - 1.5) * 0.98;
      tileGroup.position.set(posX, 0.1, posZ);

      const base = new THREE.Mesh(tileBaseGeom, tileBaseMat);
      tileGroup.add(base);

      // Glowing Neon Cap (represents kernel execution unit)
      const capColor = (r + c) % 2 === 0 ? 0x7c4dff : 0x38bdf8;
      const capMat = new THREE.MeshBasicMaterial({
        color: capColor,
        transparent: true,
        opacity: 0.8
      });
      const cap = new THREE.Mesh(capGeom, capMat);
      cap.position.y = 0.1;
      tileGroup.add(cap);

      systemsCore.add(tileGroup);
      coreTiles.push({
        group: tileGroup,
        capMat,
        baseColor: capColor,
        row: r,
        col: c,
        baseY: 0.1
      });
    }
  }

  // 3. High-Bandwidth Memory (HBM3e) / KV-Cache Towers
  const hbmTowers = [];
  const hbmGeom = new THREE.BoxGeometry(0.85, 0.75, 0.85);
  const hbmMat = new THREE.MeshPhongMaterial({
    color: 0x1a153d,
    emissive: 0x221a50,
    specular: 0x00f5a0,
    shininess: 90
  });

  const hbmPositions = [
    { x: -2.45, z: 0 },
    { x: 2.45, z: 0 },
    { x: 0, z: -2.35 },
    { x: 0, z: 2.35 }
  ];

  hbmPositions.forEach((pos, idx) => {
    const towerGroup = new THREE.Group();
    towerGroup.position.set(pos.x, 0.38, pos.z);

    const tower = new THREE.Mesh(hbmGeom, hbmMat);
    towerGroup.add(tower);

    // Glowing level separator rings
    for (let l = -0.22; l <= 0.25; l += 0.22) {
      const ringGeom = new THREE.BoxGeometry(0.89, 0.03, 0.89);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0x00f5a0 : 0x38bdf8,
        transparent: true,
        opacity: 0.85
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.y = l;
      towerGroup.add(ring);
    }

    systemsCore.add(towerGroup);
    hbmTowers.push(towerGroup);
  });

  // 4. Memory Bus Data Packets (High-Speed Zero-Copy Stream)
  const memoryPackets = [];
  const packetCount = 20;
  const pGeom = new THREE.SphereGeometry(0.065, 8, 8);
  const pMatCyan = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const pMatEmerald = new THREE.MeshBasicMaterial({ color: 0x00f5a0 });

  for (let i = 0; i < packetCount; i++) {
    const pMesh = new THREE.Mesh(pGeom, i % 2 === 0 ? pMatCyan : pMatEmerald);
    systemsCore.add(pMesh);

    const hbmTarget = hbmPositions[i % 4];
    const coreTarget = coreTiles[Math.floor(Math.random() * coreTiles.length)];

    memoryPackets.push({
      mesh: pMesh,
      hbmPos: new THREE.Vector3(hbmTarget.x, 0.25, hbmTarget.z),
      corePos: new THREE.Vector3(coreTarget.group.position.x, 0.22, coreTarget.group.position.z),
      progress: Math.random(),
      speed: 0.012 + Math.random() * 0.015,
      direction: Math.random() > 0.5 ? 1 : -1
    });
  }

  // 5. Holographic Latency Suppression Ring (Orbital Execution Loop)
  const ringGeom = new THREE.TorusGeometry(3.6, 0.016, 16, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x7c4dff, transparent: true, opacity: 0.45 });
  const latencyRing = new THREE.Mesh(ringGeom, ringMat);
  latencyRing.rotation.x = Math.PI / 2;
  latencyRing.position.y = 0.55;
  systemsCore.add(latencyRing);

  // 6. Ambient Micro-Particulate Grid
  const starCount = 450;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 22;
    starPositions[i + 1] = Math.random() * 8 - 2;
    starPositions[i + 2] = (Math.random() - 0.5) * 20;
  }
  const starGeom = new THREE.BufferGeometry();
  starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
  const starMat = new THREE.PointsMaterial({
    size: 0.06,
    color: 0xa78bfa,
    transparent: true,
    opacity: 0.4
  });
  const stars = new THREE.Points(starGeom, starMat);
  scene.add(stars);

  // State & Interactivity
  let activeMode = 'neural'; // 'neural' (Compute Cores), 'rings' (Memory Bus), 'quantum' (Full Pipeline)
  let speedMultiplier = 1.0;
  let baseRotSpeed = 0.0016;

  // Wire up Console Layer Tabs
  const tabButtons = document.querySelectorAll('.console-tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mode = btn.getAttribute('data-core-mode');
      activeMode = mode;

      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (mode === 'neural') {
        speedMultiplier = 1.0;
      } else if (mode === 'rings') {
        speedMultiplier = 2.0;
      } else if (mode === 'quantum') {
        speedMultiplier = 2.6;
      }
    });
  });

  // Direct 360° Drag & Orbit Physics on Console Viewport
  let isDragging = false;
  let prevX = 0, prevY = 0;
  let velX = 0, velY = 0;

  viewport.addEventListener('pointerdown', (e) => {
    isDragging = true;
    prevX = e.clientX;
    prevY = e.clientY;
    velX = 0;
    velY = 0;
    canvas.classList.add('is-dragging');
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevX;
    const deltaY = e.clientY - prevY;
    prevX = e.clientX;
    prevY = e.clientY;

    velY = deltaX * 0.006;
    velX = deltaY * 0.006;

    systemsCore.rotation.y += velY;
    systemsCore.rotation.x += velX;
  });

  window.addEventListener('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      canvas.classList.remove('is-dragging');
    }
  });

  // Live Telemetry Readout simulation
  const p99El = document.getElementById('liveP99Stat');
  const throughputEl = document.getElementById('liveThroughputStat');
  let lastStatUpdate = 0;

  // Resize handler
  function onResize() {
    if (!parent) return;
    width = parent.offsetWidth;
    height = parent.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize, { passive: true });

  // Render Loop
  let animationId = null;
  let isVisible = true;
  let clock = 0;

  function render() {
    if (!isVisible) return;
    clock += 0.016;

    // Direct momentum & gentle base spin
    if (!isDragging) {
      systemsCore.rotation.y += velY + (baseRotSpeed * speedMultiplier);
      systemsCore.rotation.x += velX;
      velY *= 0.94;
      velX *= 0.94;
    }

    // 1. Parallel Kernel Execution Waves across the 16 Compute Tiles
    coreTiles.forEach(tile => {
      const wave = Math.sin((clock * 4.2 * speedMultiplier) - (tile.row + tile.col) * 0.7);
      const elevation = Math.max(0, wave) * 0.12;
      tile.group.position.y = tile.baseY + elevation;
      tile.capMat.opacity = 0.55 + Math.max(0, wave) * 0.45;
    });

    // 2. Memory Bus Packet Flow
    memoryPackets.forEach(p => {
      p.progress += p.speed * speedMultiplier;
      if (p.progress >= 1) {
        p.progress = 0;
        const newCore = coreTiles[Math.floor(Math.random() * coreTiles.length)];
        p.corePos.set(newCore.group.position.x, 0.22, newCore.group.position.z);
      }

      if (p.direction === 1) {
        p.mesh.position.lerpVectors(p.hbmPos, p.corePos, p.progress);
      } else {
        p.mesh.position.lerpVectors(p.corePos, p.hbmPos, p.progress);
      }
    });

    // 3. Orbiting Latency Ring rotation
    latencyRing.rotation.z += 0.005 * speedMultiplier;

    // 4. Subtle telemetry jitter
    if (clock - lastStatUpdate > 2.5) {
      lastStatUpdate = clock;
      if (p99El) {
        const randP99 = (13.8 + Math.random() * 0.8).toFixed(1);
        p99El.textContent = `${randP99}ms`;
      }
      if (throughputEl) {
        const randTp = Math.floor(4800 + Math.random() * 90);
        throughputEl.textContent = `${randTp.toLocaleString()} tok/s`;
      }
    }

    renderer.render(scene, camera);
    animationId = requestAnimationFrame(render);
  }

  // IntersectionObserver to pause loop offscreen
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animationId = requestAnimationFrame(render);
        }
      });
    }, { threshold: 0.02 });
    observer.observe(canvas);
  }

  animationId = requestAnimationFrame(render);
}

/* --------------------------------------------------------------------------
   3D Card Tilt & Specular Shine System
   -------------------------------------------------------------------------- */
function initCard3DTilt() {
  const cards = document.querySelectorAll(
    '.feature-card, .product-scroll-card, .team-card, .research-card, .systems-card, .career-card, .cta-banner'
  );

  if (cards.length === 0) return;

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (isTouchDevice) return; // Maintain native scroll behavior on touch screens

  cards.forEach(card => {
    // Inject specular shine glare overlay if not present
    let glare = card.querySelector('.card-specular-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'card-specular-glare';
      glare.setAttribute('aria-hidden', 'true');
      card.appendChild(glare);
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x - rect.width / 2) / (rect.width / 2);
      const normY = (y - rect.height / 2) / (rect.height / 2);

      const rotX = (-normY * 9).toFixed(2);
      const rotY = (normX * 9).toFixed(2);

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;

      const glareX = ((x / rect.width) * 100).toFixed(1);
      const glareY = ((y / rect.height) * 100).toFixed(1);
      card.style.setProperty('--glare-x', `${glareX}%`);
      card.style.setProperty('--glare-y', `${glareY}%`);
      card.style.setProperty('--glare-opacity', '1');
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.setProperty('--glare-opacity', '0');
    });
  });
}

/* --------------------------------------------------------------------------
   Hero Dynamic Data Network Canvas (Optimized 60FPS)
   -------------------------------------------------------------------------- */
function initHeroNetworkCanvas() {
  const canvas = document.getElementById('heroNetworkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = 0, height = 0;
  let animationId = null;
  let isVisible = true;
  let mouse = { x: null, y: null, radius: 140, radiusSq: 19600 };

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    width = canvas.width = parent.offsetWidth;
    height = canvas.height = parent.offsetHeight;
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  window.addEventListener('mousemove', (e) => {
    if (!isVisible) return;
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  const nodeCount = Math.min(Math.floor((width * height) / 22000), 45);
  const nodes = [];
  const packets = [];

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1.5,
      baseAlpha: Math.random() * 0.4 + 0.3
    });
  }

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
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Update and draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      // Mouse influence (using squared distance for performance)
      if (mouse.x !== null) {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < mouse.radiusSq && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const force = (mouse.radius - dist) / mouse.radius;
          n.x -= (dx / dist) * force * 1.2;
          n.y -= (dy / dist) * force * 1.2;
        }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${n.baseAlpha})`;
      ctx.fill();

      // Connect nearby nodes
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n.x - n2.x;
        const dy = n.y - n2.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 22500) { // 150^2
          const dist = Math.sqrt(distSq);
          const alpha = (1 - dist / 150) * 0.2;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = `rgba(124, 77, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          if (packetTimer % 45 === 0 && Math.random() < 0.04 && packets.length < 12) {
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
      ctx.fill();
    }

    packetTimer++;
    animationId = requestAnimationFrame(render);
  }

  // IntersectionObserver to pause loop when scrolled offscreen
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animationId = requestAnimationFrame(render);
        }
      });
    }, { threshold: 0.01 });
    observer.observe(canvas);
  }

  animationId = requestAnimationFrame(render);
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
   1. Navbar & Mobile Menu (Throttled & Smooth)
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-cta a');

  let backdrop = document.querySelector('.mobile-menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'mobile-menu-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(backdrop);
  }

  function closeMobileMenu() {
    document.body.classList.remove('mobile-menu-open');
    document.body.style.overflow = '';
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function toggleMobileMenu() {
    const isOpen = document.body.classList.toggle('mobile-menu-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  if (navToggle) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileMenu);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('mobile-menu-open')) {
      closeMobileMenu();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && document.body.classList.contains('mobile-menu-open')) {
      closeMobileMenu();
    }
  }, { passive: true });

  // Highlight active section on scroll with rAF throttling
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
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
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

/* --------------------------------------------------------------------------
   2. Live Radar & Signal Waveform Canvas (Zero Layout Thrashing)
   -------------------------------------------------------------------------- */
function initSignalCanvas() {
  const canvas = document.getElementById('signalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let animationFrameId = null;
  let isVisible = true;
  let w = 350, h = 220;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  let phase = 0;
  const particles = [];
  const particleCount = 24;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: (Math.random() - 0.5) * 0.8,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, w, h);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#a78bfa';

    for (let x = 0; x < w; x += 2) {
      const y = h / 2 +
        Math.sin((x * 0.02) + phase) * 26 * Math.sin(phase * 0.5) +
        Math.cos((x * 0.04) - phase * 1.5) * 10;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Secondary Echo Waveform
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    for (let x = 0; x < w; x += 2) {
      const y = h / 2 + Math.sin((x * 0.015) - phase * 0.8) * 32;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw & Update Particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
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
    }

    phase += 0.03;
    animationFrameId = requestAnimationFrame(draw);
  }

  // IntersectionObserver to pause loop when scrolled offscreen
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animationFrameId = requestAnimationFrame(draw);
        }
      });
    }, { threshold: 0.01 });
    observer.observe(canvas);
  }

  animationFrameId = requestAnimationFrame(draw);
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
