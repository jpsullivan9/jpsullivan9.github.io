// category.js

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

const fetchSubCategories = async (isLanding, id) => {
    try {
        // Fetch categories from the backend API
        const response = await fetch(`/api/subcategories?${isLanding ? "catId" : "id"}=${id}`);
        if (!response.ok) {
            throw new Error("Failed to fetch sub-categories");
        }
        return await response.json();
    } catch (error) {
        console.error("Error fetching and displaying sub-categories:", error);
    }
};

const displayLandingPage = async (id) => {
    const cat = await fetchCategory(id);
    const subCats = await fetchSubCategories(true, cat.id);
    const landingContent = `
        <div class="row justify-content-md-center p-2">
            <img class="img-fluid" src="${noImageUrl(cat.image_url)}" alt="Online commerce courtesy xcart"/>
        </div>
        <h2>${cat.name}</h2>
        <p>${getNoDescContent(cat.description)}</p>
        <div class="row p-2">
            <div class="col-2"></div>
            <div class="col-8">
                <div class="row">${displayCategories(true, subCats)}</div>
            </div>
            <div class="col-2"></div>
        </div>
    `;
    currentPageId = "cat";
    buildHash(id)
    rootContainer.innerHTML = landingContent;
};

const loadPage = (isListing, cardId) => {
    const spin = document.getElementById(`spin${cardId}`);
    spin.classList.remove("d-none");
    if (isListing) {
        displayListingPage(cardId);
    } else {
        displayLandingPage(cardId);
    }
}; 

const displayCategories = (isListing, cardColl) => {
    if (!cardColl) return "";

    // Generate HTML for each featured product
    const catHtml = cardColl.map(card => `
        <div class="col-sm-6 col-md-6 col-lg-4 p-2">
            <div class="card cardslot" style="width: 15rem;" onclick="loadPage(${isListing}, '${card.id}');">
                <img src="${noImageUrl(card.image_url)}" class="card-img-top" alt="${card.name}"/>
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                    <p class="card-text">${getNoDescContent(card.description).substring(0, 50)}...</p>
                    <div id="spin${card.id}" class="spinner-grow d-none" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    return catHtml;
};

