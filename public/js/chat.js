const cbListener = async () => {
    const cbReady = document.getElementById('cbReady');
    const cbClose = document.getElementById('cbClose');
    const cbPanel = document.getElementById('cbPanel');
    const cbInput = document.getElementById('cbInput');
    const cbMessages = document.getElementById('cbMessages');


    const cbTrigger = () => {
        const isDisplayed = cbPanel.style.display !== 'none';
        if (isDisplayed) {
            cbReady.classList.replace("d-none", "d-block");
            cbClose.classList.replace("d-block", "d-none");
        } else {
            cbClose.classList.replace("d-none", "d-block");
            cbReady.classList.replace("d-block", "d-none");
        };
        cbPanel.style.display = isDisplayed ? 'none' : 'block';
    };
    
    const displayMessage = (sender, message) => {
        const messageDiv = document.createElement('div');
        const prefix = sender === 'user' ? 'You: ' : 'Anzom ChatBot: ';
        messageDiv.textContent = prefix + message;
        messageDiv.className = sender === 'user' ? 'user-message' : 'chatbot-message';
        cbMessages.appendChild(messageDiv);
        cbMessages.scrollTop = cbMessages.scrollHeight;
    };

    const handleUserMessage = async (message) => {
        try {
            const apiResponse = await fetch('/api/chatbot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });
            const apiData = await apiResponse.json();
            displayMessage('chatbot', apiData.message);
        } catch (error) {
            console.error('Fetching response from server failed:', error);
            displayMessage('chatbot', 'Sorry, I am unable to fetch a response right now.');
        };
    };

    cbInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && cbInput.value.trim() !== '') {
            const userMessage = cbInput.value;
            displayMessage('user', userMessage);
            handleUserMessage(userMessage);
            cbInput.value = '';
        }
    });

    cbReady.addEventListener('click', cbTrigger);
    cbClose.addEventListener('click', cbTrigger);
};

const cbReadyIcon = `<svg id="cbReady" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-chat-text-fill cb-open d-block" viewBox="0 0 16 16">
    <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
</svg>`;
const cbCloseIcon = `<svg id="cbClose" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle-fill cb-close d-none" viewBox="0 0 16 16">
<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg>`;
const cbPanelHtml = `<div id="cbPanel" style="display: none;" class="cb-panel">
    <div id="cbMessages" class="cb-messages">
    </div>
    <input type="text" id="cbInput" placeholder="Ask me anything..." class="cb-input">
</div>`;
const cbContainer = document.getElementById("cbContainer");
cbContainer.innerHTML = cbReadyIcon + cbCloseIcon + cbPanelHtml;

document.addEventListener('DOMContentLoaded', cbListener);

