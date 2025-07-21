// Home page specific functionality

let currentPage = 1
const postsPerPage = 6
let allPosts = []
let filteredPosts = []
let currentFilter = ""
let currentSearch = ""

// Initialize home page
document.addEventListener("DOMContentLoaded", () => {
  loadrecipePosts()
  initializeSearch()
  initializeFilters()
  initializeModal()
  initializeStats()
  initializeNewsletterForm()
  initializeScrollAnimations()
  setupRealTimeUpdates()
  initializeSlider()
})

// Load and display recipe posts
function loadrecipePosts() {
  if (!window.dataManager) {
    console.error('Data manager not available')
    return
  }
  
  allPosts = window.dataManager.getPosts("approved")
  filteredPosts = [...allPosts]
  displayPosts()
  updateStats()
}

function displayPosts() {
  const recipeGrid = document.getElementById("recipe-grid")
  const loadMoreBtn = document.getElementById("load-more-btn")
  const noResults = document.getElementById("no-results")

  if (!recipeGrid) return

  // Clear existing posts
  recipeGrid.innerHTML = ""

  if (filteredPosts.length === 0) {
    noResults.style.display = "block"
    loadMoreBtn.style.display = "none"
    return
  }

  noResults.style.display = "none"

  // Calculate posts to show
  const startIndex = 0
  const endIndex = currentPage * postsPerPage
  const postsToShow = filteredPosts.slice(startIndex, endIndex)

  // Create recipe cards
  postsToShow.forEach((post, index) => {
    const recipeCard = createrecipeCard(post)
    recipeCard.style.animationDelay = `${(index % postsPerPage) * 0.1}s`
    recipeGrid.appendChild(recipeCard)
  })

  // Show/hide load more button
  if (endIndex >= filteredPosts.length) {
    loadMoreBtn.style.display = "none"
  } else {
    loadMoreBtn.style.display = "block"
  }
}

function createrecipeCard(post) {
  const card = document.createElement("div")
  card.className = "blog-card"

  const imageUrl = post.images && post.images.length > 0 ? post.images[0] : "/placeholder.svg?height=200&width=350"

  const excerpt = generateExcerpt(post.instructions || post.story || "Traditional recipe from Jammu", 120)

  card.innerHTML = `
        <img src="${imageUrl}" alt="${post.title}" class="blog-image" loading="lazy">
        <div class="blog-content">
            <h3 class="blog-title">${post.title}</h3>
            <div class="blog-meta">
                <span><i class="fas fa-user"></i> ${post.author || "Anonymous"}</span>
                <span><i class="fas fa-calendar"></i> ${formatDateShort(post.createdAt)}</span>
                <span><i class="fas fa-tag"></i> ${formatCategory(post.category)}</span>
            </div>
            <p class="blog-excerpt">${excerpt}</p>
            <a href="recipe.html?id=${post.id}" class="read-more">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `

  return card
}

function formatCategory(category) {
  if (!category) return "General"
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Search functionality
function initializeSearch() {
  const searchInput = document.getElementById("search-input")
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300))
  }
}

function handleSearch(e) {
  currentSearch = e.target.value.toLowerCase().trim()
  currentPage = 1
  filterPosts()
}

// Filter functionality
function initializeFilters() {
  const categoryFilter = document.getElementById("category-filter")
  if (categoryFilter) {
    categoryFilter.addEventListener("change", handleFilter)
  }

  // Load more button
  const loadMoreBtn = document.getElementById("load-more-btn")
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", loadMorePosts)
  }
}

function handleFilter(e) {
  currentFilter = e.target.value
  currentPage = 1
  filterPosts()
}

function filterByCategory(category) {
  const categoryFilter = document.getElementById("category-filter")
  if (categoryFilter) {
    categoryFilter.value = category
    currentFilter = category
    currentPage = 1
    filterPosts()
  }
}

function filterPosts() {
  filteredPosts = allPosts.filter((post) => {
    const matchesSearch =
      !currentSearch ||
      post.title.toLowerCase().includes(currentSearch) ||
      post.author.toLowerCase().includes(currentSearch) ||
      (post.ingredients && post.ingredients.toLowerCase().includes(currentSearch)) ||
      (post.instructions && post.instructions.toLowerCase().includes(currentSearch))

    const matchesCategory = !currentFilter || post.category === currentFilter

    return matchesSearch && matchesCategory
  })

  displayPosts()
}

