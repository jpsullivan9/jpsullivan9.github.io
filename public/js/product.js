// product.js
const fetchProducts = async (isDetail, id) => {
    try {
        // Fetch categories from the backend API
        const response = await fetch(`/api/product?${isDetail ? "pid" : "scid"}=${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch sub-categories");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching and displaying sub-categories:", error);
    }
};

const buildProductDetail = (cid, scid, pid) => {
    prepHash("cat", cid);
    prepHash("subCat", scid);
    currentPageId = "prod";
    buildHash(pid);
    displayDetailPage(pid);
};

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
            <section onclick="buildProductDetail('${product.cid}', '${product.scid}', '${product.id}')">
                <div class="product">
                    <img src="${noImageUrl(product.image_url)}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>${getNoDescContent(product.description)}</p>
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

const displayDetailPage = async (pid) => {
    const product = await fetchProducts(true, pid);
    let imageUrls = product.image_url.split(",");
    let entry = 0;
    const detailContent = `
        <div class="row justify-content-md-center p-2">
            <div class="col-md-12 col-lg-4">
                <div id="prodImages" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${imageUrls.map(iurl => {
                            let active = "";
                            if (entry === 0) {
                                entry = 1;
                                active = "active";
                            };
                            return `
                                <div class="carousel-item ${active}">
                                    <img src="${iurl}" style="width: 600px; height: 600px" alt="${product.name}"/>
                                </div>
                            `;
                        })};
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#prodImages" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#prodImages" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
            <div class="col-md-12 col-lg-6">
                <p class="fs-2">
                    ${product.name}
                    ${product.featured ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>` : ""}
                </p>
                <p class="fs-4">$${product.price}</p>
                <p class="fs-6">${product.description}</p>
                ${product.stock_quantity <= 0 ? "<p><span class='badge text-bg-danger'>OUT OF STOCK</span></p>" : ""}
                ${product.stock_quantity > 0 && product.stock_quantity <= 5 ? "<p><span class='badge text-bg-warning'>LOW STOCK</span></p>" : ""}
                ${product.stock_quantity > 5 ? "<p><span class='badge text-bg-success'>IN STOCK</span></p>" : ""}
                <p>
                    <button type="button" class="btn btn-dark" ${product.stock_quantity > 0 ? "" : "disabled"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z"/></svg>
                        Add to Cart
                    </button>
                </p>
            </div>
        </div>
    `;
    currentPageId = "prod";
    buildHash(pid)
    rootContainer.innerHTML = detailContent;
};

const displayListingPage = async (id) => {
    const subCat = await fetchSubCategories(false, id);
    const products = await fetchProducts(false, id);
    if (!Array.isArray(products)) products = Array.of(products);
    let plpLines = "";
    products.forEach(product => {
        let imageUrls = product.image_url.split(",");
        plpLines += `<div class="row p-2">
            <div class="col-md-4 col-xl-3"><img src="${noImageUrl(imageUrls[0])}" style="width: 200px; height: 200px" alt="${product.name}"/></div>
            <div class="col-md-3 col-xl-4"><h4>${product.name}</h4></div>
            <div class="col-sm-6 col-md-3 col-xl-3">$${product.price}</div>
            <div class="col-sm-6 col-md-2 col-xl-2">
                <a href="#" onclick="displayDetailPage('${product.id}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                </a>
            </div>
        </div>`;
    });
    const listingContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="${noImageUrl(subCat.image_url)}" alt="Online commerce courtesy xcart"/>
        </div>
        <h2>${subCat.name}</h2>
        <p>${getNoDescContent(subCat.description)}</p>
        <div class="row justify-content-center p-2">
            <div class="col-10">
                ${plpLines}
            </div>
        </div>
    `;
    currentPageId = "subCat";
    buildHash(id)
    rootContainer.innerHTML = listingContent;
};
