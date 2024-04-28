// Example starter JavaScript for disabling form submissions if there are invalid fields
const setupForm = () => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async ( event) => {
            if (!form.checkValidity()) {
                showToast("Form validation error", true);
                event.preventDefault();
                event.stopPropagation();
            } else {
                const profile = getProfile();
                const formJson = {};
                Array.from(form.elements).forEach(element => {
                    if (element.type === "button" || element.id === "") {}
                    else if (element.type === "checkbox") {
                        formJson[element.id] = element.checked;
                    } else {
                        if (element.id === "username") {
                            formJson[element.id] === profile.id;
                        } else {
                            formJson[element.id] = element.value;
                        }
                    }
                });
                fetch('/api/product', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formJson)
                }).then(response => {
                    if (!response.ok) {
                        showToast("Error when saving product - "  + response.statusText, true);
                    }
                    return response.json();
                }).then(data => {
                    showToast(data.message, false);
                    form.reset();
                }).catch(error => {
                    showToast("Error when saving product!", true);
                });
            };
            form.classList.add('was-validated');
            event.preventDefault();
            event.stopPropagation();
        }, false);
    });
};

const chooseSelect = () => {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Choose...";
    option.selected = true;
    option.disabled = true;
    return option;
};

const clearSelect = (select) => {
    select.innerHTML = "";
};

const showToast = (message, error) => {
    const toastContainer = document.createElement("div");
    const toastImg = error ? `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="firebrick" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>` : `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="green" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M313.4 32.9c26 5.2 42.9 30.5 37.7 56.5l-2.3 11.4c-5.3 26.7-15.1 52.1-28.8 75.2H464c26.5 0 48 21.5 48 48c0 18.5-10.5 34.6-25.9 42.6C497 275.4 504 288.9 504 304c0 23.4-16.8 42.9-38.9 47.1c4.4 7.3 6.9 15.8 6.9 24.9c0 21.3-13.9 39.4-33.1 45.6c.7 3.3 1.1 6.8 1.1 10.4c0 26.5-21.5 48-48 48H294.5c-19 0-37.5-5.6-53.3-16.1l-38.5-25.7C176 420.4 160 390.4 160 358.3V320 272 247.1c0-29.2 13.3-56.7 36-75l7.4-5.9c26.5-21.2 44.6-51 51.2-84.2l2.3-11.4c5.2-26 30.5-42.9 56.5-37.7zM32 192H96c17.7 0 32 14.3 32 32V448c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V224c0-17.7 14.3-32 32-32z"/></svg>`;
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
    toastContainer.innerHTML = 
    `<div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            ${toastImg}&nbsp;
            <strong class="me-auto">Save Product</strong>
            <small>now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">${message}</div>
    </div>`;
    rootContainer.appendChild(toastContainer);
    const toastLiveExample = document.getElementById('liveToast');
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
    toastBootstrap.show();
    setTimeout(() => {
        toastContainer.remove();
    }, "5000");
};

const loadSubcategories = async (catId) => {
    const subcategories = await fetchSubCategories(true, catId);
    const subcategoriesSelect = document.getElementById("subcategories");
    clearSelect(subcategoriesSelect);
    subcategoriesSelect.appendChild(chooseSelect());
    subcategories.forEach(subcat => {
        const option = document.createElement("option");
        option.value = subcat.id;
        option.textContent = subcat.name;
        subcategoriesSelect.appendChild(option);
    });
};

const sellerForm = () => {
    const profile = getProfile();
    const sellerContent = `
    <br/>
    <div class="container">
        <h1>Seller Form</h1>
        <form class="row mb-3 needs-validation" novalidate>
            <div class="mb-3 col-md-12">
                <label for="username">Username</label>
                <input type="text" class="form-control" id="username" value="${profile?.username}" required disabled>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-6">
                <label for="categories">Select a Category</label>
                <select class="form-select" id="categories" required onchange="loadSubcategories(this.value);">
                    <option selected disabled value="">Choose...</option>
                    ${categories.map(cat => 
                        `<option value="${cat.id}">${cat.name}</option>`
                    ).join("")}
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-6">
                <label for="subcategories">Select a Sub-category</label>
                <select class="form-select" id="subcategories" required>
                </select>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="productName">Product Name</label>
                <input type="text" class="form-control" id="productName" maxlength="255" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="productDescription">Product Description</label>
                <textarea class="form-control" id="productDescription" rows="3" maxlength="2000" required></textarea>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-3">
                <label for="price">Price</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" class="form-control" id="price" min="1" step=".01" aria-label="Product price" required>
                    <div class="valid-feedback">
                        Looks good!
                    </div>
                </div>
            </div>
            <div class="mb-3 col-md-3">
                <label for="ratingAverage">Initial Rating</label>
                <input type="number" class="form-control" id="ratingAverage" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-3">
                <label for="stock">Initial Stock</label>
                <input type="number" class="form-control" id="stock" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-3">
                <label class="form-check-label" for="image1">Featured Product</label>
                <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" role="switch" id="featured" >
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="image1">Image URL 1</label>
                <input type="url" class="form-control" id="image1" maxlength="665" data-bv-uri-message="Not a valid URL" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="image2">Image URL 2</label>
                <input type="url" class="form-control" id="image2" maxlength="665" data-bv-uri-message="Not a valid URL" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="image3">Image URL 3</label>
                <input type="url" class="form-control" id="image3" maxlength="665" data-bv-uri-message="Not a valid URL" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-12">
                <button id="btnSubmit" class="btn btn-primary" type="submit">Submit</button>
            </div>
        </form>
    </div>`;
    currentPageId = "seller";
    buildHash(true);
    rootContainer.innerHTML = sellerContent;
    setupForm();
};
