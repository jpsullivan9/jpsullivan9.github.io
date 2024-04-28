document.addEventListener('DOMContentLoaded', function() {
  // Import the clearLoginData function
  const clearLoginData = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("coupon");
  };

  // Function to check if the user is logged in
  const checkLoggedIn = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Send token to server for validation
        const response = await fetch('../../api/userTokenInfo.js', { // make sure correct endpoint to verify token 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            // User is logged in, display the cart
            displayCart();
        } 
        else {
            // Token validation failed, prompt user to log in
            displayLoginSignupButtons();
        }
      } 
      catch (error) {
        console.error('Error validating token:', error);
        // Handle error, prompt user to log in
        displayLoginSignupButtons();
      }
    } 
    else {
    // No token found, prompt user to log in
    displayLoginSignupButtons();
    }
  };

  // Call checkLoggedIn function when the page loads
  checkLoggedIn();
});

// Get all elements with class="closebtn"
var close = document.getElementsByClassName("closebtn");
var i;

// Loop through all close buttons
for (i = 0; i < close.length; i++) 
{
  // When someone clicks on a close button
  close[i].onclick = function()
  {

    // Get the parent of <span class="closebtn"> (<div class="alert">)
    var div = this.parentElement;

    // Set the opacity of div to 0 (transparent)
    div.style.opacity = "0";

    // Hide the div after 600ms (the same amount of milliseconds it takes to fade out)
    setTimeout(function(){ div.style.display = "none"; }, 600);
  }
}

// Simulate unique cart ID for the user
const cartId = generateUniqueCartId(); // You'll need to implement this function

// Sample cart data structure
let cart = 
{
  cartId: cartId,
  userId: 'groupNum06', // will get from database
  createdTime: new Date(), // Store cart creation time
  items: [], // Array to store cart items
  savedForLater: [] // Array to store items saved for later
};

// Function to add item to cart
function addToCart(productId, quantity) 
{
  // Sample product data
  const product = 
  {
    productId: productId,
    productName: "Sample Product", // Replace with actual product name
    price: 10.99, // Replace with actual price
    quantity: quantity,

    // Add other product information
  };

  // Check if the product is already in the cart
  const existingItemIndex = cart.items.findIndex(item => item.productId === productId);

  if (existingItemIndex !== -1) 
  {
    // If the product already exists in the cart, update its quantity
    cart.items[existingItemIndex].quantity += quantity;
  } 
  else 
  {
    // If the product is not already in the cart, add it
    cart.items.push(product);
  }

  // Update the display of cart items
  displayCartItems();
}

// Function to update quantity of item in cart
function updateCartItemQuantity(productId, quantity) 
{
  // Find the index of the item in the cart array
  const itemIndex = cart.items.findIndex(item => item.productId === productId);

  // If the item is found in the cart
  if (itemIndex !== -1) 
  {
    // Update the quantity of the item
    cart.items[itemIndex].quantity = quantity;

    // If the quantity becomes 0 or negative, remove the item from the cart
    if (cart.items[itemIndex].quantity <= 0) 
    {
      cart.items.splice(itemIndex, 1);
    }

    // Update the display of cart items
    displayCartItems();
  } 
  else 
  {
    console.error("Item not found in cart.");
  }
}

// Function to remove item from cart
function removeFromCart(productId) 
{
  // Find the index of the item in the cart array
  const itemIndex = cart.items.findIndex(item => item.productId === productId);

  // If the item is found in the cart
  if (itemIndex !== -1) 
  {
    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Update the display of cart items
    displayCartItems();
  } 
  else 
  {
    console.error("Item not found in cart.");
  }
}

// Function to move item to "Save for Later"
function moveItemToSavedForLater(productId) 
{
  // Find the index of the item in the cart array
  const itemIndex = cart.items.findIndex(item => item.productId === productId);

  // If the item is found in the cart
  if (itemIndex !== -1) 
  {
    // Remove the item from the cart
    const movedItem = cart.items.splice(itemIndex, 1)[0];

    // Add the moved item to the "Save for Later" section
    cart.savedForLater.push(movedItem);

    // Update the display of cart items
    displayCartItems();
  } 
  else 
  {
    console.error("Item not found in cart.");
  }
}

// Function to remove item from "Save for Later"
function removeFromSavedForLater(productId) {
  cart.savedForLater = cart.savedForLater.filter(item => item.productId !== productId);
}

// Function to handle checkout process
function checkout() {
  // Assuming some validation and processing before redirecting to checkout page
  // For demonstration purposes, let's just log a message
  console.log("Redirecting to checkout page...");
}

// Sample function to generate unique cart ID
function generateUniqueCartId() {
  // Generate a unique identifier using current timestamp and a random number
  return 'cart' + Date.now() + '' + Math.floor(Math.random() * 1000);
}

// Function to display cart items in HTML
function displayCartItems() {
  // Assuming there's an HTML element with id 'cart-items'
  const cartContainer = document.getElementById('cart-items');
  // Clear previous contents
  cartContainer.innerHTML = '';

  // Get the alert container
  const alertContainer = document.getElementById('alert-container');
  // Clear previous alerts
  alertContainer.innerHTML = '';

  // Loop through cart.items and generate HTML for each item
  cart.items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <p>${item.productName}</p>
      <p>Price: $${item.price}</p>
      <button onclick="removeFromCart('${item.productId}')">Remove</button>`;

    // Check if the item is out of stock or low in stock
    if (item.quantity === 0) {
      const alertElement = document.createElement('div');
      alertElement.classList.add('alert');
      alertElement.innerHTML = `
        Product "${item.productName}" is out of stock!
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>`;
      alertContainer.appendChild(alertElement);
    } else if (item.quantity < LOW_STOCK_THRESHOLD) {
      const alertElement = document.createElement('div');
      alertElement.classList.add('alert');
      alertElement.innerHTML = `
        Product "${item.productName}" is low in stock!
        <span class="closebtn" onclick="this.parentElement.style.display='none';">&times;</span>`;
      alertContainer.appendChild(alertElement);
    }

    cartContainer.appendChild(itemElement);
  });
}


// Function to display login/signup buttons
function displayLoginSignupButtons() {

    const loginsignupButton = document.createElement('button');
    loginsignupButton.textContent = 'Log In/Sign Up';
    loginsignupButton.addEventListener('click', function() {
        window.location.href = 'account.html'; // Redirect to login page
    });
    const authFormsContainer = document.getElementById('authForms');
    authFormsContainer.appendChild(loginsignupButton);
}

displayCartItems();

// cart.js

// Function to fetch cart items and display them
async function fetchCartItems() {
  try {
      // Fetch cart items from server
      const response = await fetch('../../api/add_to_cart.js'); 
      if (response.ok) {
          const cartItems = await response.json();
          displayCartItems(cartItems); // Call function to display cart items
      } else {
          console.error('Failed to fetch cart items:', response.statusText);
      }
  } catch (error) {
      console.error('Error fetching cart items:', error);
  }
}

// Function to display cart items
function displayCartItems(cartItems) {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  cartItemsContainer.innerHTML = ''; // Clear previous contents

  // Loop through cart items and generate HTML for each item
  cartItems.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.innerHTML = `
          <p>${item.productName}</p>
          <p>Price: $${item.price}</p>
          <!-- Add more details as needed -->
      `;
      cartItemsContainer.appendChild(itemElement);
  });
}
