// product.js
const fetchProducts = async (isDetail, id) => {
    try {
      // Fetch categories from the backend API
      const response = await fetch(
        `/api/product?${isDetail ? "pid" : "scid"}=${id}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch sub-categories");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching and displaying sub-categories:", error);
    }
  };
  
  const buildProductDetail = (cid, scid, pid) => {
    const spin = document.getElementById(`spin${pid}`);
    spin.classList.remove("d-none");
    prepHash("cat", cid);
    prepHash("subCat", scid);
    currentPageId = "prod";
    buildHash(pid);
    displayDetailPage(pid);
  };
  
  const displayFeaturedProducts = async () => {
    try {
      // Fetch featured products from the backend API
      const response = await fetch("/api/featured-products");
      if (!response.ok) {
        throw new Error("Failed to fetch featured products");
      }
      const products = await response.json();
  
      // Generate HTML for each featured product
      const featuredProductHTML = products
        .map(
          (product) => `
              <section class="cardslot p-3" onclick="buildProductDetail('${
                product.cid
              }', '${product.scid}', '${product.id}')">
                  <div class="product">
                      <img style="width: 200px; height: 200px;" src="${noImageUrl(
                        product.image_url
                      )}" alt="${product.name}">
                      <h3>${product.name}</h3>
                      <p>${getNoDescContent(product.description)}</p>
                      <p>Price: $${product.price}</p>
                      <div id="spin${
                        product.id
                      }" class="spinner-grow d-none" role="status">
                          <span class="visually-hidden">Loading...</span>
                      </div>
                  </div>
              </section>
          `
        )
        .join("");
  
      // Insert the generated HTML into the container
      rootContainer.innerHTML = featuredProductHTML;
    } catch (error) {
      console.error("Error fetching and displaying featured products:", error);
    }
  };
  
  const displayRatings = (rating) => {
    let stars = "";
    if (rating) {
      const starImage = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="goldenrod" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>`;
      for (var i = 0; i < rating; i++) {
        stars += starImage;
      }
    }
    return stars;
  };
  
  const addToCart = async (productID) => {
    console.log("Adding item to cart");
    showToast("Adding item to cart")
  
    try {
      // Fetch the product details from the backend API
      const product = await fetchProducts(true, productID);
  
      // Check if the user is logged in
      if (!loginToken()) {
        showToast("Please log in to add items to your cart.");
        return;
      }
  
      // Check if the user is a seller
      if (getProfile().seller) {
        showToast("Sellers cannot add items to their own cart.");
        return;
      }
  
      // Check if the product is in stock
      if (product.stock_quantity <= 0) {
        showToast("This item is out of stock.");
        return;
      }
  
      // Add the product to the cart
      const response = await fetch("/api/add_to_cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${loginToken()}`,
        },
        body: JSON.stringify({
          productID,
          quantity: 1,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add item to cart");
      }
  
      // Display a notification
      showToast("Item added to cart!");
  
      // Update the cart count in the navbar
      // updateCartCount();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  
  const displayDetailPage = async (pid) => {
    const eye = document.getElementById(`eye${pid}`);
    const spin = document.getElementById(`spin${pid}`);
    if (eye) eye.classList.add("d-none");
    if (spin) spin.classList.remove("d-none");
    const product = await fetchProducts(true, pid);
    const addToCartEnabled =
      product.stock_quantity > 0 && loginToken() && !getProfile().seller;
    let imageUrls = product.image_url.split(",");
    let entry = 0;
  
    const detailContent = `
          <div class="row justify-content-md-center p-2">
              <div class="col-md-12 col-lg-4">
                  <div id="prodImages" class="carousel slide" data-bs-ride="carousel">
                      <div class="carousel-inner">
                          ${imageUrls.map((iurl) => {
                            let active = "";
                            if (entry === 0) {
                              entry = 1;
                              active = "active";
                            }
                            return `
                                  <div class="carousel-item ${active}">
                                      <img src="${iurl}" style="width: 600px; height: 600px;" alt="${product.name}"/>
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
                      ${
                        product.featured
                          ? "<span class='badge fs-6 text-bg-info'>FEATURED</span>"
                          : ""
                      }
                  </p>
                  <p>${displayRatings(product.average_review_score)}</p>
                  <p class="fs-4">$${product.price}</p>
                  <p class="fs-6">${product.description}</p>
                  ${
                    product.stock_quantity <= 0
                      ? "<p><span class='badge text-bg-danger'>OUT OF STOCK</span></p>"
                      : ""
                  }
                  ${
                    product.stock_quantity > 0 && product.stock_quantity <= 5
                      ? "<p><span class='badge text-bg-warning'>LOW STOCK</span></p>"
                      : ""
                  }
                  ${
                    product.stock_quantity > 5
                      ? "<p><span class='badge text-bg-success'>IN STOCK</span></p>"
                      : ""
                  }
                  <p>
                      <button type="button" class="btn btn-dark" ${
                        addToCartEnabled ? "" : "disabled"
                      }
                      onClick = "addToCart('${product.id}')"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z"/></svg>
                          Add to Cart
                      </button>&nbsp;&nbsp;
                      ${
                        addToCartEnabled
                          ? ""
                          : `<span data-bs-toggle="tooltip" data-bs-placement="right" data-bs-title="Add to cart disabled"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="goldenrod" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg></span>`
                      }
                  </p>
              </div>
          </div>
      `;
    currentPageId = "prod";
    buildHash(pid);
    rootContainer.innerHTML = detailContent;
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltipList = [...tooltipTriggerList].map(
      (tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
    );
  };
  
  const displayListingPage = async (id) => {
    const subCat = await fetchSubCategories(false, id);
    const products = await fetchProducts(false, id);
    if (!Array.isArray(products)) products = Array.of(products);
    let plpLines = "";
    products.forEach((product) => {
      let imageUrls = product.image_url.split(",");
      plpLines += `<div class="row p-2">
              <div class="col-md-4 col-xl-3"><img src="${noImageUrl(
                imageUrls[0]
              )}" style="width: 200px; height: 200px" alt="${
        product.name
      }"/></div>
              <div class="col-md-3 col-xl-4"><h4>${product.name}</h4></div>
              <div class="col-sm-6 col-md-3 col-xl-3">$${product.price}</div>
              <div class="col-sm-6 col-md-2 col-xl-2">
                  <span id="eye${
                    product.id
                  }" style="cursor: pointer" onclick="displayDetailPage('${
        product.id
      }')">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 576 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                  </span>
                  <div id="spin${
                    product.id
                  }" class="spinner-grow d-none" role="status">
                      <span class="visually-hidden">Loading...</span>
                  </div>
              </div>
          </div>`;
    });
    const listingContent = `
          <div class="row justify-content-md-center p-2">
              <img class="img-fluid" src="${noImageUrl(
                subCat.image_url
              )}" alt="Online commerce courtesy xcart"/>
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
    buildHash(id);
    rootContainer.innerHTML = listingContent;
  };
  