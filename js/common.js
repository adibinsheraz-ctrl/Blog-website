// Common JavaScript functionality shared across all pages

// Global variables
let isAdminLoggedIn = false

// Initialize common functionality
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeLoadingScreen()
  checkAdminStatus()
  initializeNotifications()
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
  const password = document.getElementById("admin-password").value

  if (password === "admin123") {
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
    showNotification("Invalid password. Please try again.", "error")
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

// Notification system
function initializeNotifications() {
  // Add notification styles if not already present
  if (!document.getElementById("notification-styles")) {
    const notificationStyles = document.createElement("style")
    notificationStyles.id = "notification-styles"
    notificationStyles.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `
    document.head.appendChild(notificationStyles)
  }
}

function showNotification(message, type = "success", duration = 5000) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  const icon =
    type === "success"
      ? "check-circle"
      : type === "error"
        ? "exclamation-circle"
        : type === "warning"
          ? "exclamation-triangle"
          : "info-circle"

  notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `

  document.body.appendChild(notification)

  // Auto remove notification
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, duration)

  // Click to dismiss
  notification.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  })
}

// Local Storage Management for Blog Posts
class BlogStorage {
  static getAllPosts() {
    const posts = localStorage.getItem("blogPosts")
    return posts ? JSON.parse(posts) : []
  }

  static savePosts(posts) {
    localStorage.setItem("blogPosts", JSON.stringify(posts))
  }

  static addPost(post) {
    const posts = this.getAllPosts()
    post.id = Date.now()
    post.createdAt = new Date().toISOString()
    post.status = "pending"
    posts.push(post)
    this.savePosts(posts)
    return post
  }

  static updatePost(id, updates) {
    const posts = this.getAllPosts()
    const index = posts.findIndex((post) => post.id === id)
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates }
      this.savePosts(posts)
      return posts[index]
    }
    return null
  }

  static deletePost(id) {
    const posts = this.getAllPosts()
    const filteredPosts = posts.filter((post) => post.id !== id)
    this.savePosts(filteredPosts)
  }

  static getPostsByStatus(status) {
    const posts = this.getAllPosts()
    return status ? posts.filter((post) => post.status === status) : posts
  }

  static approvePost(id) {
    return this.updatePost(id, {
      status: "approved",
      approvedAt: new Date().toISOString(),
    })
  }

  static rejectPost(id, reason = "") {
    return this.updatePost(id, {
      status: "rejected",
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
    })
  }
}

// Initialize sample data if none exists
function initializeSampleData() {
  const existingPosts = BlogStorage.getAllPosts()
  if (existingPosts.length === 0) {
    const samplePosts = [
      {
        id: 1,
        title: "Traditional Rajma of Bhaderwah",
        author: "Priya Sharma",
        category: "main-course",
        ingredients:
          "2 cups Bhaderwah Rajma (kidney beans), soaked overnight\n2 large onions, finely chopped\n4-5 tomatoes, pureed\n1 tbsp ginger-garlic paste\n2 tsp red chili powder\n1 tsp turmeric powder\n2 tsp coriander powder\n1 tsp garam masala\nSalt to taste\n3 tbsp mustard oil\nFresh coriander for garnish",
        instructions:
          "1. Pressure cook the soaked rajma with salt and turmeric until soft and tender.\n2. Heat mustard oil in a heavy-bottomed pan and add chopped onions.\n3. Cook until golden brown, then add ginger-garlic paste.\n4. Add tomato puree and cook until oil separates.\n5. Add all the spices and cook for 2-3 minutes.\n6. Add the cooked rajma along with its water.\n7. Simmer for 20-25 minutes until the gravy thickens.\n8. Garnish with fresh coriander and serve hot with rice.",
        story:
          "This recipe has been passed down in our family for generations. The secret to authentic Bhaderwah Rajma lies in using the local variety of kidney beans and cooking it slowly in mustard oil.",
        tips: "The dish tastes even better the next day! Always use mustard oil for authentic flavor.",
        prepTime: "30 minutes",
        cookTime: "45 minutes",
        servings: "4-6 people",
        email: "priya@example.com",
        status: "approved",
        createdAt: "2024-01-15T10:00:00Z",
        approvedAt: "2024-01-15T12:00:00Z",
        images: ["/placeholder.svg?height=200&width=350"],
      },
      {
        id: 2,
        title: "Ambal - The Traditional Pumpkin Curry",
        author: "Rajesh Kumar",
        category: "main-course",
        ingredients:
          "1 kg pumpkin, cut into cubes\n2 onions, sliced\n1 tbsp ginger-garlic paste\n2 tsp red chili powder\n1 tsp turmeric powder\n2 tsp coriander powder\n1 tsp fennel powder\n1 cup yogurt\n3 tbsp mustard oil\nSalt to taste\nFresh mint leaves",
        instructions:
          "1. Heat mustard oil and fry pumpkin pieces until lightly golden.\n2. Remove and set aside.\n3. In the same oil, cook onions until brown.\n4. Add ginger-garlic paste and spices.\n5. Add beaten yogurt gradually while stirring.\n6. Return pumpkin to the pan and mix gently.\n7. Cover and cook on low heat for 15-20 minutes.\n8. Garnish with fresh mint and serve.",
        story:
          "Ambal represents the essence of Dogra cuisine - simple ingredients transformed into something extraordinary through traditional cooking techniques.",
        tips: "Don't overcook the pumpkin to maintain its texture. The yogurt should be at room temperature to prevent curdling.",
        prepTime: "20 minutes",
        cookTime: "30 minutes",
        servings: "4-5 people",
        email: "rajesh@example.com",
        status: "approved",
        createdAt: "2024-01-12T09:00:00Z",
        approvedAt: "2024-01-12T11:00:00Z",
        images: ["/placeholder.svg?height=200&width=350"],
      },
      {
        id: 3,
        title: "Kalaadi - The Hill Cheese Delight",
        author: "Meera Devi",
        category: "appetizers",
        ingredients:
          "500g fresh Kalaadi cheese\n2 onions, sliced\n3-4 green chilies\n1 tsp red chili powder\n1/2 tsp turmeric powder\nSalt to taste\n2 tbsp mustard oil\nFresh coriander leaves",
        instructions:
          "1. Cut kalaadi into thick slices\n2. Heat mustard oil in a pan\n3. Fry kalaadi slices until golden\n4. Add sliced onions and green chilies\n5. Season with salt and red chili powder\n6. Cook until onions are translucent\n7. Garnish with coriander and serve hot",
        story:
          "Kalaadi is more than just cheese; it's a testament to the ingenuity of hill people who created this nutritious and delicious food from simple cow's milk.",
        tips: "Don't overcook the kalaadi as it can become rubbery. Fresh kalaadi works best for this recipe.",
        prepTime: "10 minutes",
        cookTime: "15 minutes",
        servings: "3-4 people",
        email: "meera@example.com",
        status: "pending",
        createdAt: "2024-01-20T14:00:00Z",
        images: ["/placeholder.svg?height=200&width=350"],
      },
    ]

    samplePosts.forEach((post) => {
      BlogStorage.savePosts([...BlogStorage.getAllPosts(), post])
    })
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

// Initialize sample data when the script loads
initializeSampleData()

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
