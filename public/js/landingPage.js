// landingPage.js

const displayFeaturedProducts = async () => {
    try {
        // Fetch featured products from the backend API
        const response = await fetch('/api/featured-products');
        if (!response.ok) {
            throw new Error('Failed to fetch featured products');
        }
        const products = await response.json();

        // Generate HTML for each featured product
        const featuredProductHTML = products.map(product => `
            <section>
                <div class="product">
                    <img src="${noImageUrl(product.image_url)}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                </div>
            </section>
        `).join('');

        // Insert the generated HTML into the container
        rootContainer.innerHTML = featuredProductHTML;
    } catch (error) {
        console.error('Error fetching and displaying featured products:', error);
    }
};
