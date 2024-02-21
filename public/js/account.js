// WIP //
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

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
            console.log('Login successful:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login Error: ' + error.message);
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
            console.log('Signup successful:', data);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Signup Error: ' + error.message);
        });
    });
});
