(function() {
  'use strict';

  const searchInput = document.getElementById('doc-search');
  const clearButton = document.getElementById('search-clear');
  const grid = document.getElementById('docs-grid');
  const cards = Array.from(document.querySelectorAll('.docs-card'));
  const noResults = document.getElementById('no-results-message');
  const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));

  if (!searchInput || !grid || !cards.length) return;

  // Simple search filter (case‑insensitive)
  function filterCards(query) {
    const trimmed = query.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
      const tags = card.dataset.tags?.toLowerCase() || '';
      const matches = trimmed === '' || title.includes(trimmed) || desc.includes(trimmed) || tags.includes(trimmed);
      
      card.classList.toggle('hidden', !matches);
      if (matches) visibleCount++;
    });

    // Show/hide no results message
    if (visibleCount === 0 && trimmed !== '') {
      noResults.classList.add('visible');
      // Announce for screen readers
      noResults.setAttribute('role', 'alert');
    } else {
      noResults.classList.remove('visible');
      noResults.removeAttribute('role');
    }
  }

  // Debounce input to avoid excessive filtering
  let debounceTimer;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      filterCards(e.target.value);
    }, 150);
  });

  // Clear search
  clearButton.addEventListener('click', () => {
    searchInput.value = '';
    filterCards('');
    searchInput.focus();
  });

  // Keyboard support: allow Enter to trigger immediate filter (skip debounce)
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      clearTimeout(debounceTimer);
      filterCards(searchInput.value);
    }
  });

  // Ensure all card links are keyboard accessible
  cards.forEach(card => {
    const link = card.querySelector('.card-link');
    if (link && !link.getAttribute('tabindex')) {
      link.setAttribute('tabindex', '0');
    }
  });

  // Optional: announce search results count for screen readers
  function announceResults(count) {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
    setTimeout(() => {
      announcer.textContent = `${count} documentation sections visible.`;
      setTimeout(() => announcer.remove(), 1000);
    }, 100);
  }

  // Filter buttons
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      
      cards.forEach(card => {
        const cardFilter = card.dataset.filter;
        const matches = filter === 'all' || cardFilter === filter;
        card.classList.toggle('hidden', !matches);
      });
      
      // Also apply search if active
      if (searchInput.value.trim()) {
        filterCards(searchInput.value);
      }
    });
  });

  // Initialise with all cards visible
  filterCards('');
})();
