document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageBox = document.getElementById('messageBox');

    function displayMessage(message, isError = false) {
        messageBox.textContent = message;
        messageBox.style.color = isError ? 'red' : 'green';
        messageBox.style.display = 'block';
    }

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayMessage('Login successful: Welcome ' + data.username);
        })
        .catch(error => {
            displayMessage('Login Error: ' + error.message, true);
        });
    });

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('signupUsername').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const phone = document.getElementById('signupPhone').value;
        const isSellerBox = document.getElementById('signupIsSeller');
        const isSeller = isSellerBox.checked;

        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password, phone, isSeller }),
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error('Signup failed: ' + data.details);
                });
            }
            return response.json();
        })
        .then(data => {
            displayMessage('Signup successful: Welcome ' + username);
        })
        .catch(error => {
            displayMessage('Signup Error: ' + error.message, true);
        });
    });
});
