
const SITE = {
  email: 'mail@mahamagham.com',
  phone: '+91 94950 41196',
  whatsapp: '919495041196',
  instagram: 'https://www.instagram.com/mahamagha_mahotsavam/',
  youtube: 'https://www.youtube.com/channel/UC5oJ4zNocTQKuPHiYaDxElA',
  location: 'Sri Panch Dasnam Juna Akhada, Thirunnavaya, Malappuram, Kerala 676301'
};

const nav = [
  {key:'about', label:'About Us', href:'about.html', sub:[['About the Event','about.html#event'],['History','about.html#history'],['Significance','about.html#significance'],['Timeline','about.html#timeline'],['Organising Committee','about.html#committee'],['Contact','about.html#contact']]},
  {key:'programmes', label:'Programmes', href:'programmes.html', sub:[['Programme Schedule','programmes.html#schedule'],['Main Ceremony','programmes.html#ceremony'],['Pujas & Sevas','programmes.html#sevas'],['Other Events','programmes.html#events'],['Announcements','programmes.html#announcements']]},
  {key:'visit', label:'Visit', href:'visit.html', sub:[['Venue','visit.html#venue'],['How to Reach','visit.html#reach'],['Parking','visit.html#parking'],['Accommodation','visit.html#stay'],['Visitor Guidelines','visit.html#guidelines'],['FAQ / Help','visit.html#faq']]},
  {key:'media', label:'Media', href:'media.html', sub:[['News & Updates','media.html#news'],['Press Releases','media.html#press'],['Photos','media.html#photos'],['Videos','media.html#videos'],['Media / Press Kit','media.html#press-kit']]},
  {key:'archive', label:'Archive', href:'archive.html', sub:[['2026 Event','archive.html#event-2026'],['Historical Documents','archive.html#documents'],['Publications','archive.html#publications']]}
];

function pageKey(){ return document.body.dataset.page || 'home'; }
function svg(name){
  const S={
    chevron:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>`,
    down:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
    instagram:`<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.3" y="3.3" width="17.4" height="17.4" rx="5"/><circle cx="12" cy="12" r="4.1"/><circle cx="17.3" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>`,
    youtube:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 8.2a2.8 2.8 0 0 0-2-2c-1.8-.5-7-.5-7-.5s-5.2 0-7 .5a2.8 2.8 0 0 0-2 2A28 28 0 0 0 2.7 12 28 28 0 0 0 3 15.8a2.8 2.8 0 0 0 2 2c1.8.5 7 .5 7 .5s5.2 0 7-.5a2.8 2.8 0 0 0 2-2 28 28 0 0 0 .3-3.8 28 28 0 0 0-.3-3.8Z"/><path d="m10 15.2 5-3.2-5-3.2Z" fill="currentColor" stroke="none"/></svg>`,
    whatsapp:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8a9.1 9.1 0 0 0-7.9 13.7L2.8 21.2l4.8-1.3A9.1 9.1 0 1 0 12 2.8Z"/><path d="M8.7 8c-.2-.4-.4-.4-.6-.4h-.4c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.7 2.6 4 3.6 2 .8 2.4.6 2.8.6.4 0 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3l-1.6-.8c-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.1-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.3-.4.2-.4c.1-.2 0-.3 0-.4L8.7 8Z" fill="currentColor" stroke="none"/></svg>`,
    arrow:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M13 7l5 5-5 5"/></svg>`,
    live:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><path d="M5.8 5.8a8.8 8.8 0 0 0 0 12.4M18.2 5.8a8.8 8.8 0 0 1 0 12.4"/></svg>`,
    heart:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.7a5.4 5.4 0 0 0-7.6 0L12 5.9l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.7a5.4 5.4 0 0 0 0-7.6Z"/></svg>`
  }; return S[name]||'';
}

