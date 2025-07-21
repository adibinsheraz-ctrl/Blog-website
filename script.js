// Sample recipe data
const recipePosts = [
  {
    id: 1,
    title: "Traditional Rajma of Bhaderwah",
    author: "Priya Sharma",
    date: "2024-01-15",
    category: "main-course",
    image: "/placeholder.svg?height=200&width=350",
    excerpt:
      "Discover the authentic recipe of Bhaderwah's famous Rajma, a hearty kidney bean curry that has been passed down through generations in the hills of Jammu.",
    content: `
            <h2>Traditional Rajma of Bhaderwah</h2>
            <p>The Rajma of Bhaderwah is not just a dish; it's a legacy that connects us to our roots in the beautiful hills of Jammu. This recipe has been cherished by families for generations.</p>
            
            <h3>Ingredients:</h3>
            <ul>
                <li>2 cups Bhaderwah Rajma (kidney beans), soaked overnight</li>
                <li>2 large onions, finely chopped</li>
                <li>4-5 tomatoes, pureed</li>
                <li>1 tbsp ginger-garlic paste</li>
                <li>2 tsp red chili powder</li>
                <li>1 tsp turmeric powder</li>
                <li>2 tsp coriander powder</li>
                <li>1 tsp garam masala</li>
                <li>Salt to taste</li>
                <li>3 tbsp mustard oil</li>
                <li>Fresh coriander for garnish</li>
            </ul>
            
            <h3>Preparation Method:</h3>
            <ol>
                <li>Pressure cook the soaked rajma with salt and turmeric until soft and tender.</li>
                <li>Heat mustard oil in a heavy-bottomed pan and add chopped onions.</li>
                <li>Cook until golden brown, then add ginger-garlic paste.</li>
                <li>Add tomato puree and cook until oil separates.</li>
                <li>Add all the spices and cook for 2-3 minutes.</li>
                <li>Add the cooked rajma along with its water.</li>
                <li>Simmer for 20-25 minutes until the gravy thickens.</li>
                <li>Garnish with fresh coriander and serve hot with rice.</li>
            </ol>
            
            <h3>Chef's Tips:</h3>
            <p>The secret to authentic Bhaderwah Rajma lies in using the local variety of kidney beans and cooking it slowly in mustard oil. The dish tastes even better the next day!</p>
        `,
    approved: true,
  },
  {
    id: 2,
    title: "Ambal - The Traditional Pumpkin Curry",
    author: "Rajesh Kumar",
    date: "2024-01-12",
    category: "main-course",
    image: "/placeholder.svg?height=200&width=350",
    excerpt:
      "Ambal is a traditional pumpkin curry from Jammu that combines the sweetness of pumpkin with aromatic spices, creating a comforting dish perfect for family meals.",
    content: `
            <h2>Ambal - The Traditional Pumpkin Curry</h2>
            <p>Ambal represents the essence of Dogra cuisine - simple ingredients transformed into something extraordinary through traditional cooking techniques.</p>
            
            <h3>Ingredients:</h3>
            <ul>
                <li>1 kg pumpkin, cut into cubes</li>
                <li>2 onions, sliced</li>
                <li>1 tbsp ginger-garlic paste</li>
                <li>2 tsp red chili powder</li>
                <li>1 tsp turmeric powder</li>
                <li>2 tsp coriander powder</li>
                <li>1 tsp fennel powder</li>
                <li>1 cup yogurt</li>
                <li>3 tbsp mustard oil</li>
                <li>Salt to taste</li>
                <li>Fresh mint leaves</li>
            </ul>
            
            <h3>Cooking Instructions:</h3>
            <ol>
                <li>Heat mustard oil and fry pumpkin pieces until lightly golden.</li>
                <li>Remove and set aside.</li>
                <li>In the same oil, cook onions until brown.</li>
                <li>Add ginger-garlic paste and spices.</li>
                <li>Add beaten yogurt gradually while stirring.</li>
                <li>Return pumpkin to the pan and mix gently.</li>
                <li>Cover and cook on low heat for 15-20 minutes.</li>
                <li>Garnish with fresh mint and serve.</li>
            </ol>
        `,
    approved: true,
  },
  {
    id: 3,
    title: "Kalaadi - The Hill Cheese Delight",
    author: "Meera Devi",
    date: "2024-01-10",
    category: "appetizers",
    image: "/placeholder.svg?height=200&width=350",
    excerpt:
      "Kalaadi is a unique cheese from the hills of Jammu, traditionally made from cow's milk and enjoyed as a snack or side dish with its distinctive tangy flavor.",
    content: `
            <h2>Kalaadi - The Hill Cheese Delight</h2>
            <p>Kalaadi is more than just cheese; it's a testament to the ingenuity of hill people who created this nutritious and delicious food from simple cow's milk.</p>
            
            <h3>About Kalaadi:</h3>
            <p>This traditional cheese is made in the higher reaches of Jammu and Kashmir, particularly in areas like Bhaderwah and Kishtwar. The cool climate and pure mountain air contribute to its unique taste.</p>
            
            <h3>How to Enjoy Kalaadi:</h3>
            <ul>
                <li>Pan-fried with onions and green chilies</li>
                <li>Grilled over open fire for a smoky flavor</li>
                <li>Added to traditional curries</li>
                <li>Eaten fresh with local bread</li>
            </ul>
            
            <h3>Simple Kalaadi Fry Recipe:</h3>
            <ol>
                <li>Cut kalaadi into thick slices</li>
                <li>Heat mustard oil in a pan</li>
                <li>Fry kalaadi slices until golden</li>
                <li>Add sliced onions and green chilies</li>
                <li>Season with salt and red chili powder</li>
                <li>Serve hot with fresh naan or rice</li>
            </ol>
        `,
    approved: true,
  },
  {
    id: 4,
    title: "Madhra - The Festive Yogurt Curry",
    author: "Sunita Jamwal",
    date: "2024-01-08",
    category: "main-course",
    image: "/placeholder.svg?height=200&width=350",
    excerpt:
      "Madhra is a traditional yogurt-based curry that's an essential part of Dogra cuisine, especially during festivals and special occasions in Jammu households.",
    content: `
            <h2>Madhra - The Festive Yogurt Curry</h2>
            <p>No Dogra feast is complete without Madhra. This creamy, aromatic curry represents the sophistication of traditional Jammu cuisine.</p>
            
            <h3>Ingredients:</h3>
            <ul>
                <li>500g mutton or chicken, cut into pieces</li>
                <li>2 cups thick yogurt</li>
                <li>2 onions, finely chopped</li>
                <li>1 tbsp ginger-garlic paste</li>
                <li>2 tsp red chili powder</li>
                <li>1 tsp turmeric powder</li>
                <li>2 tsp coriander powder</li>
                <li>1 tsp fennel powder</li>
                <li>4-5 green cardamom</li>
                <li>2 black cardamom</li>
                <li>1 cinnamon stick</li>
                <li>4 tbsp ghee</li>
                <li>Salt to taste</li>
            </ul>
            
            <h3>Cooking Method:</h3>
            <ol>
                <li>Heat ghee and add whole spices</li>
                <li>Add meat and brown on all sides</li>
                <li>Add onions and cook until golden</li>
                <li>Add ginger-garlic paste and powdered spices</li>
                <li>Whisk yogurt and add gradually</li>
                <li>Cover and cook on low heat for 45 minutes</li>
                <li>Stir occasionally and add water if needed</li>
                <li>Cook until meat is tender and gravy is thick</li>
            </ol>
        `,
    approved: true,
  },
  {
    id: 5,
    title: "Traditional Dogri Kheer",
    author: "Kamla Devi",
    date: "2024-01-05",
    category: "desserts",
    image: "/placeholder.svg?height=200&width=350",
    excerpt:
      "A rich and creamy rice pudding that's been a favorite dessert in Dogra households for centuries, made with love and traditional techniques.",
    content: `
            <h2>Traditional Dogri Kheer</h2>
            <p>This kheer recipe has been passed down in our family for generations. The secret lies in the slow cooking and the quality of ingredients used.</p>
            
            <h3>Ingredients:</h3>
            <ul>
                <li>1 cup basmati rice</li>
                <li>1 liter full-fat milk</li>
                <li>1/2 cup sugar</li>
                <li>4-5 green cardamom pods</li>
                <li>10-12 almonds, sliced</li>
                <li>2 tbsp raisins</li>
                <li>1 tbsp ghee</li>
                <li>A pinch of saffron</li>
            </ul>
            
            <h3>Preparation:</h3>
            <ol>
                <li>Wash and soak rice for 30 minutes</li>
                <li>Boil milk in a heavy-bottomed pan</li>
                <li>Add drained rice and cook on low heat</li>
                <li>Stir frequently to prevent sticking</li>
                <li>Cook until rice is completely soft</li>
                <li>Add sugar and cardamom powder</li>
                <li>Fry almonds and raisins in ghee</li>
                <li>Add to kheer along with saffron</li>
                <li>Serve warm or chilled</li>
            </ol>
        `,
    approved: true,
  },
  {
    id: 6,
    title: "Noon Chai - The Pink Tea of Kashmir",
    author: "Farida Sheikh",
    date: "2024-01-03",
    category: "beverages",
    image: "assets/traditional-drink.jpeg",
    excerpt:
      "Noon Chai, also known as Pink Tea, is a traditional beverage that's an integral part of Kashmiri culture and is also enjoyed in Jammu region.",
    content: `
            <h2>Noon Chai - The Pink Tea of Kashmir</h2>
            <p>Noon Chai is not just a beverage; it's a cultural experience that brings families together, especially during the cold winter months in the region.</p>
            
            <h3>Ingredients:</h3>
            <ul>
                <li>2 tbsp green tea leaves (special Kashmiri tea)</li>
                <li>4 cups water</li>
                <li>1/4 tsp baking soda</li>
                <li>1 cup milk</li>
                <li>Salt to taste</li>
                <li>Crushed almonds and pistachios</li>
                <li>A pinch of cardamom powder</li>
            </ul>
            
            <h3>Traditional Method:</h3>
            <ol>
                <li>Boil water with tea leaves for 10 minutes</li>
                <li>Add baking soda and continue boiling</li>
                <li>The tea will turn deep red</li>
                <li>Add cold water and strain</li>
                <li>Return to heat and add milk</li>
                <li>Add salt and cardamom</li>
                <li>The tea will turn pink</li>
                <li>Garnish with nuts and serve hot</li>
            </ol>
            
            <p>The beautiful pink color comes from the reaction between the tea and baking soda. This tea is traditionally served with Kashmiri bread or cookies.</p>
        `,
    approved: true,
  },
]

