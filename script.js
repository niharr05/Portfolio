/**
 * Nihar Ramoliya Portfolio - Interactive Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Toggle (Dark & Light Mode) with LocalStorage
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const rootElement = document.documentElement;

  // Retrieve saved theme or fallback to dark
  const savedTheme = localStorage.getItem('nr-portfolio-theme') || 'dark';
  rootElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = rootElement.getAttribute('data-theme');
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      rootElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('nr-portfolio-theme', nextTheme);
      showToast(`Switched to ${nextTheme} mode`);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Menu Navigation
  // --------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });

    // Close menu on click outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Active Nav Link on Scroll (IntersectionObserver)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));

  // --------------------------------------------------------------------------
  // 4. Clipboard Copy with Toast Feedback
  // --------------------------------------------------------------------------
  const copyButtons = document.querySelectorAll('[data-email]');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    if (toastMessage) toastMessage.textContent = message;

    toast.classList.add('show');
    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  copyButtons.forEach((button) => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = button.getAttribute('data-email') || 'nihar.ramoliya05@gmail.com';

      try {
        await navigator.clipboard.writeText(email);
        showToast(`Copied email (${email}) to clipboard!`);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`Copied email (${email}) to clipboard!`);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 5. Case Study Modals
  // --------------------------------------------------------------------------
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const closeModalBtns = document.querySelectorAll('.modal-close-btn, .close-modal-action');
  const modalOverlays = document.querySelectorAll('.modal-overlay');

  function openModal(modalId) {
    const targetModal = document.getElementById(modalId);
    if (targetModal) {
      targetModal.classList.add('active');
      targetModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // prevent scroll
    }
  }

  function closeModal(overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      if (modalId) openModal(modalId);
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const overlay = e.target.closest('.modal-overlay');
      if (overlay) closeModal(overlay);
    });
  });

  modalOverlays.forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modalOverlays.forEach((overlay) => {
        if (overlay.classList.contains('active')) {
          closeModal(overlay);
        }
      });
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
      }
    }
  });

  // --------------------------------------------------------------------------
  // 6. Contact Form Handling
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('sender-name')?.value.trim();
      const email = document.getElementById('sender-email')?.value.trim();
      const subject = document.getElementById('message-subject')?.value.trim();
      const message = document.getElementById('message-body')?.value.trim();

      if (!name || !email || !subject || !message) {
        showToast('Please fill out all fields.');
        return;
      }

      // Generate mailto link
      const encodedSubject = encodeURIComponent(`[Portfolio Contact] ${subject} - from ${name}`);
      const bodyContent = `Sender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      const encodedBody = encodeURIComponent(bodyContent);

      const mailtoUrl = `mailto:nihar.ramoliya05@gmail.com?subject=${encodedSubject}&body=${encodedBody}`;

      // Open email client
      window.location.href = mailtoUrl;

      showToast('Opening your email client to send message...');
      contactForm.reset();
    });
  }
});
