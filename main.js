// P31 Labs - Main JavaScript
// Subtle interactions and enhancements

(function() {
    'use strict';

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe sections for scroll animations
    document.addEventListener('DOMContentLoaded', () => {
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(section);
        });

        // Add visible class styles
        const style = document.createElement('style');
        style.textContent = `
            section.is-visible {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);

        // Vertex hover interactions
        const vertices = document.querySelectorAll('.vertex');
        vertices.forEach(vertex => {
            vertex.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            vertex.addEventListener('mouseleave', function() {
                this.style.zIndex = '';
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add subtle parallax to hero (only on desktop, reduce motion for mobile)
        if (window.matchMedia('(min-width: 769px) and (prefers-reduced-motion: no-preference)').matches) {
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const scrolled = window.pageYOffset;
                        const hero = document.querySelector('.hero');
                        if (hero && scrolled < window.innerHeight) {
                            hero.style.transform = `translateY(${scrolled * 0.2}px)`;
                        }
                        ticking = false;
                    });
                    ticking = true;
                }
            });
        }
    });
})();
