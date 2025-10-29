
import { GoogleGenAI, Modality } from "@google/genai";

// Assume API_KEY is set in the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will show an alert.
  // In a real production environment, the key should be securely managed.
  console.warn("API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const restorePhoto = async (base64ImageData: string, mimeType: string): Promise<string | null> => {
  try {
    const model = 'gemini-2.5-flash-image';
    const prompt = `Restore this old, damaged, vintage photo. Remove all scratches, tears, folds, and discoloration. Enhance the details, improve sharpness, and correct the colors to create a clean, clear, high-definition version of the original image. Do not add or remove any elements from the original scene. The output should be a photorealistic restoration.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    if (response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        return response.candidates[0].content.parts[0].inlineData.data;
    }
    
    return null;

  } catch (error) {
    console.error("Error restoring photo with Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`AI service failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI service.");
  }
};
