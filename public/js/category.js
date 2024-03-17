// category.js
let categories;
const fetchCategories = async () => {
    try {
        // Fetch categories from the backend API
        const response = await fetch('/api/category');
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        categories = await response.json();
    } catch (error) {
        console.error("Error fetching and displaying featured categories:", error);
    }
};

const displayCategories = () => {
    if (!categories) return "";

    // Generate HTML for each featured product
    const catHtml = categories.map(category => `
        <div class="col-sm-4 p-3">
            <div class="card" style="width: 18rem;">
                <img src="${category.image_url}" class="card-img-top" alt="${category.name}">
                <div class="card-body">
                    <h5 class="card-title">${category.name}</h5>
                    <p class="card-text">${category.description.substring(0, 50)}...</p>
                </div>
            </div>
        </div>
    `).join("");

    return catHtml;
};

