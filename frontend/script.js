const chatBody = document.getElementById('chat-body');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

let isChatbotTyping = false;
let typingIntervalId = null;
let typingIndicatorMessage = 'Typing';

function displayUserMessage(message) {
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerText = message;
    chatBody.appendChild(userMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayChatbotMessage(message) {
    if (isChatbotTyping) {
        // Remove the typing indicator when bot responds
        clearInterval(typingIntervalId);
        const typingIndicator = chatBody.querySelector('.typing-indicator');
        if (typingIndicator) {
            chatBody.removeChild(typingIndicator);
        }
        isChatbotTyping = false;
    } 

    const chatbotMessage = document.createElement('div');
    chatbotMessage.className = 'chatbot-message';
    chatbotMessage.innerText = message;
    chatBody.appendChild(chatbotMessage);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function displayTypingIndicator() {
    if (!isChatbotTyping) {
        // Create the typing indicator as a chatbot message
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'chatbot-message typing-indicator';
        typingIndicator.innerText = typingIndicatorMessage;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
        isChatbotTyping = true;

        // Start the interval to cycle the typing indicator message
        typingIntervalId = setInterval(() => {
            if (typingIndicatorMessage === 'Typing...') {
                typingIndicatorMessage = 'Typing';
            } else {
                typingIndicatorMessage += '.';
            }
            typingIndicator.innerText = typingIndicatorMessage;
        }, 400);
    }
}

async function sendMessage() {
    // Ignore empty messages
    const message = userInput.value.trim();
    if (message === '') {
        return;
    }
    displayUserMessage(message);

    userInput.value = '';

    try {
        // Display the typing indicator while waiting for the API's response
        displayTypingIndicator();

        const response = await fetch('https://conversai-backend-edf8cwfhfkeja2bd.westus-01.azurewebsites.net/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inputs: message }),
        });

        if (!response.ok) {
            console.log(response.status);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        const chatbotResponse = data.reply;
        displayChatbotMessage(chatbotResponse);
    } catch (error) {
        console.error('Error:', error);
    }
}


sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendMessage();
    }
});

displayChatbotMessage(`Hi, I'm a Chat Bot. What can I help you with today?`);
