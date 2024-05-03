// Get all elements with class="closebtn"
var close = document.getElementsByClassName("closebtn");
var i;

// Loop through all close buttons
for (i = 0; i < close.length; i++) {
  // When someone clicks on a close button
  close[i].onclick = function () {
    // Get the parent of <span class="closebtn"> (<div class="alert">)
    var div = this.parentElement;

    // Set the opacity of div to 0 (transparent)
    div.style.opacity = "0";

    // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
    setTimeout(function () {
      div.style.display = "none";
    }, 600);
  };
}

// Function to move item to "Save for Later"
async function moveItemToSavedForLater(productId) {
  const res = await fetch("/api/add_save_for_later", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + loginToken(),
    },
    body: JSON.stringify({ productID: productId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to move item to save for later");
  }

  displayCartItems();

  showToast("Item moved to Save for Later");
}

// Function to remove item from "Save for Later"
async function removeFromSavedForLater(productId) {
  const res = await fetch("/api/delete_save_for_later", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer " + loginToken(),
    },
    body: JSON.stringify({ productID: productId }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed to remove item from save for later"
    );
  }

  displayCartItems();

  showToast("Item removed from Save for Later");
}

// Function to handle checkout process
function checkout() {
  // Assuming some validation and processing before redirecting to checkout page
  // For demonstration purposes, let's just log a message
  console.log("Redirecting to checkout page...");
}

