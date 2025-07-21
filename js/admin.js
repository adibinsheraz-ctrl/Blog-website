// Admin panel specific functionality

let currentTab = "pending"
let allPosts = []
let notificationUpdateInterval = null

document.addEventListener("DOMContentLoaded", () => {
  // Check admin authentication
  const isAdminLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
  if (!isAdminLoggedIn) {
    window.location.href = "index.html"
    return
  }

  initializeAdminPanel()
  loadPosts()
  initializeModals()
  initializeNotificationCenter()
  setupRealTimeUpdates()
  
  // Check for specific post in URL
  const urlParams = new URLSearchParams(window.location.search)
  const postId = urlParams.get('post')
  if (postId) {
    setTimeout(() => viewPost(parseInt(postId)), 1000)
  }
})

// Initialize admin panel
function initializeAdminPanel() {
  updateStats()
  initializeTabs()
}

function initializeTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const tab = e.target.textContent.toLowerCase().split(" ")[0]
      showTab(tab)
    })
  })
}

function showTab(tab) {
  currentTab = tab

  // Update active tab
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  const activeBtn = Array.from(document.querySelectorAll(".tab-btn")).find((btn) =>
    btn.textContent.toLowerCase().includes(tab),
  )
  if (activeBtn) {
    activeBtn.classList.add("active")
  }

  // Update title
  const titles = {
    pending: "Pending Approval",
    approved: "Approved Posts",
    rejected: "Rejected Posts",
    all: "All Posts",
  }

  const titleElement = document.getElementById("current-tab-title")
  if (titleElement) {
    titleElement.textContent = titles[tab] || "Posts"
  }

  // Show/hide approve all button
  const approveAllBtn = document.querySelector(".approve-all")
  if (approveAllBtn) {
    approveAllBtn.style.display = tab === "pending" ? "inline-flex" : "none"
  }

  displayPosts()
}

// Load and display posts
function loadPosts() {
  if (!window.dataManager) {
    console.error('Data manager not available')
    return
  }
  
  allPosts = window.dataManager.getPosts()
  displayPosts()
  updateStats()
  updateTabCounts()
}

function displayPosts() {
  const postsContainer = document.getElementById("posts-container")
  const noPostsElement = document.getElementById("no-posts")

  if (!postsContainer) return

  let postsToShow = []

  switch (currentTab) {
    case "pending":
      postsToShow = allPosts.filter((post) => post.status === "pending")
      break
    case "approved":
      postsToShow = allPosts.filter((post) => post.status === "approved")
      break
    case "rejected":
      postsToShow = allPosts.filter((post) => post.status === "rejected")
      break
    case "all":
    default:
      postsToShow = allPosts
      break
  }

  postsContainer.innerHTML = ""

  if (postsToShow.length === 0) {
    noPostsElement.style.display = "block"
    return
  }

  noPostsElement.style.display = "none"

  // Sort posts by creation date (newest first)
  postsToShow.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  postsToShow.forEach((post) => {
    const postElement = createPostElement(post)
    postsContainer.appendChild(postElement)
  })
}

function createPostElement(post) {
  const postDiv = document.createElement("div")
  postDiv.className = "post-item"

  const excerpt = generateExcerpt(post.instructions || post.story || "No description available", 100)

  postDiv.innerHTML = `
        <div class="post-header">
            <div class="post-info">
                <h3>${post.title}</h3>
                <div class="post-meta">
                    <span><i class="fas fa-user"></i> ${post.author || "Anonymous"}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.createdAt)}</span>
                    <span><i class="fas fa-tag"></i> ${formatCategory(post.category)}</span>
                    ${post.email ? `<span><i class="fas fa-envelope"></i> ${post.email}</span>` : ""}
                </div>
            </div>
            <div class="post-status ${post.status}">${post.status.toUpperCase()}</div>
        </div>
        
        <p class="post-excerpt">${excerpt}</p>
        
        <div class="post-actions">
            <button class="post-btn view" onclick="viewPost(${post.id})">
                <i class="fas fa-eye"></i> View Details
            </button>
            
            ${
              post.status === "pending"
                ? `
                <button class="post-btn approve" onclick="approvePost(${post.id})">
                    <i class="fas fa-check"></i> Approve
                </button>
                <button class="post-btn reject" onclick="showRejectModal(${post.id})">
                    <i class="fas fa-times"></i> Reject
                </button>
            `
                : ""
            }
            
            ${
              post.status === "approved"
                ? `
                <button class="post-btn edit" onclick="editPost(${post.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
            `
                : ""
            }
            
            ${
              post.status === "rejected"
                ? `
                <button class="post-btn approve" onclick="approvePost(${post.id})">
                    <i class="fas fa-redo"></i> Re-approve
                </button>
            `
                : ""
            }
        </div>
        
        ${
          post.status === "rejected" && post.rejectionReason
            ? `
            <div class="rejection-reason" style="margin-top: 1rem; padding: 1rem; background: rgba(231, 76, 60, 0.1); border-left: 4px solid var(--danger-color); border-radius: 4px;">
                <strong>Rejection Reason:</strong> ${post.rejectionReason}
            </div>
        `
            : ""
        }
    `

  return postDiv
}

