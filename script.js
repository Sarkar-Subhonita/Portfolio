/* ============================================================
   Subhonita Sarkar — Portfolio JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (window.lucide) lucide.createIcons();

    /* ---------- THEME TOGGLE ---------- */
    const themeToggle = document.getElementById('themeToggle');
    const htmlEl = document.documentElement;

    // Determine initial theme: localStorage > system preference > dark (default)
    const getPreferredTheme = () => {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const applyTheme = (theme) => {
        if (theme === 'light') {
            htmlEl.setAttribute('data-theme', 'light');
        } else {
            htmlEl.removeAttribute('data-theme');
        }
    };

    // Apply saved/system theme on load (no transition on first paint)
    applyTheme(getPreferredTheme());

    // Listen for toggle clicks
    themeToggle.addEventListener('click', () => {
        const isCurrentlyLight = htmlEl.getAttribute('data-theme') === 'light';
        const newTheme = isCurrentlyLight ? 'dark' : 'light';

        // Add transition class for smooth color switch
        htmlEl.classList.add('theme-transition');
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);

        // Remove transition class after animation completes to avoid
        // interfering with other transitions (e.g. hover effects)
        setTimeout(() => htmlEl.classList.remove('theme-transition'), 500);
    });

    // Also react if the user changes their OS-level theme while the page is open
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
        // Only follow system if the user hasn't manually overridden
        if (!localStorage.getItem('theme')) {
            htmlEl.classList.add('theme-transition');
            applyTheme(e.matches ? 'light' : 'dark');
            setTimeout(() => htmlEl.classList.remove('theme-transition'), 500);
        }
    });

    /* ---------- NAVBAR ---------- */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navLinks');
    const sections = document.querySelectorAll('section[id]');

    // Sticky navbar background on scroll
    const handleNavScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleNavScroll);
    handleNavScroll();

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });

    // Active section highlighting
    const highlightNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-link[data-section="${id}"]`);
            if (link) {
                link.classList.toggle('active', scrollY >= top && scrollY < top + height);
            }
        });
    };
    window.addEventListener('scroll', highlightNav);

    /* ---------- SMOOTH SCROLL ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = navbar.offsetHeight + 10;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ---------- SCROLL REVEAL (Intersection Observer) ---------- */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ---------- HERO STAT COUNTER ---------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                animateCounter(el, target);
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));

    function animateCounter(el, target) {
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = current;
        }, 40);
    }

    /* ---------- SKILL BARS ---------- */
    const skillFills = document.querySelectorAll('.skill-fill');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const level = entry.target.dataset.level;
                entry.target.style.width = level + '%';
                skillObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillFills.forEach(el => skillObserver.observe(el));

    /* ---------- BACK TO TOP ---------- */
    const backBtn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        backBtn.classList.toggle('visible', window.scrollY > 500);
    });
    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- SCROLL INDICATOR HIDE ---------- */
    const scrollIndicator = document.getElementById('scrollIndicator');
    window.addEventListener('scroll', () => {
        if (scrollIndicator) {
            scrollIndicator.style.opacity = window.scrollY > 200 ? '0' : '1';
        }
    });

    /* ---------- CONTACT FORM (EmailJS) ---------- */
    // ⚠️ Replace these placeholders with your actual EmailJS credentials:
    // 1. Sign up at https://www.emailjs.com/
    // 2. Create an Email Service (e.g. Gmail) and get the Service ID
    // 3. Create an Email Template and get the Template ID
    // 4. Copy your Public Key from Account > API Keys
    const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';     // e.g. 'aBcDeFgHiJkLmNo'
    const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';     // e.g. 'service_xxxxxxx'
    const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';   // e.g. 'template_xxxxxxx'

    // Initialize EmailJS
    if (window.emailjs) {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Gather field values
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject') ? document.getElementById('subject').value.trim() : '';
        const message = document.getElementById('message').value.trim();

        // Client-side validation
        if (!name) {
            formStatus.textContent = '⚠️ Please enter your name.';
            formStatus.style.color = '#f87171';
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            formStatus.textContent = '⚠️ Please enter a valid email address.';
            formStatus.style.color = '#f87171';
            return;
        }
        if (!message) {
            formStatus.textContent = '⚠️ Please enter a message.';
            formStatus.style.color = '#f87171';
            return;
        }

        // Update button state
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader-2" class="btn-icon spin"></i> Sending...';
        if (window.lucide) lucide.createIcons();
        formStatus.textContent = '';

        // Template parameters (must match your EmailJS template variables)
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject || 'Portfolio Contact',
            message: message,
        };

        // Check if EmailJS is configured
        if (!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            // Fallback: show success for development/preview
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i data-lucide="send" class="btn-icon"></i>';
                if (window.lucide) lucide.createIcons();
                formStatus.textContent = '⚠️ EmailJS not configured. Please add your credentials in script.js.';
                formStatus.style.color = '#fbbf24';
            }, 1000);
            return;
        }

        // Send via EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i data-lucide="check" class="btn-icon"></i> Sent!';
                if (window.lucide) lucide.createIcons();
                formStatus.textContent = '✅ Thank you! Your message has been sent successfully.';
                formStatus.style.color = '#4ade80';
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = 'Send Message <i data-lucide="send" class="btn-icon"></i>';
                    if (window.lucide) lucide.createIcons();
                    formStatus.textContent = '';
                }, 4000);
            })
            .catch((error) => {
                console.error('EmailJS error:', error);
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message <i data-lucide="send" class="btn-icon"></i>';
                if (window.lucide) lucide.createIcons();
                formStatus.textContent = '❌ Failed to send message. Please try again or email me directly.';
                formStatus.style.color = '#f87171';

                setTimeout(() => {
                    formStatus.textContent = '';
                }, 5000);
            });
    });

    /* ---------- TILT EFFECT ON PROJECT CARDS ---------- */
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    /* ---------- TYPEWRITER EFFECT ---------- */
    const typewriterEl = document.getElementById('typewriterText');
    if (typewriterEl) {
        const phrases = [
            'Subhonita Sarkar',
            'Engineering Student',
            'Tech Enthusiast',
            'Developer'
        ];

        const TYPING_SPEED = 80;   // ms per character when typing
        const DELETING_SPEED = 45; // ms per character when deleting
        const PAUSE_AFTER_TYPE = 1500; // ms to hold the completed phrase
        const PAUSE_AFTER_DELETE = 400; // ms pause before typing next phrase

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typewriterTick() {
            const currentPhrase = phrases[phraseIndex];

            if (!isDeleting) {
                // Typing forward
                charIndex++;
                typewriterEl.textContent = currentPhrase.substring(0, charIndex);

                if (charIndex === currentPhrase.length) {
                    // Finished typing — pause, then start deleting
                    isDeleting = true;
                    setTimeout(typewriterTick, PAUSE_AFTER_TYPE);
                    return;
                }
                setTimeout(typewriterTick, TYPING_SPEED);
            } else {
                // Deleting backward
                charIndex--;
                typewriterEl.textContent = currentPhrase.substring(0, charIndex);

                if (charIndex === 0) {
                    // Finished deleting — move to next phrase
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(typewriterTick, PAUSE_AFTER_DELETE);
                    return;
                }
                setTimeout(typewriterTick, DELETING_SPEED);
            }
        }

        // Start after a short delay so the hero fade-in animation plays first
        setTimeout(typewriterTick, 600);
    }

    /* ---------- PARALLAX ON HERO ORBS ---------- */
    window.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.hero-gradient-orb');
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        orbs.forEach((orb, i) => {
            const speed = (i + 1) * 15;
            orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });
});
