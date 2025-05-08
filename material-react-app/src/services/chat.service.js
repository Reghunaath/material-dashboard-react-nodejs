import axios from "axios";

const chatWithBot = async (userMessage) => {
  const endpoint = "http://localhost:8000/chat";

  try {
    const response = await axios.post(endpoint, {
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });
    return response.data.response;
  } catch (error) {
    console.error("Chat API error:", error);
    return "Something went wrong. Please try again.";
  }
};

export default chatWithBot;
