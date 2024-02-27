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
            displayMessage('Login successful: Welcome ' + data.Username);
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

        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Signup failed: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            displayMessage('Signup successful: Welcome ' + data.Username);
        })
        .catch(error => {
            displayMessage('Signup Error: ' + error.message, true);
        });
    });
});
