// product.js
const fetchProducts = async (isDetail, id) => {
    try {
        // Fetch categories from the backend API
        const response = await fetch(`/api/product?${isDetail ? "id" : "subCat"}=${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch sub-categories");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching and displaying sub-categories:", error);
    }
};

const displayListingPage = async (id) => {
    const subCat = await fetchSubCategories(false, id);
    let products = await fetchProducts(false, id);
    if (!Array.isArray(products)) products = Array.of(products);
    const homeContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="${subCat.image_url}" alt="Online commerce courtesy xcart"/>
        </div>
        <h2>${subCat.name}</h2>
        <p>${subCat?.description}</p>
        <div class="row p-2">
            <div class="col-2"></div>
            <div class="col-8">
                ${products.map(product => {
                    return (`
                    <div class="row">
                        <div class="col-3"><img src="${product.image_url}" class="card-img-top" alt="${product.name}"/></div>
                        <div class="col-6"><h4>${product.name}</h4></div>
                        <div class="col-3">$${product.price}</div>
                    </div>
                    `);
                })}
            </div>
            <div class="col-2"></div>
        </div>
    `;
    currentPageId = "subCat";
    buildHash(id)
    rootContainer.innerHTML = homeContent;
};
