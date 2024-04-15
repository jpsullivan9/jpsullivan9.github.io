document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const messageBox = document.getElementById('messageBox');
    const logoutBtn = document.getElementById('logoutBtn');
    const authFormsContainer = document.getElementById('authForms');
    const qrCodeContainer = document.getElementById('qrImage');



    //////////////////////////// ChatBot stuff(place in a DOMContentLoaded document listener) //////////////////////////////////////////
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const userMessage = chatInput.value;
            displayChatMessage('user', userMessage);
            handleUserMessage(userMessage);
            chatInput.value = '';
        }
    });

    function displayChatMessage(sender, message) {
        const messageDiv = document.createElement('div');
        const prefix = sender === 'user' ? 'You: ' : 'Anzom ChatBot: ';
        messageDiv.textContent = prefix + message;
        messageDiv.className = sender === 'user' ? 'user-message' : 'chatbot-message';
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function handleUserMessage(message) {
        try {
            const apiResponse = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            const apiData = await apiResponse.json();
            displayChatMessage('chatbot', apiData.message);
        } catch (error) {
            console.error('Fetching response from server failed:', error);
            displayChatMessage('chatbot', 'Sorry, I am unable to fetch a response right now.');
        }
    }
    /////////////////////////////////////////////////////////////////////////////

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
                    localStorage.removeItem('token');//clear bad token
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
                const userId = data.userId;
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
});
