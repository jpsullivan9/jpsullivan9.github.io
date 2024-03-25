require("dotenv").config();
const apiKey = process.env.SECRET_KEY;
const stripe = require('stripe')(apiKey);
const domain  = 'https://rutgers-swe-project.vercel.app/';
const apiURL  = 'https://api.stripe.com/v1' ;
const openurl = require('openurl');

//const button = document.querySelector("button")

async function createProduct(){
    try {
        const response = await fetch(`${apiURL}/products`, {
            method : 'POST',
            headers: {

                'Authorization' : `Bearer ${apiKey}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
            body : 'name=coffee&type=service'
        });
        const product = await response.json();
        return product;
    }catch (err) {
        console.error('error creating product', err);
        throw err;
    }

}

async function addPrice(productID, amount){
    try{
        const response = await fetch(`${apiURL}/prices`, {
            method : "POST",
            headers : {
                'Authorization' : `Bearer ${apiKey}`,
                'Content-Type' : 'application/x-www-form-urlencoded',
            },
            body : `unit_amount=${amount}&product=${productID}&currency=usd`,

        });
        console.log(response);

        const price = await response.json();
        return price;
    }catch (err) {
        console.error('error adding price', err);
        throw err;
    }

}

async function createPaymentLink(priceID){
    try{
        const response = await fetch(`${apiURL}/checkout/sessions`, {
            method : 'POST',
            headers : {
                'Authorization' : `Bearer ${apiKey}`,
                'Content-Type' : 'application/x-www-form-urlencoded'
            },
            body : `mode=payment&payment_method_types[0]=card&success_url=https://google.com&cancel_url=${domain}/pages/checkout.html&line_items[0][price]=${priceID}&line_items[0][quantity]=1`
        });
        console.log(response);
        const session = await response.json();
        return session.url;
    } catch (err) {
        console.error('error making payment link', err);
        throw err;

    }

}
 //document.getElementById('enter-credit').onclick = async function(){
 ( async () =>{
    try {
        var product = await createProduct();
        console.log(product);
        const price = await addPrice(product.id, 1000);
        console.log(price);
        const paymentLink = await createPaymentLink(price.id);
        console.log(paymentLink);
    }catch (err) {
        console.error('error' , err);
    }
})();
//}
/*
document.getElementById('placeOrder-button').onclick = function(){
    const emailAddress= document.getElementById('emailAddress').value;

}
*/
const fetchCheckout = async(email, shippingAddress, productID) => {
try{
const response = await fetch('/api/checkout', {

    method : 'POST',
    headers : {'Content-Type' : 'application/json'},
    body : JSON.stringify([{'emailAddress' : 'sull@gmail.com'}, {'productId' : product.id}])

}).then(response => {
    if(!response.ok){
        throw new Error("Failure checking out");
    }
    return response.json();
})
} catch (err){ 
    displayMessage("error checking out");

}
};



