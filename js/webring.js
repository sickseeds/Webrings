// Webring Circular Navigation System
// Assumes members.json is loaded globally as 'allMembers' object with morute/traumacore arrays

const WEBRING_KEY = 'currentWebringIndex';

function getCurrentWebring() {
  return window.location.pathname.includes('morute') ? 'morute' : 'traumacore';
}

function getMembersList() {
  const webring = getCurrentWebring();
  return allMembers[webring]?.filter(m => m.approved === true) || [];
}

function getIndexFromURL() {
  const params = new URLSearchParams(window.location.search);
  const idx = parseInt(params.get('index'), 10);
  return isNaN(idx) ? 0 : idx;
}

function updateURL(index) {
  const url = new URL(window.location);
  url.searchParams.set('index', index);
  history.pushState({}, '', url);
}

function renderCurrentMember(member, index, total) {
  const container = document.getElementById('current-member-display');
  if (!container || !member) {
    container.innerHTML = '<p>No members yet. Be the first!</p>';
    return;
  }

  container.innerHTML = `
    <h2>${escapeHTML(member.name)}</h2>
    <p>${escapeHTML(member.description || '')}</p>
    <a href="${escapeAttr(member.url)}" target="_blank" class="visit-btn">
      Visit Site ➜
    </a>
    <p class="member-counter" style="margin-top:1rem;color:#888;">
      Member ${index + 1} of ${total}
    </p>
  `;
}

function renderMemberDirectory(members) {
  const list = document.getElementById('member-list');
  const count = document.getElementById('member-count');

  if (!list) return;

  list.innerHTML = members.map((m, i) => `
    <li class="member-item">
      <strong>${escapeHTML(m.name)}</strong>
      <br>
      <span style="font-size:0.9em;color:#666">${escapeHTML(m.description || '')}</span>
      <br>
      <a href="${escapeAttr(m.url)}" target="_blank">Visit →</a>
    </li>
  `).join('');

  if (count) count.textContent = members.length;
}

function goToPrevious() {
  const members = getMembersList();
  if (members.length === 0) return;

  let currentIndex = getIndexFromURL();
  const newIndex = (currentIndex - 1 + members.length) % members.length;
  updateURL(newIndex);
  loadMemberAtIndex(newIndex);
}

function goToNext() {
  const members = getMembersList();
  if (members.length === 0) return;

  let currentIndex = getIndexFromURL();
  const newIndex = (currentIndex + 1) % members.length;
  updateURL(newIndex);
  loadMemberAtIndex(newIndex);
}

function goToRandom() {
  const members = getMembersList();
  if (members.length === 0) return;

  const randomIndex = Math.floor(Math.random() * members.length);
  updateURL(randomIndex);
  loadMemberAtIndex(randomIndex);
}

function loadMemberAtIndex(index) {
  const members = getMembersList();
  const member = members[index];
  renderCurrentMember(member, index, members.length);
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeAttr(str) {
  return escapeHTML(str).replace(/"/g, '&quot;');
}

function showMemberInfo(e) {
  e.preventDefault();
  // Scroll to current member card
  document.getElementById('current-member-display').scrollIntoView({
    behavior: 'smooth'
  });
}

// Initialize on page load
document.addEventListener('membersLoaded', () => {
  const members = getMembersList();
  renderMemberDirectory(members);
  loadMemberAtIndex(getIndexFromURL());

  // Wire up navigation buttons
  document.querySelector('.webring-nav .prev')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToPrevious();
  });

  document.querySelector('.webring-nav .next')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToNext();
  });

  document.querySelector('.webring-nav .random')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToRandom();
  });
});