// DOM elements
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const recipeGrid = document.getElementById("recipe-grid")
const loadMoreBtn = document.getElementById("load-more-btn")
const recipeModal = document.getElementById("recipe-modal")
const modalBody = document.getElementById("modal-body")
const closeModal = document.querySelector(".close")
const contactForm = document.getElementById("contact-form")
const recipeForm = document.getElementById("recipe-form")

// State
let currentPage = 1
const postsPerPage = 3
const submittedPosts = []

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  loadrecipePosts()
  initializeModal()
  initializeForms()
  initializeScrollAnimations()
  initializeSmoothScrolling()
})

// Navigation
function initializeNavigation() {
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

  // Update active nav link on scroll
  window.addEventListener("scroll", updateActiveNavLink)
}

function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")
    const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`)

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active")
      })
      if (navLink) {
        navLink.classList.add("active")
      }
    }
  })
}

// recipe functionality
function loadrecipePosts() {
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const postsToShow = recipePosts.slice(startIndex, endIndex)

  postsToShow.forEach((post, index) => {
    const recipeCard = createrecipeCard(post)
    recipeCard.style.animationDelay = `${index * 0.1}s`
    recipeGrid.appendChild(recipeCard)
  })

  // Hide load more button if no more posts
  if (endIndex >= recipePosts.length) {
    loadMoreBtn.style.display = "none"
  }
}

function createrecipeCard(post) {
  const card = document.createElement("div")
  card.className = "recipe-card"
  card.innerHTML = `
        <img src="${post.image}" alt="${post.title}" class="recipe-image">
        <div class="recipe-content">
            <h3 class="recipe-title">${post.title}</h3>
            <div class="recipe-meta">
                <span><i class="fas fa-user"></i> ${post.author}</span>
                <span><i class="fas fa-calendar"></i> ${formatDate(post.date)}</span>
                <span><i class="fas fa-tag"></i> ${post.category}</span>
            </div>
            <p class="recipe-excerpt">${post.excerpt}</p>
            <a href="#" class="read-more" onclick="openrecipeModal(${post.id})">
                Read More <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `
  return card
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("en-US", options)
}

// Load more posts
loadMoreBtn.addEventListener("click", () => {
  currentPage++
  loadrecipePosts()
})

// Modal functionality
function initializeModal() {
  closeModal.addEventListener("click", closerecipeModal)
  window.addEventListener("click", (e) => {
    if (e.target === recipeModal) {
      closerecipeModal()
    }
  })
}

function openrecipeModal(postId) {
  const post = recipePosts.find((p) => p.id === postId)
  if (post) {
    modalBody.innerHTML = post.content
    recipeModal.style.display = "block"
    document.body.style.overflow = "hidden"
  }
}

function closerecipeModal() {
  recipeModal.style.display = "none"
  document.body.style.overflow = "auto"
}

// Forms
function initializeForms() {
  contactForm.addEventListener("submit", handleContactForm)
  recipeForm.addEventListener("submit", handlerecipeForm)
}

function handleContactForm(e) {
  e.preventDefault()

  const name = document.getElementById("contact-name").value
  const email = document.getElementById("contact-email").value
  const message = document.getElementById("contact-message").value

  // Simulate form submission
  showNotification("Thank you for your message! We'll get back to you soon.", "success")
  contactForm.reset()
}

function handlerecipeForm(e) {
  e.preventDefault()

  const title = document.getElementById("recipe-title").value
  const author = document.getElementById("recipe-author").value || "Anonymous"
  const category = document.getElementById("recipe-category").value || "uncategorized"
  const content = document.getElementById("recipe-content").value
  const images = document.getElementById("recipe-images").files

  // Create new recipe post object
  const newPost = {
    id: Date.now(),
    title: title,
    author: author,
    date: new Date().toISOString().split("T")[0],
    category: category,
    image: "/placeholder.svg?height=200&width=350",
    excerpt: content.substring(0, 150) + "...",
    content: `<h2>${title}</h2><p>${content}</p>`,
    approved: false,
  }

  submittedPosts.push(newPost)

  showNotification(
    "Your recipe has been submitted for review. Thank you for contributing to preserving our culinary heritage!",
    "success",
  )
  recipeForm.reset()
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"}"></i>
        <span>${message}</span>
    `

  // Add notification styles
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === "success" ? "#27ae60" : "#e74c3c"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        z-index: 3000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideInRight 0.3s ease-out;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 5000)
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
  document.querySelectorAll(".feature, .recipe-card").forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(30px)"
    el.style.transition = "all 0.6s ease-out"
    observer.observe(el)
  })
}

// Smooth scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
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

// Add CSS for notifications
const notificationStyles = document.createElement("style")
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

// Navbar scroll effect
window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar")
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.backdropFilter = "blur(15px)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.backdropFilter = "blur(10px)"
  }
})

// Add loading animation for images
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img")
  images.forEach((img) => {
    img.addEventListener("load", function () {
      this.style.opacity = "1"
    })
    img.style.opacity = "0"
    img.style.transition = "opacity 0.3s ease-out"
  })
})