function loadMorePosts() {
  currentPage++
  displayPosts()
}


function generatePostHTML(post) {
  const images =
    post.images && post.images.length > 0
      ? post.images
          .map(
            (img) =>
              `<img src="${img}" alt="${post.title}" style="max-width: 100%; margin: 1rem 0; border-radius: 8px;">`,
          )
          .join("")
      : ""

  return `
        <article class="recipe-post">
            <header class="post-header">
                <h1>${post.title}</h1>
                <div class="post-meta">
                    <span><i class="fas fa-user"></i> ${post.author || "Anonymous"}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(post.createdAt)}</span>
                    <span><i class="fas fa-tag"></i> ${formatCategory(post.category)}</span>
                    ${post.prepTime ? `<span><i class="fas fa-clock"></i> Prep: ${post.prepTime}</span>` : ""}
                    ${post.cookTime ? `<span><i class="fas fa-fire"></i> Cook: ${post.cookTime}</span>` : ""}
                    ${post.servings ? `<span><i class="fas fa-users"></i> Serves: ${post.servings}</span>` : ""}
                </div>
            </header>
            
            ${images}
            
            ${
              post.story
                ? `
                <section class="post-section">
                    <h3><i class="fas fa-heart"></i> The Story Behind This Recipe</h3>
                    <p>${post.story}</p>
                </section>
            `
                : ""
            }
            
            <section class="post-section">
                <h3><i class="fas fa-list"></i> Ingredients</h3>
                <div class="ingredients-list">
                    ${post.ingredients
                      .split("\n")
                      .map((ingredient) => `<div class="ingredient-item">• ${ingredient}</div>`)
                      .join("")}
                </div>
            </section>
            
            <section class="post-section">
                <h3><i class="fas fa-utensils"></i> Instructions</h3>
                <div class="instructions-list">
                    ${post.instructions
                      .split("\n")
                      .map(
                        (instruction, index) =>
                          `<div class="instruction-item">
                            <span class="step-number">${index + 1}</span>
                            <span class="step-text">${instruction}</span>
                        </div>`,
                      )
                      .join("")}
                </div>
            </section>
            
            ${
              post.tips
                ? `
                <section class="post-section">
                    <h3><i class="fas fa-lightbulb"></i> Chef's Tips</h3>
                    <div class="tips-content">
                        ${post.tips
                          .split("\n")
                          .map((tip) => `<p>💡 ${tip}</p>`)
                          .join("")}
                    </div>
                </section>
            `
                : ""
            }
            
            <footer class="post-footer">
                <div class="post-actions">
                    <button class="action-btn" onclick="shareRecipe('${post.title}')">
                        <i class="fas fa-share"></i> Share Recipe
                    </button>
                    <button class="action-btn" onclick="printRecipe()">
                        <i class="fas fa-print"></i> Print Recipe
                    </button>
                </div>
                <p class="post-attribution">
                    Recipe shared by <strong>${post.author || "Anonymous"}</strong> 
                    ${post.email ? `• Contact: ${post.email}` : ""}
                </p>
            </footer>
        </article>
        
        <style>
            .recipe-post { font-family: inherit; line-height: 1.6; }
            .post-header { margin-bottom: 2rem; }
            .post-header h1 { font-size: 2rem; color: var(--text-dark); margin-bottom: 1rem; }
            .post-meta { display: flex; gap: 1rem; flex-wrap: wrap; color: var(--text-light); font-size: 0.9rem; }
            .post-meta span { display: flex; align-items: center; gap: 0.3rem; }
            .post-section { margin: 2rem 0; }
            .post-section h3 { color: var(--primary-color); margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; }
            .ingredients-list, .instructions-list { margin-left: 1rem; }
            .ingredient-item { margin: 0.5rem 0; color: var(--text-dark); }
            .instruction-item { display: flex; margin: 1rem 0; align-items: flex-start; gap: 1rem; }
            .step-number { background: var(--primary-color); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0; }
            .step-text { flex: 1; color: var(--text-dark); }
            .tips-content p { margin: 0.5rem 0; color: var(--text-dark); }
            .post-footer { margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color); }
            .post-actions { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
            .action-btn { background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
            .action-btn:hover { background: var(--secondary-color); }
            .post-attribution { color: var(--text-light); font-size: 0.9rem; }
        </style>
    `
}