function injectShell(){
  const page=pageKey();
  const header=document.getElementById('site-header');
  const footer=document.getElementById('site-footer');
  if(header){
    header.innerHTML=`
      <div class="utility-bar">
        <div class="shell utility-inner"><span>THIRUNAVAYA · NILA · KERALA</span><div><a href="media.html">Media</a><a href="archive.html">Archive</a><span class="utility-sep"></span><a href="#" class="lang active">English</a><a href="#" class="lang">മലയാളം</a></div></div>
      </div>
      <header class="premium-header" id="premiumHeader">
        <div class="shell header-row">
          <a class="premium-brand" href="index.html" aria-label="Mahamagham home"><img src="assets/images/mahamagham-logo.png" alt="Mahamagham logo"><span><b>MAHAMAGHAM</b><small>THIRUNAVAYA · 2027</small></span></a>
          <nav class="desktop-nav" aria-label="Main navigation">
            ${nav.map(n=>`<div class="nav-item"><a href="${n.href}" class="nav-main ${page===n.key?'active':''}">${n.label}${svg('down')}</a><div class="nav-drop">${n.sub.map(([l,h])=>`<a href="${h}"><span>${l}</span>${svg('chevron')}</a>`).join('')}</div></div>`).join('')}
          </nav>
          <div class="header-actions"><a class="live-btn ${page==='live'?'active':''}" href="live.html">${svg('live')}<span>Live</span></a><a class="support-btn ${page==='support'?'active':''}" href="support.html">${svg('heart')}<span>Support</span></a><button class="menu-button" id="menuButton" aria-label="Open menu" aria-expanded="false"><i></i><i></i><i></i></button></div>
        </div>
      </header>
      <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true"><div class="drawer-top"><a class="drawer-brand" href="index.html"><img src="assets/images/mahamagham-logo.png" alt="Mahamagham"><span>Mahamagham 2027</span></a><button id="drawerClose" aria-label="Close menu">×</button></div><div class="drawer-links">${nav.map(n=>`<details ${page===n.key?'open':''}><summary>${n.label}${svg('down')}</summary><div>${n.sub.map(([l,h])=>`<a href="${h}">${l}</a>`).join('')}</div></details>`).join('')}<a class="drawer-standalone" href="live.html">Live</a><a class="drawer-standalone" href="support.html">Support</a></div><div class="drawer-bottom"><a href="${SITE.instagram}" target="_blank">Instagram</a><a href="https://wa.me/${SITE.whatsapp}" target="_blank">WhatsApp</a><a href="${SITE.youtube}" target="_blank">YouTube</a></div></div>
    `;
  }
  if(footer){
    footer.innerHTML=`<footer class="premium-footer"><div class="shell footer-top"><div class="footer-lead"><img src="assets/images/mahamagham-logo.png" alt="Mahamagham"><h2>Mahamagham 2027</h2><p>A sacred gathering of faith, culture and service on the banks of the Nila at Thirunavaya.</p><div class="footer-social"><a href="${SITE.instagram}" target="_blank">${svg('instagram')}</a><a href="https://wa.me/${SITE.whatsapp}" target="_blank">${svg('whatsapp')}</a><a href="${SITE.youtube}" target="_blank">${svg('youtube')}</a></div></div><div class="footer-columns"><div><h4>About</h4><a href="about.html#event">The Event</a><a href="about.html#history">History</a><a href="about.html#timeline">Timeline</a><a href="about.html#committee">Committee</a></div><div><h4>Programmes</h4><a href="programmes.html#schedule">Schedule</a><a href="programmes.html#ceremony">Main Ceremony</a><a href="programmes.html#sevas">Pujas & Sevas</a><a href="programmes.html#announcements">Announcements</a></div><div><h4>Plan Your Visit</h4><a href="visit.html#venue">Venue</a><a href="visit.html#reach">How to Reach</a><a href="visit.html#parking">Parking</a><a href="visit.html#stay">Accommodation</a></div><div><h4>More</h4><a href="live.html">Live</a><a href="media.html">Media</a><a href="archive.html">Archive</a><a href="support.html">Support</a></div></div></div><div class="shell footer-contact"><span>${SITE.email}</span><span>${SITE.phone}</span><span>Thirunavaya · Malappuram · Kerala</span></div><div class="shell footer-bottom"><span>© 2027 Mahamagham. All rights reserved.</span><span>Official event information portal</span></div></footer>`;
  }
  document.body.insertAdjacentHTML('beforeend',`<div class="scroll-line"><span></span></div><a class="whatsapp-float" href="https://wa.me/${SITE.whatsapp}" target="_blank" aria-label="WhatsApp">${svg('whatsapp')}</a><button class="to-top" id="toTop" aria-label="Back to top">↑</button>`);
}

function initMenu(){
  const btn=document.getElementById('menuButton'), drawer=document.getElementById('mobileDrawer'), close=document.getElementById('drawerClose');
  const set=(open)=>{drawer?.classList.toggle('open',open);drawer?.setAttribute('aria-hidden',String(!open));btn?.setAttribute('aria-expanded',String(open));document.body.classList.toggle('menu-open',open)};
  btn?.addEventListener('click',()=>set(true)); close?.addEventListener('click',()=>set(false)); drawer?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>set(false)));
}
function initHeader(){const h=document.getElementById('premiumHeader');const update=()=>h?.classList.toggle('scrolled',window.scrollY>24);window.addEventListener('scroll',update,{passive:true});update()}
function initReveal(){const els=[...document.querySelectorAll('[data-reveal]')];if(!('IntersectionObserver'in window)){els.forEach(e=>e.classList.add('revealed'));return}const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('revealed');io.unobserve(e.target)}}),{threshold:.12});els.forEach(e=>io.observe(e))}
function initFaq(){document.querySelectorAll('.faq-row button').forEach(b=>b.addEventListener('click',()=>b.closest('.faq-row').classList.toggle('open')))}
function initTabs(){document.querySelectorAll('[data-tabs]').forEach(box=>{const bs=box.querySelectorAll('[data-tab]'), ps=box.querySelectorAll('[data-panel]');bs.forEach(b=>b.addEventListener('click',()=>{bs.forEach(x=>x.classList.remove('active'));ps.forEach(x=>x.classList.remove('active'));b.classList.add('active');box.querySelector(`[data-panel="${b.dataset.tab}"]`)?.classList.add('active')}))})}
function initFilters(){document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(x=>x.classList.remove('active'));b.classList.add('active');const f=b.dataset.filter;document.querySelectorAll('[data-gallery-item]').forEach(x=>x.hidden=!(f==='all'||x.dataset.category===f))}))}
function initForms(){document.querySelectorAll('form[data-demo-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();const n=f.querySelector('[name="name"]')?.value||'Thank you';const box=f.closest('.form-card')||f.parentElement;box.querySelector('.form-success')?.classList.add('show');f.reset()}))}
function initScroll(){const line=document.querySelector('.scroll-line span'),top=document.getElementById('toTop');const u=()=>{const m=document.documentElement.scrollHeight-innerHeight,p=m?scrollY/m:0;line&&(line.style.transform=`scaleX(${p})`);top?.classList.toggle('show',scrollY>700)};addEventListener('scroll',u,{passive:true});top?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));u()}
function initLivePulse(){document.querySelectorAll('.live-time').forEach(el=>{const d=new Date();el.textContent=d.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})})}

document.addEventListener('DOMContentLoaded',()=>{injectShell();initMenu();initHeader();initReveal();initFaq();initTabs();initFilters();initForms();initScroll();initLivePulse()});
