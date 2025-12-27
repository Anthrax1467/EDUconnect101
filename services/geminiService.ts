import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly in functions as per SDK guidelines

export const generateAppStrategy = async (prompt: string) => {
  // Always initialize right before making the call to ensure the latest key is used.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    // Use gemini-3-pro-preview for complex reasoning tasks like application strategy.
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          targetAudience: { type: Type.STRING },
          features: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          techStack: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["name", "description", "targetAudience", "features", "techStack"]
      },
      systemInstruction: "You are an expert Silicon Valley product strategist and technical lead. Provide concise, high-impact advice for a new web application project."
    },
  });

  // Directly access the .text property of the GenerateContentResponse.
  return JSON.parse(response.text);
};

export const generateAppVisual = async (description: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A high-fidelity, professional web application dashboard UI for: ${description}. Dark mode, modern minimalist aesthetic, glassmorphism elements, clean typography. High resolution, 4k.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9"
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};