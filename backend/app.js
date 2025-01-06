const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
require('dotenv').config();  // Ensure dotenv is loaded

const app = express();
const PORT = 3000;

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct';
const API_KEY = process.env.HUGGINGFACE_API_KEY;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "frontend")));

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


app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