// Post actions
function viewPost(postId) {
  const post = allPosts.find((p) => p.id === postId)
  if (!post) return

  const modal = document.getElementById("post-modal")
  const modalBody = document.getElementById("post-modal-body")
  const modalActions = document.getElementById("post-modal-actions")

  if (!modal || !modalBody) return

  modalBody.innerHTML = generatePostDetailHTML(post)

  // Update modal actions based on post status
  modalActions.innerHTML = ""

  if (post.status === "pending") {
    modalActions.innerHTML = `
            <button class="post-btn approve" onclick="approvePost(${post.id}); closePostModal();">
                <i class="fas fa-check"></i> Approve
            </button>
            <button class="post-btn reject" onclick="closePostModal(); showRejectModal(${post.id});">
                <i class="fas fa-times"></i> Reject
            </button>
        `
  } else if (post.status === "rejected") {
    modalActions.innerHTML = `
            <button class="post-btn approve" onclick="approvePost(${post.id}); closePostModal();">
                <i class="fas fa-redo"></i> Re-approve
            </button>
        `
  }

  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function generatePostDetailHTML(post) {
  const images =
    post.images && post.images.length > 0
      ? post.images
          .map(
            (img) =>
              `<img src="${img}" alt="${post.title}" style="max-width: 100%; margin: 1rem 0; border-radius: 8px;">`,
          )
          .join("")
      : '<p style="color: var(--text-muted); font-style: italic;">No images uploaded</p>'

  return `
        <div class="post-detail">
            <div class="post-header" style="margin-bottom: 2rem;">
                <h2 style="color: var(--primary-color); margin-bottom: 1rem;">${post.title}</h2>
                <div class="post-meta" style="display: flex; gap: 1rem; flex-wrap: wrap; color: var(--text-light); font-size: 0.9rem;">
                    <span><i class="fas fa-user"></i> ${post.author || "Anonymous"}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.createdAt)}</span>
                    <span><i class="fas fa-tag"></i> ${formatCategory(post.category)}</span>
                    <span class="post-status ${post.status}"><i class="fas fa-circle"></i> ${post.status.toUpperCase()}</span>
                </div>
                
                ${
                  post.prepTime || post.cookTime || post.servings
                    ? `
                    <div class="recipe-info" style="margin-top: 1rem; display: flex; gap: 1rem; flex-wrap: wrap; color: var(--text-light); font-size: 0.9rem;">
                        ${post.prepTime ? `<span><i class="fas fa-clock"></i> Prep: ${post.prepTime}</span>` : ""}
                        ${post.cookTime ? `<span><i class="fas fa-fire"></i> Cook: ${post.cookTime}</span>` : ""}
                        ${post.servings ? `<span><i class="fas fa-users"></i> Serves: ${post.servings}</span>` : ""}
                    </div>
                `
                    : ""
                }
                
                ${
                  post.email || post.phone
                    ? `
                    <div class="contact-info" style="margin-top: 1rem; padding: 1rem; background: var(--bg-light); border-radius: 8px;">
                        <h4 style="margin-bottom: 0.5rem; color: var(--text-dark);">Contact Information:</h4>
                        ${post.email ? `<p><i class="fas fa-envelope"></i> ${post.email}</p>` : ""}
                        ${post.phone ? `<p><i class="fas fa-phone"></i> ${post.phone}</p>` : ""}
                    </div>
                `
                    : ""
                }
            </div>
            
            <div class="post-images" style="margin: 2rem 0;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-images"></i> Images</h3>
                ${images}
            </div>
            
            ${
              post.story
                ? `
                <div class="post-section" style="margin: 2rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-heart"></i> Story</h3>
                    <p style="line-height: 1.6; color: var(--text-dark);">${post.story}</p>
                </div>
            `
                : ""
            }
            
            <div class="post-section" style="margin: 2rem 0;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-list"></i> Ingredients</h3>
                <div style="margin-left: 1rem;">
                    ${
                      post.ingredients
                        ? post.ingredients
                            .split("\n")
                            .map(
                              (ingredient) =>
                                `<div style="margin: 0.5rem 0; color: var(--text-dark);">• ${ingredient}</div>`,
                            )
                            .join("")
                        : "<p>No ingredients listed</p>"
                    }
                </div>
            </div>
            
            <div class="post-section" style="margin: 2rem 0;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-utensils"></i> Instructions</h3>
                <div>
                    ${
                      post.instructions
                        ? post.instructions
                            .split("\n")
                            .map(
                              (instruction, index) =>
                                `<div style="display: flex; margin: 1rem 0; align-items: flex-start; gap: 1rem;">
                            <span style="background: var(--primary-color); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${index + 1}</span>
                            <span style="flex: 1; color: var(--text-dark);">${instruction}</span>
                        </div>`,
                            )
                            .join("")
                        : "<p>No instructions provided</p>"
                    }
                </div>
            </div>
            
            ${
              post.tips
                ? `
                <div class="post-section" style="margin: 2rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-lightbulb"></i> Tips</h3>
                    <div>
                        ${post.tips
                          .split("\n")
                          .map((tip) => `<p style="margin: 0.5rem 0; color: var(--text-dark);">💡 ${tip}</p>`)
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }
            
            ${
              post.status === "rejected" && post.rejectionReason
                ? `
                <div class="rejection-info" style="margin: 2rem 0; padding: 1rem; background: rgba(231, 76, 60, 0.1); border-left: 4px solid var(--danger-color); border-radius: 4px;">
                    <h4 style="color: var(--danger-color); margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Rejection Reason</h4>
                    <p style="color: var(--text-dark);">${post.rejectionReason}</p>
                    <small style="color: var(--text-muted);">Rejected on: ${formatDate(post.rejectedAt)}</small>
                </div>
            `
                : ""
            }
        </div>
    `
}

function approvePost(postId) {
  if (!window.dataManager) return
  
  const post = window.dataManager.approvePost(postId)
  if (post) {
    if (window.notificationSystem) {
      window.notificationSystem.success(`"${post.title}" has been approved and published!`)
    }
    loadPosts()
  }
}

function showRejectModal(postId) {
  const modal = document.getElementById("rejection-modal")
  const form = document.getElementById("rejection-form")

  if (modal && form) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"

    form.onsubmit = (e) => {
      e.preventDefault()
      const reason = document.getElementById("rejection-reason").value.trim()
      if (reason) {
        rejectPost(postId, reason)
        closeRejectionModal()
      } else {
        showNotification("Please provide a reason for rejection", "error")
      }
    }
  }
}

function rejectPost(postId, reason) {
  if (!window.dataManager) return
  
  const post = window.dataManager.rejectPost(postId, reason)
  if (post) {
    if (window.notificationSystem) {
      window.notificationSystem.warning(`"${post.title}" has been rejected.`)
    }
    loadPosts()
  }
}

function editPost(postId) {
  // In a real application, this would open an edit form
  showNotification("Edit functionality would be implemented here", "info")
}

function approveAll() {
  const pendingPosts = allPosts.filter((post) => post.status === "pending")

  if (pendingPosts.length === 0) {
    if (window.notificationSystem) {
      window.notificationSystem.info("No pending posts to approve")
    }
    return
  }

  if (confirm(`Are you sure you want to approve all ${pendingPosts.length} pending posts?`)) {
    pendingPosts.forEach((post) => {
      window.dataManager.approvePost(post.id)
    })

    if (window.notificationSystem) {
      window.notificationSystem.success(`${pendingPosts.length} posts have been approved!`)
    }
    loadPosts()
  }
}

function refreshPosts() {
  loadPosts()
  if (window.notificationSystem) {
    window.notificationSystem.success("Posts refreshed", { duration: 2000 })
  }
}

// Notification Center
function initializeNotificationCenter() {
  createNotificationBadge()
  loadNotifications()
}

function createNotificationBadge() {
  const adminNav = document.querySelector('.admin-nav')
  if (adminNav && !document.querySelector('.admin-notification-badge')) {
    const badge = document.createElement('span')
    badge.className = 'admin-notification-badge'
    badge.style.cssText = `
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--danger-color);
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 12px;
      display: none;
      align-items: center;
      justify-content: center;
      font-weight: bold;
    `
    adminNav.style.position = 'relative'
    adminNav.appendChild(badge)
  }
}

function loadNotifications() {
  if (!window.dataManager) return
  
  const unreadNotifications = window.dataManager.getNotifications(true)
  updateNotificationBadge(unreadNotifications.length)
}

function updateNotificationBadge(count) {
  const badge = document.querySelector('.admin-notification-badge')
  if (badge) {
    if (count > 0) {
      badge.textContent = count > 99 ? '99+' : count
      badge.style.display = 'flex'
    } else {
      badge.style.display = 'none'
    }
  }
}

// Real-time updates
function setupRealTimeUpdates() {
  if (window.dataManager) {
    window.dataManager.addEventListener('dataChanged', () => {
      loadPosts()
      loadNotifications()
    })
    
    window.dataManager.addEventListener('newNotification', (notification) => {
      loadNotifications()
      
      // Show toast notification for new recipes
      if (notification.type === 'new_recipe' && window.notificationSystem) {
        window.notificationSystem.info(notification.message, {
          title: notification.title,
          action: () => viewPost(notification.postId),
          actionText: 'Review',
          persistent: true
        })
      }
    })
  }
  
  // Auto-refresh every 30 seconds
  notificationUpdateInterval = setInterval(() => {
    loadNotifications()
  }, 30000)
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (notificationUpdateInterval) {
    clearInterval(notificationUpdateInterval)
  }
}
)

// Modal functions
function initializeModals() {
  // Post modal
  const postModal = document.getElementById("post-modal")
  const postCloseBtn = postModal?.querySelector(".close")

  if (postCloseBtn) {
    postCloseBtn.addEventListener("click", closePostModal)
  }

  if (postModal) {
    postModal.addEventListener("click", (e) => {
      if (e.target === postModal) {
        closePostModal()
      }
    })
  }

  // Rejection modal
  const rejectionModal = document.getElementById("rejection-modal")
  const rejectionCloseBtn = rejectionModal?.querySelector(".close")

  if (rejectionCloseBtn) {
    rejectionCloseBtn.addEventListener("click", closeRejectionModal)
  }

  if (rejectionModal) {
    rejectionModal.addEventListener("click", (e) => {
      if (e.target === rejectionModal) {
        closeRejectionModal()
      }
    })
  }
}

function closePostModal() {
  const modal = document.getElementById("post-modal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

function closeRejectionModal() {
  const modal = document.getElementById("rejection-modal")
  const form = document.getElementById("rejection-form")

  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }

  if (form) {
    form.reset()
  }
}

// Statistics
function updateStats() {
  const approvedCount = document.getElementById("approved-count")
  const pendingCount = document.getElementById("pending-count")
  const rejectedCount = document.getElementById("rejected-count")
  const totalCount = document.getElementById("total-count")

  const approved = allPosts.filter((post) => post.status === "approved").length
  const pending = allPosts.filter((post) => post.status === "pending").length
  const rejected = allPosts.filter((post) => post.status === "rejected").length
  const total = allPosts.length

  if (approvedCount) animateCounter(approvedCount, approved)
  if (pendingCount) animateCounter(pendingCount, pending)
  if (rejectedCount) animateCounter(rejectedCount, rejected)
  if (totalCount) animateCounter(totalCount, total)
}

function updateTabCounts() {
  const pendingTabCount = document.getElementById("pending-tab-count")
  const approvedTabCount = document.getElementById("approved-tab-count")
  const rejectedTabCount = document.getElementById("rejected-tab-count")
  const allTabCount = document.getElementById("all-tab-count")

  const approved = allPosts.filter((post) => post.status === "approved").length
  const pending = allPosts.filter((post) => post.status === "pending").length
  const rejected = allPosts.filter((post) => post.status === "rejected").length
  const total = allPosts.length

  if (pendingTabCount) pendingTabCount.textContent = pending
  if (approvedTabCount) approvedTabCount.textContent = approved
  if (rejectedTabCount) rejectedTabCount.textContent = rejected
  if (allTabCount) allTabCount.textContent = total
}

function animateCounter(element, target) {
  let current = 0
  const increment = Math.max(1, Math.ceil(target / 20))
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = current
  }, 30)
}

// Utility functions
function generateExcerpt(text, maxLength) {
  if (!text) return 'No content available'
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + "..."
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(date).toLocaleDateString(undefined, options)
}

function formatCategory(category) {
  if (!category) return 'General'
  return category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
}

// Make functions globally available
window.showTab = showTab
window.viewPost = viewPost
window.approvePost = approvePost
window.showRejectModal = showRejectModal
window.editPost = editPost
window.approveAll = approveAll
window.refreshPosts = refreshPosts
window.closePostModal = closePostModal
window.closeRejectionModal = closeRejectionModal
