// category.js
let categories;
const fetchCategories = async () => {
    try {
        // Fetch categories from the backend API
        const response = await fetch("/api/category");
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        categories = await response.json();
    } catch (error) {
        console.error("Error fetching and displaying categories:", error);
    }
};

const fetchCategory = async (id) => {
    try {
        // Fetch categories from the backend API
        const response = await fetch(`/api/category/?id=${id}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch category for id: ${id}`);
        }
        category = await response.json();
        return category;
    } catch (error) {
        console.error("Error fetching category:", error);
    }
};

const fetchSubCategories = async (catId) => {
    try {
        // Fetch categories from the backend API
        const response = await fetch(`/api/subcategories?catId=${catId}`);
        if (!response.ok) {
            throw new Error("Failed to fetch sub-categories");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching and displaying sub-categories:", error);
    }
};

const displayCategoryLandingPage = async (id) => {
    const cat = await fetchCategory(id);
    const subCats = await fetchSubCategories(cat.id);
    const homeContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="${cat.image_url}" alt="Online commerce courtesy xcart"/>
        </div>
        <h2>${cat.name}</h2>
        <p>${cat.description}</p>
        <div class="row p-2">
            <div class="col-2"></div>
            <div class="col-8">
                <div class="row">${displayCategories(subCats)}</div>
            </div>
            <div class="col-2"></div>
        </div>
    `;
    rootContainer.innerHTML = homeContent;
};

const displayCategories = (cardColl) => {
    if (!cardColl) return "";

    // Generate HTML for each featured product
    const catHtml = cardColl.map(card => `
        <div class="col-sm-4 p-3">
            <div class="card" style="width: 18rem;" onclick="displayCategoryLandingPage('${card.id}');">
                <img src="${card.image_url}" class="card-img-top" alt="${card.name}">
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                    <p class="card-text">${card.description?.substring(0, 50)}...</p>
                </div>
            </div>
        </div>
    `).join("");

    return catHtml;
};

