// Post recipe page specific functionality

let selectedImages = []
const previewModal = null

document.addEventListener("DOMContentLoaded", () => {
  initializerecipeForm()
  initializeFileUpload()
  initializePreview()
  initializeFormValidation()
  initializeAutoSave()
})

// recipe form initialization
function initializerecipeForm() {
  const recipeForm = document.getElementById("recipe-form")
  if (recipeForm) {
    recipeForm.addEventListener("submit", handlerecipeSubmit)
  }
}

function handlerecipeSubmit(e) {
  e.preventDefault()

  if (!validateForm(e.target)) {
    return
  }

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
  const recipePost = {
    title: formData.get("title"),
    category: formData.get("category"),
    author: formData.get("author") || "Anonymous",
    prepTime: formData.get("prepTime"),
    cookTime: formData.get("cookTime"),
    servings: formData.get("servings"),
    ingredients: formData.get("ingredients"),
    instructions: formData.get("instructions"),
    story: formData.get("story"),
    tips: formData.get("tips"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    newsletter: formData.get("newsletter") === "on",
    images: selectedImages.map((img) => img.url),
  }

  // Simulate form submission
  setTimeout(() => {
    // Save recipe post
    const savedPost = window.dataManager ? window.dataManager.addPost(recipePost) : null

    if (savedPost) {
      // Reset form
      e.target.reset()
      selectedImages = []
      updateImagePreview()

      // Show success message
      if (window.notificationSystem) {
        window.notificationSystem.success(
          "Your recipe has been submitted successfully! It will be reviewed and published within 2-3 business days.",
          { duration: 7000 }
        )
      }

      // Clear auto-save data
      localStorage.removeItem('recipe-form-autosave')

      // Scroll to top
      scrollToTop()

      // Optional: redirect to home page after a delay
      setTimeout(() => {
        if (confirm("Would you like to view all recipes now?")) {
          window.location.href = "index.html"
        }
      }, 3000)
    } else {
      if (window.notificationSystem) {
        window.notificationSystem.error("Failed to submit recipe. Please try again.")
      }
    }
    
    // Reset button state
    submitBtn.classList.remove("loading")
    submitBtn.disabled = false
    btnText.style.display = "inline"
    btnLoading.style.display = "none"
  }, 2000)
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}

function formatCategory(category) {
  // Placeholder for formatting the category
  return category.charAt(0).toUpperCase() + category.slice(1)
}

// File upload functionality
function initializeFileUpload() {
  const fileInput = document.getElementById("recipe-images")
  const uploadArea = document.getElementById("file-upload-area")

  if (fileInput && uploadArea) {
    // Click to upload
    uploadArea.addEventListener("click", () => fileInput.click())

    // File input change
    fileInput.addEventListener("change", handleFileSelect)

    // Drag and drop
    uploadArea.addEventListener("dragover", handleDragOver)
    uploadArea.addEventListener("dragleave", handleDragLeave)
    uploadArea.addEventListener("drop", handleDrop)
  }
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files)
  processFiles(files)
}

function handleDragOver(e) {
  e.preventDefault()
  e.currentTarget.classList.add("dragover")
}

function handleDragLeave(e) {
  e.preventDefault()
  e.currentTarget.classList.remove("dragover")
}

function handleDrop(e) {
  e.preventDefault()
  e.currentTarget.classList.remove("dragover")

  const files = Array.from(e.dataTransfer.files)
  processFiles(files)
}

function processFiles(files) {
  const validFiles = files.filter((file) => {
    if (!file.type.startsWith("image/")) {
      showNotification(`${file.name} is not an image file`, "error")
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      showNotification(`${file.name} is too large. Maximum size is 5MB`, "error")
      return false
    }

    return true
  })

  validFiles.forEach((file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImages.push({
        file: file,
        url: e.target.result,
        name: file.name,
      })
      updateImagePreview()
    }
    reader.readAsDataURL(file)
  })
}

function updateImagePreview() {
  const previewContainer = document.getElementById("image-preview")
  if (!previewContainer) return

  previewContainer.innerHTML = ""

  selectedImages.forEach((image, index) => {
    const previewItem = document.createElement("div")
    previewItem.className = "preview-item"
    previewItem.innerHTML = `
            <img src="${image.url}" alt="${image.name}">
            <button type="button" class="preview-remove" onclick="removeImage(${index})" title="Remove image">
                <i class="fas fa-times"></i>
            </button>
        `
    previewContainer.appendChild(previewItem)
  })
}

