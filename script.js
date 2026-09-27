// State
let isDarkTheme = true;
let isRTL = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Check local storage for preferences
  if (localStorage.getItem('theme') === 'light') toggleTheme(false);
  if (localStorage.getItem('rtl') === 'true') toggleRTL(false);
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    const header = document.getElementById('siteHeader');
    if (header) {
      if (window.scrollY > 10) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  });

  // Animate numbers
  initCounters();
});

// Theme Toggle (Dark/Light)
function toggleTheme(save = true) {
  isDarkTheme = !isDarkTheme;
  const html = document.documentElement;
  const icon = document.getElementById('themeIcon');
  
  if (isDarkTheme) {
    html.setAttribute('data-theme', 'dark');
    if (icon) icon.innerHTML = '<i data-lucide="sun"></i>'; if(window.lucide) lucide.createIcons();
    if(save) localStorage.setItem('theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
    if (icon) icon.innerHTML = '<i data-lucide="moon"></i>'; if(window.lucide) lucide.createIcons();
    if(save) localStorage.setItem('theme', 'light');
  }
}

// RTL/LTR Toggle
function toggleRTL(save = true) {
  isRTL = !isRTL;
  const html = document.documentElement;
  const label = document.getElementById('rtlLabel');
  
  if (isRTL) {
    html.setAttribute('dir', 'rtl');
    if (label) label.textContent = 'RTL'; // Shows RTL when in RTL mode
    if(save) localStorage.setItem('rtl', 'true');
  } else {
    html.setAttribute('dir', 'ltr');
    if (label) label.textContent = 'LTR'; // Shows LTR when in LTR mode
    if(save) localStorage.setItem('rtl', 'false');
  }
}

// Mobile Menu
function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  if (!menu) return;
  if (menu.style.display === 'flex') {
    menu.style.display = 'none';
  } else {
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    menu.style.position = 'absolute';
    menu.style.top = '72px';
    menu.style.left = '0';
    menu.style.right = '0';
    menu.style.background = 'var(--header-bg)';
    menu.style.padding = '1rem';
    menu.style.borderBottom = '1px solid var(--border)';
  }
}

// Dashboard Panels (Inside dashboard views)
function showPanel(panelId) {
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  
  document.getElementById(`panel-${panelId}`)?.classList.add('active');
  document.getElementById(`sl-${panelId}`)?.classList.add('active');
}

function showAdminPanel(panelId) {
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  
  const targetId = panelId.startsWith('admin-') ? panelId : `admin-${panelId}`;
  document.getElementById(`panel-${targetId}`)?.classList.add('active');
  
  const linkId = targetId.replace('admin-', 'asl-');
  document.getElementById(linkId)?.classList.add('active');
}

// Login Tabs
function switchLoginTab(tab) {
  document.querySelectorAll('.login-tab').forEach(t => t.classList.remove('active'));
  if (tab === 'client') {
    document.getElementById('tabClient').classList.add('active');
  } else {
    document.getElementById('tabAdmin').classList.add('active');
  }
}

function doLogin() {
  const isClient = document.getElementById('tabClient').classList.contains('active');
  showToast('Logging in...');
  setTimeout(() => {
    if (isClient) window.location.href = 'user-dash.html';
    else window.location.href = 'admin-dash.html';
  }, 1000);
}

// Forms
function submitContact() {
  showToast('Message sent successfully!');
  document.getElementById('ctMessage').value = '';
}

function submitEmergency() {
  showToast('🚨 Emergency request dispatched! A technician will call you shortly.', true);
  document.getElementById('emgDesc').value = '';
}

function submitSchedule() {
  showToast('✅ Appointment scheduled successfully!');
  setTimeout(() => {
    showPanel('overview');
  }, 1500);
}

// Toast
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const icon = document.getElementById('toastIcon');
  const text = document.getElementById('toastMsg');
  
  text.textContent = msg;
  icon.textContent = isError ? '<i data-lucide="alert-triangle"></i>' : '✅';
  
  if (isError) {
    toast.style.background = 'linear-gradient(135deg, #ef4444, #b91c1c)';
  } else {
    toast.style.background = 'linear-gradient(135deg, var(--brand-orange), var(--brand-orange-lt))';
  }
  
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(100px)';
  }, 3500);
}

// Number Animation
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (counters.length === 0) return;
  
  const speed = 200;

  const animate = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-count');
      const count = +counter.innerText.replace(/,/g, '').replace(/%/g, '');
      const inc = target / speed;

      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(animate, 10);
      } else {
        counter.innerText = target.toLocaleString();
        if (target === 98) counter.innerText += '%';
      }
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) observer.observe(statsBar);
}
