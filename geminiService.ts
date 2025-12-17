
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants.tsx";

export const getTutorResponse = async (
  lessonTitle: string,
  lessonContent: string,
  userMessage: string,
  history: { role: 'user' | 'model'; text: string }[]
) => {
  // Always create a new GoogleGenAI instance right before making an API call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const contents = [
    ...history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }]
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction: `${SYSTEM_PROMPT} \n\nТековна лекција: ${lessonTitle}. \nОпис на лекцијата: ${lessonContent}. \n\nЗапочни ја интеракцијата со прашање поврзано со лекцијата.`,
        temperature: 0.7,
      },
    });

    // Access the .text property directly (not a method) from GenerateContentResponse
    return response.text || "Извини, имав мал проблем со размислувањето. Може ли да повториш?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Се случи грешка при поврзување со твојот дигитален наставник. Провери ја интернет врската.";
  }
};
