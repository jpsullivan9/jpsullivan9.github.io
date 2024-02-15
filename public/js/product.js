document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        fetch(`/api/product?id=${encodeURIComponent(productId)}`)
            .then(response => response.json())
            .then(product => {
                document.getElementById('productName').textContent = product.name;
                document.getElementById('productImage').src = product.image_url;
                document.getElementById('productImage').alt = product.name;
                document.getElementById('productDescription').textContent = product.description;
                document.getElementById('productPrice').textContent = `Price: $${product.price}`;
                // Additional product details can be added here
            })
            .catch(error => {
                console.error('Error:', error);
                // Handle errors, such as displaying a message to the user
            });
    } else {
        // Handle case where no product ID is present in the URL
    }
});
