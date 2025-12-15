
// Particle system - only visible in dark mode
const canvas = document.createElement('canvas');
canvas.id = 'bg-particles';
document.body.prepend(canvas);            
const ctx = canvas.getContext('2d');

const rootStyles = getComputedStyle(document.documentElement);
const accent = rootStyles.getPropertyValue('--header-color').trim();

function hexToRgba(hex, a=1) {
  const h = hex.replace('#','');
  const b = h.length === 3
    ? h.split('').map(x => x + x).join('')
    : h;
  const r = parseInt(b.slice(0,2), 16);
  const g = parseInt(b.slice(2,4), 16);
  const bl = parseInt(b.slice(4,6), 16);
  return `rgba(${r}, ${g}, ${bl}, ${a})`;
}

function resize() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resize();
window.addEventListener('resize', resize);

const W = () => window.innerWidth;
const H = () => window.innerHeight;

let particles = Array.from({ length: 80 }, () => ({
  x: Math.random() * W(),
  y: Math.random() * H(),
  r: Math.random() * 2.5 + 1.5,
  dx: (Math.random() - 0.5) * 0.6,
  dy: (Math.random() - 0.5) * 0.6
}));

let animationId = null;
let isAnimating = false;

function animate() {
  if (!isAnimating) return;
  
  ctx.clearRect(0, 0, W(), H());
  ctx.fillStyle = hexToRgba(accent || '#ffffff', 0.9); 
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > W()) p.dx *= -1;
    if (p.y < 0 || p.y > H()) p.dy *= -1;
  });
  animationId = requestAnimationFrame(animate);
}

function toggleParticles(theme) {
  if (theme === 'dark') {
    canvas.style.display = 'block';
    if (!isAnimating) {
      isAnimating = true;
      animate();
    }
  } else {
    canvas.style.display = 'none';
    if (isAnimating) {
      isAnimating = false;
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    }
  }
}

// Connected Nodes Network - only visible in light mode
const lightCanvas = document.createElement('canvas');
lightCanvas.id = 'bg-light-network';
document.body.prepend(lightCanvas);
const lightCtx = lightCanvas.getContext('2d');

function resizeLight() {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  lightCanvas.style.width = window.innerWidth + 'px';
  lightCanvas.style.height = window.innerHeight + 'px';
  lightCanvas.width = Math.floor(window.innerWidth * dpr);
  lightCanvas.height = Math.floor(window.innerHeight * dpr);
  lightCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeLight();
window.addEventListener('resize', resizeLight);

const LIGHT_W = () => window.innerWidth;
const LIGHT_H = () => window.innerHeight;

let lightNodes = Array.from({ length: 50 }, () => ({
  x: Math.random() * LIGHT_W(),
  y: Math.random() * LIGHT_H(),
  vx: (Math.random() - 0.5) * 0.5,
  vy: (Math.random() - 0.5) * 0.5,
  radius: Math.random() * 2 + 1
}));

let lightAnimationId = null;
let isLightAnimating = false;
const CONNECTION_DISTANCE = 150;

function animateLight() {
  if (!isLightAnimating) return;
  
  lightCtx.clearRect(0, 0, LIGHT_W(), LIGHT_H());
  
  // Draw connections between nearby nodes
  lightCtx.strokeStyle = 'rgba(59, 130, 246, 0.15)';
  lightCtx.lineWidth = 0.5;
  
  for (let i = 0; i < lightNodes.length; i++) {
    for (let j = i + 1; j < lightNodes.length; j++) {
      const dx = lightNodes[i].x - lightNodes[j].x;
      const dy = lightNodes[i].y - lightNodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < CONNECTION_DISTANCE) {
        const opacity = 1 - (dist / CONNECTION_DISTANCE);
        lightCtx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.2})`;
        lightCtx.beginPath();
        lightCtx.moveTo(lightNodes[i].x, lightNodes[i].y);
        lightCtx.lineTo(lightNodes[j].x, lightNodes[j].y);
        lightCtx.stroke();
      }
    }
  }
  
  // Draw nodes
  lightCtx.fillStyle = 'rgba(59, 130, 246, 0.4)';
  lightNodes.forEach(node => {
    lightCtx.beginPath();
    lightCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
    lightCtx.fill();
    
    // Update position
    node.x += node.vx;
    node.y += node.vy;
    
    // Bounce off edges
    if (node.x < 0 || node.x > LIGHT_W()) node.vx *= -1;
    if (node.y < 0 || node.y > LIGHT_H()) node.vy *= -1;
  });
  
  lightAnimationId = requestAnimationFrame(animateLight);
}

function toggleLightNetwork(theme) {
  if (theme === 'light') {
    lightCanvas.style.display = 'block';
    if (!isLightAnimating) {
      isLightAnimating = true;
      animateLight();
    }
  } else {
    lightCanvas.style.display = 'none';
    if (isLightAnimating) {
      isLightAnimating = false;
      if (lightAnimationId) {
        cancelAnimationFrame(lightAnimationId);
      }
    }
  }
}



const STORAGE_KEY = 'theme';
const btn = document.querySelector('.theme-toggle');

const saved = localStorage.getItem(STORAGE_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = saved || (prefersDark ? 'dark' : 'light');
document.documentElement.dataset.theme = initial;

// Initialize particles and light network based on initial theme
toggleParticles(initial);
toggleLightNetwork(initial);

function setIcon(theme) {
  if (btn) {
    btn.innerHTML = theme === 'dark'
      ? '<i class="fa-regular fa-sun"></i>'
      : '<i class="fa-regular fa-moon"></i>';
  }
}
setIcon(initial);

if (btn) {
  btn.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme;
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE_KEY, next);
    setIcon(next);
    toggleParticles(next);
    toggleLightNetwork(next);
  });
}




const text = "Hi, I'm Jorge Flores";
let i = 0;
function typeWriter() {
  if (i < text.length) {
    document.querySelector('.hero-section h2').textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, 80);
  }
}
typeWriter();


const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
});
document.querySelectorAll('.skills-card, .projects-section').forEach(el => observer.observe(el));


// Play project videos on card hover
document.querySelectorAll('.project-card').forEach(card => {
  const video = card.querySelector('.project-video');
  if (!video) return; // Skip cards without videos

  card.addEventListener('mouseenter', () => {
    video.play();
  });

  card.addEventListener('mouseleave', () => {
    video.pause();
    video.currentTime = 0; // restart from beginning
  });
});
