// Common JavaScript functionality shared across all pages

// Global variables
let isAdminLoggedIn = false

// Initialize common functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeLoadingScreen()
  checkAdminStatus()
  initializeRealTimeUpdates()
})

// Navigation functionality
function initializeNavigation() {
  const hamburger = document.getElementById("hamburger")
  const navMenu = document.getElementById("nav-menu")

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active")
      navMenu.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active")
        navMenu.classList.remove("active")
      })
    })
  }

  // Update navbar background on scroll
  window.addEventListener("scroll", () => {
    const navbar = document.getElementById("navbar")
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)"
        navbar.style.backdropFilter = "blur(15px)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)"
        navbar.style.backdropFilter = "blur(10px)"
      }
    }
  })
}

// Loading screen
function initializeLoadingScreen() {
  const loadingScreen = document.getElementById("loading-screen")
  if (loadingScreen) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        loadingScreen.style.opacity = "0"
        setTimeout(() => {
          loadingScreen.style.display = "none"
        }, 500)
      }, 1000)
    })
  }
}

// Admin status check
function checkAdminStatus() {
  isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
  const adminLink = document.querySelector(".admin-link")

  if (adminLink) {
    adminLink.style.display = isAdminLoggedIn ? "block" : "none"
  }

  // Check if current page is admin and user is not logged in
  if (window.location.pathname.includes("admin.html") && !isAdminLoggedIn) {
    showAdminModal()
  }
}

// Admin modal functionality
function showAdminModal() {
  const adminModal = document.getElementById("admin-modal")
  if (adminModal) {
    adminModal.style.display = "block"

    const adminForm = document.getElementById("admin-login-form")
    if (adminForm) {
      adminForm.addEventListener("submit", handleAdminLogin)
    }
  }
}

function closeAdminModal() {
  const adminModal = document.getElementById("admin-modal")
  if (adminModal) {
    adminModal.style.display = "none"
  }
}

function handleAdminLogin(e) {
  e.preventDefault()
  const username = document.getElementById("admin-username").value
  const password = document.getElementById("admin-password").value

  if (username === "Rakesh@11" && password === "Duggarswad@xll") {
    localStorage.setItem("adminLoggedIn", "true")
    isAdminLoggedIn = true
    closeAdminModal()
    showNotification("Welcome to Admin Panel!", "success")

    // Show admin link in navigation
    const adminLink = document.querySelector(".admin-link")
    if (adminLink) {
      adminLink.style.display = "block"
    }

    // Reload page if on admin page
    if (window.location.pathname.includes("admin.html")) {
      window.location.reload()
    }
  } else {
    showNotification("Invalid username or password. Please try again.", "error")
  }
}

function logout() {
  localStorage.removeItem("adminLoggedIn")
  isAdminLoggedIn = false

  // Hide admin link
  const adminLink = document.querySelector(".admin-link")
  if (adminLink) {
    adminLink.style.display = "none"
  }

  showNotification("Logged out successfully", "success")

  // Redirect to home if on admin page
  if (window.location.pathname.includes("admin.html")) {
    window.location.href = "index.html"
  }
}

// Real-time updates system
function initializeRealTimeUpdates() {
  // Listen for data changes
  if (window.dataManager) {
    window.dataManager.addEventListener('dataChanged', handleDataUpdate);
    
    // Check for admin notifications
    if (isAdminLoggedIn) {
      checkAdminNotifications();
      setInterval(checkAdminNotifications, 30000); // Check every 30 seconds
    }
  }
}

function handleDataUpdate(data) {
  // Refresh current page data if needed
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    if (window.loadBlogPosts) {
      window.loadBlogPosts();
    }
  } else if (window.location.pathname.includes('admin.html')) {
    if (window.loadPosts) {
      window.loadPosts();
    }
  }
}

function checkAdminNotifications() {
  if (!window.dataManager || !isAdminLoggedIn) return;
  
  const unreadNotifications = window.dataManager.getNotifications(true);
  
  // Update admin notification badge
  const badge = document.querySelector('.admin-notification-badge');
  if (badge) {
    if (unreadNotifications.length > 0) {
      badge.textContent = unreadNotifications.length;
      badge.style.display = 'block';
    } else {
      badge.style.display = 'none';
    }
  }
}

function showNotification(message, type = "success", duration = 5000) {
  if (window.notificationSystem) {
    return window.notificationSystem.showNotification(message, type, { duration });
  } else {
    // Fallback to alert if notification system not loaded
    alert(message);
  }
}

// Local Storage Management for Blog Posts
class BlogStorage {
  static getAllPosts() {
    return window.dataManager ? window.dataManager.getPosts() : [];
  }

  static savePosts(posts) {
    // This method is deprecated - use dataManager directly
    console.warn('BlogStorage.savePosts is deprecated. Use dataManager.saveData instead.');
  }

  static addPost(post) {
    return window.dataManager ? window.dataManager.addPost(post) : null;
  }

  static updatePost(id, updates) {
    return window.dataManager ? window.dataManager.updatePost(id, updates) : null;
  }

  static deletePost(id) {
    return window.dataManager ? window.dataManager.deletePost(id) : false;
  }

  static getPostsByStatus(status) {
    return window.dataManager ? window.dataManager.getPosts(status) : [];
  }

  static approvePost(id) {
    return window.dataManager ? window.dataManager.approvePost(id) : null;
  }

  static rejectPost(id, reason = "") {
    return window.dataManager ? window.dataManager.rejectPost(id, reason) : null;
  }
}

// Utility functions
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

function formatDateShort(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

function generateExcerpt(content, maxLength = 150) {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, "")
  return truncateText(plainText, maxLength)
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Export functions for use in other scripts
window.BlogStorage = BlogStorage
window.showNotification = showNotification
window.formatDate = formatDate
window.formatDateShort = formatDateShort
window.truncateText = truncateText
window.generateExcerpt = generateExcerpt
window.scrollToTop = scrollToTop
window.scrollToSection = scrollToSection
window.logout = logout
window.closeAdminModal = closeAdminModal
document.addEventListener("DOMContentLoaded", function() {
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});