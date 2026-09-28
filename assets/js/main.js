
const SITE = {
  email: 'mail@mahamagham.com',
  phone: '+91 94950 41196',
  whatsapp: '919495041196',
  whatsappDisplay: '+91 94950 41196',
  instagram: 'https://www.instagram.com/mahamagha_mahotsavam/',
  youtube: 'https://www.youtube.com/channel/UC5oJ4zNocTQKuPHiYaDxElA',
  location: 'Sri Panch Dasnam Juna Akhada, Thirunnavaya, Malappuram, Kerala 676301'
};

const navItems = [
  ['index.html','Home','home'], ['about.html','About Mahamagham','about'], ['festival.html','Programme','festival'],
  ['pilgrim-guide.html','Pilgrim Guide','guide'], ['get-involved.html','Get Involved','involved'],
  ['gallery.html','Gallery','gallery'], ['contact.html','Contact','contact']
];

function currentPage(){ return document.body.dataset.page || 'home'; }

function icon(name){
  const icons = {
    instagram: `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.25" y="3.25" width="17.5" height="17.5" rx="5.2"></rect><circle cx="12" cy="12" r="4.2"></circle><circle cx="17.35" cy="6.7" r="1.15" fill="currentColor" stroke="none"></circle></svg>`,
    youtube: `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.2 8.1a2.8 2.8 0 0 0-2-2c-1.76-.48-7.2-.48-7.2-.48s-5.44 0-7.2.48a2.8 2.8 0 0 0-2 2A29.6 29.6 0 0 0 2.5 12a29.6 29.6 0 0 0 .3 3.9 2.8 2.8 0 0 0 2 2c1.76.48 7.2.48 7.2.48s5.44 0 7.2-.48a2.8 2.8 0 0 0 2-2 29.6 29.6 0 0 0 .3-3.9 29.6 29.6 0 0 0-.3-3.9Z"></path><path d="m10 15.25 5.2-3.25L10 8.75Z" fill="currentColor" stroke="none"></path></svg>`,
    whatsapp: `<svg class="icon-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2.5a9.37 9.37 0 0 0-8.09 14.1L2.5 21.5l5.05-1.33a9.43 9.43 0 0 0 4.49 1.14h.01a9.41 9.41 0 1 0-.01-18.81Z"></path><path d="M8.7 7.96c-.18-.4-.36-.41-.53-.42h-.45c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.7 2.72 4.2 3.72 2.08.84 2.5.68 2.95.63.45-.04 1.44-.58 1.65-1.14.2-.56.2-1.03.14-1.14-.06-.12-.22-.18-.46-.3s-1.44-.72-1.66-.8c-.22-.08-.38-.12-.54.12-.16.24-.62.8-.76.96-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.2-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.46-.75-1.89Z" fill="currentColor" stroke="none"></path></svg>`
  };
  return icons[name] || '';
}

