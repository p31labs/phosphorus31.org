(function() {
  'use strict';

  const filterChips = document.querySelectorAll('.filter-chip');
  const gameCards = document.querySelectorAll('.game-card');
  const noGames = document.getElementById('no-games-message');

  if (!filterChips.length || !gameCards.length) return;

  // Get active filter (default "all")
  function getActiveFilter() {
    const active = document.querySelector('.filter-chip.active');
    return active ? active.dataset.filter : 'all';
  }

  // Filter games based on selected feature
  function filterGames(feature) {
    let visibleCount = 0;

    gameCards.forEach(card => {
      const featuresAttr = card.dataset.features || '';
      const features = featuresAttr.split(',').map(f => f.trim());

      // "all" shows everything; otherwise check if features array includes the selected feature
      const matches = (feature === 'all') || features.includes(feature);

      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    // Show/hide no results message
    if (visibleCount === 0 && feature !== 'all') {
      noGames.classList.add('visible');
      noGames.setAttribute('role', 'alert');
    } else {
      noGames.classList.remove('visible');
      noGames.removeAttribute('role');
    }

    // Announce result count for screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
    setTimeout(() => {
      announcer.textContent = `${visibleCount} games visible.`;
      setTimeout(() => announcer.remove(), 1000);
    }, 100);
  }

  // Handle chip clicks
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      // Update active class
      filterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const filter = chip.dataset.filter;
      filterGames(filter);
    });

    // Keyboard support: Enter and Space activate chip
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chip.click();
      }
    });
  });

  // Initialise (all visible)
  filterGames('all');
})();
