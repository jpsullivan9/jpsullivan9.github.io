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

// Sample function to display cart items in HTML
function displayCartItems() {
  // Assuming there's an HTML element with id 'cart-items'
  const cartContainer = document.getElementById('cart-items');
  // Clear previous contents
  cartContainer.innerHTML = '';

  // Loop through cart.items and generate HTML for each item
  cart.items.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.innerHTML = `
      <p>${item.productName}</p>
      <p>Price: $${item.price}</p>
      <button onclick="removeFromCart('${item.productId}')">Remove</button>`;
    cartContainer.appendChild(itemElement);
  });
}

// Sample usage
cartItems.push({ productId: '1', name: 'Product 1', price: 10 });
cartItems.push({ productId: '2', name: 'Product 2', price: 20 });
savedForLater.push({ productId: '3', name: 'Product 3', price: 30 });

displayCartItems();



