// public/script.js

const API_ENDPOINT = 'http://localhost:3000/api/news';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('news-container');
  const searchInput = document.getElementById('search');
  const loader = document.getElementById('loader');

  let debounceTimer;

  async function fetchNews(query = '') {
    container.innerHTML = '';
    loader.style.display = 'block'; // Show loader

    try {
      const response = await fetch(`${API_ENDPOINT}?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      displayNews(data.articles);
    } catch (error) {
      container.innerHTML = `<p style="text-align:center; color:#f97316;">❌ Error fetching news. Please try again later.</p>`;
      console.error('Error fetching news:', error);
    } finally {
      loader.style.display = 'none'; // Hide loader
    }
  }

  function displayNews(articles) {
    container.innerHTML = '';

    if (!articles || articles.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:#64748b;">🔍 No articles found for your search.</p>`;
      return;
    }

    articles.forEach(article => {
      const div = document.createElement('div');
      div.className = 'news-item';
      div.innerHTML = `
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank" rel="noopener noreferrer">Read more →</a>
      `;
      container.appendChild(div);
    });
  }

  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const query = searchInput.value.trim();
      fetchNews(query);
    }, 500); // 500ms debounce delay
  });

  fetchNews(); // Load top headlines on page load
});
