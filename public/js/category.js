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

const loadMenu = () => {
    const catMenuItems = `
        <a class="dropdown-item" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z"/></svg>Categories &raquo;
        </a>
        <ul class="dropdown-menu dropdown-submenu">
            ${categories.map(cat => `
                <li>
                    <a class="dropdown-item" href="#" onclick="displayLandingPage('${cat.id}')">${cat.name}</a>
                </li>
            `).join("")}
        </ul>
    `;
    document.querySelector("#catMenu").innerHTML = catMenuItems;
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

const displayCategories = (isListing, cardColl) => {
    if (!cardColl) return "";

    // Generate HTML for each featured product
    const catHtml = cardColl.map(card => `
        <div class="col-sm-4 col-md-6 col-xl-3 p-2">
            <div class="card cardslot" style="width: 15rem;" onclick="${isListing ? "displayListingPage" : "displayLandingPage"}('${card.id}');">
                <img src="${noImageUrl(card.image_url)}" class="card-img-top" alt="${card.name}"/>
                <div class="card-body">
                    <h5 class="card-title">${card.name}</h5>
                    <p class="card-text">${getNoDescContent(card.description).substring(0, 50)}...</p>
                </div>
            </div>
        </div>
    `).join("");

    return catHtml;
};

