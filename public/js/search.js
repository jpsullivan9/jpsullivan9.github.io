// js/search.js

// This function is responsible for performing the search and updating the results
function searchProducts(query) {
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('searchResults');
            if (data.error) {
                resultsContainer.textContent = data.error;
            }
            else if (data.length == 0)
            {
                resultsContainer.innerHTML = `<div>No results found for "${query}".</div>`;
            } 
            else {
                resultsContainer.innerHTML = data.map(product => `
                    <div class="product">
                        <br>
                        <img src="${product.image_url}" alt="${product.name}" style="width:100px; height:auto;">
                        <h2>${product.name}</h2>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                    </div>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const resultsContainer = document.getElementById('searchResults');
            resultsContainer.textContent = 'Failed to connect to the API.';
        });
}

function handleSearchFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submit action
    const query = document.getElementById('searchQuery').value;
    searchProducts(query);
}

// This function extracts the search query from the URL parameters
function getSearchQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q');
}

// When the search page loads, grab the search term from the URL and perform the search
document.addEventListener('DOMContentLoaded', () => {
    const searchQuery = getSearchQueryFromUrl();
    const searchForm = document.getElementById('searchForm');

    // If there's a search query in the URL, perform the search immediately
    if (searchQuery) {
        document.getElementById('searchQuery').value = searchQuery; // Set the input value to the search term from the URL
        searchProducts(searchQuery);
    }

    // Attach the event listener to the search form
    searchForm.addEventListener('submit', handleSearchFormSubmit);
});