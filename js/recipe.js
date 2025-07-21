document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));

    if (recipeId && window.dataManager) {
        const recipe = window.dataManager.getPostById(recipeId);
        if (recipe) {
            displayRecipe(recipe);
        } else {
            displayError();
        }
    } else {
        displayError();
    }
});

function displayRecipe(recipe) {
    const recipeContent = document.getElementById("recipe-content");
    recipeContent.innerHTML = generatePostHTML(recipe);
}

function displayError() {
    const recipeContent = document.getElementById("recipe-content");
    recipeContent.innerHTML = `
        <div class="no-results">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Recipe not found</h3>
            <p>The recipe you are looking for does not exist or has been moved.</p>
            <a href="index.html" class="cta-button primary">Back to Home</a>
        </div>
    `;
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
    `
}

function formatCategory(category) {
  if (!category) return "General"
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatDate(date) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(date).toLocaleDateString(undefined, options)
}

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