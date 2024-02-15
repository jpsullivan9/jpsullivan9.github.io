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
                    <div class="product" onclick="location.href='/pages/product.html?id=${product.id}'" style="cursor:pointer;">
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
    event.preventDefault();
    const query = document.getElementById('searchQuery').value;
    searchProducts(query);
}


function getSearchQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('q');
}


document.addEventListener('DOMContentLoaded', () => {
    const searchQuery = getSearchQueryFromUrl();
    const searchForm = document.getElementById('searchForm');

    if (searchQuery) {
        document.getElementById('searchQuery').value = searchQuery;
        searchProducts(searchQuery);
    }


    searchForm.addEventListener('submit', handleSearchFormSubmit);
});