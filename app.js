document.addEventListener('DOMContentLoaded', () => {
    const newsContainer = document.getElementById('news-container');
    const categorySelect = document.getElementById('category');
    const searchInput = document.getElementById('search');
    const searchBtn = document.getElementById('search-btn');
  
    // Load initial news
    loadNews('general');
  
    // Event listeners
    categorySelect.addEventListener('change', (e) => loadNews(e.target.value));
    searchBtn.addEventListener('click', () => {
      const query = searchInput.value.trim();
      if (query) loadNews(null, query);
    });
  
    async function loadNews(category, query) {
      try {
        showLoading();
        
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        else params.append('category', category || 'general');
        
        // Add cache-buster to prevent stale responses
        params.append('_', Date.now());
        
        const response = await fetch(`http://localhost:3001/api/news?${params}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.articles) {
          throw new Error('Invalid response format from server');
        }
        
        renderNews(data.articles);
      } catch (error) {
        showError(error);
        console.error('News loading error:', error);
      }
    }
  
    function renderNews(articles) {
      newsContainer.innerHTML = '';
      
      if (!articles || articles.length === 0) {
        newsContainer.innerHTML = '<div class="no-articles">No articles found. Try a different search.</div>';
        return;
      }
      
      articles.forEach(article => {
        const articleEl = document.createElement('article');
        articleEl.innerHTML = `
          <h2>${article.title || 'No title available'}</h2>
          ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}">` : ''}
          <p>${article.description || 'No description available'}</p>
          <div class="article-meta">
            <span>${article.source?.name || 'Unknown source'}</span>
            <span>${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
          </div>
        `;
        articleEl.addEventListener('click', () => {
          if (article.url) window.open(article.url, '_blank');
        });
        newsContainer.appendChild(articleEl);
      });
    }
  
    function showLoading() {
      newsContainer.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading news...</p>
        </div>
      `;
    }
  
    function showError(error) {
      newsContainer.innerHTML = `
        <div class="error-state">
          <p>⚠️ ${error.message || 'Failed to load news'}</p>
          <button onclick="window.location.reload()">Try Again</button>
          <p class="small">If the problem persists, check your connection</p>
        </div>
      `;
    }
  });