function removeImage(index) {
  selectedImages.splice(index, 1)
  updateImagePreview()
}

// Preview functionality
function initializePreview() {
  const previewBtn = document.getElementById("preview-btn")
  if (previewBtn) {
    previewBtn.addEventListener("click", showPreview)
  }
}

function showPreview() {
  const form = document.getElementById("recipe-form")
  const formData = new FormData(form)

  const previewData = {
    title: formData.get("title") || "Recipe Title",
    category: formData.get("category") || "general",
    author: formData.get("author") || "Anonymous",
    prepTime: formData.get("prepTime"),
    cookTime: formData.get("cookTime"),
    servings: formData.get("servings"),
    ingredients: formData.get("ingredients") || "No ingredients listed",
    instructions: formData.get("instructions") || "No instructions provided",
    story: formData.get("story"),
    tips: formData.get("tips"),
    images: selectedImages,
  }

  const modal = document.getElementById("preview-modal")
  const previewContent = document.getElementById("preview-content")

  if (modal && previewContent) {
    previewContent.innerHTML = generatePreviewHTML(previewData)
    modal.style.display = "block"
    document.body.style.overflow = "hidden"
  }
}

function closePreviewModal() {
  const modal = document.getElementById("preview-modal")
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = "auto"
  }
}

function generatePreviewHTML(data) {
  const images =
    data.images.length > 0
      ? data.images
          .map(
            (img) =>
              `<img src="${img.url}" alt="${data.title}" style="max-width: 100%; margin: 1rem 0; border-radius: 8px;">`,
          )
          .join("")
      : '<div style="background: #f0f0f0; padding: 2rem; text-align: center; border-radius: 8px; margin: 1rem 0;">No images uploaded</div>'

  return `
        <div class="preview-content">
            <h1 style="color: var(--primary-color); margin-bottom: 1rem;">${data.title}</h1>
            
            <div class="preview-meta" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem; color: var(--text-light); font-size: 0.9rem;">
                <span><i class="fas fa-user"></i> ${data.author}</span>
                <span><i class="fas fa-tag"></i> ${formatCategory(data.category)}</span>
                ${data.prepTime ? `<span><i class="fas fa-clock"></i> Prep: ${data.prepTime}</span>` : ""}
                ${data.cookTime ? `<span><i class="fas fa-fire"></i> Cook: ${data.cookTime}</span>` : ""}
                ${data.servings ? `<span><i class="fas fa-users"></i> Serves: ${data.servings}</span>` : ""}
            </div>
            
            ${images}
            
            ${
              data.story
                ? `
                <div style="margin: 2rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-heart"></i> The Story</h3>
                    <p style="line-height: 1.6;">${data.story}</p>
                </div>
            `
                : ""
            }
            
            <div style="margin: 2rem 0;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-list"></i> Ingredients</h3>
                <div style="margin-left: 1rem;">
                    ${data.ingredients
                      .split("\n")
                      .map((ingredient) => `<div style="margin: 0.5rem 0;">• ${ingredient}</div>`)
                      .join("")}
                </div>
            </div>
            
            <div style="margin: 2rem 0;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-utensils"></i> Instructions</h3>
                <div>
                    ${data.instructions
                      .split("\n")
                      .map(
                        (instruction, index) =>
                          `<div style="display: flex; margin: 1rem 0; align-items: flex-start; gap: 1rem;">
                            <span style="background: var(--primary-color); color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">${index + 1}</span>
                            <span style="flex: 1;">${instruction}</span>
                        </div>`,
                      )
                      .join("")}
                </div>
            </div>
            
            ${
              data.tips
                ? `
                <div style="margin: 2rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;"><i class="fas fa-lightbulb"></i> Tips</h3>
                    <div>
                        ${data.tips
                          .split("\n")
                          .map((tip) => `<p style="margin: 0.5rem 0;">💡 ${tip}</p>`)
                          .join("")}
                    </div>
                </div>
            `
                : ""
            }
            
            <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color); text-align: center; color: var(--text-light);">
                <p><strong>This is a preview of how your recipe will appear after approval.</strong></p>
            </div>
        </div>
    `
}

