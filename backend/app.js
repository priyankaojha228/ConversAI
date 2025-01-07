const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require("dotenv").config(); // Ensure dotenv is loaded

const app = express();
const PORT = process.env.PORT || 3000;

const HUGGING_FACE_API_URL = "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct";
const API_KEY = process.env.HUGGINGFACE_API_KEY;

// Enable CORS to allow requests from your frontend's URL
app.use(
  cors({
    origin: "https://lemon-beach-0c68ff110.4.azurestaticapps.net", // Replace with your actual frontend URL
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { inputs } = req.body;

  try {
    const response = await axios.post(
      HUGGING_FACE_API_URL,
      { inputs },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
      }
    );

    // Extract the generated text
    let reply = response.data[0]?.generated_text || "No response received.";

    // Remove the user's input from the response (if it's included)
    if (reply.startsWith(inputs)) {
      reply = reply.replace(inputs, "").trim();
    }

    res.json({ reply });
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Failed to fetch response from Hugging Face API." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