function injectShell(){
  const page = currentPage();
  const header = document.getElementById('site-header');
  const footer = document.getElementById('site-footer');
  const inner = page !== 'home';
  if(header){
    header.innerHTML = `
      <header class="site-header ${inner?'inner-header':''}" id="header">
        <div class="header-inner">
          <a class="brand" href="index.html" aria-label="Mahamagham home">
            <img class="brand-logo" src="assets/images/mahamagham-logo.png" alt="Mahamagham official logo"><span class="brand-copy"><span class="brand-name">MAHAMAGHAM</span><span class="brand-sub">Thirunavaya · Kerala</span></span>
          </a>
          <nav class="nav" id="nav" aria-label="Primary navigation">
            ${navItems.map(([href,label,key])=>`<a href="${href}" class="${page===key?'active':''}">${label}</a>`).join('')}
            <a class="nav-cta" href="get-involved.html">Volunteer Registration</a>
          </nav>
          <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">☰</button>
        </div>
      </header>`;
  }
  if(footer){
    footer.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div>
              <div class="footer-brand-lockup"><img class="footer-logo" src="assets/images/mahamagham-logo.png" alt="Mahamagham logo"><div class="footer-brand">MAHAMAGHAM</div></div>
              <p>A sacred river. A living tradition. A gathering of devotion, culture and community on the banks of the Nila.</p>
            </div>
            <div><h4>Explore</h4><div class="footer-links"><a href="about.html">About</a><a href="festival.html">Festival</a><a href="pilgrim-guide.html">Pilgrim Guide</a><a href="gallery.html">Gallery</a></div></div>
            <div><h4>Participate</h4><div class="footer-links"><a href="get-involved.html">Volunteer</a><a href="get-involved.html#offerings">Offerings</a><a href="get-involved.html#sponsorship">Sponsorship</a><a href="contact.html">Contact</a></div></div>
            <div>
              <h4>Get in touch</h4>
              <div class="footer-links"><a href="mailto:${SITE.email}">${SITE.email}</a><a href="tel:+919495041196">${SITE.phone}</a><span>${SITE.location}</span></div>
              <div class="footer-social-wrap">
                <div class="footer-social-label">Follow Mahamagham</div>
                <div class="social-links">
                  <a class="social-link" href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}<span>Instagram</span></a>
                  <a class="social-link" href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}<span>WhatsApp</span></a>
                  <a class="social-link" href="${SITE.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}<span>YouTube</span></a>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-bottom"><span>© 2026 Mahamagham. All rights reserved.</span><span>Thirunavaya · Kerala · India</span></div>
        </div>
      </footer>`;
  }
  const mobile = document.getElementById('mobile-actions');
  if(mobile){
    mobile.innerHTML = `<div class="mobile-actions"><a href="festival.html">Programme</a><a href="https://www.google.com/maps/search/?api=1&query=Thirunavaya%20Kerala" target="_blank">Directions</a><a href="https://wa.me/${SITE.whatsapp}" target="_blank">WhatsApp</a><a href="contact.html">Contact</a></div>`;
  }
  if(!document.querySelector('.scroll-progress')){
    document.body.insertAdjacentHTML('beforeend', `
      <div class="scroll-progress" aria-hidden="true"><span></span></div>
      <aside class="social-rail" aria-label="Mahamagham social channels">
        <a href="${SITE.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}<span>Instagram</span></a>
        <a href="https://wa.me/${SITE.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('whatsapp')}<span>WhatsApp</span></a>
        <a href="${SITE.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icon('youtube')}<span>YouTube</span></a>
      </aside>
      <button class="back-to-top" id="backToTop" aria-label="Back to top"><svg class="icon-svg" viewBox="0 0 24 24"><path d="m6 14 6-6 6 6"></path></svg></button>
    `);
  }
}

function initNav(){
  const header=document.getElementById('header'); const nav=document.getElementById('nav'); const toggle=document.getElementById('menuToggle');
  if(!header) return;
  const onScroll=()=>{ if(window.scrollY>40) header.classList.add('scrolled'); else if(!header.classList.contains('inner-header')) header.classList.remove('scrolled'); };
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  toggle?.addEventListener('click',()=>{ const open=!nav.classList.contains('open'); nav.classList.toggle('open',open); toggle.textContent=open?'✕':'☰'; toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Close menu':'Open menu'); document.body.style.overflow=open?'hidden':''; });
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.textContent='☰';toggle.setAttribute('aria-expanded','false');document.body.style.overflow='';}));
}

function initReveal(){
  const els=[...document.querySelectorAll('.reveal')];
  if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('show'));return;}
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');obs.unobserve(e.target)}}),{threshold:.12});
  els.forEach(e=>obs.observe(e));
}

function initFaq(){document.querySelectorAll('.faq-q').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.faq-item').classList.toggle('open')))}
function initFilters(){document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('.gallery-card').forEach(c=>c.style.display=(f==='all'||c.dataset.category===f)?'block':'none')}))}

function initMobileActions(){
  const bar=document.querySelector('#mobile-actions .mobile-actions');
  if(!bar) return;
  const update=()=>{
    if(window.innerWidth>820){bar.classList.remove('visible');return;}
    if(currentPage()!=='home'){bar.classList.add('visible');return;}
    const hero=document.querySelector('.hero');
    const threshold=hero ? Math.max(280, hero.offsetHeight*.62) : 420;
    bar.classList.toggle('visible',window.scrollY>threshold);
  };
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update,{passive:true});
  update();
}


function initPolish(){
  const progress=document.querySelector('.scroll-progress span');
  const back=document.getElementById('backToTop');
  const update=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    const pct=max>0?Math.min(1,window.scrollY/max):0;
    if(progress) progress.style.transform=`scaleX(${pct})`;
    if(back) back.classList.toggle('visible',window.scrollY>650);
  };
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update,{passive:true});
  back?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  update();
}

function initMailForms(){document.querySelectorAll('form[data-mailto]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(form);const subject=encodeURIComponent(d.get('subject')||'Mahamagham Website Enquiry');const body=encodeURIComponent([...d.entries()].filter(([k])=>k!=='subject').map(([k,v])=>`${k}: ${v}`).join('\n'));window.location.href=`mailto:${SITE.email}?subject=${subject}&body=${body}`}))}

document.addEventListener('DOMContentLoaded',()=>{injectShell();initNav();initReveal();initFaq();initFilters();initMobileActions();initPolish();initMailForms();});
