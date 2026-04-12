// ============================================
// PORTFOLIO - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ----------------------------------------
    // Background Particles (Starfield)
    // ----------------------------------------
    const particleContainer = document.getElementById('bgParticles');
    if (particleContainer) {
        // Generate twinkling stars
        const starCount = 100;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('span');
            star.classList.add('star');
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.width = star.style.height = (Math.random() * 2.5 + 0.5) + 'px';
            star.style.animationDuration = (Math.random() * 3 + 1) + 's';
            star.style.animationDelay = (Math.random() * 3) + 's';
            star.style.opacity = Math.random();
            particleContainer.appendChild(star);
        }

        // Generate occasional shooting stars
        const shootingStarCount = 5;
        for (let i = 0; i < shootingStarCount; i++) {
            const shooting = document.createElement('span');
            shooting.classList.add('shooting-star');
            shooting.style.left = (Math.random() * 100 + 50) + '%'; 
            shooting.style.top = (Math.random() * -50) + '%';
            shooting.style.animationDuration = (Math.random() * 4 + 4) + 's';
            shooting.style.animationDelay = (Math.random() * 5) + 's';
            particleContainer.appendChild(shooting);
        }
    }

    // ----------------------------------------
    // Navbar scroll effect
    // ----------------------------------------
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ----------------------------------------
    // Mobile nav toggle
    // ----------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ----------------------------------------
    // Counter animation (hero stats)
    // ----------------------------------------
    const counters = document.querySelectorAll('[data-count]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-count'), 10);
        const duration = 1800;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
    }

    // ----------------------------------------
    // Scroll reveal (IntersectionObserver)
    // ----------------------------------------
    const revealElements = document.querySelectorAll(
        '.service-card, .featured-card, .project-card, .skill-card, .timeline-item, ' +
        '.contact-method, .about-content, .about-image-card, .contact-form-wrapper'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, index * 80);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach(el => revealObserver.observe(el));

    // ----------------------------------------
    // Skill bars animation
    // ----------------------------------------
    const skillFills = document.querySelectorAll('.skill-fill');

    const skillObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    skillObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    skillFills.forEach(el => skillObserver.observe(el));

    // ----------------------------------------
    // Counter observer
    // ----------------------------------------
    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(el => counterObserver.observe(el));

    // ----------------------------------------
    // Project filter tabs
    // ----------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ----------------------------------------
    // Contact form (simple UX feedback)
    // ----------------------------------------
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                contactForm.reset();
            }, 3000);
        });
    }

    // ----------------------------------------
    // Tilt effect on service cards
    // ----------------------------------------
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -5;
            const rotateY = (x - centerX) / centerX * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
});