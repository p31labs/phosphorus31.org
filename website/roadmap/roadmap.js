(function() {
  'use strict';

  const filterButtons = document.querySelectorAll('.filter-btn');
  const milestones = document.querySelectorAll('.milestone');
  const noResults = document.getElementById('no-milestones-message');

  if (!filterButtons.length || !milestones.length) return;

  // Helper: get active filter (default "all")
  function getActiveFilter() {
    const active = document.querySelector('.filter-btn.active');
    return active ? active.dataset.filter : 'all';
  }

  // Filter milestones based on selected component
  function filterMilestones(component) {
    let visibleCount = 0;

    milestones.forEach(m => {
      const compAttr = m.dataset.component || '';
      const components = compAttr.split(',').map(c => c.trim());

      // "all" shows everything; otherwise check if component list includes selected
      const matches = (component === 'all') || components.includes(component);

      m.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    // Show/hide no results message
    if (visibleCount === 0 && component !== 'all') {
      noResults.classList.add('visible');
      // Announce for screen readers
      noResults.setAttribute('role', 'alert');
    } else {
      noResults.classList.remove('visible');
      noResults.removeAttribute('role');
    }

    // Optional: announce result count to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.classList.add('sr-only');
    document.body.appendChild(announcer);
    setTimeout(() => {
      announcer.textContent = `${visibleCount} milestones visible.`;
      setTimeout(() => announcer.remove(), 1000);
    }, 100);
  }

  // Handle filter button clicks
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Update active class
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      filterMilestones(filter);
    });

    // Keyboard support: Enter and Space activate filter
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  // Initialise (all visible)
  filterMilestones('all');
})();
