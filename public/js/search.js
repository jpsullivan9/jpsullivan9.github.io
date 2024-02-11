function searchProducts() {
    const query = document.getElementById('searchQuery').value;
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('searchResults');
            if (data.error) {
                resultsContainer.textContent = data.error;
            } else {
                resultsContainer.innerHTML = data.map(product => `
                    <div class="product">
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