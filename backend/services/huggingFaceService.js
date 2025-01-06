const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.HUGGINGFACE_API_KEY;

async function callHuggingFace(promptContent) {
  try {
    console.log('Sending request to Hugging Face API...');

    // Make a POST request to the Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct',
      { inputs: promptContent },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    // Extract the generated text from the response
    console.log('Response received from Hugging Face:', response.data);
    const generatedText = response.data[0]?.generated_text || 'No response received.';
    return generatedText;

  } catch (error) {
    // Log the full error for debugging
    console.error('Error:', error.response ? error.response.data : error.message);
    return `An error occurred: ${error.message}`;
  }
}

module.exports = { callHuggingFace };
