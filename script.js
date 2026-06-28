// Configuration
const API_KEY = 'YOUR_NEWSAPI_KEY'; // Get free key from https://newsapi.org
const COUNTRY = 'in'; // India (change to 'us', 'gb', etc.)
const PAGE_SIZE = 12;

// State management
let currentCategory = 'general';
let newsData = [];

// DOM Elements
const newsGrid = document.getElementById('newsGrid');
const featuredNews = document.getElementById('featuredNews');
const loading = document.getElementById('loading');
const currentTimeElement = document.getElementById('currentTime');

// Update live time
function updateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    currentTimeElement.textContent = now.toLocaleDateString('en-IN', options);
}

setInterval(updateTime, 1000);
updateTime();

// Fetch News
async function fetchNews(category = 'general') {
    showLoading(true);
    
    try {
        // If you don't have an API key, use mock data
        let data;
        
        if (API_KEY === 'YOUR_NEWSAPI_KEY') {
            // Mock data for demonstration
            data = await getMockNews(category);
        } else {
            const url = `https://newsapi.org/v2/top-headlines?country=${COUNTRY}&category=${category}&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`;
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.status === 'error') {
                throw new Error(result.message);
            }
            data = result.articles;
        }
        
        newsData = data;
        displayNews(data);
        showLoading(false);
        
    } catch (error) {
        showError(error.message);
        showLoading(false);
    }
}

// Mock News Data (falls back if no API key)
async function getMockNews(category) {
    const mockNews = {
        technology: [
            {
                title: "Revolutionary AI Chip Sets New Performance Records",
                description: "The latest processor architecture promises to transform machine learning capabilities with unprecedented efficiency.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=1",
                publishedAt: new Date().toISOString(),
                source: { name: "TechCrunch" }
            },
            {
                title: "Quantum Computing Breakthrough: New Error Correction Method",
                description: "Scientists achieve major milestone in quantum error correction, bringing practical quantum computers closer to reality.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=2",
                publishedAt: new Date().toISOString(),
                source: { name: "Wired" }
            },
            {
                title: "Open Source Community Releases Major Framework Update",
                description: "The popular open-source framework gets significant performance improvements and new features for developers.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=3",
                publishedAt: new Date().toISOString(),
                source: { name: "GitHub Blog" }
            },
            {
                title: "Cybersecurity Trends: AI-Powered Defense Systems on the Rise",
                description: "Organizations increasingly adopt AI-driven security solutions to combat sophisticated cyber threats.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=4",
                publishedAt: new Date().toISOString(),
                source: { name: "Security Week" }
            }
        ],
        science: [
            {
                title: "NASA's New Telescope Captures Stunning Deep Space Images",
                description: "The latest space observatory reveals unprecedented details of distant galaxies and cosmic phenomena.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=5",
                publishedAt: new Date().toISOString(),
                source: { name: "NASA" }
            },
            {
                title: "CRISPR Technology Advances: New Gene Editing Milestone",
                description: "Researchers demonstrate precise gene editing capabilities that could revolutionize medicine.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=6",
                publishedAt: new Date().toISOString(),
                source: { name: "Nature" }
            }
        ],
        business: [
            {
                title: "Global Markets Rally on Economic Recovery Hopes",
                description: "Stock markets worldwide show strong gains as economic indicators point to sustained recovery.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=7",
                publishedAt: new Date().toISOString(),
                source: { name: "Bloomberg" }
            }
        ],
        sports: [
            {
                title: "Cricket World Cup: India Advances to Semi-Finals",
                description: "Dominant performance secures India's place in the knockout stages of the tournament.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=8",
                publishedAt: new Date().toISOString(),
                source: { name: "ESPN" }
            }
        ],
        health: [
            {
                title: "New Study Reveals Benefits of Intermittent Fasting",
                description: "Research shows promising results for metabolic health and longevity with time-restricted eating patterns.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=9",
                publishedAt: new Date().toISOString(),
                source: { name: "Health Daily" }
            }
        ],
        general: [
            {
                title: "Major Infrastructure Project Announced for Smart Cities",
                description: "Government unveils ambitious plan to develop smart infrastructure across major urban centers.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=10",
                publishedAt: new Date().toISOString(),
                source: { name: "National News" }
            },
            {
                title: "Education Reform: New Policy Emphasizes Practical Skills",
                description: "The latest education policy shifts focus towards practical skill development and industry readiness.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=11",
                publishedAt: new Date().toISOString(),
                source: { name: "Education Today" }
            },
            {
                title: "Climate Summit: Nations Pledge Carbon Neutrality by 2050",
                description: "Global leaders commit to ambitious climate goals at the latest international summit.",
                url: "#",
                urlToImage: "https://picsum.photos/800/400?random=12",
                publishedAt: new Date().toISOString(),
                source: { name: "Climate News" }
            }
        ]
    };
    
    // Add more general news for better display
    if (category === 'general') {
        return [
            ...mockNews.general,
            ...mockNews.technology,
            ...mockNews.science,
            ...mockNews.business
        ];
    }
    
    return mockNews[category] || mockNews.general;
}