async function getCartItems() {
  const res = await fetch("/api/get_cart", {
    method: "GET",
    headers: {
      authorization: "Bearer " + loginToken(),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to get cart items");
  }
  console.log(data);

  return data;
}

const updateCartItemQuantity = async (productId, quantity) => {
  // make both buttons disabled while updating
  updateCheckoutButton(true);

  const element = document.getElementById(`increment-${productId}`);
  element.disabled = true;

  const decrementElement = document.getElementById(`decrement-${productId}`);
  decrementElement.disabled = true;

  try {
    const response = await fetch("/api/add_to_cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + loginToken(),
      },
      body: JSON.stringify({ productID: productId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart item quantity");
    }

    // Update the display of cart items
    displayCartItems();
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
  } finally {
    // re-enable buttons after updating
    element.disabled = false;
    decrementElement.disabled = false;

    updateCheckoutButton(false);
  }
};

const onCheck = async (event, productID) => {
  console.log("Checked", event.target.checked);

  updateCheckoutButton(true);

  if (event.target.checked) {
    await removeFromSavedForLater(productID);
  } else {
    await moveItemToSavedForLater(productID);
  }

  updateCheckoutButton(false);
};

// on save for later button click
const onSaveForLater = async (event, productID) => {
  console.log("Save for later clicked");

  updateCheckoutButton(true);

  await moveItemToSavedForLater(productID);

  updateCheckoutButton(false);
};

// on remove from cart button click
const onDeleteForLater = async (event, productID) => {
  console.log("Remove from cart clicked");

  updateCheckoutButton(true);

  await removeFromSavedForLater(productID);

  updateCheckoutButton(false);
};

function updateCheckoutButton(loading) {
  const button = document.getElementById("checkout-button");

  button.textContent = loading ? "Processing..." : "Proceed to Checkout";
}

// Sample function to display cart items in HTML
const displayCartItems = async () => {
  // Assuming there's an HTML element with id 'cart-items'
  const cartContainer = document.getElementById("cart-items");
  // Clear previous contents

  updateCheckoutButton(true);
  // Fetch cart items from the backend
  const cartItems = await getCartItems();

  // Loop through cart.items and generate HTML for each item
  cartContainer.innerHTML = `<h3 class="mb-8 mt-8">Cart Items</h3>`;

  // filter items thats are not saved for later
  const filteredItems = cartItems.products.filter(
    (item) => item.save_for_later === false
  );

  // filter save for later items
  const savedForLaterItems = cartItems.products.filter(
    (item) => item.save_for_later === true
  );

  filteredItems.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("mb-3");
    itemElement.innerHTML = `
      <div class="row g-0 mb-6" style="max-width: 500px; margin-top: 30px;">
        <div class="col-md-6 mr-6">
          <img src="${item.image_url}" alt="${
      item.name
    }" class="img-fluid" height="150" width="150">
        </div>
        <div class="col-md-6">
          <div class="card-body ml-3">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Price: $${item.price}</p>
            <div class="input-group mb-3">
              <button class="btn btn-outline-secondary" 
                id="decrement-${item.product_id}"
              type="button" onclick="updateCartItemQuantity('${
                item.product_id
              }', ${item.quantity - 1},
            )">-</button>
              <input type="text" class="form-control" style="width: 50px;" value="${
                item.quantity
              }" readonly>
              <button class="btn btn-outline-secondary" type="button"
                id="increment-${item.product_id}"
              onclick="updateCartItemQuantity('${item.product_id}', ${
      item.quantity + 1
    })">+</button>
            </div>
            <button class="btn btn-danger" onclick="updateCartItemQuantity('${
              item.product_id
            }', 0)">Remove</button>

            ${
              item.save_for_later
                ? `
              <button class="btn btn-primary" onclick="onDeleteForLater(event, '${item.product_id}')">Add to Cart</button>
            `
                : `

              <button class="btn btn-primary" onclick="onSaveForLater(event, '${item.product_id}')">Save for Later</button>

            `
            }
          </div>
        </div>
      </div>`;
    cartContainer.appendChild(itemElement);
  });

  cartContainer.innerHTML += `<h3 class="mt-8 mb-8" style="margin-top: 30px;">Saved for Later</h3>`;

  savedForLaterItems.forEach((item) => {
    const itemElement = document.createElement("div");
    itemElement.classList.add("mb-3");
    itemElement.innerHTML = `
      <div class="row g-0 mb-6" style="max-width: 500px; margin-top: 30px;">
        <div class="col-md-6 mr-6">
          <img src="${item.image_url}" alt="${
      item.name
    }" class="img-fluid" height="150" width="150">
        </div>
        <div class="col-md-6">
          <div class="card-body ml-3">
            <h5 class="card-title">${item.name}</h5>
            <p class="card-text">Price: $${item.price}</p>
            <div class="input-group mb-3">
              <button class="btn btn-outline-secondary" 
                id="decrement-${item.product_id}"
              type="button" onclick="updateCartItemQuantity('${
                item.product_id
              }', ${item.quantity - 1},
            )">-</button>
              <input type="text" class="form-control" style="width: 50px;" value="${
                item.quantity
              }" readonly>
              <button class="btn btn-outline-secondary" type="button"
                id="increment-${item.product_id}"
              onclick="updateCartItemQuantity('${item.product_id}', ${
      item.quantity + 1
    })">+</button>
            </div>
            <button class="btn btn-danger" onclick="updateCartItemQuantity('${
              item.product_id
            }', 0)">Remove</button>

            ${
              item.save_for_later
                ? `
              <button class="btn btn-primary" onclick="onDeleteForLater(event, '${item.product_id}')">Add to Cart</button>
            `
                : `

              <button class="btn btn-primary" onclick="onSaveForLater(event, '${item.product_id}')">Save for Later</button>

            `
            }
          </div>
        </div>
      </div>`;
    cartContainer.appendChild(itemElement);
  });

  const subtotalContainer = document.getElementById("subtotal");

  const heading = document.createElement("h4");
  heading.textContent = `Subtotal`;

  const totalPrice = document.createElement("p");
  totalPrice.textContent = `Total Price: $${cartItems.subtotal}`;

  const totalQuantity = document.createElement("p");
  totalQuantity.textContent = `Total Products: ${filteredItems.length}`;

  // add a checkable list of items
  const list = document.createElement("ul");
  list.classList.add("list-group");

  let listHtml = "";
  cartItems.products.forEach((item) => {
    listHtml += `<div class="form-check">
      <input class="form-check-input" type="checkbox" value={${
        item.save_for_later == false
      } ${
      item.save_for_later == false ? "checked" : ""
    } onchange="onCheck(event, '${item.product_id}')">
      <label class="form-check-label" for="flexCheckDefault">
        ${item.name.slice(0, 20)}${
      item.name.length > 20 ? "..." : ""
    } (Price: $${item.price}, Quantity: ${item.quantity})
      </label>
    </div>`;
  });

  list.innerHTML = listHtml;

  subtotalContainer.innerHTML = "";
  subtotalContainer.appendChild(heading);
  subtotalContainer.appendChild(totalPrice);
  subtotalContainer.appendChild(totalQuantity);
  subtotalContainer.appendChild(list);

  updateCheckoutButton(false);
};

displayCartItems();