// Stats functionality
function initializeStats() {
  updateStats()
}

function updateStats() {
  const totalRecipes = document.getElementById("total-recipes")
  const totalContributors = document.getElementById("total-contributors")
  const pendingApproval = document.getElementById("pending-approval")

  if (!window.dataManager) return
  
  const stats = window.dataManager.getStats()
  const allStoredPosts = window.dataManager.getPosts()
  const approvedPosts = allStoredPosts.filter((post) => post.status === "approved")
  
  // Get today's submissions
  const today = new Date().toISOString().split('T')[0]
  const todaySubmissions = allStoredPosts.filter(post => 
    post.createdAt && post.createdAt.startsWith(today)
  ).length

  // Animate counters
  if (totalRecipes) animateCounter(totalRecipes, stats.approved)
  if (totalContributors) animateCounter(totalContributors, stats.contributors)
  if (pendingApproval) animateCounter(pendingApproval, todaySubmissions)
}

function animateCounter(element, target) {
  let current = 0
  const increment = target / 50
  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current)
  }, 30)
}

// Newsletter functionality
function initializeNewsletterForm() {
  const newsletterForm = document.getElementById("newsletter-form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }
}

function handleNewsletterSubmit(e) {
  e.preventDefault()
  const email = e.target.querySelector('input[type="email"]').value

  // Simulate newsletter subscription
  if (window.notificationSystem) {
    window.notificationSystem.success(`Thank you for subscribing with ${email}! You'll receive our latest recipes.`)
  }
  e.target.reset()
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".stat-item, .mission-item, .recipe-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s ease-out"
    observer.observe(el)
  })
}

// Utility functions for modal actions
function shareRecipe(title) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: `Check out this traditional recipe: ${title}`,
      url: window.location.href,
    })
  } else {
    // Fallback: copy to clipboard
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      if (window.notificationSystem) {
        window.notificationSystem.success("Recipe link copied to clipboard!")
      }
    })
  }
}

function printRecipe() {
  window.print()
}

function scrollTorecipes() {
  scrollToSection("recipe-section")
}

// Real-time updates
function setupRealTimeUpdates() {
  if (window.dataManager) {
    window.dataManager.addEventListener('dataChanged', () => {
      loadrecipePosts()
    })
  }
}

// Utility functions
function generateExcerpt(text, maxLength) {
  if (!text) return 'No content available'
  if (text.length <= maxLength) {
    return text
  }
  return text.substring(0, maxLength) + "..."
}

function formatDateShort(date) {
  const options = { year: "numeric", month: "short", day: "numeric" }
  return new Date(date).toLocaleDateString(undefined, options)
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(date).toLocaleDateString(undefined, options)
}

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: "smooth" })
  }
}

// Debounce utility
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Initialize hero image slider/carousel
function initializeSlider() {
  const slides = document.querySelectorAll('.carousel-slide')
  if (slides.length === 0) return

  let currentSlide = 0
  
  // Set first slide as active initially
  slides[currentSlide].classList.add('active')
  
  // Function to show next slide
  function showNextSlide() {
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active')
    
    // Move to next slide (loop back to 0 if at end)
    currentSlide = (currentSlide + 1) % slides.length
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active')
  }
  
  // Auto-advance slides every 4 seconds
  setInterval(showNextSlide, 4000)
}

// Initialize modal functionality (placeholder)
function initializeModal() {
  // Modal functionality can be added here if needed
  console.log('Modal initialized')
}

// Recipe modal functions (placeholders)
function openrecipeModal(postId) {
  console.log('Opening recipe modal for:', postId)
  // Modal opening logic can be added here
}

function closerecipeModal() {
  console.log('Closing recipe modal')
  // Modal closing logic can be added here
}

// Make functions globally available
window.openrecipeModal = openrecipeModal
window.closerecipeModal = closerecipeModal
window.filterByCategory = filterByCategory
window.shareRecipe = shareRecipe
window.printRecipe = printRecipe
window.scrollTorecipes = scrollTorecipes
