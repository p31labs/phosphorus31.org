(function() {
  'use strict';

  // ═══════════════════════════════════════════════
  //  QUANTUM BACKGROUND — Wave function visualization
  // ═══════════════════════════════════════════════
  const quantumCanvas = document.getElementById('quantum-bg');
  if (quantumCanvas) {
    const ctx = quantumCanvas.getContext('2d');
    let time = 0;
    
    function resizeCanvas() {
      quantumCanvas.width = window.innerWidth;
      quantumCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    function drawQuantumField() {
      ctx.clearRect(0, 0, quantumCanvas.width, quantumCanvas.height);
      
      const w = quantumCanvas.width;
      const h = quantumCanvas.height;
      const centerX = w / 2;
      const centerY = h / 2;
      
      // Wave function: ψ(x,t) = A·sin(kx - ωt + φ)
      ctx.strokeStyle = 'rgba(46, 204, 113, 0.08)';
      ctx.lineWidth = 1;
      
      // Multiple wave frequencies (quantum superposition)
      for (let wave = 0; wave < 3; wave++) {
        const amplitude = 30 + wave * 20;
        const frequency = 0.01 + wave * 0.005;
        const phase = time * 0.002 + wave * Math.PI / 3;
        
        ctx.beginPath();
        for (let x = 0; x < w; x += 2) {
          const y = centerY + amplitude * Math.sin(frequency * x - phase);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      
      // Quantum particles (SIC-POVM inspired)
      ctx.fillStyle = 'rgba(96, 165, 250, 0.1)';
      for (let i = 0; i < 20; i++) {
        const angle = (time * 0.001 + i * Math.PI / 10) % (Math.PI * 2);
        const radius = 100 + 50 * Math.sin(time * 0.001 + i);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        const size = 2 + Math.sin(time * 0.002 + i) * 1;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      time += 1;
      requestAnimationFrame(drawQuantumField);
    }
    
    drawQuantumField();
  }

  // ----- Sample blog data (would be fetched from a CMS in production) -----
  const posts = [
    {
      id: 1,
      title: 'Announcing Node One Production Run',
      date: '2026-02-10',
      author: 'Dr. Aeon P.',
      excerpt: 'The first 1000 units are now in manufacturing. Pre‑orders open soon.',
      categories: ['Announcement', 'Hardware'],
      image: '🔧',
      slug: 'node-one-production'
    },
    {
      id: 2,
      title: 'Understanding the Phenix Navigator Protocol',
      date: '2026-02-05',
      author: 'Alex Chen',
      excerpt: 'A deep dive into our modified AODV routing algorithm and topology awareness.',
      categories: ['Technical'],
      image: '📡',
      slug: 'phenix-navigator-deep-dive'
    },
    {
      id: 3,
      title: 'Community Call Recap: February 2026',
      date: '2026-02-01',
      author: 'Jamie Rivera',
      excerpt: 'Highlights from our monthly community call, including Q&A and roadmap updates.',
      categories: ['Community'],
      image: '🗣️',
      slug: 'community-call-feb-2026'
    },
    {
      id: 4,
      title: 'LOVE Economy: Proof of Care Explained',
      date: '2026-01-25',
      author: 'Taylor Smith',
      excerpt: 'How Proof of Care rewards mesh participants and ensures network health.',
      categories: ['Economy', 'Technical'],
      image: '💚',
      slug: 'proof-of-care-explained'
    },
    {
      id: 5,
      title: 'Accessibility in Games: Our Approach',
      date: '2026-01-18',
      author: 'Taylor Smith',
      excerpt: 'Designing games that work with screen readers, switches, and high contrast.',
      categories: ['Community', 'Announcement'],
      image: '🎮',
      slug: 'accessible-games-approach'
    },
    {
      id: 6,
      title: 'Hardware Update: New Haptic Patterns',
      date: '2026-01-10',
      author: 'Alex Chen',
      excerpt: 'Firmware v0.2.1 introduces 50 new haptic patterns for enhanced feedback.',
      categories: ['Hardware', 'Technical'],
      image: '📳',
      slug: 'new-haptic-patterns'
    },
    {
      id: 7,
      title: 'Fiscal Sponsorship with Hack Foundation',
      date: '2025-12-10',
      author: 'Dr. Aeon P.',
      excerpt: 'P31 Labs is now a fiscally sponsored project of The Hack Foundation.',
      categories: ['Announcement'],
      image: '🏛️',
      slug: 'fiscal-sponsorship'
    }
  ];

  // ----- Configuration -----
  const POSTS_PER_PAGE = 6;

  // ----- DOM elements -----
  const postsGrid = document.getElementById('posts-grid');
  const searchInput = document.getElementById('blog-search');
  const searchBtn = document.getElementById('search-btn');
  const categoryFilters = document.getElementById('category-filters');
  const paginationDiv = document.getElementById('pagination');
  const noPostsMsg = document.getElementById('no-posts-message');

  // ----- State -----
  let currentPage = 1;
  let currentCategory = 'all';
  let currentSearch = '';
  let filteredPosts = [];

  // ----- Helper: format date nicely -----
  function formatDate(isoString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(isoString).toLocaleDateString(undefined, options);
  }

  // ----- Filter posts based on category and search -----
  function filterPosts() {
    filteredPosts = posts.filter(post => {
      // Category filter
      const matchesCategory = currentCategory === 'all' || post.categories.includes(currentCategory);
      // Search filter (case‑insensitive, in title, excerpt, author)
      const searchLower = currentSearch.toLowerCase().trim();
      const matchesSearch = searchLower === '' ||
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.author.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
    // Sort by date descending (most recent first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    return filteredPosts;
  }

  // ----- Render posts for current page (with quantum collapse animation) -----
  function renderPosts() {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const pagePosts = filteredPosts.slice(start, end);

    if (pagePosts.length === 0) {
      noPostsMsg.classList.add('visible');
      postsGrid.innerHTML = '';
    } else {
      noPostsMsg.classList.remove('visible');
      postsGrid.innerHTML = pagePosts.map((post, index) => `
        <div class="post-card quantum-enter" role="listitem" style="animation-delay: ${index * 0.1}s">
          <div class="post-image">${post.image}</div>
          <div class="post-content">
            <div class="post-meta">
              <span>📅 ${formatDate(post.date)}</span>
              <span>✍️ ${post.author}</span>
            </div>
            <h2 class="post-title">
              <a href="/blog/${post.slug}/" class="read-more">${post.title}</a>
            </h2>
            <p class="post-excerpt">${post.excerpt}</p>
            <div class="post-categories">
              ${post.categories.map(cat => `<span class="post-category">${cat}</span>`).join('')}
            </div>
            <a href="/blog/${post.slug}/" class="read-more" aria-label="Read more: ${post.title}">Read more →</a>
          </div>
        </div>
      `).join('');
      
      // Add quantum particle tracking to post images
      setTimeout(() => {
        const cards = postsGrid.querySelectorAll('.post-card');
        cards.forEach(card => {
          const image = card.querySelector('.post-image');
          if (image) {
            image.addEventListener('mousemove', (e) => {
              const rect = image.getBoundingClientRect();
              const x = ((e.clientX - rect.left) / rect.width) * 100;
              const y = ((e.clientY - rect.top) / rect.height) * 100;
              image.style.setProperty('--x', `${x}%`);
              image.style.setProperty('--y', `${y}%`);
            });
          }
        });
      }, 100);
    }

    renderPagination();
  }

  // ----- Render pagination controls -----
  function renderPagination() {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    if (totalPages <= 1) {
      paginationDiv.innerHTML = '';
      return;
    }

    let buttons = '';

    // Previous button
    buttons += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>← Prev</button>`;

    // Page numbers (show at most 5 pages)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }

    // Next button
    buttons += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>Next →</button>`;

    paginationDiv.innerHTML = buttons;

    // Attach event listeners to new page buttons
    paginationDiv.querySelectorAll('.page-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (btn.disabled) return;
        const page = parseInt(btn.dataset.page, 10);
        if (!isNaN(page) && page !== currentPage) {
          currentPage = page;
          filterAndRender();
        }
      });
      btn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!btn.disabled) btn.click();
        }
      });
    });
  }

  // ----- Main filter + render (with quantum state transition) -----
  function filterAndRender() {
    // Quantum state transition: fade out
    postsGrid.style.opacity = '0';
    postsGrid.style.transform = 'translateY(10px)';
    postsGrid.style.transition = 'opacity 0.3s, transform 0.3s';
    
    setTimeout(() => {
      filterPosts();
      // Reset to first page if category/search changed and current page is out of range
      const maxPage = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
      if (currentPage > maxPage) currentPage = Math.max(1, maxPage);
      renderPosts();
      
      // Quantum collapse: fade in
      setTimeout(() => {
        postsGrid.style.opacity = '1';
        postsGrid.style.transform = 'translateY(0)';
      }, 50);
    }, 300);
  }

  // ----- Event listeners -----
  // Search button click
  searchBtn.addEventListener('click', () => {
    currentSearch = searchInput.value;
    currentPage = 1;
    filterAndRender();
  });

  // Search on Enter key
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      currentSearch = searchInput.value;
      currentPage = 1;
      filterAndRender();
    }
  });

  // Category filter clicks
  categoryFilters.addEventListener('click', (e) => {
    const target = e.target.closest('.category-tag');
    if (!target) return;

    // Update active class
    categoryFilters.querySelectorAll('.category-tag').forEach(tag => tag.classList.remove('active'));
    target.classList.add('active');

    currentCategory = target.dataset.category;
    currentPage = 1;
    filterAndRender();
  });

  // Allow keyboard activation of category tags
  categoryFilters.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('.category-tag');
      if (target) {
        e.preventDefault();
        target.click();
      }
    }
  });

  // Initial render
  filterAndRender();
})();
