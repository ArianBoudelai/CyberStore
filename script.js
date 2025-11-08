const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
const parts = [];
for(let i=0;i<160;i++){
  parts.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+0.6,ax:(Math.random()-0.5)*0.2,ay:(Math.random()-0.5)*0.2});
}
function tick(){
  ctx.clearRect(0,0,W,H);
  ctx.globalCompositeOperation='lighter';
  for(let p of parts){
    p.x += p.ax; p.y += p.ay;
    if(p.x < -20) p.x = W+20;
    if(p.x > W+20) p.x = -20;
    if(p.y < -20) p.y = H+20;
    if(p.y > H+20) p.y = -20;
    ctx.beginPath();
    const g = ctx.createRadialGradient(p.x,p.y,p.r*0.2,p.x,p.y,p.r*6);
    g.addColorStop(0,'rgba(0,247,255,0.18)');
    g.addColorStop(0.4,'rgba(255,59,255,0.06)');
    g.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.arc(p.x,p.y,p.r*6,0,Math.PI*2);
    ctx.fill();
  }
  ctx.globalCompositeOperation='source-over';
  requestAnimationFrame(tick);
}
tick();
addEventListener('resize',()=>{W=canvas.width=innerWidth;H=canvas.height=innerHeight});

/* cursor glow */
const cursor = document.getElementById('cursor-glow');
addEventListener('mousemove',e=>{
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

/* smooth scroll from hero buttons */
document.querySelectorAll('[data-scroll]').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const sel = btn.getAttribute('data-scroll');
    document.querySelector(sel).scrollIntoView({behavior:'smooth',block:'start'});
  });
});

/* buy button animation and local cart stub */
document.querySelectorAll('.buy-btn').forEach(b=>{
  b.addEventListener('click',e=>{
    const card = e.target.closest('.product-card');
    card.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:240});
    const name = card.querySelector('h3').textContent;
    const cart = JSON.parse(localStorage.getItem('ct_cart')||'[]');
    cart.push({title:name,time:Date.now()});
    localStorage.setItem('ct_cart',JSON.stringify(cart));
    const old = b.textContent;
    b.textContent = 'افزوده شد';
    setTimeout(()=>b.textContent = old,1200);
  });
});

/* contact form send (local stub) */
const form = document.getElementById('contactForm');
form && form.addEventListener('submit',ev=>{
  ev.preventDefault();
  const f = new FormData(form);
  const data = {name:f.get('name'),email:f.get('email'),msg:f.get('message'),time:Date.now()};
  const store = JSON.parse(localStorage.getItem('ct_contacts')||'[]');
  store.push(data);
  localStorage.setItem('ct_contacts',JSON.stringify(store));
  const fb = document.getElementById('formFeedback');
  fb.textContent = 'پیام شما ثبت شد — ممنون!';
  form.reset();
});

/* background music control with persisted mute */
const bgm = document.getElementById('bgm');
const muteToggle = document.getElementById('muteToggle');
const savedMute = localStorage.getItem('ct_mute');
if(savedMute === '1'){ bgm.muted = true; muteToggle.textContent = 'Unmute'; } else { bgm.muted = false; muteToggle.textContent = 'Mute'; }
muteToggle.addEventListener('click',()=>{
  bgm.muted = !bgm.muted;
  localStorage.setItem('ct_mute', bgm.muted ? '1' : '0');
  muteToggle.textContent = bgm.muted ? 'Unmute' : 'Mute';
});

/* polite play attempt on first user interaction for autoplay blockers */
function tryPlay(){
  try{ bgm.play().catch(()=>{}); }catch(e){}
  removeEventListener('pointerdown', tryPlay);
  removeEventListener('keydown', tryPlay);
}
addEventListener('pointerdown', tryPlay);
addEventListener('keydown', tryPlay);

/* subtle header reveal on scroll */
let lastY = 0;
addEventListener('scroll',()=>{
  const header = document.querySelector('.site-header');
  if(window.scrollY > lastY && window.scrollY > 80) header.style.transform = 'translateY(-80px)'; else header.style.transform = 'translateY(0)';
  lastY = window.scrollY;
});

/* tiny polish: hover glow for socials */
document.querySelectorAll('.soc').forEach(s=>{
  s.addEventListener('mouseenter',()=> s.style.boxShadow = '0 8px 30px rgba(0,247,255,0.08)');
  s.addEventListener('mouseleave',()=> s.style.boxShadow = '');
});
