document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageBox = document.getElementById('messageBox');
    const logoutBtn = document.getElementById('logoutBtn');
    const authFormsContainer = document.getElementById('authForms');
    function checkLoggedIn() {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/userTokenInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            })
            .then(response => {
                if (!response.ok) {
                    authFormsContainer.style.display = 'block'; 
                    logoutBtn.style.display = 'none';
                }
                return response.json();
            })
            .then(data => {
                // User is logged in
                displayMessage('Do you want to logout, '+data.username+'?', false);
                authFormsContainer.style.display = 'none'; // Hide login/signup forms
                logoutBtn.style.display = 'block'; // Show logout button
            })
            .catch(error => {
                displayMessage('Token Error: ' + error.message, true);
                authFormsContainer.style.display = 'block';
                logoutBtn.style.display = 'none'; 
            });
        } else {
            // User is not logged in
            authFormsContainer.style.display = 'block';
            logoutBtn.style.display = 'none'; 
        }
    }
    checkLoggedIn();
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
            window.location.href = '/';
            let token = data.token;
            localStorage.setItem('token',token);
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
    logoutBtn.addEventListener('click', function(event) {
        event.preventDefault();
        localStorage.removeItem('token');
        window.location.href = '/';
    });
});
