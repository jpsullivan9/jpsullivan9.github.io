// landingPage.js

const displayFeaturedProducts = async () => {
    try {
        // Fetch featured products from the backend API
        const response = await fetch('/api/featured-products');
        if (!response.ok) {
            throw new Error('Failed to fetch featured products');
        }
        const products = await response.json();

        // Select the container element to display featured products
        const featuredProductsContainer = document.querySelector('.featured-products');

        // Generate HTML for each featured product
        const featuredProductHTML = products.map(product => `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
            </div>
        `).join('');

        // Insert the generated HTML into the container
        featuredProductsContainer.innerHTML = featuredProductHTML;
    } catch (error) {
        console.error('Error fetching and displaying featured products:', error);
    }
};

// Export the function to be used in other modules
export { displayFeaturedProducts };