// Form validation
function initializeFormValidation() {
  const form = document.getElementById("recipe-form")
  if (!form) return

  // Real-time validation
  const requiredFields = form.querySelectorAll("[required]")
  requiredFields.forEach((field) => {
    field.addEventListener("blur", validateField)
    field.addEventListener("input", clearFieldValidation)
  })

  // Character limits
  const ingredientsField = document.getElementById("ingredients")
  const instructionsField = document.getElementById("instructions")

  if (ingredientsField) addCharacterCounter(ingredientsField, 2000)
  if (instructionsField) addCharacterCounter(instructionsField, 5000)
}

function validateForm(form) {
  let isValid = true
  const requiredFields = form.querySelectorAll("[required]")

  requiredFields.forEach((field) => {
    if (!validateField({ target: field })) {
      isValid = false
    }
  })

  // Custom validations
  const title = form.querySelector("#recipe-title").value.trim()
  if (title.length < 5) {
    showFieldError(form.querySelector("#recipe-title"), "Title must be at least 5 characters long")
    isValid = false
  }

  const ingredients = form.querySelector("#ingredients").value.trim()
  if (ingredients.split("\n").filter((line) => line.trim()).length < 3) {
    showFieldError(form.querySelector("#ingredients"), "Please list at least 3 ingredients")
    isValid = false
  }

  const instructions = form.querySelector("#instructions").value.trim()
  if (instructions.split("\n").filter((line) => line.trim()).length < 3) {
    showFieldError(form.querySelector("#instructions"), "Please provide at least 3 instruction steps")
    isValid = false
  }

  if (!isValid) {
    if (window.notificationSystem) {
      window.notificationSystem.error("Please fix the errors in the form before submitting")
    }
    // Scroll to first error
    const firstError = form.querySelector(".field-error")
    if (firstError) {
      firstError.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  return isValid
}

function validateField(e) {
  const field = e.target
  const value = field.value.trim()

  clearFieldValidation(e)

  if (field.hasAttribute("required") && !value) {
    showFieldError(field, "This field is required")
    return false
  }

  if (field.type === "email" && value && !validateEmail(value)) {
    showFieldError(field, "Please enter a valid email address")
    return false
  }

  return true
}

function showFieldError(field, message) {
  clearFieldValidation({ target: field })

  field.style.borderColor = "var(--danger-color)"

  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.style.cssText = `
        color: var(--danger-color);
        font-size: 0.9rem;
        margin-top: 0.3rem;
        display: flex;
        align-items: center;
        gap: 0.3rem;
    `
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`

  field.parentNode.appendChild(errorDiv)
}

function clearFieldValidation(e) {
  const field = e.target
  field.style.borderColor = ""
  const existingError = field.parentNode.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

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

    if (field.value.length > maxLength) {
      field.value = field.value.substring(0, maxLength)
      counter.textContent = `${maxLength}/${maxLength} characters (limit reached)`
    }
  }

  field.addEventListener("input", updateCounter)
  updateCounter()
}

// Auto-save functionality (optional)
function initializeAutoSave() {
  const form = document.getElementById("recipe-form")
  if (!form) return

  const autoSaveKey = "recipe-form-autosave"
  let autoSaveTimer

  // Load saved data
  const savedData = localStorage.getItem(autoSaveKey)
  if (savedData) {
    try {
      const data = JSON.parse(savedData)
      Object.keys(data).forEach((key) => {
        const field = form.querySelector(`[name="${key}"]`)
        if (field && field.type !== "file") {
          field.value = data[key]
        }
      })
      showNotification("Draft restored from auto-save", "info", 3000)
    } catch (e) {
      console.error("Error loading auto-save data:", e)
    }
  }

  // Auto-save on input
  form.addEventListener("input", () => {
    clearTimeout(autoSaveTimer)
    autoSaveTimer = setTimeout(() => {
      const formData = new FormData(form)
      const data = {}
      for (const [key, value] of formData.entries()) {
        if (key !== "images") {
          // Don't save file inputs
          data[key] = value
        }
      }
      localStorage.setItem(autoSaveKey, JSON.stringify(data))
    }, 2000)
  })

  // Clear auto-save on successful submit
  form.addEventListener("submit", () => {
    localStorage.removeItem(autoSaveKey)
  })
}

// Make functions globally available
window.removeImage = removeImage
window.closePreviewModal = closePreviewModal
