// Fetch and render starred repositories
async function loadRepositories() {
  try {
    const response = await fetch('events.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const repositories = await response.json();
    renderRepositories(repositories);
  } catch (error) {
    console.error('Error loading repositories:', error);
    displayError('Failed to load repositories. Please try again later.');
  }
}

// Render repositories to the DOM
function renderRepositories(repositories) {
  const container = document.getElementById('repositories-list');
  
  if (!repositories || repositories.length === 0) {
    container.innerHTML = '<p class="loading">No repositories found.</p>';
    return;
  }

  const html = repositories.map(repo => `
    <div class="repository-card">
      <div class="repo-header">
        <div class="repo-title">
          <a href="${repo.url}" target="_blank" rel="noopener noreferrer">${repo.name}</a>
          <span class="repo-owner">by ${repo.owner}</span>
        </div>
      </div>
      <div class="repo-stats">
        <div class="stat">
          <span class="stat-icon">⭐</span>
          <span>${repo.stars.toLocaleString()} stars</span>
        </div>
      </div>
      <p class="repo-description">${repo.description}</p>
      <div class="repo-footer">
        <span class="language-badge">${repo.language}</span>
        <span class="starred-date">Starred ${formatDate(repo.starredAt)}</span>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;
}

// Format date to readable format
function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}

// Display error message
function displayError(message) {
  const container = document.getElementById('repositories-list');
  container.innerHTML = `<div class="error">${message}</div>`;
}

// Load repositories when DOM is ready
document.addEventListener('DOMContentLoaded', loadRepositories);
