document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const searchQuery = params.get('q');
    const minPrice = params.get('minPrice') || '';
    const maxPrice = params.get('maxPrice') || '';
    document.getElementById('minPrice').value = minPrice;
    document.getElementById('maxPrice').value = maxPrice;


    //////////////////////////// ChatBot stuff(place in a DOMContentLoaded document listener) //////////////////////////////////////////
    const chatbotTrigger = document.getElementById('chatbotTrigger');
    const chatbotPanel = document.getElementById('chatbotPanel');

    chatbotTrigger.addEventListener('click', () => {
        const isDisplayed = chatbotPanel.style.display !== 'none';
        chatbotPanel.style.display = isDisplayed ? 'none' : 'block';
        chatbotTrigger.textContent = isDisplayed ? 'Chat' : 'Close';
    });
    
    
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    chatInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && chatInput.value.trim() !== '') {
            const userMessage = chatInput.value;
            displayMessage('user', userMessage);
            handleUserMessage(userMessage);
            chatInput.value = '';
        }
    });

    function displayMessage(sender, message) {
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
            displayMessage('chatbot', apiData.message);
        } catch (error) {
            console.error('Fetching response from server failed:', error);
            displayMessage('chatbot', 'Sorry, I am unable to fetch a response right now.');
        }
    }
    /////////////////////////////////////////////////////////////////////////////


    const searchInput = document.getElementById('searchQuery');
    const suggestionsPanel = document.getElementById('suggestionsPanel');
    let timeout = null;

    searchInput.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const query = searchInput.value;
            if (query.length > 1) {
                fetchSuggestions(query);
            }
            else {
                suggestionsPanel.style.display = 'none';
            }
        }, 200);
    });
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length > 1) {
            suggestionsPanel.style.display = 'block';
        }
    });
    searchInput.addEventListener('blur', () => {
        setTimeout(() => { 
            suggestionsPanel.style.display = 'none';
        }, 200);
    });

    if (searchQuery) {
        document.getElementById('searchQuery').value = searchQuery;
        searchProducts(searchQuery, minPrice, maxPrice);
    }

    const searchForm = document.getElementById('searchForm');
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const query = document.getElementById('searchQuery').value;
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const minRating = document.getElementById('minRating').value;
        searchProducts(query, minPrice, maxPrice, minRating);
    });

    await fetchSellersAndPopulateDropdown();
});



async function fetchSuggestions(query) {
    const suggestionsPanel = document.getElementById('suggestionsPanel');
    try {
        const response = await fetch(`/api/search-suggestions?q=${encodeURIComponent(query)}`);
        const suggestions = await response.json();
        suggestionsPanel.innerHTML = '';
        suggestions.forEach(suggestion => {
            const div = document.createElement('div');
            div.textContent = suggestion;
            div.style.cursor = 'pointer';
            div.addEventListener('click', () => {
                document.getElementById('searchQuery').value = suggestion;
                suggestionsPanel.innerHTML = '';
                suggestionsPanel.style.display = 'none';

                const minPrice = document.getElementById('minPrice').value;
                const maxPrice = document.getElementById('maxPrice').value;
                const minRating = document.getElementById('minRating').value;
                searchProducts(suggestion, minPrice, maxPrice, minRating);

            });
            suggestionsPanel.appendChild(div);
        });
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        suggestionsPanel.style.display = 'none';
    }
}

function getSellerIds() {
    const sellerSelect = document.getElementById('sellerSelect');
    const selectedOptions = Array.from(sellerSelect.selectedOptions);
    return selectedOptions.map(option => option.value);
}

function searchProducts(query, minPrice = '', maxPrice = '', minRating = '') {
    const sellerSelect = document.getElementById('sellerSelect');
    const selectedSellerIds = Array.from(sellerSelect.selectedOptions).map(option => option.value).join(',');
    const queryParams = new URLSearchParams({
        q: query,
        minPrice,
        maxPrice,
        minRating,
        sellerIds: selectedSellerIds
    }).toString();
    fetch(`/api/search?${queryParams}`)
        .then(response => response.json())
        .then(data => {
            if (data.suggestions) {
                displaySuggestions(data.suggestions, query);
            } else {
                displaySearchResults(data);
            }
        })
        .catch(error => console.error('Error:', error));
}

function displaySearchResults(data) {
    const resultsContainer = document.getElementById('searchResults');
    
    if (data.message) {
        resultsContainer.innerHTML = `<div>${data.message}</div>`;
    } else if (data.error) {
        resultsContainer.textContent = data.error;
    } else if (data.length === 0) {
        resultsContainer.innerHTML = `<div>No products found. Try adjusting your search or filter settings.</div>`;
    } else {
        resultsContainer.innerHTML = data.map(product => `
            <div class="product" onclick="location.href='/pages/product.html?id=${product.id}'" style="cursor:pointer;">
                <br>
                <img src="${product.image_url}" alt="${product.name}" style="width:100px; height:100px; display:block; margin:auto;">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                ${product.average_review_score !== null ? `<p>Average Reviews: ${product.average_review_score}</p>` : ''}
            </div>
        `).join('');
    }
}

function displaySuggestions(suggestions, originalQuery) {
    const resultsContainer = document.getElementById('searchResults');
    if (suggestions.length > 0) {
        const topSuggestion = suggestions[0];
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        const suggestionSearchURL = `search.html?q=${encodeURIComponent(topSuggestion)}${minPrice ? '&minPrice=' + minPrice : ''}${maxPrice ? '&maxPrice=' + maxPrice : ''}`;
        resultsContainer.innerHTML = `<div>Did you mean: <a href="${suggestionSearchURL}">${topSuggestion}</a> instead of "${originalQuery}"?</div>`;
    } else {
        resultsContainer.innerHTML = `<div>No matches found for "${originalQuery}".</div>`;
    }
}

async function fetchSellersAndPopulateDropdown() {
    try {
        const response = await fetch('/api/sellers');
        const sellers = await response.json();
        const sellerSelect = document.getElementById('sellerSelect');
        sellers.forEach(seller => {
            const option = document.createElement('option');
            option.value = seller.user_id;
            option.textContent = seller.username;
            sellerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching sellers:', error);
    }
}




function fetchCategories(){
    fetch('/category.js')
    .then(response => response.json())
    .then(categories => {
        // Process categories data
    })
    .catch(error => {
        console.error('Error fetching categories:', error);
    });
}
  fetch(`your_api_endpoint?q=query&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${selectedCategory}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
