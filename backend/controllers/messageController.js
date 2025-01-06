const { callHuggingFace } = require("../services/huggingFaceService");

const handleMessage = async (req, res) => {
  const { content } = req.body;

  try {
    const response = await callHuggingFace(content);
    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { handleMessage };
