// Footer year
window.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// --- Theme toggle (initial theme is set by an inline script in <head>) ---
function syncThemeUI(){
  const isDark = document.documentElement.classList.contains('dark');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', isDark ? '#111827' : '#F6F5F1');
  const btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
}
function toggleTheme(){
  const isDark = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (e) {}
  syncThemeUI();
}
window.addEventListener('DOMContentLoaded', () => {
  syncThemeUI();
  document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
});

// --- Projects: search + tag filters ---
const activeTags = new Set();
function filterProjects(){
  const q = (document.getElementById('projectFilter')?.value || '').trim().toLowerCase();
  let shown = 0;
  document.querySelectorAll('#projectGrid .tile').forEach(card => {
    const text = card.textContent.toLowerCase();
    const tags = (card.getAttribute('data-tags') || '').split(/\s+/);
    const matchText = text.includes(q);
    const matchTags = activeTags.size === 0 || [...activeTags].every(t => tags.includes(t));
    const visible = matchText && matchTags;
    card.hidden = !visible;
    if (visible) shown++;
  });
  const empty = document.getElementById('projectEmpty');
  if (empty) empty.hidden = shown > 0;
}
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('projectFilter')?.addEventListener('input', filterProjects);
  document.querySelectorAll('.tags .tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.tag;
      const on = !activeTags.has(t);
      on ? activeTags.add(t) : activeTags.delete(t);
      btn.setAttribute('aria-pressed', String(on));
      filterProjects();
    });
  });
  document.getElementById('clearFilters')?.addEventListener('click', () => {
    activeTags.clear();
    document.querySelectorAll('.tags .tag').forEach(b => b.setAttribute('aria-pressed', 'false'));
    const input = document.getElementById('projectFilter');
    if (input) input.value = '';
    filterProjects();
  });
});

// --- Publications: auto from Semantic Scholar ---
const AUTHOR_ID = '2297762953';
const SCHOLAR_URL = 'https://scholar.google.com/citations?user=q07J89kAAAAJ&hl=en';

function escapeHTML(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function loadPublications(){
  const grid = document.getElementById('pubList');
  if (!grid) return;
  const fields = ['title','year','venue','url','openAccessPdf','authors','externalIds'].join(',');
  const api = `https://api.semanticscholar.org/graph/v1/author/${AUTHOR_ID}/papers?limit=100&fields=${fields}`;
  try {
    const res = await fetch(api);
    if (!res.ok) throw new Error('Failed to fetch publications');
    const data = await res.json();
    const list = (data?.data || []).sort((a,b) => (b.year || 0) - (a.year || 0));
    grid.innerHTML = '';
    list.forEach(p => {
      const authors = (p.authors || [])
        .map(a => /whitehead/i.test(a.name) ? `<strong>${escapeHTML(a.name)}</strong>` : escapeHTML(a.name))
        .join(', ');
      // Prefer the publisher's DOI page, then Semantic Scholar's page
      const doi = p.externalIds?.DOI;
      const link = doi ? `https://doi.org/${encodeURI(doi)}` : (p.url || p.openAccessPdf?.url || SCHOLAR_URL);
      const pdf = p.openAccessPdf?.url;
      const card = document.createElement('article');
      card.className = 'pub';
      card.innerHTML = `
        <div class="pub-year">${escapeHTML(p.year || '')}</div>
        <div>
          <div class="pub-title"><a href="${escapeHTML(link)}" target="_blank" rel="noopener">${escapeHTML(p.title)}</a></div>
          <div class="pub-authors">${authors}</div>
          ${p.venue ? `<div class="pub-venue">${escapeHTML(p.venue)}</div>` : ''}
          ${pdf ? `<div class="pub-links"><a class="chip link" href="${escapeHTML(pdf)}" target="_blank" rel="noopener">Open access PDF</a></div>` : ''}
        </div>`;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p class="empty">Publications could not be loaded right now. See the full list on <a href="${SCHOLAR_URL}" target="_blank" rel="noopener">Google Scholar</a>.</p>`;
  }
}
window.addEventListener('DOMContentLoaded', loadPublications);
