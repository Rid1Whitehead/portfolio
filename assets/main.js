// Footer year
window.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Theme toggle (light default)
function toggleTheme(){
  const r = document.documentElement;
  const isDark = r.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#111827' : '#F6F5F1');
}
(function(){
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.classList.add('dark');
})();

// --- Projects: search + tag filters ---
const activeTags = new Set();
function toggleTag(el){
  el.classList.toggle('active');
  const t = el.dataset.tag;
  activeTags.has(t) ? activeTags.delete(t) : activeTags.add(t);
  filterProjects();
}
function filterProjects(){
  const q = (document.getElementById('projectFilter')?.value || '').toLowerCase();
  document.querySelectorAll('#projectGrid .tile').forEach(card => {
    const text = card.innerText.toLowerCase();
    const tags = (card.getAttribute('data-tags')||'').split(/\s+/);
    const matchText = text.includes(q);
    const matchTags = activeTags.size===0 || [...activeTags].every(t => tags.includes(t));
    card.style.display = (matchText && matchTags) ? '' : 'none';
  });
}

// --- Reflections: search + tag filters ---
const activePostTags = new Set();
function togglePostTag(el){
  el.classList.toggle('active');
  const t = el.dataset.tag;
  activePostTags.has(t) ? activePostTags.delete(t) : activePostTags.add(t);
  filterPosts();
}
function filterPosts(){
  const q = (document.getElementById('postFilter')?.value || '').toLowerCase();
  document.querySelectorAll('#postGrid .tile').forEach(card => {
    const text = card.innerText.toLowerCase();
    const tags = (card.getAttribute('data-tags')||'').split(/\s+/);
    const matchText = text.includes(q);
    const matchTags = activePostTags.size===0 || [...activePostTags].every(t => tags.includes(t));
    card.style.display = (matchText && matchTags) ? '' : 'none';
  });
}

// --- Publications: auto from Semantic Scholar ---
// Replace with your author ID (from your S2 URL, e.g., .../author/Name/1234567 -> '1234567').
const AUTHOR_ID = '2297762953';

async function loadPublications(){
  if(!AUTHOR_ID || AUTHOR_ID.startsWith('REPLACE_')) return; // skip until configured
  const fields = ['title','year','venue','url','openAccessPdf','authors'].join(',');
  const api = `https://api.semanticscholar.org/graph/v1/author/${AUTHOR_ID}/papers?limit=100&fields=${fields}`;
  try {
    const res = await fetch(api);
    if(!res.ok) throw new Error('Failed to fetch publications');
    const data = await res.json();
    const list = (data?.data || []).sort((a,b)=>(b.year||0)-(a.year||0));
    const grid = document.getElementById('pubList');
    grid.innerHTML = '';
    list.forEach(p => {
      const authors = (p.authors||[]).map(x=>x.name).join(', ');
      const link = (p.openAccessPdf && p.openAccessPdf.url) || p.url || '#';
      const year = p.year ? `, ${p.year}` : '';
      const venue = p.venue || '';
      const card = document.createElement('article');
      card.className = 'tile col-12';
      card.innerHTML = `
        <div class="content pub">
          <div class="pub-title"><a href="${link}" target="_blank" rel="noopener">${p.title}</a></div>
          <div class="authors">${authors}</div>
          <div class="venue">${venue}${year}</div>
        </div>`;
      grid.appendChild(card);
    });
  } catch (err) { console.error(err); }
}
window.addEventListener('DOMContentLoaded', loadPublications);

// --- Make project thumbnails clickable to their link ---
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#projectGrid .tile .thumb').forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', (e) => {
      const tile = e.currentTarget.closest('.tile');
      if (!tile) return;
      const explicit = tile.getAttribute('data-link');
      let href = explicit && explicit !== '#' ? explicit : null;
      if (!href) {
        const preferred = tile.querySelector('.meta a[href]:not([href="#"])');
        const any = preferred || tile.querySelector('.meta a[href]');
        href = any ? any.getAttribute('href') : null;
      }
      if (href) {
        const targetBlank = /^https?:\/\//i.test(href) || href.startsWith('//');
        if (targetBlank) {
          window.open(href, '_blank', 'noopener');
        } else {
          window.location.href = href;
        }
      }
    });
  });
});
