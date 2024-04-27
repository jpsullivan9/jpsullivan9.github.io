// Example starter JavaScript for disabling form submissions if there are invalid fields
const setupForm = () => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', async ( event) => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            } else {
                const profile = JSON.parse(localStorage.getItem("profile"));
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
                        showToast("Error when saving product - "  + response.statusText);
                    }
                    return response.json();
                }).then(data => {
                    showToast(data.message);
                    form.reset();
                }).catch(error => {
                    showToast("Error when saving product!");
                });
            };
            form.classList.add('was-validated');
            event.preventDefault();
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

const showToast = (message) => {
    const toastContainer = document.createElement("div");
    toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
    toastContainer.innerHTML = 
    `<div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <img src="..." class="rounded me-2" alt="...">
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
    const profile = JSON.parse(localStorage.getItem("profile"));
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
                <input type="text" class="form-control" id="productName" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="productDescription">Product Description</label>
                <textarea class="form-control" id="productDescription" rows="3" required></textarea>
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
                <input type="text" class="form-control" id="image1" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="image2">Image URL 2</label>
                <input type="text" class="form-control" id="image2" required>
                <div class="valid-feedback">
                    Looks good!
                </div>
            </div>
            <div class="mb-3 col-md-12">
                <label for="image3">Image URL 3</label>
                <input type="text" class="form-control" id="image3" required>
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
    document.getElementById("btnSubmit").click();
};
