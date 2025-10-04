
import { GoogleGenAI } from "@google/genai";
import type { Car } from '../types';

if (!process.env.API_KEY) {
  // This is a placeholder check. In a real environment, the key is expected to be set.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const askAboutCar = async (car: Car, question: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "The AI assistant is currently unavailable. Please ensure the API key is configured.";
  }
  
  const carDetails = `
    - Make: ${car.make}
    - Model: ${car.model}
    - Year: ${car.year}
    - Price: ₦${car.price.toLocaleString()}
    - Mileage: ${car.mileage.toLocaleString()} miles
    - Fuel Type: ${car.fuelType}
    - Transmission: ${car.transmission}
    - Engine: ${car.engine}
    - Horsepower: ${car.horsepower}
    - Key Features: ${car.features.join(', ')}
    - Description: ${car.description}
  `;

  const prompt = `You are a helpful and knowledgeable car sales assistant. A customer is asking a question about a specific car. 
  Based on the following car details, provide a concise and helpful answer to their question. If the information is not provided, say you don't have that specific detail but offer a general answer if possible.

  Car Details:
  ${carDetails}

  Customer's Question: "${question}"

  Your Answer:
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
       config: { thinkingConfig: { thinkingBudget: 0 } }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    return "Sorry, I'm having trouble connecting to the AI assistant right now. Please try again later.";
  }
};
