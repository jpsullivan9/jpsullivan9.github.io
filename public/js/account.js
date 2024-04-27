document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageBox = document.getElementById('messageBox');
    const logoutBtn = document.getElementById('logoutBtn');
    const authFormsContainer = document.getElementById('authForms');
    const qrCodeContainer = document.getElementById('qrImage');

    const clearLoginData = () => {
        localStorage.removeItem("token");//clear bad token
        localStorage.removeItem("profile");
    };

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
                    //Token invalid
                    authFormsContainer.style.display = 'block'; 
                    logoutStuff.style.display = 'none';
                    clearLoginData();
                }
                return response.json();
            })
            .then(data => {
                // User is logged in
                displayMessage('Do you want to logout, '+data.username+'?', false);
                authFormsContainer.style.display = 'none'; // Hide login/signup forms
                logoutStuff.style.display = 'block'; // Show logout button

            })
            .catch(error => {
                //Error in reading token
                displayMessage('Token Error: ' + error.message, true);
                authFormsContainer.style.display = 'block';
                logoutStuff.style.display = 'none'; 
            });
        } else {
            // User is not logged in
            authFormsContainer.style.display = 'block';
            logoutStuff.style.display = 'none'; 
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
            if (data.is_2fa) {
                authFormsContainer.style.display = 'none';
                twofaLogin.style.display = 'block';
                localStorage.setItem("twoFaProfile", JSON.stringify(data.profile));
            } else {
            window.location.href = '/';
            localStorage.setItem('token', data.token);
            localStorage.setItem("profile", JSON.stringify(data.profile));
            }
        })
        .catch(error => {
            displayMessage('Login Error: ' + error.message, true);
        });
    });

    document.getElementById('twoFactorSubmitBtn').addEventListener('click', async()=> {
        const twoFaProfile = localStorage.getItem('twoFaProfile');
        const code = document.getElementById('twoFactorCode').value;
        fetch('/api/login2fa',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ twoFaProfile, code}),
        })
        .then(response =>{
            if (!response.ok) {
                throw new Error('Login failed: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            window.location.href = '/';
            localStorage.setItem('token', data.token);
            localStorage.setItem("profile", JSON.stringify(data.profile));
            localStorage.removeItem("twoFaProfile");
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
        clearLoginData();
        window.location.href = '/';
    });

    // Create QR code
    enable2FAButton.addEventListener('click', async () => {
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
                    throw new Error('Token verification failed');
                }
                return response.json();
            })
            .then(data => {
                const username = data.username;
                const userId = data.userID;
                fetch('/api/getQRCode', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({username, userId}),
                })
                .then(response => {
                     if (!response.ok) {
                        throw new Error(response.json().error);
                    }
                    return response.json();
            })
            .then(data => {
                const qrcode = data.image;
                qrCodeContainer.src = qrcode;
               
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
            
        })
            .catch(error => {
                console.error('Error:', error.message);
            });
        } else {
            console.error('No token found');
        }
    }); 

    // Set 2fa code
    document.getElementById('set').addEventListener('click', async()=> {
        const token = localStorage.getItem('token');
        if (token) {
            await fetch('/api/userTokenInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Token verification failed');
                }
                return response.json();
            })
            .then(data => {
                const key = document.getElementById('code').value;
                const userID = data.userID;
                fetch('/api/set2fa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({userID,key}),
                })
                .then(response => {
                     if (!response.ok) {
                        throw new Error(response.json().message);
                    }
                    return response.json();
                })
            .then(data => {
                displayMessage("2FA Enabled/Updated")
               
            })
            .catch(error => {
                displayMessage('Error:'+ error.message);
            });
            
            })
            .catch(error => {
                console.error('Error:', error.message);
            });
        } else {
            console.error('No token found');
        }
    }); 
});
