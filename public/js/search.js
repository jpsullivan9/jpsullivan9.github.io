document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q');
    const minPrice = params.get('minPrice') || '';
    const maxPrice = params.get('maxPrice') || '';
    document.getElementById('minPrice').value = minPrice;
    document.getElementById('maxPrice').value = maxPrice;

    if (searchQuery) {
        document.getElementById('searchQuery').value = searchQuery;
        searchProducts(searchQuery, minPrice, maxPrice);
    }

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('searchQuery').value;
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const minRating = document.getElementById('minRating').value;
        searchProducts(query, minPrice, maxPrice, minRating);
    });
});

function getSellerIds() {
    const sellerSelect = document.getElementById('sellerSelect');
    const selectedOptions = Array.from(sellerSelect.selectedOptions);
    return selectedOptions.map(option => option.value);
}

function searchProducts(query, minPrice = '', maxPrice = '', minRating = '') {
    const sellerSelect = document.getElementById('sellerSelect');
    const selectedSellerIds = Array.from(sellerSelect.selectedOptions).map(option => option.value).join(',');
    const queryParams = new URLSearchParams({
        q: query,
        minPrice,
        maxPrice,
        minRating,
        sellerIds: selectedSellerIds
    }).toString();
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
    
    if (data.message) {
        resultsContainer.innerHTML = `<div>${data.message}</div>`;
    } else if (data.error) {
        resultsContainer.textContent = data.error;
    } else if (data.length === 0) {
        resultsContainer.innerHTML = `<div>No products found. Try adjusting your search or filter settings.</div>`;
    } else {
        resultsContainer.innerHTML = data.map(product => `
            <div class="product" onclick="location.href='/pages/product.html?id=${product.id}'" style="cursor:pointer;">
                <br>
                <img src="${product.image_url}" alt="${product.name}" style="width:100px; height:100px; display:block; margin:auto;">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                ${product.average_review_score !== null ? `<p>Average Reviews: ${product.average_review_score}</p>` : ''}
            </div>
        `).join('');
    }
}

function displaySuggestions(suggestions, originalQuery) {
    const resultsContainer = document.getElementById('searchResults');
    if (suggestions.length > 0) {
        const topSuggestion = suggestions[0];
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const suggestionSearchURL = `search.html?q=${encodeURIComponent(topSuggestion)}${minPrice ? '&minPrice=' + minPrice : ''}${maxPrice ? '&maxPrice=' + maxPrice : ''}`;
        resultsContainer.innerHTML = `<div>Did you mean: <a href="${suggestionSearchURL}">${topSuggestion}</a> instead of "${originalQuery}"?</div>`;
    } else {
        resultsContainer.innerHTML = `<div>No matches found for "${originalQuery}".</div>`;
    }
}
function fetchCategories(){
fetch('/category.js')
  .then(response => response.json())
  .then(categories => {
    // Process categories data
  })
  .catch(error => {
    console.error('Error fetching categories:', error);
  });
}
  fetch(`your_api_endpoint?q=query&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${selectedCategory}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

  