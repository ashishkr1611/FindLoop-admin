// FindLoop Utility Functions Module

// Generate random Item Code e.g. FL-8X92K
export function generateItemCode() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `FL-${code}`;
}

// Generate cryptographically random QR token
export function generateQRToken() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < 24; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `tok_${token}`;
}

// Generate 6-digit collection verification code
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Format ISO date string
export function formatDate(dateString) {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return dateString || "N/A";
  }
}

// Parse URL Search Parameters e.g. ?id=item_123 or ?token=FL-8X92K
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Toast Notification Launcher
export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span style="color: ${type === 'error' ? '#E11D48' : '#14B8A6'}">●</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Status Badge Markup Helper (Upgraded Visual Icons & Glow Effects)
export function getStatusBadgeHTML(status) {
  switch (status) {
    case "SAFE":
    case "PROTECTED":
      return `<span class="badge" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.4); box-shadow: 0 0 10px rgba(16, 185, 129, 0.2); font-weight: 800;"><span class="pulse-dot" style="background: #10B981; width: 7px; height: 7px; margin-right: 4px;"></span> 🟢 PROTECTED</span>`;
    case "LOST":
      return `<span class="badge badge-lost" style="font-weight: 800;"><span class="badge-dot"></span> 🔴 LOST</span>`;
    case "FOUND":
    case "REPORTED":
      return `<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #F59E0B; border: 1px solid rgba(245, 158, 11, 0.4); font-weight: 800;"><span class="pulse-dot" style="background: #F59E0B; width: 7px; height: 7px; margin-right: 4px;"></span> 🟡 REPORTED FOUND</span>`;
    case "RETURNED":
      return `<span class="badge" style="background: rgba(20, 184, 166, 0.15); color: #14B8A6; border: 1px solid rgba(20, 184, 166, 0.4); font-weight: 800;"><span class="badge-dot" style="background: #14B8A6; margin-right: 4px;"></span> 🔵 RETURNED</span>`;
    default:
      return `<span class="badge" style="font-weight: 800;"><span class="badge-dot"></span>${status}</span>`;
  }
}

// Time-based Greeting Helper (Good morning / afternoon / evening)
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  return "Good evening";
}

// Universal Mobile Menu Accessibility Handler
export function initMobileMenu() {
  const btn = document.getElementById("hamburger-btn");
  const menu = document.getElementById("mobile-menu-overlay") || document.querySelector(".nav-links");
  if (!btn || !menu) return;

  function toggleMenu(open) {
    const isExpanded = open !== undefined ? open : btn.getAttribute("aria-expanded") !== "true";
    btn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
    menu.classList.toggle("is-active", isExpanded);
    document.body.classList.toggle("mobile-menu-open", isExpanded);
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (btn.getAttribute("aria-expanded") === "true" && !menu.contains(e.target) && !btn.contains(e.target)) {
      toggleMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") {
      toggleMenu(false);
    }
  });
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }
}