// Display News
function displayNews(articles) {
    if (!articles || articles.length === 0) {
        showError('No news articles found for this category.');
        return;
    }
    
    // Display featured news (first article)
    displayFeatured(articles[0]);
    
    // Display grid news (remaining articles)
    displayGrid(articles.slice(1));
}

function displayFeatured(article) {
    const imageUrl = article.urlToImage || 'https://picsum.photos/800/400';
    const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    featuredNews.innerHTML = `
        <div class="featured-card">
            <div class="featured-image" style="background-image: url('${imageUrl}')"></div>
            <div class="featured-content">
                <span class="featured-tag">TOP STORY</span>
                <h2>${article.title}</h2>
                <p>${article.description || 'Click to read more about this story.'}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <a href="${article.url}" target="_blank" class="read-more">
                        Read Full Story <i class="fas fa-arrow-right"></i>
                    </a>
                    <span style="color: #999; font-size: 0.9rem;">
                        ${article.source.name} • ${publishedDate}
                    </span>
                </div>
            </div>
        </div>
    `;
}

function displayGrid(articles) {
    newsGrid.innerHTML = articles.map(article => {
        const imageUrl = article.urlToImage || `https://picsum.photos/400/200?random=${Math.random()}`;
        const publishedDate = new Date(article.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        return `
            <article class="news-card" onclick="window.open('${article.url}', '_blank')">
                <div class="news-card-image" style="background-image: url('${imageUrl}')"></div>
                <div class="news-card-content">
                    <span class="news-card-tag">${currentCategory.toUpperCase()}</span>
                    <h3>${article.title}</h3>
                    <p>${article.description || 'No description available.'}</p>
                    <div class="news-card-footer">
                        <span class="news-source">${article.source.name}</span>
                        <span>${publishedDate}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}

// UI Helpers
function showLoading(show) {
    loading.style.display = show ? 'block' : 'none';
    if (show) {
        featuredNews.innerHTML = `
            <div class="featured-card skeleton">
                <div class="skeleton-image"></div>
                <div class="skeleton-text"></div>
            </div>
        `;
        newsGrid.innerHTML = '';
    }
}

function showError(message) {
    newsGrid.innerHTML = `
        <div class="error-message" style="grid-column: 1/-1;">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Oops! Something went wrong</h3>
            <p>${message}</p>
            <button onclick="fetchNews('${currentCategory}')" class="category-btn" style="margin-top: 1rem;">
                Try Again
            </button>
        </div>
    `;
}

// Category button handlers
document.querySelectorAll('.category-btn').forEach(button => {
    button.addEventListener('click', function() {
        // Update active state
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Fetch new category
        currentCategory = this.dataset.category;
        fetchNews(currentCategory);
    });
});

// Initial load
fetchNews();

// Auto-refresh every 30 minutes
setInterval(() => {
    fetchNews(currentCategory);
}, 30 * 60 * 1000);
