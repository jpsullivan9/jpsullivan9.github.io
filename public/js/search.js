document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q');
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    
    if (searchQuery) {
        document.getElementById('searchQuery').value = searchQuery;
        searchProducts(searchQuery, minPrice, maxPrice);
    }

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        searchProducts(document.getElementById('searchQuery').value, minPrice, maxPrice);
    });
});

function searchProducts(query, minPrice = '', maxPrice = '') {
    const queryParams = new URLSearchParams({ q: query, minPrice, maxPrice }).toString();
    fetch(`/api/search?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            if (data.suggestions) {
                displaySuggestions(data.suggestions, query);
            } else {
                displaySearchResults(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(data) {
    const resultsContainer = document.getElementById('searchResults');
    if (data.error) {
        resultsContainer.textContent = data.error;
    } else if (data.length === 0) {
        resultsContainer.innerHTML = `<div>No results found.</div>`;
    } else {
        resultsContainer.innerHTML = data.map(product => `
            <div class="product" onclick="location.href='/pages/product.html?id=${product.id}'" style="cursor:pointer;">
                <br>
                <img src="${product.image_url}" alt="${product.name}" style="width:100px; height:auto;">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
            </div>
        `).join('');
    }
}

function displaySuggestions(suggestions, originalQuery) {
    const resultsContainer = document.getElementById('searchResults');
    if (suggestions.length > 0) {
        const topSuggestion = suggestions[0];
        resultsContainer.innerHTML = `<div>Did you mean: <a href="#" onclick="searchProducts('${topSuggestion}')">${topSuggestion}</a> instead of "${originalQuery}"?</div>`;
    } else {
        resultsContainer.innerHTML = `<div>No matches found for "${originalQuery}".</div>`;
    }
}