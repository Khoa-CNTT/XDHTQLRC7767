import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export const chatWithAI = async (message: string) => {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant for a movie ticket booking website. You can help users with information about movies, showtimes, booking process, and general inquiries about the cinema.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return {
      response:
        completion.data.choices[0]?.message?.content ||
        "I'm sorry, I couldn't process your request.",
    };
  } catch (error) {
    console.error("Error in chatWithAI:", error);
    throw error;
  }
};
