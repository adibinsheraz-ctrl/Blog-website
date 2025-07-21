// Contact page specific functionality

document.addEventListener("DOMContentLoaded", () => {
  initializeContactForm()
  initializeFAQ()
})

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit)
  }
}

function handleContactSubmit(e) {
  e.preventDefault()

  const submitBtn = e.target.querySelector(".submit-btn")
  const btnText = submitBtn.querySelector(".btn-text")
  const btnLoading = submitBtn.querySelector(".btn-loading")

  // Show loading state
  submitBtn.classList.add("loading")
  submitBtn.disabled = true
  btnText.style.display = "none"
  btnLoading.style.display = "inline-flex"

  // Get form data
  const formData = new FormData(e.target)
  const contactData = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    consent: formData.get("consent") === "on",
    timestamp: new Date().toISOString(),
  }

  // Simulate form submission
  setTimeout(() => {
    // Save to localStorage (in a real app, this would go to a server)
    const contacts = JSON.parse(localStorage.getItem("contactSubmissions") || "[]")
    contacts.push(contactData)
    localStorage.setItem("contactSubmissions", JSON.stringify(contacts))

    // Reset form and show success message
    e.target.reset()
    
    if (window.notificationSystem) {
      window.notificationSystem.success(
        `Thank you ${contactData.firstName}! Your message has been sent. We'll get back to you within 24 hours.`,
        { duration: 6000 }
      )
    }

    // Reset button state
    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
    btnText.style.display = "inline"
    btnLoading.style.display = "none"

    // Subscribe to newsletter if requested
    if (contactData.newsletter) {
      setTimeout(() => {
        if (window.notificationSystem) {
          window.notificationSystem.info("You have been subscribed to our newsletter!")
        }
      }, 1000)
    }
  }, 2000) // Simulate network delay
}

// FAQ functionality
function initializeFAQ() {
  const faqItems = document.querySelectorAll(".faq-item")

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question")
    if (question) {
      question.addEventListener("click", () => toggleFAQ(item))
    }
  })
}

function toggleFAQ(item) {
  const isActive = item.classList.contains("active")

  // Close all FAQ items
  document.querySelectorAll(".faq-item").forEach((faqItem) => {
    faqItem.classList.remove("active")
  })

  // Open clicked item if it wasn't already active
  if (!isActive) {
    item.classList.add("active")
  }
}

// Form validation helpers
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Real-time form validation
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email")
  const phoneInput = document.getElementById("phone")

  if (emailInput) {
    emailInput.addEventListener("blur", validateEmailField)
    emailInput.addEventListener("input", clearValidationError)
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", validatePhoneField)
    phoneInput.addEventListener("input", clearValidationError)
  }
})

function validateEmailField(e) {
  const email = e.target.value.trim()
  if (email && !validateEmail(email)) {
    showFieldError(e.target, "Please enter a valid email address")
  }
}

function validatePhoneField(e) {
  const phone = e.target.value.trim()
  if (phone && !validatePhone(phone)) {
    showFieldError(e.target, "Please enter a valid phone number")
  }
}

function showFieldError(field, message) {
  clearFieldError(field)

  field.style.borderColor = "var(--danger-color)"

  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.style.cssText = `
        color: var(--danger-color);
        font-size: 0.9rem;
        margin-top: 0.3rem;
    `
  errorDiv.textContent = message

  field.parentNode.appendChild(errorDiv)
}

function clearFieldError(field) {
  field.style.borderColor = ""
  const existingError = field.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
}

function clearValidationError(e) {
  clearFieldError(e.target)
}

// Contact method interactions
document.addEventListener("DOMContentLoaded", () => {
  const contactMethods = document.querySelectorAll(".contact-method")

  contactMethods.forEach((method) => {
    method.addEventListener("click", handleContactMethodClick)
  })
})

function handleContactMethodClick(e) {
  const method = e.currentTarget
  const icon = method.querySelector("i")

  if (icon.classList.contains("fa-envelope")) {
    // Email click
    const email = method.querySelector("p").textContent
    window.location.href = `mailto:${email}`
  } else if (icon.classList.contains("fa-phone")) {
    // Phone click
    const phone = method.querySelector("p").textContent
    window.location.href = `tel:${phone}`
  } else if (icon.classList.contains("fa-map-marker-alt")) {
    // Location click - open in maps
    const address = method.querySelector("p").textContent
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    window.open(mapsUrl, "_blank")
  }
}

// Social media link tracking
document.addEventListener("DOMContentLoaded", () => {
  const socialLinks = document.querySelectorAll(".social-link")

  socialLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault()
      const platform = getSocialPlatform(link)
      window.alert(`${platform} page will open soon! Follow us for recipe updates.`)
    })
  })
})

function getSocialPlatform(link) {
  const icon = link.querySelector("i")
  if (icon.classList.contains("fa-facebook")) return "Facebook"
  if (icon.classList.contains("fa-instagram")) return "Instagram"
  if (icon.classList.contains("fa-twitter")) return "Twitter"
  if (icon.classList.contains("fa-youtube")) return "YouTube"
  return "Social Media"
}

// Auto-resize textarea
document.addEventListener("DOMContentLoaded", () => {
  const messageTextarea = document.getElementById("message")
  if (messageTextarea) {
    messageTextarea.addEventListener("input", autoResizeTextarea)
  }
})

function autoResizeTextarea(e) {
  const textarea = e.target
  textarea.style.height = "auto"
  textarea.style.height = textarea.scrollHeight + "px"
}

// Character counter for message field
document.addEventListener("DOMContentLoaded", () => {
  const messageField = document.getElementById("message")
  if (messageField) {
    addCharacterCounter(messageField, 1000)
  }
})

function addCharacterCounter(field, maxLength) {
  const counter = document.createElement("div")
  counter.className = "character-counter"
  counter.style.cssText = `
        text-align: right;
        font-size: 0.8rem;
        color: var(--text-muted);
        margin-top: 0.3rem;
    `

  field.parentNode.appendChild(counter)

  function updateCounter() {
    const remaining = maxLength - field.value.length
    counter.textContent = `${field.value.length}/${maxLength} characters`

    if (remaining < 50) {
      counter.style.color = "var(--danger-color)"
    } else if (remaining < 100) {
      counter.style.color = "var(--warning-color)"
    } else {
      counter.style.color = "var(--text-muted)"
    }
  }

  field.addEventListener("input", updateCounter)
  updateCounter() // Initial count
}
