import data from '../../../backend/data.js';

const HomeScreen = {
    render: () => {
        const products = data.products;

        const productList = products.map(product => `
            <li>
                <a href="/#/product/${product._id}">
                    <img src="${product.image}" alt="${product.name}">
                </a>
                <div class="product-details">
                    <div class="product-name">
                        <a href="/#/product/${product._id}">${product.name}</a>
                    </div>
                    <div class="product-brand">${product.brand}</div>
                    <div class="product-price">$${product.price}</div>
                </div>
            </li>
        `).join('');

        return `<ul class="Products">${productList}</ul>`;
    }
};

export default HomeScreen;
