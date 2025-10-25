
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

function animate() {
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
  requestAnimationFrame(animate);
}
animate();



const STORAGE_KEY = 'theme';
const btn = document.querySelector('.theme-toggle');


const saved = localStorage.getItem(STORAGE_KEY);
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initial = saved || (prefersDark ? 'dark' : 'light');
document.documentElement.dataset.theme = initial;


function setIcon(theme) {
  btn.innerHTML = theme === 'dark'
  ? '<i class="fa-regular fa-sun"></i>'
  : '<i class="fa-regular fa-moon"></i>';
}
setIcon(initial);


btn.addEventListener('click', () => {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem(STORAGE_KEY, next);
  setIcon(next);
});




